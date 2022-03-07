print("Duktape loading....");
load("lib/gen_wrap.js");

allocations={};

mem=new ArrayBuffer(1024*1024);
mem_u8=new Uint8Array(mem);

var off=0;

function align_16(x){
  if(x === (x & 0xfffffff0)){
    return x;
  } else {
    return 16+(x & 0xfffffff0);
  };
};

function js_malloc(p){
//  return libc.malloc(p);
//  print("js_malloc called:"+p);
  if(p===0){
//    print("zero size malloc");
    p=1;
  };
  if(off+p>mem_u8.length){
    print("js_malloc out of memory");
    exit(1);
  };
  var ptr=mem_ptr+off;
  off=align_16(off+p);
//  print(off.toString(16));
  return ptr;
};

function js_realloc(ptr,size){
//  return libc.realloc(ptr,size);
//  print("js_realloc called:"+ptr+" "+size);
  if(ptr===0){
    return my_malloc(size);
  };
  if(size===0){
//    print("realloc 0");
    my_free(ptr);
    return 0;
  };
  var old_size=allocations[ptr].size;
  if(off+size>mem_u8.length){
    print("js_realloc out of memory");
    exit(1);
  };
  var new_ptr=mem_ptr+off;
  var old_off=allocations[ptr].ptr-mem_ptr;
//  print("old:"+old_off.toString(16));
//  print("old size:"+old_size);
//  print("new size:"+size);
  for(var i=0;i<Math.min(old_size,size);i++){
    mem_u8[off+i]=mem_u8[old_off+i];
  };
  off=align_16(off+size);
//  print(off.toString(16));
  my_free(ptr);
  return new_ptr;
};

function js_free(ptr){
//  return libc.free(ptr);
//  print("js_free called");
  var offset=ptr-mem_ptr;
  if(ptr!==0){
//    print("freeing:"+allocations[ptr].size);
    for(var i=0;i<allocations[ptr].size;i++){
      mem_u8[offset+i]=0;
    };
  };
  return 0;
};


function my_malloc(p){
//  print("my_malloc called: "+p);
  var ptr=js_malloc(p);
  allocations[ptr]={ptr:ptr,size:p};
  return ptr;
};

var my_malloc_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t]);

var my_malloc_callback_handle = my_malloc_type.ptr(my_malloc);
var my_malloc_callback = ctypes.cast( my_malloc_callback_handle,ctypes.uint32_t).value;

print("my malloc:"+my_malloc_callback);

function my_realloc(ptr,size){
//  print("my_realloc called: "+ptr+" "+size);
  var new_ptr=js_realloc(ptr,size);
  if(allocations[ptr]){
    allocations[ptr].size=0;
  };
  allocations[new_ptr]={ptr:new_ptr,size:size};
  return new_ptr;
};

var my_realloc_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t,ctypes.uint32_t]);

var my_realloc_callback_handle = my_realloc_type.ptr(my_realloc);
var my_realloc_callback = ctypes.cast(my_realloc_callback_handle,ctypes.uint32_t).value;

print("my realloc:"+my_realloc_callback);

function my_free(ptr){
//  print("my_free called: "+ptr);
  js_free(ptr);
  if(allocations[ptr]){
    allocations[ptr].size=0;
  };
  return 0;
};

var my_free_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t]);

var my_free_callback_handle = my_free_type.ptr(my_free);
var my_free_callback = ctypes.cast(my_free_callback_handle,ctypes.uint32_t).value;

print("my free:"+my_free_callback);

duk_srcdir=test_path+"/duktape_src/";

duk_glue=mm.load_c_string(read(test_path+"/duk_glue.c"),{extra_flags:"-I "+duk_srcdir});
//quit();
duktape=mm.load_c_string(read(duk_srcdir+"duktape.c"),{extra_flags:"-I "+duk_srcdir});

libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));

dump_und=true;

passthrough={
//  "malloc": true,
  "memset": true,
  "memcpy": true,
//  "realloc": true,
  "memmove": true,
//  "free": true,
  "memcmp": true,
  "strlen": true,
  "_setjmp": true,
  "printf": true,
  "fabs": true,
  "floor": true,
  "fmod": true,
  "longjmp": true,
  "sin": true,
  "cos": true,
  "tan": true,
  "pow": true,
  "acos": true,
  "vsnprintf": true,
  "snprintf": true,
// note abort will get called for an unhandled exception
//  "abort": true,
  "asin": true,
  "acos": true,
  "atan": true,
  "ceil": true,
  "fopen": true,
  "fseek": true,
  "fclose": true,
  "fread": true,
  "ftell": true,
  "ferror": true,
  "strcmp": true,
};
exclude={
  "__ashldi3": true,
  "__ashrdi3": true,
  "__fixdfdi": true,
  "__fixunsdfdi": true,
  "__lshrdi3": true,
  "malloc": true,
  "realloc": true,
  "free": true,
}
overrides=[];

und=[];
for(var i=0;i<duktape.und.length;i++){
  var c=duktape.und[i].st_name;
  und.push(c);
  if(!exclude[c]){
    if(!passthrough[c]){
      d="ljw_crash_"+c;
    } else {
      d=c;
    };
    overrides.push([d,c]);
  };
};
und=und.sort();
var stubs_src=[];
stubs_src.push("ljw_stubs(){");
my_libc_src=[];
for(var i=0;i<und.length;i++){
  var s=und[i];
  if(!exclude[s]){
    stubs_src.push(s+"();");
    my_libc_src.push("ljw_crash_"+s+"(){printf(\"unimplemented: "+s+"\\n\");exit(1);}");
  };
};

stubs_src.push("ljw_malloc();");
stubs_src.push("ljw_realloc();");
stubs_src.push("ljw_free();");
overrides.push(["ljw_malloc","malloc"]);
overrides.push(["ljw_realloc","realloc"]);
overrides.push(["ljw_free","free"]);

my_libc_src.push("\n\
typedef void * (* my_malloc)(unsigned int m);\n\
void * ljw_malloc(unsigned int m){\n\
//  printf(\"called: ljw_malloc %u\\n\",m);\n\
  return ((my_malloc)"+my_malloc_callback+")(m);\n\
}");

my_libc_src.push("\n\
typedef void * (* my_realloc)(unsigned int ptr,unsigned int size);\n\
void * ljw_realloc(unsigned int ptr,unsigned int size){\n\
//  printf(\"called: ljw_realloc %u %u\\n\",ptr,size);\n\
  return ((my_realloc)"+my_realloc_callback+")(ptr,size);\n\
}");

my_libc_src.push("\n\
typedef unsigned int (* my_free)(unsigned int ptr);\n\
unsigned int ljw_free(unsigned int ptr){\n\
//  printf(\"called: ljw_free %u\\n\",ptr);\n\
  return ((my_free)"+my_free_callback+")(ptr);\n\
}");

my_libc_src= my_libc_src.join("\n");
stubs_src.push("}");
stubs_src=stubs_src.join("\n");

//  print("stubs:");
//  print(stubs_src);
stubs=mm.load_c_string(stubs_src);
//  print(JSON.stringify(overrides, null, " "));
//  print(my_libc_src);
my_libc=mm.load_c_string(my_libc_src);

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

duk=mm.link([duktape,duk_glue,my_wrap,libtcc1]);

exit=duk.get_fn("exit");
get_addr=duk.get_fn("my_get_address");
mem_ptr=get_addr(mem);

better_alloc=(function(m){
  var m_p=get_addr(m);
  var m_u8=new Uint8Array(m);
  blocks=new Uint8Array(m_u8.length>>>4);
  print("Memory: "+m_p);
  print("Memory size: "+m_u8.length);
  print("Memory blocks: "+blocks.length);
  chunks={};
  var off=0;
  function align_16(x){
    if(x === (x & 0xfffffff0)){
      return x;
    } else {
      return 16+(x & 0xfffffff0);
    };
  };
  function find_mem(size){
    var ptr=m_p+off;
    off=align_16(off+size);
    return ptr;
  };
  function malloc(size){
    if(size===0){
      size=1;
    };
    if(off+size>m_u8.length){
      print("malloc out of memory");
      exit(1);
    };
    var ptr=find_mem(size);
    chunks[ptr]={ptr:ptr,size:size};
    return ptr;
  };

  function realloc(ptr,size){
    if(ptr===0){
    return malloc(size);
    };
    if(size===0){
      my_free(ptr);
      return 0;
    };
    var old_size=chunks[ptr].size;
    if(off+size>m_u8.length){
      print("realloc out of memory");
      exit(1);
    };
    var new_ptr=malloc(size);
    var old_off=chunks[ptr].ptr-m_p;
    var new_off=chunks[new_ptr].ptr-m_p;
    for(var i=0;i<Math.min(old_size,size);i++){
      m_u8[new_off+i]=m_u8[old_off+i];
    };
    my_free(ptr);
    return new_ptr;
  };

  function free(ptr){
    var offset=ptr-m_p;
    if(ptr!==0){
      for(var i=0;i<chunks[ptr].size;i++){
        m_u8[offset+i]=0;
      };
    };
    return 0;
  };
  return {malloc:malloc,realloc:realloc,free:free};
})(mem);

js_malloc=better_alloc.malloc;
js_realloc=better_alloc.realloc;
js_free=better_alloc.free;

print("memory: "+mem_ptr);
print("Load complete!");
print();
dummy_main=duk.get_fn("dummy_main");


duk_dummy_run=duk.get_fn("dummy_wrap");

duk_run_raw=duk.get_fn("my_duk_run");
duk_run=function(s){
return duk_run_raw("try {"+s+"}catch(e){print(e)}")
};
init=duk.get_fn("init");
teardown=duk.get_fn("teardown");
init();

duk_run("print('hello world from duktape')");

//teardown();
//print(JSON.stringify(allocations));
function check_leak(){
  total_mem=0;
  for(i in allocations){
    if((m=allocations[i].size)!==0){
      print("Leak: "+JSON.stringify(allocations[i]));
    };
    total_mem=total_mem+m;
  };
  print("total mem leaked: "+total_mem);
};
a=new Uint32Array(100);
print(get_addr(a));
duk_run("print('hello again')");
duk_run(read(test_path+"/tests_intercept.js"));

load("lib/setup_sdl.js");
obj_code=mm.load_c_string(read(test_path+"/../sdl/simple_sdl.c"));
lib=mm.link([obj_code,libsdl.syms,mm.libc_compat]);

width=1024;
height=1024;

fb_r=new ArrayBuffer(width*height*4);
fb=new Uint8ClampedArray(fb_r);

function frame (){
  for(var i=0;i<mem_u8.length;i++){
    fb[i*4+1]=mem_u8[i];
  };
};
lib.get_fn("init_sdl")(width,height);

function update(){
frame();
libc.memcpy(lib.get_fn("get_framebuffer_sdl")(),fb,fb.length);
lib.get_fn("my_sdl_process_events")();
lib.get_fn("my_sdl_main")();
};
update();

duk_run("print('hello again2')");

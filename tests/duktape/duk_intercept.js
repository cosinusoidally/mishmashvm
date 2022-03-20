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

function my_realloc(ptr,size){
//  print("my_realloc called: "+ptr+" "+size);
  var new_ptr=js_realloc(ptr,size);
  if(allocations[ptr]){
    allocations[ptr].size=0;
  };
  allocations[new_ptr]={ptr:new_ptr,size:size};
  return new_ptr;
};

function my_free(ptr){
//  print("my_free called: "+ptr);
  js_free(ptr);
  if(allocations[ptr]){
    allocations[ptr].size=0;
  };
  return 0;
};

callbacks=[
  my_malloc,
  my_realloc,
  my_free
];

function callback_dispatch(f,a1,a2,a3,a4,a5,a6,a7){
  var fn=callbacks[f];
//  print(fn.name +" " +([a1,a2,a3,a4,a5,a6,a7].join(" ")));
  return fn(a1,a2,a3,a4,a5,a6,a7);
};

var callback_dispatch_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t]);

var callback_dispatch_handle = callback_dispatch_type.ptr(callback_dispatch);
var callback_dispatch_ptr = ctypes.cast(callback_dispatch_handle,ctypes.uint32_t).value;

print("callback dispatch:"+callback_dispatch_ptr);

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
typedef unsigned int (* my_callback)(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7);\n\
unsigned int ljw_callback_dispatch(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7){\n\
//  printf(\"called: callback %u\\n\",f);\n\
  __asm__(\"and $0xfffffff0,%esp\");\n\
  return ((my_callback)"+callback_dispatch_ptr+")(f,a1,a2,a3,a4,a5,a6,a7);\n\
}");

my_libc_src.push("\n\
typedef void * (* my_malloc)(unsigned int m);\n\
void * ljw_malloc(unsigned int m){\n\
//  printf(\"called: ljw_malloc %u\\n\",m);\n\
  return ljw_callback_dispatch(0,m,0,0,0,0,0,0);\n\
}");

my_libc_src.push("\n\
typedef void * (* my_realloc)(unsigned int ptr,unsigned int size);\n\
void * ljw_realloc(unsigned int ptr,unsigned int size){\n\
//  printf(\"called: ljw_realloc %u %u\\n\",ptr,size);\n\
  return ljw_callback_dispatch(1,ptr,size,0,0,0,0,0);\n\
}");

my_libc_src.push("\n\
typedef unsigned int (* my_free)(unsigned int ptr);\n\
unsigned int ljw_free(unsigned int ptr){\n\
//  printf(\"called: ljw_free %u\\n\",ptr);\n\
  return ljw_callback_dispatch(2,ptr,0,0,0,0,0,0);\n\
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

var bump_alloc;
var use_free_cache;
use_free_cache === undefined ? use_free_cache=true : use_free_cache=false;
better_alloc=(function(m){
  m_p=get_addr(m);
  m_u8=new Uint8Array(m);
  print("Memory: "+m_p);
  print("Memory size: "+m_u8.length);
  chunks={};
  off=0;
  free_cache={};
  free_cache_hit=0;
  free_cache_miss=0;
  mem_histogram={};
  function align_16(x){
    if(x === (x & 0xfffffff0)){
      return x;
    } else {
      return 16+(x & 0xfffffff0);
    };
  };
  function find_mem(size){
    if(bump_alloc){
      if(off+size>m_u8.length){
        print("out of memory bump alloc");
        exit(1);
      };
      var ptr=m_p+off;
      var space=align_16(size);
      mem_histogram[space] ? mem_histogram[space].count++ : mem_histogram[space]={count:1,max:1};
      mem_histogram[space].max=Math.max(mem_histogram[space].count,mem_histogram[space].max);
      off=align_16(off+size);
      return ptr;
    } else {
      var space=align_16(size);
      if(free_cache[space]){
         var ptr;
         if(ptr=free_cache[space].pop()){
           mem_histogram[space].count++;
           ptr=ptr.ptr;
           free_cache_hit++;
           return ptr;
         };
      };
      free_cache_miss++;
      free_cache={};
      var found=0;
      var op=m_p;
      var i=0;
      while(1){
        if(chunks[m_p+i]){
          var j=align_16(chunks[m_p+i].size);
          i=i+j;
          op=m_p+i;
        } else {
          i=i+16;
        };
        found=(m_p+i)-op;
        if(found>=size){
          mem_histogram[space] ? mem_histogram[space].count++ : mem_histogram[space]={count:1,max:1};
          mem_histogram[space].max=Math.max(mem_histogram[space].count,mem_histogram[space].max);
          return op;
        };
        if(i>=m_u8.length){break};
      };
      print("can't find enough memory");
      exit(1);
    };
  };
  function malloc(size){
    if(size===0){
      size=1;
    };
    var ptr=find_mem(size);
    chunks[ptr]={ptr:ptr,size:size,space:align_16(size)};
    return ptr;
  };

  function realloc(ptr,size){
    if(ptr===0){
    return malloc(size);
    };
    if(size===0){
      free(ptr);
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
    free(ptr);
    return new_ptr;
  };

  function free(ptr){
    var offset=ptr-m_p;
    if(ptr!==0){
      for(var i=0;i<chunks[ptr].size;i++){
        m_u8[offset+i]=0;
      };
    };
    if(chunks[ptr] && use_free_cache){
      var o=chunks[ptr];
//      print(JSON.stringify(o));
      if(!free_cache[o.space]){
        free_cache[o.space]=[];
      };
      free_cache[o.space].push(o);
      mem_histogram[o.space].count--;
    };
    delete chunks[ptr];
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
function test(){
  st=Date.now();
  duk_run(read(test_path+"/tests_intercept.js"));
  print("took: "+((Date.now()-st)/1000));
};
test();

var use_sdl;
use_sdl === undefined ? use_sdl=true : use_sdl=false;
if(use_sdl){
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
};
duk_run("print('hello again2')");

function warm_mem_cache(){
  p=[];
  mem_histogram2=JSON.parse(JSON.stringify(mem_histogram));
  for(var i in mem_histogram2){
    print("warming up: "+i+ " "+mem_histogram2[i].max);
    for(var j=0;j<mem_histogram2[i].max;j++){
      p.push(js_malloc(i));
      p.push(js_malloc(i));
    }
  };
  for(var i=0;i<p.length;i++){
    js_free(p[i]);
  }
};

function warm2(){
  teardown();
  off=0;
  bump_alloc=true;
  init();
  test();
  teardown();
  bump_alloc=false;
  init();
  update();
};

function hit_rate(){
  print(100*free_cache_hit/(free_cache_hit+free_cache_miss));
}

function perf(){
  free_cache_hit=0;
  free_cache_miss=0;
  test();
  hit_rate();
  update();
}

/*
(gdb) ptype /o duk_context
type = struct duk_hthread {
    0      |    40     duk_hobject obj;
   40      |     4     duk_instr_t **ptr_curr_pc;
   44      |     4     duk_heap *heap;
   48      |     1     duk_uint8_t strict;
   49      |     1     duk_uint8_t state;
   50      |     1     duk_uint8_t unused1;
   51      |     1     duk_uint8_t unused2;
   52      |     4     duk_tval *valstack;
   56      |     4     duk_tval *valstack_end;
   60      |     4     duk_tval *valstack_alloc_end;
   64      |     4     duk_tval *valstack_bottom;
   68      |     4     duk_tval *valstack_top;
   72      |     4     duk_activation *callstack_curr;
   76      |     4     duk_size_t callstack_top;
   80      |     4     duk_size_t callstack_preventcount;
   84      |     4     duk_hthread *resumer;
   88      |     4     duk_compiler_ctx *compile_ctx;
   92      |   204     duk_hobject *builtins[51];
  296      |     4     duk_hstring **strs;

                            total size (bytes):  300
                         }
*/

mem_u8=new Uint8Array(mem);
mem_u32=new Uint32Array(mem);

get_u8=function(x){
  x=x-m_p;
  if(x<0){throw "out of bounds low"};
  if(x>mem_u8.length-1){throw "out of bounds high"};
  return mem_u8[x];
};

get_u32=function(x){
  x=x-m_p;
  if(x<0){throw "out of bounds low"};
  if(x>mem_u8.length-1){throw "out of bounds high"};
  var y=(x>>>2)<<2;
  if(y!==x){throw "unaligned"};
  return mem_u32[x>>>2];
};

duk_heaphdr=function(x){
  return {
    $type: "duk_heaphdr",
    $size: 16,
//    0      |     4     duk_uint32_t h_flags;
    h_flags: get_u32(x),

//    4      |     4     duk_uint32_t h_refcount;
    h_refcount: get_u32(x+4),

//    8      |     4     duk_heaphdr *h_next;
    h_next: get_u32(x+8),

//   12      |     4     duk_heaphdr *h_prev;
    h_prev: get_u32(x+12),

  };
};

duk_hobject=function(x){
  return {
    $type: "duk_hobject",
    $size: 40,
//    0      |    16 duk_heaphdr hdr;
    hdr: duk_heaphdr(x),

//   16      |     4 duk_uint8_t *props;
    props: get_u32(x+16),

//   20      |     4 duk_hobject *prototype;
    prototype: get_u32(x+20),

//   24      |     4 duk_uint32_t e_size;
    e_size: get_u32(x+24),

//   28      |     4 duk_uint32_t e_next;
    e_next: get_u32(x+28),

//   32      |     4 duk_uint32_t a_size;
    a_size: get_u32(x+32),

//   36      |     4 duk_uint32_t h_size;
    h_size: get_u32(x+36),
};
}

duk_context=function(x){
  return {
    $type: "duk_hthread",
    $size: 300,
//    0      |    40     duk_hobject obj;
    obj: duk_hobject(x),

//   40      |     4     duk_instr_t **ptr_curr_pc;
    ptr_curr_pc: get_u32(x+40),

//   44      |     4     duk_heap *heap;
    duk_heap: get_u32(x+44),

//   48      |     1     duk_uint8_t strict;
    strict: get_u8(x+48),

//   49      |     1     duk_uint8_t state;
    state: get_u8(x+49),

//   50      |     1     duk_uint8_t unused1;
    unused1: get_u8(x+50),

//   51      |     1     duk_uint8_t unused2;
    unused2: get_u8(x+51),

//   52      |     4     duk_tval *valstack;
    valstack: get_u32(x+52),

//   56      |     4     duk_tval *valstack_end;
    valstack_end: get_u32(x+56),

//   60      |     4     duk_tval *valstack_alloc_end;
    valstack_alloc_end: get_u32(x+60),

//   64      |     4     duk_tval *valstack_bottom;
    valstack_bottom: get_u32(x+64),

//   68      |     4     duk_tval *valstack_top;
    valstack_top: get_u32(x+68),

//   72      |     4     duk_activation *callstack_curr;
    callstack_curr: get_u32(x+72),

//   76      |     4     duk_size_t callstack_top;
    callstack_top: get_u32(x+76),

//   80      |     4     duk_size_t callstack_preventcount;
    callstack_preventcount: get_u32(x+80),

//   84      |     4     duk_hthread *resumer;
    resumer: get_u32(x+84),

//   88      |     4     duk_compiler_ctx *compile_ctx;
    compile_ctx: get_u32(x+88),

//   92      |   204     duk_hobject *builtins[51];
    builtins: (function(x){
      var builtins=[];
      for(var i=0;i<51;i++){
        builtins.push(duk_hobject(get_u32(x+i*4)));
      };
      return builtins;
    }(x+92)),

//  296      |     4     duk_hstring **strs;
    strs: get_u32(x+296),
  };
};


get_ctx=duk.get_fn("my_get_ctx");

ctx=duk_context(get_ctx());

//print(JSON.stringify(ctx, null, ' '));

print("DUK_USE_HOBJECT_LAYOUT_"+duk.get_fn("get_layout")());

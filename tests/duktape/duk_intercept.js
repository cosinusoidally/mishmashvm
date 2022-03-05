print("Duktape loading....");
load("lib/gen_wrap.js");

function my_malloc(p){
  print("my_malloc called: "+p);
  return libc.malloc(p);
};

var my_malloc_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t]);

var my_malloc_callback = ctypes.cast(my_malloc_type.ptr(my_malloc),ctypes.uint32_t).value;

print("my malloc:"+my_malloc_callback);

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
void * ljw_realloc(unsigned int ptr,unsigned int size){\n\
  printf(\"called: ljw_realloc %u %u\\n\",ptr,size);\n\
  return realloc(ptr,size);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_free(unsigned int ptr){\n\
  printf(\"called: ljw_free %u\\n\",ptr);\n\
  return free(ptr);\n\
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

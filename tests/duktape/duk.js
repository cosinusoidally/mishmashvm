print("Duktape loading....");
load("lib/gen_wrap.js");

duk_srcdir=test_path+"/duktape_src/";

duk_glue=mm.load_c_string(read(test_path+"/duk_glue.c"),{extra_flags:"-I "+duk_srcdir});
//quit();
duktape=mm.load_c_string(read(duk_srcdir+"duktape.c"),{extra_flags:"-I "+duk_srcdir});

libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));

dump_und=true;

passthrough={
  "malloc": true,
  "memset": true,
  "memcpy": true,
  "realloc": true,
  "memmove": true,
  "free": true,
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
}
overrides=[];

if(dump_und=true){
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
  my_libc_src= my_libc_src.join("\n");
  stubs_src.push("}");
  stubs_src=stubs_src.join("\n");
//  print("stubs:");
//  print(stubs_src);
  stubs=mm.load_c_string(stubs_src);
//  print(JSON.stringify(overrides, null, " "));
//  print(my_libc_src);
  my_libc=mm.load_c_string(my_libc_src);
};

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

duk=mm.link([duktape,duk_glue,my_wrap,libtcc1]);

print("Load complete!");
print();
dummy_main=duk.get_fn("dummy_main");
dummy_main();

init=duk.get_fn("init");
teardown=duk.get_fn("teardown");
init();

duk_dummy_run=duk.get_fn("dummy_wrap");
duk_dummy_run();

s=read(test_path+"/tests.js");

duk_run_raw=duk.get_fn("my_duk_run");
duk_run=function(s){
return duk_run_raw("try {"+s+"}catch(e){print(e)}")
};

duk_run(s);

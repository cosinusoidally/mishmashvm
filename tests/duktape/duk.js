print("Duktape");
load("lib/gen_wrap.js");

duk_srcdir=test_path+"/duktape_src/";

duk_glue=mm.load_c_string(read(test_path+"/duk_glue.c"),{extra_flags:"-I "+duk_srcdir});
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
};
overrides=[];

if(dump_und=true){
  und=[];
  for(var i=0;i<duktape.und.length;i++){
    var c=duktape.und[i].st_name;
    und.push(c);
    if(!passthrough[c]){
      d="ljw_crash_"+c;
    } else {
      d=c;
    }
    overrides.push([d,c]);
  };
  und.push("printf");
  und.push("exit");
  und=und.sort();
  var stubs_src=[];
  stubs_src.push("ljw_stubs(){");
  my_libc_src=[];
  for(var i=0;i<und.length;i++){
    var s=und[i];
    stubs_src.push(s+"();");
    my_libc_src.push("ljw_crash_"+s+"(){printf(\"unimplemented: "+s+"\\n\");exit(1);}");
  };
  my_libc_src= my_libc_src.join("\n");
  stubs_src.push("}");
  stubs_src=stubs_src.join("\n");
  print("stubs:");
  print(stubs_src);
  stubs=mm.load_c_string(stubs_src);
  print(JSON.stringify(overrides, null, " "));
  print(my_libc_src);
  my_libc=mm.load_c_string(my_libc_src);
};

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

duk=mm.link([duktape,duk_glue,my_wrap,libtcc1]);

duk.get_fn("dummy_main")();

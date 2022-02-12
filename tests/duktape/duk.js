print("Duktape");

duk_srcdir=test_path+"/duktape_src/";

duk_glue=mm.load_c_string(read(test_path+"/duk_glue.c"),{extra_flags:"-I "+duk_srcdir});
duktape=mm.load_c_string(read(duk_srcdir+"duktape.c"),{extra_flags:"-I "+duk_srcdir});

dump_und=true;

if(dump_und=true){
  und=[];
  for(var i=0;i<duktape.und.length;i++){
    und.push(duktape.und[i].st_name);
  };
  und.push("printf");
  und.push("exit");
  und=und.sort();
  var stubs_src=[];
  stubs_src.push("ljw_stubs(){");
  for(var i=0;i<und.length;i++){
    stubs_src.push(und[i]+"();");
  };
  stubs_src.push("}");
  stubs_src=stubs_src.join("\n");
  print(stubs_src);
  stubs=mm.load_c_string(stubs_src);
};

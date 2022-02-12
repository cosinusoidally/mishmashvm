print("Duktape");

duk_srcdir=test_path+"/duktape_src/";

duk_glue=mm.load_c_string(read(test_path+"/duk_glue.c"),{extra_flags:"-I "+duk_srcdir});
duktape=mm.load_c_string(read(duk_srcdir+"duktape.c"),{extra_flags:"-I "+duk_srcdir});

dump_und=true;

if(dump_und=true){
  und=[];
  for(var i=0;i<duktape.und.length;i++){
    print(und.push(duktape.und[i].st_name));
  };
  und.push("printf");
  und.push("exit");
  print(JSON.stringify(und));
}

print("Duktape");

duk_srcdir=test_path+"/duktape_src/";

duk_glue=mm.load_c_string(read(test_path+"/duk_glue.c"),{extra_flags:"-I "+duk_srcdir});
duktape=mm.load_c_string(read(duk_srcdir+"duktape.c"),{extra_flags:"-I "+duk_srcdir});

dump_und=true;

passthrough={
//  "malloc": true,
//  "free": true
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
  for(var i=0;i<und.length;i++){
    stubs_src.push(und[i]+"();");
  };
  stubs_src.push("}");
  stubs_src=stubs_src.join("\n");
  print("stubs:");
  print(stubs_src);
  stubs=mm.load_c_string(stubs_src);
  print(JSON.stringify(overrides, null, " "));
};

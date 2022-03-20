print("virtual filesystem test");
load("lib/gen_wrap.js");

my_tcc=mm.decode_elf(read("libc_portable_proto/tcc_bin/tcc_boot3.o","binary"));

libtcc1=mm.decode_elf(read("libc_portable_proto/tcc_bin/libtcc1.o","binary"));

dump_und=true;

passthrough={
};

exclude={
}
overrides=[];

if(dump_und=true){
  und=[];
  for(var i=0;i<my_tcc.und.length;i++){
    var c=my_tcc.und[i].st_name;
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

tcc=mm.link([my_tcc,my_wrap,libtcc1]);

print("Load complete!");

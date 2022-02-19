print("tcc_win32 load");
load("lib/gen_wrap.js");
libtcc1=mm.decode_elf(read("libc_portable_proto/tcc_bin/libtcc1.o","binary"));

// need an absolute path (TODO work out the path)
tcc_win32_deps_path="/dev/shm/mishmashvm_tmp/win32/"
//tcc_win32_deps_path="/tmp/tcc/lib/tcc/win32/"

extra="-DTCC_TARGET_PE -DTCC_TARGET_I386 -DTCC_LIBTCC1=\"i386-win32-libtcc1.a\" -DCONFIG_TCCDIR=\""+tcc_win32_deps_path+"\" -O0 -Wdeclaration-after-statement -fno-strict-aliasing -Wno-pointer-sign -Wno-sign-compare -Wno-unused-result -Itcc_src";

print(extra);

tcc_win32_o=mm.load_c_string(read("tcc_src/tcc.c"),{"extra_flags": extra});

passthrough={
};

exclude={
};

overrides=[];

  und=[];
  for(var i=0;i<tcc_win32_o.und.length;i++){
    var c=tcc_win32_o.und[i].st_name;
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

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

tcc_win32=mm.link([tcc_win32_o,libtcc1,my_wrap]);

main=mm.arg_wrap(tcc_win32.get_fn("main"));

com="i386-win32-tcc -vv "+test_path+"/hello.c";
print(com);
main(com);

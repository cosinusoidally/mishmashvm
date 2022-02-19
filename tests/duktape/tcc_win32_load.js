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
  "malloc": true,
  "memset": true,
  "free": true,
  "strlen": true,
  "strcpy": true,
  "realloc": true,
  "memmove": true,
  "memcpy": true,
  "memcmp": true,
  "sscanf": true,
  "sprintf": true,
  "printf": true,
// might not want to keep getenv
  "getenv": true,
  "strchr": true,
  "strrchr": true,
  "strcmp": true,
// need to think about whether I need to avoid
  "open": true,
  "_setjmp": true,
  "read": true,
  "close": true,
  "snprintf": true,
  "lseek": true,
  "strtol": true,
  "strncmp": true,
  "dup": true,
  "fdopen": true,
  "fgets": true,
  "strncasecmp": true,
  "strcasecmp": true,
  "fclose": true,
  "fopen": true,
  "strncpy": true,
  "fwrite": true,
  "ftell": true,
  "fputc": true,
  "fseek": true,
// don't want this on windows
  "chmod": true,
  "vsnprintf": true,
  "fflush": true,
  "fprintf": true,
  "longjmp": true,
  "strtoull": true,
  "strtod": true,
  "unlink": true,
  "strstr": true,
  "fread": true,
  "remove": true,
};

exclude={
  "stdout": true,
  "stderr": true,
  "__ashldi3": true,
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

// hack to wire up stdout and stderr (which are file backed stderr.txt/stdout.txt)
libtcc1.exports.push(mm.libc_compat.imports["stdout"]);
libtcc1.exports.push(mm.libc_compat.imports["stderr"]);

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

tcc_win32=mm.link([tcc_win32_o,libtcc1,my_wrap]);

main=mm.arg_wrap(tcc_win32.get_fn("main"));

function build(com){
print(com);
main(com);
};
build("i386-win32-tcc -c tcc_src/lib/libtcc1.c -o "+mm.cfg.tmpdir+"/i386-win32-libtcc1.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/lib/alloca86.S -o "+mm.cfg.tmpdir+"/i386-win32-alloca86.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/lib/alloca86-bt.S -o "+mm.cfg.tmpdir+"/i386-win32-alloca86-bt.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/win32/lib/chkstk.S -o "+mm.cfg.tmpdir+"/i386-win32-chkstk.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/lib/bcheck.c -o "+mm.cfg.tmpdir+"/i386-win32-bcheck.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/win32/lib/crt1.c -o "+mm.cfg.tmpdir+"/i386-win32-crt1.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/win32/lib/crt1w.c -o "+mm.cfg.tmpdir+"/i386-win32-crt1w.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/win32/lib/wincrt1.c -o "+mm.cfg.tmpdir+"/i386-win32-wincrt1.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/win32/lib/wincrt1w.c -o "+mm.cfg.tmpdir+"/i386-win32-wincrt1w.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/win32/lib/dllcrt1.c -o "+mm.cfg.tmpdir+"/i386-win32-dllcrt1.o -Btcc_src/win32 -Itcc_src/include");
build("i386-win32-tcc -c tcc_src/win32/lib/dllmain.c -o "+mm.cfg.tmpdir+"/i386-win32-dllmain.o -Btcc_src/win32 -Itcc_src/include");

build("i386-win32-tcc -ar "+mm.cfg.tmpdir+"/win32/lib/i386-win32-libtcc1.a "+
(["i386-win32-libtcc1.o",
"i386-win32-alloca86.o",
"i386-win32-alloca86-bt.o",
"i386-win32-chkstk.o",
"i386-win32-bcheck.o",
"i386-win32-crt1.o",
"i386-win32-crt1w.o",
"i386-win32-wincrt1.o",
"i386-win32-wincrt1w.o",
"i386-win32-dllcrt1.o",
"i386-win32-dllmain.o"].map(function(x){
return mm.cfg.tmpdir+"/"+x;
}).join(" ")));
//../i386-win32-tcc -ar rcs ../i386-win32-libtcc1.a i386-win32-libtcc1.o i386-win32-alloca86.o i386-win32-alloca86-bt.o i386-win32-chkstk.o i386-win32-bcheck.o i386-win32-crt1.o i386-win32-crt1w.o i386-win32-wincrt1.o i386-win32-wincrt1w.o i386-win32-dllcrt1.o i386-win32-dllmain.o

build("i386-win32-tcc -vv "+test_path+"/hello.c");

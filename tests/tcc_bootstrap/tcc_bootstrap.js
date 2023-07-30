print("tcc bootstrap");
load("lib/gen_wrap.js");
libtcc1=mm.decode_elf(read("libc_portable_proto/tcc_bin/libtcc1.o","binary"));

libc.chdir("../tcc_bootstrap_alt/tcc_1_7/");

extra="-I .";

tcc_1_7_o=mm.load_c_string(read("dlsym_wrap.c"),{"extra_flags": extra});

passthrough={
  "puts": true,
  "realloc": true,
  "malloc": true,
  "memcpy": true,
  "strlen": true,
  "memset": true,
  "mmap": true,
  "printf": true,
  "fopen": true,
  "getc_unlocked": true,
  "memcpy": true,
  "memcmp": true,
  "strcpy": true,
  "strcat": true,
  "strdup": true,
  "fclose": true,
  "free": true,
  "memmove": true,
  "strrchr": true,
  "strcmp": true,
  "fprintf": true,
  "vfprintf": true,
  "exit": true,
  "strtod": true,
  "strtof": true,
  "strchr": true,
  "atoi": true,
  "open": true,
  "read": true,
  "close": true,
  "sprintf": true,
  "snprintf": true,
  "fdopen": true,
  "fwrite": true,
  "fputc": true,
  "ldexp": true,
};

exclude={
  "stdout": true,
  "stderr": true,
};

und=[];
overrides=[];

  for(var i=0;i<tcc_1_7_o.und.length;i++){
    var c=tcc_1_7_o.und[i].st_name;
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

tcc_1_7=mm.link([tcc_1_7_o,libtcc1,my_wrap]);

main=mm.arg_wrap(tcc_1_7.get_fn("main"));

function build(com){
print(com);
var r=main(com);
if(r!==0){
  throw "Build failure";
}
return r;
};

libc.chdir("../tcc_10/");
build("tcc ../tcc_1_7/dlsym_wrap.c ../tcc_1_7/tcc.c ../tcc_1_7/tcc.c ../tcc_1_8/tcc.c ../tcc_1_8/tcc.c ../tcc_1_8/tcc.c ../tcc_1_9/tcc.c ../tcc_1_9/tcc.c ../tcc_1_9/tcc.c ../tcc_2m/tcc.c ../tcc_2m/tcc.c ../tcc_2m/tcc.c ../tcc_2/tcc.c ../tcc_2/tcc.c ../tcc_2/tcc.c -DNO_LONG_LONG ../tcc_3/tcc.c -DNO_LONG_LONG ../tcc_3/tcc.c ../tcc_3/tcc.c ../tcc_3/tcc.c ../tcc_3/tcc.c tcc.c -o tcc.o -c tcc.c");

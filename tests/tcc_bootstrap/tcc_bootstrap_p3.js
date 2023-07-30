print("tcc bootstrap 0.9.23 to 0.9.24");
load("lib/gen_wrap.js");

libc.chdir("../tcc_bootstrap_alt/tcc_23/");

tcc_23_o=mm.decode_elf(read("tcc.o","binary"));


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
// possibly patch out use of this fn
  "strtold": true,
// FIXME remove use of setjmp
  "_setjmp": true,
  "strtoul": true,
};

exclude={
  "stdout": true,
  "stderr": true,
};

und=[];
overrides=[];

  for(var i=0;i<tcc_23_o.und.length;i++){
    var c=tcc_23_o.und[i].st_name;
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
tcc_23_o.exports.push(mm.libc_compat.imports["stdout"]);
tcc_23_o.exports.push(mm.libc_compat.imports["stderr"]);

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

tcc_23=mm.link([tcc_23_o,my_wrap]);

main=mm.arg_wrap(tcc_23.get_fn("main"));

function build(com){
print(com);
var r=main(com);
if(r!==0){
  throw "Build failure";
}
return r;
};

libc.chdir("../tcc_24/");
build("tcc -c libtcc1.c");
build("tcc -I ../woody/usr/include/ -I . -c tcc.c");

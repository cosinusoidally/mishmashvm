load("tcc_bootstrap_min_common.js");

print("tcc bootstrap 0.9.10 to 0.9.23");

libc.chdir("../../tcc_bootstrap_alt/tcc_10/");

tcc_10_o=mm.decode_elf(read("tcc.o","binary"));


passthrough={
  "puts": true,
  "realloc": true,
  "malloc": true,
  "memcpy": true,
  "strlen": true,
  "memset": true,
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
  "stdout": true,
  "stderr": true,
};

my_wrap={};

for(i in passthrough){
  print(i);
}

tcc_10=mm.link([tcc_10_o,my_wrap]);

main=mm.arg_wrap(tcc_10.get_fn("main"));

function build(com){
print(com);
var r=main(com);
if(r!==0){
  throw "Build failure";
}
return r;
};

libc.chdir("../tcc_23/");
build("tcc -DFOO -o tcc.o -c tcc.c");


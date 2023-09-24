load("../lib/setup_platform.js");
quit_orig=quit;
quit=function(){};
try {
  load("../lib/mishmashvm_lib.js");
} catch (e){
  //swallow errror
  print("swallowing error");
}
quit=quit_orig;
load("../lib/elf_loader.js");

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
// FIXME remove use of setjmp
  "_setjmp": true,
  "strtoul": true,
  "sscanf": true,
  "vsnprintf": true,
// FIXME get rid of this
  "unlink": true,
  "stdout": true,
  "stderr": true,
};

my_wrap={};
exports=[];
my_wrap.exports=exports;
my_wrap.relocate_all=function(){};

for(i in passthrough){
 a=ctypes.cast(
      libc.lib.declare(i,ctypes.default_abi,ctypes.uint32_t),
      ctypes.uint32_t
      ).value;
  print(i+" "+a);
  exports.push({st_name:i,address:a});
}

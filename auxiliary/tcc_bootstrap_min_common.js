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

override={
  "getc_unlocked": "fgetc",
  "strdup": "_strdup",
  "open": "_open",
  "read": "_read",
  "close": "_close",
  "snprintf": "_snprintf",
  "fdopen": "_fdopen",
  "vsnprintf": "_vsnprintf",
  "unlink": "_unlink"
};

my_wrap={};
exports=[];
my_wrap.exports=exports;
my_wrap.relocate_all=function(){};

if(plat === "win32"){
  delete passthrough.stdout;
  delete passthrough.stderr;
  // TODO add stdout and stderr symbols for win32
  my_fdopen=libc.lib.declare("_fdopen", ctypes.default_abi,ctypes.uint32_t,
                             ctypes.uint32_t, ctypes.char.ptr);
  exports.push({st_name: "stdout", address: my_fdopen(1,"wb")});
  exports.push({st_name: "stderr", address: my_fdopen(2,"wb")});
}

for(i in passthrough){
  if(plat === "win32"){
    if(override[i]){
      i=override[i];
    }
  };
  a=ctypes.cast(
       libc.lib.declare(i,ctypes.default_abi,ctypes.uint32_t),
       ctypes.uint32_t
       ).value;
  print(i+" "+a);
  exports.push({st_name:i,address:a});
}

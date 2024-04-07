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
  my_fdopen=libc.lib.declare("_fdopen", ctypes.default_abi,ctypes.uint32_t,
                             ctypes.uint32_t, ctypes.char.ptr);
  stdout_file=my_fdopen(1,"wb");
  stdout_ptr=libc.malloc(4);
  libc.memcpy(stdout_ptr,new Uint32Array([stdout_file]),4);
  exports.push({st_name: "stdout", address: stdout_ptr});

  stderr_file=my_fdopen(2,"wb");
  stderr_ptr=libc.malloc(4);
  libc.memcpy(stderr_ptr,new Uint32Array([stderr_file]),4);
  exports.push({st_name: "stderr", address: stderr_ptr});
}

for(i in passthrough){
  var i2=i;
  if(plat === "win32"){
    if(override[i]){
      i2=override[i];
    }
  };
  a=ctypes.cast(
       libc.lib.declare(i2,ctypes.default_abi,ctypes.uint32_t),
       ctypes.uint32_t
       ).value;
  print(i2+" "+a);
  exports.push({st_name:i,address:a});
}

if(plat === "win32"){
  callback_dispatch=function(a1,a2,a3,a4,a5,a6,a7){
    print("mmap: " +([a1,a2,a3,a4,a5,a6,a7].join(" ")));
    exit(1);
  }
  var callback_dispatch_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t]);

  var callback_dispatch_handle = callback_dispatch_type.ptr(callback_dispatch);
  var callback_dispatch_ptr = ctypes.cast(callback_dispatch_handle,ctypes.uint32_t).value;

  print("callback dispatch:"+callback_dispatch_ptr);
  win32_mmap=callback_dispatch_ptr;
}

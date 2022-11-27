print("Multitasking demo");

nspr={};

process={};

if(plat==="linux32"){
  print("loading linux nspr");
  nspr.lib=ctypes.open("libnspr4.so");
  process.execPath="js";
};

if(plat==="win32"){
  print("loading win32 nspr");
  nspr.lib=ctypes.open("nss3.dll");
  process.execPath="js.exe";
}

nspr.PR_CreateProcess=nspr.lib.declare("PR_CreateProcess",ctypes.default_abi,
                                   ctypes.uint32_t,
                                   ctypes.char.ptr,ctypes.voidptr_t,ctypes.uint32_t,ctypes.uint32_t);

try {
  libc={};
  libc.lib = ctypes.open("libc.so.6");

  libc.PROT_READ=1;
  libc.PROT_WRITE=2;
  libc.PROT_EXEC=4;
  libc.MAP_ANONYMOUS=32;
  libc.MAP_PRIVATE=2;

  // void *memcpy(void *dest, const void *src, size_t n);
  libc.memcpy= libc.lib.declare("memcpy",ctypes.default_abi,ctypes.uint32_t,ctypes.uint32_t, ctypes.voidptr_t,ctypes.uint32_t);

  // void *mmap(void *addr, size_t length, int prot, int flags,
  //                  int fd, off_t offset);
  libc.mmap=libc.lib.declare("mmap",ctypes.default_abi, ctypes.uint32_t,ctypes.voidptr_t,ctypes.uint32_t,ctypes.int,ctypes.int,ctypes.int,ctypes.uint32_t);
  libdl={};
  libdl.lib=ctypes.open("libdl.so.2");
  libdl.RTLD_LAZY=1;

  // void *dlopen(const char *filename, int flag);
  libdl.dlopen=libdl.lib.declare("dlopen",ctypes.default_abi,ctypes.voidptr_t,ctypes.char.ptr, ctypes.uint32_t);
  // void *dlsym(void *handle, const char *symbol);
  libdl.dlsym=libdl.lib.declare("dlsym",ctypes.default_abi,ctypes.uint32_t,ctypes.voidptr_t,ctypes.char.ptr);
  //libc2=libdl.dlopen("libc.so.6",libdl.RTLD_LAZY);
  //libdl2=libdl.dlopen("libdl.so.2",libdl.RTLD_LAZY);
  //libm=libdl.dlopen("libm.so.6",libdl.RTLD_LAZY);
  // void *malloc(size_t size);

  //  libc.malloc=libc.lib.declare("malloc",ctypes.default_abi, ctypes.uint32_t,ctypes.uint32_t);
  libc.malloc_fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
  libc.malloc=ctypes.cast(ctypes.voidptr_t(libdl.dlsym(ctypes.voidptr_t(0),"malloc")),libc.malloc_fntype.ptr);
  libc.chdir=libc.lib.declare("chdir",ctypes.default_abi, ctypes.uint32_t,ctypes.char.ptr);
  libm=ctypes.open("libm.so.6");
//  sdl=ctypes.open("libSDL.so");
  plat="linux32";
  print("Linux platform setup complete");
} catch(e) {
  try {
kernel32={};
kernel32.lib=ctypes.open("Kernel32.dll");

/*
LPVOID WINAPI VirtualAlloc(
  _In_opt_ LPVOID lpAddress,
  _In_     SIZE_T dwSize,
  _In_     DWORD  flAllocationType,
  _In_     DWORD  flProtect
 );
 */

kernel32.VirtualAlloc=kernel32.lib.declare("VirtualAlloc",ctypes.winapi_abi,ctypes.uint32_t,ctypes.voidptr_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t);
kernel32.MEM_COMMIT=0x00001000;
kernel32.PAGE_EXECUTE_READWRITE=0x40;


libc={};
libc.mmap=function(addr,length,prot,flags,fd,offset){
return kernel32.VirtualAlloc(ctypes.voidptr_t(0),length,kernel32.MEM_COMMIT,kernel32.PAGE_EXECUTE_READWRITE);
}
libc.lib=ctypes.open("msvcr120.dll");
  // void *memcpy(void *dest, const void *src, size_t n);
  libc.memcpy= libc.lib.declare("memcpy",ctypes.default_abi,ctypes.uint32_t,ctypes.uint32_t, ctypes.voidptr_t,ctypes.uint32_t);
 libc.malloc=libc.lib.declare("malloc",ctypes.default_abi, ctypes.uint32_t,ctypes.uint32_t);
// int chdir(const char *path);
libc.chdir=libc.lib.declare("_chdir",ctypes.default_abi, ctypes.uint32_t,ctypes.char.ptr);
  sdl=ctypes.open("SDL.dll");
plat="win32";
print("win32 setup complete");
  } catch(e) {
    print("unsupported platform");
    quit();
  }
}

// FILE *fopen(const char *pathname, const char *mode);
libc.fopen=libc.lib.declare("fopen",ctypes.default_abi, ctypes.uint32_t,ctypes.char.ptr,ctypes.char.ptr);
// size_t fwrite(const void *ptr, size_t size, size_t nmemb,
//                     FILE *stream);
libc.fwrite=libc.lib.declare("fwrite",ctypes.default_abi, ctypes.uint32_t,ctypes.voidptr_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t);

libc.fclose=libc.lib.declare("fclose",ctypes.default_abi, ctypes.uint32_t,ctypes.uint32_t);

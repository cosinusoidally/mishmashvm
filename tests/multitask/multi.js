print("Multitasking demo");

nspr={};

process={};

buf=new Uint8Array(4096);


buf_to_string=function(buf){

  var b=[];
  var i=0;
  while(buf[i]!==0){
    b.push(String.fromCharCode(buf[i]));
    i++;
  };
  return b.join("");
};

if(plat==="linux32"){
  print("loading linux nspr");
  nspr.lib=ctypes.open("libnspr4.so");
  libc.readlink=libc.lib.declare("readlink",ctypes.default_abi,
                                 ctypes.uint32_t,
                                 ctypes.char.ptr,ctypes.voidptr_t,ctypes.uint32_t);
  libc.readlink("/proc/self/exe",buf,buf.length);
  process.execPath=buf_to_string(buf);
};

if(plat==="win32"){
  print("loading win32 nspr");
  nspr.lib=ctypes.open("nss3.dll");
  kernel32.GetModuleFileNameA=kernel32.lib.declare("GetModuleFileNameA",
                                                        ctypes.default_abi,
                                                        ctypes.uint32_t,
                                                        ctypes.uint32_t,ctypes.voidptr_t,ctypes.uint32_t);
  kernel32.GetModuleFileNameA(0,buf,buf.length);
  process.execPath=buf_to_string(buf);
};

nspr.PR_CreateProcess=nspr.lib.declare("PR_CreateProcess",ctypes.default_abi,
                                   ctypes.uint32_t,
                                   ctypes.char.ptr,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t);

gen_argv=function(ar){
  // FIXME leaky
  ar=ar.split(" ");
  var l=4*(ar.length+1);
  var argv=libc.malloc(l);
  var t=new Uint8Array(l);
  libc.memcpy(argv,t,l);
  ar=ar.map(function(x){
    var ar2= x.split("").map(function(x){return x.charCodeAt(0)});
    ar2.push(0);
    ar2=new Uint8Array(ar2);
    var ar3=libc.malloc(ar2.length);
    libc.memcpy(ar3,ar2,ar2.length);
    return ar3;
  }) ;
  var ara=new Uint8Array(4*ar.length);
  var ara_o=0;
  for(var i=0;i<ar.length;i++){
    ara[ara_o++]=ar[i]&0xFF;
    ara[ara_o++]=(ar[i]>>>8)&0xFF;
    ara[ara_o++]=(ar[i]>>>16)&0xFF;
    ara[ara_o++]=(ar[i]>>>24)&0xFF;
  }
  libc.memcpy(argv,ara,ara.length);
  return argv;
}

print("exec: "+process.execPath);
nspr.PR_CreateProcess(process.execPath,gen_argv("js "+test_path+"/process1.js"),0,0);
nspr.PR_CreateProcess(process.execPath,gen_argv("js "+test_path+"/process2.js"),0,0);

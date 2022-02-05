print("Loading lib/tcc_loader.js");

(function(){
  var tcc_o=["libc_portable_proto/tcc_bin/tcc_boot3.o","libc_portable_proto/tcc_bin/libtcc1.o"];
  var libc_o=["libc_portable_proto/my_libc.o","libc_portable_proto/stubs.o"];
  try {
    tcc_o=tcc_o.map(function(x){
      print("loading: "+x);
      var o=read(x,"binary");
      return o;
    });
    libc_o=libc_o.map(function(x){
      print("loading: "+x);
      var o=read(x,"binary");
      return o;
    });
  } catch (e) {
    print("Unable to load tcc object code please bootstrap (see README)");
    quit();
  }
  tcc_o=tcc_o.map(mm.decode_elf);
  libc_o=libc_o.map(mm.decode_elf);
//  mm.tcc=[tcc_o,libc_o];


objs=libc_o;

obj2={};
obj2.relocate_all=function(){};
obj2.exports=[]

all_exports={};
objs.map(function(x){
var e=x.exports.map(function(y){;
all_exports[y.st_name]=y;
});
});
//print("the exports:");
//print(JSON.stringify(all_exports));
und=[];
//print("here");
objs.map(function(x){
  x.und.map(function(y){;
  if(!all_exports[y.st_name]){
    und.push(y);
  }
  });
});
//print(JSON.stringify(und));

/*
und.map(function(x){
var s={"st_name":x.st_name,"address": libdl.dlsym(ctypes.voidptr_t(0),x.st_name)};
if(s.address!==0){
obj2.exports.push(s);
}
});
*/

und.map(function(x){
var s={"st_name":x.st_name,"address": 0};
try {
//print(s.st_name);
s.address=ctypes.cast(
libc.lib.declare(s.st_name,ctypes.default_abi,ctypes.uint32_t),
ctypes.uint32_t
).value;
//print(s.address);
//print(ctypes.cast(s.address_fn,ctypes.uint32_t));
}
catch(e){
try {
//print(s.st_name);
s.address=ctypes.cast(
libc.lib.declare("_"+s.st_name,ctypes.default_abi,ctypes.uint32_t),
ctypes.uint32_t
).value;
//print(s.address);
//print(ctypes.cast(s.address_fn,ctypes.uint32_t));
}
catch(e2){
print("couldn't find: "+s.st_name);
}
}
if(s.address===0){
//s={"st_name":x.st_name,"address": libdl.dlsym(libsdl,x.st_name)};
};
if(s.address===0){
//s={"st_name":x.st_name,"address": libdl.dlsym(libgl,x.st_name)};
};
if(s.address===0){
print(JSON.stringify(s));
};
if(s.address!==0){
obj2.exports.push(s);
}
});




objs.push(obj2);

ex={};
objs.map(function(x){
  x.imports=ex;
  x.exports.map(function(y){
    ex[y.st_name]=y;
  });
});

objs.forEach(function(x){
  x.relocate_all();
});


ex2=ex;

obj3={};
obj3.relocate_all=function(){};
obj3.exports=[];
[
["ljw_crash___errno_location","__errno_location"],["ljw_crash_longjmp","longjmp"],["ljw_crash__setjmp","_setjmp"],["ljw_open","open"],["ljw_fopen","fopen"],["ljw_unlink","unlink"],["ljw_remove","remove"],["ljw_getcwd","getcwd"],["ljw_read","read"],["ljw_close","close"],["ljw_fdopen","fdopen"],["fclose","fclose"],["ljw_crash_fread","fread"],["fwrite","fwrite"],
["fflush","fflush"],
["fputc","fputc"],["ljw_crash_fputs","fputs"],["ljw_crash_fseek","fseek"],["ljw_crash_ftell","ftell"],
["fprintf","fprintf"],
["sscanf","sscanf"],["ljw_crash_lseek","lseek"],
["ljw_stderr","stderr"],
["ljw_stdout","stdout"],
["ljw_crash_dlopen","dlopen"],["ljw_crash_dlclose","dlclose"],["ljw_crash_dlsym","dlsym"],["ljw_execvp","execvp"],["exit","exit"],["ljw_getenv","getenv"],["ljw_malloc","malloc"],["memcmp","memcmp"],["memcpy","memcpy"],["memmove","memmove"],["memset","memset"],["ljw_realloc","realloc"],["ljw_free","free"],["ljw_mprotect","mprotect"],["printf","printf"],["snprintf","snprintf"],["sprintf","sprintf"],["ljw_crash_vfprintf","vfprintf"],
["vsnprintf","vsnprintf"],
["ljw_crash_sigaction","sigaction"],["ljw_crash_sigemptyset","sigemptyset"],["ljw_crash_strcat","strcat"],["strchr","strchr"],["strcmp","strcmp"],["strcpy","strcpy"],["strlen","strlen"],["ljw_crash_strncmp","strncmp"],["strrchr","strrchr"],["ljw_crash_strstr","strstr"],["strtod","strtod"],["ljw_crash_strtof","strtof"],["ljw_crash_strtol","strtol"],["ljw_crash_strtold","strtold"],["ljw_crash_strtoll","strtoll"],["ljw_crash_strtoul","strtoul"],
["strtoull","strtoull"],
["ljw_crash_time","time"],["ljw_crash_gettimeofday","gettimeofday"],["ljw_crash_localtime","localtime"],["ljw_crash_ldexp","ldexp"],["qsort","qsort"],["atoi","atoi"]

/*
["ljw_crash","__errno_location"],

["ljw_crash","longjmp"],
["ljw_crash","_setjmp"],

["ljw_open","open"],
["ljw_fopen","fopen"],
["ljw_unlink","unlink"],
["ljw_remove","remove"],
["ljw_getcwd","getcwd"],

["ljw_read","read"],
["ljw_close","close"],
["ljw_fdopen","fdopen"],
["fclose","fclose"],
["ljw_crash","fread"],
["fwrite","fwrite"],
["ljw_crash","fflush"],
["fputc","fputc"],
["ljw_crash","fputs"],
["ljw_crash","fseek"],
["ljw_crash","ftell"],
["ljw_crash","fprintf"],
["sscanf","sscanf"],
["ljw_crash","lseek"],

["ljw_stderr","stderr"],
["ljw_stdout","stdout"],

["ljw_crash","dlopen"],
["ljw_crash","dlclose"],
["ljw_crash","dlsym"],

["ljw_execvp","execvp"],
["exit","exit"],
["ljw_getenv","getenv"],

["ljw_malloc","malloc"],
["memcmp", "memcmp"],
["memcpy", "memcpy"],
["memmove", "memmove"],
["memset", "memset"],
["ljw_realloc","realloc"],
["ljw_free","free"],

["ljw_mprotect","mprotect"],

["printf", "printf"],
["snprintf","snprintf"],
["sprintf","sprintf"],
["ljw_crash","vfprintf"], // note this *is* a file thing but not called
["ljw_crash","vsnprintf"],

["ljw_crash","sigaction"],
["ljw_crash","sigemptyset"],

["ljw_crash","strcat"],
["strchr","strchr"],
["strcmp","strcmp"],
["strcpy","strcpy"],
["strlen","strlen"],
["ljw_crash","strncmp"],
["strrchr","strrchr"],
["ljw_crash","strstr"],
["strtod","strtod"],
["ljw_crash","strtof"],
["ljw_crash","strtol"],
["ljw_crash","strtold"],
["ljw_crash","strtoll"],
["ljw_crash","strtoul"],
["ljw_crash","strtoull"],

["ljw_crash","time"],
["ljw_crash","gettimeofday"],
["ljw_crash","localtime"],

["ljw_crash","ldexp"],
["qsort","qsort"],
["atoi","atoi"],

//["ljw_crash","__ashldi3"],
["ljw_crash","__fixunsxfdi"],
["ljw_crash","__floatundixf"],
//["ljw_crash","__lshrdi3"],
//["ljw_crash","__udivdi3"],
["ljw_crash","__umoddi3"],
*/
].map(function(x){
print(x);
var s;
s={st_name:x[1],address:ex2[x[0]].address};
obj3.exports.push(s);
});
mm.libc_compat=obj3;
ex={};
objs=tcc_o;

obj2={};
obj2.relocate_all=function(){};
obj2.exports=[]

all_exports={};
objs.map(function(x){
var e=x.exports.map(function(y){;
all_exports[y.st_name]=y;
});
});
//print("the exports:");
//print(JSON.stringify(all_exports));
und=[];
//print("here");
objs.map(function(x){
  x.und.map(function(y){;
  if(!all_exports[y.st_name]){
    und.push(y);
  }
  });
});
//print(JSON.stringify(und));

/*
und.map(function(x){
var s;
s={"st_name":x.st_name,"address": libdl.dlsym(ctypes.voidptr_t(0),x.st_name)};
if(s.address!==0){
obj2.exports.push(s);
}
});

objs.push(obj2);
*/

objs.push(obj3);

ex={};
objs.map(function(x){
  x.imports=ex;
  x.exports.map(function(y){
    ex[y.st_name]=y;
  });
});

objs.forEach(function(x){
  x.relocate_all();
});

f1={};
f1.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t,ctypes.uint32_t]);
f1.fn=ctypes.cast(ctypes.voidptr_t(ex2["ljw_setup2"].address),f1.fntype.ptr);
setup=f1.fn;

f1={};
f1.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t,ctypes.uint32_t]);
f1.fn=ctypes.cast(ctypes.voidptr_t(ex["main"].address),f1.fntype.ptr);
tcc=f1.fn;
function compile(ar){
if(typeof ar!=="string"){return "need string"};
ar="tcc -nostdinc -nostdlib -I ./includes/usr/include/:./includes/usr/include/i386-linux-gnu/:./includes/tmp/tcc/lib/tcc/include/ -c "+ar;
ar=ar.split(" ");
print(JSON.stringify(ar));
argv=libc.malloc(4*ar.length);
ar=ar.map(function(x){
var ar2= x.split("").map(function(x){return x.charCodeAt(0)});
ar2.push(0);
ar2=new Uint8Array(ar2);
var ar3=libc.malloc(ar2.length);
libc.memcpy(ar3,ar2,ar2.length);
return ar3;
}) ;
ara=new Uint8Array(4*ar.length);
ara_o=0;
for(var i=0;i<ar.length;i++){
ara[ara_o++]=ar[i]&0xFF;
ara[ara_o++]=(ar[i]>>>8)&0xFF;
ara[ara_o++]=(ar[i]>>>16)&0xFF;
ara[ara_o++]=(ar[i]>>>24)&0xFF;
}
libc.memcpy(argv,ara,ara.length);
print(JSON.stringify(ar));
tcc(ar.length,argv);
}


setup(0,0);
mm.compile=compile;
//compile();
})();

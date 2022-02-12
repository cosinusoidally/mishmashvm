mm.gen_wrap=function(libc_o,stubs_o,over){
print(libc_o);
print(stubs_o);
objs=[];
inp=[libc_o,stubs_o];
//print("running: "+inp[0]);

inp.map(function(x){
var obj=x;
objs.push(obj);
});
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
try {
//print(s.st_name);
s.address=ctypes.cast(
sdl.declare(s.st_name,ctypes.default_abi,ctypes.uint32_t),
ctypes.uint32_t
).value;
//print(s.address);
//print(ctypes.cast(s.address_fn,ctypes.uint32_t));
}
catch(e3){
try {
//print(s.st_name);
s.address=ctypes.cast(
libm.declare(s.st_name,ctypes.default_abi,ctypes.uint32_t),
ctypes.uint32_t
).value;
//print(s.address);
//print(ctypes.cast(s.address_fn,ctypes.uint32_t));
}
catch(e4){
print("couldn't find: "+s.st_name);
}
}
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

over.map(function(x){
print(x);
var s;
s={st_name:x[1],address:ex2[x[0]].address};
obj3.exports.push(s);
});
return obj3;
};

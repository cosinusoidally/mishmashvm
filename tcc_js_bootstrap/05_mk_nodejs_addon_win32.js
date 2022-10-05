load("tcc_em.js");
FS.mkdir("include");
FS.mkdir("include/node");
f={
  "bootstrap.c":"../tests/nodejs/bootstrap.c",
  "binding.c":"../tests/nodejs/binding.c",
  "binding_linux.c":"../tests/nodejs/binding_linux.c",
  "common.h":"../tests/nodejs/common.h",
  "binding.h":"../tests/nodejs/binding.h",
  "include/node/node_api.h":"../tests/nodejs/include/node/node_api.h",
  "include/node/node_api_types.h":"../tests/nodejs/include/node/node_api_types.h"
}
for(i in f){
  FS.writeFile(i, read(f[i]));
};
//args="-c bootstrap.c -I . -I include/node/ -o out.o"
args="-nostdinc -nostdlib -I /usr/include/:/usr/include/i386-linux-gnu/:/tmp/tcc/lib/tcc/include/ -c bootstrap.c -I . -I include/node/ -o out.o"
args=args.split(" ");
print(JSON.stringify(args));
Module.arguments=args;
obj_name="../tests/nodejs/lib/addon.o";
compile(obj_name);

mm={};
ctypes={};
ctypes.voidptr_t=function(){return 0};
libc.mmap=function(){
  print("mmap called");
  return 0;
}
libc.malloc=function(){
  print("malloc called");
  return 0;
}
libc.memcpy=function(){
  return 0;
}
load("../lib/elf_loader.js");

obj=mm.decode_elf(read(obj_name,"binary"));
print(JSON.stringify(obj.und,null,"  "));

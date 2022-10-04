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
args="-c bootstrap.c -I . -I include/node/ -o out.o"
args=args.split(" ");
print(JSON.stringify(args));
Module.arguments=args;
compile("../tests/nodejs/lib/addon_linux.o");

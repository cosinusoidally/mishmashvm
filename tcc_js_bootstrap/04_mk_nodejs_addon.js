args="-c stub.c -I . -I include/node/ -o out.o"
args=args.split(" ");
print(JSON.stringify(args));
load("tcc_em.js");
FS.mkdir("include");
FS.mkdir("include/node");
f={
  "stub.c":"../tests/nodejs/stub.c"
}
for(i in f){
  FS.writeFile(i, read(f[i]));
};
Module.arguments=args;
compile("../tests/nodejs/lib/stub.o");

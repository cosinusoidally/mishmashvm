args="-c stubs.c -O0 -o out.o"
args=args.split(" ");
print(JSON.stringify(args));
load("tcc_em.js");
FS.writeFile("stubs.c", read("../libc_portable_proto/stubs.c"));
Module.arguments=args;
compile("../libc_portable_proto/stubs.o");

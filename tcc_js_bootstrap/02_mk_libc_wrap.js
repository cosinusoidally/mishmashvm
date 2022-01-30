args="-c my_libc.c -O0 -o out.o"
args=args.split(" ");
print(JSON.stringify(args));
load("tcc_em.js");
FS.writeFile("my_libc.c", read("../libc_portable_proto/my_libc.c"));
Module.arguments=args;
compile("../libc_portable_proto/my_libc.o");

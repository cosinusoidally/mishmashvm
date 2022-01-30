args="-c tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -O0 -I tcc_src/ -o out.o"
args=args.split(" ");
print(JSON.stringify(args));
load("tcc_em.js");
Module.arguments=args;
compile("../libc_portable_proto/tcc_bin/tcc_boot3.o");

args="-nostdlib -nostdinc -c tcc_bootstrap.c -o out.o";
args=args.split(" ");
print(JSON.stringify(args));
load("../../tcc_js_port/a.out.js");
load("js_cc_proto.js");
FS.writeFile("/tcc_bootstrap.c", read("../tcc_js_bootstrap/alt_bootstrap/tcc_bootstrap.c"));
Module.arguments=args;
compile("../libc_portable_proto/tcc_bin/tcc_boot3.o");

args="-nostdlib -nostdinc -c tcc_bootstrap.c -o out.o";
args=args.split(" ");
print(JSON.stringify(args));
load("../tcc_js_bootstrap/tcc_em.js");
FS.writeFile("/tcc_bootstrap.c", read("../tcc_js_bootstrap/alt_bootstrap/tcc_bootstrap.c"));
Module.arguments=args;
compile("../tcc_js_bootstrap/tcc_bin/tcc_boot3.o");

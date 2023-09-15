args="-nostdinc -nostdlib -c libtcc1_bootstrap_min.c -o out.o";
args=args.split(" ");
print(JSON.stringify(args));
load("../tcc_js_bootstrap/tcc_em.js");
FS.writeFile("/libtcc1_bootstrap_min.c", read("../tcc_js_bootstrap/alt_bootstrap/libtcc1_bootstrap_min.c"));
Module.arguments=args;
compile("../tcc_js_bootstrap/libtcc1.o");

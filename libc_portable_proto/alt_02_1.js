load("runner.js");
inp=["tcc_bin/tcc_boot3.o", "tcc_bin/libtcc1.o"];
ar="tcc -DBOOTSTRAP_MODE=1 -nostdinc -nostdlib -c ../tcc_js_bootstrap/tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -I ../tcc_js_bootstrap/tcc_src/ -I ../includes/tmp/tcc/lib/tcc/include/ -I ../includes/usr/include/i386-linux-gnu/  -I ../includes/usr/include/ -o tcc_bin/tcc_boot3.o.new";
go();

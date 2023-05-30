load("runner.js");
inp=["tcc_bin/tcc_boot3.o", "tcc_bin/libtcc1.o"];
ar="tcc -nostdinc -nostdlib -c ../tcc_js_bootstrap/alt_bootstrap/tcc_bootstrap.c -o tcc_bin/tcc_boot3.o.new";
go();

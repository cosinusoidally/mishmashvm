load("runner.js");
inp=["tcc_bin/tcc_boot3.o"];
ar="tcc -nostdinc -nostdlib -c ../tcc_js_bootstrap/alt_bootstrap/libtcc1_bootstrap_min.c -o tcc_bin/libtcc1.o";
go();

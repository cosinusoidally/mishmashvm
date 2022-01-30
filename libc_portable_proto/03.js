load("runner.js");
inp=["tcc_bin/tcc_boot3.o", "tcc_bin/libtcc1.o"];
ar="tcc -nostdinc -nostdlib -c ../tcc_src/lib/libtcc1.c -o tcc_bin/libtcc1.o.new";
go();

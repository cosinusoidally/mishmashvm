load("runner.js");
inp=["tcc_bin/tcc_boot3.o", "tcc_bin/libtcc1.o"];
ar="tcc -nostdinc -nostdlib -o my_libc.o.new -c my_libc.c -g -O0 -I ../includes/usr/include/:../includes/usr/include/i386-linux-gnu/:../includes/tmp/tcc/lib/tcc/include/";
go();

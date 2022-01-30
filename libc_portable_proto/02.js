load("runner.js");
inp=["tcc_bin/tcc_boot3.o", "tcc_bin/libtcc1.o"];
ar="tcc -nostdinc -nostdlib -o tcc_bin/tcc_boot3.o.new -c ../tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -O0 -I ../tcc_src/:../includes/usr/include/:../includes/usr/include/i386-linux-gnu/:../includes/tmp/tcc/lib/tcc/include/";
go();

common="tcc -nostdinc -nostdlib -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -g -O0 -I tcc-0.9.27/:../includes/usr/include/:../includes/usr/include/i386-linux-gnu/:../includes/tmp/tcc/lib/tcc/include/:jsmpeg_demo/ ";
load("runner.js");
inp=["tcc_bin/tcc_boot3.o", "tcc_bin/libtcc1.o"];
ar=common+"-c jsmpeg_demo/mp2.c -o jsmpeg_demo/mp2.o"
go();

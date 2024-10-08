cd ../../tcc_bootstrap_alt
./mk_otccelf
pushd .
cd otccelf/tcc_wrap
export PATH=$PWD:$PATH
cd ../artifacts/
export PATH=$PWD:$PATH
popd

cd ../mishmashvm/libc_portable_proto
./bootstrap_clean.sh
tcc_wrap -nostdinc -nostdlib -o tcc_bin/tcc_boot3.o -c ../tcc_src/tcc.c -D__linux__ -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -I ../tcc_src/:../includes/usr/include/:../includes/usr/include/i386-linux-gnu/:../includes/tmp/tcc/lib/tcc/include/
tcc_wrap -nostdinc -nostdlib -o my_libc.o -c my_libc.c -O0 -I ../includes/usr/include/:../includes/usr/include/i386-linux-gnu/:../includes/tmp/tcc/lib/tcc/include/
tcc_wrap -nostdinc -nostdlib -o stubs.o -c stubs.c -O0 -I ../includes/usr/include/:../includes/usr/include/i386-linux-gnu/:../includes/tmp/tcc/lib/tcc/include/

cd ../auxiliary

# make duktape

./mk_duk_otccelf

cd ../artifacts
export PATH=$PWD:$PATH

cd ../libc_portable_proto

./bootstrap_tcc.sh

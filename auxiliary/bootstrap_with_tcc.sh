INCS="-I ../includes/tmp/tcc/lib/tcc/include/ -I ../includes/usr/include/i386-linux-gnu/  -I ../includes/usr/include/"

./bootstrap_cleanup_tcc.sh

cd ../tcc_js_bootstrap

set -e
tcc_bootstrap.exe -nostdinc -nostdlib -c tcc_src/lib/libtcc1.c -o libtcc1.o
tcc_bootstrap.exe -nostdlib ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o libtcc1.o ../../linux_lib_bin/libc_nonshared.a ./alt_bootstrap/tcc_bootstrap.c -o tcc_linux.exe -L ../../linux_lib_bin/ -lc -lm -ldl
chmod +x tcc_linux.exe

echo "build tcc_boot3.o"

./tcc_linux.exe -nostdinc -nostdlib -c tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -O0 -I tcc_src/ ${INCS} -o out.o

# belt and braces, regen tcc_linux.exe using the newly generated out.o
rm tcc_linux.exe
tcc_bootstrap.exe -nostdlib ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o libtcc1.o ../../linux_lib_bin/libc_nonshared.a out.o -o tcc_linux.exe -L ../../linux_lib_bin/ -lc -lm -ldl
chmod +x tcc_linux.exe

mv out.o ../libc_portable_proto/tcc_bin/tcc_boot3.o

echo "building my_libc.o"
./tcc_linux.exe -nostdinc -nostdlib -c ../libc_portable_proto/my_libc.c ${INCS} -O0 -o out.o
mv out.o ../libc_portable_proto/my_libc.o

echo "building stubs.o"
./tcc_linux.exe -nostdlib -nostdinc -c ../libc_portable_proto/stubs.c -O0 -o out.o
mv out.o ../libc_portable_proto/stubs.o

echo "build nodejs addon"
./tcc_linux.exe -v -nostdlib -nostdinc -I ../includes/usr/include/:../includes/usr/include/i386-linux-gnu/:../includes/tmp/tcc/lib/tcc/include/:../tests/nodejs/:../tests/nodejs/include/node/ -c ../tests/nodejs/bootstrap.c -o ../tests/nodejs/lib/addon.o
./tcc_linux.exe -nostdlib  ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o -shared ../tests/nodejs/lib/addon.o -o ../tests/nodejs/lib/addon_linux.node

echo "running second stage boostrap"
cd ../libc_portable_proto

./bootstrap_tcc.sh
sha256sum -c ../auxiliary/checksums.sha256sums

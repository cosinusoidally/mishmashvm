INCS="-I ../includes/tmp/tcc/lib/tcc/include/ -I ../includes/usr/include/i386-linux-gnu/  -I ../includes/usr/include/"

cd ../libc_portable_proto
./bootstrap_clean.sh

cd ../tcc_js_bootstrap
echo "build tcc_linux.exe"
rm tcc_linux.exe
set -e
tcc_bootstrap.exe -nostdlib ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o ../../linux_lib_bin/libtcc1.o ../../linux_lib_bin/libc_nonshared.a ../../tcc_bootstrap/tcc_bootstrap.c -o tcc_linux.exe -L ../../linux_lib_bin/ -lc -lm -ldl
chmod +x tcc_linux.exe

echo "build tcc_boot3.o"

./tcc_linux.exe -nostdinc -nostdlib -c tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -O0 -I tcc_src/ ${INCS} -o out.o

# the following shouldn't be necessary, but can be useful for testing
#rm tcc_linux.exe
#gcc out.o -o tcc_linux.exe -lm -ldl

mv out.o ../libc_portable_proto/tcc_bin/tcc_boot3.o

echo "building my_libc.o"
./tcc_linux.exe -nostdinc -nostdlib -c ../libc_portable_proto/my_libc.c ${INCS} -O0 -o out.o
mv out.o ../libc_portable_proto/my_libc.o

echo "building stubs.o"
./tcc_linux.exe -nostdlib -nostdinc -c ../libc_portable_proto/stubs.c -O0 -o out.o
mv out.o ../libc_portable_proto/stubs.o

echo "running second stage boostrap"
cd ../libc_portable_proto

./bootstrap_tcc.sh

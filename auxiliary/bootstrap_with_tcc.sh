INCS="-I ../includes/tmp/tcc/lib/tcc/include/ -I ../includes/usr/include/i386-linux-gnu/  -I ../includes/usr/include/"

./bootstrap_cleanup_tcc.sh

cd ../tcc_js_bootstrap

set -e
tcc_bootstrap.exe -nostdinc -nostdlib -c tcc_src/lib/libtcc1.c -o libtcc1.o
tcc_bootstrap.exe -nostdlib ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o libtcc1.o ../../linux_lib_bin/libc_nonshared.a ./alt_bootstrap/tcc_bootstrap.c -o tcc_linux.exe -L ../../linux_lib_bin/ -lc -lm -ldl
chmod +x tcc_linux.exe

echo "build tcc_boot3.o"

# Do a 3 stage bootstrap using tcc_bootstrap.c .
# Note for now we use the prebuilt tcc_bootstrap.exe for the linking phase
# since there are currently some issues with the linking phase in tcc_bootstrap.c

LINK_CMD=" -nostdlib ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o libtcc1.o ../../linux_lib_bin/libc_nonshared.a out.o -o tcc_linux.exe -L ../../linux_lib_bin/ -lc -lm -ldl"

PHASE1_ARGS="-DBOOTSTRAP_MODE=1 -nostdinc -nostdlib -c ./alt_bootstrap/tcc_bootstrap.c -o out.o"

PHASE2_1_ARGS="-DBOOTSTRAP_MODE=1 -nostdinc -nostdlib -c tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -O0 -I tcc_src/ ${INCS} -o out.o"

PHASE2_2_ARGS="-nostdinc -nostdlib -c tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -O0 -I tcc_src/ ${INCS} -o out.o"

./tcc_linux.exe ${PHASE1_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

./tcc_linux.exe ${PHASE1_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

./tcc_linux.exe ${PHASE1_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe

# this is just to stop the self hosted building of libtcc1_bootstrap.o
# from regressing further
./tcc_linux.exe -nostdinc -nostdlib -c alt_bootstrap/libtcc1_bootstrap.c -o libtcc1_bootstrap.o
# need to build asm with tcc_bootstrap.exe (still broken atm)
tcc_bootstrap.exe -c alt_bootstrap/libtcc1_bootstrap_asm.c libtcc1_bootstrap_asm.o
# uncomment to test libtcc1_bootstrap.o as libtcc1.o
# broken atm
#LINK_CMD=" -nostdlib ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o libtcc1_bootstrap_asm.o libtcc1_bootstrap.o ../../linux_lib_bin/libc_nonshared.a out.o -o tcc_linux.exe -L ../../linux_lib_bin/ -lc -lm -ldl"

# phase 2

./tcc_linux.exe ${PHASE2_1_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

./tcc_linux.exe ${PHASE2_2_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

./tcc_linux.exe ${PHASE2_2_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

./tcc_linux.exe ${PHASE2_2_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
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

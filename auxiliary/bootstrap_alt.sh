#INCS="-I ../includes/tmp/tcc/lib/tcc/include/ -I ../includes/usr/include/i386-linux-gnu/  -I ../includes/usr/include/"

./bootstrap_cleanup_tcc.sh

set -e

js --no-ion mk_tcc_bootstrap.js
js --no-ion mk_libtcc1_bootstrap.js

cd ../tcc_js_bootstrap

echo "Building libc wrapper with Emscripten compiled tcc"
js --no-ion 02_mk_libc_wrap.js

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
js --no-ion 03_mk_libc_stubs.js

LIBTCC1_ARGS="-nostdinc -nostdlib -c ./alt_bootstrap/libtcc1_bootstrap_min.c -o libtcc1.o"

LINK_CMD=" -nostdlib ../../linux_lib_bin/crt1.o ../../linux_lib_bin/crti.o ../../linux_lib_bin/crtn.o libtcc1.o ../../linux_lib_bin/libc_nonshared.a out.o -o tcc_linux.exe -L ../../linux_lib_bin/ -lc -lm -ldl"

# link phase 1
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

echo "build tcc_boot3.o"

# Do a 3 stage bootstrap using tcc_bootstrap.c .
# Note for now we use the prebuilt tcc_bootstrap.exe for the linking phase
# since there are currently some issues with the linking phase in tcc_bootstrap.c

PHASE1_ARGS="-nostdinc -nostdlib -c ./alt_bootstrap/tcc_bootstrap.c -o out.o"

PHASE2_1_ARGS="-DBOOTSTRAP_MODE=1 -nostdinc -nostdlib -c ../tcc_js_bootstrap/tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -I ../tcc_js_bootstrap/tcc_src/ -I ../includes/tmp/tcc/lib/tcc/include/ -I ../includes/usr/include/i386-linux-gnu/  -I ../includes/usr/include/ -o tcc_bin/tcc_boot3.o"

#PHASE2_2_ARGS="-nostdinc -nostdlib -c ../tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -I ../tcc_src/ ${INCS} -o out.o"

rm libtcc1.o
./tcc_linux.exe ${LIBTCC1_ARGS}
./tcc_linux.exe ${PHASE1_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

rm libtcc1.o
./tcc_linux.exe ${LIBTCC1_ARGS}
./tcc_linux.exe ${PHASE1_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

rm libtcc1.o
./tcc_linux.exe ${LIBTCC1_ARGS}
./tcc_linux.exe ${PHASE1_ARGS}
rm tcc_linux.exe
tcc_bootstrap.exe ${LINK_CMD}
chmod +x tcc_linux.exe
rm out.o

# phase 2

cd ../libc_portable_proto/
../tcc_js_bootstrap/tcc_linux.exe ${PHASE2_1_ARGS}
cd ../tcc_js_bootstrap
#rm tcc_linux.exe
#tcc_bootstrap.exe ${LINK_CMD}
#chmod +x tcc_linux.exe
#rm out.o

#./tcc_linux.exe ${PHASE2_2_ARGS}
#rm tcc_linux.exe
#tcc_bootstrap.exe ${LINK_CMD}
#chmod +x tcc_linux.exe
#rm out.o

#./tcc_linux.exe ${PHASE2_2_ARGS}
#rm tcc_linux.exe
#tcc_bootstrap.exe ${LINK_CMD}
#chmod +x tcc_linux.exe
#rm out.o

#./tcc_linux.exe ${PHASE2_2_ARGS}
#rm tcc_linux.exe
#tcc_bootstrap.exe ${LINK_CMD}
#chmod +x tcc_linux.exe

mv libtcc1.o ../libc_portable_proto/tcc_bin/libtcc1.o

cd ../libc_portable_proto

./alt_bootstrap_tcc.sh

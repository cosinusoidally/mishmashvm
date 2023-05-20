echo "Bootstrap"

js (){
  r="exe='$1';load('../lib/xpc.js')"
  echo $r
  firefox -xpcshell -e "$r"
}

cd ../tcc_js_bootstrap
echo "Building tcc with Emscripten compiled tcc"
js 01_mk_tcc.js

echo "Building libc wrapper with Emscripten compiled tcc"
js 02_mk_libc_wrap.js

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
js 03_mk_libc_stubs.js
cd ..

cd libc_portable_proto

#./bootstrap_tcc.sh
echo "2nd stage bootstrap"

echo "Building libtcc1.o"
js 01.js

echo "Starting 3 stage native bootstrap"

echo "Building tcc (stage 1)"
js 02.js

echo "Building libtcc1.o (stage 1)"
js 03.js

mv tcc_bin/libtcc1.o.new tcc_bin/libtcc1.o
mv tcc_bin/tcc_boot3.o.new tcc_bin/tcc_boot3.o

echo "Building tcc (stage 2)"
js 02.js

echo "Building libtcc1.o (stage 2)"
js 03.js

mv tcc_bin/libtcc1.o.new tcc_bin/libtcc1.o
mv tcc_bin/tcc_boot3.o.new tcc_bin/tcc_boot3.o

echo "Building tcc (stage 3)"
js 02.js

echo "Building libtcc1.o (stage 3)"
js 03.js

echo "building libc wrapper/stubs (stage 1)"

source ../auxiliary/bootstrap_libc_xpc.sh

mv my_libc.o.new my_libc.o
mv stubs.o.new stubs.o

echo "building libc wrapper/stubs (stage 2)"

source ../auxiliary/bootstrap_libc_xpc.sh

js 04_check_sha256.js

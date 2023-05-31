./bootstrap_cleanup_tcc.sh

set -e

js --no-ion mk_tcc_bootstrap.js

cd ../tcc_js_bootstrap

echo "Building libc wrapper with Emscripten compiled tcc"
js --no-ion 02_mk_libc_wrap.js

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
js --no-ion 03_mk_libc_stubs.js

mv out.o ../libc_portable_proto/tcc_bin/tcc_boot3.o

cd ../libc_portable_proto

./alt_bootstrap_tcc.sh

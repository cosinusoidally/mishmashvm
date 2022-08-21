echo "Bootstrap"

cd tcc_js_bootstrap
echo "Building tcc with Emscripten compiled tcc"
js 01_mk_tcc.js

echo "Building libc wrapper with Emscripten compiled tcc"
js 02_mk_libc_wrap.js

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
js 03_mk_libc_stubs.js
cd ..

cd libc_portable_proto

./bootstrap_tcc.sh

echo "Bootstrap"

echo "Building tcc with Emscripten compiled tcc"
js --no-ion 01_mk_tcc_alt.js

cd ../tcc_js_bootstrap
echo "Building libc wrapper with Emscripten compiled tcc"
js --no-ion 02_mk_libc_wrap.js

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
js --no-ion 03_mk_libc_stubs.js
cd ..

cd libc_portable_proto

./alt_bootstrap_tcc.sh

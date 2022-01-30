set js_cmd=../../jsshell/js.exe --no-ion
set start_cmd=start /wait /B
echo "Bootstrap"

cd tcc_js_bootstrap
echo "Building tcc with Emscripten compiled tcc"
%start_cmd% %js_cmd% 01_mk_tcc.js

echo "Building libc wrapper with Emscripten compiled tcc"
%start_cmd% %js_cmd% 02_mk_libc_wrap.js

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
%start_cmd% %js_cmd% 03_mk_libc_stubs.js
cd ..

cd libc_portable_proto

bootstrap_tcc.bat

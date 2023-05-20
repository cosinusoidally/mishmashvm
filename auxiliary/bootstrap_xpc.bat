set js_cmd=../../firefox_win32/firefox.exe -xpcshell
set start_cmd=start /wait /B
echo "Bootstrap"

cd ../tcc_js_bootstrap
echo "Building tcc with Emscripten compiled tcc"
%start_cmd% %js_cmd% -e "exe='01_mk_tcc.js';load('../lib/xpc.js')"

echo "Building libc wrapper with Emscripten compiled tcc"
%start_cmd% %js_cmd% 02_mk_libc_wrap.js

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
%start_cmd% %js_cmd% 03_mk_libc_stubs.js
cd ..

cd libc_portable_proto

REM bootstrap_tcc.bat

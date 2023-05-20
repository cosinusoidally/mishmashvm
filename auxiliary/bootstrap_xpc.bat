set js_cmd=../../firefox_win32/firefox.exe -xpcshell
set start_cmd=start /wait /B
set f1=-e "exe=
set f2=;load('../lib/xpc.js')"
echo "Bootstrap"

cd ../tcc_js_bootstrap
echo "Building tcc with Emscripten compiled tcc"
%start_cmd% %js_cmd% %f1%'01_mk_tcc.js'%f2%

echo "Building libc wrapper with Emscripten compiled tcc"
%start_cmd% %js_cmd% %f1%'02_mk_libc_wrap.js'%f2%

echo "Building libc unimplemented stubs with Emscripten compiled tcc"
%start_cmd% %js_cmd% %f1%'03_mk_libc_stubs.js'%f2%
cd ..

cd libc_portable_proto

REM bootstrap_tcc.bat

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

echo "2nd stage bootstrap"

echo "Building libtcc1.o"
%start_cmd% %js_cmd% %f1%'01.js'%f2%

echo "Starting 3 stage native bootstrap"

echo "Building tcc (stage 1)"
%start_cmd% %js_cmd% %f1%'02.js'%f2%

echo "Building libtcc1.o (stage 1)"
%start_cmd% %js_cmd% %f1%'03.js'%f2%

del tcc_bin\libtcc1.o
del tcc_bin\tcc_boot3.o

move tcc_bin\libtcc1.o.new tcc_bin\libtcc1.o
move tcc_bin\tcc_boot3.o.new tcc_bin\tcc_boot3.o

echo "Building tcc (stage 2)"
%start_cmd% %js_cmd% %f1%'02.js'%f2%

echo "Building libtcc1.o (stage 2)"
%start_cmd% %js_cmd% %f1%'03.js'%f2%

del tcc_bin\libtcc1.o
del tcc_bin\tcc_boot3.o

move tcc_bin\libtcc1.o.new tcc_bin\libtcc1.o
move tcc_bin\tcc_boot3.o.new tcc_bin\tcc_boot3.o

echo "Building tcc (stage 3)"
%start_cmd% %js_cmd% %f1%'02.js'%f2%

echo "Building libtcc1.o (stage 3)"
%start_cmd% %js_cmd% %f1%'03.js'%f2%

echo "building libc wrapper/stubs (stage 1)"

REM call "bootstrap_libc.bat"
echo "Building my_libc.o.new"
%start_cmd% %js_cmd% %f1%'mk_libc.js'%f2%

echo "Building stubs.o.new"
%start_cmd% %js_cmd% %f1%'mk_stubs.js'%f2%


del my_libc.o
del stubs.o
move my_libc.o.new my_libc.o
move stubs.o.new stubs.o

echo "building libc wrapper/stubs (stage 2)"
REM call "bootstrap_libc.bat"

echo "Building my_libc.o.new"
%start_cmd% %js_cmd% %f1%'mk_libc.js'%f2%

echo "Building stubs.o.new"
%start_cmd% %js_cmd% %f1%'mk_stubs.js'%f2%

%start_cmd% %js_cmd% %f1%'04_check_sha256.js'%f2%

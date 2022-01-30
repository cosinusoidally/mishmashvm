set js_cmd=../../jsshell/js.exe
set start_cmd=start /wait /B
echo "2nd stage bootstrap"

echo "Building libtcc1.o"
%start_cmd% %js_cmd% 01.js

echo "Starting 3 stage native bootstrap"

echo "Building tcc (stage 1)"
%start_cmd% %js_cmd% 02.js

echo "Building libtcc1.o (stage 1)"
%start_cmd% %js_cmd% 03.js

del tcc_bin\libtcc1.o
del tcc_bin\tcc_boot3.o

move tcc_bin\libtcc1.o.new tcc_bin\libtcc1.o
move tcc_bin\tcc_boot3.o.new tcc_bin\tcc_boot3.o

echo "Building tcc (stage 2)"
%start_cmd% %js_cmd% 02.js

echo "Building libtcc1.o (stage 2)"
%start_cmd% %js_cmd% 03.js

del tcc_bin\libtcc1.o
del tcc_bin\tcc_boot3.o

move tcc_bin\libtcc1.o.new tcc_bin\libtcc1.o
move tcc_bin\tcc_boot3.o.new tcc_bin\tcc_boot3.o

echo "Building tcc (stage 3)"
%start_cmd% %js_cmd% 02.js

echo "Building libtcc1.o (stage 3)"
%start_cmd% %js_cmd% 03.js

%start_cmd% %js_cmd% 04_check_sha256.js

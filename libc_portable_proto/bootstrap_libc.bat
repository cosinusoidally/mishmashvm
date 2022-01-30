set js_cmd=../../jsshell/js.exe
set start_cmd=start /wait /B

echo "Building my_libc.o.new"
%start_cmd% %js_cmd% mk_libc.js

echo "Building stubs.o.new"
%start_cmd% %js_cmd% mk_stubs.js

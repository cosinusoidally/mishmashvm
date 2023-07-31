set js_cmd=../jsshell/js.exe
set start_cmd=start /wait /B
cd ..
REM js -e "load('mishmashvm.js');test(20)"
%start_cmd% %js_cmd% -e "load('mishmashvm.js');test(21)"
%start_cmd% %js_cmd% -e "load('mishmashvm.js');test(22)"
%start_cmd% %js_cmd% -e "load('mishmashvm.js');test(23)"
%start_cmd% %js_cmd% -e "load('mishmashvm.js');test(24)"
del libc_portable_proto\tcc_bin\libtcc1.o
del libc_portable_proto\tcc_bin\libtcc1.o.new
del libc_portable_proto\tcc_bin\tcc_boot3.o
del libc_portable_proto\tcc_bin\tcc_boot3.o.new
move tcc_js_bootstrap\out.o  libc_portable_proto\tcc_bin\tcc_boot3.o
cd libc_portable_proto
bootstrap_tcc.bat

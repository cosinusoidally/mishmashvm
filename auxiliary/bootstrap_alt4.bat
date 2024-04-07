set js_cmd=../../jsshell/js.exe
set start_cmd=start /wait /B
REM %start_cmd% %js_cmd% tcc_bootstrap_min_pt0.js
%start_cmd% %js_cmd% tcc_bootstrap_min_pt2.js
%start_cmd% %js_cmd% tcc_bootstrap_min_pt3.js
%start_cmd% %js_cmd% tcc_bootstrap_min_pt4.js
%start_cmd% %js_cmd% tcc_bootstrap_min_pt5.js

cd ..
del libc_portable_proto\tcc_bin\libtcc1.o
del libc_portable_proto\tcc_bin\libtcc1.o.new
del libc_portable_proto\tcc_bin\tcc_boot3.o
del libc_portable_proto\tcc_bin\tcc_boot3.o.new
move tcc_js_bootstrap\out.o  libc_portable_proto\tcc_bin\tcc_boot3.o
cd libc_portable_proto
bootstrap_tcc.bat

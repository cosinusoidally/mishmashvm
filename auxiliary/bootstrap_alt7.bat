cd ../../tcc_simple/experiments/xp_linux/

..\..\..\nodejs\node.exe mk_min.js
..\..\..\nodejs\node.exe gen_alt2.js

copy /b artifacts\full.list+mmvm_boot.list artifacts\full2.list

.\artifacts\min_win32_node.exe artifacts/full2.list

cd ../../../mishmashvm/libc_portable_proto/

call bootstrap_clean.bat

copy ..\..\tcc_simple\experiments\xp_linux\artifacts\stubs.o .
copy ..\..\tcc_simple\experiments\xp_linux\artifacts\my_libc.o .
copy ..\..\tcc_simple\experiments\xp_linux\artifacts\tcc_27_4.o tcc_bin\tcc_boot3.o

call bootstrap_tcc.bat

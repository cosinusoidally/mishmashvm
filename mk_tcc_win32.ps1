./mk_clean_artifacts.ps1
mkdir -p artifacts/tcc_win32/lib
cp -r tcc_src/win32/include artifacts/tcc_win32/include
cp tcc_src/include/* artifacts/tcc_win32/include
cp tcc_src/win32/lib/*def artifacts/tcc_win32/lib
../jsshell/js.exe -e 'load("mishmashvm.js"); test(25)'
echo "If there were no errors then there should now be a copy of tcc.exe in artifacts/tcc_win32 . You should be able to copy that directory to wherever you want."

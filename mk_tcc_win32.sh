./mk_clean_artifacts.sh
mkdir -p artifacts/tcc_win32/lib
cp -r tcc_src/win32/include artifacts/tcc_win32/include
cp tcc_src/include/* artifacts/tcc_win32/include
cp tcc_src/win32/lib/*def artifacts/tcc_win32/lib
js -e 'load("mishmashvm.js"); test(25)'

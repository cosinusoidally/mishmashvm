cd ../libc_portable_proto
./bootstrap_clean.sh
cd ../tcc_js_bootstrap
echo "build tcc_linux.exe"
rm tcc_linux.exe
rm libtcc1.o
rm ../tests/nodejs/lib/addon.o
rm ../tests/nodejs/lib/addon_linux.node
rm ../tests/nodejs/lib/addon_win32.node

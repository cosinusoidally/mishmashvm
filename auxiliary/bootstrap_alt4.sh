cd ..
pushd .
cd ../tcc_bootstrap_alt
./mk_clean
popd
js -e "load('mishmashvm.js');test(20)"
js -e "load('mishmashvm.js');test(21)"
js -e "load('mishmashvm.js');test(22)"
js -e "load('mishmashvm.js');test(23)"
js -e "load('mishmashvm.js');test(24)"
rm libc_portable_proto/tcc_bin/*o
rm libc_portable_proto/tcc_bin/*new
mv tcc_js_bootstrap/out.o  libc_portable_proto/tcc_bin/tcc_boot3.o
cd libc_portable_proto
./bootstrap_tcc.sh

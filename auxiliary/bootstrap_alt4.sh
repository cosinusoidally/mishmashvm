pushd .
cd ../../tcc_bootstrap_alt
./mk_clean
popd
js tcc_bootstrap_min_pt0.js
js tcc_bootstrap_min_pt1.js
js tcc_bootstrap_min_pt2.js
js tcc_bootstrap_min_pt3.js
js tcc_bootstrap_min_pt4.js
js tcc_bootstrap_min_pt5.js
cd ..
rm libc_portable_proto/tcc_bin/*o
rm libc_portable_proto/tcc_bin/*new
mv tcc_js_bootstrap/out.o  libc_portable_proto/tcc_bin/tcc_boot3.o
cd libc_portable_proto
./bootstrap_tcc.sh

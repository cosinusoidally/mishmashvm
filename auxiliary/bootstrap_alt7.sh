set -x

pushd .
cd ../../tcc_simple/experiments/xp_linux

pwd

./mk_min dummy.list

nodejs gen_alt2.js

cat mmvm_boot.list >> artifacts/full.list

time ./artifacts/test_tracer.exe ./artifacts/min_linux.exe artifacts/full.list

popd

cd ../libc_portable_proto/

./bootstrap_clean.sh

cp ../../tcc_simple/experiments/xp_linux/artifacts/stubs.o .
cp ../../tcc_simple/experiments/xp_linux/artifacts/my_libc.o .
cp ../../tcc_simple/experiments/xp_linux/artifacts/tcc_27_4.o tcc_bin/tcc_boot3.o

./bootstrap_tcc.sh

echo "DONE"

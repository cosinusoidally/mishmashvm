set -x

pushd .
cd ../../tcc_simple/experiments/xp_linux

pwd

./mk_min dummy.list

nodejs gen_alt2.js

cat mmvm_boot.list >> artifacts/full.list

time ./artifacts/test_tracer.exe ./artifacts/min_linux.exe artifacts/full.list

echo "DONE"

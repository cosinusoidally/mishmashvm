echo "2nd stage bootstrap"

echo "Building libtcc1.o"
js 01.js

echo "Starting 3 stage native bootstrap"

echo "Building tcc (stage 1)"
js 02.js

echo "Building libtcc1.o (stage 1)"
js 03.js

mv tcc_bin/libtcc1.o.new tcc_bin/libtcc1.o
mv tcc_bin/tcc_boot3.o.new tcc_bin/tcc_boot3.o

echo "Building tcc (stage 2)"
js 02.js

echo "Building libtcc1.o (stage 2)"
js 03.js

mv tcc_bin/libtcc1.o.new tcc_bin/libtcc1.o
mv tcc_bin/tcc_boot3.o.new tcc_bin/tcc_boot3.o

echo "Building tcc (stage 3)"
js 02.js

echo "Building libtcc1.o (stage 3)"
js 03.js

echo "building libc wrapper/stubs (stage 1)"

./bootstrap_libc.sh

mv my_libc.o.new my_libc.o
mv stubs.o.new stubs.o

echo "building libc wrapper/stubs (stage 2)"

./bootstrap_libc.sh

js 04_check_sha256.js

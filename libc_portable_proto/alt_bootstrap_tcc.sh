echo "alt boostrap phase 2"

echo "build libtcc1.o"
js alt_01.js

echo "first build of tcc_boot3.o.new"
js alt_02_1.js

mv tcc_bin/tcc_boot3.o.new tcc_bin/tcc_boot3.o

echo "second build of tcc_boot3.o.new"
js alt_02_2.js

mv tcc_bin/tcc_boot3.o.new tcc_bin/tcc_boot3.o

#./bootstrap_tcc.sh

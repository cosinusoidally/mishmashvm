load("sha256.js");
sha256=root.sha256;
[
"my_libc.o",
"my_libc.o.new",
"stubs.o",
"stubs.o.new",
"tcc_bin/libtcc1.o",
"tcc_bin/libtcc1.o.new",
"tcc_bin/tcc_boot3.o",
"tcc_bin/tcc_boot3.o.new",
].map(function(x){
  try {
    print(root.sha256(read(x,"binary"))+" "+x);
  } catch(e){
    print("no such file: "+x);
  }
});

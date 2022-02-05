print("Loading lib/tcc_loader.js");

(function(){
  var tcc_o=["libc_portable_proto/tcc_bin/tcc_boot3.o","libc_portable_proto/tcc_bin/libtcc1.o"];
  var libc_o=["libc_portable_proto/my_libc.o","libc_portable_proto/stubs.o"];
  try {
    tcc_o=tcc_o.map(function(x){
      print("loading: "+x);
      var o=read(x,"binary");
      return o;
    });
    libc_o=libc_o.map(function(x){
      print("loading: "+x);
      var o=read(x,"binary");
      return o;
    });
  } catch (e) {
    print("Unable to load tcc object code please bootstrap (see README)");
    quit();
  }
  tcc_o=tcc_o.map(mm.decode_elf);
  libc_o=libc_o.map(mm.decode_elf);
})();

load("tcc_bootstrap_min_common.js");

print("tcc bootstrap 0.9.24 to 0.9.26");

libc.chdir("../../tcc_bootstrap_alt/tcc_24/");

libtcc1_o=mm.decode_elf(read("libtcc1.o","binary"));
tcc_24_o=mm.decode_elf(read("tcc.o","binary"));

tcc_24=mm.link([tcc_24_o,libtcc1_o,my_wrap]);

main=mm.arg_wrap(tcc_24.get_fn("main"));

function build(com){
print(com);
var r=main(com);
if(r!==0){
  throw "Build failure";
}
return r;
};

libc.chdir("../tcc_26/");
build("tcc -I ../woody/usr/include/ -I include -c tcc.c -DONE_SOURCE");
build("tcc -c ../tcc_24/libtcc1.c");

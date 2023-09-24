load("tcc_bootstrap_min_common.js");

print("tcc bootstrap 0.9.23 to 0.9.24");

libc.chdir("../../tcc_bootstrap_alt/tcc_23/");

tcc_23_o=mm.decode_elf(read("tcc.o","binary"));

tcc_23=mm.link([tcc_23_o,my_wrap]);

main=mm.arg_wrap(tcc_23.get_fn("main"));

function build(com){
print(com);
var r=main(com);
if(r!==0){
  throw "Build failure";
}
return r;
};

libc.chdir("../tcc_24/");
build("tcc -c libtcc1.c");
build("tcc -I ../woody/usr/include/ -I . -c tcc.c");

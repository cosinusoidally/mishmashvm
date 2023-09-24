load("tcc_bootstrap_min_common.js");

print("tcc bootstrap 0.9.26 to 0.9.27");

libc.chdir("../../tcc_bootstrap_alt/tcc_26/");

libtcc1_o=mm.decode_elf(read("libtcc1.o","binary"));
tcc_26_o=mm.decode_elf(read("tcc.o","binary"));

tcc_26=mm.link([tcc_26_o,libtcc1_o,my_wrap]);

main=mm.arg_wrap(tcc_26.get_fn("main"));

function build(com){
print(com);
var r=main(com);
if(r!==0){
  throw "Build failure";
}
return r;
};

libc.chdir("../../mishmashvm/tcc_js_bootstrap/");
build("tcc -nostdinc -nostdlib -o out.o -c ../tcc_src/tcc.c -D__linux__ -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -I ../tcc_src/:../../tcc_bootstrap_alt/woody/usr/include/:../../tcc_bootstrap_alt/tcc_26/include/");

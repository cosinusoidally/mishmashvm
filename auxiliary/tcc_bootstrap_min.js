load("../lib/setup_platform.js");
quit_orig=quit;
quit=function(){};
try {
  load("../lib/mishmashvm_lib.js");
} catch (e){
  //swallow errror
  print("swallowing error");
}
quit=quit_orig;
load("../lib/elf_loader.js");

tcc=read("../../tcc_bootstrap_alt/tcc_10/tcc_boot.o","binary");

// HACK HACK
load_orig=load;
load=function(){};
load_orig("../../tcc_bootstrap_alt/tcc_js/support.js");
load=load_orig;
var o=malloc(tcc.length);

for(var i=0;i<tcc.length;i++){
  wi8(o+i,tcc[i]);
}

// based on tcc_1_7/loader.c

entrypoint=ri32(o);
print("entrypoint: "+to_hex(entrypoint));
o=o+4;
text_len=ri32(o);
print("text_len: "+to_hex(text_len));
o=o+4;
data_len=ri32(o);
print("data_len: "+to_hex(data_len));
o=o+4;
reloc_len=ri32(o);
print("reloc_len: "+to_hex(reloc_len));
o=o+4;
global_reloc_len=ri32(o);
print("global_reloc_len: "+to_hex(global_reloc_len));
o=o+4;
global_reloc_table_len=ri32(o);
print("global_reloc_table_len: "+to_hex(global_reloc_table_len));
o=o+4;

var m0=0xdeadbe00;
var m1=0xdeadbe01;
var m2=0xdeadbe02;
var m3=0xdeadbe03;
var m4=0xdeadbe04;

t=unsigned(ri32(o));
if(t!==m0){
   print("error sync "+to_hex(t));
   err();
}
o=o+4;

global_relocs_table_base=o;
global_relocs_table=global_relocs_table_base;
o=o+global_reloc_table_len;
t=unsigned(ri32(o));
if(t!==m1){
   print("error sync "+to_hex(t));
   err();
}
o=o+4;
relocs_base=o;
o=o+reloc_len;
t=unsigned(ri32(o));
if(t!==m2){
   print("error sync "+to_hex(t));
   err();
}
o=o+4;
date_rel=o;
o=o+data_len;
t=unsigned(ri32(o));
if(t!==m3){
   print("error sync "+to_hex(t));
   err();
}
o=o+4;
global_relocs_base=o;
o=o+global_reloc_len;
t=unsigned(ri32(o));
if(t!==m4){
   print("error sync "+to_hex(t));
   err();
}
o=o+4;
prog_rel=o;


var DATA_SIZE=(256*1024);
var TEXT_SIZE=(256*1024);


glo=libc.mmap(                  ctypes.voidptr_t(0),
                                          DATA_SIZE,
                  libc.PROT_READ | libc.PROT_WRITE ,
              libc.MAP_ANONYMOUS | libc.MAP_PRIVATE,
                                                 -1,
                                                  0);
prog = libc.mmap(ctypes.voidptr_t(0), TEXT_SIZE,
              libc.PROT_EXEC | libc.PROT_READ | libc.PROT_WRITE,
              libc.MAP_PRIVATE | libc.MAP_ANONYMOUS,
              -1, 0);

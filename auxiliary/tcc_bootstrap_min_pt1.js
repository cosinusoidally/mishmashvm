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
data_rel=o;
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
var RELOC_ADDR32 = 1;  /* 32 bits relocation */
var RELOC_REL32  = 2;  /* 32 bits relative relocation */



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

m=global_relocs_table_base+global_reloc_table_len;

for(i=0;i<reloc_len;i=i+12){
  if(relocs_base+i+8==0){
    p=prog;
  } else {
    p=glo;
  }
  wi32(prog_rel+ri32(relocs_base+i),unsigned(unsigned(ri32(relocs_base+i+4))+unsigned(p)));
}

goff=0;

while(global_relocs_table<m){
  l=strlen(global_relocs_table);
  var s=mk_js_string(global_relocs_table);
  global_relocs_table+=l+1;
  var a=ctypes.cast(
      libc.lib.declare(s,ctypes.default_abi,ctypes.uint32_t),
      ctypes.uint32_t
      ).value;
  print("global_reloc: "+to_hex(global_relocs_table)+" "+l+" "+s+" "+to_hex(a));

  n=ri32(global_relocs_table);
  global_relocs_table+=4;
  print("global_reloc_num: "+n);
  for(i=0;i<n;i++){

    off=ri32(global_relocs_base+goff+4);
    addr=off+prog_rel;
    switch(ri32(global_relocs_base+goff)) {
        case RELOC_ADDR32:
          print("Reloc type RELOC_ADDR32 at "+to_hex(off));
//          *(int *)addr=a;
          wi32(addr,a);
          break;
        case RELOC_REL32:
          print("Reloc type RELOC_REL32 at "+to_hex(off));
//          *(int *)addr = a - addr - 4;
          wi32(addr,a - (addr+prog-prog_rel) - 4);
          break;
        default:
          err();
    }
    goff=goff+8;
  }
}

p2=new Uint8Array(text_len);
for(var i=0;i<text_len;i++){
  p2[i]=ri8(i+prog_rel);
}
libc.memcpy(prog,p2,text_len);

p3=new Uint8Array(data_len);
for(var i=0;i<data_len;i++){
  p3[i]=ri8(i+data_rel);
}
libc.memcpy(glo,p3,data_len);

real_entrypoint=unsigned(prog+entrypoint);
print("main: "+to_hex(real_entrypoint));

tcc_o={
  exports: [{st_name:"main",address:real_entrypoint}],
  relocate_all:function(){}
}
main=mm.arg_wrap(mm.link([tcc_o]).get_fn("main"));

function build(com){
print(com);
var r=main(com);
if(r!==0){
  throw "Build failure";
}
return r;
};

libc.chdir("../../tcc_bootstrap_alt/tcc_10/");

build("tcc ../tcc_1_7/dlsym_wrap.c ../tcc_1_7/tcc.c ../tcc_1_7/tcc.c ../tcc_1_8/tcc.c ../tcc_1_8/tcc.c ../tcc_1_8/tcc.c ../tcc_1_9/tcc.c ../tcc_1_9/tcc.c ../tcc_1_9/tcc.c ../tcc_2m/tcc.c ../tcc_2m/tcc.c ../tcc_2m/tcc.c ../tcc_2/tcc.c ../tcc_2/tcc.c ../tcc_2/tcc.c -DNO_LONG_LONG ../tcc_3/tcc.c -DNO_LONG_LONG ../tcc_3/tcc.c ../tcc_3/tcc.c ../tcc_3/tcc.c ../tcc_3/tcc.c tcc.c -o tcc.o -c tcc.c");

/*
libc={};
libc.lib = ctypes.open("libc.so.6");

  libc.PROT_READ=1;
  libc.PROT_WRITE=2;
  libc.PROT_EXEC=4;
  libc.MAP_ANONYMOUS=32;
  libc.MAP_PRIVATE=2;

  // void *memcpy(void *dest, const void *src, size_t n);
  libc.memcpy= libc.lib.declare("memcpy",ctypes.default_abi,ctypes.uint32_t,ctypes.uint32_t, ctypes.voidptr_t,ctypes.uint32_t);

  // void *mmap(void *addr, size_t length, int prot, int flags,
  //                  int fd, off_t offset);
  libc.mmap=libc.lib.declare("mmap",ctypes.default_abi, ctypes.uint32_t,ctypes.voidptr_t,ctypes.uint32_t,ctypes.int,ctypes.int,ctypes.int,ctypes.uint32_t);
libdl={};
libdl.lib=ctypes.open("libdl.so");
libdl.RTLD_LAZY=1;
libdl.RTLD_NOW=2;

// void *dlopen(const char *filename, int flag); 
libdl.dlopen=libdl.lib.declare("dlopen",ctypes.default_abi,ctypes.voidptr_t,ctypes.char.ptr, ctypes.uint32_t);
// void *dlsym(void *handle, const char *symbol); 
libdl.dlsym=libdl.lib.declare("dlsym",ctypes.default_abi,ctypes.uint32_t,ctypes.voidptr_t,ctypes.char.ptr);
//libc2=libdl.dlopen("libc.so.6",libdl.RTLD_LAZY);
//libdl2=libdl.dlopen("libdl.so.2",libdl.RTLD_LAZY);
//libm=libdl.dlopen("libm.so.6",libdl.RTLD_LAZY);
  // void *malloc(size_t size);

//  libc.malloc=libc.lib.declare("malloc",ctypes.default_abi, ctypes.uint32_t,ctypes.uint32_t);
libc.malloc_fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
libc.malloc=ctypes.cast(ctypes.voidptr_t(libdl.dlsym(ctypes.voidptr_t(0),"malloc")),libc.malloc_fntype.ptr);
*/

kernel32={};
kernel32.lib=ctypes.open("Kernel32.dll");

/*
LPVOID WINAPI VirtualAlloc(
  _In_opt_ LPVOID lpAddress,
  _In_     SIZE_T dwSize,
  _In_     DWORD  flAllocationType,
  _In_     DWORD  flProtect
 );
 */

kernel32.VirtualAlloc=kernel32.lib.declare("VirtualAlloc",ctypes.winapi_abi,ctypes.uint32_t,ctypes.voidptr_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t);
kernel32.MEM_COMMIT=0x00001000;
kernel32.PAGE_EXECUTE_READWRITE=0x40;


libc={};
libc.mmap=function(addr,length,prot,flags,fd,offset){
return kernel32.VirtualAlloc(ctypes.voidptr_t(0),length,kernel32.MEM_COMMIT,kernel32.PAGE_EXECUTE_READWRITE);
}
libc.lib=ctypes.open("msvcr120.dll");
  // void *memcpy(void *dest, const void *src, size_t n);
  libc.memcpy= libc.lib.declare("memcpy",ctypes.default_abi,ctypes.uint32_t,ctypes.uint32_t, ctypes.voidptr_t,ctypes.uint32_t);
 libc.malloc=libc.lib.declare("malloc",ctypes.default_abi, ctypes.uint32_t,ctypes.uint32_t);
  libc.memcpy2= libc.lib.declare("memcpy",ctypes.default_abi,ctypes.uint32_t, ctypes.voidptr_t,ctypes.uint32_t,ctypes.uint32_t);



pp=function(x){print( JSON.stringify(x))};
	var pp2=function(){};
	var pp3=print;
function decode_elf(a){
	var pp=function(){};
	var print=function(){};
var obj={};
obj.magic=[];
print("Load the elf magic");
for(i=0;i<16;i++){
  obj.magic.push(a[i].toString(16))
};
print("magic: "+obj.magic);

// need to be able to convert from little endian to number
var le_to_n=function(x){

return x[0]+(x[1]<<8)+(x[2]<<16)+(x[3]<<24);
}
print("now need to find the offset of the section header table \n\
e_shoff at 0x20 bytes into file");

obj.e_shoff=le_to_n([a[0x20],a[0x21],a[0x22],a[0x23]]);
print("e_shoff: "+obj.e_shoff);

print("now we know where the section header are, we next need to know\n\
how many there are and how large each one is");

print("e_shentsize tells us the size of each section header it lives at\n\
0x2E bytes into the file");

obj.e_shentsize=le_to_n([a[0x2e],a[0x2f],0,0]);
print("e_shentsize: "+obj.e_shentsize);

print("e_shnum (at 0x30) tells us the number of section headers");
obj.e_shnum=le_to_n([a[0x30],a[0x31],0,0]);
print("e_shnum: "+obj.e_shnum);

print("Now with 2 for loops we should be able to extract all section headers:");

print("raw headers in hex");
var sh=[];
var o=obj.e_shoff;
for(var i=0;i<obj.e_shnum;i++){
  sh.push([]);
  for(var j=0;j<obj.e_shentsize;j++){
    sh[i][j]=a[o];
    o++;
  } 
  print(sh[i].map(function(x){return x.toString(16)}));
}

obj.sh={};
obj.sh.raw=sh;

var sh_type={
0x0: "SHT_NULL", // 	Section header table entry unused
0x1: 	"SHT_PROGBITS", //	Program data
0x2: 	"SHT_SYMTAB", //	Symbol table
0x3: 	"SHT_STRTAB", // 	String table
0x4: 	"SHT_RELA", // 	Relocation entries with addends
0x5: 	"SHT_HASH", // 	Symbol hash table
0x6: 	"SHT_DYNAMIC", // 	Dynamic linking information
0x7: 	"SHT_NOTE", //  	Notes
0x8: 	"SHT_NOBITS", //  	Program space with no data (bss)
0x9: 	"SHT_REL",  // 	Relocation entries, no addends
0x0A: 	"SHT_SHLIB", //	Reserved
0x0B: 	"SHT_DYNSYM", //	Dynamic linker symbol table
0x0E: 	"SHT_INIT_ARRAY", //	Array of constructors
0x0F: 	"SHT_FINI_ARRAY", //	Array of destructors
0x10: 	"SHT_PREINIT_ARRAY", // 	Array of pre-constructors
0x11: 	"SHT_GROUP", // 	Section group
0x12: 	"SHT_SYMTAB_SHNDX", // 	Extended section indices
0x13: 	"SHT_NUM" // 	Number of defined types. 

}

print("decoded headers:");


function dec_header(x){

  var d={};
  d.sh_name=le_to_n([x[0x0],x[0x1],x[0x2],x[0x3]])
  d.sh_type=sh_type[le_to_n([x[0x4],x[0x5],x[0x6],x[0x7]])];
  d.sh_offset=le_to_n([x[0x10],x[0x11],x[0x12],x[0x13]]);
  d.sh_size=le_to_n([le_to_n([x[0x14],x[0x15],x[0x16],x[0x17]])]);
  d.sh_entsize=le_to_n([x[0x24],x[0x25],x[0x26],x[0x27]]);
  return d;
}

var shd=sh.map(function(x,i){var d= dec_header(x);d.index=i;return d;});

shd.map(function(x){
print(JSON.stringify(x));

});
obj.sh.dec=shd;

print("e_shstrndx (at 0x32) tells us the index of the section containing\n\
the string names of each section");
obj.e_shstrndx=le_to_n([a[0x32],a[0x33],0,0]);
print("e_shstrndx: "+obj.e_shstrndx);
print("ie this is the section containg those strings:");
obj.sections={};
var shstrtab=shd[obj.e_shstrndx];
print(JSON.stringify(shstrtab));

var range=function(arr,x,l){

  var r=[];
  if(l<0){return r};
  for(var i=x;i<x+l;i++){
    r.push(arr[i]);
  }
  return r;
}

var shstrtab_strings=range(a,shstrtab.sh_offset,shstrtab.sh_size);
shstrtab_strings=shstrtab_strings.map(function(x){return String.fromCharCode(x)});
print(JSON.stringify(shstrtab_strings));
obj.sections[".shstrtab"]=shstrtab_strings;
var oo=shd[0].sh_name;
for(i=1;i<shd.length;i++){
var cc=shd[i];
var cc_i=cc.sh_name;
shd[i-1].sh_name=range(shstrtab_strings,oo,cc_i-oo-1).join("");
oo=cc_i;
}
shd[i-1].sh_name=range(shstrtab_strings,oo,shstrtab.sh_size-oo-1).join("");

shd.map(function(x){
print(JSON.stringify(x));

});
print("ok we have now named all the sections");
print("we will find f1 in .symtab");
print("lets make an index for shd");
var shd_i={};
shd.map(function(x,i){
shd_i[x.sh_name]=x;
});
obj.sh.byname=shd_i;
print(JSON.stringify(shd_i));
print("lookup .symtab:");
var symtab=shd_i[".symtab"];
print(JSON.stringify(symtab));

var st=[];
o=symtab.sh_offset;
entries=symtab.sh_size/symtab.sh_entsize;
for(var i=0;i<entries;i++){
  st.push([]);
  for(var j=0;j<symtab.sh_entsize;j++){
    st[i][j]=a[o];
    o++;
  } 
  print(st[i].map(function(x){return x.toString(16)}));
}

obj.sections['.symtab']={};
obj.sections['.symtab'].raw=st;
print("now to decode the .symtab section:");
var std=st.map(function(x){
  var d={};
  d.st_name=le_to_n([x[0x0],x[0x1],x[0x2],x[0x3]]);
  d.st_value=le_to_n([x[0x4],x[0x5],x[0x6],x[0x7]]);
  d.st_size=le_to_n([x[0x8],x[0x9],x[0xa],x[0xb]]);
  d.st_info=x[0xc];
  d.st_bind={
    0: "ST_LOCAL",
    1: "ST_GLOBAL"
  }[d.st_info>>>4];
  d.st_other=x[0xd];
  d.st_shndx=le_to_n([x[0xe],x[0xf],0,0]);

  return d;
});
std.map(function(x){
print(JSON.stringify(x));

});
obj.sections['.symtab'].dec=std;
print("now let's decode the names from .strtab");
var strtab=shd_i[".strtab"];
print(JSON.stringify(strtab));
var strtab_strings=range(a,strtab.sh_offset,strtab.sh_size);
strtab_strings=strtab_strings.map(function(x){return String.fromCharCode(x)});
print(JSON.stringify(strtab_strings));
obj.sections['.strtab']=strtab_strings;
print();
print("and now the names:");
std.map(function(x){
var o=x.st_name;
var c="";
var arr=[];
while((c=strtab_strings[o])!=="\u0000"){
o++;
arr.push(c);
}
x.st_name=arr.join("");
print(JSON.stringify(x));
})

var std_i={};

std.map(function(x,i){
x.index=i;
std_i[x.st_name]=x;
});
obj.sections['.symtab'].byname=std_i;
print(JSON.stringify(std_i));


/*
code=libc.mmap(                 ctypes.voidptr_t(0),
                                             0xFFFF,
  libc.PROT_READ | libc.PROT_WRITE | libc.PROT_EXEC,
              libc.MAP_ANONYMOUS | libc.MAP_PRIVATE,
                                                  0,
                                                  0);

//code=libc.malloc(0xffff);

print("code is at: "+code);
print("memcpy across the code");
libc.memcpy(code,f1.code,f1.code.length);
f1.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[]);
f1.fn=ctypes.cast(ctypes.voidptr_t(code),f1.fntype.ptr);
*/

var text_section=shd_i[".text"];
print("text section: "+JSON.stringify(text_section));
print("copy the text section over into a Uint8Array");
var text=new Uint8Array(text_section.sh_size);
for(i=0;i<text.length;i++){
  text[i]=a[text_section.sh_offset+i];
}
print(JSON.stringify(text));

obj.sections[".text"]={};

obj.sections[".text"].raw=text;
function uint32_to_arr(x){
  var aa=new ArrayBuffer(4);
  var bb=new Uint32Array(aa);
  bb[0]=x;
  return new Uint8Array(aa);
};

function int32_to_arr(x){
  var aa=new ArrayBuffer(4);
  cc=new Int32Array(aa);
  cc[0]=x;
  return new Uint8Array(aa);
};

var data_section=shd_i[".data"];
print("data section: "+JSON.stringify(data_section));
print("copy the data section over into a Uint8Array");
var data=new Uint8Array(data_section.sh_size);
for(i=0;i<data.length;i++){
  data[i]=a[data_section.sh_offset+i];
}
print(JSON.stringify(data));

obj.sections['.data']={};
obj.sections['.data'].raw=data;

print("Next step we need to decode .rel.text");
var rel_text=shd_i[".rel.text"];
print(JSON.stringify(rel_text));

var rt=[];
if(rel_text){
o=rel_text.sh_offset;
var entries=rel_text.sh_size/rel_text.sh_entsize;
for(var i=0;i<entries;i++){
  rt.push([]);
  for(var j=0;j<rel_text.sh_entsize;j++){
    rt[i][j]=a[o];
    o++;
  } 
  print(rt[i].map(function(x){return x.toString(16)}));
}

print("now to decode the .rel.text section:");
obj.sections['.rel.text']={};
obj.sections['.rel.text'].raw=rt;

var rtd=rt.map(function(x){
  var d={};
  d.r_offset=le_to_n([x[0x0],x[0x1],x[0x2],x[0x3]]);
  d.r_info=le_to_n([x[0x4],x[0x5],x[0x6],x[0x7]]);
  d.type=d.r_info&0xff;
  d.sym=d.r_info >>> 8;
  d.type=[0,"R_386_32","R_386_PC32"][d.type];
  d.sym_name=std[d.sym].st_name;
  return d;
});
rtd.map(function(x){
print(JSON.stringify(x));

});
obj.sections['.rel.text'].dec=rtd;

}
print("Next step we need to decode .rel.data");
var rel_data=shd_i[".rel.data"];
print(JSON.stringify(rel_data));

var rd=[];
if(rel_data){
o=rel_data.sh_offset;
var entries=rel_data.sh_size/rel_data.sh_entsize;
for(var i=0;i<entries;i++){
  rd.push([]);
  for(var j=0;j<rel_data.sh_entsize;j++){
    rd[i][j]=a[o];
    o++;
  } 
  print(rd[i].map(function(x){return x.toString(16)}));
}

print("now to decode the .rel.data section:");
obj.sections['.rel.data']={};
obj.sections['.rel.data'].raw=rd;

var rdd=rd.map(function(x){
  var d={};
  d.r_offset=le_to_n([x[0x0],x[0x1],x[0x2],x[0x3]]);
  d.r_info=le_to_n([x[0x4],x[0x5],x[0x6],x[0x7]]);
  d.type=d.r_info&0xff;
  d.sym=d.r_info >>> 8;
  d.type=[0,"R_386_32","R_386_PC32"][d.type];
  d.sym_name=std[d.sym].st_name;
  return d;
});
rdd.map(function(x){
print(JSON.stringify(x));

});
obj.sections['.rel.data'].dec=rdd;
}

print("time to create our text and data sections in memory");
var text_raw=obj.sections['.text'].raw;
var text_raw_size=0x10000*Math.floor(1+text_raw.length /0x10000);
var text_addr=libc.mmap(                 ctypes.voidptr_t(0),
                                             text_raw_size,
  libc.PROT_READ | libc.PROT_WRITE | libc.PROT_EXEC,
              libc.MAP_ANONYMOUS | libc.MAP_PRIVATE,
                                                  0,
                                                  0);
var data_raw=obj.sections['.data'].raw;
var data_addr=libc.malloc(data_raw.length);

function sync_mem(){
  libc.memcpy(text_addr,text_raw,text_raw.length);
  libc.memcpy(data_addr,data_raw,data_raw.length);
};

sync_mem();
print("text_addr: "+text_addr);
print("data_addr: "+data_addr);
obj.sections[".text"].address=text_addr;
obj.sections[".data"].address=data_addr;



//printf=libdl.dlsym(libc2,"printf");
//print("address off printf "+printf);
// std_i["printf"].address=printf;

var bss=obj.sh.byname[".bss"];
var bss_addr=libc.malloc(bss.sh_size);
var bss_raw=new Uint8Array(bss.sh_size);
libc.memcpy(bss_addr,bss_raw,bss_raw.length);
obj.sections[".bss"]={};
obj.sections[".bss"].address=bss_addr;
obj.sections[".bss"].raw=bss_raw;

obj.sections[".symtab"].dec.map(function(x,i){
  if(i!==0){
    if(x.st_shndx!==0){
      var n=obj.sh.dec[x.st_shndx];
      if(n!==undefined){
        x.sh_name=obj.sh.dec[x.st_shndx].sh_name;
      x.address=x.st_value+obj.sections[x.sh_name].address;
      };
    } else {
      x.sh_name="und";
    }
  }
  print(x.st_name+" "+x.st_shndx+" "+x.sh_name+" "+x.address);
});

function relocate(name){
if(obj.sections[name]===undefined){
return;
};
if(name===".rel.data"){
  var b=data_addr;
  var m=data_raw;
} else {
  var b=text_addr;
  var m=text_raw;
};
print("relocating "+name);
print(b);
var s=obj.sections[name];
s.dec.map(function(y){
print();
var n=y.sym_name;
var t=y.type;
var sym;
if(obj.imports[n]){
  sym=obj.imports[n];
} else {
  sym=obj.sections['.symtab'].byname[n];
}
//if(sym.sh_name=="und"){
//sym=obj.imports[n];
//};
pp2(JSON.stringify(sym));
var o=y.r_offset;
var s_add=sym.address;
pp2(n+" "+t+" "+s_add);
if(t==="R_386_32"){
  print("R_386_32 relocation");
  var c=m[o]+(m[o+1]<<8)+(m[o+2]<<16)+(m[o+3]<<24);
  var v=uint32_to_arr(c+s_add);
  pp(v);
  print(o);
  m[o]=v[0]; 
  m[o+1]=v[1]; 
  m[o+2]=v[2]; 
  m[o+3]=v[3]; 
}
if(t==="R_386_PC32"){
  print("R_386_PC32 relocation");
//  var r=(s_add-(b+o)-4);
  var c1=new ArrayBuffer(4);
  var c2=new Uint8Array(c1);
  c2[0]=m[o];c2[1]=m[o+1];c2[2]=m[o+2];c2[3]=m[o+3];
  var c3=(new Int32Array(c1))[0];
//pp3(c3);
if(c3!==-4){throw("my error");};
  var r=s_add-(b+o)+c3;
  print(r);
  print((b+o).toString(16));
  var v=int32_to_arr(r);
  pp(v);
  print(o);
  m[o]=v[0]; 
  m[o+1]=v[1]; 
  m[o+2]=v[2]; 
  m[o+3]=v[3]; 
}
pp(sym);
pp(y);
});

}
function relocate_all(){
  relocate(".rel.data");
  relocate(".rel.text");
  sync_mem();
}
obj.relocate=relocate;
obj.relocate_all=relocate_all;
obj.sync_mem=sync_mem;

obj.und=std.filter(function(x){
if(x.sh_name==="und"){
return true;
}
return false;
});
obj.exports=std.filter(function(x){
if(x.sh_name==="und"){
return false;
}
if(x.st_bind==="ST_LOCAL"){
return false;
}
return true;
});
return obj;
};

objs=[];
//inp=["struct3.o"];
//inp=["cd_null.o","chase.o","cl_demo.o","cl_input.o","cl_main.o","cl_parse.o","cl_tent.o","cmd.o","common.o","console.o","crc.o","cvar.o","d_edge.o","d_fill.o","d_init.o","d_modech.o","d_part.o","d_polyse.o","d_scan.o","d_sky.o","d_sprite.o","d_surf.o","d_vars.o","d_zpoint.o","draw.o","host.o","host_cmd.o","in_null.o","keys.o","mathlib.o","menu.o","model.o","net_dgrm.o","net_loop.o","net_main.o","net_none.o","net_vcr.o","nonintel.o","pr_cmds.o","pr_edict.o","pr_exec.o","r_aclip.o","r_alias.o","r_bsp.o","r_draw.o","r_edge.o","r_efrag.o","r_light.o","r_main.o","r_misc.o","r_part.o","r_sky.o","r_sprite.o","r_surf.o","r_vars.o","sbar.o","screen.o","snd_dma.o","snd_mem.o","snd_mix.o","sv_main.o","sv_move.o","sv_phys.o","sv_user.o","sys_null.o","vid_null.o","view.o","wad.o","world.o","zone.o"];
//inp=["sdl_test2.o"];
//inp=["f1.o"];
inp=["sdl_test2.o","buffer.o",  "mp2.o",  "mpeg1.o"];


inp.map(function(x){
var obj=decode_elf(read(x,"binary"));
objs.push(obj);
});
obj2={};
obj2.relocate_all=function(){};
obj2.exports=[]

all_exports={};
objs.map(function(x){
var e=x.exports.map(function(y){;
all_exports[y.st_name]=y;
});
});
//print("the exports:");
//print(JSON.stringify(all_exports));
und=[];
//print("here");
objs.map(function(x){
  x.und.map(function(y){;
  if(!all_exports[y.st_name]){
    und.push(y);
  }
  });
});
//print(JSON.stringify(und));

/*
objs.push(obj2);

ex={};
objs.map(function(x){
  x.imports=ex;
  x.exports.map(function(y){
    ex[y.st_name]=y;
  });
});

objs.forEach(function(x){
  x.relocate_all();
});
f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["f1"].address),f2.fntype.ptr);

print(f2.fn());
*/
// libsdl=libdl.dlopen("libSDL-1.2.so.0",libdl.RTLD_LAZY);
//libgl=libdl.dlopen("libGL.so.1",libdl.RTLD_LAZY);

sdl=ctypes.open("SDL.dll");

und.map(function(x){
var s={"st_name":x.st_name,"address": 0};
try {
print(s.st_name);
s.address=ctypes.cast(
sdl.declare(s.st_name,ctypes.default_abi,ctypes.uint32_t),
ctypes.uint32_t
).value;
//print(s.address);
//print(ctypes.cast(s.address_fn,ctypes.uint32_t));
}
catch(e){

try {
print(s.st_name);
s.address=ctypes.cast(
libc.lib.declare(s.st_name,ctypes.default_abi,ctypes.uint32_t),
ctypes.uint32_t
).value;
//print(s.address);
//print(ctypes.cast(s.address_fn,ctypes.uint32_t));
}
catch(e2){
print("missing symbol");
}
}
if(s.address===0){
//s={"st_name":x.st_name,"address": libdl.dlsym(libsdl,x.st_name)};
};
if(s.address===0){
//s={"st_name":x.st_name,"address": libdl.dlsym(libgl,x.st_name)};
};
if(s.address===0){
print(JSON.stringify(s));
};
if(s.address!==0){
obj2.exports.push(s);
}
});

objs.push(obj2);

ex={};
objs.map(function(x){
  x.imports=ex;
  x.exports.map(function(y){
    ex[y.st_name]=y;
  });
});

objs.forEach(function(x){
  x.relocate_all();
});




// start implementation

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["init_sdl"].address),f2.fntype.ptr);

init_sdl=f2.fn;

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["my_sdl_main"].address),f2.fntype.ptr);

my_sdl_main=f2.fn;


f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.voidptr_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["set_sdl_buf_raw"].address),f2.fntype.ptr);

set_sdl_buf_raw=f2.fn;

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["get_framebuffer_sdl"].address),f2.fntype.ptr);

get_framebuffer_sdl=f2.fn;

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t,ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_create"].address),f2.fntype.ptr);

mpeg1_decoder_create=f2.fn;

// float mpeg1_decoder_get_frame_rate(mpeg1_decoder_t *self);
f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.float,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_frame_rate"].address),f2.fntype.ptr);

mpeg1_decoder_get_frame_rate=f2.fn;


// int bit_buffer_has(bit_buffer_t *self, unsigned int count);

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t, ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["bit_buffer_has"].address),f2.fntype.ptr);

bit_buffer_has=f2.fn;

// void *mpeg1_decoder_get_write_ptr(mpeg1_decoder_t *self, unsigned int byte_size)

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t, ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_write_ptr"].address),f2.fntype.ptr);

mpeg1_decoder_get_write_ptr=f2.fn;

// void mpeg1_decoder_did_write(mpeg1_decoder_t *self, unsigned int byte_size) 

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t, ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_did_write"].address),f2.fntype.ptr);

mpeg1_decoder_did_write=f2.fn;

// int mpeg1_decoder_get_width(mpeg1_decoder_t *self);
f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_width"].address),f2.fntype.ptr);

mpeg1_decoder_get_width=f2.fn;

// int mpeg1_decoder_get_height(mpeg1_decoder_t *self);
f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_height"].address),f2.fntype.ptr);

mpeg1_decoder_get_height=f2.fn;

// bool mpeg1_decoder_decode(mpeg1_decoder_t *self);
f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_decode"].address),f2.fntype.ptr);

mpeg1_decoder_decode=f2.fn;

// void *mpeg1_decoder_get_y_ptr(mpeg1_decoder_t *self);
f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_y_ptr"].address),f2.fntype.ptr);

mpeg1_decoder_get_y_ptr=f2.fn;

// void *mpeg1_decoder_get_cr_ptr(mpeg1_decoder_t *self);

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_cr_ptr"].address),f2.fntype.ptr);

mpeg1_decoder_get_cr_ptr=f2.fn;

// void *mpeg1_decoder_get_cb_ptr(mpeg1_decoder_t *self);

f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_cb_ptr"].address),f2.fntype.ptr);

mpeg1_decoder_get_cb_ptr=f2.fn;

// int mpeg1_decoder_get_coded_size(mpeg1_decoder_t *self);
f2={};
f2.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[ctypes.uint32_t]);
f2.fn=ctypes.cast(ctypes.voidptr_t(ex["mpeg1_decoder_get_coded_size"].address),f2.fntype.ptr);

mpeg1_decoder_get_coded_size=f2.fn;

YCbCrToRGBA = function(y, cb, cr, rgba) {

	// Chroma values are the same for each block of 4 pixels, so we proccess
	// 2 lines at a time, 2 neighboring pixels each.
	// I wish we could use 32bit writes to the RGBA buffer instead of writing
	// each byte separately, but we need the automatic clamping of the RGBA
	// buffer.
	
	var w = ((width + 15) >> 4) << 4,
		w2 = w >> 1;

	var yIndex1 = 0,
		yIndex2 = w,
		yNext2Lines = w + (w - width);

	var cIndex = 0,
		cNextLine = w2 - (width >> 1);

	var rgbaIndex1 = 0,
		rgbaIndex2 = width * 4,
		rgbaNext2Lines = width * 4;

	var cols = width >> 1,
		rows = height >> 1;

	var ccb, ccr, r, g, b;

	for (var row = 0; row < rows; row++) {
		for (var col = 0; col < cols; col++) {
			ccb = cb[cIndex];
			ccr = cr[cIndex];
			cIndex++;

			r = (ccb + ((ccb * 103) >> 8)) - 179;
			g = ((ccr * 88) >> 8) - 44 + ((ccb * 183) >> 8) - 91;
			b = (ccr + ((ccr * 198) >> 8)) - 227;

			// Line 1
			var y1 = y[yIndex1++];
			var y2 = y[yIndex1++];
			rgba[rgbaIndex1]   = y1 + r;
			rgba[rgbaIndex1+1] = y1 - g;
			rgba[rgbaIndex1+2] = y1 + b;
			rgba[rgbaIndex1+4] = y2 + r;
			rgba[rgbaIndex1+5] = y2 - g;
			rgba[rgbaIndex1+6] = y2 + b;
			rgbaIndex1 += 8;

			// Line 2
			var y3 = y[yIndex2++];
			var y4 = y[yIndex2++];
			rgba[rgbaIndex2]   = y3 + r;
			rgba[rgbaIndex2+1] = y3 - g;
			rgba[rgbaIndex2+2] = y3 + b;
			rgba[rgbaIndex2+4] = y4 + r;
			rgba[rgbaIndex2+5] = y4 - g;
			rgba[rgbaIndex2+6] = y4 + b;
			rgbaIndex2 += 8;
		}

		yIndex1 += yNext2Lines;
		yIndex2 += yNext2Lines;
		rgbaIndex1 += rgbaNext2Lines;
		rgbaIndex2 += rgbaNext2Lines;
		cIndex += cNextLine;
	}
};


width=640;
height=360;

fb_r=new ArrayBuffer(width*height*4);
fb_y=new ArrayBuffer(width*height);
fb_cr=new ArrayBuffer(width*height/2);
fb_cb=new ArrayBuffer(width*height/2);



fb=new Uint8ClampedArray(fb_r);
fby=new Uint8Array(fb_y);
fbcr=new Uint8Array(fb_cr);
fbcb=new Uint8Array(fb_cb);
var j=0;

frn=0;
frame=function(){
cur=Date.now();
if(((cur-t0)/1000)*24 <frn){
return false;
}
frn++;
mpeg1_decoder_decode(decoder);
//print(mpeg1_decoder_get_coded_size(decoder)/width);
libc.memcpy2(fb_y,mpeg1_decoder_get_y_ptr(decoder),fby.length);
libc.memcpy2(fb_cr,mpeg1_decoder_get_cr_ptr(decoder),fbcr.length);
libc.memcpy2(fb_cb,mpeg1_decoder_get_cb_ptr(decoder),fbcb.length);
/*
for(var i=0;i<width*height;i++){
fb[i*4]=fby[i];
fb[i*4+1]=fby[i];
fb[i*4+2]=fby[i];
fb[i*4+3]=fby[i];
}
*/
YCbCrToRGBA(fby,fbcb,fbcr,fb);
libc.memcpy(get_framebuffer_sdl(),fb_r,fb.length);
return true;
}

//vid=read("../bjork-all-is-full-of-love.ts","binary");
vid=read("big-buck-bunny.mpg","binary");
decoder=mpeg1_decoder_create(vid.length,2);
write_ptr= mpeg1_decoder_get_write_ptr(decoder,vid.length);

libc.memcpy(write_ptr,vid,vid.length);
mpeg1_decoder_did_write(decoder,vid.length);
print("Framerate: "+ mpeg1_decoder_get_frame_rate(decoder));
print("width: "+ mpeg1_decoder_get_width(decoder));
print("height: "+ mpeg1_decoder_get_height(decoder));

function go(){
init_sdl();
t0=Date.now();
//set_sdl_buf_raw(fb_r);
var st=Date.now();

while(1){
cur=Date.now();
if(frame(cur-st)){
my_sdl_main();
};
st=cur;
}

}

go();

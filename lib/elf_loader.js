print("Loading lib/elf_loader.js");

mm.decode_elf=function(a){
// disable some debug printing
//  var pp=function(x){print( JSON.stringify(x))};
  var pp2=function(){};
  var pp3=print;
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
  });

  var std_i={};

  std.map(function(x,i){
    x.index=i;
    std_i[x.st_name]=x;
  });
  obj.sections['.symtab'].byname=std_i;
  print(JSON.stringify(std_i));

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
        var c1=new ArrayBuffer(4);
        var c2=new Uint8Array(c1);
        c2[0]=m[o];c2[1]=m[o+1];c2[2]=m[o+2];c2[3]=m[o+3];
        var c3=(new Int32Array(c1))[0];
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
  obj.relocated=false;
  function relocate_all(){
    if(obj.relocated){return;};
    relocate(".rel.data");
    relocate(".rel.text");
    sync_mem();
    obj.relocated=true;
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

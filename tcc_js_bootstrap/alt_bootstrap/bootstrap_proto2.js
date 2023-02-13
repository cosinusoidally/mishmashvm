load("../../libc_portable_proto/sha256.js");

hex0_to_array=function(x){
  var a=x.split("\n").
  map(function(x){return x.split(";")[0]}).
  map(function(x){return x.split("#")[0]}).
  join("").
  split(" ").
  join("").
  split("\t").
  join("").
  split("");
  var b=[];
    for(var i=0;i<a.length;i=i+2){
    b.push(a[i]+a[i+1]);
  }
  return b.map(function(x){return parseInt(x,16)});
};

hex0=hex0_to_array(read("stage0-posix/x86/hex0_x86.hex0"));
hex0_sha256=root.sha256(hex0);
hex0_sha256_expected="e650a1b5bdcfd79689569a3199a252a76622f7ea4fe036a5dddc2039fdad79c5";
print("hex0 sha256: "+hex0_sha256+" "+(hex0_sha256===hex0_sha256_expected));

kaem=hex0_to_array(read("stage0-posix/x86/kaem-minimal.hex0"));
kaem_sha256=root.sha256(kaem);
kaem_sha256_expected="4fd5d6d7f1ac4708c06df2bf7e0b7f6dc45a493ac100e14fc52172929b807f5e";
print("kaem sha256: "+kaem_sha256+" "+(kaem_sha256===kaem_sha256_expected));

var parse_elf=function(e){
  var mm=[];
  var zero_mem = function(m,n){
    for(var i=0;i<n;i++){
      m[i]=0;
    };
  };
  zero_mem(mm,256*1024); // populate initial memory

  for(var i=0;i<e.length;i++){
    w8(mm,i,e[i]);
  };

  return {
    entry:   0x08048054,
    p_paddr: 0x08048000,
    mem: mm
  };
};

var zero_mem = function(m,n){
  for(var i=0;i<n;i++){
    m[i]=0;
  };
};

var w8 = function(a,o,v){
  var s=o&3;
  o=(o>>>2);
  var c=a[o];
  var b=[c & 0xff,(c>>>8) & 0xff,(c>>>16)&0xff,(c>>>24) &0xff];
  b[s]=v &0xff;
  a[o]=(b[0]+(b[1]<<8)+(b[2]<<16)+(b[3]<<24))|0;
};

var r8 = function(a,o){
  var s=o&3;
  o=(o>>>2);
  if(o<a.length){
    return (a[o] >>> (8*s))& 0xFF;
  } else {
    throw "pagefault oob";
  }
};



var to_hex=function(x){
 return "0x"+
        (("00"+((x>>>24)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>16)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>8)&0xFF).toString(16)).slice(-2))+
        (("00"+(x&0xFF).toString(16)).slice(-2));
};

var new_process=function(){
  var eax=0;
  var ecx=0;
  var edx=0;
  var ebx=0;
  var esp=0;
  var ebp=0;
  var esi=0;
  var edi=0;

  var dbg=false;

  var stack=[];
  var stack_size=1024*1024; // just give us a meg
  zero_mem(stack,stack_size/4);
  stack_base=0xFFFFFFFF-stack_size;
  var vmem=[
    [stack_base,stack],
  ];

  var add_mem=function(m){
    vmem.push(m);
  };
  var _r8=r8;
  var _w8=w8;
  var vr8=function(o){
    var p;
    for(var i=0;i<vmem.length;i++){
      p=vmem[i];
      if(o>=p[0]){
        return _r8(p[1],o-p[0]);
      };
    };
    throw "pagefault";
  };

  var vw8=function(o,b){
    var p;
    for(var i=0;i<vmem.length;i++){
      p=vmem[i];
      if(o>=p[0]){
        return _w8(p[1],o-p[0],b);
      };
    };
    throw "pagefault oob write";
  };

  var vr32=function(o){
    var d=[vr8(o),vr8(o+1),vr8(o+2),vr8(o+3)];
//    print(d.map(function(x){return x.toString(16)}));
    return (d[0]+(d[1]<<8)+(d[2]<<16)+(d[3]<<24));
  };

  var vr16=function(o){
    var d=[vr8(o),vr8(o+1)];
    return (d[0]+(d[1]<<8));
  };

  var vw32=function(o,v){
    vw8(o,v&0xff);
    vw8(o+1,(v>>>8)&0xff);
    vw8(o+2,(v>>16)&0xff);
    vw8(o+3,(v>>>24)&0xff);
  };

  // run a single i386 instruction:

  var step=function(){
    var b1=vr8(eip);
    switch(b1){
      case 0x58:
        if(dbg){
          print("pop    %eax");
        };
        eax=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      default:
        throw "unimplemented: " + b1.toString(16);
    };
  };

  return {
    add_mem: add_mem,
    set_eip: function(x){eip=x},
    set_esp: function(x){esp=x},
    get_eip: function(){return eip},
    get_esp: function(){return esp},
    get_eax: function(){return eax},
    get_ecx: function(){return ecx},
    get_edx: function(){return edx},
    get_ebx: function(){return ebx},
    get_ebp: function(){return ebp},
    get_esi: function(){return esi},
    get_edi: function(){return edi},

    vr8: vr8,
    vw8: vw8,
    vr16: vr16,
    vr32: vr32,
    vw32: vw32,
    step: step,
    set_dbg: function(x){dbg=x},
  };
}

var hp=new_process();

hex0_img=parse_elf(hex0);

hp.add_mem([hex0_img.p_paddr,hex0_img.mem]);
hp.set_eip(hex0_img.entry);
hp.set_esp(0xffffd5d0); // bodge lifted from gdb

// initialize stack (TODO generate the initial program stack correctly by
// generating it based on command parameters)

var stack_in=[
0x03, 0x00, 0x00, 0x00, 0x3b, 0xd7, 0xff, 0xff,
0x7e, 0xd7, 0xff, 0xff, 0x92, 0xd7, 0xff, 0xff
];

for(var i=0;i<stack_in.length;i++){
  hp.vw8(hp.get_esp()+i,stack_in[i]);
};



// belt and braces, check memory:
hex0_check=[];
for(var i=0;i<hex0.length;i++){
  hex0_check[i]=r8(hex0_img.mem,i);
};
print("check if memory matches hex0: "+ (root.sha256(hex0)=== root.sha256(hex0_check)));

var info_registers = function(p){
  print("eax            "+(to_hex(p.get_eax())));
  print("ecx            "+(to_hex(p.get_ecx())));
  print("edx            "+(to_hex(p.get_edx())));
  print("ebx            "+(to_hex(p.get_ebx())));
  print("esp            "+(to_hex(p.get_esp())));
  print("ebp            "+(to_hex(p.get_ebp())));
  print("esi            "+(to_hex(p.get_esi())));
  print("edi            "+(to_hex(p.get_edi())));
  print("eip            "+(to_hex(p.get_eip())));
  print("eflags        FIXME");
};

hp.set_dbg(true);

try{
  while(1){
    hp.step();
  };
} catch (e) {
  print(e);
};
info_registers(hp);

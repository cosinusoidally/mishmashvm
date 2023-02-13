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
   return {
    entry:   0x08048054,
    p_paddr: 0x08048000,
   };
};

var zero_mem = function(m,n){
  for(var i=0;i<n;i++){
    m[i]=0;
  };
};

var to_hex=function(x){
 return "0x"+
        (("00"+((x>>>24)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>16)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>8)&0xFF).toString(16)).slice(-2))+
        (("00"+(x&0xFF).toString(16)).slice(-2));
};

var new_process=function(){
  var eip=0;
  var esp=0;
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
  return {
    add_mem: add_mem,
    set_eip: function(x){eip=x},
    get_eip: function(){return eip},
    set_esp: function(x){esp=x},
    get_esp: function(){return esp}
  };
}

var hp=new_process();

hex0_img=parse_elf(hex0);

hp.add_mem([hex0_img.p_paddr,hex0_img.mem]);
hp.set_eip(hex0_img.entry);

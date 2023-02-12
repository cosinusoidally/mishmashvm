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

print("setup memory");

/*
we have our initial hex binary in hex0 we need to load that into memory at the
right place and then begin executing. To do this we will match what the real
hex0 does when it gets loaded on Linux:

Command is:
./bootstrap-seeds/POSIX/x86/hex0-seed ./x86/hex0_x86.hex0 ./x86/artifact/hex0

hex0 is an elf file. Its base address is 0x08048000 (ph_vaddr/ph_physaddr from
the header I think).

Can load it into gdb with:

$ gdb ./bootstrap-seeds/POSIX/x86/hex0-seed
GNU gdb (Ubuntu 8.1.1-0ubuntu1) 8.1.1
Copyright (C) 2018 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
<http://www.gnu.org/software/gdb/documentation/>.
For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from ./bootstrap-seeds/POSIX/x86/hex0-seed...(no debugging symbols found)...done.
(gdb) starti ./x86/hex0_x86.hex0 ./x86/artifact/hex0
Starting program: /home/ljw/src/bootstrap/stage0/bootstrap-seeds/POSIX/x86/hex0-seed ./x86/hex0_x86.hex0 ./x86/artifact/hex0

Program stopped.
0x08048054 in ?? ()
(gdb) 

starti pauses just before the first instruction in the program.

Find the pid:
ps aux|grep hex0

eg:

$ ls -l /proc/1420/exe 
lrwxrwxrwx 1 ljw ljw 0 Feb 11 15:03 /proc/1420/exe -> /home/ljw/src/bootstrap/stage0/bootstrap-seeds/POSIX/x86/hex0-seed

08048000-08049000 rwxp 00000000 08:01 5097592                            /home/ljw/src/bootstrap/stage0/bootstrap-seeds/POSIX/x86/hex0-seed
f7ff9000-f7ffc000 r--p 00000000 00:00 0                                  [vvar]
f7ffc000-f7ffe000 r-xp 00000000 00:00 0                                  [vdso]
fffdd000-ffffe000 rwxp 00000000 00:00 0                                  [stack]

Seems to load at those addresses every time (which is good for the purposes od
testing) though this might be a fluke. If it stops loading at a know address I
may have to turn of Address Space Layout Randomization (ASLR).

08048000-08049000 rwxp 00000000 08:01 5097592                            /home/ljw/src/bootstrap/stage0/bootstrap-seeds/POSIX/x86/hex0-seed      
is the elf file in memory

f7ff9000-f7ffc000 r--p 00000000 00:00 0                                  [vvar]
not 100% sure yet. I think it is some kernel stuff that is exposed to userspace

f7ffc000-f7ffe000 r-xp 00000000 00:00 0                                  [vdso]
see man vdso

fffdd000-ffffe000 rwxp 00000000 00:00 0                                  [stack]
The stack
*/

// First we need the ability to take an int32 array (signed integer) and write
// bytes at arbitrary offsets. I am avoiding using typed arrays in order to
// allow the code to also work on very simple JS vms (eg mujs).

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
// lets call our main memory region mm (main mem)
var mm=[];
var zero_mem = function(m,n){
  for(var i=0;i<n;i++){
    m[i]=0;
  };
};
zero_mem(mm,256*1024); // populate initial memory

// load hex0 into memory
for(var i=0;i<hex0.length;i++){
  w8(mm,i,hex0[i]);
};

var hex0_check=[];
for(var i=0;i<hex0.length;i++){
  hex0_check[i]=r8(mm,i);
};
print("check if memory matches hex0: "+ (root.sha256(hex0)===
root.sha256(hex0_check)));

// hex0 physical load address is:
var p_paddr=0x08048000;
// entrypoint of hex0 is 0x8048054
var eip=0x8048054

print("first instruction of hex0 is: " +(r8(mm,eip-p_paddr).toString(16)));

/*
We are essentially goint to end up with virtual memory in JS. To simplify lets
have only 2 "pages" first "page" is mm. second page is the stack. We then have
read/write funtions that look up the given virtual address in either mm or stack

something a bit like:

*/
var stack=[];
var stack_size=1024*1024; // just give us a meg
zero_mem(stack,stack_size/4);
stack_base=0xFFFFFFFF-stack_size;


var vmem=[
  [stack_base,stack],
  [p_paddr,mm]
];

var vr8=function(vmem,o){
  var p;
  for(var i=0;i<vmem.length;i++){
    p=vmem[i];
    if(o>=p[0]){
      return r8(p[1],o-p[0]);
    };
  };
  throw "pagefault";
};

var vw8=function(vmem,o,b){
  var p;
  for(var i=0;i<vmem.length;i++){
    p=vmem[i];
    if(o>=p[0]){
      return w8(p[1],o-p[0],b);
    };
  };
  throw "pagefault oob write";
};
var vr32=function(vmem,o){
  var d=[vr8(vmem,o),vr8(vmem,o+1),vr8(vmem,o+2),vr8(vmem,o+3)];
  print(d.map(function(x){return x.toString(16)}));
  return (d[0]+(d[1]<<8)+(d[2]<<16)+(d[3]<<24));
};

var vr16=function(vmem,o){
  var d=[vr8(vmem,o),vr8(vmem,o+1)];
  return (d[0]+(d[1]<<8));
};

var vw32=function(vmem,o,v){
  vw8(vmem,o,v&0xff);
  vw8(vmem,o+1,(v>>>8)&0xff);
  vw8(vmem,o+2,(v>>16)&0xff);
  vw8(vmem,o+3,(v>>>24)&0xff);
};
/*
Now I should be able to start decoding and running instructions. I'll build the
implemented instruction incrementally so initially I can start with all
instructions replaced with a single unimplemented instrution that just throws an
error. The aim of the game is then:

run
throw error
implement instruction
rinse repeat until the whole program runs

Good refererence for x86 instructions are:
https://c9x.me/x86/
*/

var ins=[];
var unimp=function(){
 throw "Unimplemented: "+vr8(vmem,eip).toString(16);
};
for(var i=0;i<256;i++){
  ins[i]=unimp;
};

var step=function(){
   ins[vr8(vmem,eip)]();
};
var cycles=0;
var go = function(){
  try{
    while(1){
      cycles++;
      print();
      info_registers();
      step();
      print("cycles: "+cycles);
    }
  } catch(e){
    print(e);
  };
};
ins[0x58]=function(){
  print("pop    %eax");
  eax=vr32(vmem,esp);
  esp=esp+4;
  eip++;
};
ins[0x5b]=function(){
  print("pop    %ebx");
  ebx=vr32(vmem,esp);
  esp=esp+4;
  eip++;
};

ins[0x5a]=function(){
  print("pop    %edx");
  edx=vr32(vmem,esp);
  esp=esp+4;
  eip++;
};

ins[0xe8]=function(){
  var t=eip+vr32(vmem,eip+1)+5;
  print("call   "+to_hex(t));
  esp=esp-4;
  vw32(vmem,esp,eip+5);
  eip=t;
};

ins[0x52]=function(){
  print("push    %edx");
  esp=esp-4;
  vw32(vmem,esp,edx);
  eip++;
};

ins[0x53]=function(){
  print("push    %ebx");
  esp=esp-4;
  vw32(vmem,esp,ebx);
  eip++;
};

var unimp2=function(){
 throw "Unimplemented: "+vr8(vmem,eip).toString(16)+vr8(vmem,eip+1).toString(16);
};
var ins2=[];
for(var i=0;i<256;i++){
  ins2[i]=unimp2;
};

ins[0x31]=function(){
  ins2[vr8(vmem,eip+1)]();
};

ins2[0xc9]=function(){
  print("xor    %ecx,%ecx");
  ecx=0;
  eip=eip+2;
};

ins2[0xd2]=function(){
  print("xor    %edx,%edx");
  edx=0;
  eip=eip+2;
};

ins2[0xff]=function(){
  print("xor    %edi,%edi");
  edi=0;
  eip=eip+2;
};

ins2[0xdb]=function(){
  print("xor    %ebx,%ebx");
  ebx=0;
  eip=eip+2;
};

ins2[0xed]=function(){
  print("xor    %ebp,%ebp");
  ebp=0;
  eip=eip+2;
};

var sign_extend8 = function(x){
  if(x&0x80){
    x=x|0xFFFFFF00;
  };
  return x;
};

ins[0x6a]=function(){
  var v=sign_extend8(vr8(vmem,eip+1));
  print("push   $0x"+v.toString(16));
  esp=esp-4;
  vw32(vmem,esp,v);
  eip=eip+2;
};


ins[0xcd]=function(){
  print("int   $0x"+(vr8(vmem,eip+1).toString(16)));
  if(eax===5){
    syscall_open();
  } else if(eax===3){
    syscall_read();
  } else if(eax===1){
    syscall_exit();
  } else {
    throw "unsupported syscall: "+eax;
  };
  eip=eip+2;
};

ins[0x5d]=function(){
  print("pop    %ebp");
  ebp=vr32(vmem,esp);
  esp=esp+4;
  eip++;
};

var unimp3=function(){
 throw "Unimplemented: "+vr8(vmem,eip).toString(16)+vr8(vmem,eip+1).toString(16);
};
var ins3=[];
for(var i=0;i<256;i++){
  ins3[i]=unimp3;
};

ins[0x89]=function(){
  ins3[vr8(vmem,eip+1)]();
};

ins3[0xc6]=function(){
  print("mov    %eax,%esi");
  esi=eax;
  eip=eip+2;
};

ins3[0xc2]=function(){
  print("mov    %eax,%edx");
  edx=eax;
  eip=eip+2;
};

ins3[0xe1]=function(){
  print("mov    %esp,%ecx");
  ecx=esp;
  eip=eip+2;
};

ins3[0xf3]=function(){
  print("mov    %esi,%ebx");
  ebx=esi;
  eip=eip+2;
};

ins3[0xc7]=function(){
  print("mov    %eax,%edi");
  edi=eax;
  eip=eip+2;
};

ins3[0xd3]=function(){
  print("mov    %edx,%ebx");
  ebx=edx;
  eip=eip+2;
};

var unimp4=function(){
 throw "Unimplemented: "+vr8(vmem,eip).toString(16)+vr8(vmem,eip+1).toString(16);
};
var ins4=[];
for(var i=0;i<256;i++){
  ins4[i]=unimp4;
};

ins[0x66]=function(){
  ins4[vr8(vmem,eip+1)]();
};

ins4[0xb9]=function(){
  var v=vr16(vmem,eip+2);
  print("mov    $0x"+(v.toString(16))+",%cx");
  ecx=v;
  eip=eip+4;
};

ins4[0xba]=function(){
  var v=vr16(vmem,eip+2);
  print("mov    $0x"+(v.toString(16))+",%dx");
  edx=v;
  eip=eip+4;
};

var unimp5=function(){
 throw "Unimplemented: "+vr8(vmem,eip).toString(16)+vr8(vmem,eip+1).toString(16);
};
var ins5=[];
for(var i=0;i<256;i++){
  ins5[i]=unimp5;
};

ins[0x85]=function(){
  ins5[vr8(vmem,eip+1)]();
};

var test_common = function(t){
  SF=(t>>>7) &1;
  if(t==0){
    ZF=1;
  } else {
    ZF=0;
  };
  CF=0;
  OF=0;
};

ins5[0xc0]=function(){
  print("test   %eax,%eax");
  test_common(eax&eax);
  eip=eip+2;
};

ins5[0xed]=function(){
  print("test   %ebp,%ebp");
  test_common(ebp&ebp);
  eip=eip+2;
};

ins[0x74]=function(){
  var o=eip+sign_extend8(vr8(vmem,eip+1))+2;
  print("je     "+to_hex(o));
  if(ZF){
    eip=o;
  } else {
    eip=eip+2;
  };
};

ins[0x75]=function(){
  var o=eip+sign_extend8(vr8(vmem,eip+1))+2;
  print("jne     "+to_hex(o));
  if(!ZF){
    eip=o;
  } else {
    eip=eip+2;
  };
};

ins[0x7c]=function(){
  var o=eip+sign_extend8(vr8(vmem,eip+1))+2;
  print("jl     "+to_hex(o));
  if(SF!==OF){
    eip=o;
  } else {
    eip=eip+2;
  };
};

ins[0x7d]=function(){
  var o=eip+sign_extend8(vr8(vmem,eip+1))+2;
  print("jge    "+to_hex(o));
  if(SF==OF){
    eip=o;
  } else {
    eip=eip+2;
  };
};

ins[0xeb]=function(){
  var o=eip+sign_extend8(vr8(vmem,eip+1))+2;
  print("jmp    "+to_hex(o));
  eip=o;
};

ins[0xc3]=function(){
  print("ret");
  eip=vr32(vmem,esp);
  esp=esp+4;
};

var arith8_setflags = function(res){
  if(res===0){
    ZF=1;
  } else {
    ZF=0;
  };
  if(res<0){
    SF=1;
  } else {
    SF=0;
  };
  if(res>127 || res<-128){
    OF=1;
  } else {
    OF=0;
  };
}

ins[0x3c]=function(){
  var r=sign_extend8(vr8(vmem,eip+1));
  var al=sign_extend8(eax&0xFF);
  print("cmp    $0x"+r.toString(16)+",%al");
  var res=(al-r)|0;
  arith8_setflags(res);
  eip=eip+2;
};

ins[0x2c]=function(){
  var r=sign_extend8(vr8(vmem,eip+1));
  var al=sign_extend8(eax&0xFF);
  print("sub    $0x"+r.toString(16)+",%al");
  var res=(al-r)|0;
  arith8_setflags(res);
  eax=res&0xFF;
  eip=eip+2;
};

var unimp6=function(){
 throw "Unimplemented: "+vr8(vmem,eip).toString(16)+vr8(vmem,eip+1).toString(16);
};
var ins6=[];
for(var i=0;i<256;i++){
  ins6[i]=unimp6;
};

ins[0xc1]=function(){
  ins6[vr8(vmem,eip+1)]();
};

ins6[0xe7]=function(){
  var c=vr8(vmem,eip+2);
  print("shl    $0x"+c.toString(16)+",%edi");
  var r=edi;
  var tc= c & 0x1F;
  while(tc!==0){
    CF=r>>>31;
    r=r<<1;
    tc=tc-1;
  };
  if((c & 0x1F) ===1){
    OF = (r>>>31) ^CF;
  }
  edi=r;
  eip=eip+3;
};

var unimp7=function(){
 throw "Unimplemented: "+vr8(vmem,eip).toString(16)+vr8(vmem,eip+1).toString(16);
};
var ins7=[];
for(var i=0;i<256;i++){
  ins7[i]=unimp7;
};

ins[0x01]=function(){
  ins7[vr8(vmem,eip+1)]();
};

var arith32_setflags = function(res){
  if(res===0){
    ZF=1;
  } else {
    ZF=0;
  };
  if(res<0){
    SF=1;
  } else {
    SF=0;
  };
  if(res>2147483647 || res<-2147483648){
    OF=1;
  } else {
    OF=0;
  };
};

ins7[0xf8]=function(){
  print("add    %edi,%eax");
  eax=((eax)|0)+((edi|0));
  arith32_setflags(eax);
  // FIXME this might not be right
  eax=eax|0;
  eip=eip+2;
};

ins[0x4d]=function(){
  print("dec    %ebp");
  ebp=(ebp-1)|0;
  eip=eip+1;
};

// initialize registers:
var eax=0;
var ecx=0;
var edx=0;
var ebx=0;
var esp=0xffffd5f0; // taken from gdb, should really calculate
var ebp=0;
var esi=0;
var edi=0;

var IF=1;
var ZF=0;
var SF=0;
var CF=0;
var OF=0;

// var eflags=0x200;

// initialize stack (TODO generate the initial program stack correctly by
// generating it based on command parameters)

var stack_in=[
0x03, 0x00, 0x00, 0x00, 0x3b, 0xd7, 0xff, 0xff,
0x7e, 0xd7, 0xff, 0xff, 0x92, 0xd7, 0xff, 0xff
];

for(var i=0;i<stack_in.length;i++){
  vw8(vmem,esp+i,stack_in[i]);
};

// toString(16) doesn't do quit wheat you expect:
// js> ebx
// -10370
// js> ebx.toString(16)
// "-2882"
// rather than figure that out just create a to_hex function:

to_hex=function(x){
 return "0x"+
        (("00"+((x>>>24)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>16)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>8)&0xFF).toString(16)).slice(-2))+
        (("00"+(x&0xFF).toString(16)).slice(-2));
};

var decode_eflags = function(eflags){
  var r=[];
  if(eflags & EFLAGS_IF){
    r.push("IF");
  };
  return "[ "+r.join(" ")+" ]";
};

// create something like info registers from gdb:
var info_registers=function(){
print("eax            "+(to_hex(eax)));
print("ecx            "+(to_hex(ecx)));
print("edx            "+(to_hex(edx)));
print("ebx            "+(to_hex(ebx)));
print("esp            "+(to_hex(esp)));
print("ebp            "+(to_hex(ebp)));
print("esi            "+(to_hex(esi)));
print("edi            "+(to_hex(edi)));
print("eip            "+(to_hex(eip)));
print("eflags         [ IF="+IF+" ZF="+ZF+" ]");
};

// syscalls:


// this is the current highest file descriptor
var fd=2;

var syscall_open = function(){
  print("syscall_open called");
  fd++;
  eax=fd;
};

var outp=[];

var fds=[
  null,
  null,
  null,
  [0,read("stage0-posix/x86/hex0_x86.hex0","binary")],
  [0,outp]
];

var syscall_read = function(){
  var fd=ebx;
  var  buf=ecx;
  var  count=edx;
  print("syscall_read called fd:"+fd+" buf:"+buf+" count:"+count);
  if(count>1){
    throw "only support reads of 1 byte";
  };
  var fdo=fds[fd];

  for(var i=0;i<count;i++){
    if(fdo[0]>=fdo[1].length){
      eax=0;
      return;
    }
    vw8(vmem,buf,fdo[1][fdo[0]]);
    fdo[0]++;
    buf++;
  };
  print("offset: "+fdo[0]);
  eax=1;
};

var syscall_exit = function(){
  exit_code=ebx;
  print("syscall_exit: "+exit_code);
}

go();
info_registers();

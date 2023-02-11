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

let have vmem look something like:
vmem=[
  [stack_base, stack]
  [p_paddr, mm]
]

vr8 =function(vmem,o){
  for(var i=0;i<vmem.length;i++){
    if(o>=vmem[i][0]){
      return r8(vmem[i][1],o-vmem[i][0])
    }
  };
  // error out
}
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

/*
Now I should be able to start decoding and running instructions. I'll build the
implemented instruction incrementally so initially I can start with all
instructions replaced with a single unimplemented instrution that just throws an
error. The aim of the game is then:

run
throw error
implement instruction
rinse repeat until the whole program runs
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
var go = function(){
  try{
    while(1){
      step();
    }
  } catch(e){
    print(e);
  };
};
ins[0x58]=function(){
  print("pop    %eax");
  eip++;
};
ins[0x5b]=function(){
  print("pop    %ebx");
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
  eip=eip+2;
};

ins2[0xd2]=function(){
  print("xor    %edx,%edx");
  eip=eip+2;
};

ins[0x6a]=function(){
  print("push   $0x"+(vr8(vmem,eip+1).toString(16)));
  eip=eip+2;
};


ins[0xcd]=function(){
  print("int   $0x"+(vr8(vmem,eip+1).toString(16)));
  eip=eip+2;
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
  eip=eip+2;
};

go();

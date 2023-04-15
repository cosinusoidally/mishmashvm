print("make sure there is already a generated snapshot in path");
path='../../../mmaux/snap2/';
use_snap=true;
load('bootstrap_proto18.js');
use_snap=false;
path=undefined;

var go=function(x){
  vfs.writeFile("/kaem.x86",string_to_arr(x));
  kernel.run3();
};

vfs.writeFile("/foo.c",read("test_m2.c","binary"));
script=[
"./x86/artifact/M2  --architecture x86 -f ./foo.c -o ./foo.M1",
"./x86/artifact/catm ./foo-0.M1 ./M2libc/x86/x86_defs.M1  ./M2libc/x86/libc-core.M1 ./foo.M1",
"./x86/artifact/M0 ./foo-0.M1 ./foo-0.hex2",
"./x86/artifact/catm ./foo.hex2 ./M2libc/x86/ELF-x86.hex2 ./foo-0.hex2",
"./x86/artifact/hex2-0 ./foo.hex2 ./foo",
"\n"
].join("\n");
var st=Date.now();
go(script);
var fin=Date.now();
print("stderr:");
print(get_stderr(pt[2]));
print("stdout:");
print(get_stdout(pt[2]));

print("/foo.M1:");
print(arr_to_string(vfs.readFile("/foo.M1")));
print();

print("/foo-0.M1:");
print(arr_to_string(vfs.readFile("/foo-0.M1")));
print();

foo=arr_to_string(vfs.readFile("/foo-0.hex2"));
print("/foo-0.hex2:");
print(foo);
print();

print("/foo.hex2:");
print(arr_to_string(vfs.readFile("/foo.hex2")));
print();

print("build time: "+((fin-st)/1000));

load_libc();

wf=function(){
  write("/tmp/foo",new Uint8Array(vfs.readFile("/foo")));
};

var foo=foo.split("\n");

var w32=function(a,x,v){
   a[x]=v&255;
   a[x+1]=(v>>>8)&255;
   a[x+2]=(v>>>16)&255;
   a[x+3]=(v>>>24)&255;
};

var link=function(f,base){
  if(base===undefined){
    base=0;
  };
  var a=[];
  var symbols={};
  var rel32s=[];
  var abs32s=[];
  for(var i=0;i<f.length;i++){
    var c=foo[i];
    var c0=c[0];
    if(c0===":"){
      print("symbol");
      print(to_hex(a.length)+": "+c);
      symbols[c.split(":")[1]]=a.length;
    } else if (c0==="%"){
      print("rel32");
      print(to_hex(a.length)+": "+c);
      rel32s.push([a.length,c.split("%")[1]]);
      a.push(0);
      a.push(0);
      a.push(0);
      a.push(0);
    } else if (c0==="&"){
      print("abs32");
      print(to_hex(a.length)+": "+c);
      abs32s.push([a.length,c.split("&")[1]]);
      a.push(0);
      a.push(0);
      a.push(0);
      a.push(0);
    } else {
      print("hex");
      print(to_hex(a.length)+": "+c);
      for(var j=0;j<c.length;j=j+2){
        a.push("0x"+c[j]+c[j+1]);
      };
    };
  };
  var relink=function(){
  abs32s.map(function(x){
    w32(a,x[0],symbols[x[1]]+base);
  });
  rel32s.map(function(x){
    w32(a,x[0],symbols[x[1]]-x[0]-4);
//    w32(a,x[0],0xdeadbeef);
  });
  };
  relink();
  return {text:a,symbols:symbols,abs32s:abs32s,rel32s:rel32s,base:base,relink:relink};
};

var map_exec=function(size){
  return libc.mmap(ctypes.voidptr_t(0),
                  size,
                  libc.PROT_READ | libc.PROT_WRITE | libc.PROT_EXEC,
                  libc.MAP_ANONYMOUS | libc.MAP_PRIVATE,
                  0,
                  0);
};

p=map_exec(0xFFFF);

a=link(foo,p);

libc.memcpy(p,new Uint8Array(a.text),a.text.length);

fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[]);
fn=ctypes.cast(ctypes.voidptr_t(a.symbols["FUNCTION_bar"]+p),fntype.ptr);

print("fn(): "+fn());

var syscall_exit=function(regs){
  print("syscall_exit");
  return 0;
};

var syscall=function(regs){
  if(regs.eax===1){
     return syscall_exit(regs);
  } else {
    print("unsupported syscall: "+regs.eax);
  };
};

function callback_dispatch(esp){
  print("esp: "+to_hex(esp));
  r=new Int32Array(7);
  libc.memcpy2(r,esp, r.length*4)
  print("syscall: ");
  print("eax "+to_hex(r[0]));
  print("ebx "+to_hex(r[1]));
  print("ecx "+to_hex(r[2]));
  print("edx "+to_hex(r[3]));
  print("esi "+to_hex(r[4]));
  print("edi "+to_hex(r[5]));
  print("ebp "+to_hex(r[6]));
  var regs={
    eax: r[0],
    ebx: r[1],
    ecx: r[2],
    edx: r[3],
    esi: r[4],
    edi: r[5],
    ebp: r[6],
  };
  return syscall(regs);
};

var callback_dispatch_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t]);

var callback_dispatch_handle = callback_dispatch_type.ptr(callback_dispatch);
var callback_dispatch_ptr = ctypes.cast(callback_dispatch_handle,ctypes.uint32_t).value;

print("callback dispatch fn: "+to_hex(callback_dispatch_ptr));

w32(a.text,a.symbols["GLOBAL_test3"],callback_dispatch_ptr);
a.relink();

libc.memcpy(p,new Uint8Array(a.text),a.text.length);

fntype2 = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,[]);
fn2=ctypes.cast(ctypes.voidptr_t(a.symbols["FUNCTION_test2"]+p),fntype2.ptr);

print(fn2);

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
  abs32s.map(function(x){
    w32(a,x[0],symbols[x[1]]+base);
  });
  rel32s.map(function(x){
    w32(a,x[0],symbols[x[1]]-x[0]-4);
//    w32(a,x[0],0xdeadbeef);
  });
  return {text:a,symbols:symbols,abs32s:abs32s,rel32s:rel32s,base:base};
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

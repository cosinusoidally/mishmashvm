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

vfs.writeFile("/foo.c",string_to_arr(
[
"int k=200;",
"int foo(int i){",
"  return i+k;",
"}",
"int main(){",
"  return 7;",
"}",
"\n"
].join("\n")
));
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

print("/foo-0.hex2:");
print(arr_to_string(vfs.readFile("/foo-0.hex2")));
print();

print("/foo.hex2:");
print(arr_to_string(vfs.readFile("/foo.hex2")));
print();

print("build time: "+((fin-st)/1000));

load_libc();

wf=function(){
  write("/tmp/foo",new Uint8Array(vfs.readFile("/foo")));
};

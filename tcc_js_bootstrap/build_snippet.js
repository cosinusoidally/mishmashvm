
loadRelativeToScript("../lib/setup_platform.js");
var st=Date.now();
print("Setting up virtual filesystem");
print("set up compiler directories");
include_dirs=(read("compiler_dirs.txt").split("\n")).map(function(x){
  return x.slice(2);
});
include_dirs.shift();
include_dirs.pop();
FS.mkdir("/tcc_src");
include_dirs.map(function(x){
//  print(x);
  FS.mkdir("/tcc_src/"+x);
});

print("set up compiler files");
include_files=(read("compiler_files.txt").split("\n")).map(function(x){
  return x.slice(2);
});
include_files.shift();
include_files.pop();
include_files.map(function(x){
//  print("/"+x+"  tcc_src/"+x);
//  FS.mkdir(x);
  FS.writeFile("/tcc_src/"+x,read("tcc_src/"+x));
});
print("set up directories");
include_dirs=(read("include_dirs.txt").split("\n")).map(function(x){
  return x.slice(2);
});
include_dirs.shift();
include_dirs.pop();
include_dirs.map(function(x){
//  print(x);
  FS.mkdir(x);
});

print("set up files");
include_files=(read("include_files.txt").split("\n")).map(function(x){
  return x.slice(2);
});
include_files.shift();
include_files.pop();
include_files.map(function(x){
//  print("/"+x+"  ../includes/"+x);
//  FS.mkdir(x);
  FS.writeFile("/"+x,read("../includes/"+x));
});
print("Setting up fs took: "+ ((Date.now()-st)/1000)+"s");

print("starting compile");
st=Date.now();

FS.writeFile("f1.c",read("f1.c"));

run();
print("compile took: "+ ((Date.now()-st)/1000)+"s");

f=libc.fopen("out.o","wb");
op=FS.readFile("out.o");
libc.fwrite(op,op.length,1,f);


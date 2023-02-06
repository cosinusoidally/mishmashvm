load("../lib/setup_platform.js");
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
try{
  FS.writeFile("/tcc_src/"+x,read("tcc_src/"+x,"binary"),{encoding:"binary"});
} catch (e){
//  print("missing file");
}
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
try{
  FS.writeFile("/"+x,read("../includes/"+x,"binary"),{encoding:"binary"});
} catch (e){
//  print("missing file");
}
});
print("Setting up fs took: "+ ((Date.now()-st)/1000)+"s");

function compile(out_name){
  print("starting compile");
  st=Date.now();

  run();
  print("compile took: "+ ((Date.now()-st)/1000)+"s");

  f=libc.fopen(out_name,"wb");
  op=FS.readFile("out.o");
  libc.fwrite(op,op.length,1,f);
  libc.fclose(f);
}

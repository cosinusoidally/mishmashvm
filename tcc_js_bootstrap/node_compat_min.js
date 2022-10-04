fs=require("fs");
os=require("os");

print=function(x){
  console.log(x);
};

plat=os.platform();

print(plat);

read=function(x,y){
  if(arguments.length>1){
    if(y==="binary"){
      var b=fs.readFileSync(x);
      return new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    };
  };
  return fs.readFileSync(x,"utf8");
};

load=function(x){
  if(x==="../lib/setup_platform.js"){ return;};
  eval.call(this,read(x));
};

quit=function(){
  process.exit(0);
}

libc={};

libc.fopen=function(x,m){
  print("opening "+x);
  if(m==="wb"){m="w"};
  return fs.openSync(x,m);
};

libc.fwrite=function(ptr, size, nmemb, stream){
  print("fwrite "+stream);
  fs.writeSync(stream, ptr, 0,size);
};

libc.fclose=function(stream){
  print("fclose "+stream);
  fs.closeSync(stream);
};

try{
  if(plat==="linux"){
    a=require("../tests/nodejs/lib/addon_linux.node");
  };
} catch(e){
  if(process.argv[2]!=="04_mk_nodejs_addon.js"){
    print("No nodejs addon, building");
    child_process=require("child_process");
    child_process.spawnSync("js",["04_mk_nodejs_addon.js"]);
  }
};
load(process.argv[2]);

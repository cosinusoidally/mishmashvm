fs=require("fs");

print=function(x){
  console.log(x);
};

a=require("./lib/addon.node");

a.RunCallback(function(msg) {
  eval(msg);
});


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
  eval.call(this,read(x));
};

quit=function(){
  process.exit(0);
}

my_ffi_call_raw=my_ffi_call;

my_ffi_call=function(){
//  print("arguments.length: "+arguments.length);
  var args=[];
  for(var i=0;i<arguments.length;i++){
    var c=arguments[i];
    if(typeof c==="string"){
//      print("String: "+c);
      var h=new ArrayBuffer(c.length+1);
      var g=new Uint8Array(h);
      for(var j=0;j<g.length-1;j++){
        g[j]=c.charCodeAt(j);
      };
//      print(JSON.stringify(g));
      c=g;
    };
    args.push(c);
  };
//  print("call args "+JSON.stringify(args));
  return my_ffi_call_raw.apply(null,args);
};

print(my_ffi_call(fn_ptr2,"libbar.so"));

f="my buffer string";
print(f);
h=new ArrayBuffer(f.length+1);
g=new Uint8Array(h);
for(i=0;i<g.length-1;i++){
g[i]=f.charCodeAt(i);
}
print(JSON.stringify(g));
print(my_ffi_call(fn_ptr2,g));
print("Try array buffer print");
print(my_ffi_call(fn_ptr2,h));

ctypes={
"uint32_t":"uint32_t",
"default_abi":"default_abi",
"voidptr_t":"voidptr_t",
"char": {"ptr": "char.ptr"}
};

ctypes.voidptr_t=function(x){
  return x;
};

ctypes.open=function(x){
  var h=my_ffi_call(ctypes_open_ptr,x);
  if(h===0){ throw "Error could not open: "+x};
  var declare=function(s){
    var f_ptr=my_ffi_call(ctypes_getsym_ptr,h,s);
    if(f_ptr===0){ throw "Couldn't find symbol: "+s};
    var f=function(){
      var args=[f_ptr];
      for(var i=0;i<arguments.length;i++){
        args.push(arguments[i]);
      };
      return my_ffi_call.apply(null,args);
    };
    f.address=f_ptr;
    return f;
  };
  return {"declare": declare};
};

ctypes.FunctionType=function(x,y,z){
  return {"ptr":"ptr"};
};

ctypes.cast=function(x,y){
//  print("x: "+x);
//  print("y: "+y);
  if(y==="ptr"){
    var f=function(){
      var args=[x];
      for(var i=0;i<arguments.length;i++){
        args.push(arguments[i]);
      };
      return my_ffi_call.apply(null,args);
    };
    f.address=x;
    return f;
  };
  if(y=== "uint32_t"){
    print("address: "+x.address);
    return {value: x.address};
  };
  print("UNHANDLED");
  throw "unhandled";
};

ff="libc.so.6";
my_libc=my_ffi_call(ctypes_open_ptr,ff);
print("my_libc "+my_libc);
sym="puts";
puts_ptr=my_ffi_call(ctypes_getsym_ptr,my_libc,sym);

print("puts_ptr: "+puts_ptr);

my_ffi_call(puts_ptr,"hello world via node.js ffi call");

load("mishmashvm.js");

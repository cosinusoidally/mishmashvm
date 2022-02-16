read=function(x,y){
  if(arguments.length>1){
    if(y==="binary"){
      return readFile(x);
    };
  };
  return buf_to_string(readFile(x));
}

function load(x){
  eval.call(this,read(x));
};

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
//  print("opening: "+x);
  return {"declare": function(y){
//                       print("declaring: "+y);
                       return function(z){}}};
};

ctypes.FunctionType=function(x,y,z){
  return {"ptr":0};
};

ctypes.cast=function(x,y){
  return function(){};
};


print("hello world");

print(my_ffi_call(fn_ptr,3e9,11,12,13));
print(my_ffi_call(fn_ptr2,get_str_address("libbar.so")));
print(typeof (new ArrayBuffer(1)));
print(typeof (new Uint8Array(1)));
f="my buffer string";
print(f);
g=new Uint8Array(f.length+1);
for(i=0;i<g.length-1;i++){
g[i]=f.charCodeAt(i);
}
print(JSON.stringify(g));
print(my_ffi_call(fn_ptr2,get_buffer_address(g)));

my_ffi_call_raw=my_ffi_call;
my_ffi_call=function(){
  var args=[];
  for(var i=0;i<arguments.length;i++){
    var c=arguments[i];
    if(typeof c==="string"){
      c=get_str_address(c);
    };
    if(typeof c==="object"){
      c=get_buffer_address(c);
    };
    args.push(c);
  };
  return my_ffi_call_raw.apply(null,args);
};

print(my_ffi_call(fn_ptr2,"foo.so"));
print(my_ffi_call(fn_ptr2,g));

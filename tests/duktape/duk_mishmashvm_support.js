read=function(x,y){
  if(arguments.length>1){
    if(y==="binary"){
      return readFile(x);
    };
  };
  return buf_to_string(readFile(x));
}

function load(x){
//  print(x);
  // stubbing out use of lib files since the compat later hasn't
  // been written yet
  if(x==="../lib/setup_platform.js"){return;};
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

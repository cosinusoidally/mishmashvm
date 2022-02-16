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
//  print("arguments.length: "+arguments.length);
  var args=[];
  for(var i=0;i<arguments.length;i++){
    var c=arguments[i];
    if(typeof c==="string"){
//      print(c);
      c=get_str_address(c);
//      print(c);
    };
    if(typeof c==="object"){
      c=get_buffer_address(c);
    };
    args.push(c);
  };
  return my_ffi_call_raw.apply(null,args);
};
/*
ff="libc.so.6";
foo="foo.so"
print(my_ffi_call(fn_ptr2,foo));
print(my_ffi_call(fn_ptr2,g));
print(my_ffi_call(fn_ptr,3e9,11,12,13));
my_libc=my_ffi_call(ctypes_open_ptr,ff);
sym="puts";
puts_ptr=my_ffi_call(ctypes_getsym_ptr,my_libc,sym);

//print(puts_ptr);

my_ffi_call(puts_ptr,"hello world via duktape ffi call");
*/
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

/*
load("lib/setup_platform.js");

libc.puts("Hello world from duktape via js-ctypes");
print(libc.malloc_fntype.ptr);
*/

load("mishmashvm.js");
test(4);

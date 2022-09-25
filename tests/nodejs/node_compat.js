function print(x){
  console.log(x);
};

a=require("./lib/addon.node");

a.RunCallback(function(msg) {
  eval(msg);
});


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

function my_ffi_call(a,b){
  print("ptr: "+a+" arg: "+b);
};

print(my_ffi_call(fn_ptr2,get_str_address("libbar.so")));

f="my buffer string";
print(f);
g=new Uint8Array(f.length+1);
for(i=0;i<g.length-1;i++){
g[i]=f.charCodeAt(i);
}
print(JSON.stringify(g));
print(my_ffi_call(fn_ptr2,get_buffer_address(g)));

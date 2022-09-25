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

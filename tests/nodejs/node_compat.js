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

my_ffi_call_raw=my_ffi_call;

my_ffi_call=function(){
//  print("arguments.length: "+arguments.length);
  var args=[];
  for(var i=0;i<arguments.length;i++){
    var c=arguments[i];
    if(typeof c==="string"){
      var h=new ArrayBuffer(c.length+1);
      var g=new Uint8Array(h);
      for(var i=0;i<g.length-1;i++){
        g[i]=c.charCodeAt(i);
      };
      print(JSON.stringify(g));
      c=g;
    };
    args.push(c);
  };
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

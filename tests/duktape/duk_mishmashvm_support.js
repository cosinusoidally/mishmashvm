read=function(x,y){
  if(arguments.length>1){
    if(y==="binary"){
      return readFile(x);
    };
  };
  return buf_to_string(readFile(x));
}

function load(x){
  print(x);
  // stubbing out use of lib files since the compat later hasn't
  // been written yet
  if(x==="../lib/setup_platform.js"){return;};
  eval.call(this,read(x));
};

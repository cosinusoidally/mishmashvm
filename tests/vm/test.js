function bar(a,b){
var z=100;
return foo(a+1,b+2);
};
function foo(a,b){
return a+b;
};

function factorial(x) {
  if (x === 0) {
    return 1;
  };
  return x * factorial(x-1);
};

function inc(x){
  var c=0;
  x[c]=x[c]+1;
  return;
}

function inc1(x){
  var c=0;
  while(1){
    x[c]=x[c]+1;
  };
}

function inc2(x){
  var c=0;
  while(1){
    x[c]=x[c]-1;
  };
}

function inc3(x){
  var c=0;
  var d=1;
  var e=1;
  var f=1000;
  while(1){
    x[c]=x[c]+1;
    if(x[c]>f){
      x[d]=e;
    };
  };
}

function syscall(x,n,i){
  var a=0;
  var b=1;
  var r=2;
  x[a]=n;
  x[b]=i;
  return x[r];
}

function test_syscall(x,y){
  var n=1;
  var l=10;
  for(var i=0;i<l;i++){
    y[i]=syscall(x,n,i);
  };
};

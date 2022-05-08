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

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

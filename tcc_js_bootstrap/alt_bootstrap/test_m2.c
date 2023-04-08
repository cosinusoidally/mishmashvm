int k=200;

int foo(int i){
  return i+k;
}

int bar(){
  return foo(3);
}

int main(){
  return foo(1);
}

print("Hello from process 2");
st=Date.now();
while(1){
  c=Date.now();

  if(c-st>7000){
    st=c;
    print("process 2 tick");
  }
}

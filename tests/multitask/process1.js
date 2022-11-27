print("Hello from process 1");
st=Date.now();
while(1){
  c=Date.now();

  if(c-st>5000){
    st=c;
    print("process 1 tick");
  }
}

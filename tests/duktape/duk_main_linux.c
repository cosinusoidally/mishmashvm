#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>

void* L[8];
uint32_t H=0;

int ctypes_open(char *s){
  printf("Opening lib: %s\n",s);
  void *p=dlopen(s,RTLD_LAZY);
  printf("p=%u\n",p);
  if(p!=NULL){
    L[H]=p;
    H++;
    return H;
  };
  return 0;
}

int ctypes_getsym(uint32_t h,char *s){
  uint32_t p;
  printf("C Looking up: %s in %u\n",s,h);
  p=(uint32_t)dlsym(L[h-1],s);
  return p;
}

int date_now(double *x){
  x[0]=1.0;
  return 0;
}

main(){
  init();
  FILE *f;
  f=fopen("tests/duktape/duk_mishmashvm_support.js","rb");
  fseek(f,0,SEEK_END);
  uint32_t l=ftell(f);
  rewind(f);
  char *b;
  b=malloc(l);
  fread(b,1,l,f);
  fclose(f);
  char buf[128];
  sprintf(buf, "print(fn_ptr2=%u);\n",&puts);
  my_duk_run(buf);
  sprintf(buf, "print(ctypes_open_ptr=%u);\n",&ctypes_open);
  my_duk_run(buf);
  sprintf(buf, "print(ctypes_getsym_ptr=%u);\n",&ctypes_getsym);
  my_duk_run(buf);
  sprintf(buf, "print(date_now_ptr=%u);\n",&date_now);
  my_duk_run(buf);
  my_duk_run(b);
  my_duk_run("test(3)");
}

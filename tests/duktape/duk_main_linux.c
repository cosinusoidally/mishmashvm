#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>
#include <time.h>
#include <stdint.h>

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
  struct timeval tv;

  if (gettimeofday(&tv, NULL) != 0) {
    printf("gettimeofday() failed\n");
    x[0]=0.0;
    return 0;
  }

  x[0] = (((double) tv.tv_sec) * 1000.0 +
         ((double) tv.tv_usec) / 1000.0);
  return 0;
}

main(int argc,char **argv){
  char *cmd;
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
  if(argc>1){
    puts(argv[1]);
    cmd=malloc(1024);
    sprintf(cmd,"load(\"%s\")",argv[1]);
    printf(cmd);
    my_duk_run(cmd);
  } else {
    my_duk_run("test(3)");
  }
}

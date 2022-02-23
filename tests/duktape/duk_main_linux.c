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

#include "duk_main_common.c"

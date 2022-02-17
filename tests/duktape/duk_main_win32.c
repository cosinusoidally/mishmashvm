#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <time.h>

void* L[8];
uint32_t H=0;

int cbrt(){
  printf("unimplemented cbrt\n");
  exit(0);
}

int log2(){
  printf("unimplemented log2\n");
  exit(0);
}

int ctypes_open(char *s){
  printf("Opening lib: %s\n",s);
  void *p=LoadLibrary(s);
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
  p=(uint32_t)GetProcAddress(L[h-1],s);
  return p;
}

int date_now(double *x){
// https://stackoverflow.com/questions/10905892/equivalent-of-gettimeday-for-windows/26085827
  static const uint64_t EPOCH = ((uint64_t) 116444736000000000ULL);

  SYSTEMTIME  system_time;
  FILETIME    file_time;
  uint64_t    time;

  GetSystemTime( &system_time );
  SystemTimeToFileTime( &system_time, &file_time );
  time =  ((uint64_t)file_time.dwLowDateTime )      ;
  time += ((uint64_t)file_time.dwHighDateTime) << 32;

  long tv_sec  = (long) ((time - EPOCH) / 10000000L);
  long tv_usec = (long) (system_time.wMilliseconds * 1000);
  x[0] = (((double) tv_sec) * 1000.0 +
         ((double) tv_usec) / 1000.0);
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

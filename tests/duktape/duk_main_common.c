void* L[8];
uint32_t H=0;

int ctypes_open(char *s){
  printf("Opening lib: %s\n",s);
#ifdef LIN
  void *p=dlopen(s,RTLD_LAZY);
#else
  void *p=LoadLibrary(s);
#endif
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

#include "duk_boot_code.h"

main(int argc,char **argv){
  char *cmd;
  init();
  char buf[128];
  sprintf(buf, "print(fn_ptr2=%u);\n",&puts);
  my_duk_run(buf);
  sprintf(buf, "print(ctypes_open_ptr=%u);\n",&ctypes_open);
  my_duk_run(buf);
  sprintf(buf, "print(ctypes_getsym_ptr=%u);\n",&ctypes_getsym);
  my_duk_run(buf);
  sprintf(buf, "print(date_now_ptr=%u);\n",&date_now);
  my_duk_run(buf);
  my_duk_run(duk_boot_code);
  if(argc>1){
    puts(argv[1]);
    int l=strlen(argv[1]);
    printf("l=%d\n",l);
    cmd=malloc(l+40);
    for(int i=0;i<l;i++){
      if(argv[1][i]=='\\'){argv[1][i]='/';}
    }
    sprintf(cmd,"load(\"%s\")",argv[1]);
    puts(cmd);
    my_duk_run(cmd);
  } else {
    printf("mishmashvm duktape, sorry no interactive mode\n");
  }
}

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

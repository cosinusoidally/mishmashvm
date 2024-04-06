main(){
  int in, out,c;
  puts("generating duk_boot_code.h");
  in=fopen("tests/duktape/duk_mishmashvm_support.js", "rb");
  out=fopen("artifacts/duk_boot_code2.h", "wb");
  while((c=fgetc(in)) != -1){
    fputc(c,out);
  }
  fclose(out);
  exit(0);
}

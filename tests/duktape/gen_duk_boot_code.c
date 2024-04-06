main(){
  int in, out,c;
  puts("generating duk_boot_code.h");
  in=fopen("tests/duktape/duk_mishmashvm_support.js", "rb");
  out=fopen("artifacts/duk_boot_code.h", "wb");
  fprintf(out,"char *duk_boot_code = { ");
  while((c=fgetc(in)) != -1){
    fprintf(out,"%d , ", (c & 255));
  }
  fprintf(out," 10 }; ");
  fclose(out);
  exit(0);
}

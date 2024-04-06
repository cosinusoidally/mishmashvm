main(){
  int in, out;
  puts("generating duk_boot_code.h");
  in=fopen("tests/duktape/duk_mishmashvm_support.js", "rb");
  out=fopen("artifacts/duk_boot_code2.h", "wb");
  fputc('A',out);
  fclose(out);
  exit(0);
}

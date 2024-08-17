main(){
  int in, out,c;
  puts("generating duk_boot_code.h");
  in=fopen("tests/duktape/duk_mishmashvm_support.js", "rb");
  out=fopen("artifacts/duk_boot_code.h", "wb");
  fprintf(out,"char *duk_boot_code = \"");
  while((c=fgetc(in)) != -1){
    if(c == '\n') {
      fprintf(out,"\\n");
    } else if (c == '\"') {
      fprintf(out,"\\");
      fprintf(out,"\"");
    } else {
      fprintf(out,"%c", (c & 255));
    }
  }
  fprintf(out,"\";\n");
  fclose(out);
  exit(0);
}

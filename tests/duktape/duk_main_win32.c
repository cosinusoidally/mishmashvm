// dummy log2 and cbrt as they seem to be missing on win32 tcc?
int log2(){
return 0;
}
int cbrt(){
return 0;
}

main(){
init();
my_duk_run("print('hello world from win32 duktape')");
}

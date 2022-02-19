print("Generating duk_win32.exe");
load(test_path+"/tcc_win32_load.js");
build("i386-win32-tcc tests/duktape/duk_main_win32.c tests/duktape/duk_glue.c tests/duktape/duktape_src/duktape.c -I tests/duktape/duktape_src/ -o duk_win32.exe");

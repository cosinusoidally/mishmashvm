mm.compile("tcc tests/duktape/duk_main_linux.c tests/duktape/duk_glue.c tests/duktape/duktape_src/duktape.c -I tests/duktape/duktape_src/ -o duk_linux.exe -lm -ldl",{no_std_flags:true});

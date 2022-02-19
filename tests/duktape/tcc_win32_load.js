print("tcc_win32 load");
load("lib/gen_wrap.js");
libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));
tcc_win32=mm.link([tcc_win32_o,libtcc1,mm.libc_compat]);

main=tcc_win32.get_fn("main");
main();

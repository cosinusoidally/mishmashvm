load("tcc_bootstrap_min_common.js");

libc.chdir("../../tcc_bootstrap_alt/tcc_js/");

load("tcc.js");
// dummy verions of print and to_hex to speed up the build
print_orig=print;
print=function(){};
to_hex_orig=to_hex;
to_hex=function(){};
// dummy main call:
argc_argv=mk_argc_argv("tcc -r test-dlsym_wrap.c");
print(JSON.stringify(argc_argv));
main(argc_argv.argc,argc_argv.argv);
mm.writeFile("../tcc_10/tcc_boot.o",new Uint8Array(vfs["tcc_boot.o"]));
print=print_orig;
to_hex=to_hex_orig;
// temp disable as this is verbose
// check("0ee8d6110aeface2e916bd91075bc0ff535e61af6ad2b8215073ad74fefdb8fc");

load(test_path+"/duk_load.js");
libc.chdir("tcc_js_bootstrap");
print("");
print("Running the Emscripten compiled version of tcc inside Duktape. This runs:");
print("03_mk_libc_stubs.js");
print("02_mk_libc_wrap.js");
print("01_mk_tcc.js");
print("from tcc_js_bootstrap. Note no files are written to disk, this test just runs the compilation and then compares the sha256 of the generated object code to the expected values.");
print("You might want to get a cup of tea as the build process may take several minutes. Duktape appears to be significantly slower than even the Spidermonkey interpreter (though the slowness could partially be to do with Duktape being compiled with tcc, and/or some of the config flags I had to use).");
//duk_run("function read(x){print(x)}");
[
["03_mk_libc_stubs.js","b41ba780a63def95319727874d39d905bac70630fd0c21e2b8d1bb670c82a71f"],
["02_mk_libc_wrap.js","0e8e02c852a11ebec585650d3c6fa5917fb51d7b66dd1d458d3e51680c660964"],
["01_mk_tcc.js","080182b567eabf208f60fcba6182d9c7a11c5f2421398dec530bc9dded852004"]
].map(function(x){
print("Building: "+x[0]);
st=Date.now();
teardown();
init();
duk_run(read("../"+test_path+"/test_common.js"));
duk_run(read("../libc_portable_proto/sha256.js"));
duk_run(read(x[0]));
duk_run("sha256=root.sha256;print(sha256(FS.readFile('out.o')));")
print("expected sha256:");
print(x[1]);
print("took: "+((Date.now()-st)/1000)+"s");
});

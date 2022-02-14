load(test_path+"/duk.js");
libc.chdir("tcc_js_bootstrap");
print("and now for something a bit more complicated");
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
print("took: "+(Date.now()-st));
});

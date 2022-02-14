load(test_path+"/duk.js");
libc.chdir("tcc_js_bootstrap");
print("and now for something a bit more complicated");
//duk_run("function read(x){print(x)}");
st=Date.now();
duk_run(read("../libc_portable_proto/sha256.js"));
duk_run("try {"+read("03_mk_libc_stubs.js")+"}catch(e){print(e)}");
duk_run("sha256=root.sha256;print(sha256(FS.readFile('out.o')));")
print("took: "+(Date.now()-st));


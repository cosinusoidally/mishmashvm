load(test_path+"/duk_load.js");

duk_run(read(test_path+"/duk_mishmashvm_support.js"));
//duk_run("load('mishmashvm.js');test(0)");

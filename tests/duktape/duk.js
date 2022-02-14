load(test_path+"/duk_load.js");
s=read(test_path+"/tests.js");
duk_run(s);

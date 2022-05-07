print("vm demo");

test_path_old=test_path;
test_path="tests/duktape";

load(test_path+"/duk_load.js");

test_path=test_path_old;



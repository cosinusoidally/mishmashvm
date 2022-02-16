load(test_path+"/duk_load.js");

a=duk.get_fn("dummy_ffi_call");
print(a(100));
print(duk.fns["dummy_ffi_call"]);
duk_run("fn_ptr="+ctypes.cast(duk.fns["dummy_ffi_call"],ctypes.uint32_t).value);

duk_run(read(test_path+"/duk_mishmashvm_support.js"));
//duk_run("load('mishmashvm.js');test(0)");

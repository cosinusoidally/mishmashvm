load(test_path+"/duk_load.js");

a=duk.get_fn("dummy_ffi_call");
print(a(100));
print(duk.fns["dummy_ffi_call"]);
duk_run("fn_ptr="+ctypes.cast(duk.fns["dummy_ffi_call"],ctypes.uint32_t).value);

a=duk.get_fn("dummy_ctypes_open");
print(a("libfoo.so"));
print(duk.fns["dummy_ctypes_open"]);
duk_run("fn_ptr2="+ctypes.cast(duk.fns["dummy_ctypes_open"],ctypes.uint32_t).value);

var ctypes_open_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.char.ptr]);

var ctypes_open_callback = ctypes.cast(ctypes_open_type.ptr(ctypes_open),ctypes.uint32_t).value;
print("ctypes_open "+ctypes_open_callback);
duk_run("ctypes_open_ptr="+ctypes_open_callback)

var ctypes_getsym_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t,ctypes.char.ptr]);

var ctypes_getsym_callback = ctypes.cast(ctypes_getsym_type.ptr(ctypes_getsym),ctypes.uint32_t).value;
print("ctypes_getsym "+ctypes_getsym_callback);
duk_run("ctypes_getsym_ptr="+ctypes_getsym_callback)

var L=[];
function ctypes_open(s) {
  var ln=s.readString();
  print("Trying to open lib: "+ln);
  try {
    var l=ctypes.open(ln);
    L.push(l);
    print("opened: "+ln);
    return L.length;
  } catch (e){
    print("unable to find: "+ln);
  };
  return 0;
};

function ctypes_getsym(h,s){
  print("handle: "+h);
  s=s.readString();
  print("symbol: "+s);
  try {
    var sym=L[h-1].declare(s,ctypes.default_abi,ctypes.uint32_t);
    return ctypes.cast(sym,ctypes.uint32_t).value;
  } catch (e){
    print(e);
    print("unable to find symbol: "+s);
  };
  return 0;
};

duk_run(read(test_path+"/duk_mishmashvm_support.js"));
libc.puts("Test puts from Spidermonkey");
//duk_run("load('mishmashvm.js');test(0)");

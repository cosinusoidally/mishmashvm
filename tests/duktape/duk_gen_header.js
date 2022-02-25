mm.writeFile("/tmp/blah.txt",
             "char *duk_boot_code="+JSON.stringify(read(test_path+"/duk_mishmashvm_support.js))+";");

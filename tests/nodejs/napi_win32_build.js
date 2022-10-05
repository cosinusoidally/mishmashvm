load(test_path+"/tcc_win32_load.js");

//build("i386-win32-tcc -vv -I "+tcc_src+"/include -I "+tcc_src+"/win32/include -L "+tcc_src+"/win32/lib -L "+mm.cfg.tmpdir+" "+test_path+"/hello.c");
cmd="i386-win32-tcc -vv -I "+tcc_src+"/include -I "+tcc_src+"/win32/include -I "+tcc_src+"/win32/include/winapi/ -L "+tcc_src+"/win32/lib -L "+mm.cfg.tmpdir+" -I "+test_path+" -I "+test_path+"/include/node/ -shared "+test_path+ "/node.def "+test_path+"/binding_win32.c "+test_path+ "/stub.c -o "+test_path+"/lib/addon_win32.node";
print(cmd);
build(cmd);

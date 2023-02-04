print();
print("Attempting to build duk_linux.exe (it's a linux binary, not an exe, but I call it an exe just so I can easily .gitignore it)");
print("This build will only work on Linux");
print("For this to work you will need the following in ../linux_lib_bin/");
print("$ ls -l ../linux_lib_bin/");
print("-rw-r--r-- 1 XXX XXX  1396 Feb 18 14:59 crt1.o");
print("-rw-r--r-- 1 XXX XXX  1084 Feb 18 14:59 crti.o");
print("-rw-r--r-- 1 XXX XXX   440 Feb 18 14:59 crtn.o");
print("lrwxrwxrwx 1 XXX XXX    16 Feb 18 14:59 libc.so -> /lib32/libc.so.6");
print("-rw-r--r-- 1 XXX XXX 18580 Feb 18 14:59 libc_nonshared.a");
print("lrwxrwxrwx 1 XXX XXX    17 Feb 18 15:00 libdl.so -> /lib32/libdl.so.2");
print("lrwxrwxrwx 1 XXX XXX    16 Feb 18 14:59 libm.so -> /lib32/libm.so.6");
print();
print("The crt* files and libc_nonshared.a can be obtained by unpacking libc6-dev_2.27-3ubuntu1.2_i386.deb and grabbing the relevant files");
print("If libc etc are in a different directory then update the symlinks as appropriate (eg they may be under /lib/i386-linux-gnu/)");
print("If you are on 64 bit Linux you need the 32 bit libs on the system.");
print("Alternatively you can run this inside an i386 Ubuntu bionic minbase.");
print();
print("Building ....");
print("Once complete run chmod +x duk_linux.exe and then ./duk_linux.exe");
print("If it fails look in stderr.txt or stdout.txt for clues");
mm.writeFile(mm.cfg.tmpdir+"/duk_boot_code.h","char *duk_boot_code="+JSON.stringify(read(test_path+"/duk_mishmashvm_support.js"))+";");
r=mm.compile("tcc -nostdinc -nostdlib -I ./includes/usr/include/:./includes/usr/include/i386-linux-gnu/:./includes/tmp/tcc/lib/tcc/include/:"+mm.cfg.tmpdir+" ../linux_lib_bin/crt1.o ../linux_lib_bin/crti.o ../linux_lib_bin/crtn.o tests/duktape/duk_main_linux.c tests/duktape/duk_glue.c tests/duktape/duktape_src/duktape.c libc_portable_proto/tcc_bin/libtcc1.o ../linux_lib_bin/libc_nonshared.a -I tests/duktape/:tests/duktape/duktape_src/ -o duk_linux.exe -L../linux_lib_bin/ -L/lib32/ -L /lib/i386-linux-gnu/ -lc -lm -ldl",{no_std_flags:true});
if(r!==0){
  print("Build failed. Note the Linux binary can only be built on Linux");
}

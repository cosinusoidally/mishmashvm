print("virtual filesystem test");

var save_vfs_wrap;
var cached_vfs_wrap;

load("lib/gen_wrap.js");

my_tcc=mm.decode_elf(read("libc_portable_proto/tcc_bin/tcc_boot3.o","binary"));

libtcc1=mm.decode_elf(read("libc_portable_proto/tcc_bin/libtcc1.o","binary"));

libc_compat=mm.link([mm.libc_compat]);

dump_und=true;

passthrough={
  "malloc": true,
  "memset": true,
  "free": true,
  "strlen": true,
  "strcpy": true,
  "realloc": true,
  "memmove": true,
  "memcpy": true,
  "memcmp": true,
  "getenv": true,
  "strchr": true,
  "strrchr": true,
  "strcmp": true,
  "_setjmp": true,
  "atoi": true,
  "qsort": true,
  "strtod": true,
  "strtoull": true,
};

// splitting out the io operations:
io={
// format string related:
  "sscanf": true,
  "sprintf": true,
  "printf": true,
  "vsnprintf": true,
  "snprintf": true,
// file:
  "unlink": true,
  "fflush": true,
};

for(var i in io){
  passthrough[i]=io[i];
};

// io functions with vfs wrappers
io_vfs={
// old school file io:
  "open": true,
  "read": true,
  "close": true,
// new school file io:
  "fopen": true,
  "fwrite": true,
  "fputc": true,
  "fprintf": true,
  "fclose": true,
};

real_open=libc_compat.get_fn("open");
real_read=libc_compat.get_fn("read");
real_close=libc_compat.get_fn("close");

real_fopen=libc_compat.get_fn("fopen");
real_fwrite=libc_compat.get_fn("fwrite");
real_fputc=libc_compat.get_fn("fputc");
real_fprintf=libc_compat.get_fn("fprintf");
real_fclose=libc_compat.get_fn("fclose");

real_strlen=libc_compat.get_fn("strlen");
real_strcpy=libc_compat.get_fn("strcpy");

real_memcpy=libc_compat.get_fn("memcpy");
real_memcpy2=libc_compat.get_fn("memcpy");

function ptr_to_string(p){
  var pn=new Uint8Array(real_strlen(p));
  real_strcpy(pn,p);
  var pns=[];
  pn.forEach(function(x,i){pns[i]= String.fromCharCode(x)});
  return pns.join("");
};

function my_open(pathname,flags,mode){
  print("open: "+pathname+" "+flags+" "+mode);
  var pn=ptr_to_string(pathname);
  print("file open: "+JSON.stringify(pn));
  var fd;
  if(pn.split(":")[0]==="mmvfs"){
    print("virtual open: "+pn);
    if(vfs[pn]){
      print("found virtual file: "+pn);
      fd=real_open(dummy,0,0);
      vfds[fd]={file:vfs[pn],offset:0};
    } else {
      fd=new Uint32Array([-1])[0];
    };
  } else {
    fd=real_open(pn,flags,mode);
  };
  print("file fd: "+fd);
  print();
  return fd;
};

function my_read(fd,buf,count){
//  print("read: "+fd+" "+buf+" "+count);
  var s;
  if(vfds[fd]){
    var f=vfds[fd];
    print("virtual read: "+f.file.pathname+" "+f.offset);
    print();
    s=0;
    var d=f.file.data;
    var b=[];
    var c=count;
    while((f.offset<d.length) && count>0){
      b.push(d[f.offset]);
      f.offset++;
      count--;
      s++;
    };
    real_memcpy2(buf, new Uint8Array(b),count);
  } else {
    s=real_read(fd,buf,count);
  };
//  print("amount read: "+s);
//  print();
  return s;
};

function my_close(fd){
//  print("close: "+fd);
  if(vfds[fd]){
    var f=vfds[fd];
    print("virtual close: "+f.file.pathname+" "+f.offset);
    print();
    delete vfds[fd];
  };
  return real_close(fd);
};

vfds={
};

vfiles={
};

vfs={
};

dummy=test_path+"/dummy.txt";

function my_fopen(pathname,mode){
  print("fopen: "+pathname+" "+" "+mode);
  var pn=ptr_to_string(pathname);
  var mode=ptr_to_string(mode);
  print("fopen file: "+JSON.stringify(pn));
  print("fopen mode: "+JSON.stringify(mode));
  var file;
  if(pn.split(":")[0]==="mmvfs"){
    print("fopen virtual file: "+pn);
    file=real_fopen(dummy,"rb");
    vfiles[file]={pathname:pn,file: file,data:[]};
    vfs[pn]=vfiles[file];
  } else {
    file=real_fopen(pn,mode);
  };
  print("fopen file: "+file);
  print();
  return file;
};

function my_fwrite(ptr,size,nmemb,stream){
//  print("fwrite: "+ptr+" "+size+" "+nmemb+" "+stream);
  var s;
  var f;
  if(f=vfiles[stream]){
//    print("fwrite virtual");
    var len=size*nmemb;
    if(len >0){
      var buf=new Uint8Array(len);
      real_memcpy(buf,ptr,len);
      for(var i=0;i<buf.length;i++){
        f.data.push(buf[i]);
      };
    };
    s=nmemb;
  } else {
    s=real_fwrite(ptr,size,nmemb,stream);
  };
//  print("fwrite size: "+s);
//  print();
  return s;
};

function my_fputc(c,stream){
//  print("fputc: "+c+" "+" "+stream);
  var s;
  if(f=vfiles[stream]){
//    print("fputc virtual");
    f.data.push(c);
    s=c;
  } else {
    s=real_fputc(c,stream);
  };
//  print("fputc value: "+s);
//  print();
  return s;
};

// fprintf is varargs so this is not technically correct
// but will work for up to 5 integer parameters
function my_fprintf(stream,format,a3,a4,a5,a6,a7){
  print("fprintf: "+stream+" "+ptr_to_string(format));
  var s=real_fprintf(stream,format,a3,a4,a5,a6,a7);
  print("fprintf value: "+s);
  print();
  return s;
};

function my_fclose(stream){
  print("fclose: "+stream);
  var s;
  var f;
  if(f=vfiles[stream]){
    print("fclose virtual");
    delete vfiles[stream];
  };
  s=real_fclose(stream);
  return s;
};

callbacks=[
  my_open,
  my_read,
  my_fopen,
  my_fwrite,
  my_fputc,
  my_fprintf,
  my_close,
  my_fclose,
];

function callback_dispatch(f,a1,a2,a3,a4,a5,a6,a7){
  var fn=callbacks[f];
//  print(fn.name +" " +([a1,a2,a3,a4,a5,a6,a7].join(" ")));
  return fn(a1,a2,a3,a4,a5,a6,a7);
};

var callback_dispatch_type = ctypes.FunctionType(ctypes.default_abi, ctypes.uint32_t, [ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t,ctypes.uint32_t]);

var callback_dispatch_handle = callback_dispatch_type.ptr(callback_dispatch);
var callback_dispatch_ptr = ctypes.cast(callback_dispatch_handle,ctypes.uint32_t).value;

print("callback dispatch:"+callback_dispatch_ptr);

exclude={
}

overrides=[];

if(dump_und=true){
  und=[];
  for(var i=0;i<my_tcc.und.length;i++){
    var c=my_tcc.und[i].st_name;
    und.push(c);
    if(!exclude[c]){
      if(!passthrough[c]){
        d="ljw_crash_"+c;
      } else {
        d=c;
      };
      overrides.push([d,c]);
    };
  };
  und=und.sort();
  var stubs_src=[];
  stubs_src.push("ljw_stubs(){");
  my_libc_src=[];
  for(var i=0;i<und.length;i++){
    var s=und[i];
    if(!exclude[s]){
      stubs_src.push(s+"();");
      my_libc_src.push("ljw_crash_"+s+"(){printf(\"unimplemented: "+s+"\\n\");exit(1);}");
    };
  };

stubs_src.push("ljw_open();");
stubs_src.push("ljw_read();");
stubs_src.push("ljw_close();");

stubs_src.push("ljw_fopen();");
stubs_src.push("ljw_fwrite();");
stubs_src.push("ljw_fputc();");
stubs_src.push("ljw_fprintf();");
stubs_src.push("ljw_fclose();");

overrides.push(["ljw_open","open"]);
overrides.push(["ljw_read","read"]);
overrides.push(["ljw_close","close"]);

overrides.push(["ljw_fopen","fopen"]);
overrides.push(["ljw_fwrite","fwrite"]);
overrides.push(["ljw_fputc","fputc"]);
overrides.push(["ljw_fprintf","fprintf"]);
overrides.push(["ljw_fclose","fclose"]);
overrides.push(["ljw_set_callback","ljw_set_callback"]);

my_libc_src.push("\n\
int ljw_callback_ptr=0;\n\
\n\
unsigned int ljw_set_callback(unsigned int p){\n\
  ljw_callback_ptr=p;\n\
  return 0;\n\
};\n\
typedef unsigned int (* my_callback)(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7);\n\
unsigned int ljw_callback_dispatch(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7){\n\
//  printf(\"called: callback %u\\n\",f);\n\
  __asm__(\"and $0xfffffff0,%esp\");\n\
  return ((my_callback)ljw_callback_ptr)(f,a1,a2,a3,a4,a5,a6,a7);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_open(unsigned int pathname, unsigned int flags, unsigned int mode){\n\
//  printf(\"called: ljw_open %u %u %u\\n\",pathname, flags,mode);\n\
  return ljw_callback_dispatch(0,pathname,flags,mode,0,0,0,0);\n\
//  return open(pathname,flags,mode);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_read(unsigned int fd, unsigned int buf, unsigned int count){\n\
//  printf(\"called: ljw_read %u %u %u\\n\",fd, buf, count);\n\
  return ljw_callback_dispatch(1,fd,buf,count,0,0,0,0);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_fopen(unsigned int pathname, unsigned int mode){\n\
//  printf(\"called: ljw_fopen %u %u %u\\n\",pathname, mode);\n\
  return ljw_callback_dispatch(2,pathname,mode,0,0,0,0,0);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_fwrite(unsigned int ptr, unsigned int size, unsigned int nmemb, unsigned int stream){\n\
  return ljw_callback_dispatch(3,ptr,size,nmemb,stream,0,0,0);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_fputc(unsigned int c, unsigned int stream){\n\
  return ljw_callback_dispatch(4,c,stream,0,0,0,0,0);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_fprintf(unsigned int stream,unsigned int format,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7){\n\
  return ljw_callback_dispatch(5,stream,format,a3,a4,a5,a6,a7);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_close(unsigned int fd){\n\
  return ljw_callback_dispatch(6,fd,0,0,0,0,0,0);\n\
}");

my_libc_src.push("\n\
unsigned int ljw_fclose(unsigned int stream){\n\
  return ljw_callback_dispatch(7,stream,0,0,0,0,0,0);\n\
}");

  my_libc_src= my_libc_src.join("\n");
  stubs_src.push("}");
  stubs_src=stubs_src.join("\n");
//  print("stubs:");
//  print(stubs_src);
  if(!cached_vfs_wrap){
    stubs=mm.load_c_string(stubs_src);
    stubs_obj=read(mm.cfg.tmpdir+"/tmp.o","binary");
//  print(JSON.stringify(overrides, null, " "));
//  print(my_libc_src);
    my_libc=mm.load_c_string(my_libc_src);
    my_libc_obj=read(mm.cfg.tmpdir+"/tmp.o","binary");
    if(save_vfs_wrap){
      print("caching to disk");
      mm.writeFile(test_path+"/vfs_stubs.o",stubs_obj);
      mm.writeFile(test_path+"/vfs_libc.o",my_libc_obj);
    };
  } else {
    print("using cached vfs wrapper");
    stubs=mm.decode_elf(read(test_path+"/vfs_stubs.o","binary"));
    my_libc=mm.decode_elf(read(test_path+"/vfs_libc.o","binary"));
  };
};

// hack to wire up stdout and stderr (which are file backed stderr.txt/stdout.txt)
libtcc1.exports.push(mm.libc_compat.imports["stdout"]);
libtcc1.exports.push(mm.libc_compat.imports["stderr"]);

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

tcc=mm.link([my_tcc,my_wrap,libtcc1]);

tcc.get_fn("ljw_set_callback")(callback_dispatch_ptr);

main=mm.arg_wrap(tcc.get_fn("main"));
print("Load complete!");
main("tcc -nostdinc -c "+(test_path+"/hello.c -o mmvfs:hello.o"));

obj_code=mm.decode_elf(vfs["mmvfs:hello.o"].data);
linked=mm.link([obj_code,mm.libc_compat]);
linked.get_fn("main")();


main("tcc -nostdinc -nostdlib -I ./includes/usr/include/:./includes/usr/include/i386-linux-gnu/:./includes/tmp/tcc/lib/tcc/include/:./includes/usr/include/SDL -c "+(test_path+"/hello2.c -o mmvfs:hello2.o"));

obj_code2=mm.decode_elf(vfs["mmvfs:hello2.o"].data);
linked2=mm.link([obj_code2,mm.libc_compat]);
linked2.get_fn("main")();

hello3='main(){printf("hello world 3\\n");}';
h=[];
for(var i=0;i<hello3.length;i++){
  h.push(hello3.charCodeAt(i));
};
vfs["mmvfs:hello3.c"]={pathname:"mmvfs:hello3.c",data:h};


main("tcc -nostdinc -nostdlib -I ./includes/usr/include/:./includes/usr/include/i386-linux-gnu/:./includes/tmp/tcc/lib/tcc/include/:./includes/usr/include/SDL -c mmvfs:hello3.c -o mmvfs:hello3.o");

obj_code3=mm.decode_elf(vfs["mmvfs:hello3.o"].data);
linked3=mm.link([obj_code3,mm.libc_compat]);
l3=linked3.get_fn("main");
l3();

print("JIT tcc into vfs");
main("tcc -nostdinc -nostdlib -o mmvfs:tcc.o -c tcc_src/tcc.c -DCONFIG_TRIPLET=\"i386-linux-gnu\" -DTCC_TARGET_I386 -DONE_SOURCE=1 -Wall -O0 -I tcc_src/:includes/usr/include/:includes/usr/include/i386-linux-gnu/:includes/tmp/tcc/lib/tcc/include/");
main("tcc -nostdinc -nostdlib -c tcc_src/lib/libtcc1.c -o mmvfs:libtcc1.o");

tcc_new={
tcc:mm.decode_elf(vfs["mmvfs:tcc.o"].data),
libtcc1:mm.decode_elf(vfs["mmvfs:tcc.o"].data)
};

tcc_new.libtcc1.exports.push(mm.libc_compat.imports["stdout"]);
tcc_new.libtcc1.exports.push(mm.libc_compat.imports["stderr"]);

tcc2=mm.link([tcc_new.tcc,my_wrap,tcc_new.libtcc1]);

main2=mm.arg_wrap(tcc2.get_fn("main"));
main2("tcc");

main2("tcc -nostdinc -c "+(test_path+"/hello.c -o mmvfs:blah.o"));

obj_code4=mm.decode_elf(vfs["mmvfs:blah.o"].data);
linked4=mm.link([obj_code4,mm.libc_compat]);
linked4.get_fn("main")();

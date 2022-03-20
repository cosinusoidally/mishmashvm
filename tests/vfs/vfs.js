print("virtual filesystem test");
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
  "close": true,
  "unlink": true,
  "fflush": true,
  "fprintf": true,
  "fclose": true,
};

for(var i in io){
  passthrough[i]=io[i];
};

// io functions with vfs wrappers
io_vfs={
// old school file io:
  "open": true,
  "read": true,
// new school file io:
  "fopen": true,
  "fwrite": true,
  "fputc": true,
};

real_open=libc_compat.get_fn("open");
real_read=libc_compat.get_fn("read");

real_fopen=libc_compat.get_fn("fopen");
real_fwrite=libc_compat.get_fn("fwrite");
real_fputc=libc_compat.get_fn("fputc");

real_strlen=libc_compat.get_fn("strlen");
real_strcpy=libc_compat.get_fn("strcpy");

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
  var fd=real_open(pathname,flags,mode);
  print("file fd: "+fd);
  print();
  return fd;
};

function my_read(fd,buf,count){
  print("read: "+fd+" "+buf+" "+count);
  var s=real_read(fd,buf,count);
  print("amount read: "+s);
  print();
  return s;
};

function my_fopen(pathname,mode){
  print("fopen: "+pathname+" "+" "+mode);
  var pn=ptr_to_string(pathname);
  var mode=ptr_to_string(mode);
  print("fopen file: "+JSON.stringify(pn));
  print("fopen mode: "+JSON.stringify(mode));
  var file=real_fopen(pathname,mode);
  print("fopen file: "+file);
  print();
  return file;
};

function my_fwrite(ptr,size,nmemb,stream){
  print("fwrite: "+ptr+" "+size+" "+nmemb+" "+stream);
  var s=real_fwrite(ptr,size,nmemb,stream);
  print("fwrite size: "+s);
  print();
  return s;
};

function my_fputc(c,stream){
  print("fputc: "+c+" "+" "+stream);
  var s=real_fputc(c,stream);
  print("fputc value: "+s);
  print();
  return s;
};

callbacks=[
  my_open,
  my_read,
  my_fopen,
  my_fwrite,
  my_fputc,
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

stubs_src.push("ljw_fopen();");
stubs_src.push("ljw_fwrite();");
stubs_src.push("ljw_fputc();");

overrides.push(["ljw_open","open"]);
overrides.push(["ljw_read","read"]);

overrides.push(["ljw_fopen","fopen"]);
overrides.push(["ljw_fwrite","fwrite"]);
overrides.push(["ljw_fputc","fputc"]);

my_libc_src.push("\n\
typedef unsigned int (* my_callback)(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7);\n\
unsigned int ljw_callback_dispatch(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7){\n\
//  printf(\"called: callback %u\\n\",f);\n\
  __asm__(\"and $0xfffffff0,%esp\");\n\
  return ((my_callback)"+callback_dispatch_ptr+")(f,a1,a2,a3,a4,a5,a6,a7);\n\
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

  my_libc_src= my_libc_src.join("\n");
  stubs_src.push("}");
  stubs_src=stubs_src.join("\n");
//  print("stubs:");
//  print(stubs_src);
  stubs=mm.load_c_string(stubs_src);
//  print(JSON.stringify(overrides, null, " "));
//  print(my_libc_src);
  my_libc=mm.load_c_string(my_libc_src);
};

// hack to wire up stdout and stderr (which are file backed stderr.txt/stdout.txt)
libtcc1.exports.push(mm.libc_compat.imports["stdout"]);
libtcc1.exports.push(mm.libc_compat.imports["stderr"]);

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

tcc=mm.link([my_tcc,my_wrap,libtcc1]);

main=mm.arg_wrap(tcc.get_fn("main"));
print("Load complete!");
main("tcc -nostdinc -c "+(test_path+"/hello.c"));

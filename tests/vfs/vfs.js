print("virtual filesystem test");
load("lib/gen_wrap.js");

my_tcc=mm.decode_elf(read("libc_portable_proto/tcc_bin/tcc_boot3.o","binary"));

libtcc1=mm.decode_elf(read("libc_portable_proto/tcc_bin/libtcc1.o","binary"));

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
  "open": true,
  "read": true,
  "close": true,
  "unlink": true,
  "fflush": true,
  "fprintf": true,
  "fopen": true,
  "fwrite": true,
  "fputc": true,
  "fclose": true,
};

for(var i in io){
  passthrough[i]=io[i];
};

// io functions with vfs wrappers
io_vfs={

};

callbacks=[
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

my_libc_src.push("\n\
typedef unsigned int (* my_callback)(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7);\n\
unsigned int ljw_callback_dispatch(unsigned int f,unsigned int a1,unsigned int a2,unsigned int a3,unsigned int a4,unsigned int a5,unsigned int a6,unsigned int a7){\n\
//  printf(\"called: callback %u\\n\",f);\n\
  __asm__(\"and $0xfffffff0,%esp\");\n\
  return ((my_callback)"+callback_dispatch_ptr+")(f,a1,a2,a3,a4,a5,a6,a7);\n\
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

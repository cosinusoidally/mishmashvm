print("Loading lib/mishmashvm_lib.js");
var mm={};
mm.print=print;
mm.cfg_file="../mmvm_cfg.json";
mm.printo=function(x){print(JSON.stringify(x))};
try {
  mm.print("Loading "+mm.cfg_file);
  mm.cfg=JSON.parse(read(mm.cfg_file));
  mm.print("Contents of "+mm.cfg_file+" :");
  mm.printo(mm.cfg);
  if(mm.cfg.tmpdir===undefined){
    print("Config error, you need to set the value of tmpdir in "+mm.cfg_file);
    throw "error";
  }
  mm.print("Checking tmpdir exists and is writable");
  try {
    var f=libc.fopen(mm.cfg.tmpdir+"/check.txt","wb");
    if(f===0){throw "error";};
    libc.fclose(f);
  } catch (e2) {
    mm.print("Can't write to tmpdir, please make sure directory exists and is writable");
    throw "error";
  }
  mm.print("Ok, tmpdir exists and is writable");
} catch(e){
  mm.print("Failed to initialise config, make sure your "+mm.cfg_file+" config files exists and that the config is correct, also check above for any other errors (eg unwritable tmpdir)");
  mm.print("Here's an example "+ mm.cfg_file+" config file:");
  mm.print('{"tmpdir":"/dev/shm/mishmashvm_tmp/"}');
  quit();
}

mm.load_c_string=function(x,options){
  var buf=new Uint8Array(x.length);
  for(var i=0;i<x.length;i++){
    buf[i]=x.charCodeAt(i);
  };
  var f=libc.fopen(mm.cfg.tmpdir+"/tmp.c","wb");
  libc.fwrite(buf,buf.length,1,f);
  libc.fclose(f);
  mm.compile(mm.cfg.tmpdir+"/tmp.c"+" -o "+mm.cfg.tmpdir+"/tmp.o",options);
  return mm.decode_elf(read(mm.cfg.tmpdir+"/tmp.o","binary"));
}

mm.link=function(x){
  var exports={};
  for(var i=0;i<x.length;i++){
    for(var j=0;j<x[i].exports.length;j++){
      var k=x[i].exports[j];
      exports[k.st_name]=k;
    }
  }
  var o={};
  o.exports=exports;
  for(var i=0;i<x.length;i++){
    x[i].imports=exports;
    x[i].relocate_all();
  }
  o.fns={};
  o["run"]= function(x){
    if(o.fns[x]===undefined){
      var f=function(){
        var args=[];
        for(var i=0;i<arguments.length;i++){
          args.push(ctypes.uint32_t);
        };
        var f1={};
        f1.fntype = ctypes.FunctionType(ctypes.default_abi,ctypes.uint32_t,args);
        f1.fn=ctypes.cast(ctypes.voidptr_t(exports[x].address),f1.fntype.ptr);
        o.fns[x]=f1.fn;
        return f1.fn.apply(null,arguments);
      };
      o.fns[x]=f;
    };
    return o.fns[x];
  };
  return o;
}

print("Loading lib/mishmashvm_lib.js");
var mm={};
mm.cfg_file="../mmvm_cfg.json";
mm.printo=function(x){print(JSON.stringify(x))};
try {
  print("Loading "+mm.cfg_file);
  mm.cfg=JSON.parse(read(mm.cfg_file));
  print("Contents of "+mm.cfg_file+" :");
  mm.printo(mm.cfg);
  if(mm.cfg.tmpdir===undefined){
    print("Config error, you need to set the value of tmpdir in "+mm.cfg_file);
    throw "error";
  }
  print("Checking tmpdir exists and is writable");
  try {
    var f=libc.fopen(mm.cfg.tmpdir+"/check.txt","wb");
    libc.fclose(f);
  } catch (e2) {
    print("Can't write to tmpdir, please make sure directory exists and is writable");
    throw "errror";
  }
  print("Ok, tmpdir exists and is writable");
} catch(e){
  print("Failed to initialise config, make sure your "+mm.cfg_file+" config files exists and that the config is correct, also check above for any other errors (eg unwritable tmpdir)");
  print("Here's an example "+ mm.cfg_file+":");
  print('{"tmpdir":"/dev/shm/mishmashvm_tmp/"}');
}

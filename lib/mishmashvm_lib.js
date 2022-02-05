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
    libc.fclose(f);
  } catch (e2) {
    mm.print("Can't write to tmpdir, please make sure directory exists and is writable");
    throw "errror";
  }
  mm.print("Ok, tmpdir exists and is writable");
} catch(e){
  mm.print("Failed to initialise config, make sure your "+mm.cfg_file+" config files exists and that the config is correct, also check above for any other errors (eg unwritable tmpdir)");
  mm.print("Here's an example "+ mm.cfg_file+":");
  mm.print('{"tmpdir":"/dev/shm/mishmashvm_tmp/"}');
}

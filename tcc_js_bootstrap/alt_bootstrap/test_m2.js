print("make sure there is already a generated snapshot in path");
path='../../../mmaux/snap2/';
use_snap=true;
load('bootstrap_proto17.js');
use_snap=false;
path=undefined;

var go=function(x){
  vfs.writeFile("/kaem.x86",string_to_arr(x));
  kernel.run3();
};

vfs.writeFile("/foo.c",string_to_arr(
[
"blah",
].join("\n")
));
script="./x86/artifact/M2  --architecture x86 -f ./foo.c -o ./foo.M1\n";
go(script);
print("stderr:");
print(get_stderr(pt[2]));
print("stdout:");
print(get_stdout(pt[2]));

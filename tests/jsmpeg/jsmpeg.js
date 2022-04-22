print("jsmpeg demo");
print("make sure the video file exists at ../vid/big-buck-bunny.mpg");

load("lib/gen_wrap.js");

jsmpeg_srcdir=test_path+"/jsmpeg_src/";

libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));

jsmpeg_obj=mm.load_c_string(read(jsmpeg_srcdir+"/jsmpeg_all.c"),{extra_flags:"-I "+jsmpeg_srcdir});

passthrough={
};

exclude={
};

overrides=[];

und=[];
for(var i=0;i<jsmpeg_obj.und.length;i++){
  var c=jsmpeg_obj.und[i].st_name;
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
my_libc_src= my_libc_src.join("\n");
stubs_src.push("}");
stubs_src=stubs_src.join("\n");
//  print("stubs:");
//  print(stubs_src);
stubs=mm.load_c_string(stubs_src);
//  print(JSON.stringify(overrides, null, " "));
//  print(my_libc_src);
my_libc=mm.load_c_string(my_libc_src);

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

jsmpeg=mm.link([jsmpeg_obj,libtcc1]);

print("load complete");

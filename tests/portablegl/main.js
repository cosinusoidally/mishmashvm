load("lib/gen_wrap.js");
load("lib/setup_sdl.js");

libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));

obj=mm.load_c_string(read(test_path+"/sdl1_main.c"),{extra_flags:"-I"+test_path+" -I "+test_path+"/"+name});

passthrough={
  "malloc": true,
  "memmove": true,
  "memset": true,
  "free": true,
  "memcpy": true,
  "realloc": true,
  "roundf": true,
  "printf": true,
  "rand": true,
  "sprintf": true,
  "floor": true,
  "modf": true,
};

exclude={
  "SDL_Init": true,
  "SDL_SetVideoMode": true,
  "SDL_PollEvent": true,
  "SDL_GetTicks": true,
  "SDL_Flip": true,
  "SDL_Quit": true,
};

overrides=[];

und=[];
for(var i=0;i<obj.und.length;i++){
  var c=obj.und[i].st_name;
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

demo=mm.link([obj,libsdl.syms,my_wrap,libtcc1]);

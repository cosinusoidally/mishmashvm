print("This is a simple SDL example");
load("lib/setup_sdl.js");
obj_code=mm.load_c_string(read(test_path+"/simple_sdl.c"));
lib=mm.link([obj_code,libsdl.syms,mm.libc_compat]);

width=640;
height=360;

fb_r=new ArrayBuffer(width*height*4);
fb=new Uint8ClampedArray(fb_r);

function frame (){
  for(var i=0;i<fb.length;i++){
    fb[i]=Math.random()*255;
  };
};
lib.run("init_sdl")(width,height);

event_metadata = new Uint8Array(10000);
libc.memcpy2(event_metadata,lib.run("get_event_info")(),event_metadata.length);
var out=[];
var i=0;
while(event_metadata[i]!==0){
out.push(String.fromCharCode(event_metadata[i]));
i++;
};
out=JSON.parse(out.join(""));
print(JSON.stringify(out));
event_types=out.event_types;
evt=new Uint8Array(out.SDL_Event);
evt_m=libc.malloc(evt.length);
while(1){
  libc.memcpy(lib.run("get_framebuffer_sdl")(),fb,fb.length);
  while(lib.run("SDL_PollEvent")(evt_m)){
    libc.memcpy2(evt,evt_m,evt.length);
    var et=event_types[evt[0]];
    print(et);
    if(et==="SDL_QUIT"){
      lib.run("SDL_Quit")();
      quit();
    };
  };
//  lib.run("my_sdl_process_events")();
  lib.run("my_sdl_main")();
  frame();
};

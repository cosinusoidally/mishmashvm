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
lib.get_fn("init_sdl")(width,height);

while(1){
  libc.memcpy(lib.get_fn("get_framebuffer_sdl")(),fb,fb.length);
  lib.get_fn("my_sdl_process_events")();
  lib.get_fn("my_sdl_main")();
  frame();
};

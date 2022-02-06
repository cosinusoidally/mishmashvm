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
out=out.join("");
print(JSON.stringify(JSON.parse(out)));

while(1){
  libc.memcpy(lib.run("get_framebuffer_sdl")(),fb,fb.length);
  lib.run("my_sdl_main")();
  frame();
};

(function(){
  libsdl={};
  try {
    var v;
    if(plat="linux32"){
      v="libSDL-1.2.so.0";
    };
    if(plat==="win32"){
      v="SDL.dll";
    };
    print("plat "+plat);
    print("Trying to load "+v);
    libsdl.lib=ctypes.open(v);
    print("sdl loaded");
  } catch (e){
    print("Unable to set up sdl");
    quit();
  };

  libsdl.syms={};
  libsdl.syms.exports=[];
  libsdl.syms.relocate_all=function(){};
  var sym_list=[
    "SDL_Init",
    "SDL_SetVideoMode",
    "SDL_PollEvent",
    "SDL_Flip",
    "SDL_Delay",
  ];
  sym_list.map(function(x){
    print(x);
    var s={"st_name":x,"address": 0};
    s.address=ctypes.cast(libsdl.lib.declare(s.st_name,ctypes.default_abi,ctypes.uint32_t), ctypes.uint32_t).value;
    print(s);
    libsdl.syms.exports.push(s);
  });

})();

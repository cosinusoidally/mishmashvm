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
  } catch (e){
    print("Unable to set up sdl");
    quit();
  }
})();

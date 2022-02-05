print("This is a simple SDL example");
obj_code=mm.load_c_string(read(test_path+"/simple_sdl.c"));
lib=mm.link([obj_code]);


lib.run("init_sdl")();

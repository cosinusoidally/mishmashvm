print("Starting");
load("lib/setup_platform.js");
load("lib/mishmashvm_lib.js");
load("lib/elf_loader.js");
load("lib/tcc_loader.js");

tests=[
  {"path":"tests/c_snippets","script":"trivial_c.js","description":"very simple c code example"},
  {"path":"tests/sdl","script":"simple_sdl.js","description":"Simple SDL example"},
  {"path":"tests/sdl","script":"sdl_events.js","description":"Simple SDL event handling example"},
  {"path":"tests/quake1","script":"quake.js","description":"Quake 1, non-interactive demo playback"},
  {"path":"tests/duktape","script":"duk.js","description":"The Duktape JavaScript VM"},
  {"path":"tests/duktape","script":"duk_boot1.js","description":"Test first stage bootstrap with duktape (building native tcc object code using the Emscripten compiled JS version of tcc). Note this test is very slow. Note does not write any files to disk so will not break the existing native tcc code."},
  {"path":"tests/duktape","script":"duk_mishmashvm.js","description":"Run mishmashvm.js inside Duktape."},
  {"path":"tests/duktape","script":"duk_build_linux.js","description":"Build Duktape for Linux"},
  {"path":"tests/duktape","script":"duk_build_win32.js","description":"Build Duktape for win32"},
  {"path":"tests/duktape","script":"tcc_win32_hello.js","description":"win32 tcc"},
  {"path":"tests/duktape","script":"duk_intercept.js","description":"The Duktape JavaScript VM but with some libc calls intercepted"},
  {"path":"tests/vfs","script":"vfs.js","description":"testing out a virtual filesystem implementation"},
];

print_tests=function(){
  for(var i=0;i<tests.length;i++){
    print(i+": "+JSON.stringify(tests[i]));
  }
}
test=function(x){
  var t=tests[x];
  print("Running: "+t.description);
  test_path=t.path;
  load(test_path+"/"+t.script);
}

print("Tests:");
print_tests();

print();
print("To call a test run test(foo) where foo is the test number");
print("use js -i mishmashvm.js to get an interactive repl");

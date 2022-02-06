print("Starting");
load("lib/setup_platform.js");
load("lib/mishmashvm_lib.js");
load("lib/elf_loader.js");
load("lib/tcc_loader.js");

tests=[
  {"path":"tests/c_snippets","script":"trivial_c.js","description":"very simple c code example"},
  {"path":"tests/sdl","script":"simple_sdl.js","description":"Simple SDL example"}
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

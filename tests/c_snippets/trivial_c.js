print("in trivial_c.js");

c_src="\
int f1(void){\n\
  return 7;\n\
}";

print("Aim of the game is to load and run the following snippet of C");
print(c_src);

obj_code=mm.load_c_string(c_src);

print(obj_code.run("f1")());

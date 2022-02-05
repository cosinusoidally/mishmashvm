print("in trivial_c.js");

c_src="\
int f1(void){\n\
  return 70;\n\
}";

print("Aim of the game is to load and run the following snippet of C");
print(c_src);

obj_code=mm.load_c_string(c_src);
linked=mm.link([obj_code]);
print("f1(): "+linked.run("f1")());
print();
print("ok, and now another");
c_src="\
int f1(void){\n\
  return 2;\n\
}";
print(c_src);

obj_code=mm.load_c_string(c_src);
linked=mm.link([obj_code]);
print("f1(): "+linked.run("f1")());
print();
print("A more complex example");
c_src="\
int x=100;\n\
int f1(void){\n\
  return 2+x;\n\
}";
print(c_src);
print();
obj_code=mm.load_c_string(c_src);
linked=mm.link([obj_code]);
print("f1(): "+linked.run("f1")());
print("lets have f2 calling f1");
c_src="\
int x=100;\n\
int f1(int y){\n\
  return y+x;\n\
}\n\
int f2(void){\n\
return f1(5);\n\
}\n";
print(c_src);

obj_code=mm.load_c_string(c_src);
linked=mm.link([obj_code]);
print("f2(): "+linked.run("f2")());

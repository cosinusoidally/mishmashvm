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

print();
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

print();
print("Test 2 snippets:");
print("snippet 1:");
c_src1="\
int s2(void){\n\
return s1(5);\n\
}\n";
print(c_src1);
print("snippet 2:");
c_src2="\
int x=100;\n\
int s1(int y){\n\
  return y+x;\n\
}\n";
print(c_src2);

obj_code1=mm.load_c_string(c_src1);
obj_code2=mm.load_c_string(c_src2);
linked=mm.link([obj_code1,obj_code2]);
print("s2(): "+linked.run("s2")());

print();
print("Test calling a libc function");
c_src='\
#include <stdio.h>\n\
int f1(int y){\n\
  printf("Hello world\\n");\n\
  return 10;\n\
}\n';
print(c_src);

obj_code=mm.load_c_string(c_src);
linked=mm.link([obj_code]);
print("f1(): "+linked.run("f1")());

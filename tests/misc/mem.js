print("testing memory read/write from Spidermonkey 102");
print("You need Spidermonkey 102 for this test");
c_src='\
#include <stdio.h>\n\
int f1(int y){\n\
  printf("Hello world %x\\n",y);\n\
  return 0;\n\
}\n';
print(c_src);

obj_code=mm.load_c_string(c_src);
linked=mm.link([obj_code,mm.libc_compat]);

linked.get_fn("f1")(10);

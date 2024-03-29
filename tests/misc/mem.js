print("testing memory read/write from Spidermonkey 102");
print("You need Spidermonkey 102 for this test");
c_src='\
#include <stdio.h>\n\
int f1(int *y){\n\
  printf("address 0x%08x\\n",y);\n\
  printf("LENGTH_SLOT: 0x%08x\\n",y[-6]);\n\
  printf("DATA_SLOT: 0x%08x\\n",y[-2]);\n\
  printf("Patching up typed array\n");\n\
  y[-6]=1073741824;\n\
  y[-2]=0;\n\
  printf("LENGTH_SLOT: 0x%08x\\n",y[-6]);\n\
  printf("DATA_SLOT: 0x%08x\\n",y[-2]);\n\
  return 0;\n\
}\n';
print(c_src);

obj_code=mm.load_c_string(c_src);
linked=mm.link([obj_code,mm.libc_compat]);

mem=new Uint32Array(1);
linked.get_fn("f1")(mem);
print(mem.length);
gc();

function readByte(x){
  var o=x>>>2;
  var r=x&3;
  return (mem[o]>>>(r*8)) &255;
}

fn=obj_code.exports[0];
addr=fn.address;
size=fn.st_size;
bytes=[];
for(var i=0;i<size;i++){
bytes.push(("00"+readByte(addr+i).toString(16)).slice(-2));
}
print(JSON.stringify(bytes));

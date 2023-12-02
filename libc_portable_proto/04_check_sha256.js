load("sha256.js");
sha256=root.sha256;

expected={
  "my_libc.o" : "0e8e02c852a11ebec585650d3c6fa5917fb51d7b66dd1d458d3e51680c660964",
  "stubs.o" : "0cdb519efb42f22eba96bf90407e10b87868355e1d793d3a70271f09d47aa403",
  "tcc_bin/libtcc1.o" : "59483d03266a9eadb84ceafaf4ed8a37e5a5231aaf773f296a7ca097679307b3",
  "tcc_bin/tcc_boot3.o" : "b64ff3010f2de6eb50762169fc5309b66ef704924cfc21648e7b75f088af3365",
}

actual={};

objs=[
"my_libc.o",
"my_libc.o.new",
"stubs.o",
"stubs.o.new",
"tcc_bin/libtcc1.o",
"tcc_bin/libtcc1.o.new",
"tcc_bin/tcc_boot3.o",
"tcc_bin/tcc_boot3.o.new",
];

objs.map(function(x){
  var hash;
  try {
    hash=root.sha256(read(x,"binary"));
    actual[x]=hash;
    print(hash+" "+x);
  } catch(e){
    print("no such file: "+x);
  }
});

print("");

for(i in expected){
  var s;
  if(actual[i]==expected[i]){
    s="OK";
  } else {
    s="BAD";
  }
  print(i+": "+s);
}

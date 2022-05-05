var use_c;
var c_dbg;

test_path_old=test_path;
test_path="tests/duktape";

load(test_path+"/duk_load.js");

test_path=test_path_old;

duk_run("print('hello world from duktape')");
duk_compile=duk.get_fn("my_compile");
bc_addr=duk_compile("yuv.js",read(test_path+"/YCbCrToRGBA.js"));

get_ptr=duk.get_fn("my_get_address");

YCbCrToRGBA_bc=(function(){

bc=new Uint8Array(881);
libc.memcpy2(bc,bc_addr,881);

var DUK_BC_LDINT_BIAS =  (1 << 15);
var DUK_BC_JUMP_BIAS= (1 <<23);

var def={
 0xbf:"DUK__SER_MARKER"
}

var ops={
152: "DUK_OP_CLOSURE",
145: "DUK_OP_DECLVAR_CR",
7: "DUK_OP_LDUNDEF",
157: "DUK_OP_RETREG",
54: "DUK_OP_ADD_RC",
98: "DUK_OP_BASR_RC",
90: "DUK_OP_BASL_RC",
4: "DUK_OP_LDINT",
0: "DUK_OP_LDREG",
56: "DUK_OP_SUB_RR",
52: "DUK_OP_ADD_RR",
62: "DUK_OP_MUL_RC",
161: "DUK_OP_LABEL",
2: "DUK_OP_JUMP",
40: "DUK_OP_LT_RR",
50: "DUK_OP_IFFALSE_R",
122: "DUK_OP_POSTINCR",
108: "DUK_OP_GETPROP_RR",
58: "DUK_OP_SUB_RC",
112: "DUK_OP_PUTPROP_RR",
162: "DUK_OP_ENDLABEL",
158: "DUK_OP_RETUNDEF",
}

var ct={
  0:"DUK__SER_STRING",
  1:"DUK__SER_NUMBER"
};

function u8r(b,o){
  var r=b[o[0]];
  o[0]++;
  return r;
}

function u16r(b,o){
  var off=o[0];
  var r=(b[off]<<8)+b[off+1];
  o[0]=o[0]+2;;
  return r;
}

function u32r(b,o){
  var off=o[0];
  var r=(b[off]<<24)+(b[off+1]<<16)+(b[off+2]<<8)+b[off+3];
  o[0]=o[0]+4;;
  return r;
};

function ud64r(b,o){
  var off=o[0];
  var r=0;
  var ta=new ArrayBuffer(8);
  var t8=new Uint8Array(ta);
  t8[0]=b[off+7];
  t8[1]=b[off+6];
  t8[2]=b[off+5];
  t8[3]=b[off+4];
  t8[4]=b[off+3];
  t8[5]=b[off+2];
  t8[6]=b[off+1];
  t8[7]=b[off];
  o[0]=o[0]+8;;
  return (new Float64Array(ta))[0];
};

function decode_bc(bc){
  var o=[0];
  var magic=def[u8r(bc,o)];
  if(magic!=="DUK__SER_MARKER"){
    throw "not bytecode";
  };
  return decode_fn(bc,o);
};

function decode_fn(bc,o){
  var r={};
  r.count_instr=u32r(bc,o);
  r.count_const=u32r(bc,o);
  r.count_funcs=u32r(bc,o);
  r.fun_nregs=u16r(bc,o);
  r.fun_nargs=u16r(bc,o);
  u32r(bc,o);
  u32r(bc,o);
  r.fun_flags=u32r(bc,o);
  r.instrs={};
  r.instrs.raw=[];
  for(var n=r.count_instr;n>0;n--){
    r.instrs.raw.push([u8r(bc,o),u8r(bc,o),u8r(bc,o),u8r(bc,o)]);
  };
  r.instrs.dec=r.instrs.raw.map(function(x){
    if(!ops[x[3]]){
      throw "unknown opcode "+x[3];
    };
    return [x[0],x[1],x[2],ops[x[3]]];
  });
  r.consts={};
  r.consts=[];
  for(var n=r.count_const;n>0;n--){
    var t=u8r(bc,o);
    var c;
    if(ct[t]==="DUK__SER_STRING"){
      c=decode_string(bc,o);
    } else if(ct[t]==="DUK__SER_NUMBER"){
      c=decode_number(bc,o);
    } else {
      throw "invalid constant";
    }
    r.consts.push(c); 
  };
  r.fns=[];
  for(var n=r.count_funcs; n > 0; n--) {
    r.fns.push(decode_fn(bc,o)); 
  };
  return r;
};


function decode_string(b,o){
  var r={};
  r.type="DUK__SER_STRING";
  r.len=u32r(b,o);
  r.raw=[];
  for(var i=0;i<r.len;i++){
    r.raw.push(u8r(b,o));
  };
  r.value=r.raw.map(function(x){return String.fromCharCode(x)}).join("");
  return r;
};

function decode_number(b,o){
  var r={};
  r.type="DUK__SER_NUMBER";
  r.value=ud64r(b,o);
  return r;
};

var d=decode_bc(bc);

//print(JSON.stringify(d,null,2));

var f=d.fns[0];

var ins=f.instrs.dec;

function dump(){
for(var i=0;i<ins.length;i++){
print([i,ins[i]]);
};
};
function load_const(f,i){
  return f.consts[i].value;
};


function setup_fn(f,a){
  var regs=new Array(f.fun_nregs);
  for(var i=0;i<f.fun_nargs;i++){
    regs[i]=a[i];
  };
  return {ins:f.instrs.dec,regs:regs,ip:0,fn:f}; 
};

var trace;

function step_fn(fa){
  if(trace){
    print("step");
    print("ip:"+fa.ip);
  };
  var inf=fa.ins[fa.ip];
  var ins=inf[3];
  if(!vm[ins]){
    if(trace){
      print("missing "+ins);
    };
    return "error";
  };
  vm[ins](inf,fa);
  if(fa.ret){
    return "error";
  };
  if(trace){
    print();
  };
};

var vm = {
"DUK_OP_ADD_RC":function(ins,fa){
  var cv=load_const(fa.fn,ins[0]);
  var cr=fa.regs[ins[1]];
  var res=cv+cr;
  if(trace){
    print(ins);
    print("adding register: "+ins[1]+" (value "+cr+") to constant "+ins[0]+
    " (value "+cv+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_BASR_RC":function(ins,fa){
  var cv=load_const(fa.fn,ins[0]);
  var cr=fa.regs[ins[1]]; 
  var res=cr >> cv;
  if(trace){
    print(ins);
    print("shifting right register: "+ins[1]+" (value "+cr+") by constant "+ins[0]+
    " (value "+cv+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_BASL_RC":function(ins,fa){
  var cv=load_const(fa.fn,ins[0]);
  var cr=fa.regs[ins[1]]; 
  var res=cr << cv;
  if(trace){
    print(ins);
    print("shifting left register: "+ins[1]+" (value "+cr+") by constant "+ins[0]+
    " (value "+cv+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_LDINT":function(ins,fa){
  var cv=get_bc(ins)-DUK_BC_LDINT_BIAS;
  if(trace){
    print(ins);
    print("loading int: "+cv+" into register: "+ins[2]);
    print("result: "+cv);
  };
  fa.regs[ins[2]]=cv;
  fa.ip++;
},
"DUK_OP_LDREG":function(ins,fa){
  var cv=get_bc(ins);
  var res=fa.regs[cv];
  if(trace){
    print(ins);
    print("loading register: "+cv+" into register: "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_SUB_RR":function(ins,fa){
  var cc=fa.regs[ins[0]];
  var cb=fa.regs[ins[1]];
  var res=cb-cc;
  if(trace){
    print(ins);
    print("subtracting register: "+ins[1]+" (value "+cb+") from register "+ins[0]+
    " (value "+cc+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_ADD_RR":function(ins,fa){
  var cc=fa.regs[ins[0]];
  var cb=fa.regs[ins[1]];
  var res=cb+cc;
  if(trace){
    print(ins);
    print("adding register: "+ins[1]+" (value "+cb+") to register "+ins[0]+
    " (value "+cc+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_MUL_RC":function(ins,fa){
  var cv=load_const(fa.fn,ins[0]);
  var cr=fa.regs[ins[1]];
  var res=cr*cv;
  if(trace){
    print(ins);
    print("mul register: "+ins[1]+" (value "+cr+") to constant "+ins[0]+
    " (value "+cv+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_LABEL":function(ins,fa){
  if(trace){
    print(ins);
    print("label: "+get_bc(ins));
  };
  fa.ip+=3;
},
"DUK_OP_JUMP":function(ins,fa){
  fa.ip++;
  var t=get_abc(ins)-DUK_BC_JUMP_BIAS; 
  if(trace){
    print(ins);
    print("jump "+t+" relative to ip "+fa.ip);
    print("target: "+(t+fa.ip));
  };
  fa.ip=t+fa.ip;
},
"DUK_OP_LT_RR":function(ins,fa){
  var cc=fa.regs[ins[0]];
  var cb=fa.regs[ins[1]];
  var res=cb<cc;
  if(trace){
    print(ins);
    print("less than register: "+ins[1]+" (value "+cb+") from register "+ins[0]+
    " (value "+cc+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_IFFALSE_R":function(ins,fa){
  var cr=get_bc(ins);
  var cv=fa.regs[cr];
  if(trace){
    print(ins);
    print("if false regsiter: "+cr+" value: "+cv);
  };
  if(!cv){
    fa.ip++;
  };
  fa.ip++;
},
"DUK_OP_POSTINCR":function(ins,fa){
  var cr=get_bc(ins);
  var cv=fa.regs[cr];
  if(trace){
    print(ins);
    print("postinc: "+cr+" (value "+cv+") store in "+ins[2]);
  };
  var cvo=cv;
  cv++;
  fa.regs[cr]=cv
  fa.regs[ins[2]]=cvo;
  if(trace){
    print("result: "+fa.regs[cr]+" "+fa.regs[ins[2]]);
  };
  fa.ip++;
},
"DUK_OP_GETPROP_RR":function(ins,fa){
  var cc=fa.regs[ins[0]];
  var cb=fa.regs[ins[1]];
  var res=cb[cc];
  if(trace){
    print(ins);
    print("getprop: "+ins[1]+" (value "+cb+") from register "+ins[0]+
    " (value "+cc+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_SUB_RC":function(ins,fa){
  var cv=load_const(fa.fn,ins[0]);
  var cr=fa.regs[ins[1]];
  var res=cr-cv;
  if(trace){
    print(ins);
    print("sub register: "+ins[1]+" (value "+cr+") to constant "+ins[0]+
    " (value "+cv+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_PUTPROP_RR":function(ins,fa){
  var cc=fa.regs[ins[0]];
  var cb=fa.regs[ins[1]];
  var res=cc;
  if(trace){
    print(ins);
    print("putprop: "+ins[1]+" (value "+cb+") from register "+ins[0]+
    " (value "+cc+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]][cb]=res;
  fa.ip++;
},
"DUK_OP_ENDLABEL":function(ins,fa){
  if(trace){
    print(ins);
    print("endlabel: "+get_bc(ins));
  };
  fa.ip++
;
},
"DUK_OP_RETUNDEF":function(ins,fa){
  if(trace){
    print(ins);
    print("endlabel: "+get_bc(ins));
  };
  fa.ret=true;
;
},
};

function get_ins(f,ip){
  return f.instrs.dec[ip];
};

emit={

"DUK_OP_ADD_RC":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code:["regs[", ins[2], "]=","regs[", ins[1],"]+", load_const(f,ins[0]),  ";" ]
  };
},
"DUK_OP_BASR_RC":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=","regs[", ins[1],"]>>", load_const(f,ins[0]),  ";" ]
  }
},
"DUK_OP_BASL_RC":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=","regs[", ins[1],"]<<", load_const(f,ins[0]),  ";" ]
  }
},
"DUK_OP_LDINT":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=",(get_bc(ins)-DUK_BC_LDINT_BIAS),";" ]
  }
},
"DUK_OP_LDREG":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=regs[",get_bc(ins),"];" ]
  }
},
"DUK_OP_SUB_RR":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=regs[",ins[1],"]-regs[",ins[0],"];" ]
  }
},
"DUK_OP_ADD_RR":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=regs[",ins[1],"]+regs[",ins[0],"];" ]
  }
},
"DUK_OP_MUL_RC":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=","regs[", ins[1],"]*", load_const(f,ins[0]),  ";" ]
  }
},
"DUK_OP_LABEL":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["// label: "+get_bc(ins)+"\n"+"return 1;"],
    branch: [ip+3]
  }
},
"DUK_OP_JUMP":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["return 1;"],
    branch: [1+ip+get_abc(ins)-DUK_BC_JUMP_BIAS]
  };
},
"DUK_OP_LT_RR":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=regs[",ins[1],"]<regs[",ins[0],"];" ]
  }
},
"DUK_OP_IFFALSE_R":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["var r=0;\n","var cv=regs[",get_bc(ins),"];\n",
          "if(!cv){\n",
          "  r++;\n",
          "};\n",
          "r++;\n",
          "return r;"],
    branch: [ip+1,ip+2]
  };
},
"DUK_OP_POSTINCR":function(f,ip){
  var ins=get_ins(f,ip);
  return { code: ["var r=regs[",get_bc(ins),"];var ro=r++;regs[",get_bc(ins),"]=r;regs[",ins[2],"]=ro;"]};
  return [];
},
"DUK_OP_GETPROP_RR":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=regs[",ins[1],"][regs[",ins[0],"]];" ]
  }
},
"DUK_OP_SUB_RC":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code:["regs[", ins[2], "]=","regs[", ins[1],"]-", load_const(f,ins[0]),  ";" ]
 }
},
"DUK_OP_PUTPROP_RR":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2],"][regs[",ins[1],"]]=regs[",ins[0],"];" ]
  }
},
"DUK_OP_ENDLABEL":function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["// endlabel: "+get_bc(ins)+"\n"],
  }
},
"DUK_OP_RETUNDEF":function(ins,fa){
  return { code: ["return 0;\n"]};
},


};

var emit_c={};
for(i in emit){
  emit_c[i]=emit[i];
};
emit_c["DUK_OP_IFFALSE_R"]=function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["r=0;\n","cv=regs[",get_bc(ins),"];\n",
          "if(!cv){\n",
          "  r++;\n",
          "};\n",
          "r++;\n",
          "return r;"],
    branch: [ip+1,ip+2]
  };
};
emit_c["DUK_OP_POSTINCR"]=function(f,ip){
  var ins=get_ins(f,ip);
  return { code: ["r=regs[",get_bc(ins),"];ro=r++;regs[",get_bc(ins),"]=r;regs[",ins[2],"]=ro;"]};
  return [];
};
emit_c["DUK_OP_GETPROP_RR"]=function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["regs[", ins[2], "]=((unsigned char *)regs[",ins[1],"])[regs[",ins[0],"]];" ]
  }
};
emit_c["DUK_OP_PUTPROP_RR"]=function(f,ip){
  var ins=get_ins(f,ip);
  return {
    code: ["((unsigned char *)regs[", ins[2],"])[regs[",ins[1],"]]=regs[",ins[0],"];" ]
  }
};

function get_bc(ins){
  return (ins[0]<<8)+ins[1];
};

function get_abc(ins){
  return (ins[0]<<16)+(ins[1]<<8)+ins[2];
};


var width;
var height
var y;
var cb;
var cr;
var rgba;
var fs;
var fa;
function setup(y,cb,cr,rgba,width,height){
fa=setup_fn(f,[y,cb,cr,rgba,width,height]);
};

var jj=jit(f);
j2=jit(f,true);
/*
function go(){
while(step_fn(fa)!=="error"){
};
};
*/

function go(){
var t=0;
var regs=fa.regs;
var r=0;
if(use_c){
  regs=new Uint32Array(fa.regs.length);
  for(var i=0;i<regs.length;i++){
    if(typeof fa.regs[i]==="object"){
      regs[i]=get_ptr(fa.regs[i]);
    } else {
      regs[i]=fa.regs[i];
    }
  };
  print(JSON.stringify(regs));
  jj=j2;
};
var cb=jj.blocks[0];
while(r=cb[0](regs)){
/*
 print(cb[1]);
 print(cb[2]);
 print(r);
 print(t++);
 print();
*/
 cb=jj.blocks[cb[r]];
};
}

function jit(f,C){
  var branch_targets=[];
  var l=0;
  var b=[];
  var d=[];
  for(var i=0;i<f.instrs.dec.length;i++){
    var a=[];
    var c=f.instrs.dec[i];
    a.push("// ip: "+i);
    a.push("// "+c);
    var e;
    if(C){
      e=emit_c[c[3]](f,i);
    } else {
      e=emit[c[3]](f,i);
    };
    d[i]=e;
    a.push(e.code.join(""));
    a.push("// branch: "+JSON.stringify(e.branch));
    a.push([""]);
    if(e.branch){
      branch_targets.push(i);
      for(j in e.branch){
        branch_targets.push(e.branch[j]);
      };
    };
    b.push(a.join("\n"));
  };
  branch_targets.sort(function(x,y){if(x>y){return 1}});
  var b2=[0];
  for(var i=0;i<branch_targets.length;i++){
    if([branch_targets[i]]>b2[b2.length-1]){
       b2.push(branch_targets[i]);
     };
  };
  var blocks=[];
  var l=0;
  b2.push(f.instrs.dec.length);
  for(var k=0;k<b2.length;k++){
    var j=b2[k];
    var cb=[];
    for(var i=l;i<j;i++){
      cb.push(b[i]);
    };
    blocks[l]=[cb];
    if(d[j-1] ? d[j-1].branch : 0){
      blocks[l][1]=d[j-1].branch[0];
      blocks[l][2]=d[j-1].branch[1];
    } else {
      blocks[l][0].push("return 1;\n");
      blocks[l][1]=j;
    };
    l=j;
  };
  for(i in blocks){
    if(C){
      var dbg="";
      if(c_dbg){
         dbg=["printf(\"f",i,"\\n\");\n"].join("");
      };
      blocks[i][0]=["int f",i,"(unsigned int *regs){\nint r;\nint ro;\nint cv;\n",dbg,blocks[i][0].join("\n"),"\n}\n\n"].join("");
      print(blocks[i]);
    } else {
      blocks[i][0]=new Function("regs",blocks[i][0].join("\n"));
    };
  };
  if(C){
    var code=[];
    for(i in blocks){
      code.push(blocks[i][0]);
    };
    code=code.join("");
    var c_fn=mm.load_c_string(code,{"extra_flags":"-g"});
    mm.writeFile(mm.cfg.tmpdir+"/jit.c",read(mm.cfg.tmpdir+"/tmp.c","binary"));
    mm.writeFile(mm.cfg.tmpdir+"/jit.o",read(mm.cfg.tmpdir+"/tmp.o","binary"));
    var c_code=mm.link([c_fn,mm.libc_compat]);
    for(i in blocks){
      print("f"+i);
      blocks[i][0]=c_code.get_fn("f"+i);
   };
  };
  return {code_chunks:b,branch_targets:b2,blocks,branch_map:d};
};
return function (y, cb, cr, rgba, width, height){
setup(y, cb, cr, rgba, width, height);
go();
};
})();

yuv_test=(function(){
var width,height,y,cb,cr,rgba,rgba_new;

function yuv_test_setup(){
width=640;
height=360;
y=new Uint8Array(width*height);

for(var i=0;i<y.length;i++){
  y[i]=Math.random()*255;
};
cb=new Uint8Array((width/2)*(height/2));
cr=new Uint8Array((width/2)*(height/2));
for(var i=0;i<cb.length;i++){
  cb[i]=Math.random()*255;
  cr[i]=Math.random()*255;
};
rgba=new Uint8ClampedArray(width*height*4);


load("yuv.js");

rgba_new=new Uint8ClampedArray(width*height*4);
};

function yuv_test_go(){
var st=Date.now();
yuv(y,cb,cr,rgba,width,height);
print("     bytecode:"+(Date.now()-st));
var st=Date.now();
YCbCrToRGBA(y, cb, cr, rgba_new, width, height);

print("none bytecode:"+(Date.now()-st));
var mm=0;
for(var i=0;i<rgba_new.length;i++){
  if(rgba_new[i]!==rgba[i]){
    mm++;
    print("doesn't match "+i);
  };
};
if(mm===0){
  print("ok");
} else {
 print("prob");
};
};

return function yuv_test(){
yuv_test_setup();
for(var i=0;i<10;i++){
yuv_test_go();
};
};
})();
//yuv_test()
//j=jit(f);
//print(j.code_chunks.join("\n"));
//print(j.branch_targets);

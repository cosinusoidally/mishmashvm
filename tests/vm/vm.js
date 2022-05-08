print("vm demo");

var trace;

test_path_old=test_path;
test_path="tests/duktape";

load(test_path+"/duk_load.js");

test_path=test_path_old;

duk_compile=duk.get_fn("my_compile");

bc_raw=new Uint32Array(2);

duk_compile("test.js",read(test_path+"/test.js"),bc_raw);

bc_ptr=bc_raw[0];
bc_len=bc_raw[1];

print("bc_ptr:"+bc_ptr);
print("bc_len:"+bc_len);

bc=new Uint8Array(bc_len);
libc.memcpy2(bc,bc_ptr,bc_len);

var DUK_BC_LDINT_BIAS =  (1 << 15);
var DUK_BC_JUMP_BIAS= (1 <<23);
var DUK__NO_FORMALS=0xFFFFFFFF;

var def={
 0xbf:"DUK__SER_MARKER",
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
173: "DUK_OP_CSVAR_CR",
177: "DUK_OP_CALL1",
26: "DUK_OP_SEQ_RC",
48: "DUK_OP_IFTRUE_R",
160: "DUK_OP_RETCONSTN",
176: "DUK_OP_CALL0",
60: "DUK_OP_MUL_RR",
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
  var r=((b[off]<<24)+(b[off+1]<<16)+(b[off+2]<<8)+b[off+3])>>>0;
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

function gen_fn_names(d){
  d.fns_by_name={};
  for(i in d.fns){
    var f=d.fns[i];
    d.fns_by_name[f.funcname]=f;
  }
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
  print(JSON.stringify(r));
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
  var tmp32=u32r(bc,o);
  r.funcname=decode_string(bc,o).value;
  r.filename=decode_string(bc,o).value;
  r.pc2line=decode_buffer(bc,o);
  r.varmap=decode_varmap(bc,o);
  r.arr_limit=u32r(bc,o);
  print(r.arr_limit);
  if(r.arr_limit!==DUK__NO_FORMALS){
    throw "error formals";
  };
  return r;
};

function decode_varmap(b,o){
  var r=[];
  for(;;){
    var s=decode_string(b,o);
    if(s.len===0){ break;};
    r.push([s,u32r(b,o)]);
  };
  return r;
};

function decode_buffer(b,o){
  var r={};
  r.len=u32r(b,o);
  r.raw=[];
  for(var i=0;i<r.len;i++){
    r.raw.push(u8r(b,o));
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


function dump_bc(b){
  var ins=b.instrs.dec;
  for(var i=0;i<ins.length;i++){
    print(i+": "+ins[i]);
  };
};

function load_const(f,i){
  return f.consts[i].value;
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
    print("retundef: "+get_bc(ins));
  };
  fa.retval=undefined;
  fa.ret=true;
;
},
"DUK_OP_RETREG":function(ins,fa){
  if(trace){
    print(ins);
    print("retreg: "+get_bc(ins));
  };
  fa.retval=fa.regs[get_bc(ins)];
  fa.ret=true;
;
},
"DUK_OP_CLOSURE":function(ins,fa){
  if(trace){
    print(ins);
    print("DUK_OP_CLOSURE: fn index: "+get_bc(ins)+" into reg "+ins[2]);
  };
  fa.regs[2]=fa.regs[get_bc(ins)];
  fa.ip++;
;
},
"DUK_OP_DECLVAR_CR":function(ins,fa){
  if(trace){
    print(ins);
    print("DUK_OP_DECLVAR_CR:  "+get_bc(ins)+" into reg "+ins[2]);
  };
//  fa.regs[2]=fa.regs[get_bc(ins)];
  fa.ip++;
;
},
"DUK_OP_CSVAR_CR":function(ins,fa){
  if(trace){
    print(ins);
    print("DUK_OP_CSVAR_CR gets stored in "+ins[2]+" and it's name is: "+load_const(fa.fn,ins[1]) );
  };
  fa.regs[ins[2]]=load_const(fa.fn,ins[1]);
  fa.ip++;
;
},
"DUK_OP_CALL1":function(ins,fa){
  var base=get_bc(ins);
  var params=ins[2];
  if(trace){
    print(ins);
    print("DUK_OP_CALL1 has "+params+" parameters and it's base reg is: "+base);
  };
  fa.call={base:base,params:params};
  fa.ip++;
;
},
"DUK_OP_SEQ_RC":function(ins,fa){
  var cv=load_const(fa.fn,ins[0]);
  var cr=fa.regs[ins[1]];
  var res=cr === cv;
  if(trace){
    print(ins);
    print("DUK_OP_SEQ_RC strict equals: "+ins[1]+" (value "+cr+") and "+ins[0]+
    " (value "+cv+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
"DUK_OP_IFTRUE_R":function(ins,fa){
  var cr=get_bc(ins);
  var cv=fa.regs[cr];
  if(trace){
    print(ins);
    print("if true regsiter: "+cr+" value: "+cv);
  };
  if(cv){
    fa.ip++;
  };
  fa.ip++;
},
"DUK_OP_CALL0":function(ins,fa){
  var base=get_bc(ins);
  var params=ins[2];
  if(trace){
    print(ins);
    print("DUK_OP_CALL0 has "+params+" parameters and it's base reg is: "+base);
  };
  fa.call={base:base,params:params};
  fa.ip++;
;
},
"DUK_OP_RETCONSTN":function(ins,fa){
  if(trace){
    print(ins);
    print("RETCONSTN: "+get_bc(ins));
  };
  fa.retval=load_const(fa.fn,get_bc(ins));
  fa.ret=true;
;
},
"DUK_OP_MUL_RR":function(ins,fa){
  var cc=fa.regs[ins[0]];
  var cb=fa.regs[ins[1]];
  var res=cb*cc;
  if(trace){
    print(ins);
    print("DUK_OP_MUL_RR register: "+ins[1]+" (value "+cb+") from register "+ins[0]+
    " (value "+cc+") and storing in register "+ins[2]);
    print("result: "+res);
  };
  fa.regs[ins[2]]=res;
  fa.ip++;
},
};

function get_bc(ins){
  return (ins[0]<<8)+ins[1];
};

function get_abc(ins){
  return (ins[0]<<16)+(ins[1]<<8)+ins[2];
};

function gen_activation(f){

};

function gen_activation(f,a){
  var regs=new Array(f.fun_nregs);
  for(var i=0;i<f.fun_nargs;i++){
    regs[i]=a[i];
  };
  return {ins:f.instrs.dec,regs:regs,ip:0,fn:f};
};

function gen_fn_activation(d,name,args){
  if(trace){
    print("generatin avtivation for: "+name+" with args "+args);
  };
};

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
  if(trace){
    print();
  };
  return fa;
};

function run(fa,stack){
  var c;
  while(1){
  while(c=step_fn(fa)){
    if(c==="error"){
      break;
    };
    if(c.ret){
      stack.pop();
      fa=stack[stack.length-1];
      fa.regs[fa.call.base]=c.retval;
      delete fa.call;
      break;
    }
    if(c.call){
      if(trace){
      print("start call");
      };
      var b=c.call.base;
      var f_n=fa.regs[b];
      if(trace){
      print("name: "+f_n);
      print("num params: "+c.call.params);
      print("base reg number for params: "+c.call.base);
      };
      b=b+2;
      a=[];
      for(var i=b;i<b+c.call.params;i++){
        a.push(fa.regs[i]);
      };
      if(trace){
      print(a);
      print();
      };
      fa=gen_activation(d.fns_by_name[f_n],a);
      stack.push(fa);
    };
  };
  if(c==="error"){break};
  }
  if(trace){
    print(JSON.stringify(fa.regs));
  }
};
function dummy_frame(){
return{regs:[],call:{base:0},ip:0,ins:[[0,0,0,"END"]]};
};

print("got here");
var d=decode_bc(bc);
gen_fn_names(d);
print("decode done");
fa=gen_activation(d.fns[1],[1,2]);
trace=true;
dummy=dummy_frame();
run(fa,[dummy,fa]);
print()
print("outer fn");
dump_bc(d);
fa2=gen_activation(d,[]);
dummy=dummy_frame();
run(fa2,[dummy,fa2]);

print("bar");
dump_bc(d.fns[0]);
fa3=gen_activation(d.fns[0],[1,2]);
print(JSON.stringify(fa3.regs));
dummy=dummy_frame();
run(fa3,[dummy,fa3]);
print(JSON.stringify(fa3.regs));
print(JSON.stringify(dummy));

trace=false;
fa4=gen_activation(d.fns[0],[1,2]);
print(JSON.stringify(fa4.regs));
dummy2=dummy_frame();
run(fa4,[dummy2,fa4]);
print(JSON.stringify(fa4.regs));
print(JSON.stringify(dummy2));

function call_name(n,a,t){
  trace=t;
  var dummy=dummy_frame();
  var fa=gen_activation(d.fns_by_name[n],a);
  run(fa,[dummy,fa]);
  return fa.retval;
};
print("calling bar: ",call_name("bar",[5,5]));

print();
dump_bc(d.fns_by_name["factorial"]);
p=10;
print("calling factorial: "+p);
r=call_name("factorial",[p],true);
print("factorial result: "+r);


dump_bc(d.fns_by_name["inc"]);

arr=[1,2,3];
print("calling inc: "+arr);
r=call_name("inc",[arr],true);
print("arr: "+arr);

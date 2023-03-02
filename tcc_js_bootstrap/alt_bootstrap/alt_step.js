new_dummy=function(){
  print("New dummy proc");
  var alt;
  var step=function(){
    if(alt){
      return alt();
    };
  };

  var p=pt[3];

  var set_step=function(s){
    alt=s(p);
  };

  return {
    step: step,
    set_step: set_step,
    get_eip:p.get_eip,
    set_eip:p.set_eip,
    get_pid:p.get_pid,
    vr8:p.vr8,
    vr32:p.vr32,

  };
};
dummy=new_dummy();


ld=function(){
  load("alt_step.js");
};

var hex_byte=function(x){
  return ("00"+(x&255).toString(16)).slice(-2);
};

alt_step=function(p){
  var print=function(x){
    _print("pid: "+pid+", "+to_hex(get_eip())+": "+x);
  };

  var b1;
  var b2;
  var b3;

  var eip;
  var pid=p.get_pid();
  var vr8=p.vr8;
  var vr32=p.vr32;

  var get_eip=p.get_eip;
  var set_eip=p.set_eip;

  var decoded=false;

  var reg_name32=function(x){
    var regs=["EAX","ECX","EDX","EBX","ESP","EBP","ESI","EDI"];
    return regs[x];
  };

  var reg_name8=function(x){
    var regs=["AL","CL","DL","BL"];
    return regs[x];
  };

  var push_generic=function(r){
  };

  var INT_imm8=function(r){
    // B8 + rd MOV reg32,imm32 Move immediate dword to register
    print("INT_imm8 "+hex_byte(vr8(eip+1)));
    decoded=true;
    set_eip(eip+2);
  };

  var ADD_rm32_r32=function(){
    print("ADD_rm32_r32_");
    decoded=true;
    set_eip(eip+2);
  };

  var MOV_moffs32_EAX=function(r){
    // A3 MOV moffs32,EAX Move EAX to (seg:offset)
    print("MOV_moffs32_EAX "+to_hex(vr32(eip+1)));
    decoded=true;
    set_eip(eip+5);
  };

  var MOV_rm8_r8=function(){
    var reg=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    // 88 /r MOV r/m8,r8 Move byte register to r/m byte
    extra="";
    if(disp!==0){
      var extra=" "+to_hex(vr32(eip+2));
    };
    print("MOV_rm8_r8"+mode+"_"+reg_name8(reg)+extra);
    decoded=true;
    set_eip(eip+2+disp);
  };

  var MOV_r8_rm8=function(){
    var reg=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    // 8A /r MOV r8,r/m8 Move r/m byte to byte register
    extra="";
    if(disp!==0){
      var extra=" "+to_hex(vr32(eip+2));
    };
    print("MOV_rm8_r8_"+reg_name8(reg)+"_"+mode+extra);
    decoded=true;
    set_eip(eip+2+disp);
  };

  var MOV_rm32_r32=function(r){
    var reg=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    // 89 /r MOV r/m32,r32 Move dword register to r/m dword
    extra="";
    if(disp!==0){
      var extra=" "+to_hex(vr32(eip+2));
    };
    print("MOV_rm32_r32_"+mode+"_"+reg_name32(reg)+extra);
    decoded=true;
    set_eip(eip+2+disp);
  };

  var IMUL_r32_rm32_imm8=function(r){
    var reg=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    // 6B /r ib IMUL r32,r/m32,imm8 dword register <- r/m32 * sign-extended immediate byte
    extra="";
    if(disp!==0){
      var extra=" "+to_hex(vr32(eip+2));
    };
    print("IMUL_r32_rm32_imm8_"+reg_name32(reg)+"_"+mode+extra+" "+hex_byte(vr8(eip+disp+2)));
    decoded=true;
    set_eip(eip+2+disp+1);
  };


  var disp=0;

  var MOV_r32_rm32=function(r){
    var reg=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    // 8B /r MOV r32,r/32 Move dword register to r/m dword
    extra="";
    if(disp!==0){
      var extra=" "+to_hex(vr32(eip+2));
    };
    print("MOV_r32_rm32_"+reg_name32(reg)+"_"+mode+extra);
    decoded=true;
    set_eip(eip+2+disp);
  };
  var MOV_reg32_imm32=function(r){
    var reg=r[0]&7;
    // B8 + rd MOV reg32,imm32 Move immediate dword to register
    print("MOV_reg32_imm32_"+reg_name32(reg)+" "+to_hex(vr32(eip+1)));
    decoded=true;
    set_eip(eip+5);
  };

  var POP_r32=function(r){
    var reg=r[0]&7;
    // 58 + rd POP r32 Pop top of stack into dword register
    print("POP_r32_"+reg_name32(reg));
    decoded=true;
    set_eip(eip+1);
  };

  var PUSH_r32=function(r){
    var reg=r[0]&7;
    // 50 + /r PUSH r32 Push register dword
    print("PUSH_r32_"+reg_name32(reg));
    decoded=true;
    set_eip(eip+1);
  };

  var XCHG_r32_EAX=function(r){
    var reg=r[0]&7;
    // 90 + r XCHG r32,EAX Exchange dword register with EAX
    print("XCHG_r32_EAX_"+reg_name32(reg));
    decoded=true;
    set_eip(eip+1);
  };

  var PUSHFD=function(r){
    // 9C PUSHFD Push EFLAGS
    print("PUSHF");
    decoded=true;
    set_eip(eip+1);
  };

  var POPFD=function(r){
    // 9D POPFD Pop top of stack into EFLAGS
    print("POPFD");
    decoded=true;
    set_eip(eip+1);
  };

  var modrm_reg_opcode=function(x){
    return  (x>>>3)&7;
  };

  var get_mode=function(x){
    var mod=(x>>>6)&3;
    var rm=x&7;
    print("mod: "+mod+" rm: "+rm);
    var modes=[];
    modes[0]=["[EAX]","[ECX]","[EDX]","[EBX]","[--][--]","disp32","[ESI]","[EDI]"];
    modes[1]=["disp8[EAX]","disp8[ECX]","disp8[EDX]","disp8[EBX]","[--][--]","disp8[EBP]","disp8[ESI]","disp8[EDI]"];
    modes[3]=["EAX","ECX","EDX","EBX","ESP","EBP","ESI","EDI"];
    var mode=modes[mod][rm];
    if(mode==="[--][--]"){
      // FIXME decode SIB
      disp=disp+1;
    };
    if(mode==="disp32"){
      disp=disp+4;
    };
    if(mode.split("[")[0]==="disp8"){
      disp=disp+1;
    };
    if(mode!==undefined){
      return mode;
    };
    throw "undefined mode";
  };

  var LEA_r32_m=function(){
    var reg=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    // 8D /r LEA r32,m 2 Store effective address for m in register r32
    print("LEA_r32_m_"+reg_name32(reg)+"_"+mode);
    set_eip(eip+3);
    decoded=true;
  };

  var CALL_rel32=function(){
    print("CALL_rel32 "+to_hex(vr32(eip+1)));
    decoded=true;
    set_eip(eip+5);
  };

  var JMP_rel32=function(){
    print("JMP_rel32 "+to_hex(vr32(eip+1)));
    decoded=true;
    set_eip(eip+5);
  };

  var RET=function(){
    print("RET");
    decoded=true;
    set_eip(eip+1);
  };

  var CMP_AL_imm8=function(){
    print("CMP_AL_imm8 "+hex_byte(vr8(eip+1)));
    // 3C ib CMP AL,imm8 Compare immediate byte to AL
    decoded=true;
    set_eip(eip+2);
  };

  var CMP_rm32_r32=function(r){
    var reg=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    // 39 /r CMP r/m32,r32 Compare dword register to r/m dword
    extra="";
    if(disp!==0){
      var extra=" "+to_hex(vr32(eip+2));
    };
    print("CMP_rm32_r32_"+mode+"_"+reg_name32(reg)+" "+extra);
    decoded=true;
    set_eip(eip+2+disp);
  };

  var CMP_rm32_imm8=function(mode){
    // 83 /7 ib CMP r/m32,imm8 Compare sign extended immediate byte to r/m dword
    print("CMP_rm32_imm8_"+mode+" "+hex_byte(vr8(eip+2)));
    set_eip(eip+3);
  };

  var ADD_rm32_imm8=function(mode){
    // 83 /0 ib ADD r/m32,imm8 Add sign-extended immediate byte to r/m dword
    print("ADD_rm32_imm8_"+mode+" "+hex_byte(vr8(eip+2)));
    set_eip(eip+3);
  };

  var AND_rm32_imm8=function(mode){
    // 83 /4 ib AND r/m32,imm8 AND sign-extended immediate byte with r/m dword
    print("AND_rm32_imm8_"+mode+" "+hex_byte(vr8(eip+2)));
    set_eip(eip+3);
  };

  var SUB_rm32_imm8=function(mode){
    // 83 /5 ib SUB r/m32,imm8 Subtract sign-extended immediate byte from r/m dword
    print("SUB_rm32_imm8_"+mode+" "+hex_byte(vr8(eip+2)));
    set_eip(eip+3);
  };

  var _83=function(r){
    var op=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    print("0x83 class extra opcode:"+op);
    if(op===7){
      CMP_rm32_imm8(mode);
      decoded=true;
    };
    if(op===0){
      ADD_rm32_imm8(mode);
      decoded=true;
    };
    if(op===5){
      SUB_rm32_imm8(mode);
      decoded=true;
    };
    if(op===4){
      AND_rm32_imm8(mode);
      decoded=true;
    };
  };

  var SHL_rm32_imm8=function(mode){
    // C1 /4 ib SHL r/m32,imm8 3/7 Multiply r/m dword by 2, imm8 times
    print("SHL_rm32_imm8 "+hex_byte((vr8(eip+2))));
    set_eip(eip+3);
  };

  var SHR_rm32_imm8=function(mode){
    //C1 /5 ib SHR r/m32,imm8 3/7 Unsigned divide r/m dword by 2, imm8 times
    print("SHR_rm32_imm8 "+hex_byte((vr8(eip+2))));
    set_eip(eip+3);
  };

  var _c1=function(r){
    var op=modrm_reg_opcode(b2);
    var mode=get_mode(b2);
    print("0xc1 class extra opcode:"+op);
    if(op===5){
      SHR_rm32_imm8(mode);
      decoded=true;
    };
    if(op===4){
      SHL_rm32_imm8(mode);
      decoded=true;
    };
  };

  var JNLE_rel32=function(){
    // 0F 8F cw/cd JNLE rel16/32 Jump near if not less or equal (ZF=0 and SF=OF)
    print("JNLE_rel32 "+to_hex(vr32(eip+2)));
    decoded=true;
    set_eip(eip+6);
  };

  var JNE_rel32=function(){
    print("JNE_rel32 "+to_hex(vr32(eip+2)));
    decoded=true;
    set_eip(eip+6);
  };

  var JE_rel32=function(){
    // 0F 84 cw/cd JE rel16/32 Jump near if equal (ZF=1)
    print("JE_rel32 "+to_hex(vr32(eip+2)));
    decoded=true;
    set_eip(eip+6);
  };

  var JL_rel32=function(){
    print("JL_rel32 "+to_hex(vr32(eip+2)));
    decoded=true;
    set_eip(eip+6);
  };


  var MOVZX_r32_rm8 = function(){
    var reg=modrm_reg_opcode(b3);
    var mode=get_mode(b3);
    // 0F B6 /r MOVZX r32,r/m8 Move byte to dword, zero-extend
    print("MOVZX_r32_rm8_"+mode+"_"+reg_name8(reg));
    decoded=true;
    set_eip(eip+3);
  };

  var ops_0f=[
      [0x8F, JNLE_rel32],
      [0x84, JE_rel32],
      [0x85, JNE_rel32],
      [0x8C, JL_rel32],
      [0xb6, MOVZX_r32_rm8],
  ];

  var _0f=function(r){
    print("0x0f prefix");
    for(var i=0;i<ops_0f.length;i++){
      var op=ops_0f[i];
      if(op[0]===b2){
        op[1](op);
      };
    };
  };

  var step=function(){
    eip=get_eip();
    b1=vr8(eip);
    b2=vr8(eip+1);
    b3=vr8(eip+2);
    disp=0;
    var ops=[
// 0001 0303 01C3 ADD_EAX_to_EBX
    [0x01, ADD_rm32_r32],
// 0001 0310 01C8 ADD_ECX_to_EAX
// 0004 04 ADDI8_AL
// 0017 0204 0F84 JE32
    [0x0F, _0f],
// 0017 0205 0F85 JNE32
// 0017 0206 0F86 JBE32
// 0017 0214 0F8C JL32
// 0017 0217 0F8F JG32
// 0017 0266 0300 0FB6C0 MOVZX_al_EAX
// 0017 0266 0311 0FB6C9 MOVZX_cl_EAX
// 0017 0266 0333 0FB6DB MOVZX_bl_EAX
// 0071 0310 39C8 CMP_ECX_EAX
    [0x39, CMP_rm32_r32],
// 0071 0330 39D8 CMP_EBX_EAX
// 0071 0331 39D9 CMP_EBX_ECX
// 0074 3C CMPI8_AL
    [0x3C, CMP_AL_imm8],
// 0120 50 PUSH_EAX
    [0x50, PUSH_r32],
// 0121 51 PUSH_ECX
    [0x51, PUSH_r32],
// 0122 52 PUSH_EDX
    [0x52, PUSH_r32],
// 0123 53 PUSH_EBX
    [0x53, PUSH_r32],
// 0127 57 PUSH_EDI
    [0x57, PUSH_r32],
// 0130 58 POP_EAX
    [0x58, POP_r32],
// 0131 59 POP_ECX
    [0x59, POP_r32],
// 0132 5A POP_EDX
    [0x5A, POP_r32],
// 0133 5B POP_EBX
    [0x5B, POP_r32],
// 0137 5F POP_EDI
    [0x5F, POP_r32],
// 0153 0300 6BC0 IMULI8_EAX
    [0x6B, IMUL_r32_rm32_imm8 ],
// 0203 0300 83C0 ADDI8_EAX
    [0x83, _83],
// 0203 0301 83C1 ADDI8_ECX
// 0203 0302 83C2 ADDI8_EDX
// 0203 0303 83C3 ADDI8_EBX
// 0203 0340 83E0 ANDI8_EAX
// 0203 0351 83E9 SUBI8_ECX
// 0203 0370 83F8 CMPI8_EAX
// 0203 0371 83F9 CMPI8_ECX
// 0203 0372 83FA CMPI8_EDX
// 0203 0373 83FB CMPI8_EBX
// 0203 0377 83FF CMPI8_EDI
// 0210 0003 8803 STORE8_al_into_Address_EBX
    [0x88, MOV_rm8_r8],
// 0210 0012 880A STORE8_cl_into_Address_EDX
// 0211 0001 8901 STORE32_EAX_into_Address_ECX
    [0x89, MOV_rm32_r32],
// 0211 0003 8903 STORE32_EAX_into_Address_EBX
// 0211 0052 892A STORE32_EBP_into_Address_EDX
// 0211 0101 8941 STORE32_EAX_into_Address_ECX_Immediate8
// 0211 0102 8942 STORE32_EAX_into_Address_EDX_Immediate8
// 0211 0112 894A STORE32_ECX_into_Address_EDX_Immediate8
// 0211 0130 8958 STORE32_EBX_into_Address_EAX_Immediate8
// 0211 0131 8959 STORE32_EBX_into_Address_ECX_Immediate8
// 0211 0301 89C1 COPY_EAX_to_ECX
// 0211 0302 89C2 COPY_EAX_to_EDX
// 0211 0303 89C3 COPY_EAX_to_EBX
// 0211 0305 89C5 COPY_EAX_to_EBP
// 0211 0307 89C7 COPY_EAX_to_EDI
// 0211 0310 89C8 COPY_ECX_to_EAX
// 0211 0313 89CB COPY_ECX_to_EBX
// 0211 0320 89D0 COPY_EDX_to_EAX
// 0211 0325 89D5 COPY_EDX_to_EBP
// 0211 0330 89D8 COPY_EBX_to_EAX
// 0211 0331 89D9 COPY_EBX_to_ECX
// 0211 0332 89DA COPY_EBX_to_EDX
// 0211 0337 89DF COPY_EBX_to_EDI
// 0211 0350 89E8 COPY_EBP_to_EAX
// 0211 0353 89EB COPY_EBP_to_EBX
// 0211 0370 89F8 COPY_EDI_to_EAX
// 0211 0373 89FB COPY_EDI_to_EBX
// 0212 0001 8A01 LOAD8_AL_from_ECX
    [0x8A, MOV_r8_rm8],
// 0212 0002 8A02 LOAD8_AL_from_EDX
// 0212 0003 8A03 LOAD8_AL_from_EBX
// 0212 0004 0013 8A040B LOAD8_AL_from_EBX_indexed_ECX
// 0212 0010 8A08 LOAD8_CL_from_EAX
// 0212 0013 8A0B LOAD8_CL_from_EBX
// 0212 0030 8A18 LOAD8_BL_from_EAX
// 0212 0032 8A1A LOAD8_BL_from_EDX
// 0212 0113 8A4B LOAD8_CL_from_EBX_Immediate8
// 0213 0000 8B00 LOAD32_EAX_from_EAX
    [0x8B, MOV_r32_rm32],
// 0213 0001 8B01 LOAD32_EAX_from_ECX
// 0213 0011 8B09 LOAD32_ECX_from_ECX
// 0213 0013 8B0B LOAD32_ECX_from_EBX
// 0213 0022 8B12 LOAD32_EDX_from_EDX
// 0213 0033 8B1B LOAD32_EBX_from_EBX
// 0213 0035 8B1D LOAD32_Absolute32_EBX
// 0213 0100 8B40 LOAD32_EAX_from_EAX_Immediate8
// 0213 0101 8B41 LOAD32_EAX_from_ECX_Immediate8
// 0213 0102 8B42 LOAD32_EAX_from_EDX_Immediate8
// 0213 0103 8B43 LOAD32_EAX_from_EBX_Immediate8
// 0213 0110 8B48 LOAD32_ECX_from_EAX_Immediate8
// 0213 0130 8B58 LOAD32_EBX_from_EAX_Immediate8
// 0213 0131 8B59 LOAD32_EBX_from_ECX_Immediate8
// 0215 0014 0044 8D0C24 LEA32_ECX_from_esp
    [0x8D, LEA_r32_m],
// 0223 93 XCHG_EAX_EBX
    [0x93, XCHG_r32_EAX],
// 0234 9C PUSH_FLAGS
    [0x9C, PUSHFD],
// 0235 9D POP_FLAGS
    [0x9D, POPFD],
// 0243 A3 STORE32_Absolute32_eax
    [0xA3, MOV_moffs32_EAX],
// 0270 B8 LOADI32_EAX
    [0xB8, MOV_reg32_imm32],
// 0271 B9 LOADI32_ECX
    [0xB9, MOV_reg32_imm32],
// 0272 BA LOADI32_EDX
    [0xBA, MOV_reg32_imm32],
// 0273 BB LOADI32_EBX
    [0xBB, MOV_reg32_imm32],
// 0277 BF LOADI32_EDI
    [0xBF, MOV_reg32_imm32],
// 0301 0340 C1E0 SHLI8_EAX
    [0xC1, _c1],
// 0301 0350 C1E8 SHRI8_EAX
// 0303 C3 RET
    [0xC3, RET],
// 0315 0200 CD80 INT_80
    [0xCD, INT_imm8],
// 0350 E8 CALL32
    [0xE8, CALL_rel32],
// 0351 E9 JMP32
    [0xE9, JMP_rel32],
  ];
  decoded=false;
  for(var i=0;i<ops.length;i++){
    var op=ops[i];
    if(op[0]===b1){
      op[1](op);
    };
  };
  if(decoded===false){
    print("unimplemented instruction:"+hex_byte(b1)+" "+hex_byte(b2));
    throw "";
  };
  }
  return step;
};
dummy.set_step(alt_step);
dummy.set_eip(0x08048054);
var eip=dummy.get_eip();

try{
while(dummy.get_eip()<0x0804823a){
dummy.step();
};
dummy.set_eip(0x08048244);
print();
print("staring at:"+to_hex(dummy.get_eip()));
while(dummy.get_eip()<0x080482b4){
dummy.step();
};
print();
dummy.set_eip(0x080482bb);
print("staring at:"+to_hex(dummy.get_eip()));
while(dummy.get_eip()<0x08048647){
dummy.step();
};
} catch (e){
  print(e);
};

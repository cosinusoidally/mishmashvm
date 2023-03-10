count=0;
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
  load("alt_step3.js");
};

var hex_byte=function(x){
  return ("00"+(x&255).toString(16)).slice(-2);
};

alt_step=function(p,run){
  var print=function(x){
    _print("pid: "+pid+", "+to_hex(get_eip())+": "+x);
  };

  var ran;

  var b1;
  var b2;

  var disp=0;

  var eip;
  var pid=p.get_pid();
  var vr8=p.vr8;
  var vr32=p.vr32;
  var vw32=p.vw32;

  var get_dbg=p.get_dbg;

  var get_eip=p.get_eip;
  var set_eip=p.set_eip;

  var get_esp=p.get_esp;
  var set_esp=p.set_esp;

  var get_eax=p.get_eax;

  var set_IF=p.set_IF;
  var set_ZF=p.set_ZF;
  var set_SF=p.set_SF;
  var set_OF=p.set_OF;

  var get_IF=p.get_IF;
  var get_ZF=p.get_ZF;
  var get_SF=p.get_SF;
  var get_OF=p.get_OF;

  var set_status=p.set_status;

  var decoded=false;

  var ilen=0;
  var target=0;
  var imm8=0;
  var imm32=0;
  var disp32=0;
  var disp8=0;

  var mod;
  var reg;
  var reg_opcode;
  var rm;
  var mode;
  var extra;

  var rm32_src;
  var rm32_dest;

  // decoded sib
  var ss;
  var index;
  var base;

  var dbg=false;

  var reg32_getters=[
    p.get_eax,
    p.get_ecx,
    p.get_edx,
    p.get_ebx,
    p.get_esp,
    p.get_ebp,
    p.get_esi,
    p.get_edi,
  ];

  var reg32_setters=[
    function(x){ p.set_eax(x|0)},
    function(x){ p.set_ecx(x|0)},
    function(x){ p.set_edx(x|0)},
    function(x){ p.set_ebx(x|0)},
    function(x){ p.set_esp(x|0)},
    function(x){ p.set_ebp(x|0)},
    function(x){ p.set_esi(x|0)},
    function(x){ p.set_edi(x|0)},
  ];

  var set_reg8=function(r,v){
    var r32=(get_reg32(r) & 0xFFFFFF00)|(v&0xFF);
    set_reg32(r,r32);
  };

  var set_reg32=function(r,v){
//    print("reg: "+r);
//    print("value: "+to_hex(v));
    reg32_setters[r](v);
  };

  var get_reg32=function(r){
    if(dbg){
      print("r: "+r);
    };
    return reg32_getters[r]();
  };

  var reg_name32=function(x){
    var regs=["EAX","ECX","EDX","EBX","ESP","EBP","ESI","EDI"];
    return regs[x];
  };

  var reg_name8=function(x){
    var regs=["AL","CL","DL","BL"];
    return regs[x];
  };

  var placeholder=function(){
    throw "unimplemented addressing mode";
  };

  var get_mode=function(){
//    print("mod: "+mod+" rm: "+rm);
    rm32_src=placeholder;
    rm32_dest=placeholder;
    rm8_dest=placeholder;
    rm8_src=placeholder;
    extra="";
    var modes=[];
    modes[0]=["[EAX]","[ECX]","[EDX]","[EBX]","[--][--]","disp32","[ESI]","[EDI]"];
    modes[1]=["disp8[EAX]","disp8[ECX]","disp8[EDX]","disp8[EBX]","[--][--]","disp8[EBP]","disp8[ESI]","disp8[EDI]"];
    modes[3]=["EAX","ECX","EDX","EBX","ESP","EBP","ESI","EDI"];
    mode=modes[mod][rm];
    sib_set=false;
    if(mod===0){
      rm32_src=function(){return vr32(get_reg32(rm))};
      rm32_dest=function(x){vw32(get_reg32(rm),x)};

      rm8_src=function(){
        return rm32_src()&0xFF};
      rm8_dest=function(v){
        var r32=(rm32_src() & 0xFFFFFF00)|(v&0xFF);
        rm32_dest(r32);
      };
    };
    if(mode==="[--][--]"){
      // FIXME this isn't right
      rm32_src=placeholder;
      rm32_dest=placeholder;
      rm8_dest=placeholder;
      rm8_src=placeholder;
      sib_set=true;
      var sibs=[];
      sibs[0]=["[EAX]","[ECX]","[EDX]","[EBX]","none","[EBP]","[ESI]","[EDI]"];
      var sib=vr8(eip+ilen);
      ss=(sib>>>6)&3;
      index=(sib>>>3)&7;
      ss_index=sibs[ss][index];
      base=sib&7;
      if(dbg){
        extra=extra+" sib: "+sib.toString(8)+" ss:"+ss+" index:"+index+" base: "+base+" ss_index: _"+sibs[ss][index]+"_"+reg_name32(base);
      };
      if(ss_index==="none"){
        ss_base=base;
        if(dbg){
          print("ss_base: "+ss_base)
        };
      };
      if(sib===013){
        print("[ecx*1+ebx]");
      };
      ilen++;
    };
    if(mod===1){
      if(!sib_set){
        load_disp8();
        rm32_dest=function(x){
          var d=get_reg32(rm)+sign_extend8(disp8);
          if(dbg){
            print("disp8: "+disp8+" dest: "+to_hex(d));
          };
          vw32(d,x)
        };
        rm32_src=function(x){
          var d=get_reg32(rm)+sign_extend8(disp8);
          if(dbg){
            print("disp8: "+disp8+" src: "+to_hex(d));
          };
          return vr32(d)
        };
      };
    };
    if(mode==="disp32"){
      load_disp32();
      if(dbg){
        extra=extra+" "+to_hex(disp32);
      };
      rm32_dest=function(x){vw32(disp32,x)};
      rm32_src=function(){return vr32(disp32)};
    };
    if(dbg){
      if(mode.split("[")[0]==="disp8"){
        extra=extra+" "+to_hex(disp8);
      };
    };
    if(mod===3){
      rm32_src=reg32_getters[rm];
      rm32_dest=reg32_setters[rm];
    };
    if(mode!==undefined){
      return;
    };
    throw "undefined mode";
  };

  var decode_modrm=function(){
    var modrm=vr8(eip+ilen);
    ilen++;
    mod=(modrm>>>6)&3;
    reg_opcode=(modrm>>>3)&7;
    reg=reg_opcode;
    rm=modrm&7;
    get_mode();
  };

  var modrm_reg_opcode=function(x){
    return  (x>>>3)&7;
  };


  var compute_target32=function(){
    target=eip+(vr32(eip+ilen-4)|0)+ilen;
  };

  var sign_extend8 = function(x){
    if(x&0x80){
      x=x|0xFFFFFF00;
    };
    return x;
  };

  var _0f=function(r){
//    print("0x0f prefix");
    for(var i=0;i<ops_0f.length;i++){
      var op=ops_0f[i];
      if(op[0]===b2){
        op[1](op);
      };
    };
  };

  var _83=function(r){
    ilen++;
    decode_modrm();
    var op=reg_opcode;
//    print("0x83 class extra opcode:"+op);
    if(op===0){
      ADD_rm32_imm8(mode);
      decoded=true;
    };
    if(op===4){
      AND_rm32_imm8(mode);
      decoded=true;
    };
    if(op===5){
      SUB_rm32_imm8(mode);
      decoded=true;
    };
    if(op===7){
      CMP_rm32_imm8(mode);
      decoded=true;
    };
  };

  var _c1=function(r){
    ilen++;
    decode_modrm();
    var op=reg_opcode;
//    print("0xc1 class extra opcode:"+op);
    if(op===5){
      SHR_rm32_imm8(mode);
      decoded=true;
    };
    if(op===4){
      SHL_rm32_imm8(mode);
      decoded=true;
    };
  };

  var load_imm8=function(){
    imm8=vr8(eip+ilen);
    ilen++;
  };

  var load_imm32=function(){
    imm32=vr32(eip+ilen);
    ilen=ilen+4;
  };

  var load_disp32=function(){
    disp32=vr32(eip+ilen);
    ilen=ilen+4;
  };

  var load_disp8=function(){
    disp8=vr8(eip+ilen);
    ilen++;
  };

  var arith32_setflags = function(res){
    if(res===0){
      set_ZF(1);
    } else {
      set_ZF(0);
    };
    if(res<0){
      set_SF(1);
    } else {
      set_SF(0);
    };
    if(res>2147483647 || res<-2147483648){
      set_OF(1);
    } else {
      set_OF(0);
    };
  };

  var ADD_generic32=function(dest,src1,src2){
    var res=src1+src2;
    arith32_setflags(res);
    dest(res);
  };

  var CMP_generic32=function(src1,src2){
    var res=src1-src2;
    arith32_setflags(res);
  };

  var MOV_generic8=function(dest,src){
    dest(src);
  };
  var MOV_generic32=function(dest,src){
    dest(src);
  };

  var ADD_AL_imm8=function(r){
    // 04 ib ADD AL,imm8 2 Add immediate byte to AL
    ilen++;
    load_imm8();
    if(dbg){
      print("ADD_AL_imm8 "+hex_byte(imm8));
    };
    decoded=true;
    set_eip(eip+ilen);
  };

  var ADD_rm32_imm8=function(mode){
    // 83 /0 ib ADD r/m32,imm8 Add sign-extended immediate byte to r/m dword
    load_imm8();
    if(dbg){
      print("ADD_rm32_imm8_"+mode+" "+hex_byte(imm8));
    };
    if(run){
      ADD_generic32(rm32_dest,rm32_src(),sign_extend8(imm8));
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var ADD_rm32_r32=function(){
    ilen++;
    decode_modrm();
    if(dbg){
      print("ADD_rm32_r32_"+mode+" "+reg_name32(reg));
    };
    decoded=true;
    if(run){
      ADD_generic32(rm32_dest,rm32_src(),get_reg32(reg));
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var AND_rm32_imm8=function(mode){
    // 83 /4 ib AND r/m32,imm8 AND sign-extended immediate byte with r/m dword
    load_imm8();
    if(dbg){
      print("AND_rm32_imm8_"+mode+" "+hex_byte(imm8));
    };
    set_eip(eip+ilen);
  };

  var CALL_rel32=function(){
    ilen=5;
    compute_target32();
    if(dbg){
      print("CALL_rel32 "+to_hex(vr32(eip+ilen-4))+" ; "+to_hex(target));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      set_esp(get_esp()-4);
      vw32(get_esp(),get_eip());
      set_eip(target);
      ran=true;
    };
  };

  var CMP_AL_imm8=function(){
    ilen++;
    load_imm8();
    if(dbg){
      print("CMP_AL_imm8 "+hex_byte(imm8));
    };
    // 3C ib CMP AL,imm8 Compare immediate byte to AL
    decoded=true;
    set_eip(eip+ilen);
  };

  var CMP_rm32_imm8=function(mode){
    // 83 /7 ib CMP r/m32,imm8 Compare sign extended immediate byte to r/m dword
    load_imm8();
    if(dbg){
      print("CMP_rm32_imm8_"+mode+" "+hex_byte(imm8));
    };
    if(run){
      CMP_generic32(rm32_src(),sign_extend8(imm8));
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var CMP_rm32_r32=function(r){
    // 39 /r CMP r/m32,r32 Compare dword register to r/m dword
    ilen++;
    decode_modrm();
    if(dbg){
      print("CMP_rm32_r32_"+mode+"_"+reg_name32(reg)+" "+extra);
    };
    decoded=true;
    if(run){
      CMP_generic32(rm32_src(),get_reg32(reg));
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var IMUL_r32_rm32_imm8=function(r){
    ilen++;
    decode_modrm();
    load_imm8();
    // 6B /r ib IMUL r32,r/m32,imm8 dword register <- r/m32 * sign-extended immediate byte
    if(dbg){
      print("IMUL_r32_rm32_imm8_"+reg_name32(reg)+"_"+mode+extra+" "+hex_byte(imm8));
    };
    decoded=true;
    set_eip(eip+ilen);
  };

  var INT_imm8=function(r){
    ilen++;
    load_imm8();
    if(dbg){
      print("INT_imm8 "+hex_byte(imm8));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      set_status("syscall");
      ran=true;
    };
  };

  var JBE_rel32=function(){
    // 0F 86 cw/cd JBE rel16/32 Jump near if below or equal (CF=1 or ZF=1)
    ilen=6;
    compute_target32();
    if(dbg){
      print("JBE_rel32 "+to_hex(vr32(eip+ilen-4))+" ; "+to_hex(target));
    };
    decoded=true;
    set_eip(eip+ilen);
  };

  var JE_rel32=function(){
    // 0F 84 cw/cd JE rel16/32 Jump near if equal (ZF=1)
    ilen=6;
    compute_target32();
    if(dbg){
      print("JE_rel32 "+to_hex(vr32(eip+ilen-4))+" ; "+to_hex(target));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      if(get_ZF()===1){
        set_eip(target);
      };
      ran=true;
    };
  };

  var JG_rel32=function(){
    ilen=6;
    compute_target32();
    if(dbg){
      print("JG_rel32 "+to_hex(vr32(eip+ilen-4))+" ; "+to_hex(target));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      if((get_ZF()===0) && (get_SF()===get_OF())){
        set_eip(target);
      };
      ran=true;
    };
  };

  var JL_rel32=function(){
    ilen=6;
    compute_target32();
    if(dbg){
      print("JL_rel32 "+to_hex(vr32(eip+ilen-4))+" ; "+to_hex(target));
    };
    decoded=true;
    set_eip(eip+ilen);
  };

  var JMP_rel32=function(){
    ilen=5;
    compute_target32();
    if(dbg){
      print("JMP_rel32 "+to_hex(vr32(eip+ilen-4))+" ; "+to_hex(target));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      set_eip(target);
      ran=true;
    };
  };

  var JNE_rel32=function(){
    // 0F 85 cw/cd JNE rel16/32 Jump near if not equal (ZF=0)
    ilen=6;
    compute_target32();
    if(dbg){
      print("JNE_rel32 "+to_hex(vr32(eip+ilen-4))+" ; "+to_hex(target));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      if(get_ZF()===0){
        set_eip(target);
      };
      ran=true;
    };
  };

  var LEA_r32_m=function(){
    ilen++;
    decode_modrm();
    // 8D /r LEA r32,m 2 Store effective address for m in register r32
    if(dbg){
      print("LEA_r32_m_"+reg_name32(reg)+"_"+mode+extra);
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      set_reg32(reg,get_reg32(ss_base));
      ran=true;
    };
  };

  var MOV_moffs32_EAX=function(r){
    // A3 MOV moffs32,EAX Move EAX to (seg:offset)
    ilen++;
    load_imm32();
    if(dbg){
      print("MOV_moffs32_EAX "+to_hex(imm32));
    };
    decoded=true;
    if(run){
      vw32(imm32,get_eax());
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var MOV_r8_rm8=function(){
    // 8A /r MOV r8,r/m8 Move r/m byte to byte register
    ilen++;
    decode_modrm();
    if(dbg){
      print("MOV_r8_rm8_"+reg_name8(reg)+"_"+mode+extra);
    };
    decoded=true;
    if(run){
      set_reg8(reg,rm32_src());
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var MOV_rm8_r8=function(){
    // 88 /r MOV r/m8,r8 Move byte register to r/m byte
    ilen++;
    decode_modrm();
    if(dbg){
      print("MOV_rm8_r8"+mode+"_"+reg_name8(reg)+extra);
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      MOV_generic8(rm8_dest,get_reg32(reg));
      ran=true;
    };
  };

  var MOV_r32_rm32=function(r){
    // 8B /r MOV r32,r/m32 Move r/m dword to dword register
    ilen++;
    decode_modrm();
    if(dbg){
      print("MOV_r32_rm32_"+reg_name32(reg)+"_"+mode+extra);
    };
    decoded=true;
    if(run){
      set_reg32(reg,rm32_src());
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var MOV_reg32_imm32=function(r){
    // B8 + rd MOV reg32,imm32 Move immediate dword to register
    ilen++;
    load_imm32();
    var reg=r[0]&7;
    if(dbg){
      print("MOV_reg32_imm32_"+reg_name32(reg)+" "+to_hex(imm32));
    };
    decoded=true;
    if(run){
      set_reg32(reg,imm32);
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var MOV_rm32_r32=function(r){
    // 89 /r MOV r/m32,r32 Move dword register to r/m dword
    ilen++;
    decode_modrm();
    if(dbg){
      print("MOV_rm32_r32_"+mode+"_"+reg_name32(reg)+extra);
    };
    decoded=true;
    if(run){
      MOV_generic32(rm32_dest,get_reg32(reg));
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var MOVZX_r32_rm8 = function(){
    // 0F B6 /r MOVZX r32,r/m8 Move byte to dword, zero-extend
    ilen=2;
    decode_modrm();
    if(dbg){
      print("MOVZX_r32_rm8_"+mode+"_"+reg_name8(reg));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      set_reg32(reg,rm32_src()&0xFF);
      ran=true;
    };
  };

  var POPFD=function(r){
    // 9D POPFD Pop top of stack into EFLAGS
    ilen++;
    if(dbg){
      print("POPFD");
    };
    decoded=true;
    set_eip(eip+ilen);
  };

  var POP_r32=function(r){
    // 58 + rd POP r32 Pop top of stack into dword register
    var reg=r[0]&7;
    ilen++;
    if(dbg){
      print("POP_r32_"+reg_name32(reg));
    };
    decoded=true;
    if(run){
      var esp=get_esp();
      set_reg32(reg,vr32(esp));
      set_esp(esp+4);
      ran=true;
    };
    set_eip(eip+ilen);
  };

  var PUSHFD=function(r){
    // 9C PUSHFD Push EFLAGS
    ilen++;
    if(dbg){
      print("PUSHF");
    };
    decoded=true;
    set_eip(eip+ilen);
  };

  var PUSH_r32=function(r){
    // 50 + /r PUSH r32 Push register dword
    var reg=r[0]&7;
    ilen++;
    if(dbg){
      print("PUSH_r32_"+reg_name32(reg));
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      set_esp(get_esp()-4);
      vw32(get_esp(),get_reg32(reg));
      ran=true;
    };
  };

  var RET=function(){
    ilen++;
    if(dbg){
      print("RET");
    };
    decoded=true;
    set_eip(eip+ilen);
    if(run){
      set_eip(vr32(get_esp()));
      set_esp(get_esp()+4);
      ran=true;
    };
  };

  var SHL_rm32_imm8=function(mode){
    // C1 /4 ib SHL r/m32,imm8 3/7 Multiply r/m dword by 2, imm8 times
    load_imm8();
    if(dbg){
      print("SHL_rm32_imm8 "+hex_byte(imm8));
    };
    set_eip(eip+ilen);
  };

  var SHR_rm32_imm8=function(mode){
    //C1 /5 ib SHR r/m32,imm8 3/7 Unsigned divide r/m dword by 2, imm8 times
    load_imm8();
    if(dbg){
      print("SHR_rm32_imm8 "+hex_byte(imm8));
    };
    set_eip(eip+ilen);
  };

  var SUB_rm32_imm8=function(mode){
    // 83 /5 ib SUB r/m32,imm8 Subtract sign-extended immediate byte from r/m dword
    load_imm8();
    if(dbg){
      print("SUB_rm32_imm8_"+mode+" "+hex_byte(imm8));
    };
    set_eip(eip+ilen);
  };

  var XCHG_r32_EAX=function(r){
    // 90 + r XCHG r32,EAX Exchange dword register with EAX
    ilen++;
    var reg=r[0]&7;
    if(dbg){
      print("XCHG_r32_EAX_"+reg_name32(reg));
    };
    decoded=true;
    set_eip(eip+ilen);
  };

  var ops_0f=[
      [0x8F, JG_rel32],
      [0x84, JE_rel32],
      [0x85, JNE_rel32],
      [0x86, JBE_rel32],
      [0x8C, JL_rel32],
      [0xb6, MOVZX_r32_rm8],
  ];

  var step=function(){
    dbg=get_dbg();
    ran=false;
    eip=get_eip();
    if(eip===breakpoint){
      throw "breakpoint";
    };
    count++;
    b1=vr8(eip);
    b2=vr8(eip+1);
    disp=0;
    ilen=0;
    var ops=[
// 0001 0303 01C3 ADD_EAX_to_EBX
    [0x01, ADD_rm32_r32],
// 0001 0310 01C8 ADD_ECX_to_EAX
// 0004 04 ADDI8_AL
    [0x04, ADD_AL_imm8],
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
  if(run){
    if(!ran){
      set_eip(eip);
      throw "unimplemented instruction";
    };
  };
//  throw "single stepping";
  };
  return step;
};

dis=function(){
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
while(dummy.get_eip()<0x08048645){
dummy.step();
};
} catch (e){
  print(e);
};
};

var my_dbg;
pt[3].set_step(alt_step);
if(my_dbg!==true){my_dbg=false};
pt[3].set_dbg(my_dbg);
var cont=function(){
var st=Date.now();
kernel.resume();
print((Date.now()-st)/1000);
};
var breakpoint;
if(!breakpoint){
//breakpoint=0x080480b3;
};
//breakpoint=0x080480b8;
cont();

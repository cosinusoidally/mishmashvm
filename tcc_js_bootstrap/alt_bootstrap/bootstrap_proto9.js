load("../../libc_portable_proto/sha256.js");

written_files=[];

hex0_to_array=function(x){
  var a=x.split("\n").
  map(function(x){return x.split(";")[0]}).
  map(function(x){return x.split("#")[0]}).
  join("").
  split(" ").
  join("").
  split("\t").
  join("").
  split("");
  var b=[];
    for(var i=0;i<a.length;i=i+2){
    b.push(a[i]+a[i+1]);
  }
  return b.map(function(x){return parseInt(x,16)});
};

hex0=hex0_to_array(read("stage0-posix/x86/hex0_x86.hex0"));
hex0_sha256=root.sha256(hex0);
hex0_sha256_expected="e650a1b5bdcfd79689569a3199a252a76622f7ea4fe036a5dddc2039fdad79c5";
print("hex0 sha256: "+hex0_sha256+" "+(hex0_sha256===hex0_sha256_expected));

kaem=hex0_to_array(read("stage0-posix/x86/kaem-minimal.hex0"));
kaem_sha256=root.sha256(kaem);
kaem_sha256_expected="4fd5d6d7f1ac4708c06df2bf7e0b7f6dc45a493ac100e14fc52172929b807f5e";
print("kaem sha256: "+kaem_sha256+" "+(kaem_sha256===kaem_sha256_expected));

var parse_elf=function(e){
  var mm=[];
  var zero_mem = function(m,n){
    for(var i=0;i<n;i++){
      m[i]=0;
    };
  };
  zero_mem(mm,(4096+Math.floor(e.length/4096))/4); // populate initial memory

  for(var i=0;i<e.length;i++){
    w8(mm,i,e[i]);
  };
  var p_paddr=0x08048000;
  var  size=mm.length*4;
  return {
    entry:   0x08048054,
    p_paddr: 0x08048000,
    size: size,
    brk: p_paddr+size,
    mem: mm
  };
};

var zero_mem = function(m,n){
  for(var i=0;i<n;i++){
    m[i]=0;
  };
};

var w8 = function(a,o,v){
  var s=o&3;
  o=(o>>>2);
  var c=a[o];
  var b=[c & 0xff,(c>>>8) & 0xff,(c>>>16)&0xff,(c>>>24) &0xff];
  b[s]=v &0xff;
  a[o]=(b[0]+(b[1]<<8)+(b[2]<<16)+(b[3]<<24))|0;
};

var r8 = function(a,o){
  var s=o&3;
  o=(o>>>2);
  if(o<a.length){
    return (a[o] >>> (8*s))& 0xFF;
  } else {
    throw "pagefault oob";
  }
};



var to_hex=function(x){
 return "0x"+
        (("00"+((x>>>24)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>16)&0xFF).toString(16)).slice(-2))+
        (("00"+((x>>>8)&0xFF).toString(16)).slice(-2))+
        (("00"+(x&0xFF).toString(16)).slice(-2));
};


_print=print;
var new_process=function(){
  // for debug logging

  var print=function(x){
    _print("pid: "+pid+", "+to_hex(eip)+": "+x);
  };

  // registers
  var eax=0;
  var ecx=0;
  var edx=0;
  var ebx=0;
  var esp=0;
  var ebp=0;
  var esi=0;
  var edi=0;
  var eip=0;

  // flags

  var IF=1;
  var ZF=0;
  var SF=0;
  var CF=0;
  var OF=0;

  var get_flags=function(){
    return (IF|(ZF<<1)|(SF<<2)|(CF<<3)|(OF<<4));
  };

  var load_flags=function(F){
     IF=F&1;
     ZF=(F>>>1)&1;
     SF=(F>>>2)&1;
     CF=(F>>>3)&1;
     OF=(F>>>4)&1;
  };

  var status;

  var int_no=0;

  var dbg=false;
  var exit_code=1;

  var cwd="/";

  var stack=[];
  var stack_size=1024*1024; // just give us a meg
  zero_mem(stack,stack_size/4);
  var stack_base=0xFFFFE000-stack_size;
  var vmem=[
    [stack_base,stack],
  ];


  var brk;
  var img_size;
  var heap;
  var add_mem=function(m){
    brk=m.brk;
    heap=m.mem;
    vmem.push([m.p_paddr,m.mem]);
  };

  var set_brk=function(addr){
    if(dbg){
      print("set_brk "+to_hex(addr));
    };
    // FIXME probably not right as ints are signed
    if(addr>brk){
      var d=Math.floor(addr-brk)/4;
      if(d&3){
        d++;
      };
      for(var i=0;i<d;i++){
        heap.push(0);
      };
    };
    brk=addr;
  };

  var _r8=r8;
  var _w8=w8;
  var vr8=function(o){
    if(o>>>31){
      o=(o&0x7fffffff)+2147483648;
    };
    var p;
    for(var i=0;i<vmem.length;i++){
      p=vmem[i];
      if(o>=p[0]){
        return _r8(p[1],o-p[0]);
      };
    };
    throw "pagefault";
  };

  var vw8=function(o,b){
    if(o>>>31){
      o=(o&0x7fffffff)+2147483648;
    };
    var p;
    for(var i=0;i<vmem.length;i++){
      p=vmem[i];
      if(o>=p[0]){
        return _w8(p[1],o-p[0],b);
      };
    };
    throw "pagefault oob write";
  };

  var vr32=function(o){
    var d=[vr8(o),vr8(o+1),vr8(o+2),vr8(o+3)];
//    print(d.map(function(x){return x.toString(16)}));
    return (d[0]+(d[1]<<8)+(d[2]<<16)+(d[3]<<24));
  };

  var vr16=function(o){
    var d=[vr8(o),vr8(o+1)];
    return (d[0]+(d[1]<<8));
  };

  var vw32=function(o,v){
    vw8(o,v&0xff);
    vw8(o+1,(v>>>8)&0xff);
    vw8(o+2,(v>>16)&0xff);
    vw8(o+3,(v>>>24)&0xff);
  };

  var sign_extend8 = function(x){
    if(x&0x80){
      x=x|0xFFFFFF00;
    };
    return x;
  };

  // run a single i386 instruction:
  var step=function(){
    if(status!=="running"){
      return 0;
    };
    var b1=vr8(eip);
    switch(b1){
      case 0x58:
        if(dbg){
          print("pop    %eax");
        };
        eax=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      case 0x59:
        if(dbg){
          print("pop    %ecx");
        };
        ecx=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      case 0x5b:
        if(dbg){
          print("pop    %ebx");
        };
        ebx=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      case 0x5e:
        if(dbg){
          print("pop    %esi");
        };
        esi=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      case 0x5f:
        if(dbg){
          print("pop    %edi");
        };
        edi=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      case 0x29:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xf8:
            if(dbg){
              print("sub    %edi,%eax");
            };
            eax=(eax|0)-(edi|0);
            arith32_setflags(eax);
            // FIXME this might not be right
            eax=eax|0;
            eip=eip+2;
            break;
          case 0xd0:
            if(dbg){
              print("sub    %edx,%eax");
            };
            eax=(eax|0)-(edx|0);
            arith32_setflags(eax);
            // FIXME this might not be right
            eax=eax|0;
            eip=eip+2;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x31:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xc0:
            if(dbg){
              print("xor    %eax,%eax");
            };
            eax=0;
            eip=eip+2;
            break;
          case 0xc9:
            if(dbg){
              print("xor    %ecx,%ecx");
            };
            ecx=0;
            eip=eip+2;
            break;
          case 0xd2:
            if(dbg){
              print("xor    %edx,%edx");
            };
            edx=0;
            eip=eip+2;
            break;
          case 0xff:
            if(dbg){
              print("xor    %edi,%edi");
            };
            edi=0;
            eip=eip+2;
            break;
          case 0xdb:
            if(dbg){
              print("xor    %ebx,%ebx");
            };
            ebx=0;
            eip=eip+2;
            break;
          case 0xed:
            if(dbg){
              print("xor    %ebp,%ebp");
            };
            ebp=0;
            eip=eip+2;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x6a:
        var v=sign_extend8(vr8(eip+1));
        if(dbg){
          print("push   $0x"+v.toString(16));
        };
        esp=esp-4;
        vw32(esp,v);
        eip=eip+2;
        break;
      case 0xcd:
        int_no=vr8(eip+1);
        if(dbg){
          print("int   $0x"+int_no.toString(16));
        };
        eip=eip+2;
        status="syscall";
        return 1;
        break;
      case 0x89:
        var b2=vr8(eip+1);
        switch(b2){
          case 0x03:
            if(dbg){
              print("mov    %eax,(%ebx)");
            };
            vw32(ebx,eax);
            eip=eip+2;
            break;
          case 0x0b:
            if(dbg){
              print("mov    %ecx,(%ebx)");
            };
            vw32(ebx,ecx);
            eip=eip+2;
            break;
          case 0x2a:
            if(dbg){
              print("mov    %ebp,(%edx)");
            };
            vw32(edx,ebp);
            eip=eip+2;
            break;
          case 0x78:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    %edi,"+to_hex(o)+"(%eax)");
            };
            vw32(eax+o,edi);
            eip=eip+3;
            break;
          case 0x41:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    %eax,"+to_hex(o)+"(%ecx)");
            };
            vw32(ecx+o,eax);
            eip=eip+3;
            break;
          case 0x42:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    %eax,"+to_hex(o)+"(%edx)");
            };
            vw32(edx+o,eax);
            eip=eip+3;
            break;
          case 0x4a:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    %ecx,"+to_hex(o)+"(%edx)");
            };
            vw32(edx+o,ecx);
            eip=eip+3;
            break;
          case 0x6e:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    %ebp,"+to_hex(o)+"(%esi)");
            };
            vw32(esi+o,ebp);
            eip=eip+3;
            break;
          case 0xc5:
            if(dbg){
              print("mov    %eax,%ebp");
            };
            ebp=eax;
            eip=eip+2;
            break;
          case 0xcb:
            if(dbg){
              print("mov    %ecx,%ebx");
            };
            ebx=ecx;
            eip=eip+2;
            break;
          case 0xd0:
            if(dbg){
              print("mov    %edx,%eax");
            };
            eax=edx;
            eip=eip+2;
            break;
          case 0xd5:
            if(dbg){
              print("mov    %edx,%ebp");
            };
            ebp=edx;
            eip=eip+2;
            break;
          case 0xc6:
            if(dbg){
              print("mov    %eax,%esi");
            };
            esi=eax;
            eip=eip+2;
            break;
          case 0xc8:
            if(dbg){
              print("mov    %ecx,%eax");
            };
            eax=ecx;
            eip=eip+2;
            break;
          case 0xc2:
            if(dbg){
              print("mov    %eax,%edx");
            };
            edx=eax;
            eip=eip+2;
            break;
          case 0xc3:
            if(dbg){
              print("mov    %eax,%ebx");
            };
            ebx=eax;
            eip=eip+2;
            break;
          case 0xe1:
            if(dbg){
              print("mov    %esp,%ecx");
            };
            ecx=esp;
            eip=eip+2;
            break;
          case 0xeb:
            if(dbg){
              print("mov    %ebp,%ebx");
            };
            ebx=ebp;
            eip=eip+2;
            break;
          case 0xe5:
            if(dbg){
              print("mov    %esp,%ebp");
            };
            ebp=esp;
            eip=eip+2;
            break;
          case 0xe8:
            if(dbg){
              print("mov    %ebp,%eax");
            };
            eax=ebp;
            eip=eip+2;
            break;
          case 0xf3:
            if(dbg){
              print("mov    %esi,%ebx");
            };
            ebx=esi;
            eip=eip+2;
            break;
          case 0xf8:
            if(dbg){
              print("mov    %edi,%eax");
            };
            eax=edi;
            eip=eip+2;
            break;
          case 0xdf:
            if(dbg){
              print("mov    %ebx,%edi");
            };
            edi=ebx;
            eip=eip+2;
            break;
          case 0xfa:
            if(dbg){
              print("mov    %edi,%edx");
            };
            edx=edi;
            eip=eip+2;
            break;
          case 0xc7:
            if(dbg){
              print("mov    %eax,%edi");
            };
            edi=eax;
            eip=eip+2;
            break;
          case 0x1d:
            var o=vr32(eip+2);
            if(dbg){
              print("mov    %ebx,"+to_hex(o));
            };
            vw32(o,ebx);
            eip=eip+6;
            break;
          case 0xd3:
            if(dbg){
              print("mov    %edx,%ebx");
            };
            ebx=edx;
            eip=eip+2;
            break;
          case 0xd9:
            if(dbg){
              print("mov    %ebx,%ecx");
            };
            ecx=ebx;
            eip=eip+2;
            break;
          case 0xf9:
            if(dbg){
              print("mov    %edi,%ecx");
            };
            ecx=edi;
            eip=eip+2;
            break;
          case 0xfb:
            if(dbg){
              print("mov    %edi,%ebx");
            };
            ebx=edi;
            eip=eip+2;
            break;
          case 0xc1:
            if(dbg){
              print("mov    %eax,%ecx");
            };
            ecx=eax;
            eip=eip+2;
            break;
          case 0xd8:
            if(dbg){
              print("mov    %ebx,%eax");
            };
            eax=ebx;
            eip=eip+2;
            break;
          case 0xda:
            if(dbg){
              print("mov    %ebx,%edx");
            };
            edx=ebx;
            eip=eip+2;
            break;
          case 0xdd:
            if(dbg){
              print("mov    %ebx,%ebp");
            };
            ebp=ebx;
            eip=eip+2;
            break;
          case 0xea:
            if(dbg){
              print("mov    %ebp,%edx");
            };
            edx=ebp;
            eip=eip+2;
            break;
          case 0x01:
            if(dbg){
              print("mov    %eax,(%ecx)");
            };
            vw32(ecx,eax);
            eip=eip+2;
            break;
          case 0x30:
            if(dbg){
              print("mov    %esi,(%eax)");
            };
            vw32(eax,esi);
            eip=eip+2;
            break;
          case 0x38:
            if(dbg){
              print("mov    %edi,(%eax)");
            };
            vw32(eax,edi);
            eip=eip+2;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x88:
        var b2=vr8(eip+1);
        switch(b2){
          case 0x01:
            if(dbg){
              print("mov    %al,(%ecx)");
            };
            vw32(ecx,eax&0xFF);
            eip=eip+2;
            break;
          case 0x03:
            if(dbg){
              print("mov    %al,(%ebx)");
            };
            vw32(ebx,eax&0xFF);
            eip=eip+2;
            break;
          case 0x0a:
            if(dbg){
              print("mov    %cl,(%edx)");
            };
            vw32(edx,ecx&0xFF);
            eip=eip+2;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x66:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xb9:
            var v=vr16(eip+2);
            if(dbg){
              print("mov    $0x"+(v.toString(16))+",%cx");
            };
            ecx=v;
            eip=eip+4;
            break;
          case 0xba:
            var v=vr16(eip+2);
            if(dbg){
              print("mov    $0x"+(v.toString(16))+",%dx");
            };
            edx=v;
            eip=eip+4;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x5d:
        if(dbg){
          print("pop    %ebp");
        };
        ebp=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      case 0xe8:
        var t=eip+vr32(eip+1)+5;
        if(dbg){
          print("call   "+to_hex(t));
        };
        esp=esp-4;
        vw32(esp,eip+5);
        eip=t;
        break;
      case 0x51:
        if(dbg){
          print("push    %ecx");
        };
        esp=esp-4;
        vw32(esp,ecx);
        eip++;
        break;
      case 0x52:
        if(dbg){
          print("push    %edx");
        };
        esp=esp-4;
        vw32(esp,edx);
        eip++;
        break;
      case 0x5a:
        if(dbg){
          print("pop    %edx");
        };
        edx=vr32(esp);
        esp=esp+4;
        eip++;
        break;
      case 0x53:
        if(dbg){
          print("push    %ebx");
        };
        esp=esp-4;
        vw32(esp,ebx);
        eip++;
        break;
      case 0x56:
        if(dbg){
          print("push    %esi");
        };
        esp=esp-4;
        vw32(esp,esi);
        eip++;
        break;
      case 0x57:
        if(dbg){
          print("push    %edi");
        };
        esp=esp-4;
        vw32(esp,edi);
        eip++;
        break;
      case 0x85:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xc0:
            if(dbg){
              print("test   %eax,%eax");
            };
            test_common(eax&eax);
            eip=eip+2;
            break;
          case 0xed:
            if(dbg){
              print("test   %ebp,%ebp");
            };
            test_common(ebp&ebp);
            eip=eip+2;
            break;
          case 0xdb:
            if(dbg){
              print("test   %ebx,%ebx");
            };
            test_common(ebx&ebx);
            eip=eip+2;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x8d:
        var b2=vr8(eip+1);
        switch(b2){
          case 0x0c:
            var b3=vr8(eip+2);
            switch(b3){
              case 0x24:
                if(dbg){
                  print("lea    (%esp),%ecx");
                };
                ecx=esp;
                eip=eip+3;
                break
              default:
              throw "unimplemented: " + to_hex((b1<<16)+(b2<<8)+b3);
            };
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x0f:
        var b2=vr8(eip+1);
        switch(b2){
          case 0x84:
            var o=eip+((vr32(eip+2))|0)+6;
            if(dbg){
              print("je     "+to_hex(o));
            };
            if(ZF){
              eip=o;
            } else {
              eip=eip+6;
            };
            break;
          case 0x85:
            var o=eip+((vr32(eip+2))|0)+6;
            if(dbg){
              print("jne     "+to_hex(o));
            };
            if(!ZF){
              eip=o;
            } else {
              eip=eip+6;
            };
            break;
          case 0x8c:
            var o=eip+((vr32(eip+2))|0)+6;
            if(dbg){
              print("jl     "+to_hex(o));
            };
            if(SF!==OF){
              eip=o;
            } else {
              eip=eip+6;
            };
            break;
          case 0x8f:
            var o=eip+((vr32(eip+2))|0)+6;
            if(dbg){
              print("jg     "+to_hex(o));
            };
            if((SF===0) && (SF===OF)){
              eip=o;
            } else {
              eip=eip+6;
            };
            break;
          case 0xb6:
            var b3=vr8(eip+2);
            switch(b3){
              case 0xc0:
                if(dbg){
                  print("movzbl %al,%eax");
                };
                eax=eax&0xFF;
                eip=eip+3;
                break;
              case 0xdb:
                if(dbg){
                  print("movzbl %bl,%ebx");
                };
                ebx=ebx&0xFF;
                eip=eip+3;
                break;
              case 0xc9:
                if(dbg){
                  print("movzbl %cl,%ecx");
                };
                ecx=ecx&0xFF;
                eip=eip+3;
                break;
              default:
              throw "unimplemented: " + b1.toString(16)+b2.toString(16)+b3.toString(16);
            };
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x38:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xd8:
            if(dbg){
              print("cmp    %bl,%al");
            };
            var al=sign_extend8(eax&0xFF);
            var res=(al-sign_extend8(ebx&0xFF))|0;
            arith8_setflags(res);
            eip=eip+2;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x74:
        var o=eip+sign_extend8(vr8(eip+1))+2;
        if(dbg){
          print("je     "+to_hex(o));
        };
        if(ZF){
          eip=o;
        } else {
          eip=eip+2;
        };
        break;
      case 0x7e:
        var o=eip+sign_extend8(vr8(eip+1))+2;
        if(dbg){
          print("jle    "+to_hex(o));
        };
        if((ZF===1) || (SF!==OF)){
          eip=o;
        } else {
          eip=eip+2;
        };
        break;
      case 0xc3:
        if(dbg){
          print("ret");
        };
        eip=vr32(esp);
        esp=esp+4;
        break;
      case 0x3c:
        var r=sign_extend8(vr8(eip+1));
        if(dbg){
          print("cmp    $0x"+r.toString(16)+",%al");
        };
        var al=sign_extend8(eax&0xFF);
        var res=(al-r)|0;
        arith8_setflags(res);
        eip=eip+2;
        break;
      case 0x3d:
        var r=vr32(eip+1);
        if(dbg){
          print("cmp    $"+to_hex(r)+",%eax");
        };
        var res=(eax|0)-(r|0);
        arith32_setflags(res);
        eip=eip+5;
        break;
      case 0x75:
        var o=eip+sign_extend8(vr8(eip+1))+2;
        if(dbg){
          print("jne     "+to_hex(o));
        };
        if(!ZF){
          eip=o;
        } else {
          eip=eip+2;
        };
        break;
      case 0x7c:
        var o=eip+sign_extend8(vr8(eip+1))+2;
        if(dbg){
          print("jl     "+to_hex(o));
        };
        if(SF!==OF){
          eip=o;
        } else {
          eip=eip+2;
        };
        break;
      case 0x2c:
        var r=sign_extend8(vr8(eip+1));
        var al=sign_extend8(eax&0xFF);
        if(dbg){
          print("sub    $0x"+r.toString(16)+",%al");
        };
        var res=(al-r)|0;
        arith8_setflags(res);
        eax=res&0xFF;
        eip=eip+2;
        break;
      case 0x7d:
        var o=eip+sign_extend8(vr8(eip+1))+2;
        if(dbg){
          print("jge    "+to_hex(o));
        };
        if(SF==OF){
          eip=o;
        } else {
          eip=eip+2;
        };
        break;
      case 0xeb:
        var o=eip+sign_extend8(vr8(eip+1))+2;
        if(dbg){
          print("jmp    "+to_hex(o));
        };
        eip=o;
        break;
      case 0xe9:
        var o=eip+(vr32(eip+1))+5;
        if(dbg){
          print("jmp    "+to_hex(o));
        };
        eip=o;
        break;
      case 0xc1:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xe6:
            var c=vr8(eip+2);
            if(dbg){
              print("shl    $0x"+c.toString(16)+",%esi");
            };
            var r=esi;
            var tc = c & 0x1F;
            while(tc!==0){
              CF=r>>>31;
              r=r<<1;
              tc=tc-1;
            };
            if((c & 0x1F) ===1){
              OF = (r>>>31) ^CF;
            };
            esi=r;
            eip=eip+3;
            break;
          case 0xe7:
            var c=vr8(eip+2);
            if(dbg){
              print("shl    $0x"+c.toString(16)+",%edi");
            };
            var r=edi;
            var tc = c & 0x1F;
            while(tc!==0){
              CF=r>>>31;
              r=r<<1;
              tc=tc-1;
            };
            if((c & 0x1F) ===1){
              OF = (r>>>31) ^CF;
            };
            edi=r;
            eip=eip+3;
            break;
          case 0xe0:
            var c=vr8(eip+2);
            if(dbg){
              print("shl    $0x"+c.toString(16)+",%eax");
            };
            var r=eax;
            var tc = c & 0x1F;
            while(tc!==0){
              CF=r>>>31;
              r=r<<1;
              tc=tc-1;
            };
            if((c & 0x1F) ===1){
              OF = (r>>>31) ^CF;
            };
            eax=r;
            eip=eip+3;
            break;
          case 0xe8:
            var c=vr8(eip+2);
            if(dbg){
              print("shr    $0x"+c.toString(16)+",%eax");
            };
            var r=eax;
            var tc = c & 0x1F;
            while(tc!==0){
              CF=r&1;
              r=r>>>1;
              tc=tc-1;
            };
            if((c & 0x1F) ===1){
              OF = (r>>>31);
            };
            eax=r;
            eip=eip+3;
            break;
          case 0xFFFF:
            if(dbg){
            };
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x01:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xF8:
            if(dbg){
              print("add    %edi,%eax");
            };
            eax=((eax)|0)+((edi|0));
            arith32_setflags(eax);
            // FIXME this might not be right
            eax=eax|0;
            eip=eip+2;
            break;
          case 0xc3:
            if(dbg){
              print("add    %eax,%ebx");
            };
            ebx=((ebx)|0)+((eax|0));
            arith32_setflags(ebx);
            // FIXME this might not be right
            ebx=ebx|0;
            eip=eip+2;
            break;
          case 0xf0:
            if(dbg){
              print("add    %esi,%eax");
            };
            eax=((eax)|0)+((esi|0));
            arith32_setflags(eax);
            // FIXME this might not be right
            eax=eax|0;
            eip=eip+2;
            break;
          case 0xFFFF:
            if(dbg){
            };
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x8a:
        var b2=vr8(eip+1);
        switch(b2){
          case 0x02:
            var r=vr8(edx);
            if(dbg){
              print("mov    (%edx),%al");
            };
            eax=r;
            eip=eip+2;
            break;
          case 0x03:
            var r=vr8(ebx);
            if(dbg){
              print("mov    (%ebx),%al");
            };
            eax=r;
            eip=eip+2;
            break;
          case 0x01:
            var r=vr8(ecx);
            if(dbg){
              print("mov    (%ecx),%al");
            };
            eax=r;
            eip=eip+2;
            break;
          case 0x1a:
            var r=vr8(edx);
            if(dbg){
              print("mov    (%edx),%bl");
            };
            ebx=r;
            eip=eip+2;
            break;
          case 0x0b:
            var r=vr8(ebx);
            if(dbg){
              print("mov    (%ebx),%cl");
            };
            ecx=r;
            eip=eip+2;
            break;
          case 0x04:
            var b3=vr8(eip+2);
            switch(b3){
              case 0x0b:
                if(dbg){
                  print("mov    (%ebx,%ecx,1),%al");
                };
                eax=(eax&0xFFFFFF00)+((vr32(ebx+ecx))&0xFF);
                eip=eip+3;
                break;
              default:
              throw "unimplemented: " + to_hex((b1<<16)+(b2<<8)+b3);
            };
            break;
          case 0xFFFF:
            if(dbg){
            };
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0xf7:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xd5:
            if(dbg){
              print("not    %ebp");
            };
            ebp=~ebp;
            eip=eip+2;
            break;
          case 0xd0:
            if(dbg){
              print("not    %eax");
            };
            eax=~eax;
            eip=eip+2;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
          };
        break;
      case 0x81:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xc3:
            var o=vr32(eip+2);
            if(dbg){
              print("add    $"+to_hex(o)+",%ebx");
            };
            ebx=(ebx|0)+(o|0);
            arith32_setflags(ebx);
            // FIXME this might not be right
            ebx=ebx|0;
            eip=eip+6;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
          };
        break;
      case 0x03:
        var b2=vr8(eip+1);
        switch(b2){
          case 0x05:
            var o=vr32(eip+2);
            if(dbg){
              print("add    "+to_hex(o)+",%eax");
            };
            eax=(eax|0)+(vr32(o)|0);
            arith32_setflags(eax);
            // FIXME this might not be right
            eax=eax|0;
            eip=eip+6;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
          };
        break;
      case 0x83:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xe0:
            var r=vr8(eip+2);
            if(dbg){
              print("and    $"+to_hex(r)+",%eax");
            };
            eax=(eax&r)|0;
            arith32_setflags(eax);
            eip=eip+3;
            break;
          case 0xe8:
            var r=sign_extend8(vr8(eip+2));
            if(dbg){
              print("cmp    $"+to_hex(r)+",%eax");
            };
            eax=(eax-r)|0;
            arith32_setflags(eax);
            eip=eip+3;
            break;
          case 0xfa:
            var r=sign_extend8(vr8(eip+2));
            if(dbg){
              print("cmp    $"+to_hex(r)+",%edx");
            };
            edx=(edx-r)|0;
            arith32_setflags(edx);
            eip=eip+3;
            break;
          case 0xfb:
            var r=sign_extend8(vr8(eip+2));
            if(dbg){
              print("cmp    $"+to_hex(r)+",%ebx");
            };
            ebx=(ebx-r)|0;
            arith32_setflags(ebx);
            eip=eip+3;
            break;
          case 0xfd:
            var r=sign_extend8(vr8(eip+2));
            if(dbg){
              print("cmp    $"+to_hex(r)+",%ebp");
            };
            ebp=(ebp-r)|0;
            arith32_setflags(ebp);
            eip=eip+3;
            break;
          case 0xfe:
            var r=sign_extend8(vr8(eip+2));
            if(dbg){
              print("cmp    $"+to_hex(r)+",%esi");
            };
            esi=(esi-r)|0;
            arith32_setflags(esi);
            eip=eip+3;
            break;
          case 0xf9:
            var r=sign_extend8(vr8(eip+2));
            if(dbg){
              print("cmp    $"+to_hex(r)+",%ecx");
            };
            ecx=(ecx-r)|0;
            arith32_setflags(ecx);
            eip=eip+3;
            break;
          case 0xc0:
            var o=vr8(eip+2);
            if(dbg){
              print("add    $"+to_hex(o)+",%eax");
            };
            eax=eax+o;
            arith32_setflags(eax);
            // FIXME this might not be right
            eax=eax|0;
            eip=eip+3;
            break;
          case 0xc1:
            var o=vr8(eip+2);
            if(dbg){
              print("add    $"+to_hex(o)+",%ecx");
            };
            ecx=ecx+o;
            arith32_setflags(ecx);
            // FIXME this might not be right
            ecx=ecx|0;
            eip=eip+3;
            break;
          case 0xc2:
            var o=vr8(eip+2);
            if(dbg){
              print("add    $"+to_hex(o)+",%edx");
            };
            edx=edx+o;
            arith32_setflags(edx);
            // FIXME this might not be right
            edx=edx|0;
            eip=eip+3;
            break;
          case 0xc3:
            var o=vr8(eip+2);
            if(dbg){
              print("add    $"+to_hex(o)+",%ebx");
            };
            ebx=ebx+o;
            arith32_setflags(ebx);
            // FIXME this might not be right
            ebx=ebx|0;
            eip=eip+3;
            break;
          case 0xc5:
            var o=vr8(eip+2);
            if(dbg){
              print("add    $"+to_hex(o)+",%ebp");
            };
            ebp=ebp+o;
            arith32_setflags(ebp);
            // FIXME this might not be right
            ebp=ebp|0;
            eip=eip+3;
            break;
          case 0xc7:
            var o=vr8(eip+2);
            if(dbg){
              print("add    $"+to_hex(o)+",%edi");
            };
            edi=edi+o;
            arith32_setflags(edi);
            // FIXME this might not be right
            edi=edi|0;
            eip=eip+3;
            break;
          case 0xf8:
            var r=sign_extend8(vr8(eip+2));
            if(dbg){
              print("cmp    $"+to_hex(r)+",%eax");
            };
            var res=(eax-r)|0;
            arith32_setflags(res);
            eip=eip+3;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
          };
        break;
      case 0x39:
        var b2=vr8(eip+1);
        switch(b2){
          case 0xc8:
            if(dbg){
              print("cmp    %ecx,%eax");
            };
            arith32_setflags((((eax)|0)-((ecx|0)))|0);
            eip=eip+2;
            break;
          case 0xcb:
            if(dbg){
              print("cmp    %ecx,%ebx");
            };
            arith32_setflags((((ebx)|0)-((ecx|0)))|0);
            eip=eip+2;
            break;
          case 0xd8:
            if(dbg){
              print("cmp    %ebx,%eax");
            };
            arith32_setflags((((eax)|0)-((ebx|0)))|0);
            eip=eip+2;
            break;
          case 0xd9:
            if(dbg){
              print("cmp    %ebx,%ecx");
            };
            arith32_setflags((((ecx)|0)-((ebx|0)))|0);
            eip=eip+2;
            break;
          case 0xFFFF:
            if(dbg){
            };
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x4d:
        if(dbg){
          print("dec    %ebp");
        };
        ebp=(ebp-1)|0;
        eip=eip+1;
        break;
      case 0x05:
        var o=vr32(eip+1);
        if(dbg){
          print("add    "+to_hex(o)+",%eax");
        };
        eax=((eax)|0)+((o|0));
        arith32_setflags(eax);
        // FIXME this might not be right
        eax=eax|0;
        eip=eip+5;
        break;
      case 0x50:
        if(dbg){
          print("push    %eax");
        };
        esp=esp-4;
        vw32(esp,eax);
        eip++;
        break;
      case 0xba:
        edx=vr32(eip+1);
        if(dbg){
          print("mov    $"+to_hex(edx)+",%edx");
        };
        eip=eip+5;
        break;
      case 0xbb:
        ebx=vr32(eip+1);
        if(dbg){
          print("mov    $"+to_hex(ebx)+",%ebx");
        };
        eip=eip+5;
        break;
      case 0xbd:
        ebp=vr32(eip+1);
        if(dbg){
          print("mov    $"+to_hex(ebp)+",%ebp");
        };
        eip=eip+5;
        break;
      case 0xbe:
        esi=vr32(eip+1);
        if(dbg){
          print("mov    $"+to_hex(esi)+",%esi");
        };
        eip=eip+5;
        break;
      case 0xbf:
        edi=vr32(eip+1);
        if(dbg){
          print("mov    $"+to_hex(edi)+",%edi");
        };
        eip=eip+5;
        break;
      case 0xb9:
        ecx=vr32(eip+1);
        if(dbg){
          print("mov    $"+to_hex(ecx)+",%ecx");
        };
        eip=eip+5;
        break;
      case 0xb8:
        eax=vr32(eip+1);
        if(dbg){
          print("mov    $"+to_hex(eax)+",%eax");
        };
        eip=eip+5;
        break;
      case 0xa0:
        var o=vr32(eip+1);
        if(dbg){
          print("mov    "+to_hex(o)+",%al");
        };
        eax=vr32(o)&0xFF;
        eip=eip+5;
        break;
      case 0xa2:
        var o=vr32(eip+1);
        if(dbg){
          print("mov    %eax,"+to_hex(o));
        };
        vw32(o,eax&0xFF);
        eip=eip+5;
        break;
      case 0xa3:
        var o=vr32(eip+1);
        if(dbg){
          print("mov    %eax,"+to_hex(o));
        };
        vw32(o,eax);
        eip=eip+5;
        break;
      case 0xa1:
        var o=vr32(eip+1);
        if(dbg){
          print("mov    "+to_hex(o)+",%eax");
        };
        eax=vr32(o);
        eip=eip+5;
        break;
      case 0x8b:
        var b2=vr8(eip+1);
        switch(b2){
          case 0x1d:
            var o=vr32(eip+2);
            if(dbg){
              print("mov    "+to_hex(o)+",%ebx");
            };
            ebx=vr32(o);
            eip=eip+6;
            break;
          case 0x03:
            if(dbg){
              print("mov    (%ebx),%eax");
            };
            eax=vr32(ebx);
            eip=eip+2;
            break;
          case 0x00:
            if(dbg){
              print("mov    (%eax),%eax");
            };
            eax=vr32(eax);
            eip=eip+2;
            break;
          case 0x01:
            if(dbg){
              print("mov    (%ecx),%eax");
            };
            eax=vr32(ecx);
            eip=eip+2;
            break;
          case 0x09:
            if(dbg){
              print("mov    (%ecx),%ecx");
            };
            ecx=vr32(ecx);
            eip=eip+2;
            break;
          case 0x12:
            if(dbg){
              print("mov    (%edx),%edx");
            };
            edx=vr32(edx);
            eip=eip+2;
            break;
          case 0x1b:
            if(dbg){
              print("mov    (%ebx),%ebx");
            };
            ebx=vr32(ebx);
            eip=eip+2;
            break;
          case 0x0b:
            if(dbg){
              print("mov    (%ebx),%ecx");
            };
            ecx=vr32(ebx);
            eip=eip+2;
            break;
          case 0x36:
            if(dbg){
              print("mov    (%esi),%esi");
            };
            esi=vr32(esi);
            eip=eip+2;
            break;
          case 0x56:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%esi),%edx");
            };
            edx=vr32(esi+o);
            eip=eip+3;
            break;
          case 0x40:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%eax),%eax");
            };
            eax=vr32(eax+o);
            eip=eip+3;
            break;
          case 0x41:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%ecx),%eax");
            };
            eax=vr32(ecx+o);
            eip=eip+3;
            break;
          case 0x42:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%edx),%eax");
            };
            eax=vr32(edx+o);
            eip=eip+3;
            break;
          case 0x46:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%esi),%eax");
            };
            eax=vr32(esi+o);
            eip=eip+3;
            break;
          case 0x48:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%eax),%ecx");
            };
            ecx=vr32(eax+o);
            eip=eip+3;
            break;
          case 0x58:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%eax),%ebx");
            };
            ebx=vr32(eax+o);
            eip=eip+3;
            break;
          case 0x59:
            var o=sign_extend8(vr8(eip+2));
            if(dbg){
              print("mov    0x"+(o.toString(16))+"(%ecx),%ebx");
            };
            ebx=vr32(ecx+o);
            eip=eip+3;
            break;
          default:
            throw "unimplemented: " + b1.toString(16)+b2.toString(16);
        };
        break;
      case 0x9c:
        if(dbg){
          print("pushf");
        };
        var F=get_flags();
        esp=esp-4;
        vw32(esp,F);
        eip++;
        break;
      case 0x9d:
        if(dbg){
          print("popf");
        };
        var F=vr32(esp);
        load_flags(F);
        esp=esp+4;
        eip++;
        break;
      case 0xFFFF:
        if(dbg){
        };
        break;
      default:
        throw "unimplemented: " + b1.toString(16);
    };
    return 0;
  };

  var test_common = function(t){
    SF=(t>>>7) &1;
    if(t==0){
      ZF=1;
    } else {
      ZF=0;
    };
    CF=0;
    OF=0;
  };

  var arith8_setflags = function(res){
    if(res===0){
      ZF=1;
    } else {
      ZF=0;
    };
    if(res<0){
      SF=1;
    } else {
      SF=0;
    };
    if(res>127 || res<-128){
      OF=1;
    } else {
      OF=0;
    };
  };

  var arith32_setflags = function(res){
    if(res===0){
      ZF=1;
    } else {
      ZF=0;
    };
    if(res<0){
      SF=1;
    } else {
      SF=0;
    };
    if(res>2147483647 || res<-2147483648){
      OF=1;
    } else {
      OF=0;
    };
  };

  var running=true;

  // read a null terminated string from memory
  var read_c_string=function(x){
    var o=[];
    var c;
    while((c=vr8(x++))!==0){
      o.push(c);
    };
    return o.map(function(x){return String.fromCharCode(x)}).join("");
  };

  // write a null terminated string to memory
  var write_c_string=function(x,s){
    print("writing string: "+s);
    s=s.split("");
    for(var i=0;i<s.length;i++){
      vw8(x+i,s[i].charCodeAt(0));
    };
    vw8(x+i,0);
  };
  var alloca=function(x){
    if(!(x===((x>>>2)<<2))){
      x=4+((x>>>2)<<2);
    };
    esp=esp-x;
    return esp;
  };

  var push32=function(x){
    alloca(4);
    vw32(esp,x);
  };

  var pid;

  var get_state=function(){
    return {
      vmem: vmem,
      eax: eax,
      ecx: ecx,
      edx: edx,
      ebx: ebx,
      esp: esp,
      ebp: ebp,
      esi: esi,
      edi: edi,
      eip: eip,
      IF: IF,
      ZF: ZF,
      SF: SF,
      CF: CF,
      OF: OF,
      brk: brk,
      dbg: dbg,
    };
  };


  var set_vmem=function(x){
    heap=x[1][1]; // FIXME hacky
    vmem=x;
  };

  return {
    add_mem: add_mem,
    set_eip: function(x){eip=x},
    set_esp: function(x){esp=x},
    set_eax: function(x){eax=x},
    set_ecx: function(x){ecx=x},
    set_edx: function(x){edx=x},
    set_ebx: function(x){ebx=x},
    set_ebp: function(x){ebp=x},
    set_esi: function(x){esi=x},
    set_edi: function(x){edi=x},

    set_IF: function(x){IF=x},
    set_ZF: function(x){ZF=x},
    set_SF: function(x){SF=x},
    set_CF: function(x){CF=x},
    set_OF: function(x){OF=x},

    get_eip: function(){return eip},
    get_esp: function(){return esp},
    get_eax: function(){return eax},
    get_ecx: function(){return ecx},
    get_edx: function(){return edx},
    get_ebx: function(){return ebx},
    get_ebp: function(){return ebp},
    get_esi: function(){return esi},
    get_edi: function(){return edi},

    get_brk: function(){return brk},
    set_brk: set_brk,

    get_status: function(){return status},
    set_status: function(x){status=x},

    get_int_no: function(){return int_no},

    vr8: vr8,
    vw8: vw8,
    vr16: vr16,
    vr32: vr32,
    vw32: vw32,
    step: step,
    set_dbg: function(x){dbg=x},
    is_running: function(){return running;},

    set_pid: function(x){pid=x;},
    get_pid: function(){return pid;},
    read_c_string: read_c_string,
    write_c_string: write_c_string,
    alloca: alloca,
    push32: push32,
    terminate: function(){running=false;},
    get_state: get_state,
    set_vmem: set_vmem,
    get_cwd: function(){return cwd;},
  };
}

var hp=new_process();

hex0_img=parse_elf(hex0);

hp.add_mem(hex0_img);
hp.set_eip(hex0_img.entry);

hp.set_esp(0xffffdffc); // bodge shouldn't hard code
// set up initial stack
var argc=3;
var arg0="bootstrap-seeds/POSIX/x86/hex0-seed";
var arg0_p=hp.alloca(arg0.length+1);
hp.write_c_string(arg0_p,arg0);

var arg1="./x86/hex0_x86.hex0";
var arg1_p=hp.alloca(arg1.length+1);
hp.write_c_string(arg1_p,arg1);

var arg2="./x86/artifact/hex0";
var arg2_p=hp.alloca(arg2.length+1);
hp.write_c_string(arg2_p,arg2);

hp.push32(arg2_p);
hp.push32(arg1_p);
hp.push32(arg0_p);
hp.push32(argc);

/*
hp.set_esp(0xffffd5d0); // bodge lifted from gdb

// initialize stack (TODO generate the initial program stack correctly by
// generating it based on command parameters)

var stack_in=[
0x03, 0x00, 0x00, 0x00, 0x3b, 0xd7, 0xff, 0xff,
0x7e, 0xd7, 0xff, 0xff, 0x92, 0xd7, 0xff, 0xff
];

for(var i=0;i<stack_in.length;i++){
  hp.vw8(hp.get_esp()+i,stack_in[i]);
};
*/


// belt and braces, check memory:
hex0_check=[];
for(var i=0;i<hex0.length;i++){
  hex0_check[i]=r8(hex0_img.mem,i);
};
print("check if memory matches hex0: "+ (root.sha256(hex0)=== root.sha256(hex0_check)));

var info_registers = function(p){
  print("eax            "+(to_hex(p.get_eax())));
  print("ecx            "+(to_hex(p.get_ecx())));
  print("edx            "+(to_hex(p.get_edx())));
  print("ebx            "+(to_hex(p.get_ebx())));
  print("esp            "+(to_hex(p.get_esp())));
  print("ebp            "+(to_hex(p.get_ebp())));
  print("esi            "+(to_hex(p.get_esi())));
  print("edi            "+(to_hex(p.get_edi())));
  print("eip            "+(to_hex(p.get_eip())));
  print("eflags        FIXME");
};

hp.set_dbg(false);

var kernel=(function(){
  var dbg=false;

  // FIXME HACK this is the current highest file descriptor
  var fd=2;

  var syscall_open = function(p){
    var fn=p.read_c_string(p.get_ebx());
//    if(dbg){
      print("syscall_open called: "+p.read_c_string(p.get_ebx()));
//    };
    var filename=p.get_cwd()+fn;
    var file=vfs.readFile(filename);
    if(file===undefined){
      vfs.writeFile(filename,[]);
      file=vfs.readFile(filename);
      written_files.push(vfs.mk_absolute(filename));
    };
    p.fds.push([0,file]);
    p.set_eax(p.fds.length-1);
  };



  // FIXME proper filesystem

hp.fds=[
    null,
    null,
    null,
  ];

  var fs={
  };

  var syscall_read = function(p){
    var fd=p.get_ebx();
    var  buf=p.get_ecx();
    var  count=p.get_edx();
    if(dbg){
      print("syscall_read called fd:"+fd+" buf:"+buf+" count:"+count);
    };
/*
    if(count>1){
      throw "only support reads of 1 byte attempted to read: "+count;
    };
*/
    var fdo=p.fds[fd];

    for(var i=0;i<count;i++){
      if(fdo[0]>=fdo[1].length){
        p.set_eax(i);
        return;
      }
      p.vw8(buf,fdo[1][fdo[0]]);
      fdo[0]++;
      buf++;
    };
    if(dbg){
      print("offset: "+fdo[0]);
    };
    p.set_eax(count);
  };

  var syscall_exit = function(p){
    exit_code=p.get_ebx();
//    if(dbg){
      print("syscall_exit: "+exit_code);
//    };
    if(exit_code!==0){
      throw "process error";
    };
    p.set_status("empty");
    var pid=p.get_pid();
    for(var i=1;i<process_table.length;i++){
      var pn=process_table[i];
      var wake_on=pn.get_ebx();
      var pn_status=pn.get_status();
      print("pn status: "+pn_status+" wake_on: "+wake_on);
      if((pn_status==="waiting") && (wake_on===pid)){
        pn.set_status("running");
      };
    };
  };

  var syscall_write = function(p){
    var fd=p.get_ebx();
    var  buf=p.get_ecx();
    var  count=p.get_edx();
    if(dbg){
      print("syscall_write called fd:"+fd+" buf:"+buf+" count:"+count);
    };
    var fdo=p.fds[fd];
    var i=0;
    while(i<count){
      fdo[1][fdo[0]]=p.vr8(buf+i);
      fdo[0]++;
      i++;
    };
    if(dbg){
      print("offset: "+fdo[0]);
    };
    p.set_eax(1);
  };

  var syscall_brk = function(p){
    var addr=p.get_ebx();
    if(addr===0){
      p.set_eax(p.get_brk());
    } else {
      p.set_brk(addr);
    }
  }

  var get_empty_proc=function(){
    for(var i=1;i<process_table.length;i++){
      var p=process_table[i];
      if(p.get_status()==="empty"){
        return p;
      };
    };
    throw "No empty procs";
  };

  var syscall_fork = function(p){
    print("syscall_fork called by pid: "+p.get_pid());
    var pn=get_empty_proc();
    print("found empty proc: "+pn.get_pid());
    var s=p.get_state();
    print(s.vmem.length);
    var vmem_new=[];
    for(var i=0;i<s.vmem.length;i++){
      print(i);
      var m=s.vmem[i];
      vmem_new.push([m[0],m[1].map(function(x){return x;})]);
    };
    s.vmem=vmem_new;

    p.set_eax(pn.get_pid());

    // copy over registers
    pn.set_eax(0); // eax must be set to 0 as this is the child
    pn.set_ecx(s.ecx);
    pn.set_edx(s.edx);
    pn.set_ebx(s.ebx);
    pn.set_esp(s.esp);
    pn.set_ebp(s.ebp);
    pn.set_esi(s.esi);
    pn.set_edi(s.edi);
    pn.set_eip(s.eip);
    pn.set_IF(s.IF);
    pn.set_ZF(s.ZF);
    pn.set_SF(s.SF);
    pn.set_CF(s.CF);
    pn.set_OF(s.OF);

    pn.set_vmem(s.vmem);

    pn.set_brk(s.brk);

    pn.set_dbg(s.dbg);

    print();
    print("pid: "+p.get_pid());
    info_registers(p);
    print();
    print("pid: "+pn.get_pid());
    info_registers(pn);
    print();

    // start up the procs
    p.set_status("running");
    pn.set_status("running");
//    throw "fork implementation incomplete";
  };

  var syscall_waitpid = function(p){
    var wait_on=p.get_ebx();
    print("syscall_waitpid called by: "+p.get_pid()+" waiting on pid:"+wait_on);
    p.set_status("waiting");
  };

  var syscall_lseek = function(p){
    var fd=p.get_ebx();
    var offset=p.get_ecx();
    var whence=p.get_edx();
    print("syscall_lseek called by: "+p.get_pid()+" fd: "+fd+
    " offset: "+offset+" whence: "+whence);
    if(whence!==0){
      throw "syscall_lseek whence not 0 (not implemented)";
    };
    p.fds[fd][0]=offset;
    p.set_eax(offset);
  };

  var syscall_execve = function(p){
    print("syscall_execve called by: "+p.get_pid());
    info_registers(p);
    var filename=vfs.mk_absolute(p.get_cwd()+"/"+p.read_c_string(p.get_ebx()));
    var ptr=p.get_ecx();
    print("syscall_execve filename: "+filename);
    var argv=[];
    var arg_p;
    while(arg_p=p.vr32(ptr)){
      argv.push(p.read_c_string(arg_p));
      ptr=ptr+4;
    };
    var ptr=p.get_edx();
    var envps=[];
    var env_p;
    while(env_p=p.vr32(ptr)){
      envps.push(p.read_c_string(env_p));
      ptr=ptr+4;
    };
    var argc=argv.length;
    print("syscall_execve argc: "+JSON.stringify(argc));
    print("syscall_execve argv: "+JSON.stringify(argv));
    print("syscall_execve envp: "+JSON.stringify(envps));

    var img=parse_elf(vfs.readFile(filename));
    var pr=new_process();
    process_table[p.get_pid()]=pr;
    pr.set_pid(p.get_pid());
    pr.add_mem(img);
    pr.set_eip(img.entry);
    pr.set_esp(0xffffdffc);
    var envp=[];
    for(var i=0;i<envps.length;i++){
      var x=envps[i];
      var envp_l=x.length+1;
      envp_p=pr.alloca(envp_l);
      pr.write_c_string(envp_p,x);
      envp.push(envp_p);
    };
    var argvp=[];
    for(var i=argv.length-1;i>-1;i--){
      var x=argv[i];
      var argv_l=x.length+1;
      argv_p=pr.alloca(argv_l);
      pr.write_c_string(argv_p,x);
      argvp.push(argv_p);
    };
    // last envp must be null
    pr.push32(0);
    //envp
    for(var i=0;i<envp.length;i++){
      pr.push32(envp[i]);
    };
    //last argv must be null (since we have only 1 argument)
    pr.push32(0);
    //argv[0] filename
    for(var i=0;i<argvp.length;i++){
      pr.push32(argvp[i]);
    };
    // argc
    pr.push32(argc);
    pr.set_dbg(false);
    pr.fds=[null,[0,[]],null];
    info_registers(pr);
    pr.set_status("running");
    if(filename==="/x86/artifact/M0"){
//      pr.set_dbg(true);
    };
//    throw "syscall_execve not fully implemented";
  };

  var syscall=function(pid){
    var proc=process_table[pid];
    var eax=proc.get_eax();
    // resume process by default. The syscalls may suspend the process again if
    // the syscall needs to wait
    proc.set_status("running");
    if(eax===5){
      syscall_open(proc);
    } else if(eax===3){
      syscall_read(proc);
    } else if(eax===4){
      syscall_write(proc);
    } else if(eax===1){
      syscall_exit(proc);
    } else if(eax===45){
      syscall_brk(proc);
    } else if(eax===2){
      syscall_fork(proc);
    } else if(eax===7){
      syscall_waitpid(proc);
    } else if(eax===11){
      syscall_execve(proc);
    } else if(eax===19){
      syscall_lseek(proc);
    } else {
      throw "pid: "+pid+" unsupported syscall: "+eax;
    };
  };

  process_table=[
  ];
  process_table.push(hp);
  hp.set_pid(0);

var run=function(){
  info_registers(hp);
  try{
    var r;
    while(hp.is_running()){
      while((r=hp.step())===0){
      };
      if(hp.get_int_no()===0x80){
        syscall(hp.get_pid());
      } else {
        throw "unsupported interrupt";
      };
    }
  } catch (e) {
    print(e);
  };
  info_registers(hp);
};


var run2=function(){
  dbg=true;
  print();
  print("trying to run kaem");
  pr=new_process();
  var img=parse_elf(kaem);

  pr.add_mem(img);
  pr.set_eip(img.entry);
  pr.set_esp(0xffffdffc);
  //envp[0/1]? null
  pr.push32(0);
  //argv[1] or envp[0]? null
  pr.push32(0);
  //argv[0] null
  pr.push32(0);
  // argc not sure if this should really be 0
  pr.push32(0);
  pr.eet_dbg(false);
  pr.fds=[null,[0,[]],null];
  process_table.push(pr);
  pr.set_pid(process_table.length-1);
  info_registers(pr);
  try{
    var r;
    while(pr.is_running()){
      while((r=pr.step())===0){
      };
      if(hp.get_int_no()===0x80){
        syscall(pr.get_pid());
      } else {
        throw "unsupported interrupt";
      };
    }
  } catch (e) {
    print(e);
  };
  info_registers(pr);
};


var run3=function(){
  process_table=[
  ];
  for(var i=0;i<9;i++){
    var p=new_process();
    p.set_pid(i);
    p.set_status("empty");
    process_table[i]= p;
  };


  // setup PID 1 (kaem process)
  var img=parse_elf(kaem);
  var pr=process_table[1];
  pr.add_mem(img);
  pr.set_eip(img.entry);
  pr.set_esp(0xffffdffc);
  var filename="./bootstrap-seeds/POSIX/x86/kaem-optional-seed";
  var filename_l=filename.length+1;
  var filename_p=p.alloca(filename_l);
  p.write_c_string(filename_p,filename);
  var envps=["COLUMNS=80","PWD=/","LINES=32"];
  var envp=[];
  for(var i=0;i<envps.length;i++){
    var x=envps[i];
    var envp_l=x.length+1;
    envp_p=pr.alloca(envp_l);
    pr.write_c_string(envp_p,x);
    envp.push(envp_p);
  };
  // last envp must be null
  pr.push32(0);
  //envp
  for(var i=0;i<envp.length;i++){
    pr.push32(envp[i]);
  };
  //argv[1] must be null (since we have only 1 argument)
  pr.push32(0);
  //argv[0] filename
  pr.push32(filename_p);
  // argc
  pr.push32(1);
  pr.set_dbg(false);
  pr.fds=[null,[0,[]],null];
  pr.set_pid(1);
  info_registers(pr);
  pr.set_status("running");

  var work=true;
  try {
  while(work){
    var p
    for(var i =1;i<process_table.length;i++){
      p=process_table[i];
      p.step();
    };
    work=false;
    for(var i =1;i<process_table.length;i++){
      p=process_table[i];
      var s=p.get_status();
      if(s==="syscall"){
        syscall(p.get_pid());
      };
      s=p.get_status();
      if(s==="running"){
        work=true;
      };
    };
    // go around again in case a process has been woken up
    for(var i =1;i<process_table.length;i++){
      p=process_table[i];
      s=p.get_status();
      if(s==="running"){
        work=true;
      };
    };
  };
  } catch(e){
    print(e);
    print(e.stack);
    print("error in pid: "+p.get_pid());
    info_registers(p);
  };
};

return {
  run: run,
  run2: run2,
  run3: run3,
  fs: fs,
};
})();

/*
kernel.run();
kernel.run2();

print();
print("done");
hex0_emu=kernel.fs["foo"]
print("hex0_emu length:" +hex0_emu.length);
outp_sha256=root.sha256(hex0_emu);
print();
print("hex0 sha256: "+outp_sha256+" "+(outp_sha256===hex0_sha256_expected));
*/

var vfs=(function(){

  var files={};

  var init=function(){
    print("loading all stage0-posix files");
    writeFile("./bootstrap-seeds/POSIX/x86/kaem-optional-seed",kaem);
    writeFile("./bootstrap-seeds/POSIX/x86/hex0-seed",hex0);
    f_names=read("filelist.txt").split("\n");
    // there is an empty newline at the end of the file
    f_names.pop();
    f_names.map(function(x){
      writeFile(x,read("stage0-posix/"+x,"binary"));
    });
  };

  var mk_absolute=function(filename){
    var fn_abs=[];
    f=filename.split("/");
    for(var i=0;i<f.length;i++){
      var c=f[i];
      if((c===".")|| (c==="")){
        // do nothing
      } else if(c===".."){
        fn_abs.pop();
      } else {
        fn_abs.push(c);
      }
    };
    return "/"+(fn_abs.join("/"));
  };

  var readFile=function(filename){
    filename=mk_absolute(filename);
    print("vfs.readFile: "+filename);
    return files[filename];
  };

  var writeFile=function(filename,arr){
    filename=mk_absolute(filename);
    print("vfs.writeFile: "+filename);
    files[filename]=arr;
  };

  init();

  return {
    readFile: readFile,
    writeFile: writeFile,
    mk_absolute: mk_absolute,
  };
})();

kernel.run3();
pt=process_table;

art_a=read("artifact.sha256sums").split("\n").map(function(x){return x.split("  ")});
art_a.pop();

art={};
art_a.map(function(x){art[vfs.mk_absolute(x[1])]=x[0]});

written_files.map(function(x){
  try{
    print();
    print(x);
    print(root.sha256(vfs.readFile(x)));
    print(art[x]);
  } catch(e){
    print(e);
  };
});

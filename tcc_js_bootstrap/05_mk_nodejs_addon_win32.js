load("tcc_em.js");
FS.mkdir("include");
FS.mkdir("include/node");
f={
  "bootstrap.c":"../tests/nodejs/bootstrap.c",
  "binding.c":"../tests/nodejs/binding.c",
  "binding_linux.c":"../tests/nodejs/binding_linux.c",
  "common.h":"../tests/nodejs/common.h",
  "binding.h":"../tests/nodejs/binding.h",
  "include/node/node_api.h":"../tests/nodejs/include/node/node_api.h",
  "include/node/node_api_types.h":"../tests/nodejs/include/node/node_api_types.h"
}
for(i in f){
  FS.writeFile(i, read(f[i]));
};
//args="-c bootstrap.c -I . -I include/node/ -o out.o"
args="-nostdinc -nostdlib -I /usr/include/:/usr/include/i386-linux-gnu/:/tmp/tcc/lib/tcc/include/ -c bootstrap.c -I . -I include/node/ -o out.o"
args=args.split(" ");
print(JSON.stringify(args));
Module.arguments=args;
obj_name="../tests/nodejs/lib/addon.o";
compile(obj_name);

mm={};
ctypes={};
ctypes.voidptr_t=function(){return 0};

ImageBase=0x10000000;
mmap_base=0;
libc.mmap=function(){
  print("mmap called");
  return mmap_base;
};
malloc_i=0;
malloc_bases=[0,0,ImageBase+8192,ImageBase+8192+1792];
libc.malloc=function(){
  print("malloc called");
  var r=malloc_bases[malloc_i];
  malloc_i++;
  return r;
}
libc.memcpy=function(){
  return 0;
}
load("../lib/elf_loader.js");

obj=mm.decode_elf(read(obj_name,"binary"));
//print(JSON.stringify(obj.und,null,"  "));

out=new Uint8Array(7168);

var to_char=function(x){
  return String.fromCharCode(x);
};

var char=function(x){
  return x.charCodeAt(0);
};

var compare = function(a,b){
  if(a.length!==b.length){
    return "error";
  };
  for(var i=0;i<a.length;i++){
    if(a[i]!==b[i]){
      return "compare error at:"+i;
    };
  };
  return "ok";
};

append=function(a,b){
  for(var i=0;i<b.length;i++){
    a.push(b[i]);
  };
};

hp=[
char("M"),char("Z"), /*WORD e_magic;         Magic number */
0x90,0x00,           /*WORD e_cblp;          Bytes on last page of file */
0x03,0x00,           /*WORD e_cp;            Pages in file */
0x00,0x00,           /*WORD e_crlc;          Relocations */
0x04,0x00,           /*WORD e_cparhdr;       Size of header in paragraphs */
0x00,0x00,           /*WORD e_minalloc;      Minimum extra paragraphs needed */
0xff,0xff,           /*WORD e_maxalloc;      Maximum extra paragraphs needed */
0x00,0x00,           /*WORD e_ss;            Initial (relative) SS value */
0xb8,0x00,           /*WORD e_sp;            Initial SP value */
0x00,0x00,           /*WORD e_csum;          Checksum */
0x00,0x00,           /*WORD e_ip;            Initial IP value */
0x00,0x00,           /*WORD e_cs;            Initial (relative) CS value */
0x40,0x00,           /*WORD e_lfarlc;        File address of relocation table */
0x00,0x00,           /*WORD e_ovno;          Overlay number */
0,0,0,0,0,0,0,0,     /*WORD e_res[4];        Reserved words */
0x00,0x00,           /*WORD e_oemid;         OEM identifier (for e_oeminfo) */
0x00,0x00,           /*WORD e_oeminfo;       OEM information; e_oemid specific */
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0, /*WORD e_res2[10];      Reserved words */

];
e_lfanew=0x80;
w_u32(hp,0x3c,e_lfanew); /*DWORD   e_lfanew;        File address of new exe header */
//0x80,0x00,0x00,0x00,
dosstub=[
0x0e,0x1f,0xba,0x0e,0x00,0xb4,0x09,0xcd,0x21,0xb8,0x01,0x4c,0xcd,0x21,0x54,0x68,
0x69,0x73,0x20,0x70,0x72,0x6f,0x67,0x72,0x61,0x6d,0x20,0x63,0x61,0x6e,0x6e,0x6f,
0x74,0x20,0x62,0x65,0x20,0x72,0x75,0x6e,0x20,0x69,0x6e,0x20,0x44,0x4f,0x53,0x20,
0x6d,0x6f,0x64,0x65,0x2e,0x0d,0x0d,0x0a,0x24,0x00,0x00,0x00,0x00,0x00,0x00,0x00
];

append(hp,dosstub);

// pe magic
append(hp,[0x50,0x45,0x00,0x00]);

COFF_File_Header={
  Machine : {offset:0,size:2,value:0x14c}, // "PE"
  NumberOfSections: {offset:2,size:2,value:3},
  TimeDateStamp:{offset:4,size:4,value:0},
  PointerToSymbolTable:{offset:8,size:4,value:0},
  NumberOfSymbols:{offset:12,size:4,value:0},
  SizeOfOptionalHeader:{offset:16,size:2,value:0xe0},
  Characteristics:{offset:18,size:2,value:0x230e},
}
COFF_File_Header_offset=e_lfanew+4;

w_str=function(a,o,s){
  s=s.split("");
  for(var i=0;i<s.length;i++){
    a[o+i]=char(s[i]);
  };
  return;
};

write_struct=function(a,o,s){
  var l=0;
  for(var i in s){
    var v=s[i];
    if(typeof v.value==="number"){
      if(v.size===1){
        a[o+v.offset]=v.value;
      };
      if(v.size===2){
        w_u16(a,o+v.offset,v.value);
      };
      if(v.size===4){
        w_u32(a,o+v.offset,v.value);
      };
      l=l+v.size;
    };
    if(typeof v.value==="string"){
      w_str(a,o+v.offset,v.value);
      l=l+v.value.length;
    }
  };
  return l;
};

l=write_struct(hp,COFF_File_Header_offset,COFF_File_Header);

Optional_Header_offset=COFF_File_Header_offset+l;

Optional_Header={
  Magic: {offset:0,size:2,value:0x10b},
  MajorLinkerVersion : {offset:2,size:1,value:0x06},
  MinorLinkerVersion : {offset:3,size:1,value:0x00},
  SizeOfCode: {offset:4,size:4,value:0x1000},
  SizeOfInitializedData : {offset:8,size:4,value:0xa00},
  SizeOfUninitializedData : {offset:12,size:4,value:0},
  AddressOfEntryPoint : {offset:16,size:4,value:0},
  BaseOfCode : {offset:20,size:4,value:0x1000},
  BaseOfData : {offset:24,size:4,value:0x2000},
  ImageBase : {offset:28,size:4,value:ImageBase},
  SectionAlignment : {offset:32,size:4,value:0x1000},
  FileAlignment : {offset:36,size:4,value:0x200},
  MajorOperatingSystemVersion : {offset:40,size:2,value:0x04},
  MinorOperatingSystemVersion : {offset:42,size:2,value:0x0},
  MajorImageVersion : {offset:44,size:2,value:0x0},
  MinorImageVersion : {offset:46,size:2,value:0x0},
  MajorSubsystemVersion : {offset:48,size:2,value:0x4},
  MinorSubsystemVersion : {offset:50,size:2,value:0x0},
  Win32VersionValue : {offset:52,size:4,value:0x0},
  SizeOfImage : {offset:56,size:4,value:0x4000},
  SizeOfHeaders : {offset:60,size:4,value:0x200},
  CheckSum : {offset:64,size:4,value:0xfbd1},
  Subsystem : {offset:68,size:2,value:0x2},
  DllCharacteristics : {offset:70,size:2,value:0x0},
  SizeOfStackReserve : {offset:72,size:4,value:0x100000},
  SizeOfStackCommit : {offset:76,size:4,value:0x1000},
  SizeOfHeapReserve : {offset:80,size:4,value:0x100000},
  SizeOfHeapCommit : {offset:84,size:4,value:0x1000},
  LoaderFlags : {offset:88,size:4,value:0x0},
  NumberOfRvaAndSizes : {offset:92,size:4,value:0x10},
};

l=write_struct(hp,Optional_Header_offset,Optional_Header);

opt_head_raw=[];

for(var i=0;i<16*8;i++){
  opt_head_raw.push(0);
};

write_dd=function(a,x){
  w_u32(a,x.dd_offset*8,x.VirtualAddress);
  w_u32(a,x.dd_offset*8+4,x.Size);
};

Export_Table = {
  "dd_offset":0,
  "VirtualAddress": 9728,
  "Size": 91,
};
et=Export_Table;
write_dd(opt_head_raw,et);

et_data=[];
for(var i=0;i<et.Size;i++){
  et_data[i]=0;
};

et_struct={
  Export_Flags : {offset:0,size:4,value:0},
  Time_Date_Stamp : {offset:4,size:4,value:0},
  Major_Version : {offset:8,size:2,value:0},
  Minor_Version : {offset:10,size:2,value:0},
  Name_RVA : {offset:12,size:4,value:0x2632},
  Ordinal_Base : {offset:16,size:4,value:1},
  Address_Table_Entries : {offset:20,size:4,value:1},
  Number_of_Name_Pointers : {offset:24,size:4,value:1},
  Export_Address_Table_RVA : {offset:28,size:4,value:0x2628},
  Name_Pointer_RVA : {offset:32,size:4,value:0x262c},
  Ordinal_Table_RVA : {offset:36,size:4,value:0x2630},
  Export_Name_Pointer_Table: {offset:40,size:4,value:0x1d28},
  Name_Pointer_Table: {offset:44,size:4,value:0x2643},
  Name: {offset:50,size:4,value:"addon_win32.node"},
  Export_Name: {offset:67,size:4,value:"napi_register_module_v1"},
};

write_struct(et_data,0,et_struct);

et.Data=et_data;
print("\net_struct stuff:");
for(i in et_struct){print(i+":"+(et_struct[i].value-et.VirtualAddress))};
print("");
Import_Table = {
  "dd_offset":1,
  "VirtualAddress": 0x2300,
  "Size": 80,
};
it=Import_Table;
write_dd(opt_head_raw,it);
Base_Relocation_Table = {
  "dd_offset":5,
  "VirtualAddress": 0x3000,
  "Size":132,
  "Data": []
};
brt=Base_Relocation_Table;
write_dd(opt_head_raw,brt);
IAT = {
  "dd_offset":12,
  "VirtualAddress": 0x2350,
  "Size": 104,
};
iat=IAT;
write_dd(opt_head_raw,iat);

append(hp,opt_head_raw);

mp=[
{"thunk_address":0x10001e78,"iat_address":0x10002350,"iat_value":0x242b,"symbol_name":"printf"},
{"thunk_address":0x10001e80,"iat_address":0x10002368,"iat_value":0x2464,"symbol_name":"LoadLibraryA"},
{"thunk_address":0x10001e88,"iat_address":0x1000236c,"iat_value":0x2473,"symbol_name":"GetProcAddress"},
{"thunk_address":0x10001e90,"iat_address":0x10002374,"iat_value":0x248d,"symbol_name":"napi_get_cb_info"},
{"thunk_address":0x10001e98,"iat_address":0x10002378,"iat_value":0x24a0,"symbol_name":"napi_get_last_error_info"},
{"thunk_address":0x10001ea0,"iat_address":0x1000237c,"iat_value":0x24bb,"symbol_name":"napi_is_exception_pending"},
{"thunk_address":0x10001ea8,"iat_address":0x10002380,"iat_value":0x24d7,"symbol_name":"napi_throw_error"},
{"thunk_address":0x10001eb0,"iat_address":0x10002384,"iat_value":0x24ea,"symbol_name":"napi_typeof"},
{"thunk_address":0x10001eb8,"iat_address":0x10002388,"iat_value":0x24f8,"symbol_name":"napi_get_value_int32"},
{"thunk_address":0x10001ec0,"iat_address":0x1000238c,"iat_value":0x250f,"symbol_name":"napi_is_typedarray"},
{"thunk_address":0x10001ec8,"iat_address":0x10002390,"iat_value":0x2524,"symbol_name":"napi_get_typedarray_info"},
{"thunk_address":0x10001ed0,"iat_address":0x10002394,"iat_value":0x253f,"symbol_name":"napi_get_arraybuffer_info"},
{"thunk_address":0x10001ed8,"iat_address":0x10002398,"iat_value":0x255b,"symbol_name":"napi_create_double"},
{"thunk_address":0x10001ee0,"iat_address":0x10002354,"iat_value":0x2434,"symbol_name":"sprintf"},
{"thunk_address":0x10001ee8,"iat_address":0x10002358,"iat_value":0x243e,"symbol_name":"puts"},
{"thunk_address":0x10001ef0,"iat_address":0x1000235c,"iat_value":0x2445,"symbol_name":"strlen"},
{"thunk_address":0x10001ef8,"iat_address":0x1000239c,"iat_value":0x2570,"symbol_name":"napi_create_string_utf8"},
{"thunk_address":0x10001f00,"iat_address":0x100023a0,"iat_value":0x258a,"symbol_name":"napi_get_global"},
{"thunk_address":0x10001f08,"iat_address":0x100023a4,"iat_value":0x259c,"symbol_name":"napi_call_function"},
{"thunk_address":0x10001f10,"iat_address":0x100023a8,"iat_value":0x25b1,"symbol_name":"napi_create_function"},
{"thunk_address":0x10001f18,"iat_address":0x100023ac,"iat_value":0x25c8,"symbol_name":"napi_set_named_property"},
{"thunk_address":0x10001f20,"iat_address":0x10002360,"iat_value":0x244e,"symbol_name":"memset"},
{"thunk_address":0x10001f28,"iat_address":0x100023b0,"iat_value":0x25e2,"symbol_name":"napi_define_properties"}];

iat_data=[];
for(var i=0;i<iat.Size;i++){
  iat_data.push(0);
};
for(var i=0;i<mp.length;i++){
  w_u32(iat_data,mp[i].iat_address-iat.VirtualAddress-ImageBase,mp[i].iat_value);
};

iat.Data=iat_data;

Section_Headers = {
  ".text": {
    "Name": ".text",
    "VirtualSize": 3888,
    "VirtualAddress": 4096,
    "SizeOfRawData": 4096,
    "PointerToRawData": 512,
    "PointerToRelocations": 0,
    "PointerToLinenumbers": 0,
    "NumberOfRelocations": 0,
    "NumberOfLinenumbers": 0,
    "Characteristics": 1610612768
  },
  ".data": {
    "Name": ".data",
    "VirtualSize": 1660,
    "VirtualAddress": 8192,
    "SizeOfRawData": 2048,
    "PointerToRawData": 4608,
    "PointerToRelocations": 0,
    "PointerToLinenumbers": 0,
    "NumberOfRelocations": 0,
    "NumberOfLinenumbers": 0,
    "Characteristics": -1073741760
  },
  ".reloc": {
    "Name": ".reloc",
    "VirtualSize": 132,
    "VirtualAddress": 12288,
    "SizeOfRawData": 512,
    "PointerToRawData": 6656,
    "PointerToRelocations": 0,
    "PointerToLinenumbers": 0,
    "NumberOfRelocations": 0,
    "NumberOfLinenumbers": 0,
    "Characteristics": 1107296320
  }
};
ts=Section_Headers[".text"];
ds=Section_Headers[".data"];
rs=Section_Headers[".reloc"];

sh=[];
section_table_entry_size=40
for(var i=0;i<section_table_entry_size*3;i++){
  sh.push(0);
}

[ts,ds,rs].forEach(function(x,j){
  ob=j*section_table_entry_size;
  for(var i=0;i<x.Name.length;i++){
    sh[i+ob]=char(x.Name[i]);
  };
  ob=ob+8;
  w_u32(sh,ob,x.VirtualSize);
  ob=ob+4;
  w_u32(sh,ob,x.VirtualAddress);
  ob=ob+4;
  w_u32(sh,ob,x.SizeOfRawData);
  ob=ob+4;
  w_u32(sh,ob,x.PointerToRawData);
  ob=ob+4;
  w_u32(sh,ob,x.PointerToRelocations);
  ob=ob+4;
  w_u32(sh,ob,x.PointerToLinenumbers);
  ob=ob+4;
  w_u16(sh,ob,x.NumberOfRelocations);
  ob=ob+2;
  w_u16(sh,ob,x.NumberOfLinenumbers);
  ob=ob+2;
  w_u32(sh,ob,x.Characteristics);
  ob=ob+4;
});


append(hp,sh);

// header needs to be 512 bytes long
while(hp.length<512){hp.push(0)};

header=hp;

function f_off(s,a){
  return a-s.VirtualAddress+s.PointerToRawData;
};
function hex(x){
  return "0x"+x.toString(16);
};
et_off=f_off(ds,Export_Table.VirtualAddress);
print("Export_Table f_off: "+hex(et_off));
it_off=f_off(ds,Import_Table.VirtualAddress);
print("Import_Table f_off: "+hex(it_off));
brt_off=f_off(rs,Base_Relocation_Table.VirtualAddress);
print("Base_Relocation_Table f_off: "+hex(brt_off));
iat_off=f_off(ds,IAT.VirtualAddress);
print("IAT f_off: "+hex(iat_off));


for(var i=0;i<header.length;i++){
out[i]=header[i];
};


for(var i=0;i<iat.Size;i++){
  out[i+iat_off]=iat.Data[i];
};

Import_Directory_Table = [];
idt = Import_Directory_Table;

function get_u32(x,o){
  return x[0+o]+(x[1+o]<<8)+(x[2+o]<<16)+(x[3+o]<<24);
};

imported_dlls={
  "msvcrt.dll":0x2420,
  "kernel32.dll":0x2457,
  "node.exe":0x2484,
};

idt_pretty=[
  {
    "Import_Lookup_Table_RVA": 9144,
    "Date_Time_Stamp": 0,
    "Forwarder_Chain": 0,
    "Name_RVA": imported_dlls["msvcrt.dll"],
    "Import_Address_Table_RVA": 9040
  },
  {
    "Import_Lookup_Table_RVA": 9168,
    "Date_Time_Stamp": 0,
    "Forwarder_Chain": 0,
    "Name_RVA": imported_dlls["kernel32.dll"],
    "Import_Address_Table_RVA": 9064
  },
  {
    "Import_Lookup_Table_RVA": 9180,
    "Date_Time_Stamp": 0,
    "Forwarder_Chain": 0,
    "Name_RVA": imported_dlls["node.exe"],
    "Import_Address_Table_RVA": 9076
  }
]
idt_struct={
  Import_Lookup_Table_RVA: {offset:0,size:4,value:0},
  Date_Time_Stamp: {offset:4,size:4,value:0},
  Forwarder_Chain: {offset:8,size:4,value:0},
  Name_RVA: {offset:12,size:4,value:0},
  Import_Address_Table_RVA: {offset:16,size:4,value:0}
};

idt_data=[];
for(var i=0;i<it.Size;i++){
  idt_data[i]=0;
}

for(var i=0;i<idt_pretty.length;i++){
  print("i="+i);
  var c=idt_pretty[i];
  for(j in c){
    idt_struct[j].value=c[j];
  };
  write_struct(idt_data,i*20,idt_struct);
};

it.Data=idt_data;

for(var i=0;i<it.Size;i++){
  out[i+it_off]=it.Data[i];
};

idt=idt_pretty;

print(JSON.stringify(idt,null,"  "));
idt.map(function(x){
  for(i in x){
    print(i+" "+hex(f_off(ds,x[i])));
  };
print("");
});

// this is the import lookup table offset
ilt_off=f_off(ds,idt[0].Import_Lookup_Table_RVA);
for(var i=0;i<iat.Size;i++){
  out[i+ilt_off]=iat.Data[i];
};

hnt_base=0x1620;

h2=[];
for(var i=0;i<480;i++){
h2.push(0);
};
for(var i=0;i<mp.length;i++){
  o=mp[i].iat_value-to_virtual(ds,hnt_base)+2;
  w_str(h2,o,mp[i].symbol_name);
};

for(i in imported_dlls){
  w_str(h2,imported_dlls[i]-to_virtual(ds,hnt_base),i);
}

h2=h2.map(to_char).join("");

Hint_Name_Table_pretty=h2;

Hint_Name_Table_new=[];

for(var i=0;i<Hint_Name_Table_pretty.length;i++){
  Hint_Name_Table_new.push(char(Hint_Name_Table_pretty[i]));
};

Hint_Name_Table=Hint_Name_Table_new;

hnt=Hint_Name_Table;
for(var i=0;i<hnt.length;i++){
  out[i+hnt_base]=hnt[i];
};

data=obj.sections[".data"].raw;
for(i=0;i<data.length;i++){
  out[ds.PointerToRawData+i]=data[i];
};

thunks_pretty=[];

t2=[];
for(var i=0;i<mp.length;i++){
t2.push(mp[i].iat_address);
};

thunks_addresses=t2;

for(var i=0;i<thunks_addresses.length;i++){
  //jmp is 0xFF 0x25
  thunks_pretty.push(0xFF);
  thunks_pretty.push(0x25);
  // address
  w_u32(thunks_pretty,thunks_pretty.length,thunks_addresses[i]);
  // pad
  thunks_pretty.push(0);
  thunks_pretty.push(0);
};

thunks=thunks_pretty;

thunk_off=0x1078;
for(var i=0;i<thunks.length;i++){
  out[i+thunk_off]=thunks[i];
};


// fixme should calculate dlopen/dlsym address
imp={
  relocate_all:function(){print("dummy relocate called")},
  exports: [
    {"st_name":"dlopen","address":0x10001e80},
    {"st_name":"dlsym","address":0x10001e88},
  ]
};

function get_str(a,o){
  print(o);
  var c;
  var t=[];
  while((c=a[o])!==0){
    t.push(String.fromCharCode(c));
    o++;
  };
  return t.join("");
};

function to_virtual(s,a){
  return a+s.VirtualAddress-s.PointerToRawData;

};
iat_d=iat.Data;
m={};
for(var i=0;i<iat_d.length;i=i+4){
  var o=get_u32(iat_d,i);
  var e={};
  if(o!==0){
    m[ImageBase+to_virtual(ds,iat_off+i)]=[o,get_str(hnt, f_off(ds,o+2)-hnt_base)];
//    imp.exports.push({st_name:"foo",address:hexo)});
    print(hex(o));
  }
};

im=imp.exports;
for(var i=0;i<thunks.length;i=i+8){
  var a=ImageBase+to_virtual(ts,thunk_off+i);
  var o=get_u32(thunks,i+2);
  var t={thunk_address:hex(a),iat_address:hex(o),iat_value:hex(m[o][0]),symbol_name:m[o][1]};
//  print([hex(a),hex(o),hex(m[o][0]),m[o][1]]);
  print('{"thunk_address":'+t.thunk_address+',"iat_address":'+t.iat_address+',"iat_value":'+t.iat_value+',"symbol_name":"'+t.symbol_name+'"},');
  im.push({st_name:m[o][1],address:a});
};

print(JSON.stringify(imp,null,"  "));
print(JSON.stringify(m,null,"  "));
link=function(x){
  var exports={};
  for(var i=0;i<x.length;i++){
    for(var j=0;j<x[i].exports.length;j++){
      var k=x[i].exports[j];
      exports[k.st_name]=k;
    }
  }
  var o={};
  o.exports=exports;
  for(var i=0;i<x.length;i++){
    x[i].imports=exports;
    x[i].relocate_all();
  }
  return o;
};


syms={};
ex=obj.exports;
for(var i=0;i<ex.length;i++){
  syms[ex[i].st_name]=ex[i];
};

// this is a hack to strip out a bunch of crap glibc adds to our binary
ctypes_open_off=syms["ctypes_open"].address;

// load the object code again since we need to shift the load address
// by ctypes_open_off bytes
mmap_base=ImageBase+4096-ctypes_open_off;

obj=mm.decode_elf(read(obj_name,"binary"));
lnk=link([obj,imp]);

syms={};
ex=obj.exports;
for(var i=0;i<ex.length;i++){
  syms[ex[i].st_name]=ex[i];
};
Export_Directory_Table = {
  "Export_Flags": 0,
  "Time_Date_Stamp": 0,
  "Major_Version": 0,
  "Minor_Version": 0,
  "Name_RVA": 9778,
  "Ordinal_Base": 1,
  "Address_Table_Entries": 1,
  "Number_of_Name_Pointers": 1,
  "Export_Address_Table_RVA": 9768,
  "Name_Pointer_RVA": 9772,
  "Ordinal_Table_RVA": 9776
}
edt=Export_Directory_Table;

// fill in export table
for(var i=0;i<et.Size;i++){
  out[i+et_off]=et.Data[i];
};

function w_u32(i,o,x){
i[o]=(x&0xFF);
i[o+1]=((x>>>8)&0xFF);
i[o+2]=((x>>>16)&0xFF);
i[o+3]=((x>>>24)&0xFF);
};

function w_u16(i,o,x){
i[o]=(x&0xFF);
i[o+1]=((x>>>8)&0xFF);
};

function g_u32(i,o){
  return (i[o]&0xFF)+ (i[o+1]<<8)+ (i[o+2]<<16)+ (i[o+3]<<24);
};

init=f_off(ds,edt.Export_Address_Table_RVA);

print("edt old: "+hex(get_u32(out,init)));
w_u32(out,init,syms["napi_register_module_v1"].address-ImageBase);
print("edt new: "+hex(get_u32(out,init)));

text=obj.sections[".text"].raw;
for(i=0;i<text.length-ctypes_open_off;i++){
  out[ts.PointerToRawData+i]=text[i+ctypes_open_off];
};

// relocations

w_u32(out,brt_off,0x1000);

relocs=[];
obj.sections[".rel.text"].dec.forEach(
  function(x){
    if(x.type==="R_386_32"){
      x.r_offset=x.r_offset-ctypes_open_off;
      relocs.push(x);
    }
  });
for(var i=0;i<mp.length;i++){
  relocs.push({r_offset:(mp[i].thunk_address+2-ImageBase-ts.VirtualAddress)});
}

// base relocation table needs to be a multiple of 32 bits long
l=relocs.length;
if((l % 2)===1){
 l++;
};

w_u32(out,brt_off+4,2*l+8);

for(var i=0;i<relocs.length;i++){
  relocs[i]=0x3000+relocs[i].r_offset;
  w_u16(out,brt_off+8+i*2,relocs[i]);
  print(hex(relocs[i]));
};

try{
  fs.writeFileSync("../tests/nodejs/lib/addon_win32.node",out);
} catch(e){
  print("couldn't use fs, we must be in SM");
}

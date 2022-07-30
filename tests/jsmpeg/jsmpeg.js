print("jsmpeg demo");
print("make sure the video file exists at ../vid/big-buck-bunny.mpg");
print("file can be obtained from https://phoboslab.org/files/jsmpeg/big-buck-bunny.mpg");
print("in this demo only video is supported (similar to the original jsmpeg version https://github.com/phoboslab/jsmpeg/tree/v0.2 ) have a look at that github page if you want to encode your own video with ffmpeg");

load("lib/gen_wrap.js");
load("lib/setup_sdl.js");

jsmpeg_srcdir=test_path+"/jsmpeg_src/";

libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));

sdl_obj=mm.load_c_string(read(jsmpeg_srcdir+"/sdl_test2.c"));

jsmpeg_obj=mm.load_c_string(read(jsmpeg_srcdir+"/jsmpeg_all.c"),{extra_flags:"-I "+jsmpeg_srcdir});

passthrough={
  "malloc": true,
  "memset": true,
  "memcpy": true,
  "memmove": true,
  "abs": true,
  "exit": true,
  "realloc": true,
  "printf": true,
};

exclude={
  "__fixsfdi": true,
};

overrides=[];

und=[];
for(var i=0;i<jsmpeg_obj.und.length;i++){
  var c=jsmpeg_obj.und[i].st_name;
  und.push(c);
  if(!exclude[c]){
    if(!passthrough[c]){
      d="ljw_crash_"+c;
    } else {
      d=c;
    };
    overrides.push([d,c]);
  };
};
und=und.sort();
var stubs_src=[];
stubs_src.push("ljw_stubs(){");
my_libc_src=[];
for(var i=0;i<und.length;i++){
  var s=und[i];
  if(!exclude[s]){
    stubs_src.push(s+"();");
    my_libc_src.push("ljw_crash_"+s+"(){printf(\"unimplemented: "+s+"\\n\");exit(1);}");
  };
};
my_libc_src= my_libc_src.join("\n");
stubs_src.push("}");
stubs_src=stubs_src.join("\n");
//  print("stubs:");
//  print(stubs_src);
stubs=mm.load_c_string(stubs_src);
//  print(JSON.stringify(overrides, null, " "));
//  print(my_libc_src);
my_libc=mm.load_c_string(my_libc_src);

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

jsmpeg=mm.link([jsmpeg_obj,sdl_obj,libsdl.syms,my_wrap,libtcc1]);


print("load complete");

load(test_path+"/YCbCrToRGBA.js");

try{
  print(Duktape);
  print("Duktape overriding YCbCrToRGBA");
  YCbCrToRGBA=jsmpeg.get_fn("YCbCrToRGBA");
} catch (e){
  print("Not using manual C port of YCbCrToRGBA");
};

var use_bc;
if(use_bc){
  load(test_path+"/YCbCrToRGBA_bc_version.js");
  YCbCrToRGBA=YCbCrToRGBA_bc;
};

var perf;

if(perf){
  YCbCrToRGBA_real=YCbCrToRGBA;
  YCbCrToRGBA=function(y, cb, cr, rgba, width, height){
    var st=Date.now();
    var r=YCbCrToRGBA_real(y, cb, cr, rgba, width, height)
    print("YCbCrToRGBA time: "+(Date.now()-st));
    return r;
  };
};

width=640;
height=360;

fb_r=new ArrayBuffer(width*height*4);
fb_y=new ArrayBuffer(width*height);
fb_cr=new ArrayBuffer(width*height/4);
fb_cb=new ArrayBuffer(width*height/4);

fb=new Uint8ClampedArray(fb_r);
fby=new Uint8Array(fb_y);
fbcr=new Uint8Array(fb_cr);
fbcb=new Uint8Array(fb_cb);
var j=0;

frn=0;

frame=function(){
  cur=Date.now();
  if(((cur-t0)/1000)*24 <frn){
    return false;
  }
  frn++;
  mpeg1_decoder_decode(decoder);
  //print(mpeg1_decoder_get_coded_size(decoder)/width);
  memcpy(fb_y,mpeg1_decoder_get_y_ptr(decoder),fby.length);
  memcpy(fb_cr,mpeg1_decoder_get_cr_ptr(decoder),fbcr.length);
  memcpy(fb_cb,mpeg1_decoder_get_cb_ptr(decoder),fbcb.length);

  YCbCrToRGBA(fby,fbcb,fbcr,fb,width,height);

  memcpy(get_framebuffer_sdl(),fb_r,fb.length);
  return true;
}

mpeg1_decoder_create=jsmpeg.get_fn("mpeg1_decoder_create");
mpeg1_decoder_get_write_ptr=jsmpeg.get_fn("mpeg1_decoder_get_write_ptr");
mpeg1_decoder_did_write=jsmpeg.get_fn("mpeg1_decoder_did_write");
mpeg1_decoder_get_frame_rate=jsmpeg.get_fn("mpeg1_decoder_get_frame_rate");
mpeg1_decoder_get_width=jsmpeg.get_fn("mpeg1_decoder_get_width");
mpeg1_decoder_get_height=jsmpeg.get_fn("mpeg1_decoder_get_height");
mpeg1_decoder_decode=jsmpeg.get_fn("mpeg1_decoder_decode");
mpeg1_decoder_get_y_ptr=jsmpeg.get_fn("mpeg1_decoder_get_y_ptr");
mpeg1_decoder_get_cr_ptr=jsmpeg.get_fn("mpeg1_decoder_get_cr_ptr");
mpeg1_decoder_get_cb_ptr=jsmpeg.get_fn("mpeg1_decoder_get_cb_ptr");

init_sdl=jsmpeg.get_fn("init_sdl");
get_framebuffer_sdl=jsmpeg.get_fn("get_framebuffer_sdl");
my_sdl_main=jsmpeg.get_fn("my_sdl_main");

memcpy=jsmpeg.get_fn("memcpy");

vid=read("../vid/big-buck-bunny.mpg","binary");
decoder=mpeg1_decoder_create(vid.length,2);
write_ptr= mpeg1_decoder_get_write_ptr(decoder,vid.length);

libc.memcpy(write_ptr,vid,vid.length);
mpeg1_decoder_did_write(decoder,vid.length);
print("Framerate: "+ mpeg1_decoder_get_frame_rate(decoder));
print("width: "+ mpeg1_decoder_get_width(decoder));
print("height: "+ mpeg1_decoder_get_height(decoder));

function go(){
  init_sdl();
  t0=Date.now();
  //set_sdl_buf_raw(fb_r);
  var st=Date.now();

  while(1){
    cur=Date.now();
    if(frame(cur-st)){
      my_sdl_main();
    };
    st=cur;
  }
};

go();

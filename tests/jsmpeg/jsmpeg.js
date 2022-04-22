print("jsmpeg demo");
print("make sure the video file exists at ../vid/big-buck-bunny.mpg");

load("lib/gen_wrap.js");

jsmpeg_srcdir=test_path+"/jsmpeg_src/";

libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));

jsmpeg_obj=mm.load_c_string(read(jsmpeg_srcdir+"/jsmpeg_all.c"),{extra_flags:"-I "+jsmpeg_srcdir});

passthrough={
  "malloc": true,
  "memset": true,
  "memcpy": true,
};

exclude={
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

jsmpeg=mm.link([jsmpeg_obj,my_wrap,libtcc1]);


print("load complete");

width=640;
height=360;

fb_r=new ArrayBuffer(width*height*4);
fb_y=new ArrayBuffer(width*height);
fb_cr=new ArrayBuffer(width*height/2);
fb_cb=new ArrayBuffer(width*height/2);

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
  libc.memcpy2(fb_y,mpeg1_decoder_get_y_ptr(decoder),fby.length);
  libc.memcpy2(fb_cr,mpeg1_decoder_get_cr_ptr(decoder),fbcr.length);
  libc.memcpy2(fb_cb,mpeg1_decoder_get_cb_ptr(decoder),fbcb.length);
/*
for(var i=0;i<width*height;i++){
fb[i*4]=fby[i];
fb[i*4+1]=fby[i];
fb[i*4+2]=fby[i];
fb[i*4+3]=fby[i];
}
*/
  YCbCrToRGBA(fby,fbcb,fbcr,fb);
  libc.memcpy(get_framebuffer_sdl(),fb_r,fb.length);
  return true;
}

mpeg1_decoder_create=jsmpeg.get_fn("mpeg1_decoder_create");
mpeg1_decoder_get_write_ptr=jsmpeg.get_fn("mpeg1_decoder_get_write_ptr");
mpeg1_decoder_did_write=jsmpeg.get_fn("mpeg1_decoder_did_write");
mpeg1_decoder_get_frame_rate=jsmpeg.get_fn("mpeg1_decoder_get_frame_rate");
mpeg1_decoder_get_width=jsmpeg.get_fn("mpeg1_decoder_get_width");
mpeg1_decoder_get_height=jsmpeg.get_fn("mpeg1_decoder_get_height");

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

// go();

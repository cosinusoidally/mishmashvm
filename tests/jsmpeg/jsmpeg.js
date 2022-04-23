print("jsmpeg demo");
print("make sure the video file exists at ../vid/big-buck-bunny.mpg");

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

// YCbCrToRGBA is lifted from jsmpeg so this function (and only this function) is
// covered by the same license and jsmpeg see LICENSE_jsmpeg

YCbCrToRGBA = function(y, cb, cr, rgba, width, height) {

        // Chroma values are the same for each block of 4 pixels, so we proccess
        // 2 lines at a time, 2 neighboring pixels each.
        // I wish we could use 32bit writes to the RGBA buffer instead of writing
        // each byte separately, but we need the automatic clamping of the RGBA
        // buffer.

        var w = ((width + 15) >> 4) << 4,
                w2 = w >> 1;

        var yIndex1 = 0,
                yIndex2 = w,
                yNext2Lines = w + (w - width);

        var cIndex = 0,
                cNextLine = w2 - (width >> 1);

        var rgbaIndex1 = 0,
                rgbaIndex2 = width * 4,
                rgbaNext2Lines = width * 4;

        var cols = width >> 1,
                rows = height >> 1;

        var ccb, ccr, r, g, b;

        for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                        ccb = cb[cIndex];
                        ccr = cr[cIndex];
                        cIndex++;

                        r = (ccb + ((ccb * 103) >> 8)) - 179;
                        g = ((ccr * 88) >> 8) - 44 + ((ccb * 183) >> 8) - 91;
                        b = (ccr + ((ccr * 198) >> 8)) - 227;

                        // Line 1
                        var y1 = y[yIndex1++];
                        var y2 = y[yIndex1++];
                        rgba[rgbaIndex1]   = y1 + r;
                        rgba[rgbaIndex1+1] = y1 - g;
                        rgba[rgbaIndex1+2] = y1 + b;
                        rgba[rgbaIndex1+4] = y2 + r;
                        rgba[rgbaIndex1+5] = y2 - g;
                        rgba[rgbaIndex1+6] = y2 + b;
                        rgbaIndex1 += 8;

                        // Line 2
                        var y3 = y[yIndex2++];
                        var y4 = y[yIndex2++];
                        rgba[rgbaIndex2]   = y3 + r;
                        rgba[rgbaIndex2+1] = y3 - g;
                        rgba[rgbaIndex2+2] = y3 + b;
                        rgba[rgbaIndex2+4] = y4 + r;
                        rgba[rgbaIndex2+5] = y4 - g;
                        rgba[rgbaIndex2+6] = y4 + b;
                        rgbaIndex2 += 8;
                }

                yIndex1 += yNext2Lines;
                yIndex2 += yNext2Lines;
                rgbaIndex1 += rgbaNext2Lines;
                rgbaIndex2 += rgbaNext2Lines;
                cIndex += cNextLine;
        }
};

try{
  print(Duktape);
  print("Duktape overriding YCbCrToRGBA");
  YCbCrToRGBA=jsmpeg.get_fn("YCbCrToRGBA");
} catch (e){
  print("In spidermonkey no YCbCrToRGBA override");
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

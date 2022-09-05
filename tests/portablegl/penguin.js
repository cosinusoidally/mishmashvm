print("penguin puzzle");
print("WIP not working yet");
name="penguin";

load(test_path+"/main.js");

var debug;

log=function(x){
  if(debug){
    print(x);
  };
}
pgl={
  update: demo.get_fn("update"),
  glFrontFace: demo.get_fn("glFrontFace"),
  glClearColor: demo.get_fn("wrap_glClearColor"),
  glClear: demo.get_fn("glClear"),
  glCullFace: demo.get_fn("glCullFace"),
  glEnable: demo.get_fn("glEnable"),
  glDepthRange: demo.get_fn("wrap_glDepthRange"),
  glClearDepth: demo.get_fn("wrap_glClearDepth"),
  glGenTextures: demo.get_fn("glGenTextures"),
  glActiveTexture: demo.get_fn("glActiveTexture"),
  glBindTexture: demo.get_fn("wrap_glBindTexture"),
  glTexImage2D: demo.get_fn("glTexImage2D"),
  glTexParameteri: demo.get_fn("glTexParameteri"),
  create_program: demo.get_fn("create_program"),
  pglSetUniform: demo.get_fn("pglSetUniform"),
  glGenBuffers: demo.get_fn("glGenBuffers"),
  glBindBuffer: demo.get_fn("glBindBuffer"),
  glBufferData: demo.get_fn("glBufferData"),
  glVertexAttribPointer: demo.get_fn("glVertexAttribPointer"),
  glEnableVertexAttribArray: demo.get_fn("glEnableVertexAttribArray"),
  glDepthMask: demo.get_fn("glDepthMask"),
  glDrawArrays: demo.get_fn("glDrawArrays"),
  glDrawElements: demo.get_fn("glDrawElements"),
  glUseProgram: demo.get_fn("glUseProgram"),
};
pgl.consts={};
pgl.consts['GL_COLOR_BUFFER_BIT']= 1024;
pgl.consts['GL_DEPTH_BUFFER_BIT']= 2048;
pgl.consts['GL_CW']= 182;
pgl.consts['GL_BACK']= 179;
pgl.consts['GL_BLEND']= 168;
pgl.consts['GL_CULL_FACE']= 164;
pgl.consts['GL_DEPTH_TEST']= 165;
pgl.consts['GL_TEXTURE0']= 156;
pgl.consts['GL_TEXTURE1']= 157;
pgl.consts['GL_TEXTURE_2D']= 93;
pgl.consts['GL_RGB']= 136;
pgl.consts['GL_UNSIGNED_BYTE']= 205;
pgl.consts['GL_TEXTURE_WRAP_S']= 121;
pgl.consts['GL_TEXTURE_WRAP_T']= 122;
pgl.consts['GL_MIRRORED_REPEAT']= 127;
pgl.consts['GL_ARRAY_BUFFER']= 6;
pgl.consts['GL_ELEMENT_ARRAY_BUFFER']= 9;
pgl.consts['GL_STATIC_DRAW']= 34;
pgl.consts['GL_FLOAT']= 212;
pgl.consts['GL_TRIANGLE_FAN']= 52;
pgl.consts['GL_TRIANGLE_STRIP']= 51;
pgl.consts['GL_TRIANGLES']= 50;
pgl.consts['GL_UNSIGNED_SHORT']= 208;

pgl.attribute_index={};
pgl.attribute_index["tex"]=0;
pgl.attribute_index["vertex"]=1;
pgl.attribute_index["normal"]=2;

/*
uniforms:
sizeof(shader_uniforms)=164
offsetof(shader_uniforms,view)=0
offsetof(shader_uniforms,world)=64
offsetof(shader_uniforms,blend)=128
offsetof(shader_uniforms,color)=144
offsetof(shader_uniforms,texture)=160
*/

pgl.uniforms={raw:new ArrayBuffer(164)};
pgl.uniforms.float32=new Float32Array(pgl.uniforms.raw);
pgl.uniforms.uint32=new Uint32Array(pgl.uniforms.raw);
pgl.uniforms.offsets={};
pgl.uniforms.offsets.view=0;
pgl.uniforms.offsets.world=64/4;
pgl.uniforms.offsets.blend=128/4;
pgl.uniforms.offsets.color=144/4;
pgl.uniforms.offsets.texture=160/4;

// compat code:
mygl={
  frontFace: function(mode){
    log("frontFace mode: "+mode);
    var m2=0;
    if(mode===this.CW){
      m2=pgl.consts.GL_CW;
    };
    pgl.glFrontFace(m2);
  },
  cullFace: function(mode){
    log("cullFace mode: "+mode);
    var m2=0;
    if(mode===this.BACK){
      m2=pgl.consts.GL_BACK;
    };
    pgl.glCullFace(m2);
  },
  enable: function(cap){
    log("enable cap: "+cap);
    var cap2=0;
    if(cap===this.BLEND){
      cap2=pgl.consts.GL_BLEND;
    };
    if(cap===this.CULL_FACE){
      cap2=pgl.consts.GL_CULL_FACE;
    };
    if(cap===this.DEPTH_TEST){
      cap2=pgl.consts.GL_DEPTH_TEST;
    };
    pgl.glEnable(cap2);
  },
  depthRange: function(zNear,zFar){
    log("depthRange zNear: "+zNear+" zFar: "+zFar);
    pgl.glDepthRange(new Float32Array([zNear,zFar]));
  },
  clearDepth: function(depth){
    log("clearDepth depth: "+depth);
    pgl.glClearDepth(new Float32Array([depth]));
  },
  createTexture: function(){
    log("createTexture");
    var tex=new Uint32Array(1);
    pgl.glGenTextures(1,tex);
    log("Created texture: "+tex[0]);
    // placeholder texture
    pgl.glBindTexture(pgl.consts.GL_TEXTURE_2D,tex[0]);
    pgl.glTexImage2D(pgl.consts.GL_TEXTURE_2D,0,2,2,2,0,pgl.consts.GL_RGB,pgl.consts.GL_UNSIGNED_BYTE,new Uint8Array(32));
    return tex[0];
  },
  activeTexture: function(texture){
    log("activeTexture texture: "+texture);
    var t2=0;
    if(texture===this.TEXTURE0){
      t2=pgl.consts.GL_TEXTURE0;
    };
    if(texture===this.TEXTURE1){
      t2=pgl.consts.GL_TEXTURE1;
    };
    pgl.glActiveTexture(t2);
  },
  bindTexture: function(target,texture){
    log("bindTexture target: "+target+" texture: "+texture);
    var t2=0;
    if(target===this.TEXTURE_2D){
      t2=pgl.consts.GL_TEXTURE_2D;
    };
    log("-bindTexture realtarget: "+t2+" texture: "+texture);
    pgl.glBindTexture(t2,texture);
  },
  texImage2D: function(){
    // someone on the WebGL committee thought it would be a good idea to have function overloading in the api
    // function overloading is not idiomatic JS so I will have to emulate it
    var a=arguments;
    if(a.length===9){
      var target=a[0];
      var level=a[1];
      var internalformat=a[2];
      var width=a[3];
      var height=a[4];
      var border=a[5];
      var format=a[6];
      var type=a[7];
      var pixels=a[8];
      log("texImage2D target: "+target+ " level: "+level+ " internalformat: "+internalformat+" width: "+width+" height: "+height+" border: "+border+" format: "+format+" type: "+type+" pixels: "+pixels);
      // TODO implementation of 9 argument form not needed
      return;
    };
    if(a.length===6){
      var target=a[0];
      var level=a[1];
      var internalformat=a[2];
      var format=a[3];
      var type=a[4];
      var pixels=a[5];
      log("texImage2D target: "+target+ " level: "+level+ " internalformat: "+internalformat+" format: "+format+" type: "+type+" pixels: "+pixels);
      var t2=0;
      if(target===this.TEXTURE_2D){
        t2=pgl.consts.GL_TEXTURE_2D;
      };
      var i2=0;
      if(internalformat===this.RGB){
        i2=pgl.consts.GL_RGB;
      };
      var f2=0;
      if(format===this.RGB){
        f2=pgl.consts.GL_RGB;
      };
      var ty2=0;
      if(type===this.UNSIGNED_BYTE){
        ty2=pgl.consts.GL_UNSIGNED_BYTE;
      };
      pgl.glTexImage2D(t2,level,i2,pixels.width,pixels.height,0,f2,ty2,pixels.data);
      return;
    };
    throw "error texImage2D variant not supported";
  },
  texParameterf: function(target, pname, param){
    // TODO no implementation needed
    log("texParameterf target: "+target+ " pname: "+pname+ " param: "+param);
  },
  createFramebuffer: function(){
    // TODO no implementation
    log("createFramebuffer");
    return {"type":"WebGLFramebuffer"};
  },
  bindFramebuffer: function(target, framebuffer){
    // TODO no implementation needed
    log("bindFramebuffer target: "+target+" framebuffer: "+framebuffer);

  },
  framebufferTexture2D: function(){
    // TODO no implementation needed
    log("framebufferTexture2D");
  },
  createRenderbuffer: function(){
    log("createRenderbuffer");
  },
  bindRenderbuffer: function(){
    // TODO no implementation needed
    log("bindRenderbuffer");
  },
  renderbufferStorage: function(){
    // TODO no implementation needed
    log("renderbufferStorage");
  },
  framebufferRenderbuffer: function(){
    // TODO no implementation needed
    log("framebufferRenderbuffer");
  },
  createProgram: function(){
    log("createProgram");
    return {"type":" WebGLProgram","program":pgl.create_program()};
  },
  createShader: function(type){
    log("createShader type: "+type);
    return {"type":"WebGLShader"};
  },
  shaderSource: function(shader,source){
    log("shaderSource shader: "+shader+" source: "+source);
    shader.source=source;
  },
  compileShader: function(shader){
    log("compileShader shader: "+ shader);
  },
  getShaderParameter: function(shader, pname){
    log("getShaderParameter shader: "+shader+" pname: "+pname);
    return true;
  },
  getShaderInfoLog: function(shader){
    log("getShaderInfoLog shader: "+shader);
  },
  attachShader: function(program, shader){
    log("attachShader program: "+program+" shader:"+ shader);
  },
  linkProgram: function(program){
    log("linkProgram program: "+program);
    log("-linkProgram program number: "+program.program);
  },
  getProgramParameter: function(program,pname){
    if(pname===this.LINK_STATUS){
      return true;
    };
    return false;
  },
  getProgramInfoLog: function(program){
    log("getProgramInfoLog program: "+program);
  },
  getAttribLocation: function(program,name){
    log("getAttribLocation program: "+program+" name: "+name);
    return name;
  },
  getUniformLocation: function(program,name){
    log("getUniformLocation program: "+program+" name: "+name);
    return name;
  },
  createBuffer: function(){
    log("createBuffer");
    var buf=new Uint32Array(1);
    pgl.glGenBuffers(1,buf);
    log("Created buffer: "+buf[0]);
    return {"type":"WebGLBuffer",buffer:buf};
  },
  current_buffer: 0,
  buffer_data:[],
  current_element_buffer: 0,
  buffer_element_data:{},
  alt_buffer_data:[],
  alt_buffer_map:[],
  bindBuffer: function(target, buffer){
    log("bindBuffer target: "+target+" buffer: "+buffer)
    var buf=buffer.buffer[0];
    var t2=0;
    if(target===this.ARRAY_BUFFER){
      t2=pgl.consts.GL_ARRAY_BUFFER;
      this.current_buffer=buf;
    };
    if(target===this.ELEMENT_ARRAY_BUFFER){
      t2=pgl.consts.GL_ELEMENT_ARRAY_BUFFER;
      this.current_element_buffer=buf;
    };
    log("-bindBuffer realbuffer: "+buf);
    pgl.glBindBuffer(t2,buf);
  },
  bufferData: function(target, srcData, usage){
    // annoying the WebGL api uses overloaded functions
    // just handle the case used by penguins puzzle
    log("bufferData target: "+target+" srcData: "+srcData+" usage: "+usage);
    var t2=0;
    if(target===this.ARRAY_BUFFER){
      t2=pgl.consts.GL_ARRAY_BUFFER;
      this.buffer_data[this.current_buffer]=srcData;
    };
    if(target===this.ELEMENT_ARRAY_BUFFER){
      t2=pgl.consts.GL_ELEMENT_ARRAY_BUFFER;
      this.buffer_element_data[this.current_element_buffer]=srcData;
    };
    var u2=0;
    if(usage===this.STATIC_DRAW){
      u2=pgl.consts.GL_STATIC_DRAW;
    };
    log("-bufferData length: "+srcData.length+" lengthbytes: "+(srcData.length*srcData.BYTES_PER_ELEMENT))
    pgl.glBufferData(t2,srcData.length*srcData.BYTES_PER_ELEMENT,srcData,u2);
  },
  clearColor: function(red, green, blue, alpha){
    log("clearColor red: "+red+" green: "+green+" blue: "+blue+" alpha: "+alpha)
    pgl.glClearColor(new Float32Array([red, green, blue, alpha]));
  },
  viewport: function(x, y, width, height){
    log("viewport x: "+x+" y: "+y+" width: "+width+" height: "+height);
  },
  clear: function(mask){
    log("clear mask: "+mask);
    var m2=0;
    if(mask&this.COLOR_BUFFER_BIT){
      m2|=pgl.consts.GL_COLOR_BUFFER_BIT;
    };
    if(mask&this.DEPTH_BUFFER_BIT){
      m2|=pgl.consts.GL_DEPTH_BUFFER_BIT;
    };
    log("m2 "+m2);
    pgl.glClear(m2);
  },
  colorMask: function(red, green, blue, alpha) {
    log("colorMask  red: "+red+" green: "+green+" blue: "+blue+" alpha: "+alpha);
  },
  useProgram: function(program){
    log("useProgram program: "+program);
    log("-useProgram program number: "+program.program);
    pgl.glUseProgram(program.program);
  },
  uniform1i: function(location, v0){
    log("uniform1i location: "+location+" v0: "+v0);
    var o=pgl.uniforms.offsets[location];
    if(o!==undefined){
      pgl.uniforms.uint32[o]=v0;
    };
    pgl.pglSetUniform(pgl.uniforms.raw);
  },
  uniform4f: function(location, v0, v1, v2, v3){
    log("uniform4f location: "+location+" v0: "+v0+" v1: "+v1+" v2: "+v2+" v3: "+v3);
    var o=pgl.uniforms.offsets[location];
    if(o!==undefined){
      pgl.uniforms.float32[o]=v0;
      pgl.uniforms.float32[o]=v1;
      pgl.uniforms.float32[o]=v2;
      pgl.uniforms.float32[o]=v3;
    };
    pgl.pglSetUniform(pgl.uniforms.raw);
  },
  uniformMatrix4fv: function(location, transpose, value){
    // looks like there's a bug in penguins puzzle. They set gl.FALSE which doesn't exist.
    // should be false
    log("uniformMatrix4fv location: "+location+" transpose: "+transpose+" value: "+value);
    var o=pgl.uniforms.offsets[location];
    if(o!==undefined){
      for(var i=0;i<value.length;i++){
        pgl.uniforms.float32[i+o]=value[i];
      };
    };
    pgl.pglSetUniform(pgl.uniforms.raw);
  },
  vertexAttribPointer: function(index, size, type, normalized, stride, offset){
    log("vertexAttribPointer index: "+index+" size: "+size+" type: "+type+" normalized: "+normalized+" stride: "+stride+" offset: "+offset);
    var i=pgl.attribute_index[index];
    var t2=0;
    if(type===this.FLOAT){
      t2=pgl.consts.GL_FLOAT;
    };
    pgl.glVertexAttribPointer(i,size,t2,normalized,stride,offset);
  },
  enableVertexAttribArray: function(index){
    log("enableVertexAttribArray index:"+index);
    var i=pgl.attribute_index[index];
    pgl.glEnableVertexAttribArray(i);
  },
  drawArrays: function(mode, first, count){
    log("drawArrays mode: "+mode+" first: "+first+" count: "+count);
    var m2=0;
    if(mode===this.TRIANGLE_FAN){
      m2=pgl.consts.GL_TRIANGLE_FAN;
    };
    if(mode===this.TRIANGLE_STRIP){
      m2=pgl.consts.GL_TRIANGLE_STRIP;
    };
    if(mode===this.TRIANGLES){
      m2=pgl.consts.GL_TRIANGLES;
    };
    pgl.glDrawArrays(m2,first,count);
  },
  disable: function(capability){
    log("disable capability: "+capability);
  },
  depthMask: function(flag){
    log("depthMask: "+flag);
    var f=0;
    if(flag===true){
      f=1;
    };
    pgl.glDepthMask(f);
  },
  finish: function(){
    log("finish");
    pgl.update();
  },
  drawElements: function(mode, count, type, offset){
    log("drawElements mode: "+mode+" count: "+count+" type: "+type+" offset: "+offset);
    var m2=0;
    if(mode===this.TRIANGLES){
      m2=pgl.consts.GL_TRIANGLES;
    };
    var t2=0;
    if(type===this.UNSIGNED_SHORT){
      t2=pgl.consts.GL_UNSIGNED_SHORT;
    };
// drawElements seems to be broken in portablegl so we use drawArrays instead
//    pgl.glDrawElements(m2,count, t2, offset);

    // this is a horrible hack that figures out the count of
    // triangles in the buffer by assuming the stride is 36
    // (4*9) bytes
    var c2=this.buffer_data[this.current_buffer].length/9;
    log("buffer length"+c2);
    this.drawArrays(mode,offset,c2);
  },
  texParameteri: function(target, pname, param){
    log("texParameteri target: "+target+" pname: "+pname+" param: "+param);
    var t2=0;
    if(target===this.TEXTURE_2D){
      t2=pgl.consts.GL_TEXTURE_2D;
    };
    var pn2=0;
    if(pname===this.TEXTURE_WRAP_S){
      pn2=pgl.consts.GL_TEXTURE_WRAP_S;
    };
    if(pname===this.TEXTURE_WRAP_T){
      pn2=pgl.consts.GL_TEXTURE_WRAP_T;
    };
    var pa2=0;
    if(param===this.MIRRORED_REPEAT){
      pa2=pgl.consts.GL_MIRRORED_REPEAT;
    };
    pgl.glTexParameteri(t2,pn2,pa2);
  },
  generateMipmap: function(target){
    // TODO portablegl does not support this
    log("generateMipmap target:"+target);
  },
  LINK_STATUS: 35714,
  CW: 2304,
  CCW: 2305,
  FRONT: 1028,
  BACK: 1029,
  FRONT_AND_BACK: 1032,
  BLEND: 3042,
  CULL_FACE: 2884,
  DEPTH_TEST: 2929,
  TEXTURE0: 33984,
  TEXTURE1: 33985,
  TEXTURE_2D: 3553,
  RGB: 6407,
  UNSIGNED_BYTE: 5121,
  TEXTURE_MIN_FILTER: 10241,
  TEXTURE_MAG_FILTER: 10240,
  LINEAR: 9729,
  FRAMEBUFFER: 36160,
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  COMPILE_STATUS: 35713,
  ARRAY_BUFFER: 34962,
  ELEMENT_ARRAY_BUFFER: 34963,
  STATIC_DRAW : 35044,
  COLOR_BUFFER_BIT: 16384,
  DEPTH_BUFFER_BIT: 256,
  FLOAT: 5126,
  TRIANGLE_FAN: 6,
  TRIANGLE_STRIP: 5,
  TRIANGLES: 4,
  UNSIGNED_SHORT: 5123,
  TEXTURE_WRAP_S: 10242,
  TEXTURE_WRAP_T: 10243,
  MIRRORED_REPEAT: 33648,
};

window={};
window.innerWidth=320;
window.innerHeight=240;

window.location={};
location=window.location;

window.events=[];

window.requestAnimFrame=function(callback){
  log("requestAnimFrame: "+callback);
  process_events();
  window.events.push(callback);
};
requestAnimFrame=window.requestAnimFrame;

document={};

document.getElementById=function(n){
  if(n==="mycanvas"){
    demo.get_fn("setup_context")();
    demo.get_fn("sdl_setup_context")();

    return {
      getContext: function(x){
        print("getContext called: "+x);
        return mygl; 
      },
      style: {},
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };
  if(n.match("shader-fs")){
    log("shader-fs: "+n);
    return {"type": "x-shader/x-fragment","firstChild":{"nodeType":1,"nextSibling":{"nodeType":3,"textContent":n}}};
  };
  if(n.match("shader-vs")){
    log("shader-vs: "+n);
    return {"type": "x-shader/x-vertex","firstChild":{"nodeType":1,"nextSibling":{"nodeType":3,"textContent":n}}};
  };
  print("unsupported element name assuming it's a sound: "+n);
  return {"play":function(){}};
};
function alert(x){
print("ALERT: "+x);
throw "ERROR alert"
};

load(test_path+"/penguin/bmpdecoder.js");
function decode_bmp(x){
    x.width=128;
    x.height=128;
    x.data=new Uint8Array(x.width*x.height*4);
    for(i=0;i<128;i++){
      for(j=0;j<128;j++){
        var o=4*(128*i+j);
        x.data[o]=0;
        x.data[o+1]=(i+j);
        x.data[o+2]=0;
        x.data[o+3]=255;
      }
    }
    var d={data:x.rawdata,
           i32:new Int32Array(1),
           i16:new Int16Array(1),
           i8:new Int8Array(1),
           u32:new Uint32Array(1),
           u16:new Uint16Array(1),
           u8:new Uint8Array(1),
           toString:function(){return "BM"},
           readUInt32LE:function(p){
             var o=this.data;
             this.u32[0]=o[p]|o[p+1]<<8|o[p+2]<<16|o[p+3]<<24;
             return this.u32[0];
           },
           readInt32LE:function(p){
             var o=this.data;
             this.i32[0]=o[p]|o[p+1]<<8|o[p+2]<<16|o[p+3]<<24;
             return this.i32[0];
           },
           readUInt16LE:function(p){
             var o=this.data;
             this.u16[0]= o[p]|o[p+1]<<8;
             return this.u16[0];
           },
           readInt16LE:function(p){
             var o=this.data;
             this.i16[0]= o[p]|o[p+1]<<8;
             return this.i16[0];
           },
           readUInt8:function(p){
             var o=this.data;
             this.u8[0]= o[p];
             return this.u8[0];
           },
           readInt8:function(p){
             var o=this.data;
             this.i8[0]= o[p];
             return this.i8[0];
           },
          };
    var dec=new BmpDecoder(d,false);
/*
    print(dec.data.length);
    print(dec.width);
    print(dec.height);
    for(var i=0;i<dec.width*dec.height*4;i=i+4){
      var t=x.data[i];
      x.data[i]=x.data[i+2];
      x.data[i]=t;
    };
*/
    x.width=dec.width;
    x.height=dec.height;
    x.data=dec.data;
};

function Image(){
  Object.defineProperty(this, 'src', { set(x) {
    log("Image src: "+x);
    var extn=x.split(".")[1];
    if(extn==="jpg"){
      print(x+" is a JPEG, not loading");
      return;
    };
    this.rawdata=read(test_path+"/penguin/"+x,"binary");
    decode_bmp(this);
    var that=this;
    window.events.push(function(){
      log("Image onload callback for "+x);
      that.onload();
    });
  } });
};

function XMLHttpRequest(){

};

XMLHttpRequest.prototype.open=function(method, url){
  log("XMLHttpRequest.open: method "+method+" url "+url);
  this.method=method;
  this.url=url;
};

XMLHttpRequest.prototype.send=function(){
  log("XMLHttpRequest.send: method "+this.method+" url "+this.url);
  this.readyState=4;
  this.responseText=read(test_path+"/penguin/"+this.url);
  this.onreadystatechange();
};
log("show_consts");
demo.get_fn("show_consts")();
log("");
log("get_shader_unform_metadata");
demo.get_fn("get_shader_unform_metadata")();
log("");
log("get_shader_attributes_metadata");
demo.get_fn("get_shader_attributes_metadata")();
log("");
// load demo
load(test_path+"/penguin/penguin.js");

Buffer_old=Buffer;

Buffer=function(pts,tex,faces){
                log("Buffer wrapper");
                for(var i=0;i<tex.length;i++)
                {
                        if (tex[i].length<3)
                                tex[i].push(1.0); // Add full lighting
                }
                var normals=new Array(tex.length);
                for(var i=0;i<pts.length;i++)
                {
                        normals[i]=[0,0,1];
                }
                for(var i=0;i<faces.length;i++)
                {
                        var a = faces[i][0];
                        var b = faces[i][1];
                        var c = faces[i][2];
                        var n = vec_normal(vec_cross(vec_sub(pts[b],pts[a]),vec_sub(pts[c],pts[a])));
                        normals[a]=n;
                        normals[b]=n;
                        normals[c]=n;
                }
                var B = []
                for(var i=0;i<pts.length;i++)
                {
                        extend(B,pts[i]);
                        extend(B,tex[i]);
                        extend(B,normals[i]);
                }
                var E = []
                for(var i=0;i<faces.length;i++)
                {
                        for(var j=0;j<3;j++)
                                E.push(faces[i][j]);
                }
                this.ntris=faces.length;
                this.vbuf = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(B), gl.STATIC_DRAW);
                this.vbuf.numItems = pts.length;

                this.ebuf = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebuf);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(E), gl.STATIC_DRAW);
                this.ebuf.numItems = E.length;

                if(faces.length){
                  log("faces.length "+faces.length);
                  var out=new Float32Array(9*E.length);
                  for(var i=0;i<E.length;i++){
                    for(var j=0;j<9;j++){
                      out[(9*i)+j]=B[(9*E[i])+j];
                    }
                  }
                  this.vbuf = gl.createBuffer();
                  gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf);
                  gl.bufferData(gl.ARRAY_BUFFER, out, gl.STATIC_DRAW);
                  this.vbuf.numItems = pts.length;
                };
};

for(i in Buffer_old.prototype){
  Buffer.prototype[i]=Buffer_old.prototype[i];
};

// event handling code

event_metadata = new Uint8Array(10000);
libc.memcpy2(event_metadata,demo.get_fn("get_event_info")(),event_metadata.length);
var out=[];
var i=0;
while(event_metadata[i]!==0){
out.push(String.fromCharCode(event_metadata[i]));
i++;
};
out=JSON.parse(out.join(""));
print(JSON.stringify(out));
event_types=out.event_types;
keycodes=out.keycodes;
evt=new Uint8Array(out.SDL_Event);
evt_m=libc.malloc(evt.length);
k_off=out.SDL_KeyboardEvent.keysym+out.SDL_keysym.sym;
print(k_off);

function get_u32(e,o){
  return e[o]|(e[o+1]<<8)|(e[o+2]<<16)|(e[o+3]<<24);
};

keyCode={
  "left": 37,
  "up": 38,
  "right": 39,
  "down": 40,
  " ": 32,
  "r":82
};

function process_events(){
  while(demo.get_fn("SDL_PollEvent")(evt_m)){
    libc.memcpy2(evt,evt_m,evt.length);
    var et=event_types[evt[0]];
//    print(et);
    if(et==="SDL_QUIT"){
      demo.get_fn("SDL_Quit")();
      quit();
    };
    if(et==="SDL_KEYDOWN"){
      var k=keycodes[get_u32(evt,k_off)];
      document.onkeydown({keyCode:keyCode[k]});
      print("keydown : "+k);
    }
    if(et==="SDL_KEYUP"){
      var k=keycodes[get_u32(evt,k_off)];
      document.onkeyup({keyCode:keyCode[k]});
      print("keyup : "+k);
    }
  };
};


//run demo
window.events.push(webGLStart);
window.next=0;
while(window.events[window.next]){
  window.fn=window.events[window.next];
  delete window.events[window.next];
  window.next++;
  window.fn();
//  if(window.next>6){break};
}

//demo.get_fn("sdl_setup_context")();

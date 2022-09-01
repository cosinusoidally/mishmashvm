print("penguin puzzle");
print("WIP not working yet");
name="penguin";

load(test_path+"/main.js");

debug=true;

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
};
pgl.consts={};
pgl.consts['GL_COLOR_BUFFER_BIT']= 1024;
pgl.consts['GL_DEPTH_BUFFER_BIT']= 2048;
pgl.consts['GL_CW']= 182;
pgl.consts['GL_BACK']= 179;
pgl.consts['GL_BLEND']= 168;
pgl.consts['GL_CULL_FACE']= 164;
pgl.consts['GL_DEPTH_TEST']= 165;


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
    return {"type":"WebGLTexture"}
  },
  activeTexture: function(texture){
    log("activeTexture texture: "+texture);
  },
  bindTexture: function(target,texture){
    log("bindTexture target: "+target+" texture: "+texture);
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
      return;
    };
    throw "error texImage2D variant not supported";
  },
  texParameterf: function(target, pname, param){

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
    return {"type":" WebGLProgram"};
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
  },
  getUniformLocation: function(program,name){
    log("getUniformLocation program: "+program+" name: "+name);
  },
  createBuffer: function(){
    log("createBuffer");
    return {"type":"WebGLBuffer"};
  },
  bindBuffer: function(target, buffer){
    log("bindBuffer target: "+target+" buffer: "+buffer)
  },
  bufferData: function(target, srcData, usage){
    // annoying the WebGL api uses overloaded functions
    // just handle the case used by penguins puzzle
    log("bufferData target: "+target+" srcData: "+srcData+" usage: "+usage)
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
  },
  uniform1i: function(location, v0){
    log("uniform1i location: "+location+" v0: "+v0);
  },
  uniform4f: function(location, v0, v1, v2, v3){
    log("uniform4f location: "+location+" v0: "+v0+" v1: "+v1+" v2: "+v2+" v3: "+v3);
  },
  uniformMatrix4fv: function(location, transpose, value){
    // looks like there's a bug in penguins puzzle. They set gl.FALSE which doesn't exist.
    // should be false
    log("uniformMatrix4fv location: "+location+" transpose: "+transpose+" value: "+value);
  },
  vertexAttribPointer: function(index, size, type, normalized, stride, offset){
    log("vertexAttribPointer index: "+index+" size: "+size+" type: "+type+" normalized: "+normalized+" stride: "+stride+" offset: "+offset);
  },
  enableVertexAttribArray: function(index){
    log("enableVertexAttribArray index:"+index);
  },
  drawArrays: function(mode, first, count){
    log("drawArrays mode: "+mode+" first: "+first+" count: "+count);
  },
  disable: function(capability){
    log("disable capability: "+capability);
  },
  depthMask: function(flag){
    log("depthMask: "+flag);
  },
  finish: function(){
    log("finish");
    pgl.update();
  },
  drawElements: function(mode, count, type, offset){
    log("drawElements mode: "+mode+" count: "+count+" type: "+type+" offset: "+offset);
  },
  texParameteri: function(target, pname, param){
    log("texParameteri target: "+target+" pname: "+pname+" param: "+param);
  },
  generateMipmap: function(target){
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
window.innerWidth=640;
window.innerHeight=480;

window.location={};
location=window.location;

window.events=[];

window.requestAnimFrame=function(callback){
  log("requestAnimFrame: "+callback);
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
    return {"type": "x-shader/x-fragment","firstChild":{"nodeType":1,"nextSibling":{"nodeType":3,"textContent":"// "+n}}};
  };
  if(n.match("shader-vs")){
    log("shader-vs: "+n);
    return {"type": "x-shader/x-vertex","firstChild":{"nodeType":1,"nextSibling":{"nodeType":3,"textContent":"// "+n}}};
  };
  throw "unsupported element name: "+n;
};
function alert(x){
print("ALERT: "+x);
throw "ERROR alert"
};

function Image(){
  Object.defineProperty(this, 'src', { set(x) {
    log("Image src: "+x);
    this.data=read(test_path+"/penguin/"+x,"binary");
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

demo.get_fn("show_consts")();

// load demo
load(test_path+"/penguin/penguin.js");

//run demo
window.events.push(webGLStart);
window.next=0;
while(window.events[window.next]){
  window.fn=window.events[window.next];
  delete window.events[window.next];
  window.next++;
  window.fn();
  if(window.next>6){break};
}

//demo.get_fn("sdl_setup_context")();

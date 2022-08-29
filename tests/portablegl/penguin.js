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

// compat code:
mygl={
  frontFace: function(mode){
    log("frontFace mode: "+mode);
  },
  cullFace: function(mode){
    log("cullFace mode: "+mode);
  },
  enable: function(cap){
    log("enable cap: "+cap);
  },
  depthRange: function(zNear,zFar){
    log("depthRange zNear: "+zNear+" zFar: "+zFar);
  },
  clearDepth: function(depth){
    log("depth depth: "+depth);
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
  texImage2D: function(target, level, internalformat, width, height, border, format, type, pixels){
    log("texImage2D target: "+target+ " level: "+level+ " internalformat: "+internalformat+" width: "+width+" height: "+height+" border: "+border+" format: "+format+" type: "+type+" pixels: "+pixels);

  },
  texParameterf: function(target, pname, param){

    log("texParameterf target: "+target+ " pname: "+pname+ " param: "+param);
  },
  createFramebuffer: function(){
    log("createFramebuffer");
    return {"type":"WebGLFramebuffer"};
  },
  bindFramebuffer: function(target, framebuffer){
    log("bindFramebuffer target: "+target+" framebuffer: "+framebuffer);

  },
  framebufferTexture2D: function(){},
  createRenderbuffer: function(){},
  bindRenderbuffer: function(){},
  renderbufferStorage: function(){},
  framebufferRenderbuffer: function(){},
  createProgram: function(){
    return {};
  },
  attachShader: function(){},
  linkProgram: function(){},
  getProgramParameter: function(program,pname){
    if(pname===this.LINK_STATUS){
      return true;
    };
    return false;
  },
  getProgramInfoLog: function(){},
  getAttribLocation: function(){},
  getUniformLocation: function(){},
  createBuffer: function(){return {};},
  bindBuffer: function(){},
  bufferData: function(){},
  clearColor: function(){},
  viewport: function(){},
  clear: function(){},
  colorMask: function(){},
  useProgram: function(){},
  uniform1i: function(){},
  uniform4f: function(){},
  uniformMatrix4fv: function(){},
  vertexAttribPointer: function(){},
  enableVertexAttribArray: function(){},
  drawArrays: function(){},
  disable: function(){},
  depthMask: function(){},
  finish: function(){},
  drawElements: function(){},
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
};

window={};

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
    return {
      getContext: function(x){
        print("getContext called: "+x);
        return mygl; 
      },
      style: {}
    };
  };
  if(n.match("shader-fs")){
    log("shader-fs: "+n);
    return {};
  };
  if(n.match("shader-vs")){
    log("shader-vs: "+n);
    return {};
  };
  throw "unsupported element name: "+n;
};
function alert(x){
print("ALERT: "+x);
};

function Image(){

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
  if(window.next>1){break};
}

//demo.get_fn("sdl_setup_context")();

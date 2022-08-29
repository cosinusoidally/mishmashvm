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
  depthRange: function(){},
  clearDepth: function(){},
  createTexture: function(){},
  activeTexture: function(){},
  bindTexture: function(){},
  texImage2D: function(){},
  texParameterf: function(){},
  createFramebuffer: function(){},
  bindFramebuffer: function(){},
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
};

window={};

window.location={};
location=window.location;

window.requestAnimFrame=function(callback){
  log("requestAnimFrame: "+callback);

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
webGLStart();

//demo.get_fn("sdl_setup_context")();

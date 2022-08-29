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
  frontFace: function(){},
  cullFace: function(){},
  enable: function(){},
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
  createProgram: function(){},
  attachShader: function(){},
  linkProgram: function(){},
  getProgramParameter: function(){},
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
};

window={};

window.location={};
location=window.location;

window.requestAnimFrame=function(){};
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

XMLHttpRequest.prototype.open=function(){

};

XMLHttpRequest.prototype.send=function(){

};

// load demo
load(test_path+"/penguin/penguin.js");

//run demo
webGLStart();

//demo.get_fn("sdl_setup_context")();

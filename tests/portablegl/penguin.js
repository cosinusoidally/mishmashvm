print("penguin puzzle");
print("WIP not working yet");
name="penguin";

load(test_path+"/main.js");

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
};

window={};
document={};

document.getElementById=function(n){
  if(n==="mycanvas"){
    return {
      getContext: function(x){
        print("getContext called: "+x);
        return mygl; 
      }
    };
  };
  throw "unsupported element name";
};
function alert(x){
print("ALERT: "+x);
};
// load demo
load(test_path+"/penguin/penguin.js");

//run demo
webGLStart();

//demo.get_fn("sdl_setup_context")();

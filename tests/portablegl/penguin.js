print("penguin puzzle");
print("WIP not working yet");
name="penguin";

load(test_path+"/main.js");

// compat code:
window={};
document={};
document.getElementById=function(n){
  if(n==="mycanvas"){
    return {};
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

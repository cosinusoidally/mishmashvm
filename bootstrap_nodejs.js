console.log("Bootstrapping using node.js. Requires node.js >= 12.x");

process=require("process");
child_process=require("child_process");
os=require("os");
console.log(process.execPath);

run=function(x){
  console.log("Running: "+x);
  var r=child_process.spawnSync(process.execPath,["node_compat_min.js",x]);
  console.log("stdout:");
  console.log(r.output[1].toString());
  console.log("stderr:");
  console.log(r.output[2].toString());
};

process.chdir("tcc_js_bootstrap");

run("04_mk_nodejs_addon.js");
run("05_mk_nodejs_addon_win32.js");

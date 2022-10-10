console.log("Bootstrapping using node.js. Requires node.js >= 12.x");

process=require("process");
child_process=require("child_process");
os=require("os");
fs=require("fs");

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

run("01_mk_tcc.js");
run("02_mk_libc_wrap.js");
run("03_mk_libc_stubs.js");
run("04_mk_nodejs_addon.js");
run("05_mk_nodejs_addon_win32.js");

process.chdir("../libc_portable_proto");

console.log("2nd stage bootstrap");

console.log("Building libtcc1.o");
run("01.js");

console.log("Starting 3 stage native bootstrap");

console.log("Building tcc (stage 1)");
run("02.js");

console.log("Building libtcc1.o (stage 1)");
run("03.js");

fs.writeFileSync("tcc_bin/libtcc1.o",fs.readFileSync("tcc_bin/libtcc1.o.new"));
fs.writeFileSync("tcc_bin/tcc_boot3.o",fs.readFileSync("tcc_bin/tcc_boot3.o.new"));

console.log("Building tcc (stage 2)");
run("02.js");

console.log("Building libtcc1.o (stage 2)");
run("03.js");

fs.writeFileSync("tcc_bin/libtcc1.o",fs.readFileSync("tcc_bin/libtcc1.o.new"));
fs.writeFileSync("tcc_bin/tcc_boot3.o",fs.readFileSync("tcc_bin/tcc_boot3.o.new"));

console.log("Building tcc (stage 3)");
run("02.js");

console.log("Building libtcc1.o (stage 3)");
run("03.js");

run("04_check_sha256.js");

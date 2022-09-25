a=require("./lib/addon.node");

a.RunCallback(function(msg) {
  eval(msg);
});

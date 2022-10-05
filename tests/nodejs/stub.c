// this was originally based off https://github.com/nodejs/node/blob/v8.17.0/test/addons-napi/3_callbacks/binding.c (same license as node.js)

// This __attribute__((constructor)) delcaration must be above
// the includes otherwise tcc seems to strip it
static void _register_NODE_GYP_MODULE_NAME(void) __attribute__((constructor));

#include "common.h"
#include "binding.h"
#include <string.h>

napi_value Init(napi_env env, napi_value exports) {
  napi_property_descriptor desc[2] = {
    DECLARE_NAPI_PROPERTY("RunCallback", RunCallback),
  };
  NAPI_CALL(env, napi_define_properties(env, exports, 1, desc));
  return exports;
}

// tcc preprocessor seems to have issue with this:
//NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

// expanded form of the above:
static napi_module _module = { 1, 0, "stub.c", Init, "NODE_GYP_MODULE_NAME", ((void *)0) , {0}, };
// note function declaration is at the top of the file
// as the tcc preprocessor seems to remove __attribute__((constructor))
// if the declaration is placed here
static void _register_NODE_GYP_MODULE_NAME(void) { napi_module_register(&_module); }

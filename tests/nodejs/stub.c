// this was originally based off https://github.com/nodejs/node/blob/v8.17.0/test/addons-napi/3_callbacks/binding.c (same license as node.js)

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

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

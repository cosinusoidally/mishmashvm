// this file is used by 04_mk_nodejs_addon.js when bootstrapping the nodejs addon under nodejs
#include "common.h"
#include "binding.h"
#include <string.h>
#include "binding_linux.c"

napi_value napi_register_module_v1(napi_env env, napi_value exports) {
  napi_property_descriptor desc[2] = {
    DECLARE_NAPI_PROPERTY("RunCallback", RunCallback),
  };
  NAPI_CALL(env, napi_define_properties(env, exports, 1, desc));
  return exports;
}

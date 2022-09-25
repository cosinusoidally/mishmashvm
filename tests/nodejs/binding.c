// this was originally based off https://github.com/nodejs/node/blob/v8.17.0/test/addons-napi/3_callbacks/binding.c (same license as node.js)

#include "common.h"
#include "binding.h"
#include <string.h>

#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>
#include <stdint.h>

#define LIN

void* L[8];
uint32_t H=0;

int ctypes_open(char *s){
  printf("Opening lib: %s\n",s);
#ifdef LIN
  void *p=dlopen(s,RTLD_LAZY);
#else
  void *p=LoadLibrary(s);
#endif
  printf("p=%u\n",p);
  if(p!=NULL){
    L[H]=p;
    H++;
    return H;
  };
  return 0;
}

int ctypes_getsym(uint32_t h,char *s){
  uint32_t p;
  printf("C Looking up: %s in %u\n",s,h);
  p=(uint32_t)dlsym(L[h-1],s);
  return p;
}

typedef uint32_t (* my_ffi_stub)(uint32_t a1,uint32_t a2,uint32_t a3,uint32_t a4,uint32_t a5,uint32_t a6,uint32_t a7,uint32_t a8);

napi_value my_ffi_call(napi_env env, napi_callback_info info){
  printf("my_ffi_call called\n");
  size_t argc = 8;
  napi_value args[8];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

//  NAPI_ASSERT(env, argc >= 2, "Wrong number of arguments");

  uint32_t args_n[8];
  napi_valuetype valuetype0;
  int i;
  for(i=1;i<argc;i++){
    NAPI_CALL(env, napi_typeof(env, args[i], &valuetype0));
    if(valuetype0==napi_number){
      uint32_t n;
      napi_get_value_int32(env,args[i],&n);
      printf("Number: %u\n",n);
      args_n[i-i]=n;
    }
    if(valuetype0==napi_object){
      printf("napi_object\n");
      void * data;
      uint32_t byte_length;
      napi_typedarray_type type;
      napi_value input_buffer;
      size_t byte_offset = 0;
      size_t length = 0;
      bool is_typedarray = false;
      napi_is_typedarray(env, args[i], &is_typedarray);
      if(is_typedarray){
        NAPI_CALL(env, napi_get_typedarray_info(env,args[i], &type, &length,
        NULL, &input_buffer, &byte_offset));
        NAPI_CALL(env, napi_get_arraybuffer_info(env,
        input_buffer, &data, &byte_length));
      } else {
        NAPI_CALL(env, napi_get_arraybuffer_info(env,
        args[i], &data, &byte_length));
      }
      printf("Pointer %u\n",data);
      args_n[i-i]=data;
    }
    if(valuetype0==napi_external){
      printf("napi_external not supported\n");
    }
    if(valuetype0==napi_string){
      printf("napi_string not supported\n");
      return 0;
    }
  }
  for (;i < 8; i++) {
    args_n[i-1]=0;
  }
  uint32_t ptr;
  napi_get_value_int32(env,args[0],&ptr);

  printf("args_n: %u %u %u %u %u %u %u %u\n",args_n[0],args_n[1],args_n[2],args_n[3],args_n[4],args_n[5],args_n[6],args_n[7]);
  __asm__("and $0xfffffff0,%esp");
  double ret=(double)(((my_ffi_stub)ptr)(args_n[0],args_n[1],args_n[2],args_n[3],args_n[4],args_n[5],args_n[6],args_n[7]));

  return 0;
}

napi_value RunCallback(napi_env env, napi_callback_info info) {

  char buf[128];
  int o=0;
  o+=sprintf(buf+o, "print(ctypes_open_ptr=%u);\n",&ctypes_open);
  o+=sprintf(buf+o, "print(ctypes_getsym_ptr=%u);\n",&ctypes_getsym);
  o+=sprintf(buf+o, "print(fn_ptr2=%u);\n",&puts);

  size_t argc = 2;
  napi_value args[2];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  NAPI_ASSERT(env, argc == 1,
      "Wrong number of arguments. Expects a single argument.");

  napi_valuetype valuetype0;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));
  NAPI_ASSERT(env, valuetype0 == napi_function,
      "Wrong type of arguments. Expects a function as first argument.");

  napi_valuetype valuetype1;
  NAPI_CALL(env, napi_typeof(env, args[1], &valuetype1));
  NAPI_ASSERT(env, valuetype1 == napi_undefined,
      "Additional arguments should be undefined.");

  napi_value argv[1];
  char* str = buf;
  size_t str_len = strlen(str);
  NAPI_CALL(env, napi_create_string_utf8(env, str, str_len, argv));

  napi_value global;
  NAPI_CALL(env, napi_get_global(env, &global));

  napi_value cb = args[0];
  NAPI_CALL(env, napi_call_function(env, global, cb, 1, argv, NULL));

  napi_value fn;
  NAPI_CALL(env,
    napi_create_function(env, "my_ffi_call", -1, my_ffi_call, NULL, &fn));
  napi_set_named_property(env,global,"my_ffi_call",fn);

  return NULL;
}

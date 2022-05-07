/*
 *  Very simple example program
 */

#include "duktape.h"

static duk_ret_t native_print(duk_context *ctx) {
	duk_push_string(ctx, " ");
	duk_insert(ctx, 0);
	duk_join(ctx, duk_get_top(ctx) - 1);
	printf("%s\n", duk_safe_to_string(ctx, -1));
	return 0;
}

static duk_ret_t native_adder(duk_context *ctx) {
	int i;
	int n = duk_get_top(ctx);  /* #args */
	double res = 0.0;

	for (i = 0; i < n; i++) {
		res += duk_to_number(ctx, i);
	}

	duk_push_number(ctx, res);
	return 1;  /* one return value */
}

uint32_t dummy_ffi_call(uint32_t x){
  printf("x=%u\n",x);
  return 4000000000;
}

uint32_t dummy_ctypes_open(char *s){
  printf("ctypes open: %s\n",s);
  return 1;
}

typedef uint32_t (* my_ffi_stub)(uint32_t a1,uint32_t a2,uint32_t a3,uint32_t a4,uint32_t a5,uint32_t a6,uint32_t a7,uint32_t a8);

static duk_ret_t my_ffi_call(duk_context *ctx) {
	int i;
	int n = duk_get_top(ctx);  /* #args */
        uint32_t args[8];
	for (i = 1; i < n; i++) {
	  args[i-1]=(uint32_t)duk_to_number(ctx, i);
	}
	for (;i < 8; i++) {
	  args[i]=0;
	}
        uint32_t ptr=duk_to_number(ctx, 0);
        __asm__("and $0xfffffff0,%esp");
	double ret=(double)(((my_ffi_stub)ptr)(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]));
	duk_push_number(ctx, ret);
	return 1;  /* one return value */
}

int dummy_main(){
        printf("My hello world\n");
	duk_context *ctx = duk_create_heap_default();

	duk_push_c_function(ctx, native_print, DUK_VARARGS);
	duk_put_global_string(ctx, "print");
	duk_push_c_function(ctx, native_adder, DUK_VARARGS);
	duk_put_global_string(ctx, "adder");

	duk_eval_string(ctx, "print('Hello world!');");

	duk_eval_string(ctx, "print('2+3=' + adder(2, 3));");
	duk_pop(ctx);  /* pop eval result */

	duk_destroy_heap(ctx);

	return 7;
}


static duk_ret_t fileio_read_file(duk_context *ctx) {
//printf("Trying to read file\n");
	const char *fn;
	char *buf;
	size_t len;
	size_t off;
	int rc;
	FILE *f;

	fn = duk_require_string(ctx, 0);
//printf("filename: %s\n",fn);
	f = fopen(fn, "rb");
if (!f) {
		(void) duk_type_error(ctx, "cannot open file %s for reading",
		                      fn);
	}
//printf("file opened\n");
	rc = fseek(f, 0, SEEK_END);
	len = (size_t) ftell(f);
	rc = fseek(f, 0, SEEK_SET);
//printf("file length: %d\n",len);
	buf = (char *) duk_push_fixed_buffer(ctx, (duk_size_t) len);
	for (off = 0; off < len;) {
		size_t got;
		got = fread((void *) (buf + off), 1, len - off, f);

		if (ferror(f)) {
			(void) fclose(f);
printf("oh noes\n");
			(void) duk_type_error(ctx, "error while reading %s", fn);
		}

		if (got == 0) {
			if (feof(f)) {
				break;
			} else {
/*
				(void) fclose(f);
				(void) duk_type_error(ctx, "error while reading %s", fn);
*/
			}
		}
		off += got;
	}

	if (f) {
		(void) fclose(f);
	}

	return 1;
}

static duk_ret_t buf_to_string(duk_context *ctx) {
  char *s;
  duk_size_t sz;
  s= (char *) duk_require_buffer(ctx, 0, &sz);
  duk_push_lstring(ctx,s,sz);
  return 1;
}

static duk_ret_t get_str_address(duk_context *ctx) {
  uint32_t s;
  s= (uint32_t)duk_get_string(ctx, 0);
  duk_push_number(ctx,(double)s);
  return 1;
}

static duk_ret_t get_buffer_address(duk_context *ctx) {
  uint32_t s;
  duk_size_t sz;
  s= (uint32_t)duk_get_buffer_data(ctx, 0, &sz);
  duk_push_number(ctx,(double)s);
  return 1;
}

duk_context *ctx2;
int init(){
  ctx2 = duk_create_heap_default();
  duk_push_c_function(ctx2, fileio_read_file, 1 /*nargs*/);
  duk_put_global_string(ctx2, "readFile");
  duk_push_c_function(ctx2, buf_to_string, 1 /*nargs*/);
  duk_put_global_string(ctx2, "buf_to_string");
  duk_push_c_function(ctx2, native_print, DUK_VARARGS);
  duk_put_global_string(ctx2, "print");

  duk_push_c_function(ctx2, my_ffi_call, DUK_VARARGS);
  duk_put_global_string(ctx2, "my_ffi_call");
  duk_push_c_function(ctx2, get_str_address, 1);
  duk_put_global_string(ctx2, "get_str_address");
  duk_push_c_function(ctx2, get_buffer_address, 1);
  duk_put_global_string(ctx2, "get_buffer_address");
}

int teardown(){
  duk_destroy_heap(ctx2);
}

int my_duk_run(char *s){

  duk_eval_string(ctx2, s);
  duk_pop(ctx2);  /* pop eval result */

  return 0;
}

int dummy_wrap(){
  return my_duk_run("print('hi')");
}

uint32_t my_get_address(uint32_t a){
  return a;
}

uint32_t my_get_ctx(){
  return ctx2;
}

uint32_t get_layout(){
  int l;
#if defined(DUK_USE_HOBJECT_LAYOUT_1)
  l=1;
#endif
#if defined(DUK_USE_HOBJECT_LAYOUT_2)
  l=2;
#endif
#if defined(DUK_USE_HOBJECT_LAYOUT_3)
  l=3;
#endif
  return l;
}

uint32_t *my_compile(void *fn,void *str,uint32_t *out){
  void *bc_ptr;
  duk_size_t bc_len;

  printf("compiling string %s %s\n", fn,str);
  printf("length of string: %d\n",strlen(str));
  duk_push_string(ctx2, fn);
  duk_compile_string_filename(ctx2, 0, str);
  duk_dump_function(ctx2);
  bc_ptr = duk_require_buffer_data(ctx2, -1, &bc_len);
  printf("bc_len: %d\n",bc_len);
  void *foo=malloc(bc_len);
  memcpy(foo,bc_ptr,bc_len);
  duk_pop(ctx2);  /* pop eval result */
  if(out){
    out[0]=foo;
    out[1]=bc_len;
  }
  return foo;
};

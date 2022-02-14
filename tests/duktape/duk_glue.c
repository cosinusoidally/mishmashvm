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

int main(int argc, char *argv[]) {
	(void) argc; (void) argv;  /* suppress warning */
        dummy_main();
        return 0;
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


duk_context *ctx2;
int init(){
  ctx2 = duk_create_heap_default();
}

int my_duk_run(char *s){
  duk_push_c_function(ctx2, native_print, DUK_VARARGS);
  duk_put_global_string(ctx2, "print");

  duk_eval_string(ctx2, s);
  duk_pop(ctx2);  /* pop eval result */

  return 0;
}

int dummy_wrap(){
  return my_duk_run("print('hi')");
}

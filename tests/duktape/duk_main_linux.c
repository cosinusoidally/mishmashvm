#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>
#include <time.h>
#include <stdint.h>

int date_now(double *x){
  struct timeval tv;

  if (gettimeofday(&tv, NULL) != 0) {
    printf("gettimeofday() failed\n");
    x[0]=0.0;
    return 0;
  }

  x[0] = (((double) tv.tv_sec) * 1000.0 +
         ((double) tv.tv_usec) / 1000.0);
  return 0;
}

#define LIN

#include "duk_main_common.c"

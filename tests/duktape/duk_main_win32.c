#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <time.h>

int cbrt(){
  printf("unimplemented cbrt\n");
  exit(0);
}

int log2(){
  printf("unimplemented log2\n");
  exit(0);
}

int date_now(double *x){
// https://stackoverflow.com/questions/10905892/equivalent-of-gettimeday-for-windows/26085827
  static const uint64_t EPOCH = ((uint64_t) 116444736000000000ULL);

  SYSTEMTIME  system_time;
  FILETIME    file_time;
  uint64_t    time;

  GetSystemTime( &system_time );
  SystemTimeToFileTime( &system_time, &file_time );
  time =  ((uint64_t)file_time.dwLowDateTime )      ;
  time += ((uint64_t)file_time.dwHighDateTime) << 32;

  long tv_sec  = (long) ((time - EPOCH) / 10000000L);
  long tv_usec = (long) (system_time.wMilliseconds * 1000);
  x[0] = (((double) tv_sec) * 1000.0 +
         ((double) tv_usec) / 1000.0);
  return 0;
}

#define dlopen LoadLibrary
#define dlsym GetProcAddress
#include "duk_main_common.c"

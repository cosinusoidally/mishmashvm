#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>



int malloc_calls=0;
int free_calls=0;

void * ljw_malloc(int x){
malloc_calls++;
uint y;
y=malloc(x);
//printf("Malloc called: %u bytes at address: %u \n",x,y);
return y;
}
void  ljw_free(void* x){
if(x!=0){
free_calls++;
}
//printf("free called %u\n",x);
return free(x);
}


void * ljw_realloc(void *z,int x){
//malloc_calls++;
uint y;
y=realloc(z,x);
//printf("realloc called: %u bytes at address: %u \n",x,y);
return y;
}

int * ljw__errno_location(void){
//printf("__errno_location called\n");
return __errno_location();
}


int ljw_close(int fd){
//printf("close called\n");
int r=close(fd);

return r;
}

int ljw_open(const char *pathname, int flags,...){
int r=open(pathname,flags);
//if(r>-1){
printf("open called fd: %d name: %s\n",r,pathname);
//printf("open called name: %s\n",pathname);
//};
return r;
}

#include <stdio.h>

void *ljw_fdopen(int fd, const char *mode){
void *r;
r=fdopen(fd, mode);
//printf("fdopen called %d %s\n",fd,mode);
return r;
}

void *ljw_fopen(const char *pathname, const char *mode){
void *r;
r=fopen(pathname, mode);
printf("fopen called %s %s\n",pathname,mode);
return r;
}

#include <dlfcn.h>

void *ljw_dlopen(const char *filename, int flags){
void *r;
r=dlopen(filename,flags);
printf("dlopen called %s\n",filename);
return r;
}

int ljw_dlclose(void *handle){
int r;
r=dlclose(handle);
printf("dlclose called %u\n",handle);
return r;
}


void *ljw_dlsym(void *handle, const char *symbol){
void *r;
r=dlsym(handle,symbol);
printf("dlsym called %u %s\n",handle,symbol);
return r;
}

void ljw_stats(){
printf("malloc calls: %u\n",malloc_calls);
printf("free calls: %u\n",free_calls);
}

#include <setjmp.h>
void ljw_longjmp(jmp_buf env, int val){
printf("longjmp called\n");
longjmp(env, val);
}

int ljw_setjmp(jmp_buf env){
int r;
setjmp(env);
printf("setjmp called\n");
return r;
}


#include <signal.h>

int ljw_sigaction(int signum, const struct sigaction *act,
                     struct sigaction *oldact){
int r;
printf("sigaction called\n");
sigaction(signum, act, oldact);
return r;
}

int ljw_sigemptyset(sigset_t *set){
int r;
printf("sigemptyset called\n");
r=sigemptyset(set);
return r;
}



int ljw_unlink(const char *pathname){
int r;
//printf("unlink called %s\n",pathname);
r=unlink(pathname);
return r;
}

int ljw_remove(const char *pathname){
int r;
printf("remove called %s\n",pathname);
r=remove(pathname);
return r;
}


char *ljw_getcwd(char *buf, size_t size){
char *r;
r=getcwd(buf,size);
printf("getcwd called %s\n",r);
return r;
}

ljw_crash(){
printf("crash, shouldn't be called\n");
exit(1);
}

int ljw_execvp(const char *file, char *const argv[]){
printf("execvp called\n");
ljw_crash();
}

char *ljw_getenv(const char *name){
char *r;
r=getenv(name);
//printf("getenv called %s returned: %s\n",name,r);
return r;
}

#include <sys/mman.h>

int ljw_mprotect(void *addr, size_t len, int prot){
printf("mprotect called\n");
ljw_crash();
}


ssize_t ljw_read(int fd, void *buf, size_t count){
ssize_t r;
r=read(fd, buf, count);
//printf("read called fd: %u buf: %u count: %u\n",fd,buf,count);
return r;
}

void *ljw_stderr;
void *ljw_stdout;

void ljw_setup(void){
ljw_stderr=stderr;
ljw_stdout=stdout;
printf("ljw setup called\n");
}

void ljw_setup2(void *a,void *b){
ljw_stderr=fopen("stderr.txt","wb");
ljw_stdout=fopen("stdout.txt","wb");
printf("ljw setup2 called\n");
}

void ljw_crash___errno_location(){
printf("ljw_crash___errno_location missing\n");
exit(1);
}

void ljw_crash_longjmp(){
printf("ljw_crash_longjmp missing\n");
exit(1);
}

void ljw_crash__setjmp(){
printf("ljw_crash__setjmp missing\n");
exit(1);
}

void ljw_crash_fread(){
printf("ljw_crash_fread missing\n");
exit(1);
}

void ljw_crash_fflush(){
printf("ljw_crash_fflush missing\n");
exit(1);
}

void ljw_crash_fputs(){
printf("ljw_crash_fputs missing\n");
exit(1);
}

void ljw_crash_fseek(){
printf("ljw_crash_fseek missing\n");
exit(1);
}

void ljw_crash_ftell(){
printf("ljw_crash_ftell missing\n");
exit(1);
}

void ljw_crash_fprintf(){
printf("ljw_crash_fprintf missing\n");
exit(1);
}

void ljw_crash_lseek(){
printf("ljw_crash_lseek missing\n");
exit(1);
}

void ljw_crash_dlopen(){
printf("ljw_crash_dlopen missing\n");
exit(1);
}

void ljw_crash_dlclose(){
printf("ljw_crash_dlclose missing\n");
exit(1);
}

void ljw_crash_dlsym(){
printf("ljw_crash_dlsym missing\n");
exit(1);
}

void ljw_crash_vfprintf(){
printf("ljw_crash_vfprintf missing\n");
exit(1);
}

void ljw_crash_vsnprintf(){
printf("ljw_crash_vsnprintf missing\n");
exit(1);
}

void ljw_crash_sigaction(){
printf("ljw_crash_sigaction missing\n");
exit(1);
}

void ljw_crash_sigemptyset(){
printf("ljw_crash_sigemptyset missing\n");
exit(1);
}

void ljw_crash_strcat(){
printf("ljw_crash_strcat missing\n");
exit(1);
}

void ljw_crash_strncmp(){
printf("ljw_crash_strncmp missing\n");
exit(1);
}

void ljw_crash_strstr(){
printf("ljw_crash_strstr missing\n");
exit(1);
}

void ljw_crash_strtof(){
printf("ljw_crash_strtof missing\n");
exit(1);
}

void ljw_crash_strtol(){
printf("ljw_crash_strtol missing\n");
exit(1);
}

void ljw_crash_strtold(){
printf("ljw_crash_strtold missing\n");
exit(1);
}

void ljw_crash_strtoll(){
printf("ljw_crash_strtoll missing\n");
exit(1);
}

void ljw_crash_strtoul(){
printf("ljw_crash_strtoul missing\n");
exit(1);
}

void ljw_crash_strtoull(){
printf("ljw_crash_strtoull missing\n");
exit(1);
}

void ljw_crash_time(){
printf("ljw_crash_time missing\n");
exit(1);
}

void ljw_crash_gettimeofday(){
printf("ljw_crash_gettimeofday missing\n");
exit(1);
}

void ljw_crash_localtime(){
printf("ljw_crash_localtime missing\n");
exit(1);
}

void ljw_crash_ldexp(){
printf("ljw_crash_ldexp missing\n");
exit(1);
}
ljw_crash_memset_crash(){
printf("ljw_crash_memset\n");
exit(1);
}
ljw_crash_atan_crash(){
printf("ljw_crash_atan\n");
exit(1);
}
ljw_crash_fclose_crash(){
printf("ljw_crash_fclose\n");
exit(1);
}
ljw_crash_fwrite_crash(){
printf("ljw_crash_fwrite\n");
exit(1);
}
ljw_crash_fflush_crash(){
printf("ljw_crash_fflush\n");
exit(1);
}
ljw_crash_fread_crash(){
printf("ljw_crash_fread\n");
exit(1);
}
ljw_crash_strstr_crash(){
printf("ljw_crash_strstr\n");
exit(1);
}
ljw_crash_atoi_crash(){
printf("ljw_crash_atoi\n");
exit(1);
}
ljw_crash_sprintf_crash(){
printf("ljw_crash_sprintf\n");
exit(1);
}
ljw_crash_fopen_crash(){
printf("ljw_crash_fopen\n");
exit(1);
}
ljw_crash_fprintf_crash(){
printf("ljw_crash_fprintf\n");
exit(1);
}
ljw_crash_strcpy_crash(){
printf("ljw_crash_strcpy\n");
exit(1);
}
ljw_crash__IO_getc_crash(){
printf("ljw_crash__IO_getc\n");
exit(1);
}
ljw_crash_memmove_crash(){
printf("ljw_crash_memmove\n");
exit(1);
}
ljw_crash_rand_crash(){
printf("ljw_crash_rand\n");
exit(1);
}
ljw_crash_memcpy_crash(){
printf("ljw_crash_memcpy\n");
exit(1);
}
ljw_crash_strncpy_crash(){
printf("ljw_crash_strncpy\n");
exit(1);
}
ljw_crash_atan2_crash(){
printf("ljw_crash_atan2\n");
exit(1);
}
ljw_crash_sqrt_crash(){
printf("ljw_crash_sqrt\n");
exit(1);
}
ljw_crash_strlen_crash(){
printf("ljw_crash_strlen\n");
exit(1);
}
ljw_crash_strcmp_crash(){
printf("ljw_crash_strcmp\n");
exit(1);
}
ljw_crash_strcat_crash(){
printf("ljw_crash_strcat\n");
exit(1);
}
ljw_crash_vsprintf_crash(){
printf("ljw_crash_vsprintf\n");
exit(1);
}
ljw_crash_fseek_crash(){
printf("ljw_crash_fseek\n");
exit(1);
}
ljw_crash_strchr_crash(){
printf("ljw_crash_strchr\n");
exit(1);
}
ljw_crash_unlink_crash(){
printf("ljw_crash_unlink\n");
exit(1);
}
ljw_crash_open_crash(){
printf("ljw_crash_open\n");
exit(1);
}
ljw_crash_write_crash(){
printf("ljw_crash_write\n");
exit(1);
}
ljw_crash_close_crash(){
printf("ljw_crash_close\n");
exit(1);
}
ljw_crash_ceil_crash(){
printf("ljw_crash_ceil\n");
exit(1);
}
ljw_crash_printf_crash(){
printf("ljw_crash_printf\n");
exit(1);
}
ljw_crash_longjmp_crash(){
printf("ljw_crash_longjmp\n");
exit(1);
}
ljw_crash__setjmp_crash(){
printf("ljw_crash__setjmp\n");
exit(1);
}
ljw_crash_malloc_crash(){
printf("ljw_crash_malloc\n");
exit(1);
}
ljw_crash___isoc99_fscanf_crash(){
printf("ljw_crash___isoc99_fscanf\n");
exit(1);
}
ljw_crash_feof_crash(){
printf("ljw_crash_feof\n");
exit(1);
}
ljw_crash_fgetc_crash(){
printf("ljw_crash_fgetc\n");
exit(1);
}
ljw_crash_fabs_crash(){
printf("ljw_crash_fabs\n");
exit(1);
}
ljw_crash_cos_crash(){
printf("ljw_crash_cos\n");
exit(1);
}
ljw_crash_sin_crash(){
printf("ljw_crash_sin\n");
exit(1);
}
ljw_crash_floor_crash(){
printf("ljw_crash_floor\n");
exit(1);
}
ljw_crash_strncmp_crash(){
printf("ljw_crash_strncmp\n");
exit(1);
}
ljw_crash_inet_ntoa_crash(){
printf("ljw_crash_inet_ntoa\n");
exit(1);
}
ljw_crash_inet_addr_crash(){
printf("ljw_crash_inet_addr\n");
exit(1);
}
ljw_crash_atof_crash(){
printf("ljw_crash_atof\n");
exit(1);
}
ljw_crash_tan_crash(){
printf("ljw_crash_tan\n");
exit(1);
}
ljw_crash_abs_crash(){
printf("ljw_crash_abs\n");
exit(1);
}
ljw_crash_ftell_crash(){
printf("ljw_crash_ftell\n");
exit(1);
}
ljw_crash___errno_location_crash(){
printf("ljw_crash___errno_location\n");
exit(1);
}
ljw_crash_strerror_crash(){
printf("ljw_crash_strerror\n");
exit(1);
}
ljw_crash_puts_crash(){
printf("ljw_crash_puts\n");
exit(1);
}
ljw_crash_stdout_crash(){
printf("ljw_crash_stdout\n");
exit(1);
}
ljw_crash_vprintf_crash(){
printf("ljw_crash_vprintf\n");
exit(1);
}
ljw_crash_exit_crash(){
printf("ljw_crash_exit\n");
exit(1);
}
ljw_crash_pow_crash(){
printf("ljw_crash_pow\n");
exit(1);
}
ljw_crash_SDL_Init_crash(){
printf("ljw_crash_SDL_Init\n");
exit(1);
}
ljw_crash_SDL_SetVideoMode_crash(){
printf("ljw_crash_SDL_SetVideoMode\n");
exit(1);
}
ljw_crash_SDL_PollEvent_crash(){
printf("ljw_crash_SDL_PollEvent\n");
exit(1);
}
ljw_crash_SDL_Flip_crash(){
printf("ljw_crash_SDL_Flip\n");
exit(1);
}

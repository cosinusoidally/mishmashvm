#include <SDL.h>

#define width 640
#define height 360

char *frame;
char *frame_raw;
int b=width*height*4;
SDL_Surface *surface;
int running=1;
void set_sdl_buf(char *x){
frame =x;

}
void set_sdl_buf_raw(char *x){
frame_raw =x;

}
void* get_framebuffer_sdl(){
  return surface->pixels;
}



void init_sdl(){

 SDL_Init(SDL_INIT_EVERYTHING);
 surface=SDL_SetVideoMode(width, height, 32, SDL_SWSURFACE);
}

void my_sdl_main(){

SDL_Event event;
while(SDL_PollEvent(&event)) {
//printf("event type %d\n",event.type);
switch (event.type) {
                                case SDL_QUIT:
                                        running = 0;
                                        break;
                                case SDL_KEYDOWN:
                                        printf("SDL_KEYDOWN\n");
                                        break;
                                case SDL_KEYUP:
                                        printf("SDL_KEYUP\n");
                                        break;
                                default:
                                        break;
                        }
}
//memcpy(get_framebuffer_sdl(),frame_raw,b);
SDL_Flip(surface);
if(running == 0 ){
exit(0);
}
}

#ifdef WITH_MAIN
main(){
set_sdl_buf(malloc(width*height*4));
init_sdl();
while(running){
my_sdl_main(0);
 FILE* foo;
foo=fopen("/dev/shm/frame","rb");
if(foo){
fread(get_framebuffer_sdl(),15,1,foo);
fread(frame,b,1,foo);
fclose(foo);
for(int i=0;i<b;i=i+3){
int c=frame[i+2];
frame[i+2]=frame[i];
frame[i]=c;

}
}
}}
#endif

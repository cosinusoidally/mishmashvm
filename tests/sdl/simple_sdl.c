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

  SDL_Flip(surface);
  if(running == 0 ){
    exit(0);
  }
}

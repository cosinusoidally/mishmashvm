#include <SDL.h>

SDL_Surface *surface;
int running=1;

void* get_framebuffer_sdl(){
  return surface->pixels;
}

void init_sdl(int width, int height){
  SDL_Init(SDL_INIT_EVERYTHING);
  surface=SDL_SetVideoMode(width, height, 32, SDL_SWSURFACE);
}

void my_sdl_main(){
  SDL_Flip(surface);
  if(running == 0 ){
    exit(0);
  }
}

void my_sdl_process_events(){
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
}

char * get_event_info(void){
  SDL_Event e;
  char * foo;
  char * bar;
  foo=malloc(10000);
  bar=foo;
  bar+= sprintf(bar,"{\n");
  bar+= sprintf(bar,"\"SDL_Event\": %d,\n",sizeof(SDL_Event));
  bar+= sprintf(bar,"\"SDL_KeyboardEvent\": %d,\n",sizeof(SDL_KeyboardEvent));
  bar+= sprintf(bar,"\"event_types\":\n");
  bar+= sprintf(bar,"{\n");
  bar+= sprintf(bar,"\"SDL_KEYDOWN\": %d,\n",SDL_KEYDOWN);
  bar+= sprintf(bar,"\"SDL_KEYUP\": %d,\n",SDL_KEYUP);
  bar+= sprintf(bar,"\"SDL_QUIT\": %d\n",SDL_QUIT);
  bar+= sprintf(bar,"}\n");
  bar+= sprintf(bar,"}\n");
  return foo;
}

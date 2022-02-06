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
  bar+= sprintf(bar,"\"SDLKey\": %d,\n",sizeof(SDLKey));
  bar+= sprintf(bar,"\"SDL_KeyboardEvent\":\n");
  bar+= sprintf(bar,"{\n");
  bar+= sprintf(bar,"\"type\": %d,\n",offsetof(SDL_KeyboardEvent,type));
  bar+= sprintf(bar,"\"state\": %d,\n",offsetof(SDL_KeyboardEvent,state));
  bar+= sprintf(bar,"\"keysym\": %d\n",offsetof(SDL_KeyboardEvent,keysym));
  bar+= sprintf(bar,"},\n");
  bar+= sprintf(bar,"\"SDL_keysym\":\n");
  bar+= sprintf(bar,"{\n");
  bar+= sprintf(bar,"\"scancode\": %d,\n",offsetof(SDL_keysym,scancode));
  bar+= sprintf(bar,"\"sym\": %d,\n",offsetof(SDL_keysym,sym));
  bar+= sprintf(bar,"\"mod\": %d,\n",offsetof(SDL_keysym,mod));
  bar+= sprintf(bar,"\"unicode\": %d\n",offsetof(SDL_keysym,unicode));
  bar+= sprintf(bar,"},\n");
  bar+= sprintf(bar,"\"event_types\":\n");
  bar+= sprintf(bar,"{\n");
  bar+= sprintf(bar," \"%d\": \"SDL_KEYDOWN\",\n",SDL_KEYDOWN);
  bar+= sprintf(bar," \"%d\": \"SDL_KEYUP\",\n",SDL_KEYUP);
  bar+= sprintf(bar," \"%d\": \"SDL_QUIT\"\n",SDL_QUIT);
  bar+= sprintf(bar,"},\n");
  bar+= sprintf(bar,"\"keycodes\":\n");
  bar+= sprintf(bar,"{\n");
  bar+= sprintf(bar," \"%d\": \"a\",\n",SDLK_a);
  bar+= sprintf(bar," \"%d\": \" \"\n",SDLK_SPACE);
  bar+= sprintf(bar,"}\n");
  bar+= sprintf(bar,"}\n");
  return foo;
}

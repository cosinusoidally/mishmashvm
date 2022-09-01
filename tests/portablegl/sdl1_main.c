#include "draw_main.c"
#define SDL_MAIN_HANDLED
#include <SDL.h>

SDL_Surface *surface;

void sdl_cleanup() {
  SDL_Quit();
}

void sdl_setup_context() {
  SDL_Init(SDL_INIT_EVERYTHING);
  surface=SDL_SetVideoMode(WIDTH, HEIGHT, 32, SDL_SWSURFACE);
}


int sdl_main(void) {
  setup_context();
  sdl_setup_context();

  init();
  SDL_Event e;
  int quit = 0;

  unsigned int old_time = 0, new_time=0, counter = 0;
  unsigned int last_frame = 0;
  while (!quit) {
    while (SDL_PollEvent(&e)) {
      switch (e.type) {
        case SDL_QUIT:
          quit = 1;
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

    new_time = SDL_GetTicks();
    last_frame = new_time;
		
    counter++;
    if (!(counter % 300)) {
      printf("%d  %f FPS\n", new_time-old_time, 300000/((float)(new_time-old_time)));
      old_time = new_time;
      counter = 0;
    }

    draw();

    memcpy(surface->pixels,bbufpix,WIDTH*HEIGHT*4);
    SDL_Flip(surface);

  }

  cleanup();
  sdl_cleanup();

  return 0;
}

void update(){
    memcpy(surface->pixels,bbufpix,WIDTH*HEIGHT*4);
    SDL_Flip(surface);
};

int main(int argc, char** argv)
{
        sdl_main();
}

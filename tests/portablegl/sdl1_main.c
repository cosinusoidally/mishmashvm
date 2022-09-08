#include "draw_main.c"
#define SDL_MAIN_HANDLED
#include <SDL.h>

SDL_Surface *surface;

int scale=1;

void sdl_cleanup() {
  SDL_Quit();
}

void sdl_setup_context() {
  SDL_Init(SDL_INIT_EVERYTHING);
  surface=SDL_SetVideoMode(WIDTH*scale, HEIGHT*scale, 32, SDL_SWSURFACE);
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
    if(scale==1){
      memcpy(surface->pixels,bbufpix,WIDTH*HEIGHT*4);
    } else {
      char *inp=(char *)bbufpix;
      char *o=(char *)surface->pixels;
      for(int j=0;j<HEIGHT;j++){
        for(int i=0;i<WIDTH;i++){
          for(int l=0;l<scale;l++){
            for(int k=0;k<scale;k++){
              o[4*(i+j*WIDTH*scale)*scale+k*4+l*WIDTH*4*scale]=inp[4*(i+j*WIDTH)];
              o[4*(i+j*WIDTH*scale)*scale+1+k*4+l*WIDTH*4*scale]=inp[4*(i+j*WIDTH)+1];
              o[4*(i+j*WIDTH*scale)*scale+2+k*4+l*WIDTH*4*scale]=inp[4*(i+j*WIDTH)+2];
              o[4*(i+j*WIDTH*scale)*scale+3+k*4+l*WIDTH*4*scale]=inp[4*(i+j*WIDTH)+3];
            }
          }
        }
      }
    }
    SDL_Flip(surface);
};

int main(int argc, char** argv)
{
        sdl_main();
}

void set_scale(int s){
  scale=s;
  malloc(WIDTH*HEIGHT*4*s*s);
}

void set_size(int w,int h){
  WIDTH=w;
  HEIGHT=h;
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
  bar+= sprintf(bar," \"%d\": \"b\",\n",SDLK_b);
  bar+= sprintf(bar," \"%d\": \"c\",\n",SDLK_c);
  bar+= sprintf(bar," \"%d\": \"d\",\n",SDLK_d);
  bar+= sprintf(bar," \"%d\": \"e\",\n",SDLK_e);
  bar+= sprintf(bar," \"%d\": \"f\",\n",SDLK_f);
  bar+= sprintf(bar," \"%d\": \"g\",\n",SDLK_g);
  bar+= sprintf(bar," \"%d\": \"h\",\n",SDLK_h);
  bar+= sprintf(bar," \"%d\": \"i\",\n",SDLK_i);
  bar+= sprintf(bar," \"%d\": \"j\",\n",SDLK_j);
  bar+= sprintf(bar," \"%d\": \"k\",\n",SDLK_k);
  bar+= sprintf(bar," \"%d\": \"l\",\n",SDLK_l);
  bar+= sprintf(bar," \"%d\": \"m\",\n",SDLK_m);
  bar+= sprintf(bar," \"%d\": \"n\",\n",SDLK_n);
  bar+= sprintf(bar," \"%d\": \"o\",\n",SDLK_o);
  bar+= sprintf(bar," \"%d\": \"p\",\n",SDLK_p);
  bar+= sprintf(bar," \"%d\": \"q\",\n",SDLK_q);
  bar+= sprintf(bar," \"%d\": \"r\",\n",SDLK_r);
  bar+= sprintf(bar," \"%d\": \"s\",\n",SDLK_s);
  bar+= sprintf(bar," \"%d\": \"t\",\n",SDLK_t);
  bar+= sprintf(bar," \"%d\": \"u\",\n",SDLK_u);
  bar+= sprintf(bar," \"%d\": \"v\",\n",SDLK_v);
  bar+= sprintf(bar," \"%d\": \"w\",\n",SDLK_w);
  bar+= sprintf(bar," \"%d\": \"x\",\n",SDLK_x);
  bar+= sprintf(bar," \"%d\": \"y\",\n",SDLK_y);
  bar+= sprintf(bar," \"%d\": \"z\",\n",SDLK_z);
  bar+= sprintf(bar," \"%d\": \"left\",\n",SDLK_LEFT);
  bar+= sprintf(bar," \"%d\": \"right\",\n",SDLK_RIGHT);
  bar+= sprintf(bar," \"%d\": \"up\",\n",SDLK_UP);
  bar+= sprintf(bar," \"%d\": \"down\",\n",SDLK_DOWN);
  bar+= sprintf(bar," \"%d\": \" \",\n",SDLK_SPACE);
  bar+= sprintf(bar," \"%d\": \"backspace\"\n",SDLK_BACKSPACE);
  bar+= sprintf(bar,"}\n");
  bar+= sprintf(bar,"}\n");
  return foo;
}

#define PORTABLEGL_IMPLEMENTATION
#include "portablegl.h"

int WIDTH=640;
int HEIGHT=480;


#include <stdio.h>

u32* bbufpix;

glContext the_Context;

typedef struct My_Uniforms
{
	mat4 mvp_mat;
	vec4 v_color;
} My_Uniforms;

void cleanup();
void setup_context();


void smooth_vs(float* vs_output, void* vertex_attribs, Shader_Builtins* builtins, void* uniforms);
void smooth_fs(float* fs_input, Shader_Builtins* builtins, void* uniforms);




void smooth_vs(float* vs_output, void* vertex_attribs, Shader_Builtins* builtins, void* uniforms)
{
	vec4* v_attribs = vertex_attribs;
	((vec4*)vs_output)[0] = v_attribs[4]; //color

	builtins->gl_Position = mult_mat4_vec4(*((mat4*)uniforms), v_attribs[0]);
}

void smooth_fs(float* fs_input, Shader_Builtins* builtins, void* uniforms)
{
	builtins->gl_FragColor = ((vec4*)fs_input)[0];
}

void setup_context()
{
	if (!init_glContext(&the_Context, &bbufpix, WIDTH, HEIGHT, 32, 0x00FF0000, 0x0000FF00, 0x000000FF, 0xFF000000)) {
		puts("Failed to initialize glContext");
		exit(0);
	}
	set_glContext(&the_Context);
}

void cleanup()
{
	free_glContext(&the_Context);
}

void draw(){
	glClear(GL_COLOR_BUFFER_BIT);
	glDrawArrays(GL_TRIANGLES, 0, 3);
}

GLenum smooth[4] = { SMOOTH, SMOOTH, SMOOTH, SMOOTH };

float points_n_colors[] = {
	-0.5, -0.5, 0.0,
	 1.0,  0.0, 0.0,

	 0.5, -0.5, 0.0,
	 0.0,  1.0, 0.0,

	 0.0,  0.5, 0.0,
	 0.0,  0.0, 1.0 };

My_Uniforms the_uniforms;

mat4 identity = IDENTITY_MAT4();
GLuint triangle;

GLuint myshader; 

void init(){

	glGenBuffers(1, &triangle);
	glBindBuffer(GL_ARRAY_BUFFER, triangle);
	glBufferData(GL_ARRAY_BUFFER, sizeof(points_n_colors), points_n_colors, GL_STATIC_DRAW);
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(float)*6, 0);
	glEnableVertexAttribArray(4);
	glVertexAttribPointer(4, 4, GL_FLOAT, GL_FALSE, sizeof(float)*6, (void*)(sizeof(float)*3));

	myshader = pglCreateProgram(smooth_vs, smooth_fs, 4, smooth, GL_FALSE);

	glUseProgram(myshader);

	pglSetUniform(&the_uniforms);

	memcpy(the_uniforms.mvp_mat, identity, sizeof(mat4));

	glClearColor(0, 0, 0, 1);
}

void wrap_glClearColor(float *p){
  printf("C glClearColor %f %f %f %f \n",p[0],p[1],p[2],p[3]);
  glClearColor(p[0],p[1],p[2],p[3]);
}

void wrap_glDepthRange(float *p){
  printf("C glDepthRange %f %f \n",p[0],p[1]);
  glDepthRange(p[0],p[1]);
}

void wrap_glClearDepth(float *p){
  printf("C glClearDepth %f \n",p[0]);
  glClearDepth(p[0]);
}
void show_consts(){
  printf("pgl.consts['GL_COLOR_BUFFER_BIT']= %u;\n",GL_COLOR_BUFFER_BIT);
  printf("pgl.consts['GL_DEPTH_BUFFER_BIT']= %u;\n",GL_DEPTH_BUFFER_BIT);
  printf("pgl.consts['GL_CW']= %u;\n",GL_CW);
  printf("pgl.consts['GL_BACK']= %u;\n",GL_BACK);
  printf("pgl.consts['GL_BLEND']= %u;\n",GL_BLEND);
  printf("pgl.consts['GL_CULL_FACE']= %u;\n",GL_CULL_FACE);
  printf("pgl.consts['GL_DEPTH_TEST']= %u;\n",GL_DEPTH_TEST);
}

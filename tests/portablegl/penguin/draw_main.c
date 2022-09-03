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
  printf("pgl.consts['GL_TEXTURE0']= %u;\n",GL_TEXTURE0);
  printf("pgl.consts['GL_TEXTURE1']= %u;\n",GL_TEXTURE1);
  printf("pgl.consts['GL_TEXTURE_2D']= %u;\n",GL_TEXTURE_2D);
  printf("pgl.consts['GL_RGB']= %u;\n",GL_RGB);
  printf("pgl.consts['GL_UNSIGNED_BYTE']= %u;\n",GL_UNSIGNED_BYTE);
  printf("pgl.consts['GL_UNSIGNED_BYTE']= %u;\n",GL_UNSIGNED_BYTE);
  printf("pgl.consts['GL_TEXTURE_WRAP_S']= %u;\n",GL_TEXTURE_WRAP_S);
  printf("pgl.consts['GL_TEXTURE_WRAP_T']= %u;\n",GL_TEXTURE_WRAP_T);
  printf("pgl.consts['GL_MIRRORED_REPEAT']= %u;\n",GL_MIRRORED_REPEAT);
  printf("pgl.consts['GL_ARRAY_BUFFER']= %u;\n",GL_ARRAY_BUFFER);
  printf("pgl.consts['GL_ELEMENT_ARRAY_BUFFER']= %u;\n",GL_ELEMENT_ARRAY_BUFFER);
  printf("pgl.consts['GL_STATIC_DRAW']= %u;\n",GL_STATIC_DRAW);
  printf("pgl.consts['GL_FLOAT']= %u;\n",GL_FLOAT);
  printf("pgl.consts['GL_TRIANGLE_FAN']= %u;\n",GL_TRIANGLE_FAN);
  printf("pgl.consts['GL_TRIANGLE_STRIP']= %u;\n",GL_TRIANGLE_STRIP);
  printf("pgl.consts['GL_TRIANGLES']= %u;\n",GL_TRIANGLES);
  printf("pgl.consts['GL_UNSIGNED_SHORT']= %u;\n",GL_UNSIGNED_SHORT);
}

typedef struct shader_uniforms
{
// from shader_vs:
//        uniform mat4 view;
          mat4 view;
//        uniform mat4 world;
          mat4 world;
//        uniform vec4 blend;
          vec4 blend;

// from shader_fs
//        uniform vec4 color;
          vec4 color;
//        uniform sampler2D texture;
          GLuint texture;
} shader_uniforms;

typedef struct shader_attributes
{
//        attribute vec2 tex;
          vec2 tex;
//        attribute vec3 vertex;
          vec3 vertex;
//        attribute vec3 normal;
          vec3 normal;
} shader_attributes;

void get_shader_unform_metadata(){
  printf("sizeof(shader_uniforms)=%u\n",sizeof(shader_uniforms));
  printf("offsetof(shader_uniforms,view)=%u\n",offsetof(shader_uniforms,view));
  printf("offsetof(shader_uniforms,world)=%u\n",offsetof(shader_uniforms,world));
  printf("offsetof(shader_uniforms,blend)=%u\n",offsetof(shader_uniforms,blend));
  printf("offsetof(shader_uniforms,color)=%u\n",offsetof(shader_uniforms,color));
  printf("offsetof(shader_uniforms,texture)=%u\n",offsetof(shader_uniforms,texture));
}

void get_shader_attributes_metadata(){
  printf("sizeof(shader_attributes)=%u\n",sizeof(shader_attributes));
  printf("offsetof(shader_attributes,view)=%u\n",offsetof(shader_attributes,tex));
  printf("offsetof(shader_attributes,vertex)=%u\n",offsetof(shader_attributes,vertex));
  printf("offsetof(shader_attributes,normal)=%u\n",offsetof(shader_attributes,normal));
}
/*
<script id="shader-vs" type="x-shader/x-vertex">
        attribute vec2 tex;
        attribute vec3 vertex;
        attribute vec3 normal;
        varying vec2 tcoord;
        uniform mat4 view;
        uniform mat4 world;
        uniform vec4 blend;
        varying float light;
        void main(void) {
                vec4 normal2 = world * vec4(normal,0.0);
                light = 0.5+max(0.0,0.5*dot(normal2.xyz,vec3(0.7,0,0.7)));
                tcoord = tex+blend.xy;
                vec4 vertex2 = world * vec4(vertex,1.0);
                gl_Position = view * vertex2;
        }
</script>
*/

void shader_vs(float* vs_output, void* vertex_attribs, Shader_Builtins* builtins, void* uniforms) {
  shader_uniforms* u = (shader_uniforms*)uniforms;
  // note this approach may not work in the general case
  // as we may have struct padding issues for attributes
  vec2 tex=vec4_to_vec2(((vec4*)vertex_attribs)[0]);
  vec3 vertex=vec4_to_vec3(((vec4*)vertex_attribs)[1]);
  vec3 normal=vec4_to_vec3(((vec4*)vertex_attribs)[2]);
  printf("shader_vs called\n");
  print_vec2(tex,"tex\n");
  print_vec3(vertex,"vertex\n");
  print_vec3(normal,"normal\n");
  vec4 tmp = {vertex.x,vertex.y,vertex.z,1.0};
  vec4 vertex2 = mult_mat4_vec4(u->world,tmp);
  builtins->gl_Position = mult_mat4_vec4(u->view,vertex2);
  print_vec4(builtins->gl_Position,"gl_Position\n");
}

/*
<script id="shader-fs" type="x-shader/x-fragment">
    precision mediump float;
        uniform vec4 color;
        uniform sampler2D texture;
        varying vec2 tcoord;
        varying float light;
        void main(void) {
            mediump vec4 col = texture2D(texture,tcoord);
                if (col.x>0.9 && col.y>0.6 && col.y<0.61 && col.z<0.1)
                         discard;
                gl_FragColor = col*light;
                gl_FragColor.a = 1.0;
        }
</script>
*/

void shader_fs(float* fs_input, Shader_Builtins* builtins, void* uniforms) {
//  printf("shader_fs called\n");
  builtins->gl_FragColor = ((vec4*)fs_input)[0];
}

GLuint create_program(){
  myshader = pglCreateProgram(shader_vs, shader_fs, 4, smooth, GL_FALSE);
  printf("create_program %u\n",myshader);
  return myshader;
}

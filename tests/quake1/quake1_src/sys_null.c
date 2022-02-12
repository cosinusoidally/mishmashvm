/*
Copyright (C) 1996-1997 Id Software, Inc.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  

See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

*/
// sys_null.h -- null system driver to aid porting efforts

#include "quakedef.h"
#include "errno.h"



qboolean			isDedicated;	//Always false for Null Driver
cvar_t		_windowed_mouse = {"_windowed_mouse","0", true};

/*
===============================================================================

FILE IO

===============================================================================
*/

#define MAX_HANDLES             10
FILE    *sys_handles[MAX_HANDLES];

int             findhandle (void)
{
	int             i;
	
	for (i=1 ; i<MAX_HANDLES ; i++)
		if (!sys_handles[i])
			return i;
	Sys_Error ("out of handles");
	return -1;
}

/*
================
filelength
================
*/
int filelength (FILE *f)
{
	int             pos;
	int             end;

	pos = ftell (f);
	fseek (f, 0, SEEK_END);
	end = ftell (f);
	fseek (f, pos, SEEK_SET);

	return end;
}

int Sys_FileOpenRead (char *path, int *hndl)
{
	FILE    *f;
	int             i;
	
	i = findhandle ();

	f = fopen(path, "rb");
	if (!f)
	{
		*hndl = -1;
		return -1;
	}
	sys_handles[i] = f;
	*hndl = i;
	
	return filelength(f);
}

int Sys_FileOpenWrite (char *path)
{
	FILE    *f;
	int             i;
	
	i = findhandle ();

	f = fopen(path, "wb");
	if (!f)
		Sys_Error ("Error opening %s: %s", path,strerror(errno));
	sys_handles[i] = f;
	
	return i;
}

void Sys_FileClose (int handle)
{
	fclose (sys_handles[handle]);
	sys_handles[handle] = NULL;
}

void Sys_FileSeek (int handle, int position)
{
	fseek (sys_handles[handle], position, SEEK_SET);
}

int Sys_FileRead (int handle, void *dest, int count)
{
	return fread (dest, 1, count, sys_handles[handle]);
}

int Sys_FileWrite (int handle, void *data, int count)
{
	return fwrite (data, 1, count, sys_handles[handle]);
}

int     Sys_FileTime (char *path)
{
	FILE    *f;
	
	f = fopen(path, "rb");
	if (f)
	{
		fclose(f);
		return 1;
	}
	
	return -1;
}

void Sys_mkdir (char *path)
{
}


/*
===============================================================================

SYSTEM IO

===============================================================================
*/

void Sys_MakeCodeWriteable (unsigned long startaddr, unsigned long length)
{
}


void Sys_Error (char *error, ...)
{
	va_list         argptr;

	printf ("Sys_Error: ");   
//puts(error);
//fflush(stdout);
	va_start (argptr,error);
	vprintf (error,argptr);
	va_end (argptr);
	printf ("\n");

	exit (100);
}


void Sys_Printf (char *fmt, ...)
{
	va_list         argptr;
	
	va_start (argptr,fmt);
	vprintf (fmt,argptr);
	va_end (argptr);
}

void Sys_Quit (void)
{
#ifndef FLASH	//Cant quit on FLASH
	exit (0);
#endif
}

#ifdef FLASH
double _as3Time;
#endif

double Sys_FloatTime (void)
{
#ifdef FLASH
	return _as3Time;
#else
	static double t;
	
	t += 0.1;
	
	return t;
#endif
}

char *Sys_ConsoleInput (void)
{
	return NULL;
}

void Sys_Sleep (void)
{
}

void Sys_SendKeyEvents (void)
{
}

void Sys_HighFPPrecision (void)
{
}

void Sys_LowFPPrecision (void)
{
}

#if defined(NULL_DRIVER)

void	VID_LockBuffer (void) {}
void	VID_UnlockBuffer (void) {}

#endif

//=============================================================================


#ifdef FLASH

AS3_Val _swfMain;
double _oldtime;

void trace(char *fmt, ...)
{
	va_list		argptr;
	char		msg[10000] = "TRACE: ";
	AS3_Val as3Str;
	
	va_start (argptr,fmt);
	vsprintf (&msg[7],fmt,argptr);
	va_end (argptr);

	as3Str = AS3_String(msg);
	AS3_Trace(as3Str);
	AS3_Release(as3Str);
}

/* Does a FILE * read against a ByteArray */
static int readByteArray(void *cookie, char *dst, int size)
{
	return AS3_ByteArray_readBytes(dst, (AS3_Val)cookie, size);
}
 
/* Does a FILE * write against a ByteArray */
static int writeByteArray(void *cookie, const char *src, int size)
{
	return AS3_ByteArray_writeBytes((AS3_Val)cookie, (char *)src, size);
}
 
/* Does a FILE * lseek against a ByteArray */
static fpos_t seekByteArray(void *cookie, fpos_t offs, int whence)
{
	return AS3_ByteArray_seek((AS3_Val)cookie, offs, whence);
}
 
/* Does a FILE * close against a ByteArray */
static int closeByteArray(void * cookie)
{
	AS3_Val zero = AS3_Int(0);
 
	/* just reset the position */
	AS3_SetS((AS3_Val)cookie, "position", zero);
	AS3_Release(zero);
	return 0;
}

FILE* as3OpenWriteFile(const char* filename)
{
	FILE* ret;
	AS3_Val byteArray;

	AS3_Val params = AS3_Array(
		"AS3ValType",
		AS3_String(filename));
	
	byteArray = AS3_CallS("fileWriteSharedObject", _swfMain, params);
	AS3_Release(params);

	//This opens a file for writing on a ByteArray, as explained in http://blog.debit.nl/?p=79
	//It does NOT reset its length to 0, so this must already have been done.
	ret = funopen((void *)byteArray, readByteArray, writeByteArray, seekByteArray, closeByteArray);
	
	return ret;
}

void as3UpdateFileSharedObject(const char* filename)
{
	AS3_Val params = AS3_Array("AS3ValType", AS3_String(filename));

	AS3_CallS("fileUpdateSharedObject", _swfMain, params);

	AS3_Release(params);
}

void as3ReadFileSharedObject(const char* filename)
{
	AS3_Val params = AS3_Array("AS3ValType", AS3_String(filename));

	AS3_CallS("fileReadSharedObject", _swfMain, params);

	AS3_Release(params);
}

int swcQuakeInit (int argc, char **argv);

AS3_Val swcInit(void *data, AS3_Val args)
{
	int argc;
	char *argv;

	//Save the byte array, which will be read in COM_InitFilesystem
	AS3_ArrayValue(args, "AS3ValType", &_swfMain);

	//Launch the quake init routines all the way until before the main loop
	argc = 1;
	argv = "";
	swcQuakeInit(argc, &argv);

	//Return the ByteArray object representing all of the C++ ram - used to render the bitmap
	return AS3_Ram();
}

AS3_Val swcFrame(void *data, AS3_Val args)
{
	AS3_ArrayValue(args, "DoubleType", &_as3Time);	//This will allow Sys_FloatTime() to work

	if(!_oldtime)
		_oldtime = Sys_FloatTime ();

	{//Copied from the loop from the linux main function

		double		time, newtime;

// find time spent rendering last frame
        newtime = Sys_FloatTime ();
        time = newtime - _oldtime;

        if (time > sys_ticrate.value*2)
            _oldtime = newtime;
        else
            _oldtime += time;

        Host_Frame (time);
    }

	//Return the position of the screen buffer in the Alchemy ByteArray of memory 
	extern unsigned _vidBuffer4b[];
	return AS3_Ptr(_vidBuffer4b);
}

extern AS3_Val _flashSampleData;
extern int soundtime;
void S_Update_();

AS3_Val swcWriteSoundData(void *data, AS3_Val args)
{
	int soundDeltaT;

	AS3_ArrayValue(args, "AS3ValType,IntType", &_flashSampleData, &soundDeltaT);
	soundtime += soundDeltaT;
	S_Update_();
	
	return NULL;
}

AS3_Val swcKey(void *data, AS3_Val args)
{
	int key, charCode, state;

	AS3_ArrayValue(args, "IntType,IntType,IntType", &key, &charCode, &state);

	extern byte _asToQKey[256];
	if(_asToQKey[key])
	{
		//Modifier, Fkey, or special keys for example, so we need to look up its Quake code
		Key_Event(_asToQKey[key], state);
	}
	else
	{
		//For most keys, the Quake code is the same as the char code
		Key_Event(charCode, state);
	}

	return NULL;
}

extern float mouse_x, mouse_y;
AS3_Val swcDeltaMouse(void *data, AS3_Val args)
{
	int deltaX, deltaY;
	AS3_ArrayValue(args, "IntType,IntType", &deltaX, &deltaY);

	mouse_x = deltaX;
	mouse_y = deltaY;

	return NULL;
}

int main (int c_, char **v_)
{
	int i;
	AS3_Val swcEntries[] = 
	{
		AS3_Function(NULL, swcInit),
		AS3_Function(NULL, swcFrame),		
		AS3_Function(NULL, swcKey),
		AS3_Function(NULL, swcDeltaMouse),
		AS3_Function(NULL, swcWriteSoundData)
	};

	// construct an object that holds refereces to the functions
	AS3_Val result = AS3_Object(
		"swcInit:AS3ValType,swcFrame:AS3ValType,swcKey:AS3ValType,swcDeltaMouse:AS3ValType,swcWriteSoundData:AS3ValType",
		swcEntries[0],
		swcEntries[1],
		swcEntries[2],
		swcEntries[3],
		swcEntries[4]);

	for(i = 0; i < sizeof(swcEntries)/sizeof(swcEntries[0]); i++)
		AS3_Release(swcEntries[i]);
	
	// notify that we initialized -- THIS DOES NOT RETURN!
	AS3_LibInit(result);
}

int swcQuakeInit (int argc, char **argv)
#else
unsigned * getFrameBuffer(void){
	extern unsigned _vidBuffer4b[];
        return _vidBuffer4b;
}

char out_buf[320*200*3];
#ifdef NODE
#include <emscripten.h>
#endif
// int main (int argc, char **argv)
int main (void)
#endif
{
#ifdef NODE
printf("hello world\n");
EM_ASM(
  FS.mkdir('id1');
  FS.mount(NODEFS, { root: 'id1' }, 'id1');
);
#endif
real_main();
my_mainloop();
return 0;
}

int real_main(void){
//printf("got here\n");
//Sys_Error("blah blah\n");
int argc=1;
char *argv[1];
argv[0]="quake";
        int i;
	static quakeparms_t    parms;

	parms.memsize = 8*1024*1024;
printf("The mem size %d\n", parms.memsize);
//fflush(stdout);
	parms.membase = malloc (parms.memsize);
printf("The mem size %d\n", parms.memsize);
//fflush(stdout);
	parms.basedir = ".";

printf("argc: %d\n",argc);
	COM_InitArgv (argc, argv);

	parms.argc = com_argc;
	parms.argv = com_argv;

	printf ("Host_Init\n");
	printf ("parms.argc %d\n",parms.argc);
	printf ("parms.argv %s\n",parms.argv[0]);
	printf ("parms.memsize %d\n",parms.memsize);
	printf ("parms.membase %u\n",parms.membase);
	printf ("parms.basedir %s\n",parms.basedir);

	Host_Init (&parms);

/*
int j=0;
while(1){
Host_Frame (0.1);
j++;
printf("%d\n",j);
}
*/



	return 0;
}

int my_mainloop(){
#ifdef NATIVE
	while (1){
          my_doframe(100);
	}
#endif
}

int my_doframe(int t){

int i;
	Host_Frame ((double)t/1000.0);
/*
        FILE* foo;
        char * in_buf;
        in_buf=(char *)getFrameBuffer();
        for(i=0;i<320*200;i++){
             out_buf[i*3]=in_buf[i*4+2];
             out_buf[i*3+1]=in_buf[i*4+1];
             out_buf[i*3+2]=in_buf[i*4];

        }
        foo=fopen("/dev/shm/frame","wb");
        fprintf(foo,"P6\n320 200\n255\n");
        fwrite((void *)out_buf,320*200*3,1,foo);
        fclose(foo);
*/
}
void *ljw_stderr;
void *ljw_stdout;

void ljw_setup2(void *a,void *b){
ljw_stderr=fopen("stderr.txt","wb");
ljw_stdout=fopen("stdout.txt","wb");
printf("ljw setup2 called\n");
}


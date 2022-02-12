print("Run the quake1 engine");
print("you need the engine source in ../quake1_src and id1 pak files in ../quake1_data/id1 (relative to the root of mishmashvm)");

mm.reserve_stack(800000);

quake1_src="../quake1_src";
quake1_data="../quake1_data";

print("unfinished might not work yet");

load("lib/gen_wrap.js");
load("lib/setup_sdl.js");
my_libc=mm.load_c_string(read(test_path+"/my_libc.c"));
stubs=mm.load_c_string(read(test_path+"/stubs.c"));

libtcc1=mm.load_c_string(read("tcc_src/lib/libtcc1.c"));

my_sdl=mm.load_c_string(read(test_path+"/sdl.c"));

my_wrap=my_libc;

overrides=[
["ljw_crash___errno_location","__errno_location"],["ljw_crash_longjmp","longjmp"],["ljw_crash__setjmp","_setjmp"],["ljw_open","open"],["ljw_fopen","fopen"],["ljw_unlink","unlink"],["ljw_remove","remove"],["ljw_getcwd","getcwd"],["ljw_read","read"],["ljw_close","close"],["ljw_fdopen","fdopen"],["fclose","fclose"],["ljw_crash_fread","fread"],["fwrite","fwrite"],
["fflush","fflush"],
["fputc","fputc"],["ljw_crash_fputs","fputs"],["ljw_crash_fseek","fseek"],["ljw_crash_ftell","ftell"],
["fprintf","fprintf"],
["sscanf","sscanf"],["ljw_crash_lseek","lseek"],
["ljw_stderr","stderr"],
["ljw_stdout","stdout"],
["ljw_crash_dlopen","dlopen"],["ljw_crash_dlclose","dlclose"],["ljw_crash_dlsym","dlsym"],["ljw_execvp","execvp"],["exit","exit"],["ljw_getenv","getenv"],["ljw_malloc","malloc"],["memcmp","memcmp"],["memcpy","memcpy"],["memmove","memmove"],["memset","memset"],["ljw_realloc","realloc"],["ljw_free","free"],["ljw_mprotect","mprotect"],["printf","printf"],["snprintf","snprintf"],["sprintf","sprintf"],["ljw_crash_vfprintf","vfprintf"],
["vsnprintf","vsnprintf"],
["ljw_crash_sigaction","sigaction"],["ljw_crash_sigemptyset","sigemptyset"],["ljw_crash_strcat","strcat"],["strchr","strchr"],["strcmp","strcmp"],["strcpy","strcpy"],["strlen","strlen"],["ljw_crash_strncmp","strncmp"],["strrchr","strrchr"],["ljw_crash_strstr","strstr"],["strtod","strtod"],["ljw_crash_strtof","strtof"],["ljw_crash_strtol","strtol"],["ljw_crash_strtold","strtold"],["ljw_crash_strtoll","strtoll"],["ljw_crash_strtoul","strtoul"],
["strtoull","strtoull"],
["ljw_crash_time","time"],["ljw_crash_gettimeofday","gettimeofday"],["ljw_crash_localtime","localtime"],["ljw_crash_ldexp","ldexp"],["qsort","qsort"],["atoi","atoi"],
["vprintf","vprintf"],

["memset","memset"],
["atan","atan"],
["fclose","fclose"],
["fwrite","fwrite"],
["ljw_crash_fflush_crash","fflush"],
["fread","fread"],
["ljw_crash_strstr_crash","strstr"],
["ljw_crash_atoi_crash","atoi"],
["sprintf","sprintf"],
["fopen","fopen"],
["fprintf","fprintf"],
["strcpy","strcpy"],
["memmove","memmove"],
["rand","rand"],
["memcpy","memcpy"],
["strncpy","strncpy"],
["ljw_crash_atan2_crash","atan2"],
["sqrt","sqrt"],
["strlen","strlen"],
["strcmp","strcmp"],
["strcat","strcat"],
["vsprintf","vsprintf"],
["fseek","fseek"],
["strchr","strchr"],
["ljw_crash_unlink_crash","unlink"],
["ljw_crash_open_crash","open"],
["ljw_crash_write_crash","write"],
["ljw_crash_close_crash","close"],
["ceil","ceil"],
["printf","printf"],
["ljw_crash_longjmp_crash","longjmp"],
["ljw_crash__setjmp_crash","_setjmp"],
["malloc","malloc"],
["ljw_crash___isoc99_fscanf_crash","__isoc99_fscanf"],
["ljw_crash_feof_crash","feof"],
["ljw_crash_fgetc_crash","fgetc"],
["fabs","fabs"],
["cos","cos"],
["sin","sin"],
["floor","floor"],
["ljw_crash_strncmp_crash","strncmp"],
["ljw_crash_inet_ntoa_crash","inet_ntoa"],
["ljw_crash_inet_addr_crash","inet_addr"],
["ljw_crash_atof_crash","atof"],
["tan","tan"],
["ljw_crash_abs_crash","abs"],
["ftell","ftell"],
["ljw_crash___errno_location_crash","__errno_location"],
["ljw_crash_strerror_crash","strerror"],
["puts","puts"],
["ljw_crash_stdout_crash","stdout"],
["vprintf","vprintf"],
["exit","exit"],
["pow","pow"],
];

if(plat=="linux32"){
overrides.push( ["_IO_getc","_IO_getc"]);
};

if(plat=="win32"){
overrides.push( ["getc","_IO_getc"]);
};

my_wrap=mm.gen_wrap(my_libc,stubs,overrides);

quake_objs=["cd_null.c","chase.c","cl_demo.c","cl_input.c","cl_main.c","cl_parse.c","cl_tent.c","cmd.c","common.c","console.c","crc.c","cvar.c","d_edge.c","d_fill.c","d_init.c","d_modech.c","d_part.c","d_polyse.c","d_scan.c","d_sky.c","d_sprite.c","d_surf.c","d_vars.c","d_zpoint.c","draw.c","host.c","host_cmd.c","in_null.c","keys.c","mathlib.c","menu.c","model.c","net_dgrm.c","net_loop.c","net_main.c","net_none.c","net_vcr.c","nonintel.c","pr_cmds.c","pr_edict.c","pr_exec.c","r_aclip.c","r_alias.c","r_bsp.c","r_draw.c","r_edge.c","r_efrag.c","r_light.c","r_main.c","r_misc.c","r_part.c","r_sky.c","r_sprite.c","r_surf.c","r_vars.c","sbar.c","screen.c","snd_dma.c","snd_mem.c","snd_mix.c","sv_main.c","sv_move.c","sv_phys.c","sv_user.c","sys_null.c","vid_null.c","view.c","wad.c","world.c","zone.c"];

quake_objs=quake_objs.map(function(x){
  print(x);
  return mm.load_c_string(read(quake1_src+"/"+x),{extra_flags:"-I "+quake1_src+" -DNO_ASM -DNATIVE"});
});


quake_objs.push(my_sdl);
quake_objs.push(libtcc1);
quake_objs.push(my_wrap);
quake_objs.push(libsdl.syms);

quake=mm.link(quake_objs);

// I think "run" is the wrong name. "declare" would be more appropriate

init_sdl=quake.run("init_sdl");
quake_init=quake.run("real_main");
set_sdl_buf_raw=quake.run("set_sdl_buf_raw");
getFrameBuffer=quake.run("getFrameBuffer");
frame=quake.run("my_doframe");
my_sdl_main=quake.run("my_sdl_main");

libc.chdir("../quake1_data/");

print("If you get a Sys_Error about missing files that probably means you are missing the quake id1 pak files in ../quake1_data/id1 (relative to the root of mishmashvm). You can get the files from the shareware version of Quake 1.");

init_sdl();
quake_init();
set_sdl_buf_raw(getFrameBuffer());
var st=Date.now();

while(1){
cur=Date.now();
frame(cur-st);
my_sdl_main(1);
st=cur;
}

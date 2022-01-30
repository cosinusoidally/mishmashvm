n=[
["ljw_crash","__errno_location"],

["ljw_crash","longjmp"],
["ljw_crash","_setjmp"],

["ljw_open","open"],
["ljw_fopen","fopen"],
["ljw_unlink","unlink"],
["ljw_remove","remove"],
["ljw_getcwd","getcwd"],

["ljw_read","read"],
["ljw_close","close"],
["ljw_fdopen","fdopen"],
["fclose","fclose"],
["ljw_crash","fread"],
["fwrite","fwrite"],
["ljw_crash","fflush"],
["fputc","fputc"],
["ljw_crash","fputs"],
["ljw_crash","fseek"],
["ljw_crash","ftell"],
["ljw_crash","fprintf"],
["sscanf","sscanf"],
["ljw_crash","lseek"],

["ljw_stderr","stderr"],
["ljw_stdout","stdout"],

["ljw_crash","dlopen"],
["ljw_crash","dlclose"],
["ljw_crash","dlsym"],

["ljw_execvp","execvp"],
["exit","exit"],
["ljw_getenv","getenv"],

["ljw_malloc","malloc"],
["memcmp", "memcmp"],
["memcpy", "memcpy"],
["memmove", "memmove"],
["memset", "memset"],
["ljw_realloc","realloc"],
["ljw_free","free"],

["ljw_mprotect","mprotect"],

["printf", "printf"],
["snprintf","snprintf"],
["sprintf","sprintf"],
["ljw_crash","vfprintf"], // note this *is* a file thing but not called
["ljw_crash","vsnprintf"],

["ljw_crash","sigaction"],
["ljw_crash","sigemptyset"],

["ljw_crash","strcat"],
["strchr","strchr"],
["strcmp","strcmp"],
["strcpy","strcpy"],
["strlen","strlen"],
["ljw_crash","strncmp"],
["strrchr","strrchr"],
["ljw_crash","strstr"],
["strtod","strtod"],
["ljw_crash","strtof"],
["ljw_crash","strtol"],
["ljw_crash","strtold"],
["ljw_crash","strtoll"],
["ljw_crash","strtoul"],
["ljw_crash","strtoull"],

["ljw_crash","time"],
["ljw_crash","gettimeofday"],
["ljw_crash","localtime"],

["ljw_crash","ldexp"],
["qsort","qsort"],
["atoi","atoi"],
].map(function(x){
if(x[0]==="ljw_crash"){
print("void "+x[0]+"_"+x[1]+"(){");
print('printf(\"'+x[0]+'_'+x[1]+ ' missing\\n\");');
print("exit(1);");
print("}");
print();
return[x[0]+"_"+x[1],x[1]];
}
return x;
});
//print(JSON.stringify(n));

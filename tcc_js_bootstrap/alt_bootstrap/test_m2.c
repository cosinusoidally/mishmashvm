int k=200;

int foo(int i){
  return i+k;
}

int bar(){
  return foo(3);
}

int main(){
  return foo(1);
}

int test3=0;

int test4(){
  asm(
    "DEFINE push_ecx 51"
    "DEFINE push_edx 52"
    "DEFINE push_esi 56"
    "DEFINE pop_esi 5E"
    "DEFINE pop_edx 5A"
    "DEFINE pop_ecx 59"
    ":syscall_js_callback"
    "push_ebp"
    "push_edi"
    "push_esi"
    "push_edx"
    "push_ecx"
    "push_ebx"
    "push_eax"
    "lea_eax,[esp+DWORD] %0"
    "push_eax"
    "mov_eax, &GLOBAL_test3"
    "mov_eax,[eax]"
    "call_eax"
    "pop_eax"
    "pop_eax"
    "pop_ebx"
    "pop_ecx"
    "pop_edx"
    "pop_esi"
    "pop_edi"
    "pop_ebp"
    "ret"
  );
}

void exit(int value)
{
        asm("lea_eax,[esp+DWORD] %4"
            "mov_eax,[eax]"
            "push_eax"
            "pop_ebx"
            "mov_eax, %1"
            "jmp %syscall_js_callback");
}

void f2(){
  exit(99);
}

void f1(){
  f2();
}

int stdout=1;

void fputc(char s, int f)
{
        asm("mov_eax, %4"
            "lea_ebx,[esp+DWORD] %4"
            "mov_ebx,[ebx]"
            "lea_ecx,[esp+DWORD] %8"
            "mov_edx, %1"
            "jmp %syscall_js_callback");
}

int putchar(int c){
  fputc(c,stdout);
  return 0;
}

int save_esp=0;
int save_eax=0;

int test2(){
  asm("push_ebx"
      "push_esi"
      "push_ebp"
      "push_eax"
      "push_ebx"
      "lea_eax,[esp+DWORD] %8"
      "mov_ebx, &GLOBAL_save_esp"
      "mov_[ebx],eax"
      "pop_ebx"
      "pop_eax"
  );
  putchar(72);
  f1();
  return 0;
  asm(":exit_return"
      "push_ebx"
      "mov_ebx, &GLOBAL_save_eax"
      "mov_[ebx],eax"
      "pop_ebx"
      "mov_eax, &GLOBAL_save_esp"
      "mov_eax,[eax]"
      "DEFINE mov_esp,eax 89C4"
      "mov_esp,eax"
      "mov_eax, &GLOBAL_save_eax"
      "mov_eax,[eax]"
      "pop_ebp"
      "pop_esi"
      "pop_ebx"
      "ret"
  );
}

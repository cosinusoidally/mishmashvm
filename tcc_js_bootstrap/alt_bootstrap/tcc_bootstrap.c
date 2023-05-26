// This is a modified version of the preprocessed tcc source code
// bound by the same license as the copy of tcc in tcc_js_bootstrap/tcc_src/ .
// Modifications (C) 2022-2023 Liam Wilson and licensed under the LGPL v2.1
// (a copy of which exists under tcc_src/COPYING). Preceding paths are relative
// to the root of this project.
typedef unsigned int size_t;
typedef int ssize_t;
typedef int wchar_t;
typedef int ptrdiff_t;
typedef int intptr_t;
typedef signed char int8_t;
typedef signed short int int16_t;
typedef signed int int32_t;
typedef signed long long int int64_t;
typedef unsigned char uint8_t;
typedef unsigned short int uint16_t;
typedef unsigned int uint32_t;
typedef unsigned long long int uint64_t;
typedef unsigned char __u_char;
typedef unsigned short int __u_short;
typedef unsigned int __u_int;
typedef unsigned long int __u_long;
typedef signed char __int8_t;
typedef unsigned char __uint8_t;
typedef signed short int __int16_t;
typedef unsigned short int __uint16_t;
typedef signed int __int32_t;
typedef unsigned int __uint32_t;
typedef signed long long int __int64_t;
typedef unsigned long long int __uint64_t;
typedef long int __time_t;
typedef int __ssize_t;
typedef __ssize_t ssize_t;
typedef __time_t time_t;
typedef __int8_t int8_t;
typedef __int16_t int16_t;
typedef __int32_t int32_t;
typedef __int64_t int64_t;
typedef int (*__compar_fn_t) (const void *, const void *);
typedef __compar_fn_t comparison_fn_t;
typedef int (*__compar_d_fn_t) (const void *, const void *, void *);
typedef struct _IO_FILE FILE;
typedef char *va_list;
typedef va_list __gnuc_va_list;
typedef __uint8_t uint8_t;
typedef __uint16_t uint16_t;
typedef __uint32_t uint32_t;
typedef __uint64_t uint64_t;

// ELF stuff

typedef uint16_t Elf32_Half;
typedef uint32_t Elf32_Word;
typedef uint32_t Elf32_Addr;
typedef uint32_t Elf32_Off;
typedef uint16_t Elf32_Section;
typedef struct {
  unsigned char	e_ident[(16)];
  Elf32_Half	e_type;
  Elf32_Half	e_machine;
  Elf32_Word	e_version;
  Elf32_Addr	e_entry;
  Elf32_Off	e_phoff;
  Elf32_Off	e_shoff;
  Elf32_Word	e_flags;
  Elf32_Half	e_ehsize;
  Elf32_Half	e_phentsize;
  Elf32_Half	e_phnum;
  Elf32_Half	e_shentsize;
  Elf32_Half	e_shnum;
  Elf32_Half	e_shstrndx;
} Elf32_Ehdr;
typedef struct {
  Elf32_Word	sh_name;
  Elf32_Word	sh_type;
  Elf32_Word	sh_flags;
  Elf32_Addr	sh_addr;
  Elf32_Off	sh_offset;
  Elf32_Word	sh_size;
  Elf32_Word	sh_link;
  Elf32_Word	sh_info;
  Elf32_Word	sh_addralign;
  Elf32_Word	sh_entsize;
} Elf32_Shdr;
typedef struct {
  Elf32_Word	st_name;
  Elf32_Addr	st_value;
  Elf32_Word	st_size;
  unsigned char	st_info;
  unsigned char	st_other;
  Elf32_Section	st_shndx;
} Elf32_Sym;
typedef struct {
  Elf32_Addr	r_offset;
  Elf32_Word	r_info;
} Elf32_Rel;
typedef struct {
  Elf32_Word	p_type;
  Elf32_Off	p_offset;
  Elf32_Addr	p_vaddr;
  Elf32_Addr	p_paddr;
  Elf32_Word	p_filesz;
  Elf32_Word	p_memsz;
  Elf32_Word	p_flags;
  Elf32_Word	p_align;
} Elf32_Phdr;
enum {
    TREG_EAX = 0,
    TREG_ECX,
    TREG_EDX,
    TREG_EBX,
    TREG_ST0,
    TREG_ESP = 4
};

// note we can't really use this NULL definition as it causes a bunch of
// compiler warns complaining about converting from an int to pointer
const int NULL = 0;

extern double strtod (const char * __nptr,
		      char ** __endptr);
extern float strtof (const char * __nptr,
		     char ** __endptr);
extern long double strtold (const char * __nptr,
			    char ** __endptr);
extern unsigned long int strtoul (const char * __nptr,
				  char ** __endptr, int __base);
extern void *malloc (size_t __size);
extern void *realloc (void *__ptr, size_t __size);
extern void free (void *__ptr);
extern void exit (int __status);
extern void qsort (void *__base, size_t __nmemb, size_t __size,
		   __compar_fn_t __compar);
extern struct _IO_FILE *stdin;
extern struct _IO_FILE *stdout;
extern struct _IO_FILE *stderr;
extern int fclose (FILE *__stream);
extern int fflush (FILE *__stream);
extern FILE *fopen (const char * __filename,
		    const char * __modes);
extern int fprintf (FILE * __stream,
		    const char * __format, ...);
extern int printf (const char * __format, ...);
extern int sprintf (char * __s,
		    const char * __format, ...);
extern int snprintf (char * __s, size_t __maxlen,
		     const char * __format, ...);
extern int vsnprintf (char * __s, size_t __maxlen,
		      const char * __format, __gnuc_va_list __arg);
extern int fputc (int __c, FILE *__stream);
extern int fputs (const char * __s, FILE * __stream);
extern int puts (const char *__s);
extern size_t fwrite (const void * __ptr, size_t __size,
		      size_t __n, FILE * __s);
extern void *memcpy (void * __dest, const void * __src,
		     size_t __n);
extern void *memmove (void *__dest, const void *__src, size_t __n);
extern void *memset (void *__s, int __c, size_t __n);
extern int memcmp (const void *__s1, const void *__s2, size_t __n);
extern char *strcpy (char * __dest, const char * __src);
extern int strcmp (const char *__s1, const char *__s2);
extern char *strchr (const char *__s, int __c);
extern char *strrchr (const char *__s, int __c);
extern size_t strlen (const char *__s);
extern int *__errno_location (void);
extern int open (const char *__file, int __oflag, ...) ;
extern int unlink (const char *__name)  ;
extern float strtof (const char *__nptr, char **__endptr);
extern long double strtold (const char *__nptr, char **__endptr);

// START TCC code

struct TCCState;
typedef struct TCCState TCCState;
typedef struct TokenSym {
    struct TokenSym *hash_next;
    struct Sym *sym_define;
    struct Sym *sym_label;
    struct Sym *sym_struct;
    struct Sym *sym_identifier;
    int tok;
    int len;
    char str[1];
} TokenSym;
typedef int nwchar_t;
typedef struct CString {
    int size;
    void *data;
    int size_allocated;
} CString;
typedef struct CType {
    int t;
    struct Sym *ref;
} CType;
typedef union CValue {
    long double ld;
    double d;
    float f;
    uint64_t i;
    struct {
        int size;
        const void *data;
    } str;
    int tab[12/4];
} CValue;
typedef struct SValue {
    CType type;
    unsigned short r;
    unsigned short r2;
    CValue c;
    struct Sym *sym;
} SValue;
struct SymAttr {
    unsigned short
    aligned     : 5,
    packed      : 1,
    weak        : 1,
    visibility  : 2,
    dllexport   : 1,
    dllimport   : 1,
    unused      : 5;
};
struct FuncAttr {
    unsigned
    func_call   : 3,
    func_type   : 2,
    func_args   : 8;
};
typedef struct AttributeDef {
    struct SymAttr a;
    struct FuncAttr f;
    struct Section *section;
    int alias_target;
    int asm_label;
    char attr_mode;
} AttributeDef;
typedef struct Sym {
    int v;
    unsigned short r;
    struct SymAttr a;
    union {
        struct {
            int c;
            union {
                int sym_scope;
                int jnext;
                struct FuncAttr f;
                int auxtype;
            };
        };
        long long enum_val;
        int *d;
    };
    CType type;
    union {
        struct Sym *next;
        int asm_label;
    };
    struct Sym *prev;
    struct Sym *prev_tok;
} Sym;
typedef struct Section {
    unsigned long data_offset;
    unsigned char *data;
    unsigned long data_allocated;
    int sh_name;
    int sh_num;
    int sh_type;
    int sh_flags;
    int sh_info;
    int sh_addralign;
    int sh_entsize;
    unsigned long sh_size;
    Elf32_Addr sh_addr;
    unsigned long sh_offset;
    int nb_hashed_syms;
    struct Section *link;
    struct Section *reloc;
    struct Section *hash;
    struct Section *prev;
    char name[1];
} Section;
typedef struct BufferedFile {
    uint8_t *buf_ptr;
    uint8_t *buf_end;
    int fd;
    struct BufferedFile *prev;
    int line_num;
    int line_ref;
    int ifndef_macro;
    int ifndef_macro_saved;
    int *ifdef_stack_ptr;
    int include_next_index;
    char filename[1024];
    char *true_filename;
    unsigned char unget[4];
    unsigned char buffer[1];
} BufferedFile;

typedef struct TokenString {
    int *str;
    int len;
    int lastlen;
    int allocated_len;
    int last_line_num;
    int save_line_num;

    struct TokenString *prev;
    const int *prev_ptr;
    char alloc;
} TokenString;

typedef struct InlineFunc {
    TokenString *func_str;
    Sym *sym;
    char filename[1];
} InlineFunc;

typedef struct CachedInclude {
    int ifndef_macro;
    int once;
    int hash_next;
    char filename[1];
} CachedInclude;


struct sym_attr {
    unsigned got_offset;
    unsigned plt_offset;
    int plt_sym;
    int dyn_index;
};

struct TCCState {
    int alacarte_link;
    int output_type;
    int output_format;
    int leading_underscore;
    int dollars_in_identifiers;
    int warn_write_strings;
    int warn_unsupported;
    int warn_error;
    int warn_none;
    int warn_implicit_function_declaration;
    int warn_gcc_compat;
    Elf32_Addr text_addr;
    int has_text_addr;
    unsigned section_align;
    int seg_size;
    char **include_paths;
    int nb_include_paths;
    char **cmd_include_files;
    int nb_cmd_include_files;
    void *error_opaque;
    void (*error_func)(void *opaque, const char *msg);
    int nb_errors;
    FILE *ppfp;
    enum {
	LINE_MACRO_OUTPUT_FORMAT_GCC,
	LINE_MACRO_OUTPUT_FORMAT_NONE,
	LINE_MACRO_OUTPUT_FORMAT_STD,
    LINE_MACRO_OUTPUT_FORMAT_P10 = 11
    } Pflag;
    char dflag;
    char **target_deps;
    int nb_target_deps;
    BufferedFile *include_stack[32];
    BufferedFile **include_stack_ptr;
    int ifdef_stack[64];
    int *ifdef_stack_ptr;
    int cached_includes_hash[32];
    CachedInclude **cached_includes;
    int nb_cached_includes;
    int pack_stack[8];
    int *pack_stack_ptr;
    struct InlineFunc **inline_fns;
    int nb_inline_fns;
    Section **sections;
    int nb_sections;
    Section **priv_sections;
    int nb_priv_sections;
    Section *dynsymtab_section;
    Section *symtab;
    struct sym_attr *sym_attrs;
    int nb_sym_attrs;
    struct filespec **files;
    int nb_files;
    int nb_libraries;
    int filetype;
    char *outfile;
    int argc;
    char **argv;
};

struct filespec {
    char type;
    char alacarte;
    char name[1];
};

enum tcc_token {
    TOK_LAST = 256 - 1

     ,TOK_INT
     ,TOK_VOID
     ,TOK_CHAR
     ,TOK_IF
     ,TOK_ELSE
     ,TOK_WHILE
     ,TOK_BREAK
     ,TOK_RETURN
     ,TOK_FOR
     ,TOK_EXTERN
     ,TOK_STATIC
     ,TOK_UNSIGNED
     ,TOK_GOTO
     ,TOK_DO
     ,TOK_CONTINUE
     ,TOK_SWITCH
     ,TOK_CASE

     ,TOK_CONST1
     ,TOK_CONST2
     ,TOK_CONST3
     ,TOK_VOLATILE1
     ,TOK_VOLATILE2
     ,TOK_VOLATILE3
     ,TOK_LONG
     ,TOK_REGISTER
     ,TOK_SIGNED1
     ,TOK_SIGNED2
     ,TOK_SIGNED3
     ,TOK_AUTO
     ,TOK_INLINE1
     ,TOK_INLINE2
     ,TOK_INLINE3
     ,TOK_RESTRICT1
     ,TOK_RESTRICT2
     ,TOK_RESTRICT3
     ,TOK_EXTENSION

     ,TOK_GENERIC

     ,TOK_FLOAT
     ,TOK_DOUBLE
     ,TOK_BOOL
     ,TOK_SHORT
     ,TOK_STRUCT
     ,TOK_UNION
     ,TOK_TYPEDEF
     ,TOK_DEFAULT
     ,TOK_ENUM
     ,TOK_SIZEOF
     ,TOK_ATTRIBUTE1
     ,TOK_ATTRIBUTE2
     ,TOK_ALIGNOF1
     ,TOK_ALIGNOF2
     ,TOK_TYPEOF1
     ,TOK_TYPEOF2
     ,TOK_TYPEOF3
     ,TOK_LABEL
     ,TOK_ASM1
     ,TOK_ASM2
     ,TOK_ASM3
     ,TOK_DEFINE
     ,TOK_INCLUDE
     ,TOK_INCLUDE_NEXT
     ,TOK_IFDEF
     ,TOK_IFNDEF
     ,TOK_ELIF
     ,TOK_ENDIF
     ,TOK_DEFINED
     ,TOK_UNDEF
     ,TOK_ERROR
     ,TOK_WARNING
     ,TOK_LINE
     ,TOK_PRAGMA
     ,TOK___LINE__
     ,TOK___FILE__
     ,TOK___DATE__
     ,TOK___TIME__
     ,TOK___FUNCTION__
     ,TOK___VA_ARGS__
     ,TOK___COUNTER__

     ,TOK___FUNC__

     ,TOK___NAN__
     ,TOK___SNAN__
     ,TOK___INF__

     ,TOK_SECTION1
     ,TOK_SECTION2
     ,TOK_ALIGNED1
     ,TOK_ALIGNED2
     ,TOK_PACKED1
     ,TOK_PACKED2
     ,TOK_WEAK1
     ,TOK_WEAK2
     ,TOK_ALIAS1
     ,TOK_ALIAS2
     ,TOK_UNUSED1
     ,TOK_UNUSED2
     ,TOK_CDECL1
     ,TOK_CDECL2
     ,TOK_CDECL3
     ,TOK_STDCALL1
     ,TOK_STDCALL2
     ,TOK_STDCALL3
     ,TOK_FASTCALL1
     ,TOK_FASTCALL2
     ,TOK_FASTCALL3
     ,TOK_REGPARM1
     ,TOK_REGPARM2

     ,TOK_MODE
     ,TOK_MODE_QI
     ,TOK_MODE_DI
     ,TOK_MODE_HI
     ,TOK_MODE_SI
     ,TOK_MODE_word

     ,TOK_DLLEXPORT
     ,TOK_DLLIMPORT
     ,TOK_NORETURN1
     ,TOK_NORETURN2
     ,TOK_VISIBILITY1
     ,TOK_VISIBILITY2

     ,TOK_builtin_types_compatible_p
     ,TOK_builtin_choose_expr
     ,TOK_builtin_constant_p
     ,TOK_builtin_frame_address
     ,TOK_builtin_return_address
     ,TOK_builtin_expect
     ,TOK_pack

     ,TOK_comment
     ,TOK_lib
     ,TOK_push_macro
     ,TOK_pop_macro
     ,TOK_once
     ,TOK_option

     ,TOK_memcpy
     ,TOK_memmove
     ,TOK_memset
     ,TOK___divdi3
     ,TOK___moddi3
     ,TOK___udivdi3
     ,TOK___umoddi3
     ,TOK___ashrdi3
     ,TOK___lshrdi3
     ,TOK___ashldi3
     ,TOK___floatundisf
     ,TOK___floatundidf

     ,TOK___floatundixf
     ,TOK___fixunsxfdi

     ,TOK___fixunssfdi
     ,TOK___fixunsdfdi
};

const int TOK_HASH_INIT = 1;
const int TOK_HASH_SIZE = 16384;
unsigned int TOK_HASH_FUNC(unsigned int h,unsigned int c) {
    return ((h) + ((h) << 5) + ((h) >> 27) + (c));
}

const int CACHED_INCLUDES_HASH_SIZE = 32;

enum VTS {
    VT_CMP = 0x0033,
    VT_CONST = 0x0030,
    VT_INT = 3,
    VT_BTYPE = 0x000f,
    VT_STRUCT = 7,
    VT_FUNC = 6,
    VT_STATIC = 0x00002000,
    VT_LOCAL = 0x0032,
    VT_VOID = 0,
    VT_EXTERN = 0x00001000,
    VT_INLINE = 0x00008000,
    VT_TYPEDEF = 0x00004000,
    VT_STORAGE = (VT_EXTERN | VT_STATIC | VT_TYPEDEF | VT_INLINE),
    VT_ARRAY = 0x0040,
    VT_VLA = 0x0400,
    VT_BYTE = 1,
    VT_UNSIGNED = 0x0010,
    VT_SHORT = 2,
    VT_LONG = 0x0800,
    VT_DOUBLE = 9,
    VT_LLONG = 4,
    VT_BOOL = 11,
    VT_FLOAT = 8,
    VT_LDOUBLE = 10,
    VT_STRUCT_SHIFT = 20,
    VT_ENUM = (2 << VT_STRUCT_SHIFT),
    VT_UNION = (1 << VT_STRUCT_SHIFT | VT_STRUCT),
    VT_CONSTANT = 0x0100,
    VT_VOLATILE = 0x0200,
    VT_DEFSIGN = 0x0020,
    VT_VALMASK = 0x003f,
    VT_LVAL = 0x0100,
};

enum TOKS {
    TOK_ULT=0x92,
    TOK_UGE=0x93,
    TOK_EQ =0x94,
    TOK_NE =0x95,
    TOK_ULE=0x96,
    TOK_UGT=0x97,
    TOK_Nset=0x98,
    TOK_Nclear=0x99,
    TOK_LT =0x9c,
    TOK_GE =0x9d,
    TOK_LE =0x9e,
    TOK_GT =0x9f,
    TOK_LAND =0xa0,
    TOK_LOR  =0xa1,
    TOK_DEC  =0xa2,
    TOK_MID  =0xa3, /* inc/dec, to void constant */
    TOK_INC  =0xa4,
    TOK_UDIV =0xb0, /* unsigned division */
    TOK_UMOD =0xb1, /* unsigned modulo */
    TOK_PDIV =0xb2, /* fast division with undefined rounding for pointers */
    TOK_CCHAR = 0xb3, /* char constant in tokc */
    TOK_LCHAR = 0xb4,
    TOK_CINT  = 0xb5, /* number in tokc */
    TOK_CUINT = 0xb6, /* unsigned int constant */
    TOK_CLLONG= 0xb7, /* long long constant */
    TOK_CULLONG=0xb8, /* unsigned long long constant */
    TOK_STR    =0xb9, /* pointer to string in tokc */
    TOK_LSTR   =0xba,
    TOK_CFLOAT =0xbb, /* float constant */
    TOK_CDOUBLE=0xbc, /* double constant */
    TOK_CLDOUBLE=0xbd, /* long double constant */
    TOK_PPNUM  =0xbe, /* preprocessor number */
    TOK_PPSTR  =0xbf, /* preprocessor string */
    TOK_LINENUM=0xc0, /* line number info */
    TOK_TWODOTS=0xa8, /* C++ token ? */
    TOK_UMULL  = 0xc2, /* unsigned 32x32 -> 64 mul */
    TOK_ADDC1  = 0xc3, /* add with carry generation */
    TOK_ADDC2  = 0xc4, /* add with carry use */
    TOK_SUBC1  = 0xc5, /* add with carry generation */
    TOK_SUBC2  = 0xc6, /* add with carry use */
    TOK_ARROW  = 0xc7,
    TOK_DOTS   = 0xc8, /* three dots */
    TOK_SHR    = 0xc9, /* unsigned shift right */
    TOK_TWOSHARPS=0xca, /* ## preprocessing token */
    TOK_PLCHLDR= 0xcb, /* placeholder token as defined in C99 */
    TOK_NOSUBST= 0xcc, /* means following token has already been pp'd */
    TOK_PPJOIN = 0xcd, /* A '##' in the right position to mean pasting */
    TOK_CLONG  = 0xce, /* long constant */
    TOK_CULONG = 0xcf, /* unsigned long constant */
    TOK_SHL = 0x01, /* shift left */
    TOK_SAR = 0x02, /* signed shift right */
    TOK_A_MOD=0xa5,
    TOK_A_AND=0xa6,
    TOK_A_MUL=0xaa,
    TOK_A_ADD=0xab,
    TOK_A_SUB=0xad,
    TOK_A_DIV=0xaf,
    TOK_A_XOR=0xde,
    TOK_A_OR =0xfc,
    TOK_A_SHL=0x81,
    TOK_A_SAR=0x82,
    TOK_EOF  =    (-1),  /* end of file */
    TOK_LINEFEED =10,    /* line feed */
    TOK_IDENT=256,
    TOK_ASM_int=TOK_INT,
    TOK_UIDENT=TOK_DEFINE,
    TOK_FLAG_BOL = 0x0001, /* beginning of line before */
    TOK_FLAG_BOF = 0x0002, /* beginning of file before */
    TOK_FLAG_ENDIF=0x0004, /* a endif was found matching starting #ifdef */
    TOK_FLAG_EOF = 0x0008, /* end of file */
};

enum SYMS {
    SYM_FIELD = 0x20000000,
    SYM_STRUCT = 0x40000000,
    SYM_FIRST_ANOM = 0x10000000,
};

enum FUNCS {
    FUNC_OLD = 2,
    FUNC_CDECL = 0,
};

enum PARSE_FLAGS {
    PARSE_FLAG_PREPROCESS = 0x0001,
    PARSE_FLAG_TOK_NUM = 0x0002,
    PARSE_FLAG_TOK_STR = 0x0040,

};

enum MISC {
    LONG_SIZE = 4,
};

enum TYPES {
    TYPE_DIRECT = 2,
};

enum RCS {
    RC_INT = 0x0001,
    RC_FLOAT = 0x0002,
    RC_EAX = 0x0004,
    RC_ST0 = 0x0008,
    RC_ECX = 0x0010,
    RC_EDX = 0x0020,
    RC_EBX = 0x0040,
};

enum MACROS {
    MACRO_OBJ = 0,
    MACRO_FUNC = 1,
};

enum AFFS {
    AFF_PRINT_ERROR = 0x10,
};

enum TCC_OUTPUTS {
    TCC_OUTPUT_OBJ = 4,
    TCC_OUTPUT_FORMAT_ELF = 0,
};

static int gnu_ext;
static int tcc_ext;
static struct TCCState *tcc_state;

TCCState *tcc_new(void);
void tcc_delete(TCCState *s);
void tcc_set_error_func(TCCState *s, void *error_opaque,
void (*error_func)(void *opaque, const char *msg));
int tcc_add_include_path(TCCState *s, const char *pathname);
void tcc_define_symbol(TCCState *s, const char *sym, const char *value);
int tcc_add_file(TCCState *s, const char *filename);
int tcc_compile_string(TCCState *s, const char *buf);
int tcc_set_output_type(TCCState *s, int output_type);
int tcc_output_file(TCCState *s, const char *filename);

static char *pstrcpy(char *buf, int buf_size, const char *s);
static char *pstrcat(char *buf, int buf_size, const char *s);
static char *pstrncpy(char *out, const char *in, size_t num);
char *tcc_basename(const char *name);
void tcc_free(void *ptr);
void *tcc_malloc(unsigned long size);
void *tcc_mallocz(unsigned long size);
void *tcc_realloc(void *ptr, unsigned long size);
char *tcc_strdup(const char *str);
void tcc_error_noabort(const char *fmt, ...);
void tcc_error(const char *fmt, ...);
void tcc_warning(const char *fmt, ...);

// LJW BOOKMARK
static void dynarray_add(void *ptab, int *nb_ptr, void *data);
static void dynarray_reset(void *pp, int *n);
static inline void cstr_ccat(CString *cstr, int ch);
static void cstr_cat(CString *cstr, const char *str, int len);
static void cstr_wccat(CString *cstr, int ch);
static void cstr_new(CString *cstr);
static void cstr_free(CString *cstr);
static void cstr_reset(CString *cstr);

static inline void sym_free(Sym *sym);
static Sym *sym_push2(Sym **ps, int v, int t, int c);
static Sym *sym_find2(Sym *s, int v);
static Sym *sym_push(int v, CType *type, int r, int c);
static void sym_pop(Sym **ptop, Sym *b, int keep);
static inline Sym *struct_find(int v);
static inline Sym *sym_find(int v);
static Sym *global_identifier_push(int v, int t, int c);

static void tcc_open_bf(TCCState *s1, const char *filename, int initlen);
static int tcc_open(TCCState *s1, const char *filename);
static void tcc_close(void);

static int tcc_add_file_internal(TCCState *s1, const char *filename, int flags);
int tcc_parse_args(TCCState *s, int *argc, char ***argv, int optind);
static struct BufferedFile *file;
static int ch, tok;
static CValue tokc;
static const int *macro_ptr;
static int parse_flags;
static int tok_flags;
static CString tokcstr;

static int total_lines;
static int total_bytes;
static int tok_ident;
static TokenSym **table_ident;
static TokenSym *tok_alloc(const char *str, int len);
static const char *get_tok_str(int v, CValue *cv);
static void begin_macro(TokenString *str, int alloc);
static void end_macro(void);
static int set_idnum(int c, int val);
static inline void tok_str_new(TokenString *s);
static TokenString *tok_str_alloc(void);
static void tok_str_free(TokenString *s);
static void tok_str_free_str(int *str);
static void tok_str_add(TokenString *s, int t);
static void tok_str_add_tok(TokenString *s);
static inline void define_push(int v, int macro_type, int *str, Sym *first_arg);
static void define_undef(Sym *s);
static inline Sym *define_find(int v);
static void free_defines(Sym *b);
static Sym *label_find(int v);
static Sym *label_push(Sym **ptop, int v, int flags);
static void label_pop(Sym **ptop, Sym *slast, int keep);
static void parse_define(void);
static void preprocess(int is_bof);
static void next_nomacro(void);
static void next(void);
static inline void unget_tok(int last_tok);
static void preprocess_start(TCCState *s1, int is_asm);
static void preprocess_end(TCCState *s1);
static void tccpp_new(TCCState *s);
static void tccpp_delete(TCCState *s);
static int tcc_preprocess(TCCState *s1);
static void skip(int c);
static  void expect(const char *msg);

static inline int is_space(int ch) {
    return ch == ' ' || ch == '\t' || ch == '\v' || ch == '\f' || ch == '\r';
}
static inline int isid(int c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}
static inline int isnum(int c) {
    return c >= '0' && c <= '9';
}
static inline int isoct(int c) {
    return c >= '0' && c <= '7';
}
static inline int toup(int c) {
    return (c >= 'a' && c <= 'z') ? c - 'a' + 'A' : c;
}

int IS_ENUM(int t){
    return ((t & (((1 << (6+6)) - 1) << 20 | 0x0080)) == (2 << 20));
}

static Sym *sym_free_first;
static void **sym_pools;
static int nb_sym_pools;
static Sym *global_stack;
static Sym *local_stack;
static Sym *local_label_stack;
static Sym *global_label_stack;
static Sym *define_stack;
static CType char_pointer_type, func_old_type, int_type, size_type;
static SValue __vstack[1+  256], *vtop, *pvtop;
static int rsym, anon_sym, ind, loc;
static int const_wanted;
static int nocode_wanted;
static int global_expr;
static CType func_vt;
static int func_var;
static int func_vc;
static int last_line_num, last_ind, func_ind;
static const char *funcname;
static int tccgen_compile(TCCState *s1);
static void free_inline_functions(TCCState *s);
static void check_vstack(void);
static inline int is_float(int t);
static int ieee_finite(double d);
static void test_lvalue(void);
static void vpushi(int v);
static Elf32_Sym *elfsym(Sym *);
static void update_storage(Sym *sym);
static Sym *external_global_sym(int v, CType *type, int r);
static void vset(CType *type, int r, int v);
static void vswap(void);
static void vpush_global_sym(CType *type, int v);
static void vrote(SValue *e, int n);
static void vrott(int n);
static void vrotb(int n);
static void vpushv(SValue *v);
static void save_reg(int r);
static void save_reg_upstack(int r, int n);
static int get_reg(int rc);
static void save_regs(int n);
static void gaddrof(void);
static int gv(int rc);
static void gv2(int rc1, int rc2);
static void vpop(void);
static void gen_op(int op);
static int type_size(CType *type, int *a);
static void mk_pointer(CType *type);
static void vstore(void);
static void inc(int post, int c);
static void parse_mult_str (CString *astr, const char *msg);
static int lvalue_type(int t);
static void indir(void);
static void unary(void);
static void expr_prod(void);
static void expr_sum(void);
static void gexpr(void);
static int expr_const(void);
static Sym *get_sym_ref(CType *type, Section *sec, unsigned long offset, unsigned long size);
static Section *text_section, *data_section, *bss_section;
static Section *common_section;
static Section *cur_text_section;
static Section *last_text_section;
static Section *bounds_section;
static Section *lbounds_section;
static void tccelf_bounds_new(TCCState *s);
static Section *symtab_section;
static Section *stab_section, *stabstr_section;
static void tccelf_new(TCCState *s);
static void tccelf_delete(TCCState *s);
static void tccelf_begin_file(TCCState *s1);
static void tccelf_end_file(TCCState *s1);
static Section *new_section(TCCState *s1, const char *name, int sh_type, int sh_flags);
static void section_realloc(Section *sec, unsigned long new_size);
static size_t section_add(Section *sec, Elf32_Addr size, int align);
static void *section_ptr_add(Section *sec, Elf32_Addr size);
static void section_reserve(Section *sec, unsigned long size);
static Section *find_section(TCCState *s1, const char *name);
static Section *new_symtab(TCCState *s1, const char *symtab_name, int sh_type, int sh_flags, const char *strtab_name, const char *hash_name, int hash_sh_flags);
static void put_extern_sym2(Sym *sym, int sh_num, Elf32_Addr value, unsigned long size, int can_add_underscore);
static void put_extern_sym(Sym *sym, Section *section, Elf32_Addr value, unsigned long size);
static void greloc(Section *s, Sym *sym, unsigned long offset, int type);
static void greloca(Section *s, Sym *sym, unsigned long offset, int type, Elf32_Addr addend);
static int put_elf_str(Section *s, const char *sym);
static int put_elf_sym(Section *s, Elf32_Addr value, unsigned long size, int info, int other, int shndx, const char *name);
static int set_elf_sym(Section *s, Elf32_Addr value, unsigned long size, int info, int other, int shndx, const char *name);
static int find_elf_sym(Section *s, const char *name);
static void put_elf_reloc(Section *symtab, Section *s, unsigned long offset, int type, int symbol);
static void put_elf_reloca(Section *symtab, Section *s, unsigned long offset, int type, int symbol, Elf32_Addr addend);
static void resolve_common_syms(TCCState *s1);
static void relocate_syms(TCCState *s1, Section *symtab, int do_resolve);
static void relocate_section(TCCState *s1, Section *s);
static int tcc_object_type(int fd, Elf32_Ehdr *h);
static int tcc_load_object_file(TCCState *s1, int fd, unsigned long file_offset);
static void squeeze_multi_relocs(Section *sec, size_t oldrelocoffset);
static uint8_t *parse_comment(uint8_t *p);
static void minp(void);
static inline void inp(void);
static int handle_eob(void);
static int code_reloc (int reloc_type);
static void relocate_init(Section *sr);
static void relocate(TCCState *s1, Elf32_Rel *rel, int type, unsigned char *ptr, Elf32_Addr addr, Elf32_Addr val);
static const int reg_classes[5];
static void gsym_addr(int t, int a);
static void gsym(int t);
static void load(int r, SValue *sv);
static void store(int r, SValue *v);
static int gfunc_sret(CType *vt, int variadic, CType *ret, int *align, int *regsize);
static void gfunc_call(int nb_args);
static void gfunc_prolog(CType *func_type);
static void gfunc_epilog(void);
static int gjmp(int t);
static void gjmp_addr(int a);
static int gtst(int inv, int t);
static void gtst_addr(int inv, int a);
static void gen_opi(int op);
static void gen_opf(int op);
static void gen_cvt_ftoi(int t);
static void gen_cvt_ftof(int t);
static void ggoto(void);
static void o(unsigned int c);
static void gen_cvt_itof(int t);
static inline uint16_t read16le(unsigned char *p) {
    return p[0] | (uint16_t)p[1] << 8;
}
static inline void write16le(unsigned char *p, uint16_t x) {
    p[0] = x & 255;  p[1] = x >> 8 & 255;
}
static inline uint32_t read32le(unsigned char *p) {
  return read16le(p) | (uint32_t)read16le(p + 2) << 16;
}
static inline void write32le(unsigned char *p, uint32_t x) {
    write16le(p, x);  write16le(p + 2, x >> 16);
}
static inline void add32le(unsigned char *p, int32_t x) {
    write32le(p, read32le(p) + x);
}
static inline uint64_t read64le(unsigned char *p) {
  return read32le(p) | (uint64_t)read32le(p + 4) << 32;
}
static inline void write64le(unsigned char *p, uint64_t x) {
    write32le(p, x);  write32le(p + 4, x >> 32);
}
static inline void add64le(unsigned char *p, int64_t x) {
    write64le(p, read64le(p) + x);
}
static void g(int c);
static void gen_le16(int c);
static void gen_le32(int c);
static void gen_addr32(int r, Sym *sym, int c);
static void gen_addrpc32(int r, Sym *sym, int c);
static int gnu_ext = 1;
static int tcc_ext = 1;
static struct TCCState *tcc_state;
static int nb_states;
static int tok_flags;
static int parse_flags;
static struct BufferedFile *file;
static int ch, tok;
static CValue tokc;
static const int *macro_ptr;
static CString tokcstr;
static int total_lines;
static int total_bytes;
static int tok_ident;
static TokenSym **table_ident;
static TokenSym *hash_ident[16384];
static char token_buf[1024 + 1];
static CString cstr_buf;
static CString macro_equal_buf;
static TokenString tokstr_buf;
static unsigned char isidnum_table[256 - (-1)];
static int pp_debug_tok, pp_debug_symv;
static int pp_once;
static int pp_expr;
static int pp_counter;
static void tok_print(const char *msg, const int *str);
static void next_nomacro_spc(void);
static struct TinyAlloc *toksym_alloc;
static struct TinyAlloc *tokstr_alloc;
static struct TinyAlloc *cstr_alloc;
static TokenString *macro_stack;

static const char tcc_keywords[] =
"int" "\0" "void" "\0" "char" "\0" "if" "\0" "else" "\0" "while" "\0" "break"
"\0" "return" "\0" "for" "\0" "extern" "\0" "static" "\0" "unsigned" "\0"
"goto" "\0" "do" "\0" "continue" "\0" "switch" "\0" "case" "\0" "const" "\0"
"__const" "\0" "__const__" "\0" "volatile" "\0" "__volatile" "\0" "__volatile__"
"\0" "long" "\0" "register" "\0" "signed" "\0" "__signed" "\0" "__signed__" "\0"
"auto" "\0" "inline" "\0" "__inline" "\0" "__inline__" "\0" "restrict" "\0"
"__restrict" "\0" "__restrict__" "\0" "__extension__" "\0" "_Generic" "\0"
"float" "\0" "double" "\0" "_Bool" "\0" "short" "\0" "struct" "\0" "union" "\0"
"typedef" "\0" "default" "\0" "enum" "\0" "sizeof" "\0" "__attribute" "\0"
"__attribute__" "\0" "__alignof" "\0" "__alignof__" "\0" "typeof" "\0"
"__typeof" "\0" "__typeof__" "\0" "__label__" "\0" "asm" "\0" "__asm" "\0"
"__asm__" "\0" "define" "\0" "include" "\0" "include_next" "\0" "ifdef" "\0"
"ifndef" "\0" "elif" "\0" "endif" "\0" "defined" "\0" "undef" "\0" "error"
"\0" "warning" "\0" "line" "\0" "pragma" "\0" "__LINE__" "\0" "__FILE__" "\0"
"__DATE__" "\0" "__TIME__" "\0" "__FUNCTION__" "\0" "__VA_ARGS__" "\0"
"__COUNTER__" "\0" "__func__" "\0" "__nan__" "\0" "__snan__" "\0" "__inf__"
"\0" "section" "\0" "__section__" "\0" "aligned" "\0" "__aligned__" "\0"
"packed" "\0" "__packed__" "\0" "weak" "\0" "__weak__" "\0" "alias" "\0"
"__alias__" "\0" "unused" "\0" "__unused__" "\0" "cdecl" "\0" "__cdecl"
"\0" "__cdecl__" "\0" "stdcall" "\0" "__stdcall" "\0" "__stdcall__" "\0"
"fastcall" "\0" "__fastcall" "\0" "__fastcall__" "\0" "regparm" "\0"
"__regparm__" "\0" "__mode__" "\0" "__QI__" "\0" "__DI__" "\0" "__HI__"
"\0" "__SI__" "\0" "__word__" "\0" "dllexport" "\0" "dllimport" "\0"
"noreturn" "\0" "__noreturn__" "\0" "visibility" "\0" "__visibility__" "\0"
"__builtin_types_compatible_p" "\0" "__builtin_choose_expr" "\0"
"__builtin_constant_p" "\0" "__builtin_frame_address" "\0"
"__builtin_return_address" "\0" "__builtin_expect" "\0" "pack" "\0" "comment"
"\0" "lib" "\0" "push_macro" "\0" "pop_macro" "\0" "once" "\0" "option" "\0"
"memcpy" "\0" "memmove" "\0" "memset" "\0" "__divdi3" "\0" "__moddi3" "\0"
"__udivdi3" "\0" "__umoddi3" "\0" "__ashrdi3" "\0" "__lshrdi3" "\0" "__ashldi3"
"\0" "__floatundisf" "\0" "__floatundidf" "\0" "__floatundixf" "\0"
"__fixunsxfdi" "\0" "__fixunssfdi" "\0" "__fixunsdfdi" "\0" "__fixsfdi" "\0"
"__fixdfdi" "\0" "__fixxfdi" "\0" "alloca" "\0" "__bound_ptr_add" "\0"
"__bound_ptr_indir1" "\0" "__bound_ptr_indir2" "\0" "__bound_ptr_indir4" "\0"
"__bound_ptr_indir8" "\0" "__bound_ptr_indir12" "\0" "__bound_ptr_indir16" "\0"
"__bound_main_arg" "\0" "__bound_local_new" "\0" "__bound_local_delete" "\0"
"strlen" "\0" "strcpy" "\0" "." "byte" "\0" "." "word" "\0" "." "align" "\0"
"." "balign" "\0" "." "p2align" "\0" "." "set" "\0" "." "skip" "\0" "." "space"
"\0" "." "string" "\0" "." "asciz" "\0" "." "ascii" "\0" "." "file" "\0" "."
"globl" "\0" "." "global" "\0" "." "weak" "\0" "." "hidden" "\0" "." "ident"
"\0" "." "size" "\0" "." "type" "\0" "." "text" "\0" "." "data" "\0" "." "bss"
"\0" "." "previous" "\0" "." "pushsection" "\0" "." "popsection" "\0" "."
"fill" "\0" "." "rept" "\0" "." "endr" "\0" "." "org" "\0" "." "quad" "\0" "."
"code16" "\0" "." "code32" "\0" "." "short" "\0" "." "long" "\0" "." "int" "\0"
"." "section" "\0";

static const unsigned char tok_two_chars[] = {
    '<','=', 0x9e,
    '>','=', 0x9d,
    '!','=', 0x95,
    '&','&', 0xa0,
    '|','|', 0xa1,
    '+','+', 0xa4,
    '-','-', 0xa2,
    '=','=', 0x94,
    '<','<', 0x01,
    '>','>', 0x02,
    '+','=', 0xab,
    '-','=', 0xad,
    '*','=', 0xaa,
    '/','=', 0xaf,
    '%','=', 0xa5,
    '&','=', 0xa6,
    '^','=', 0xde,
    '|','=', 0xfc,
    '-','>', 0xc7,
    '.','.', 0xa8,
    '#','#', 0xca,
    0
};

static void skip(int c) {
    if (tok != c)
        tcc_error("'%c' expected (got \"%s\")", c, get_tok_str(tok, &tokc));
    next();
}

static void expect(const char *msg) {
    tcc_error("%s expected", msg);
}

typedef struct TinyAlloc {
    unsigned  limit;
    unsigned  size;
    uint8_t *buffer;
    uint8_t *p;
    unsigned  nb_allocs;
    struct TinyAlloc *next, *top;
} TinyAlloc;

typedef struct tal_header_t {
    unsigned  size;
} tal_header_t;

static TinyAlloc *tal_new(TinyAlloc **pal, unsigned limit, unsigned size) {
    TinyAlloc *al = tcc_mallocz(sizeof(TinyAlloc));
    al->p = al->buffer = tcc_malloc(size);
    al->limit = limit;
    al->size = size;
    if (pal) *pal = al;
    return al;
}

static void tal_delete(TinyAlloc *al) {
    TinyAlloc *next;
tail_call:
    if (!al)
        return;
    next = al->next;
    tcc_free(al->buffer);
    tcc_free(al);
    al = next;
    goto tail_call;
}

static void tal_free_impl(TinyAlloc *al, void *p ) {
    if (!p)
        return;
tail_call:
    if (al->buffer <= (uint8_t *)p && (uint8_t *)p < al->buffer + al->size) {
        al->nb_allocs--;
        if (!al->nb_allocs)
            al->p = al->buffer;
    } else if (al->next) {
        al = al->next;
        goto tail_call;
    }
    else
        tcc_free(p);
}

static void *tal_realloc_impl(TinyAlloc **pal, void *p, unsigned size ) {
    tal_header_t *header;
    void *ret;
    int is_own;
    unsigned adj_size = (size + 3) & -4;
    TinyAlloc *al = *pal;
tail_call:
    is_own = (al->buffer <= (uint8_t *)p && (uint8_t *)p < al->buffer + al->size);
    if ((!p || is_own) && size <= al->limit) {
        if (al->p + adj_size + sizeof(tal_header_t) < al->buffer + al->size) {
            header = (tal_header_t *)al->p;
            header->size = adj_size;
            ret = al->p + sizeof(tal_header_t);
            al->p += adj_size + sizeof(tal_header_t);
            if (is_own) {
                header = (((tal_header_t *)p) - 1);
                memcpy(ret, p, header->size);
            } else {
                al->nb_allocs++;
            }
            return ret;
        } else if (is_own) {
            al->nb_allocs--;
            ret = tal_realloc_impl(&*pal, 0, size);
            header = (((tal_header_t *)p) - 1);
            memcpy(ret, p, header->size);
            return ret;
        }
        if (al->next) {
            al = al->next;
        } else {
            TinyAlloc *bottom = al, *next = al->top ? al->top : al;

            al = tal_new(pal, next->limit, next->size * 2);
            al->next = next;
            bottom->top = al;
        }
        goto tail_call;
    }
    if (is_own) {
        al->nb_allocs--;
        ret = tcc_malloc(size);
        header = (((tal_header_t *)p) - 1);
        memcpy(ret, p, header->size);
    } else if (al->next) {
        al = al->next;
        goto tail_call;
    } else
        ret = tcc_realloc(p, size);
    return ret;
}

static void cstr_realloc(CString *cstr, int new_size) {
    int size;

    size = cstr->size_allocated;
    if (size < 8)
        size = 8;
    while (size < new_size)
        size = size * 2;
    cstr->data = tal_realloc_impl(&cstr_alloc, cstr->data, size);
    cstr->size_allocated = size;
}

static inline void cstr_ccat(CString *cstr, int ch) {
    int size;
    size = cstr->size + 1;
    if (size > cstr->size_allocated)
        cstr_realloc(cstr, size);
    ((unsigned char *)cstr->data)[size - 1] = ch;
    cstr->size = size;
}

static void cstr_cat(CString *cstr, const char *str, int len) {
    int size;
    if (len <= 0)
        len = strlen(str) + 1 + len;
    size = cstr->size + len;
    if (size > cstr->size_allocated)
        cstr_realloc(cstr, size);
    memmove(((unsigned char *)cstr->data) + cstr->size, str, len);
    cstr->size = size;
}

static void cstr_wccat(CString *cstr, int ch) {
    int size;
    size = cstr->size + sizeof(nwchar_t);
    if (size > cstr->size_allocated)
        cstr_realloc(cstr, size);
    *(nwchar_t *)(((unsigned char *)cstr->data) + size - sizeof(nwchar_t)) = ch;
    cstr->size = size;
}

static void cstr_new(CString *cstr) {
    memset(cstr, 0, sizeof(CString));
}


static void cstr_free(CString *cstr) {
    tal_free_impl(cstr_alloc, cstr->data);
    cstr_new(cstr);
}

static void cstr_reset(CString *cstr) {
    cstr->size = 0;
}

static void add_char(CString *cstr, int c) {
    if (c == '\'' || c == '\"' || c == '\\') {
        cstr_ccat(cstr, '\\');
    }
    if (c >= 32 && c <= 126) {
        cstr_ccat(cstr, c);
    } else {
        cstr_ccat(cstr, '\\');
        if (c == '\n') {
            cstr_ccat(cstr, 'n');
        } else {
            cstr_ccat(cstr, '0' + ((c >> 6) & 7));
            cstr_ccat(cstr, '0' + ((c >> 3) & 7));
            cstr_ccat(cstr, '0' + (c & 7));
        }
    }
}

static TokenSym *tok_alloc_new(TokenSym **pts, const char *str, int len) {
    TokenSym *ts, **ptable;
    int i;
    if (tok_ident >= 0x10000000)
        tcc_error("memory full (symbols)");
    i = tok_ident - 256;
    if ((i % 512) == 0) {
        ptable = tcc_realloc(table_ident, (i + 512) * sizeof(TokenSym *));
        table_ident = ptable;
    }
    ts = tal_realloc_impl(&toksym_alloc, 0, sizeof(TokenSym) + len);
    table_ident[i] = ts;
    ts->tok = tok_ident++;
    ts->sym_define = ((void*)0);
    ts->sym_label = ((void*)0);
    ts->sym_struct = ((void*)0);
    ts->sym_identifier = ((void*)0);
    ts->len = len;
    ts->hash_next = ((void*)0);
    memcpy(ts->str, str, len);
    ts->str[len] = '\0';
    *pts = ts;
    return ts;
}

static TokenSym *tok_alloc(const char *str, int len) {
    TokenSym *ts, **pts;
    int i;
    unsigned int h;
    h = TOK_HASH_INIT;
    for(i=0;i<len;i++)
        h = TOK_HASH_FUNC(h, ((unsigned char *)str)[i]);
    h &= (TOK_HASH_SIZE - 1);
    pts = &hash_ident[h];
    for(;;) {
        ts = *pts;
        if (!ts)
            break;
        if (ts->len == len && !memcmp(ts->str, str, len))
            return ts;
        pts = &(ts->hash_next);
    }
    return tok_alloc_new(pts, str, len);
}

static const char *get_tok_str(int v, CValue *cv) {
    char *p;
    int i, len;
    cstr_reset(&cstr_buf);
    p = cstr_buf.data;
    switch(v) {
    case TOK_CINT:
    case TOK_CUINT:
    case TOK_CLONG:
    case TOK_CULONG:
    case TOK_CLLONG:
    case TOK_CULLONG:
        sprintf(p, "%llu", (unsigned long long)cv->i);
        break;
    case TOK_LCHAR:
        cstr_ccat(&cstr_buf, 'L');
    case TOK_CCHAR:
        cstr_ccat(&cstr_buf, '\'');
        add_char(&cstr_buf, cv->i);
        cstr_ccat(&cstr_buf, '\'');
        cstr_ccat(&cstr_buf, '\0');
        break;
    case TOK_PPNUM:
    case TOK_PPSTR:
        return (char*)cv->str.data;
    case TOK_LSTR:
        cstr_ccat(&cstr_buf, 'L');
    case TOK_STR:
        cstr_ccat(&cstr_buf, '\"');
        if (v == TOK_STR) {
            len = cv->str.size - 1;
            for(i=0;i<len;i++)
                add_char(&cstr_buf, ((unsigned char *)cv->str.data)[i]);
        } else {
            len = (cv->str.size / sizeof(nwchar_t)) - 1;
            for(i=0;i<len;i++)
                add_char(&cstr_buf, ((nwchar_t *)cv->str.data)[i]);
        }
        cstr_ccat(&cstr_buf, '\"');
        cstr_ccat(&cstr_buf, '\0');
        break;

    case TOK_CFLOAT:
        cstr_cat(&cstr_buf, "<float>", 0);
        break;
    case TOK_CDOUBLE:
        cstr_cat(&cstr_buf, "<double>", 0);
        break;
    case TOK_CLDOUBLE:
        cstr_cat(&cstr_buf, "<long double>", 0);
        break;
    case TOK_LINENUM:
        cstr_cat(&cstr_buf, "<linenumber>", 0);
        break;
    case TOK_LT:
        v = '<';
        goto addv;
    case TOK_GT:
        v = '>';
        goto addv;
    case TOK_DOTS:
        return strcpy(p, "...");
    case TOK_A_SHL:
        return strcpy(p, "<<=");
    case TOK_A_SAR:
        return strcpy(p, ">>=");
    case TOK_EOF:
        return strcpy(p, "<eof>");
    default:
        if (v < TOK_IDENT) {
            const unsigned char *q = tok_two_chars;
            while (*q) {
                if (q[2] == v) {
                    *p++ = q[0];
                    *p++ = q[1];
                    *p = '\0';
                    return cstr_buf.data;
                }
                q += 3;
            }
        if (v >= 127) {
            sprintf(cstr_buf.data, "<%02x>", v);
            return cstr_buf.data;
        }
        addv:
            *p++ = v;
            *p = '\0';
        } else if (v < tok_ident) {
            return table_ident[v - TOK_IDENT]->str;
        } else if (v >= SYM_FIRST_ANOM) {

            sprintf(p, "L.%u", v - SYM_FIRST_ANOM);
        } else {
            return ((void*)0);
        }
        break;
    }
    return cstr_buf.data;
}

static int handle_eob(void) {
    BufferedFile *bf = file;
    int len;

    if (bf->buf_ptr >= bf->buf_end) {
        if (bf->fd >= 0) {
            len = 8192;
            len = read(bf->fd, bf->buffer, len);
            if (len < 0)
                len = 0;
        } else {
            len = 0;
        }
        total_bytes += len;
        bf->buf_ptr = bf->buffer;
        bf->buf_end = bf->buffer + len;
        *bf->buf_end = '\\';
    }
    if (bf->buf_ptr < bf->buf_end) {
        return bf->buf_ptr[0];
    } else {
        bf->buf_ptr = bf->buf_end;
        return (-1);
    }
}

static inline void inp(void) {
    ch = *(++(file->buf_ptr));
    if (ch == '\\')
        ch = handle_eob();
}

static int handle_stray_noerror(void) {
    while (ch == '\\') {
        inp();
        if (ch == '\n') {
            file->line_num++;
            inp();
        } else if (ch == '\r') {
            inp();
            if (ch != '\n')
                goto fail;
            file->line_num++;
            inp();
        } else {
        fail:
            return 1;
        }
    }
    return 0;
}

static void handle_stray(void) {
    if (handle_stray_noerror())
        tcc_error("stray '\\' in program");
}

static int handle_stray1(uint8_t *p) {
    int c;
    file->buf_ptr = p;
    if (p >= file->buf_end) {
        c = handle_eob();
        if (c != '\\')
            return c;
        p = file->buf_ptr;
    }
    ch = *p;
    if (handle_stray_noerror()) {
        if (!(parse_flags & 0x0020))
            tcc_error("stray '\\' in program");
        *--file->buf_ptr = '\\';
    }
    p = file->buf_ptr;
    c = *p;
    return c;
}

static void minp(void) {
    inp();
    if (ch == '\\')
        handle_stray();
}

int PEEKC_EOB(int c, unsigned int p0) {
  // FIXME implement
}


static uint8_t *parse_line_comment(uint8_t *p) {
    int c;
    p++;
    for(;;) {
        c = *p;
    redo:
        if (c == '\n' || c == (-1)) {
            break;
        } else if (c == '\\') {
            file->buf_ptr = p;
            c = handle_eob();
            p = file->buf_ptr;
            if (c == '\\') {
                { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
//                c=PEEKC_EOB(c, &p);
                if (c == '\n') {
                    file->line_num++;
                    { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                } else if (c == '\r') {
                    { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                    if (c == '\n') {
                        file->line_num++;
                        { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                    }
                }
            } else {
                goto redo;
            }
        } else {
            p++;
        }
    }
    return p;
}

static uint8_t *parse_comment(uint8_t *p) {
    int c;
    p++;
    for(;;) {
        for(;;) {
            c = *p;
            if (c == '\n' || c == '*' || c == '\\')
                break;
            p++;
            c = *p;
            if (c == '\n' || c == '*' || c == '\\')
                break;
            p++;
        }
        if (c == '\n') {
            file->line_num++;
            p++;
        } else if (c == '*') {
            p++;
            for(;;) {
                c = *p;
                if (c == '*') {
                    p++;
                } else if (c == '/') {
                    goto end_of_comment;
                } else if (c == '\\') {
                    file->buf_ptr = p;
                    c = handle_eob();
                    p = file->buf_ptr;
                    if (c == (-1))
                        tcc_error("unexpected end of file in comment");
                    if (c == '\\') {
                        while (c == '\\') {
                            { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                            if (c == '\n') {
                                file->line_num++;
                                { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                            } else if (c == '\r') {
                                { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                                if (c == '\n') {
                                    file->line_num++;
                                    { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                                }
                            } else {
                                goto after_star;
                            }
                        }
                    }
                } else {
                    break;
                }
            }
        after_star: ;
        } else {
            file->buf_ptr = p;
            c = handle_eob();
            p = file->buf_ptr;
            if (c == (-1)) {
                tcc_error("unexpected end of file in comment");
            } else if (c == '\\') {
                p++;
            }
        }
    }
 end_of_comment:
    p++;
    return p;
}

static int set_idnum(int c, int val) {
    int prev = isidnum_table[c - (-1)];
    isidnum_table[c - (-1)] = val;
    return prev;
}

static inline void skip_spaces(void) {
    while (isidnum_table[ch - (-1)] & 1)
        minp();
}

static inline int check_space(int t, int *spc) {
    if (t < 256 && (isidnum_table[t - (-1)] & 1)) {
        if (*spc)
            return 1;
        *spc = 1;
    } else
        *spc = 0;
    return 0;
}

static uint8_t *parse_pp_string(uint8_t *p,
                                int sep, CString *str) {
    int c;
    p++;
    for(;;) {
        c = *p;
        if (c == sep) {
            break;
        } else if (c == '\\') {
            file->buf_ptr = p;
            c = handle_eob();
            p = file->buf_ptr;
            if (c == (-1)) {
            unterminated_string:
                tcc_error("missing terminating %c character", sep);
            } else if (c == '\\') {
                { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                if (c == '\n') {
                    file->line_num++;
                    p++;
                } else if (c == '\r') {
                    { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
                    if (c != '\n')
                        expect("'\n' after '\r'");
                    file->line_num++;
                    p++;
                } else if (c == (-1)) {
                    goto unterminated_string;
                } else {
                    if (str) {
                        cstr_ccat(str, '\\');
                        cstr_ccat(str, c);
                    }
                    p++;
                }
            }
        } else if (c == '\n') {
            file->line_num++;
            goto add_char;
        } else if (c == '\r') {
            { p++; c = *p; if (c == '\\') { file->buf_ptr = p; c = handle_eob(); p = file->buf_ptr; }};
            if (c != '\n') {
                if (str)
                    cstr_ccat(str, '\r');
            } else {
                file->line_num++;
                goto add_char;
            }
        } else {
        add_char:
            if (str)
                cstr_ccat(str, c);
            p++;
        }
    }
    p++;
    return p;
}

static void preprocess_skip(void) {
    int a, start_of_line, c, in_warn_or_error;
    uint8_t *p;

    p = file->buf_ptr;
    a = 0;
redo_start:
    start_of_line = 1;
    in_warn_or_error = 0;
    for(;;) {
    redo_no_start:
        c = *p;
        switch(c) {
        case ' ':
        case '\t':
        case '\f':
        case '\v':
        case '\r':
            p++;
            goto redo_no_start;
        case '\n':
            file->line_num++;
            p++;
            goto redo_start;
        case '\\':
            file->buf_ptr = p;
            c = handle_eob();
            if (c == (-1)) {
                expect("#endif");
            } else if (c == '\\') {
                ch = file->buf_ptr[0];
                handle_stray_noerror();
            }
            p = file->buf_ptr;
            goto redo_no_start;
        case '\"':
        case '\'':
            if (in_warn_or_error)
                goto _default;
            p = parse_pp_string(p, c, ((void*)0));
            break;
        case '/':
            if (in_warn_or_error)
                goto _default;
            file->buf_ptr = p;
            ch = *p;
            minp();
            p = file->buf_ptr;
            if (ch == '*') {
                p = parse_comment(p);
            } else if (ch == '/') {
                p = parse_line_comment(p);
            }
            break;
        case '#':
            p++;
            if (start_of_line) {
                file->buf_ptr = p;
                next_nomacro();
                p = file->buf_ptr;
                if (a == 0 &&
                    (tok == TOK_ELSE || tok == TOK_ELIF || tok == TOK_ENDIF))
                    goto the_end;
                if (tok == TOK_IF || tok == TOK_IFDEF || tok == TOK_IFNDEF)
                    a++;
                else if (tok == TOK_ENDIF)
                    a--;
                else if( tok == TOK_ERROR || tok == TOK_WARNING)
                    in_warn_or_error = 1;
                else if (tok == 10)
                    goto redo_start;
                else if (parse_flags & 0x0008)
                    p = parse_line_comment(p - 1);
            } else if (parse_flags & 0x0008)
                p = parse_line_comment(p - 1);
            break;
_default:
        default:
            p++;
            break;
        }
        start_of_line = 0;
    }
 the_end: ;
    file->buf_ptr = p;
}

static inline void tok_str_new(TokenString *s) {
    s->str = ((void*)0);
    s->len = s->lastlen = 0;
    s->allocated_len = 0;
    s->last_line_num = -1;
}

static TokenString *tok_str_alloc(void) {
    TokenString *str = tal_realloc_impl(&tokstr_alloc, 0, sizeof *str);
    tok_str_new(str);
    return str;
}

static int *tok_str_dup(TokenString *s) {
    int *str;
    str = tal_realloc_impl(&tokstr_alloc, 0, s->len * sizeof(int));
    memcpy(str, s->str, s->len * sizeof(int));
    return str;
}

static void tok_str_free_str(int *str) {
    tal_free_impl(tokstr_alloc, str);
}

static void tok_str_free(TokenString *str) {
    tok_str_free_str(str->str);
    tal_free_impl(tokstr_alloc, str);
}

static int *tok_str_realloc(TokenString *s, int new_size) {
    int *str, size;
    size = s->allocated_len;
    if (size < 16)
        size = 16;
    while (size < new_size)
        size = size * 2;
    if (size > s->allocated_len) {
        str = tal_realloc_impl(&tokstr_alloc, s->str, size * sizeof(int));
        s->allocated_len = size;
        s->str = str;
    }
    return s->str;
}

static void tok_str_add(TokenString *s, int t) {
    int len, *str;
    len = s->len;
    str = s->str;
    if (len >= s->allocated_len)
        str = tok_str_realloc(s, len + 1);
    str[len++] = t;
    s->len = len;
}

static void begin_macro(TokenString *str, int alloc) {
    str->alloc = alloc;
    str->prev = macro_stack;
    str->prev_ptr = macro_ptr;
    str->save_line_num = file->line_num;
    macro_ptr = str->str;
    macro_stack = str;
}

static void end_macro(void) {
    TokenString *str = macro_stack;
    macro_stack = str->prev;
    macro_ptr = str->prev_ptr;
    file->line_num = str->save_line_num;
    if (str->alloc == 2) {
        str->alloc = 3;
    } else {
        tok_str_free(str);
    }
}

static void tok_str_add2(TokenString *s, int t, CValue *cv) {
    int len, *str;

    len = s->lastlen = s->len;
    str = s->str;

    if (len + 4 >= s->allocated_len)
        str = tok_str_realloc(s, len + 4 + 1);
    str[len++] = t;
    switch(t) {
    case TOK_CINT:
    case TOK_CUINT:
    case TOK_CCHAR:
    case TOK_LCHAR:
    case TOK_CFLOAT:
    case TOK_LINENUM:
    case TOK_CLONG:
    case TOK_CULONG:
        str[len++] = cv->tab[0];
        break;
    case TOK_PPNUM:
    case TOK_PPSTR:
    case TOK_STR:
    case TOK_LSTR:
        {
            size_t nb_words =
                1 + (cv->str.size + sizeof(int) - 1) / sizeof(int);
            if (len + nb_words >= s->allocated_len)
                str = tok_str_realloc(s, len + nb_words + 1);
            str[len] = cv->str.size;
            memcpy(&str[len + 1], cv->str.data, cv->str.size);
            len += nb_words;
        }
        break;
    case TOK_CDOUBLE:
    case TOK_CLLONG:
    case TOK_CULLONG:
        str[len++] = cv->tab[0];
        str[len++] = cv->tab[1];
        break;
    case TOK_CLDOUBLE:
        str[len++] = cv->tab[0];
        str[len++] = cv->tab[1];
        str[len++] = cv->tab[2];
        break;
    default:
        break;
    }
    s->len = len;
}

static void tok_str_add_tok(TokenString *s) {
    CValue cval;

    if (file->line_num != s->last_line_num) {
        s->last_line_num = file->line_num;
        cval.i = s->last_line_num;
        tok_str_add2(s, 0xc0, &cval);
    }
    tok_str_add2(s, tok, &tokc);
}

static inline void TOK_GET(int *t, const int **pp, CValue *cv) {
    const int *p = *pp;
    int n, *tab;

    tab = cv->tab;
    switch(*t = *p++) {
    case TOK_CLONG:
    case TOK_CINT:
    case TOK_CCHAR:
    case TOK_LCHAR:
    case TOK_LINENUM:
        cv->i = *p++;
        break;
    case TOK_CULONG:
    case TOK_CUINT:
        cv->i = (unsigned)*p++;
        break;
    case TOK_CFLOAT:
	tab[0] = *p++;
	break;
    case TOK_STR:
    case TOK_LSTR:
    case TOK_PPNUM:
    case TOK_PPSTR:
        cv->str.size = *p++;
        cv->str.data = p;
        p += (cv->str.size + sizeof(int) - 1) / sizeof(int);
        break;
    case TOK_CDOUBLE:
    case TOK_CLLONG:
    case TOK_CULLONG:
        n = 2;
        goto copy;
    case TOK_CLDOUBLE:
        n = 3;
    copy:
        do
            *tab++ = *p++;
        while (--n);
        break;
    default:
        break;
    }
    *pp = p;
}

static int macro_is_equal(const int *a, const int *b) {
    CValue cv;
    int t;
    if (!a || !b)
        return 1;
    while (*a && *b) {
        cstr_reset(&macro_equal_buf);
        TOK_GET(&t, &a, &cv);
        cstr_cat(&macro_equal_buf, get_tok_str(t, &cv), 0);
        TOK_GET(&t, &b, &cv);
        if (strcmp(macro_equal_buf.data, get_tok_str(t, &cv)))
            return 0;
    }
    return !(*a || *b);
}

static inline void define_push(int v, int macro_type, int *str, Sym *first_arg) {
    Sym *s, *o;
    o = define_find(v);
    s = sym_push2(&define_stack, v, macro_type, 0);
    s->d = str;
    s->next = first_arg;
    table_ident[v - 256]->sym_define = s;
    if (o && !macro_is_equal(o->d, s->d))
	tcc_warning("%s redefined", get_tok_str(v, ((void*)0)));
}

static void define_undef(Sym *s) {
    int v = s->v;
    if (v >= 256 && v < tok_ident)
        table_ident[v - 256]->sym_define = ((void*)0);
}

static inline Sym *define_find(int v) {
    v -= 256;
    if ((unsigned)v >= (unsigned)(tok_ident - 256))
        return ((void*)0);
    return table_ident[v]->sym_define;
}

static void free_defines(Sym *b) {
    while (define_stack != b) {
        Sym *top = define_stack;
        define_stack = top->prev;
        tok_str_free_str(top->d);
        define_undef(top);
        sym_free(top);
    }
    while (b) {
        int v = b->v;
        if (v >= 256 && v < tok_ident) {
            Sym **d = &table_ident[v - 256]->sym_define;
            if (!*d)
                *d = b;
        }
        b = b->prev;
    }
}

static Sym *label_find(int v) {
    v -= 256;
    if ((unsigned)v >= (unsigned)(tok_ident - 256))
        return ((void*)0);
    return table_ident[v]->sym_label;
}

static Sym *label_push(Sym **ptop, int v, int flags) {
    Sym *s, **ps;
    s = sym_push2(ptop, v, 0, 0);
    s->r = flags;
    ps = &table_ident[v - 256]->sym_label;
    if (ptop == &global_label_stack) {
        while (*ps != ((void*)0))
            ps = &(*ps)->prev_tok;
    }
    s->prev_tok = *ps;
    *ps = s;
    return s;
}

static void label_pop(Sym **ptop, Sym *slast, int keep) {
    Sym *s, *s1;
    for(s = *ptop; s != slast; s = s1) {
        s1 = s->prev;
        if (s->r == 2) {
            tcc_warning("label '%s' declared but not used", get_tok_str(s->v, ((void*)0)));
        } else if (s->r == 1) {
                tcc_error("label '%s' used but not defined",
                      get_tok_str(s->v, ((void*)0)));
        } else {
            if (s->c) {
                put_extern_sym(s, cur_text_section, s->jnext, 1);
            }
        }
        table_ident[s->v - 256]->sym_label = s->prev_tok;
        if (!keep)
            sym_free(s);
    }
    if (!keep)
        *ptop = slast;
}

static int expr_preprocess(void) {
    int c, t;
    TokenString *str;
    str = tok_str_alloc();
    pp_expr = 1;
    while (tok != TOK_LINEFEED && tok != TOK_EOF) {
        next();
        if (tok == TOK_DEFINED) {
            next_nomacro();
            t = tok;
            if (t == '(')
                next_nomacro();
            if (tok < TOK_IDENT)
                expect("identifier");
            c = define_find(tok) != 0;
            if (t == '(') {
                next_nomacro();
                if (tok != ')')
                    expect("')'");
            }
            tok = TOK_CINT;
            tokc.i = c;
        } else if (tok >= TOK_IDENT) {
            tok = TOK_CINT;
            tokc.i = 0;
        }
        tok_str_add_tok(str);
    }
    pp_expr = 0;
    tok_str_add(str, -1);
    tok_str_add(str, 0);
    begin_macro(str, 1);
    next();
    c = expr_const();
    end_macro();
    return c != 0;
}

static void parse_define(void) {
    Sym *s, *first, **ps;
    int v, t, varg, is_vaargs, spc;
    int saved_parse_flags = parse_flags;
    v = tok;
    if (v < 256 || v == TOK_DEFINED)
        tcc_error("invalid macro name '%s'", get_tok_str(tok, &tokc));
    first = ((void*)0);
    t = 0;
    parse_flags = ((parse_flags & ~0x0008) | 0x0010);
    next_nomacro_spc();
    if (tok == '(') {
        int dotid = set_idnum('.', 0);
        next_nomacro();
        ps = &first;
        if (tok != ')') for (;;) {
            varg = tok;
            next_nomacro();
            is_vaargs = 0;
            if (varg == 0xc8) {
                varg = TOK___VA_ARGS__;
                is_vaargs = 1;
            } else if (tok == 0xc8 && gnu_ext) {
                is_vaargs = 1;
                next_nomacro();
            }
            if (varg < 256)
        bad_list:
                tcc_error("bad macro parameter list");
            s = sym_push2(&define_stack, varg | 0x20000000, is_vaargs, 0);
            *ps = s;
            ps = &s->next;
            if (tok == ')')
                break;
            if (tok != ',' || is_vaargs)
                goto bad_list;
            next_nomacro();
        }
        next_nomacro_spc();
        t = 1;
        set_idnum('.', dotid);
    }
    tokstr_buf.len = 0;
    spc = 2;
    parse_flags |= 0x0020 | 0x0010 | 0x0004;
    while (tok != 10 && tok != (-1)) {
        if (0xca == tok) {
            if (2 == spc)
                goto bad_twosharp;
            if (1 == spc)
                --tokstr_buf.len;
            spc = 3;
	    tok = 0xcd;
        } else if ('#' == tok) {
            spc = 4;
        } else if (check_space(tok, &spc)) {
            goto skip;
        }
        tok_str_add2(&tokstr_buf, tok, &tokc);
    skip:
        next_nomacro_spc();
    }
    parse_flags = saved_parse_flags;
    if (spc == 1)
        --tokstr_buf.len;
    tok_str_add(&tokstr_buf, 0);
    if (3 == spc)
bad_twosharp:
        tcc_error("'##' cannot appear at either end of macro");
    define_push(v, t, tok_str_dup(&tokstr_buf), first);
}

static CachedInclude *search_cached_include(TCCState *s1, const char *filename, int add) {
    const unsigned char *s;
    unsigned int h;
    CachedInclude *e;
    int i;
    h = TOK_HASH_INIT;
    s = (unsigned char *) filename;
    while (*s) {
        h = TOK_HASH_FUNC(h, *s);
        s++;
    }
    h &= (CACHED_INCLUDES_HASH_SIZE - 1);
    i = s1->cached_includes_hash[h];
    for(;;) {
        if (i == 0)
            break;
        e = s1->cached_includes[i - 1];
        if (0 == strcmp(e->filename, filename))
            return e;
        i = e->hash_next;
    }
    if (!add)
        return ((void*)0);
    e = tcc_malloc(sizeof(CachedInclude) + strlen(filename));
    strcpy(e->filename, filename);
    e->ifndef_macro = e->once = 0;
    dynarray_add(&s1->cached_includes, &s1->nb_cached_includes, e);
    e->hash_next = s1->cached_includes_hash[h];
    s1->cached_includes_hash[h] = s1->nb_cached_includes;
    return e;
}

static void preprocess(int is_bof) {
    TCCState *s1 = tcc_state;
    int i, c, n, saved_parse_flags;
    char buf[1024], *q;
    Sym *s;
    saved_parse_flags = parse_flags;
    parse_flags = 0x0001
        | 0x0002
        | 0x0040
        | 0x0004
        | (parse_flags & 0x0008)
        ;
    next_nomacro();
 redo:
    switch(tok) {
    case TOK_DEFINE:
        pp_debug_tok = tok;
        next_nomacro();
        pp_debug_symv = tok;
        parse_define();
        break;
    case TOK_UNDEF:
        pp_debug_tok = tok;
        next_nomacro();
        pp_debug_symv = tok;
        s = define_find(tok);
        if (s)
            define_undef(s);
        break;
    case TOK_INCLUDE:
    case TOK_INCLUDE_NEXT:
        ch = file->buf_ptr[0];
        skip_spaces();
        if (ch == '<') {
            c = '>';
            goto read_name;
        } else if (ch == '\"') {
            c = ch;
        read_name:
            inp();
            q = buf;
            while (ch != c && ch != '\n' && ch != (-1)) {
                if ((q - buf) < sizeof(buf) - 1)
                    *q++ = ch;
                if (ch == '\\') {
                    if (handle_stray_noerror() == 0)
                        --q;
                } else
                    inp();
            }
            *q = '\0';
            minp();
        } else {
	    int len;
	    parse_flags = (0x0001
			   | 0x0004
			   | (parse_flags & 0x0008));
            next();
            buf[0] = '\0';
	    while (tok != 10) {
		pstrcat(buf, sizeof(buf), get_tok_str(tok, &tokc));
		next();
	    }
	    len = strlen(buf);
	    if ((len < 2 || ((buf[0] != '"' || buf[len-1] != '"') &&
			     (buf[0] != '<' || buf[len-1] != '>'))))
	        tcc_error("'#include' expects \"FILENAME\" or <FILENAME>");
	    c = buf[len-1];
	    memmove(buf, buf + 1, len - 2);
	    buf[len - 2] = '\0';
        }
        if (s1->include_stack_ptr >= s1->include_stack + 32)
            tcc_error("#include recursion too deep");
        *s1->include_stack_ptr = file;
        i = tok == TOK_INCLUDE_NEXT ? file->include_next_index : 0;
        n = 2 + s1->nb_include_paths;
        for (; i < n; ++i) {
            char buf1[sizeof file->filename];
            CachedInclude *e;
            const char *path;
            if (i == 0) {
                if (!(buf[0] == '/'))
                    continue;
                buf1[0] = 0;

            } else if (i == 1) {
                if (c != '\"')
                    continue;
                path = file->true_filename;
                pstrncpy(buf1, path, tcc_basename(path) - path);
            } else {
                int j = i - 2, k = j - s1->nb_include_paths;
                path = s1->include_paths[j];
                pstrcpy(buf1, sizeof(buf1), path);
                pstrcat(buf1, sizeof(buf1), "/");
            }
            pstrcat(buf1, sizeof(buf1), buf);
            e = search_cached_include(s1, buf1, 0);
            if (e && (define_find(e->ifndef_macro) || e->once == pp_once)) {
                goto include_done;
            }
            if (tcc_open(s1, buf1) < 0)
                continue;
            file->include_next_index = i + 1;
            dynarray_add(&s1->target_deps, &s1->nb_target_deps,
                    tcc_strdup(buf1));
            ++s1->include_stack_ptr;
            tok_flags |= 0x0002 | 0x0001;
            ch = file->buf_ptr[0];
            goto the_end;
        }
        tcc_error("include file '%s' not found", buf);
include_done:
        break;
    case TOK_IFNDEF:
        c = 1;
        goto do_ifdef;
    case TOK_IF:
        c = expr_preprocess();
        goto do_if;
    case TOK_IFDEF:
        c = 0;
    do_ifdef:
        next_nomacro();
        if (tok < 256)
            tcc_error("invalid argument for '#if%sdef'", c ? "n" : "");
        if (is_bof) {
            if (c) {
                file->ifndef_macro = tok;
            }
        }
        c = (define_find(tok) != 0) ^ c;
    do_if:
        if (s1->ifdef_stack_ptr >= s1->ifdef_stack + 64)
            tcc_error("memory full (ifdef)");
        *s1->ifdef_stack_ptr++ = c;
        goto test_skip;
    case TOK_ELSE:
        if (s1->ifdef_stack_ptr == s1->ifdef_stack)
            tcc_error("#else without matching #if");
        if (s1->ifdef_stack_ptr[-1] & 2)
            tcc_error("#else after #else");
        c = (s1->ifdef_stack_ptr[-1] ^= 3);
        goto test_else;
    case TOK_ELIF:
        if (s1->ifdef_stack_ptr == s1->ifdef_stack)
            tcc_error("#elif without matching #if");
        c = s1->ifdef_stack_ptr[-1];
        if (c > 1)
            tcc_error("#elif after #else");
        if (c == 1) {
            c = 0;
        } else {
            c = expr_preprocess();
            s1->ifdef_stack_ptr[-1] = c;
        }
    test_else:
        if (s1->ifdef_stack_ptr == file->ifdef_stack_ptr + 1)
            file->ifndef_macro = 0;
    test_skip:
        if (!(c & 1)) {
            preprocess_skip();
            is_bof = 0;
            goto redo;
        }
        break;
    case TOK_ENDIF:
        if (s1->ifdef_stack_ptr <= file->ifdef_stack_ptr)
            tcc_error("#endif without matching #if");
        s1->ifdef_stack_ptr--;
        if (file->ifndef_macro &&
            s1->ifdef_stack_ptr == file->ifdef_stack_ptr) {
            file->ifndef_macro_saved = file->ifndef_macro;
            file->ifndef_macro = 0;
            while (tok != 10)
                next_nomacro();
            tok_flags |= 0x0004;
            goto the_end;
        }
        break;
    case 0xbe:
        n = strtoul((char*)tokc.str.data, &q, 10);
        goto _line_num;
    case TOK_LINE:
        next();
        if (tok != 0xb5)
    _line_err:
            tcc_error("wrong #line format");
        n = tokc.i;
    _line_num:
        next();
        if (tok != 10) {
            if (tok == 0xb9) {
                if (file->true_filename == file->filename)
                    file->true_filename = tcc_strdup(file->filename);
                pstrcpy(file->filename, sizeof(file->filename), (char *)tokc.str.data);
            } else if (parse_flags & 0x0008)
                break;
            else
                goto _line_err;
            --n;
        }
        if (file->fd > 0)
            total_lines += file->line_num - n;
        file->line_num = n;
        break;
    case TOK_ERROR:
    case TOK_WARNING:
        c = tok;
        ch = file->buf_ptr[0];
        skip_spaces();
        q = buf;
        while (ch != '\n' && ch != (-1)) {
            if ((q - buf) < sizeof(buf) - 1)
                *q++ = ch;
            if (ch == '\\') {
                if (handle_stray_noerror() == 0)
                    --q;
            } else
                inp();
        }
        *q = '\0';
        if (c == TOK_ERROR)
            tcc_error("#error %s", buf);
        else
            tcc_warning("#warning %s", buf);
        break;
    case 10:
        goto the_end;
    default:
        if (saved_parse_flags & 0x0008)
            goto ignore;
        if (tok == '!' && is_bof)
            goto ignore;
        tcc_warning("Ignoring unknown preprocessing directive #%s", get_tok_str(tok, &tokc));
    ignore:
        file->buf_ptr = parse_line_comment(file->buf_ptr - 1);
        goto the_end;
    }
    while (tok != 10)
        next_nomacro();
 the_end:
    parse_flags = saved_parse_flags;
}

static void parse_escape_string(CString *outstr, const uint8_t *buf, int is_long) {
    int c, n;
    const uint8_t *p;
    p = buf;
    for(;;) {
        c = *p;
        if (c == '\0')
            break;
        if (c == '\\') {
            p++;
            c = *p;
            switch(c) {
            case '0': case '1': case '2': case '3':
            case '4': case '5': case '6': case '7':
                n = c - '0';
                p++;
                c = *p;
                if (isoct(c)) {
                    n = n * 8 + c - '0';
                    p++;
                    c = *p;
                    if (isoct(c)) {
                        n = n * 8 + c - '0';
                        p++;
                    }
                }
                c = n;
                goto add_char_nonext;
            case 'x':
            case 'u':
            case 'U':
                p++;
                n = 0;
                for(;;) {
                    c = *p;
                    if (c >= 'a' && c <= 'f')
                        c = c - 'a' + 10;
                    else if (c >= 'A' && c <= 'F')
                        c = c - 'A' + 10;
                    else if (isnum(c))
                        c = c - '0';
                    else
                        break;
                    n = n * 16 + c;
                    p++;
                }
                c = n;
                goto add_char_nonext;
            case 'a':
                c = '\a';
                break;
            case 'b':
                c = '\b';
                break;
            case 'f':
                c = '\f';
                break;
            case 'n':
                c = '\n';
                break;
            case 'r':
                c = '\r';
                break;
            case 't':
                c = '\t';
                break;
            case 'v':
                c = '\v';
                break;
            case 'e':
                if (!gnu_ext)
                    goto invalid_escape;
                c = 27;
                break;
            case '\'':
            case '\"':
            case '\\':
            case '?':
                break;
            default:
            invalid_escape:
                if (c >= '!' && c <= '~')
                    tcc_warning("unknown escape sequence: \'\\%c\'", c);
                else
                    tcc_warning("unknown escape sequence: \'\\x%x\'", c);
                break;
            }
        } else if (is_long && c >= 0x80) {
            int cont;
            int skip;
            int i;
            if (c < 0xC2) {
	            skip = 1; goto invalid_utf8_sequence;
            } else if (c <= 0xDF) {
	            cont = 1; n = c & 0x1f;
            } else if (c <= 0xEF) {
	            cont = 2; n = c & 0xf;
            } else if (c <= 0xF4) {
	            cont = 3; n = c & 0x7;
            } else {
	            skip = 1; goto invalid_utf8_sequence;
            }
            for (i = 1; i <= cont; i++) {
                int l = 0x80, h = 0xBF;
                if (i == 1) {
                    switch (c) {
                    case 0xE0: l = 0xA0; break;
                    case 0xED: h = 0x9F; break;
                    case 0xF0: l = 0x90; break;
                    case 0xF4: h = 0x8F; break;
                    }
                }
                if (p[i] < l || p[i] > h) {
                    skip = i; goto invalid_utf8_sequence;
                }

                n = (n << 6) | (p[i] & 0x3f);
            }
            p += 1 + cont;
            c = n;
            goto add_char_nonext;
        invalid_utf8_sequence:
            tcc_warning("ill-formed UTF-8 subsequence starting with: \'\\x%x\'", c);
            c = 0xFFFD;
            p += skip;
            goto add_char_nonext;
        }
        p++;
    add_char_nonext:
        if (!is_long)
            cstr_ccat(outstr, c);
        else {
            cstr_wccat(outstr, c);
        }
    }
    if (!is_long)
        cstr_ccat(outstr, '\0');
    else
        cstr_wccat(outstr, '\0');
}

static void parse_string(const char *s, int len) {
    uint8_t buf[1000], *p = buf;
    int is_long, sep;

    if ((is_long = *s == 'L'))
        ++s, --len;
    sep = *s++;
    len -= 2;
    if (len >= sizeof buf)
        p = tcc_malloc(len + 1);
    memcpy(p, s, len);
    p[len] = 0;
    cstr_reset(&tokcstr);
    parse_escape_string(&tokcstr, p, is_long);
    if (p != buf)
        tcc_free(p);
    if (sep == '\'') {
        int char_size, i, n, c;

        if (!is_long)
            tok = 0xb3, char_size = 1;
        else
            tok = 0xb4, char_size = sizeof(nwchar_t);
        n = tokcstr.size / char_size - 1;
        if (n < 1)
            tcc_error("empty character constant");
        if (n > 1)
            tcc_warning("multi-character character constant");
        for (c = i = 0; i < n; ++i) {
            if (is_long)
                c = ((nwchar_t *)tokcstr.data)[i];
            else
                c = (c << 8) | ((char *)tokcstr.data)[i];
        }
        tokc.i = c;
    } else {
        tokc.str.size = tokcstr.size;
        tokc.str.data = tokcstr.data;
        if (!is_long)
            tok = 0xb9;
        else
            tok = 0xba;
    }
}

static void bn_lshift(unsigned int *bn, int shift, int or_val) {
    int i;
    unsigned int v;
    for(i=0;i<2;i++) {
        v = bn[i];
        bn[i] = (v << shift) | or_val;
        or_val = v >> (32 - shift);
    }
}

static void bn_zero(unsigned int *bn) {
    int i;
    for(i=0;i<2;i++) {
        bn[i] = 0;
    }
}

static void parse_number(const char *p) {
    int b, t, shift, frac_bits, s, exp_val, ch;
    char *q;
    unsigned int bn[2];
    double d;
    q = token_buf;
    ch = *p++;
    t = ch;
    ch = *p++;
    *q++ = t;
    b = 10;
    if (t == '.') {
        goto float_frac_parse;
    } else if (t == '0') {
        if (ch == 'x' || ch == 'X') {
            q--;
            ch = *p++;
            b = 16;
        } else if (tcc_ext && (ch == 'b' || ch == 'B')) {
            q--;
            ch = *p++;
            b = 2;
        }
    }
    while (1) {
        if (ch >= 'a' && ch <= 'f')
            t = ch - 'a' + 10;
        else if (ch >= 'A' && ch <= 'F')
            t = ch - 'A' + 10;
        else if (isnum(ch))
            t = ch - '0';
        else
            break;
        if (t >= b)
            break;
        if (q >= token_buf + 1024) {
        num_too_long:
            tcc_error("number too long");
        }
        *q++ = ch;
        ch = *p++;
    }
    if (ch == '.' ||
        ((ch == 'e' || ch == 'E') && b == 10) ||
        ((ch == 'p' || ch == 'P') && (b == 16 || b == 2))) {
        if (b != 10) {
            *q = '\0';
            if (b == 16)
                shift = 4;
            else
                shift = 1;
            bn_zero(bn);
            q = token_buf;
            while (1) {
                t = *q++;
                if (t == '\0') {
                    break;
                } else if (t >= 'a') {
                    t = t - 'a' + 10;
                } else if (t >= 'A') {
                    t = t - 'A' + 10;
                } else {
                    t = t - '0';
                }
                bn_lshift(bn, shift, t);
            }
            frac_bits = 0;
            if (ch == '.') {
                ch = *p++;
                while (1) {
                    t = ch;
                    if (t >= 'a' && t <= 'f') {
                        t = t - 'a' + 10;
                    } else if (t >= 'A' && t <= 'F') {
                        t = t - 'A' + 10;
                    } else if (t >= '0' && t <= '9') {
                        t = t - '0';
                    } else {
                        break;
                    }
                    if (t >= b)
                        tcc_error("invalid digit");
                    bn_lshift(bn, shift, t);
                    frac_bits += shift;
                    ch = *p++;
                }
            }
            if (ch != 'p' && ch != 'P')
                expect("exponent");
            ch = *p++;
            s = 1;
            exp_val = 0;
            if (ch == '+') {
                ch = *p++;
            } else if (ch == '-') {
                s = -1;
                ch = *p++;
            }
            if (ch < '0' || ch > '9')
                expect("exponent digits");
            while (ch >= '0' && ch <= '9') {
                exp_val = exp_val * 10 + ch - '0';
                ch = *p++;
            }
            exp_val = exp_val * s;
            d = (double)bn[1] * 4294967296.0 + (double)bn[0];
            d = ldexp(d, exp_val - frac_bits);
            t = toup(ch);
            if (t == 'F') {
                ch = *p++;
                tok = 0xbb;
                tokc.f = (float)d;
            } else if (t == 'L') {
                ch = *p++;
                tok = 0xbd;
                tokc.ld = (long double)d;
            } else {
                tok = 0xbc;
                tokc.d = d;
            }
        } else {
            if (ch == '.') {
                if (q >= token_buf + 1024)
                    goto num_too_long;
                *q++ = ch;
                ch = *p++;
            float_frac_parse:
                while (ch >= '0' && ch <= '9') {
                    if (q >= token_buf + 1024)
                        goto num_too_long;
                    *q++ = ch;
                    ch = *p++;
                }
            }
            if (ch == 'e' || ch == 'E') {
                if (q >= token_buf + 1024)
                    goto num_too_long;
                *q++ = ch;
                ch = *p++;
                if (ch == '-' || ch == '+') {
                    if (q >= token_buf + 1024)
                        goto num_too_long;
                    *q++ = ch;
                    ch = *p++;
                }
                if (ch < '0' || ch > '9')
                    expect("exponent digits");
                while (ch >= '0' && ch <= '9') {
                    if (q >= token_buf + 1024)
                        goto num_too_long;
                    *q++ = ch;
                    ch = *p++;
                }
            }
            *q = '\0';
            t = toup(ch);
            if (t == 'F') {
                ch = *p++;
                tok = 0xbb;
                tokc.f = strtof(token_buf, ((void*)0));
            } else if (t == 'L') {
                ch = *p++;
                tok = 0xbd;
                tokc.ld = strtold(token_buf, ((void*)0));
            } else {
                tok = 0xbc;
                tokc.d = strtod(token_buf, ((void*)0));
            }
        }
    } else {
        unsigned long long n, n1;
        int lcount, ucount, ov = 0;
        const char *p1;
        *q = '\0';
        q = token_buf;
        if (b == 10 && *q == '0') {
            b = 8;
            q++;
        }
        n = 0;
        while(1) {
            t = *q++;
            if (t == '\0')
                break;
            else if (t >= 'a')
                t = t - 'a' + 10;
            else if (t >= 'A')
                t = t - 'A' + 10;
            else
                t = t - '0';
            if (t >= b)
                tcc_error("invalid digit");
            n1 = n;
            n = n * b + t;
            if (n1 >= 0x1000000000000000ULL && n / b != n1)
                ov = 1;
        }
        lcount = ucount = 0;
        p1 = p;
        for(;;) {
            t = toup(ch);
            if (t == 'L') {
                if (lcount >= 2)
                    tcc_error("three 'l's in integer constant");
                if (lcount && *(p - 1) != ch)
                    tcc_error("incorrect integer suffix: %s", p1);
                lcount++;
                ch = *p++;
            } else if (t == 'U') {
                if (ucount >= 1)
                    tcc_error("two 'u's in integer constant");
                ucount++;
                ch = *p++;
            } else {
                break;
            }
        }
        if (ucount == 0 && b == 10) {
            if (lcount <= (4 == 4)) {
                if (n >= 0x80000000U)
                    lcount = (4 == 4) + 1;
            }
            if (n >= 0x8000000000000000ULL)
                ov = 1, ucount = 1;
        } else {
            if (lcount <= (4 == 4)) {
                if (n >= 0x100000000ULL)
                    lcount = (4 == 4) + 1;
                else if (n >= 0x80000000U)
                    ucount = 1;
            }
            if (n >= 0x8000000000000000ULL)
                ucount = 1;
        }
        if (ov)
            tcc_warning("integer constant overflow");
        tok = 0xb5;
	if (lcount) {
            tok = 0xce;
            if (lcount == 2)
                tok = 0xb7;
	}
	if (ucount)
	    ++tok;
        tokc.i = n;
    }
    if (ch)
        tcc_error("invalid number\n");
}

static inline void next_nomacro1(void)
{
    int t, c, is_long, len;
    TokenSym *ts;
    uint8_t *p, *p1;
    unsigned int h;
    p = file->buf_ptr;
 redo_no_start:
    c = *p;
    switch(c) {
    case ' ':
    case '\t':
        tok = c;
        p++;
        if (parse_flags & 0x0010)
            goto keep_tok_flags;
        while (isidnum_table[*p - (-1)] & 1)
            ++p;
        goto redo_no_start;
    case '\f':
    case '\v':
    case '\r':
        p++;
        goto redo_no_start;
    case '\\':
        c = handle_stray1(p);
        p = file->buf_ptr;
        if (c == '\\')
            goto parse_simple;
        if (c != (-1))
            goto redo_no_start;
        {
            TCCState *s1 = tcc_state;
            if ((parse_flags & 0x0004)
                && !(tok_flags & 0x0008)) {
                tok_flags |= 0x0008;
                tok = 10;
                goto keep_tok_flags;
            } else if (!(parse_flags & 0x0001)) {
                tok = (-1);
            } else if (s1->ifdef_stack_ptr != file->ifdef_stack_ptr) {
                tcc_error("missing #endif");
            } else if (s1->include_stack_ptr == s1->include_stack) {

                tok = (-1);
            } else {
                tok_flags &= ~0x0008;
                if (tok_flags & 0x0004) {
                    search_cached_include(s1, file->filename, 1)
                        ->ifndef_macro = file->ifndef_macro_saved;
                    tok_flags &= ~0x0004;
                }
                tcc_close();
                s1->include_stack_ptr--;
                p = file->buf_ptr;
                if (p == file->buffer)
                    tok_flags = 0x0002|0x0001;
                goto redo_no_start;
            }
        }
        break;
    case '\n':
        file->line_num++;
        tok_flags |= 0x0001;
        p++;
maybe_newline:
        if (0 == (parse_flags & 0x0004))
            goto redo_no_start;
        tok = 10;
        goto keep_tok_flags;
    case '#':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if ((tok_flags & 0x0001) &&
            (parse_flags & 0x0001)) {
            file->buf_ptr = p;
            preprocess(tok_flags & 0x0002);
            p = file->buf_ptr;
            goto maybe_newline;
        } else {
            if (c == '#') {
                p++;
                tok = 0xca;
            } else {
                if (parse_flags & 0x0008) {
                    p = parse_line_comment(p - 1);
                    goto redo_no_start;
                } else {
                    tok = '#';
                }
            }
        }
        break;
    case '$':
        if (!(isidnum_table[c - (-1)] & 2)
         || (parse_flags & 0x0008))
            goto parse_simple;
    case 'a': case 'b': case 'c': case 'd':
    case 'e': case 'f': case 'g': case 'h':
    case 'i': case 'j': case 'k': case 'l':
    case 'm': case 'n': case 'o': case 'p':
    case 'q': case 'r': case 's': case 't':
    case 'u': case 'v': case 'w': case 'x':
    case 'y': case 'z':
    case 'A': case 'B': case 'C': case 'D':
    case 'E': case 'F': case 'G': case 'H':
    case 'I': case 'J': case 'K':
    case 'M': case 'N': case 'O': case 'P':
    case 'Q': case 'R': case 'S': case 'T':
    case 'U': case 'V': case 'W': case 'X':
    case 'Y': case 'Z':
    case '_':
    parse_ident_fast:
        p1 = p;
        h = 1;
        h = ((h) + ((h) << 5) + ((h) >> 27) + (c));
        while (c = *++p, isidnum_table[c - (-1)] & (2|4))
            h = ((h) + ((h) << 5) + ((h) >> 27) + (c));
        len = p - p1;
        if (c != '\\') {
            TokenSym **pts;
            h &= (16384 - 1);
            pts = &hash_ident[h];
            for(;;) {
                ts = *pts;
                if (!ts)
                    break;
                if (ts->len == len && !memcmp(ts->str, p1, len))
                    goto token_found;
                pts = &(ts->hash_next);
            }
            ts = tok_alloc_new(pts, (char *) p1, len);
        token_found: ;
        } else {
            cstr_reset(&tokcstr);
            cstr_cat(&tokcstr, (char *) p1, len);
            p--;
            { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        parse_ident_slow:
            while (isidnum_table[c - (-1)] & (2|4))
            {
                cstr_ccat(&tokcstr, c);
                { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
            }
            ts = tok_alloc(tokcstr.data, tokcstr.size);
        }
        tok = ts->tok;
        break;
    case 'L':
        t = p[1];
        if (t != '\\' && t != '\'' && t != '\"') {
            goto parse_ident_fast;
        } else {
            { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
            if (c == '\'' || c == '\"') {
                is_long = 1;
                goto str_const;
            } else {
                cstr_reset(&tokcstr);
                cstr_ccat(&tokcstr, 'L');
                goto parse_ident_slow;
            }
        }
        break;
    case '0': case '1': case '2': case '3':
    case '4': case '5': case '6': case '7':
    case '8': case '9':
        t = c;
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
    parse_num:
        cstr_reset(&tokcstr);
        for(;;) {
            cstr_ccat(&tokcstr, t);
            if (!((isidnum_table[c - (-1)] & (2|4))
                  || c == '.'
                  || ((c == '+' || c == '-')
                      && (((t == 'e' || t == 'E')
                            && !(parse_flags & 0x0008
                                && ((char*)tokcstr.data)[0] == '0'
                                && toup(((char*)tokcstr.data)[1]) == 'X'))
                          || t == 'p' || t == 'P'))))
                break;
            t = c;
            { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        }
        cstr_ccat(&tokcstr, '\0');
        tokc.str.size = tokcstr.size;
        tokc.str.data = tokcstr.data;
        tok = 0xbe;
        break;
    case '.':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (isnum(c)) {
            t = '.';
            goto parse_num;
        } else if ((isidnum_table['.' - (-1)] & 2)
                   && (isidnum_table[c - (-1)] & (2|4))) {
            *--p = c = '.';
            goto parse_ident_fast;
        } else if (c == '.') {
            { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
            if (c == '.') {
                p++;
                tok = 0xc8;
            } else {
                *--p = '.';
                tok = '.';
            }
        } else {
            tok = '.';
        }
        break;
    case '\'':
    case '\"':
        is_long = 0;
    str_const:
        cstr_reset(&tokcstr);
        if (is_long)
            cstr_ccat(&tokcstr, 'L');
        cstr_ccat(&tokcstr, c);
        p = parse_pp_string(p, c, &tokcstr);
        cstr_ccat(&tokcstr, c);
        cstr_ccat(&tokcstr, '\0');
        tokc.str.size = tokcstr.size;
        tokc.str.data = tokcstr.data;
        tok = 0xbf;
        break;
    case '<':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (c == '=') {
            p++;
            tok = 0x9e;
        } else if (c == '<') {
            { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
            if (c == '=') {
                p++;
                tok = 0x81;
            } else {
                tok = 0x01;
            }
        } else {
            tok = 0x9c;
        }
        break;
    case '>':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (c == '=') {
            p++;
            tok = 0x9d;
        } else if (c == '>') {
            { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
            if (c == '=') {
                p++;
                tok = 0x82;
            } else {
                tok = 0x02;
            }
        } else {
            tok = 0x9f;
        }
        break;
    case '&':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (c == '&') {
            p++;
            tok = 0xa0;
        } else if (c == '=') {
            p++;
            tok = 0xa6;
        } else {
            tok = '&';
        }
        break;
    case '|':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (c == '|') {
            p++;
            tok = 0xa1;
        } else if (c == '=') {
            p++;
            tok = 0xfc;
        } else {
            tok = '|';
        }
        break;
    case '+':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (c == '+') {
            p++;
            tok = 0xa4;
        } else if (c == '=') {
            p++;
            tok = 0xab;
        } else {
            tok = '+';
        }
        break;
    case '-':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (c == '-') {
            p++;
            tok = 0xa2;
        } else if (c == '=') {
            p++;
            tok = 0xad;
        } else if (c == '>') {
            p++;
            tok = 0xc7;
        } else {
            tok = '-';
        }
        break;
    case '!': { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }}; if (c == '=') { p++; tok = 0x95; } else { tok = '!'; } break;
    case '=': { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }}; if (c == '=') { p++; tok = 0x94; } else { tok = '='; } break;
    case '*': { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }}; if (c == '=') { p++; tok = 0xaa; } else { tok = '*'; } break;
    case '%': { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }}; if (c == '=') { p++; tok = 0xa5; } else { tok = '%'; } break;
    case '^': { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }}; if (c == '=') { p++; tok = 0xde; } else { tok = '^'; } break;
    case '/':
        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
        if (c == '*') {
            p = parse_comment(p);
            tok = ' ';
            goto keep_tok_flags;
        } else if (c == '/') {
            p = parse_line_comment(p);
            tok = ' ';
            goto keep_tok_flags;
        } else if (c == '=') {
            p++;
            tok = 0xaf;
        } else {
            tok = '/';
        }
        break;
    case '(':
    case ')':
    case '[':
    case ']':
    case '{':
    case '}':
    case ',':
    case ';':
    case ':':
    case '?':
    case '~':
    case '@':
    parse_simple:
        tok = c;
        p++;
        break;
    default:
        if (c >= 0x80 && c <= 0xFF)
	    goto parse_ident_fast;
        if (parse_flags & 0x0008)
            goto parse_simple;
        tcc_error("unrecognized character \\x%02x", c);
        break;
    }
    tok_flags = 0;
keep_tok_flags:
    file->buf_ptr = p;
}

static void next_nomacro_spc(void) {
    if (macro_ptr) {
    redo:
        tok = *macro_ptr;
        if (tok) {
            TOK_GET(&tok, &macro_ptr, &tokc);
            if (tok == 0xc0) {
                file->line_num = tokc.i;
                goto redo;
            }
        }
    } else {
        next_nomacro1();
    }

}

static void next_nomacro(void) {
    do {
        next_nomacro_spc();
    } while (tok < 256 && (isidnum_table[tok - (-1)] & 1));
}

static void macro_subst(
    TokenString *tok_str,
    Sym **nested_list,
    const int *macro_str
    );

static int *macro_arg_subst(Sym **nested_list, const int *macro_str, Sym *args) {
    int t, t0, t1, spc;
    const int *st;
    Sym *s;
    CValue cval;
    TokenString str;
    CString cstr;
    tok_str_new(&str);
    t0 = t1 = 0;
    while(1) {
        TOK_GET(&t, &macro_str, &cval);
        if (!t)
            break;
        if (t == '#') {
            TOK_GET(&t, &macro_str, &cval);
            if (!t)
                goto bad_stringy;
            s = sym_find2(args, t);
            if (s) {
                cstr_new(&cstr);
                cstr_ccat(&cstr, '\"');
                st = s->d;
                spc = 0;
                while (*st >= 0) {
                    TOK_GET(&t, &st, &cval);
                    if (t != 0xcb
                     && t != 0xcc
                     && 0 == check_space(t, &spc)) {
                        const char *s = get_tok_str(t, &cval);
                        while (*s) {
                            if (t == 0xbf && *s != '\'')
                                add_char(&cstr, *s);
                            else
                                cstr_ccat(&cstr, *s);
                            ++s;
                        }
                    }
                }
                cstr.size -= spc;
                cstr_ccat(&cstr, '\"');
                cstr_ccat(&cstr, '\0');
                cval.str.size = cstr.size;
                cval.str.data = cstr.data;
                tok_str_add2(&str, 0xbf, &cval);
                cstr_free(&cstr);
            } else {
        bad_stringy:
                expect("macro parameter after '#'");
            }
        } else if (t >= 256) {
            s = sym_find2(args, t);
            if (s) {
                int l0 = str.len;
                st = s->d;
                if (*macro_str == 0xcd || t1 == 0xcd) {
                    if (t1 == 0xcd && t0 == ',' && gnu_ext && s->type.t) {
                        if (*st <= 0) {

                            str.len -= 2;
                        } else {
                            str.len--;
                            goto add_var;
                        }
                    }
                } else {
            add_var:
		    if (!s->next) {
			TokenString str2;
			sym_push2(&s->next, s->v, s->type.t, 0);
			tok_str_new(&str2);
			macro_subst(&str2, nested_list, st);
			tok_str_add(&str2, 0);
			s->next->d = str2.str;
		    }
		    st = s->next->d;
                }
                for(;;) {
                    int t2;
                    TOK_GET(&t2, &st, &cval);
                    if (t2 <= 0)
                        break;
                    tok_str_add2(&str, t2, &cval);
                }
                if (str.len == l0)
                    tok_str_add(&str, 0xcb);
            } else {
                tok_str_add(&str, t);
            }
        } else {
            tok_str_add2(&str, t, &cval);
        }
        t0 = t1, t1 = t;
    }
    tok_str_add(&str, 0);
    return str.str;
}

static char const ab_month_name[12][4] =
{
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
};

static int paste_tokens(int t1, CValue *v1, int t2, CValue *v2) {
    CString cstr;
    int n, ret = 1;
    cstr_new(&cstr);
    if (t1 != 0xcb)
        cstr_cat(&cstr, get_tok_str(t1, v1), -1);
    n = cstr.size;
    if (t2 != 0xcb)
        cstr_cat(&cstr, get_tok_str(t2, v2), -1);
    cstr_ccat(&cstr, '\0');
    tcc_open_bf(tcc_state, ":paste:", cstr.size);
    memcpy(file->buffer, cstr.data, cstr.size);
    tok_flags = 0;
    for (;;) {
        next_nomacro1();
        if (0 == *file->buf_ptr)
            break;
        if (is_space(tok))
            continue;
        tcc_warning("pasting \"%.*s\" and \"%s\" does not give a valid"
            " preprocessing token", n, cstr.data, (char*)cstr.data + n);
        ret = 0;
        break;
    }
    tcc_close();
    cstr_free(&cstr);
    return ret;
}

static inline int *macro_twosharps(const int *ptr0) {
    int t;
    CValue cval;
    TokenString macro_str1;
    int start_of_nosubsts = -1;
    const int *ptr;
    for (ptr = ptr0;;) {
        TOK_GET(&t, &ptr, &cval);
        if (t == 0xcd)
            break;
        if (t == 0)
            return ((void*)0);
    }
    tok_str_new(&macro_str1);
    for (ptr = ptr0;;) {
        TOK_GET(&t, &ptr, &cval);
        if (t == 0)
            break;
        if (t == 0xcd)
            continue;
        while (*ptr == 0xcd) {
            int t1; CValue cv1;
            if (start_of_nosubsts >= 0)
                macro_str1.len = start_of_nosubsts;
            while ((t1 = *++ptr) == 0xcc) ;
            if (t1 && t1 != 0xcd) {
                TOK_GET(&t1, &ptr, &cv1);
                if (t != 0xcb || t1 != 0xcb) {
                    if (paste_tokens(t, &cval, t1, &cv1)) {
                        t = tok, cval = tokc;
                    } else {
                        tok_str_add2(&macro_str1, t, &cval);
                        t = t1, cval = cv1;
                    }
                }
            }
        }
        if (t == 0xcc) {
            if (start_of_nosubsts < 0)
                start_of_nosubsts = macro_str1.len;
        } else {
            start_of_nosubsts = -1;
        }
        tok_str_add2(&macro_str1, t, &cval);
    }
    tok_str_add(&macro_str1, 0);
    return macro_str1.str;
}

static int next_argstream(Sym **nested_list, TokenString *ws_str) {
    int t;
    const int *p;
    Sym *sa;

    for (;;) {
        if (macro_ptr) {
            p = macro_ptr, t = *p;
            if (ws_str) {
                while (is_space(t) || 10 == t || 0xcb == t)
                    tok_str_add(ws_str, t), t = *++p;
            }
            if (t == 0) {
                end_macro();
                sa = *nested_list;
                while (sa && sa->v == 0)
                    sa = sa->prev;
                if (sa)
                    sa->v = 0;
                continue;
            }
        } else {
            ch = handle_eob();
            if (ws_str) {
                while (is_space(ch) || ch == '\n' || ch == '/') {
                    if (ch == '/') {
                        int c;
                        uint8_t *p = file->buf_ptr;
                        { p++; c = *p; if (c == '\\') { c = handle_stray1(p); p = file->buf_ptr; }};
                        if (c == '*') {
                            p = parse_comment(p);
                            file->buf_ptr = p - 1;
                        } else if (c == '/') {
                            p = parse_line_comment(p);
                            file->buf_ptr = p - 1;
                        } else
                            break;
                        ch = ' ';
                    }
                    if (ch == '\n')
                        file->line_num++;
                    if (!(ch == '\f' || ch == '\v' || ch == '\r'))
                        tok_str_add(ws_str, ch);
                    minp();
                }
            }
            t = ch;
        }
        if (ws_str)
            return t;
        next_nomacro_spc();
        return tok;
    }
}

static int macro_subst_tok( TokenString *tok_str, Sym **nested_list, Sym *s) {
    Sym *args, *sa, *sa1;
    int parlevel, t, t1, spc;
    TokenString str;
    char *cstrval;
    CValue cval;
    CString cstr;
    char buf[32];
    if (tok == TOK___LINE__ || tok == TOK___COUNTER__) {
        t = tok == TOK___LINE__ ? file->line_num : pp_counter++;
        snprintf(buf, sizeof(buf), "%d", t);
        cstrval = buf;
        t1 = 0xbe;
        goto add_cstr1;
    } else if (tok == TOK___FILE__) {
        cstrval = file->filename;
        t1 = 0xb9;
    add_cstr1:
        cstr_new(&cstr);
        cstr_cat(&cstr, cstrval, 0);
        cval.str.size = cstr.size;
        cval.str.data = cstr.data;
        tok_str_add2(tok_str, t1, &cval);
        cstr_free(&cstr);
    } else if (s->d) {
        int saved_parse_flags = parse_flags;
	int *joined_str = ((void*)0);
        int *mstr = s->d;
        if (s->type.t == 1) {
            TokenString ws_str;
            tok_str_new(&ws_str);
            spc = 0;
            parse_flags |= 0x0010 | 0x0004
                | 0x0020;
            t = next_argstream(nested_list, &ws_str);
            if (t != '(') {
                parse_flags = saved_parse_flags;
                tok_str_add(tok_str, tok);
                if (parse_flags & 0x0010) {
                    int i;
                    for (i = 0; i < ws_str.len; i++)
                        tok_str_add(tok_str, ws_str.str[i]);
                }
                tok_str_free_str(ws_str.str);
                return 0;
            } else {
                tok_str_free_str(ws_str.str);
            }
	    do {
		next_nomacro();
	    } while (tok == 0xcb);
            args = ((void*)0);
            sa = s->next;
            for(;;) {
                do {
                    next_argstream(nested_list, ((void*)0));
                } while (is_space(tok) || 10 == tok);
    empty_arg:
                if (!args && !sa && tok == ')')
                    break;
                if (!sa)
                    tcc_error("macro '%s' used with too many args",
                          get_tok_str(s->v, 0));
                tok_str_new(&str);
                parlevel = spc = 0;
                while ((parlevel > 0 ||
                        (tok != ')' &&
                         (tok != ',' || sa->type.t)))) {
                    if (tok == (-1) || tok == 0)
                        break;
                    if (tok == '(')
                        parlevel++;
                    else if (tok == ')')
                        parlevel--;
                    if (tok == 10)
                        tok = ' ';
                    if (!check_space(tok, &spc))
                        tok_str_add2(&str, tok, &tokc);
                    next_argstream(nested_list, ((void*)0));
                }
                if (parlevel)
                    expect(")");
                str.len -= spc;
                tok_str_add(&str, -1);
                tok_str_add(&str, 0);
                sa1 = sym_push2(&args, sa->v & ~0x20000000, sa->type.t, 0);
                sa1->d = str.str;
                sa = sa->next;
                if (tok == ')') {
                    if (sa && sa->type.t && gnu_ext)
                        goto empty_arg;
                    break;
                }
                if (tok != ',')
                    expect(",");
            }
            if (sa) {
                tcc_error("macro '%s' used with too few args",
                      get_tok_str(s->v, 0));
            }
            parse_flags = saved_parse_flags;
            mstr = macro_arg_subst(nested_list, mstr, args);
            sa = args;
            while (sa) {
                sa1 = sa->prev;
                tok_str_free_str(sa->d);
                if (sa->next) {
                    tok_str_free_str(sa->next->d);
                    sym_free(sa->next);
                }
                sym_free(sa);
                sa = sa1;
            }
        }
        sym_push2(nested_list, s->v, 0, 0);
        parse_flags = saved_parse_flags;
        joined_str = macro_twosharps(mstr);
        macro_subst(tok_str, nested_list, joined_str ? joined_str : mstr);
        sa1 = *nested_list;
        *nested_list = sa1->prev;
        sym_free(sa1);
	if (joined_str)
	    tok_str_free_str(joined_str);
        if (mstr != s->d)
            tok_str_free_str(mstr);
    }
    return 0;
}

static void macro_subst( TokenString *tok_str, Sym **nested_list, const int *macro_str) {
    Sym *s;
    int t, spc, nosubst;
    CValue cval;
    spc = nosubst = 0;
    while (1) {
        TOK_GET(&t, &macro_str, &cval);
        if (t <= 0)
            break;
        if (t >= 256 && 0 == nosubst) {
            s = define_find(t);
            if (s == ((void*)0))
                goto no_subst;
            if (sym_find2(*nested_list, t)) {
                tok_str_add2(tok_str, 0xcc, ((void*)0));
                goto no_subst;
            }
            TokenString str;
            str.str = (int*)macro_str;
            begin_macro(&str, 2);
            tok = t;
            macro_subst_tok(tok_str, nested_list, s);
            if (str.alloc == 3) {
                break;
            }
            macro_str = macro_ptr;
            end_macro ();
            if (tok_str->len)
                spc = is_space(t = tok_str->str[tok_str->lastlen]);
        } else {
            if (t == '\\' && !(parse_flags & 0x0020))
                tcc_error("stray '\\' in program");
no_subst:
            if (!check_space(t, &spc))
                tok_str_add2(tok_str, t, &cval);

            if (nosubst) {
                if (nosubst > 1 && (spc || (++nosubst == 3 && t == '(')))
                    continue;
                nosubst = 0;
            }
            if (t == 0xcc)
                nosubst = 1;
        }
        if (t == TOK_DEFINED && pp_expr)
            nosubst = 2;
    }
}

static void next(void) {
 redo:
    if (parse_flags & 0x0010){
        next_nomacro_spc();
    } else {
        next_nomacro();
    }
    if (macro_ptr) {
        if (tok == 0xcc || tok == 0xcb) {
            goto redo;
        } else if (tok == 0) {
            end_macro();
            goto redo;
        }
    } else if (tok >= 256 && (parse_flags & 0x0001)) {
        Sym *s;
        s = define_find(tok);
        if (s) {
            Sym *nested_list = ((void*)0);
            tokstr_buf.len = 0;
            macro_subst_tok(&tokstr_buf, &nested_list, s);
            tok_str_add(&tokstr_buf, 0);
            begin_macro(&tokstr_buf, 2);
            goto redo;
        }
    }
    if (tok == 0xbe) {
        if  (parse_flags & 0x0002)
            parse_number((char *)tokc.str.data);
    } else if (tok == 0xbf) {
        if (parse_flags & 0x0040)
            parse_string((char *)tokc.str.data, tokc.str.size - 1);
    }
}

static inline void unget_tok(int last_tok) {
    TokenString *str = tok_str_alloc();
    tok_str_add2(str, tok, &tokc);
    tok_str_add(str, 0);
    begin_macro(str, 1);
    tok = last_tok;
}

static void preprocess_start(TCCState *s1, int is_asm)
{
    CString cstr;
    int i;

    s1->include_stack_ptr = s1->include_stack;
    s1->ifdef_stack_ptr = s1->ifdef_stack;
    file->ifdef_stack_ptr = s1->ifdef_stack_ptr;
    pp_expr = 0;
    pp_counter = 0;
    pp_debug_tok = pp_debug_symv = 0;
    pp_once++;
    pvtop = vtop = (__vstack + 1) - 1;
    s1->pack_stack[0] = 0;
    s1->pack_stack_ptr = s1->pack_stack;

    set_idnum('$', s1->dollars_in_identifiers ? 2 : 0);
    set_idnum('.', is_asm ? 2 : 0);

    cstr_new(&cstr);
    cstr_cat(&cstr, "\"", -1);
    cstr_cat(&cstr, file->filename, -1);
    cstr_cat(&cstr, "\"", 0);
    tcc_define_symbol(s1, "__BASE_FILE__", cstr.data);

    cstr_reset(&cstr);
    for (i = 0; i < s1->nb_cmd_include_files; i++) {
        cstr_cat(&cstr, "#include \"", -1);
        cstr_cat(&cstr, s1->cmd_include_files[i], -1);
        cstr_cat(&cstr, "\"\n", -1);
    }
    if (cstr.size) {
        *s1->include_stack_ptr++ = file;
	tcc_open_bf(s1, "<command line>", cstr.size);
	memcpy(file->buffer, cstr.data, cstr.size);
    }
    cstr_free(&cstr);

    if (is_asm)
        tcc_define_symbol(s1, "__ASSEMBLER__", ((void*)0));

    parse_flags = is_asm ? 0x0008 : 0;
    tok_flags = 0x0001 | 0x0002;
}


static void preprocess_end(TCCState *s1)
{
    while (macro_stack)
        end_macro();
    macro_ptr = ((void*)0);
}

static void tccpp_new(TCCState *s)
{
    int i, c;
    const char *p, *r;


    s->include_stack_ptr = s->include_stack;
    s->ppfp = stdout;


    for(i = (-1); i<128; i++)
        set_idnum(i,
            is_space(i) ? 1
            : isid(i) ? 2
            : isnum(i) ? 4
            : 0);

    for(i = 128; i<256; i++)
        set_idnum(i, 2);


    tal_new(&toksym_alloc, 256, (768 * 1024));
    tal_new(&tokstr_alloc, 128, (768 * 1024));
    tal_new(&cstr_alloc, 1024, (256 * 1024));

    memset(hash_ident, 0, 16384 * sizeof(TokenSym *));
    cstr_new(&cstr_buf);
    cstr_realloc(&cstr_buf, 1024);
    tok_str_new(&tokstr_buf);
    tok_str_realloc(&tokstr_buf, 256);

    tok_ident = 256;
    p = tcc_keywords;
    while (*p) {
        r = p;
        for(;;) {
            c = *r++;
            if (c == '\0')
                break;
        }
        tok_alloc(p, r - p - 1);
        p = r;
    }
}

static void tccpp_delete(TCCState *s)
{
    int i, n;


    free_defines(((void*)0));


    n = tok_ident - 256;
    for(i = 0; i < n; i++)
        tal_free_impl(toksym_alloc, table_ident[i]);
    tcc_free(table_ident);
    table_ident = ((void*)0);


    cstr_free(&tokcstr);
    cstr_free(&cstr_buf);
    cstr_free(&macro_equal_buf);
    tok_str_free_str(tokstr_buf.str);


    tal_delete(toksym_alloc);
    toksym_alloc = ((void*)0);
    tal_delete(tokstr_alloc);
    tokstr_alloc = ((void*)0);
    tal_delete(cstr_alloc);
    cstr_alloc = ((void*)0);
}




static void tok_print(const char *msg, const int *str)
{
    FILE *fp;
    int t, s = 0;
    CValue cval;

    fp = tcc_state->ppfp;
    fprintf(fp, "%s", msg);
    while (str) {
	TOK_GET(&t, &str, &cval);
	if (!t)
	    break;
	fprintf(fp, " %s" + s, get_tok_str(t, &cval)), s = 1;
    }
    fprintf(fp, "\n");
}

static void pp_line(TCCState *s1, BufferedFile *f, int level)
{
    int d = f->line_num - f->line_ref;

    if (s1->dflag & 4)
	return;

    if (s1->Pflag == LINE_MACRO_OUTPUT_FORMAT_NONE) {
        ;
    } else if (level == 0 && f->line_ref && d < 8) {
	while (d > 0)
	    fputs("\n", s1->ppfp), --d;
    } else if (s1->Pflag == LINE_MACRO_OUTPUT_FORMAT_STD) {
	fprintf(s1->ppfp, "#line %d \"%s\"\n", f->line_num, f->filename);
    } else {
	fprintf(s1->ppfp, "# %d \"%s\"%s\n", f->line_num, f->filename,
	    level > 0 ? " 1" : level < 0 ? " 2" : "");
    }
    f->line_ref = f->line_num;
}

static void define_print(TCCState *s1, int v)
{
    FILE *fp;
    Sym *s;

    s = define_find(v);
    if (((void*)0) == s || ((void*)0) == s->d)
        return;

    fp = s1->ppfp;
    fprintf(fp, "#define %s", get_tok_str(v, ((void*)0)));
    if (s->type.t == 1) {
        Sym *a = s->next;
        fprintf(fp,"(");
        if (a)
            for (;;) {
                fprintf(fp,"%s", get_tok_str(a->v & ~0x20000000, ((void*)0)));
                if (!(a = a->next))
                    break;
                fprintf(fp,",");
            }
        fprintf(fp,")");
    }
    tok_print("", s->d);
}

static void pp_debug_defines(TCCState *s1)
{
    int v, t;
    const char *vs;
    FILE *fp;

    t = pp_debug_tok;
    if (t == 0)
        return;

    file->line_num--;
    pp_line(s1, file, 0);
    file->line_ref = ++file->line_num;

    fp = s1->ppfp;
    v = pp_debug_symv;
    vs = get_tok_str(v, ((void*)0));
    if (t == TOK_DEFINE) {
        define_print(s1, v);
    } else if (t == TOK_UNDEF) {
        fprintf(fp, "#undef %s\n", vs);
    } else if (t == TOK_push_macro) {
        fprintf(fp, "#pragma push_macro(\"%s\")\n", vs);
    } else if (t == TOK_pop_macro) {
        fprintf(fp, "#pragma pop_macro(\"%s\")\n", vs);
    }
    pp_debug_tok = 0;
}

static void pp_debug_builtins(TCCState *s1)
{
    int v;
    for (v = 256; v < tok_ident; ++v)
        define_print(s1, v);
}


static int pp_need_space(int a, int b)
{
    return 'E' == a ? '+' == b || '-' == b
        : '+' == a ? 0xa4 == b || '+' == b
        : '-' == a ? 0xa2 == b || '-' == b
        : a >= 256 ? b >= 256
	: a == 0xbe ? b >= 256
        : 0;
}


static int pp_check_he0xE(int t, const char *p)
{
    if (t == 0xbe && toup(strchr(p, 0)[-1]) == 'E')
        return 'E';
    return t;
}


static int tcc_preprocess(TCCState *s1)
{
    BufferedFile **iptr;
    int token_seen, spcs, level;
    const char *p;
    char white[400];

    parse_flags = 0x0001
                | (parse_flags & 0x0008)
                | 0x0004
                | 0x0010
                | 0x0020
                ;



    if (s1->Pflag == LINE_MACRO_OUTPUT_FORMAT_P10)
        parse_flags |= 0x0002, s1->Pflag = 1;







    if (s1->dflag & 1) {
        pp_debug_builtins(s1);
        s1->dflag &= ~1;
    }

    token_seen = 10, spcs = 0;
    pp_line(s1, file, 0);
    for (;;) {
        iptr = s1->include_stack_ptr;
        next();
        if (tok == (-1))
            break;

        level = s1->include_stack_ptr - iptr;
        if (level) {
            if (level > 0)
                pp_line(s1, *iptr, 0);
            pp_line(s1, file, level);
        }
        if (s1->dflag & 7) {
            pp_debug_defines(s1);
            if (s1->dflag & 4)
                continue;
        }

        if (is_space(tok)) {
            if (spcs < sizeof white - 1)
                white[spcs++] = tok;
            continue;
        } else if (tok == 10) {
            spcs = 0;
            if (token_seen == 10)
                continue;
            ++file->line_ref;
        } else if (token_seen == 10) {
            pp_line(s1, file, 0);
        } else if (spcs == 0 && pp_need_space(token_seen, tok)) {
            white[spcs++] = ' ';
        }

        white[spcs] = 0, fputs(white, s1->ppfp), spcs = 0;
        fputs(p = get_tok_str(tok, &tokc), s1->ppfp);
        token_seen = pp_check_he0xE(tok, p);
    }
    return 0;
}

static int rsym, anon_sym, ind, loc;
static Sym *sym_free_first;
static void **sym_pools;
static int nb_sym_pools;
static Sym *global_stack;
static Sym *local_stack;
static Sym *define_stack;
static Sym *global_label_stack;
static Sym *local_label_stack;
static int local_scope;
static int in_sizeof;
static int section_sym;
static int vlas_in_scope;
static int vla_sp_root_loc;
static int vla_sp_loc;
static SValue __vstack[1+256], *vtop, *pvtop;
static int const_wanted;
static int nocode_wanted;
static int global_expr;
static CType func_vt;
static int func_var;
static int func_vc;
static int last_line_num, last_ind, func_ind;
static const char *funcname;
static CType char_pointer_type, func_old_type, int_type, size_type, ptrdiff_type;
static struct switch_t {
    struct case_t {
        int64_t v1, v2;
	int sym;
    } **p; int n;
    int def_sym;
} *cur_switch;
static void gen_cast(CType *type);
static void gen_cast_s(int t);
static inline CType *pointed_type(CType *type);
static int is_compatible_types(CType *type1, CType *type2);
static int parse_btype(CType *type, AttributeDef *ad);
static CType *type_decl(CType *type, AttributeDef *ad, int *v, int td);
static void parse_expr_type(CType *type);
static void init_putv(CType *type, Section *sec, unsigned long c);
static void decl_initializer(CType *type, Section *sec, unsigned long c, int first, int size_only);
static void block(int *bsym, int *csym, int is_expr);
static void decl_initializer_alloc(CType *type, AttributeDef *ad, int r, int has_init, int v, int scope);
static void decl(int l);
static int decl0(int l, int is_for_loop_init, Sym *);
static void expr_eq(void);
static int is_compatible_unqualified_types(CType *type1, CType *type2);
static inline int64_t expr_const64(void);
static void vpush64(int ty, unsigned long long v);
static void vpush(CType *type);
static int gvtst(int inv, int t);
static void gen_inline_functions(TCCState *s);
static void skip_or_save_block(TokenString **str);
static void gv_dup(void);

static inline int is_float(int t) {
    int bt;
    bt = t & 0x000f;
    return bt == 10 || bt == 9 || bt == 8 || bt == 14;
}

static int ieee_finite(double d) {
    int p[4];
    memcpy(p, &d, sizeof(double));
    return ((unsigned)((p[1] | 0x800fffff) + 1)) >> 31;
}

static void test_lvalue(void) {
    if (!(vtop->r & 0x0100))
        expect("lvalue");
}

static void check_vstack(void) {
    if (pvtop != vtop)
        tcc_error("internal compiler error: vstack leak (%d)", vtop - pvtop);
}

static int tccgen_compile(TCCState *s1) {
    cur_text_section = ((void*)0);
    funcname = "";
    anon_sym = SYM_FIRST_ANOM;
    section_sym = 0;
    const_wanted = 0;
    nocode_wanted = 0x80000000;
    int_type.t = VT_INT;
    char_pointer_type.t = VT_BYTE;
    mk_pointer(&char_pointer_type);
    size_type.t = VT_INT | VT_UNSIGNED;
    ptrdiff_type.t = VT_INT;
    func_old_type.t = VT_FUNC;
    func_old_type.ref = sym_push(SYM_FIELD, &int_type, 0, 0);
    func_old_type.ref->f.func_call = FUNC_CDECL;
    func_old_type.ref->f.func_type = FUNC_OLD;
    parse_flags = PARSE_FLAG_PREPROCESS | PARSE_FLAG_TOK_NUM | PARSE_FLAG_TOK_STR;
    next();
    decl(VT_CONST);
    gen_inline_functions(s1);
    check_vstack();
    return 0;
}


static Elf32_Sym *elfsym(Sym *s) {
  if (!s || !s->c)
    return ((void*)0);
  return &((Elf32_Sym *)symtab_section->data)[s->c];
}

static void update_storage(Sym *sym) {
    Elf32_Sym *esym;
    int sym_bind, old_sym_bind;
    esym = elfsym(sym);
    if (!esym)
        return;
    if (sym->a.visibility)
        esym->st_other = (esym->st_other & ~((-1) & 0x03))
            | sym->a.visibility;
    if (sym->type.t & 0x00002000)
        sym_bind = 0;
    else if (sym->a.weak)
        sym_bind = 2;
    else
        sym_bind = 1;
    old_sym_bind = (((unsigned char) (esym->st_info)) >> 4);
    if (sym_bind != old_sym_bind) {
        esym->st_info = (((sym_bind) << 4) + ((((esym->st_info) & 0xf)) & 0xf));
    }
}

static void put_extern_sym2(Sym *sym, int sh_num,
                            Elf32_Addr value, unsigned long size,
                            int can_add_underscore) {
    int sym_type, sym_bind, info, other, t;
    Elf32_Sym *esym;
    const char *name;
    char buf1[256];
    char buf[32];
    if (!sym->c) {
        name = get_tok_str(sym->v, ((void*)0));
        t = sym->type.t;
        if ((t & 0x000f) == 6) {
            sym_type = 2;
        } else if ((t & 0x000f) == 0) {
            sym_type = 0;
        } else {
            sym_type = 1;
        }
        if (t & 0x00002000)
            sym_bind = 0;
        else
            sym_bind = 1;
        other = 0;
        if (tcc_state->leading_underscore && can_add_underscore) {
            buf1[0] = '_';
            pstrcpy(buf1 + 1, sizeof(buf1) - 1, name);
            name = buf1;
        }
        if (sym->asm_label)
            name = get_tok_str(sym->asm_label, ((void*)0));
        info = (((sym_bind) << 4) + ((sym_type) & 0xf));
        sym->c = put_elf_sym(symtab_section, value, size, info, other, sh_num, name);
    } else {
        esym = elfsym(sym);
        esym->st_value = value;
        esym->st_size = size;
        esym->st_shndx = sh_num;
    }
    update_storage(sym);
}

static void put_extern_sym(Sym *sym, Section *section,
                           Elf32_Addr value, unsigned long size) {
    int sh_num = section ? section->sh_num : 0;
    put_extern_sym2(sym, sh_num, value, size, 1);
}


static void greloca(Section *s, Sym *sym, unsigned long offset, int type,
                     Elf32_Addr addend) {
    int c = 0;
    if (nocode_wanted && s == cur_text_section)
        return;
    if (sym) {
        if (0 == sym->c)
            put_extern_sym(sym, ((void*)0), 0, 0);
        c = sym->c;
    }
    put_elf_reloca(symtab_section, s, offset, type, c, addend);
}


static void greloc(Section *s, Sym *sym, unsigned long offset, int type) {
    greloca(s, sym, offset, type, 0);
}

static Sym *__sym_malloc(void)
{
    Sym *sym_pool, *sym, *last_sym;
    int i;
    sym_pool = tcc_malloc((8192 / sizeof(Sym)) * sizeof(Sym));
    dynarray_add(&sym_pools, &nb_sym_pools, sym_pool);
    last_sym = sym_free_first;
    sym = sym_pool;
    for(i = 0; i < (8192 / sizeof(Sym)); i++) {
        sym->next = last_sym;
        last_sym = sym;
        sym++;
    }
    sym_free_first = last_sym;
    return last_sym;
}

static inline Sym *sym_malloc(void) {
    Sym *sym;
    sym = sym_free_first;
    if (!sym)
        sym = __sym_malloc();
    sym_free_first = sym->next;
    return sym;
}

static inline void sym_free(Sym *sym) {
    sym->next = sym_free_first;
    sym_free_first = sym;
}

static Sym *sym_push2(Sym **ps, int v, int t, int c) {
    Sym *s;
    s = sym_malloc();
    memset(s, 0, sizeof *s);
    s->v = v;
    s->type.t = t;
    s->c = c;
    s->prev = *ps;
    *ps = s;
    return s;
}

static Sym *sym_find2(Sym *s, int v) {
    while (s) {
        if (s->v == v)
            return s;
        else if (s->v == -1)
            return ((void*)0);
        s = s->prev;
    }
    return ((void*)0);
}


static inline Sym *struct_find(int v) {
    v -= 256;
    if ((unsigned)v >= (unsigned)(tok_ident - 256))
        return ((void*)0);
    return table_ident[v]->sym_struct;
}

static inline Sym *sym_find(int v) {
    v -= 256;
    if ((unsigned)v >= (unsigned)(tok_ident - 256))
        return ((void*)0);
    return table_ident[v]->sym_identifier;
}

static Sym *sym_push(int v, CType *type, int r, int c) {
    Sym *s, **ps;
    TokenSym *ts;
    if (local_stack)
        ps = &local_stack;
    else
        ps = &global_stack;
    s = sym_push2(ps, v, type->t, c);
    s->type.ref = type->ref;
    s->r = r;
    if (!(v & 0x20000000) && (v & ~0x40000000) < 0x10000000) {
        ts = table_ident[(v & ~0x40000000) - 256];
        if (v & 0x40000000)
            ps = &ts->sym_struct;
        else
            ps = &ts->sym_identifier;
        s->prev_tok = *ps;
        *ps = s;
        s->sym_scope = local_scope;
        if (s->prev_tok && s->prev_tok->sym_scope == s->sym_scope)
            tcc_error("redeclaration of '%s'",
                get_tok_str(v & ~0x40000000, ((void*)0)));
    }
    return s;
}

static Sym *global_identifier_push(int v, int t, int c) {
    Sym *s, **ps;
    s = sym_push2(&global_stack, v, t, c);
    if (v < 0x10000000) {
        ps = &table_ident[v - 256]->sym_identifier;
        while (*ps != ((void*)0) && (*ps)->sym_scope)
            ps = &(*ps)->prev_tok;
        s->prev_tok = *ps;
        *ps = s;
    }
    return s;
}

static void sym_pop(Sym **ptop, Sym *b, int keep) {
    Sym *s, *ss, **ps;
    TokenSym *ts;
    int v;
    s = *ptop;
    while(s != b) {
        ss = s->prev;
        v = s->v;
        if (!(v & 0x20000000) && (v & ~0x40000000) < 0x10000000) {
            ts = table_ident[(v & ~0x40000000) - 256];
            if (v & 0x40000000)
                ps = &ts->sym_struct;
            else
                ps = &ts->sym_identifier;
            *ps = s->prev_tok;
        }
	if (!keep)
	    sym_free(s);
        s = ss;
    }
    if (!keep)
	*ptop = b;
}

static void vsetc(CType *type, int r, CValue *vc) {
    int v;
    if (vtop >= (__vstack + 1) + (256 - 1))
        tcc_error("memory full (vstack)");
    if (vtop >= (__vstack + 1) && !nocode_wanted) {
        v = vtop->r & 0x003f;
        if (v == 0x0033 || (v & ~1) == 0x0034)
            gv(0x0001);
    }
    vtop++;
    vtop->type = *type;
    vtop->r = r;
    vtop->r2 = 0x0030;
    vtop->c = *vc;
    vtop->sym = ((void*)0);
}

static void vswap(void) {
    SValue tmp;
    if (vtop >= (__vstack + 1) && !nocode_wanted) {
        int v = vtop->r & 0x003f;
        if (v == 0x0033 || (v & ~1) == 0x0034)
            gv(0x0001);
    }
    tmp = vtop[0];
    vtop[0] = vtop[-1];
    vtop[-1] = tmp;
}

static void vpop(void) {
    int v;
    v = vtop->r & 0x003f;
    if (v == TREG_ST0) {
        o(0xd8dd);
    } else
    if (v == 0x0034 || v == 0x0035) {

        gsym(vtop->c.i);
    }
    vtop--;
}

static void vpush(CType *type) {
    vset(type, 0x0030, 0);
}

static void vpushi(int v) {
    CValue cval;
    cval.i = v;
    vsetc(&int_type, 0x0030, &cval);
}

static void vpushs(Elf32_Addr v) {
  CValue cval;
  cval.i = v;
  vsetc(&size_type, 0x0030, &cval);
}


static void vpush64(int ty, unsigned long long v)
{
    CValue cval;
    CType ctype;
    ctype.t = ty;
    ctype.ref = ((void*)0);
    cval.i = v;
    vsetc(&ctype, 0x0030, &cval);
}


static inline void vpushll(long long v)
{
    vpush64(4, v);
}

static void vset(CType *type, int r, int v)
{
    CValue cval;

    cval.i = v;
    vsetc(type, r, &cval);
}

static void vseti(int r, int v)
{
    CType type;
    type.t = 3;
    type.ref = ((void*)0);
    vset(&type, r, v);
}

static void vpushv(SValue *v)
{
    if (vtop >= (__vstack + 1) + (256 - 1))
        tcc_error("memory full (vstack)");
    vtop++;
    *vtop = *v;
}

static void vdup(void)
{
    vpushv(vtop);
}

static void vrotb(int n) {
    int i;
    SValue tmp;

    tmp = vtop[-n + 1];
    for(i=-n+1;i!=0;i++)
        vtop[i] = vtop[i+1];
    vtop[0] = tmp;
}

static void vrote(SValue *e, int n) {
    int i;
    SValue tmp;
    tmp = *e;
    for(i = 0;i < n - 1; i++)
        e[-i] = e[-i - 1];
    e[-n + 1] = tmp;
}

static void vrott(int n) {
    vrote(vtop, n);
}

static inline void vpushsym(CType *type, Sym *sym) {
    CValue cval;
    cval.i = 0;
    vsetc(type, 0x0030 | 0x0200, &cval);
    vtop->sym = sym;
}
static Sym *get_sym_ref(CType *type, Section *sec, unsigned long offset, unsigned long size)
{
    int v;
    Sym *sym;

    v = anon_sym++;
    sym = global_identifier_push(v, type->t | 0x00002000, 0);
    sym->type.ref = type->ref;
    sym->r = 0x0030 | 0x0200;
    put_extern_sym(sym, sec, offset, size);
    return sym;
}


static void vpush_ref(CType *type, Section *sec, unsigned long offset, unsigned long size)
{
    vpushsym(type, get_sym_ref(type, sec, offset, size));
}

static Sym *external_global_sym(int v, CType *type, int r) {
    Sym *s;

    s = sym_find(v);
    if (!s) {

        s = global_identifier_push(v, type->t | 0x00001000, 0);
        s->type.ref = type->ref;
        s->r = r | 0x0030 | 0x0200;
    } else if ((((s)->type.t & (0x000f | (0 | 0x0010))) == (0 | 0x0010))) {
        s->type.t = type->t | (s->type.t & 0x00001000);
        s->type.ref = type->ref;
        update_storage(s);
    }
    return s;
}


static void patch_type(Sym *sym, CType *type)
{
    if (!(type->t & 0x00001000)) {
        if (!(sym->type.t & 0x00001000))
            tcc_error("redefinition of '%s'", get_tok_str(sym->v, ((void*)0)));
        sym->type.t &= ~0x00001000;
    }

    if ((((sym)->type.t & (0x000f | (0 | 0x0010))) == (0 | 0x0010))) {

        sym->type.t = type->t & (sym->type.t | ~0x00002000);
        sym->type.ref = type->ref;
    }

    if (!is_compatible_types(&sym->type, type)) {
        tcc_error("incompatible types for redefinition of '%s'",
                  get_tok_str(sym->v, ((void*)0)));

    } else if ((sym->type.t & 0x000f) == 6) {
        int static_proto = sym->type.t & 0x00002000;

        if ((type->t & 0x00002000) && !static_proto && !(type->t & 0x00008000))
            tcc_warning("static storage ignored for redefinition of '%s'",
                get_tok_str(sym->v, ((void*)0)));

        if (0 == (type->t & 0x00001000)) {

            sym->type.t = (type->t & ~0x00002000) | static_proto;
            if (type->t & 0x00008000)
                sym->type.t = type->t;
            sym->type.ref = type->ref;
        }

    } else {
        if ((sym->type.t & 0x0040) && type->ref->c >= 0) {

            if (sym->type.ref->c < 0)
                sym->type.ref->c = type->ref->c;
            else if (sym->type.ref->c != type->ref->c)
                tcc_error("conflicting type for '%s'", get_tok_str(sym->v, ((void*)0)));
        }
        if ((type->t ^ sym->type.t) & 0x00002000)
            tcc_warning("storage mismatch for redefinition of '%s'",
                get_tok_str(sym->v, ((void*)0)));
    }
}

static void patch_storage(Sym *sym, AttributeDef *ad, CType *type) {
    if (type) {
        patch_type(sym, type);
    }
    sym->a.weak |= ad->a.weak;
    update_storage(sym);
}

static Sym *external_sym(int v, CType *type, int r, AttributeDef *ad)
{
    Sym *s;
    s = sym_find(v);
    if (!s) {

        s = sym_push(v, type, r | 0x0030 | 0x0200, 0);
        s->type.t |= 0x00001000;
        s->a = ad->a;
        s->sym_scope = 0;
    } else {
        if (s->type.ref == func_old_type.ref) {
            s->type.ref = type->ref;
            s->r = r | 0x0030 | 0x0200;
            s->type.t |= 0x00001000;
        }
        patch_storage(s, ad, type);
    }
    return s;
}


static void vpush_global_sym(CType *type, int v)
{
    vpushsym(type, external_global_sym(v, type, 0));
}


static void save_regs(int n)
{
    SValue *p, *p1;
    for(p = (__vstack + 1), p1 = vtop - n; p <= p1; p++)
        save_reg(p->r);
}


static void save_reg(int r)
{
    save_reg_upstack(r, 0);
}



static void save_reg_upstack(int r, int n)
{
    int l, saved, size, align;
    SValue *p, *p1, sv;
    CType *type;
    if ((r &= 0x003f) >= 0x0030)
        return;
    if (nocode_wanted)
        return;
    saved = 0;
    l = 0;
    for(p = (__vstack + 1), p1 = vtop - n; p <= p1; p++) {
        if ((p->r & 0x003f) == r ||
            ((p->type.t & 0x000f) == 4 && (p->r2 & 0x003f) == r)) {
            if (!saved) {
                r = p->r & 0x003f;
                type = &p->type;
                if ((p->r & 0x0100) ||
                    (!is_float(type->t) && (type->t & 0x000f) != 4))
                    type = &int_type;
                size = type_size(type, &align);
                loc = (loc - size) & -align;
                sv.type.t = type->t;
                sv.r = 0x0032 | 0x0100;
                sv.c.i = loc;
                store(r, &sv);
                if (r == TREG_ST0) {
                    o(0xd8dd);
                }
                if ((type->t & 0x000f) == 4) {
                    sv.c.i += 4;
                    store(p->r2, &sv);
                }
                l = loc;
                saved = 1;
            }
            if (p->r & 0x0100) {
                p->r = (p->r & ~(0x003f | 0x8000)) | 0x0031;
            } else {
                p->r = lvalue_type(p->type.t) | 0x0032;
            }
            p->r2 = 0x0030;
            p->c.i = l;
        }
    }
}

static int get_reg(int rc)
{
    int r;
    SValue *p;


    for(r=0;r<5;r++) {
        if (reg_classes[r] & rc) {
            if (nocode_wanted)
                return r;
            for(p=(__vstack + 1);p<=vtop;p++) {
                if ((p->r & 0x003f) == r ||
                    (p->r2 & 0x003f) == r)
                    goto notfound;
            }
            return r;
        }
    notfound: ;
    }




    for(p=(__vstack + 1);p<=vtop;p++) {

        r = p->r2 & 0x003f;
        if (r < 0x0030 && (reg_classes[r] & rc))
            goto save_found;
        r = p->r & 0x003f;
        if (r < 0x0030 && (reg_classes[r] & rc)) {
        save_found:
            save_reg(r);
            return r;
        }
    }

    return -1;
}



static void move_reg(int r, int s, int t)
{
    SValue sv;

    if (r != s) {
        save_reg(r);
        sv.type.t = t;
        sv.type.ref = ((void*)0);
        sv.r = s;
        sv.c.i = 0;
        load(r, &sv);
    }
}


static void gaddrof(void)
{
    vtop->r &= ~0x0100;

    if ((vtop->r & 0x003f) == 0x0031)
        vtop->r = (vtop->r & ~(0x003f | (0x1000 | 0x2000 | 0x4000))) | 0x0032 | 0x0100;


}

static void incr_bf_adr(int o)
{
    vtop->type = char_pointer_type;
    gaddrof();
    vpushi(o);
    gen_op('+');
    vtop->type.t = (vtop->type.t & ~(0x000f|0x0020))
        | (1|0x0010);
    vtop->r = (vtop->r & ~(0x1000 | 0x2000 | 0x4000))
        | (0x1000|0x4000|0x0100);
}


static void load_packed_bf(CType *type, int bit_pos, int bit_size)
{
    int n, o, bits;
    save_reg_upstack(vtop->r, 1);
    vpush64(type->t & 0x000f, 0);
    bits = 0, o = bit_pos >> 3, bit_pos &= 7;
    do {
        vswap();
        incr_bf_adr(o);
        vdup();
        n = 8 - bit_pos;
        if (n > bit_size)
            n = bit_size;
        if (bit_pos)
            vpushi(bit_pos), gen_op(0xc9), bit_pos = 0;
        if (n < 8)
            vpushi((1 << n) - 1), gen_op('&');
        gen_cast(type);
        if (bits)
            vpushi(bits), gen_op(0x01);
        vrotb(3);
        gen_op('|');
        bits += n, bit_size -= n, o = 1;
    } while (bit_size);
    vswap(), vpop();
    if (!(type->t & 0x0010)) {
        n = ((type->t & 0x000f) == 4 ? 64 : 32) - bits;
        vpushi(n), gen_op(0x01);
        vpushi(n), gen_op(0x02);
    }
}


static void store_packed_bf(int bit_pos, int bit_size)
{
    int bits, n, o, m, c;

    c = (vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030;
    vswap();
    save_reg_upstack(vtop->r, 1);
    bits = 0, o = bit_pos >> 3, bit_pos &= 7;
    do {
        incr_bf_adr(o);
        vswap();
        c ? vdup() : gv_dup();
        vrott(3);
        if (bits)
            vpushi(bits), gen_op(0xc9);
        if (bit_pos)
            vpushi(bit_pos), gen_op(0x01);
        n = 8 - bit_pos;
        if (n > bit_size)
            n = bit_size;
        if (n < 8) {
            m = ((1 << n) - 1) << bit_pos;
            vpushi(m), gen_op('&');
            vpushv(vtop-1);
            vpushi(m & 0x80 ? ~m & 0x7f : ~m);
            gen_op('&');
            gen_op('|');
        }
        vdup(), vtop[-1] = vtop[-2];
        vstore(), vpop();
        bits += n, bit_size -= n, bit_pos = 0, o = 1;
    } while (bit_size);
    vpop(), vpop();
}

static int adjust_bf(SValue *sv, int bit_pos, int bit_size)
{
    int t;
    if (0 == sv->type.ref)
        return 0;
    t = sv->type.ref->auxtype;
    if (t != -1 && t != 7) {
        sv->type.t = (sv->type.t & ~0x000f) | t;
        sv->r = (sv->r & ~(0x1000 | 0x2000 | 0x4000)) | lvalue_type(sv->type.t);
    }
    return t;
}




static int gv(int rc)
{
    int r, bit_pos, bit_size, size, align, rc2;


    if (vtop->type.t & 0x0080) {
        CType type;

        bit_pos = (((vtop->type.t) >> 20) & 0x3f);
        bit_size = (((vtop->type.t) >> (20 + 6)) & 0x3f);

        vtop->type.t &= ~(((1 << (6+6)) - 1) << 20 | 0x0080);

        type.ref = ((void*)0);
        type.t = vtop->type.t & 0x0010;
        if ((vtop->type.t & 0x000f) == 11)
            type.t |= 0x0010;

        r = adjust_bf(vtop, bit_pos, bit_size);

        if ((vtop->type.t & 0x000f) == 4)
            type.t |= 4;
        else
            type.t |= 3;

        if (r == 7) {
            load_packed_bf(&type, bit_pos, bit_size);
        } else {
            int bits = (type.t & 0x000f) == 4 ? 64 : 32;

            gen_cast(&type);

            vpushi(bits - (bit_pos + bit_size));
            gen_op(0x01);
            vpushi(bits - bit_size);

            gen_op(0x02);
        }
        r = gv(rc);
    } else {
        if (is_float(vtop->type.t) &&
            (vtop->r & (0x003f | 0x0100)) == 0x0030) {
            unsigned long offset;


            size = type_size(&vtop->type, &align);
            if ((nocode_wanted > 0))
                size = 0, align = 1;
            offset = section_add(data_section, size, align);
            vpush_ref(&vtop->type, data_section, offset, size);
	    vswap();
	    init_putv(&vtop->type, data_section, offset);
	    vtop->r |= 0x0100;
        }

        r = vtop->r & 0x003f;
        rc2 = (rc & 0x0002) ? 0x0002 : 0x0001;

        if (rc == 0x0004)
            rc2 = 0x0020;
# 1326 "tcc_src/tccgen.c"
        if (r >= 0x0030
         || (vtop->r & 0x0100)
         || !(reg_classes[r] & rc)




         || ((vtop->type.t & 0x000f) == 4 && !(reg_classes[vtop->r2] & rc2))

            )
        {
            r = get_reg(rc);




            if ((vtop->type.t & 0x000f) == 4) {
                int addr_type = 3, load_size = 4, load_type = 3;
                unsigned long long ll;

                int r2, original_type;
                original_type = vtop->type.t;



                if ((vtop->r & (0x003f | 0x0100)) == 0x0030) {

                    ll = vtop->c.i;
                    vtop->c.i = ll;
                    load(r, vtop);
                    vtop->r = r;
                    vpushi(ll >> 32);
                } else

                if (vtop->r & 0x0100) {
# 1369 "tcc_src/tccgen.c"
                    save_reg_upstack(vtop->r, 1);


                    vtop->type.t = load_type;
                    load(r, vtop);
                    vdup();
                    vtop[-1].r = r;

                    vtop->type.t = addr_type;
                    gaddrof();
                    vpushi(load_size);
                    gen_op('+');
                    vtop->r |= 0x0100;
                    vtop->type.t = load_type;
                } else {

                    load(r, vtop);
                    vdup();
                    vtop[-1].r = r;
                    vtop->r = vtop[-1].r2;
                }


                r2 = get_reg(rc2);
                load(r2, vtop);
                vpop();

                vtop->r2 = r2;
                vtop->type.t = original_type;
            } else if ((vtop->r & 0x0100) && !is_float(vtop->type.t)) {
                int t1, t;


                t = vtop->type.t;
                t1 = t;

                if (vtop->r & 0x1000)
                    t = 1;
                else if (vtop->r & 0x2000)
                    t = 2;
                if (vtop->r & 0x4000)
                    t |= 0x0010;
                vtop->type.t = t;
                load(r, vtop);

                vtop->type.t = t1;
            } else {

                load(r, vtop);
            }
        }
        vtop->r = r;





    }
    return r;
}


static void gv2(int rc1, int rc2)
{
    int v;




    v = vtop[0].r & 0x003f;
    if (v != 0x0033 && (v & ~1) != 0x0034 && rc1 <= rc2) {
        vswap();
        gv(rc1);
        vswap();
        gv(rc2);

        if ((vtop[-1].r & 0x003f) >= 0x0030) {
            vswap();
            gv(rc1);
            vswap();
        }
    } else {
        gv(rc2);
        vswap();
        gv(rc1);
        vswap();

        if ((vtop[0].r & 0x003f) >= 0x0030) {
            gv(rc2);
        }
    }
}



static int rc_fret(int t)
{





    return 0x0008;
}



static int reg_fret(int t)
{





    return TREG_ST0;
}



static void lexpand(void)
{
    int u, v;
    u = vtop->type.t & (0x0020 | 0x0010);
    v = vtop->r & (0x003f | 0x0100);
    if (v == 0x0030) {
        vdup();
        vtop[0].c.i >>= 32;
    } else if (v == (0x0100|0x0030) || v == (0x0100|0x0032)) {
        vdup();
        vtop[0].c.i += 4;
    } else {
        gv(0x0001);
        vdup();
        vtop[0].r = vtop[-1].r2;
        vtop[0].r2 = vtop[-1].r2 = 0x0030;
    }
    vtop[0].type.t = vtop[-1].type.t = 3 | u;
}
# 1539 "tcc_src/tccgen.c"
static void lbuild(int t)
{
    gv2(0x0001, 0x0001);
    vtop[-1].r2 = vtop[0].r;
    vtop[-1].type.t = t;
    vpop();
}




static void gv_dup(void)
{
    int rc, t, r, r1;
    SValue sv;

    t = vtop->type.t;

    if ((t & 0x000f) == 4) {
        if (t & 0x0080) {
            gv(0x0001);
            t = vtop->type.t;
        }
        lexpand();
        gv_dup();
        vswap();
        vrotb(3);
        gv_dup();
        vrotb(4);

        lbuild(t);
        vrotb(3);
        vrotb(3);
        vswap();
        lbuild(t);
        vswap();
    } else

    {

        rc = 0x0001;
        sv.type.t = 3;
        if (is_float(t)) {
            rc = 0x0002;





            sv.type.t = t;
        }
        r = gv(rc);
        r1 = get_reg(rc);
        sv.r = r;
        sv.c.i = 0;
        load(r1, &sv);
        vdup();

        if (r != r1)
            vtop->r = r1;
    }
}




static int gvtst(int inv, int t)
{
    int v = vtop->r & 0x003f;
    if (v != 0x0033 && v != 0x0034 && v != 0x0035) {
        vpushi(0);
        gen_op(0x95);
    }
    if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {

        if ((vtop->c.i != 0) != inv)
            t = gjmp(t);
        vtop--;
        return t;
    }
    return gtst(inv, t);
}



static void gen_opl(int op)
{
    int t, a, b, op1, c, i;
    int func;
    unsigned short reg_iret = TREG_EAX;
    unsigned short reg_lret = TREG_EDX;
    SValue tmp;

    switch(op) {
    case '/':
    case 0xb2:
        func = TOK___divdi3;
        goto gen_func;
    case 0xb0:
        func = TOK___udivdi3;
        goto gen_func;
    case '%':
        func = TOK___moddi3;
        goto gen_mod_func;
    case 0xb1:
        func = TOK___umoddi3;
    gen_mod_func:




    gen_func:

        vpush_global_sym(&func_old_type, func);
        vrott(3);
        gfunc_call(2);
        vpushi(0);
        vtop->r = reg_iret;
        vtop->r2 = reg_lret;
        break;
    case '^':
    case '&':
    case '|':
    case '*':
    case '+':
    case '-':

        t = vtop->type.t;
        vswap();
        lexpand();
        vrotb(3);
        lexpand();

        tmp = vtop[0];
        vtop[0] = vtop[-3];
        vtop[-3] = tmp;
        tmp = vtop[-2];
        vtop[-2] = vtop[-3];
        vtop[-3] = tmp;
        vswap();


        if (op == '*') {
            vpushv(vtop - 1);
            vpushv(vtop - 1);
            gen_op(0xc2);
            lexpand();

            for(i=0;i<4;i++)
                vrotb(6);

            tmp = vtop[0];
            vtop[0] = vtop[-2];
            vtop[-2] = tmp;

            gen_op('*');
            vrotb(3);
            vrotb(3);
            gen_op('*');

            gen_op('+');
            gen_op('+');
        } else if (op == '+' || op == '-') {

            if (op == '+')
                op1 = 0xc3;
            else
                op1 = 0xc5;
            gen_op(op1);

            vrotb(3);
            vrotb(3);
            gen_op(op1 + 1);
        } else {
            gen_op(op);

            vrotb(3);
            vrotb(3);

            gen_op(op);

        }

        lbuild(t);
        break;
    case 0x02:
    case 0xc9:
    case 0x01:
        if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {
            t = vtop[-1].type.t;
            vswap();
            lexpand();
            vrotb(3);

            c = (int)vtop->c.i;



            vpop();
            if (op != 0x01)
                vswap();
            if (c >= 32) {

                vpop();
                if (c > 32) {
                    vpushi(c - 32);
                    gen_op(op);
                }
                if (op != 0x02) {
                    vpushi(0);
                } else {
                    gv_dup();
                    vpushi(31);
                    gen_op(0x02);
                }
                vswap();
            } else {
                vswap();
                gv_dup();

                vpushi(c);
                gen_op(op);
                vswap();
                vpushi(32 - c);
                if (op == 0x01)
                    gen_op(0xc9);
                else
                    gen_op(0x01);
                vrotb(3);

                vpushi(c);
                if (op == 0x01)
                    gen_op(0x01);
                else
                    gen_op(0xc9);
                gen_op('|');
            }
            if (op != 0x01)
                vswap();
            lbuild(t);
        } else {

            switch(op) {
            case 0x02:
                func = TOK___ashrdi3;
                goto gen_func;
            case 0xc9:
                func = TOK___lshrdi3;
                goto gen_func;
            case 0x01:
                func = TOK___ashldi3;
                goto gen_func;
            }
        }
        break;
    default:

        t = vtop->type.t;
        vswap();
        lexpand();
        vrotb(3);
        lexpand();

        tmp = vtop[-1];
        vtop[-1] = vtop[-2];
        vtop[-2] = tmp;


        op1 = op;


        if (op1 == 0x9c)
            op1 = 0x9e;
        else if (op1 == 0x9f)
            op1 = 0x9d;
        else if (op1 == 0x92)
            op1 = 0x96;
        else if (op1 == 0x97)
            op1 = 0x93;
        a = 0;
        b = 0;
        gen_op(op1);
        if (op == 0x95) {
            b = gvtst(0, 0);
        } else {
            a = gvtst(1, 0);
            if (op != 0x94) {

                vpushi(0x95);
                vtop->r = 0x0033;
                b = gvtst(0, 0);
            }
        }

        op1 = op;
        if (op1 == 0x9c)
            op1 = 0x92;
        else if (op1 == 0x9e)
            op1 = 0x96;
        else if (op1 == 0x9f)
            op1 = 0x97;
        else if (op1 == 0x9d)
            op1 = 0x93;
        gen_op(op1);
        a = gvtst(1, a);
        gsym(b);
        vseti(0x0035, a);
        break;
    }
}


static uint64_t gen_opic_sdiv(uint64_t a, uint64_t b)
{
    uint64_t x = (a >> 63 ? -a : a) / (b >> 63 ? -b : b);
    return (a ^ b) >> 63 ? -x : x;
}

static int gen_opic_lt(uint64_t a, uint64_t b)
{
    return (a ^ (uint64_t)1 << 63) < (b ^ (uint64_t)1 << 63);
}



static void gen_opic(int op)
{
    SValue *v1 = vtop - 1;
    SValue *v2 = vtop;
    int t1 = v1->type.t & 0x000f;
    int t2 = v2->type.t & 0x000f;
    int c1 = (v1->r & (0x003f | 0x0100 | 0x0200)) == 0x0030;
    int c2 = (v2->r & (0x003f | 0x0100 | 0x0200)) == 0x0030;
    uint64_t l1 = c1 ? v1->c.i : 0;
    uint64_t l2 = c2 ? v2->c.i : 0;
    int shm = (t1 == 4) ? 63 : 31;

    if (t1 != 4 && (4 != 8 || t1 != 5))
        l1 = ((uint32_t)l1 |
              (v1->type.t & 0x0010 ? 0 : -(l1 & 0x80000000)));
    if (t2 != 4 && (4 != 8 || t2 != 5))
        l2 = ((uint32_t)l2 |
              (v2->type.t & 0x0010 ? 0 : -(l2 & 0x80000000)));

    if (c1 && c2) {
        switch(op) {
        case '+': l1 += l2; break;
        case '-': l1 -= l2; break;
        case '&': l1 &= l2; break;
        case '^': l1 ^= l2; break;
        case '|': l1 |= l2; break;
        case '*': l1 *= l2; break;

        case 0xb2:
        case '/':
        case '%':
        case 0xb0:
        case 0xb1:

            if (l2 == 0) {
                if (const_wanted)
                    tcc_error("division by zero in constant");
                goto general_case;
            }
            switch(op) {
            default: l1 = gen_opic_sdiv(l1, l2); break;
            case '%': l1 = l1 - l2 * gen_opic_sdiv(l1, l2); break;
            case 0xb0: l1 = l1 / l2; break;
            case 0xb1: l1 = l1 % l2; break;
            }
            break;
        case 0x01: l1 <<= (l2 & shm); break;
        case 0xc9: l1 >>= (l2 & shm); break;
        case 0x02:
            l1 = (l1 >> 63) ? ~(~l1 >> (l2 & shm)) : l1 >> (l2 & shm);
            break;

        case 0x92: l1 = l1 < l2; break;
        case 0x93: l1 = l1 >= l2; break;
        case 0x94: l1 = l1 == l2; break;
        case 0x95: l1 = l1 != l2; break;
        case 0x96: l1 = l1 <= l2; break;
        case 0x97: l1 = l1 > l2; break;
        case 0x9c: l1 = gen_opic_lt(l1, l2); break;
        case 0x9d: l1 = !gen_opic_lt(l1, l2); break;
        case 0x9e: l1 = !gen_opic_lt(l2, l1); break;
        case 0x9f: l1 = gen_opic_lt(l2, l1); break;

        case 0xa0: l1 = l1 && l2; break;
        case 0xa1: l1 = l1 || l2; break;
        default:
            goto general_case;
        }
	if (t1 != 4 && (4 != 8 || t1 != 5))
	    l1 = ((uint32_t)l1 |
		(v1->type.t & 0x0010 ? 0 : -(l1 & 0x80000000)));
        v1->c.i = l1;
        vtop--;
    } else {

        if (c1 && (op == '+' || op == '&' || op == '^' ||
                   op == '|' || op == '*')) {
            vswap();
            c2 = c1;
            l2 = l1;
        }
        if (!const_wanted &&
            c1 && ((l1 == 0 &&
                    (op == 0x01 || op == 0xc9 || op == 0x02)) ||
                   (l1 == -1 && op == 0x02))) {

            vtop--;
        } else if (!const_wanted &&
                   c2 && ((l2 == 0 && (op == '&' || op == '*')) ||
                          (op == '|' &&
                            (l2 == -1 || (l2 == 0xFFFFFFFF && t2 != 4))) ||
                          (l2 == 1 && (op == '%' || op == 0xb1)))) {

            if (l2 == 1)
                vtop->c.i = 0;
            vswap();
            vtop--;
        } else if (c2 && (((op == '*' || op == '/' || op == 0xb0 ||
                          op == 0xb2) &&
                           l2 == 1) ||
                          ((op == '+' || op == '-' || op == '|' || op == '^' ||
                            op == 0x01 || op == 0xc9 || op == 0x02) &&
                           l2 == 0) ||
                          (op == '&' &&
                            (l2 == -1 || (l2 == 0xFFFFFFFF && t2 != 4))))) {

            vtop--;
        } else if (c2 && (op == '*' || op == 0xb2 || op == 0xb0)) {

            if (l2 > 0 && (l2 & (l2 - 1)) == 0) {
                int n = -1;
                while (l2) {
                    l2 >>= 1;
                    n++;
                }
                vtop->c.i = n;
                if (op == '*')
                    op = 0x01;
                else if (op == 0xb2)
                    op = 0x02;
                else
                    op = 0xc9;
            }
            goto general_case;
        } else if (c2 && (op == '+' || op == '-') &&
                   (((vtop[-1].r & (0x003f | 0x0100 | 0x0200)) == (0x0030 | 0x0200))
                    || (vtop[-1].r & (0x003f | 0x0100)) == 0x0032)) {

            if (op == '-')
                l2 = -l2;
	    l2 += vtop[-1].c.i;


	    if ((int)l2 != l2)
	        goto general_case;
            vtop--;
            vtop->c.i = l2;
        } else {
        general_case:

                if (t1 == 4 || t2 == 4 ||
                    (4 == 8 && (t1 == 5 || t2 == 5)))
                    gen_opl(op);
                else
                    gen_opi(op);
        }
    }
}


static void gen_opif(int op)
{
    int c1, c2;
    SValue *v1, *v2;




    double f1, f2;

    v1 = vtop - 1;
    v2 = vtop;

    c1 = (v1->r & (0x003f | 0x0100 | 0x0200)) == 0x0030;
    c2 = (v2->r & (0x003f | 0x0100 | 0x0200)) == 0x0030;
    if (c1 && c2) {
        if (v1->type.t == 8) {
            f1 = v1->c.f;
            f2 = v2->c.f;
        } else if (v1->type.t == 9) {
            f1 = v1->c.d;
            f2 = v2->c.d;
        } else {
            f1 = v1->c.ld;
            f2 = v2->c.ld;
        }



        if (!ieee_finite(f1) || !ieee_finite(f2))
            goto general_case;

        switch(op) {
        case '+': f1 += f2; break;
        case '-': f1 -= f2; break;
        case '*': f1 *= f2; break;
        case '/':
            if (f2 == 0.0) {
                if (const_wanted)
                    tcc_error("division by zero in constant");
                goto general_case;
            }
            f1 /= f2;
            break;

        default:
            goto general_case;
        }

        if (v1->type.t == 8) {
            v1->c.f = f1;
        } else if (v1->type.t == 9) {
            v1->c.d = f1;
        } else {
            v1->c.ld = f1;
        }
        vtop--;
    } else {
    general_case:
        gen_opf(op);
    }
}

static int pointed_size(CType *type)
{
    int align;
    return type_size(pointed_type(type), &align);
}

static void vla_runtime_pointed_size(CType *type)
{
    int align;
}

static inline int is_null_pointer(SValue *p)
{
    if ((p->r & (0x003f | 0x0100 | 0x0200)) != 0x0030)
        return 0;
    return ((p->type.t & 0x000f) == 3 && (uint32_t)p->c.i == 0) ||
        ((p->type.t & 0x000f) == 4 && p->c.i == 0) ||
        ((p->type.t & 0x000f) == 5 &&
         (4 == 4 ? (uint32_t)p->c.i == 0 : p->c.i == 0));
}

static inline int is_integer_btype(int bt)
{
    return (bt == 1 || bt == 2 ||
            bt == 3 || bt == 4);
}


static void check_comparison_pointer_types(SValue *p1, SValue *p2, int op)
{
    CType *type1, *type2, tmp_type1, tmp_type2;
    int bt1, bt2;


    if (is_null_pointer(p1) || is_null_pointer(p2))
        return;
    type1 = &p1->type;
    type2 = &p2->type;
    bt1 = type1->t & 0x000f;
    bt2 = type2->t & 0x000f;

    if ((is_integer_btype(bt1) || is_integer_btype(bt2)) && op != '-') {
        if (op != 0xa1 && op != 0xa0 )
            tcc_warning("comparison between pointer and integer");
        return;
    }


    if (bt1 == 5) {
        type1 = pointed_type(type1);
    } else if (bt1 != 6)
        goto invalid_operands;

    if (bt2 == 5) {
        type2 = pointed_type(type2);
    } else if (bt2 != 6) {
    invalid_operands:
        tcc_error("invalid operands to binary %s", get_tok_str(op, ((void*)0)));
    }
    if ((type1->t & 0x000f) == 0 ||
        (type2->t & 0x000f) == 0)
        return;
    tmp_type1 = *type1;
    tmp_type2 = *type2;
    tmp_type1.t &= ~(0x0020 | 0x0010 | 0x0100 | 0x0200);
    tmp_type2.t &= ~(0x0020 | 0x0010 | 0x0100 | 0x0200);
    if (!is_compatible_types(&tmp_type1, &tmp_type2)) {

        if (op == '-')
            goto invalid_operands;
        else
            tcc_warning("comparison of distinct pointer types lacks a cast");
    }
}


static void gen_op(int op)
{
    int u, t1, t2, bt1, bt2, t;
    CType type1;

redo:
    t1 = vtop[-1].type.t;
    t2 = vtop[0].type.t;
    bt1 = t1 & 0x000f;
    bt2 = t2 & 0x000f;

    if (bt1 == 7 || bt2 == 7) {
        tcc_error("operation on a struct");
    } else if (bt1 == 6 || bt2 == 6) {
	if (bt2 == 6) {
	    mk_pointer(&vtop->type);
	    gaddrof();
	}
	if (bt1 == 6) {
	    vswap();
	    mk_pointer(&vtop->type);
	    gaddrof();
	    vswap();
	}
	goto redo;
    } else if (bt1 == 5 || bt2 == 5) {


        if (op >= 0x92 && op <= 0xa1) {
            check_comparison_pointer_types(vtop - 1, vtop, op);




            t = 3 | 0x0010;

            goto std_op;
        }

        if (bt1 == 5 && bt2 == 5) {
            if (op != '-')
                tcc_error("cannot use pointers here");
            check_comparison_pointer_types(vtop - 1, vtop, op);

            if (vtop[-1].type.t & 0x0400) {
                vla_runtime_pointed_size(&vtop[-1].type);
            } else {
                vpushi(pointed_size(&vtop[-1].type));
            }
            vrott(3);
            gen_opic(op);
            vtop->type.t = ptrdiff_type.t;
            vswap();
            gen_op(0xb2);
        } else {

            if (op != '-' && op != '+')
                tcc_error("cannot use pointers here");

            if (bt2 == 5) {
                vswap();
                t = t1, t1 = t2, t2 = t;
            }

            if ((vtop[0].type.t & 0x000f) == 4)

                gen_cast_s(3);

            type1 = vtop[-1].type;
            type1.t &= ~0x0040;
            if (vtop[-1].type.t & 0x0400)
                vla_runtime_pointed_size(&vtop[-1].type);
            else {
                u = pointed_size(&vtop[-1].type);
                if (u < 0)
                    tcc_error("unknown array element size");




                vpushi(u);

            }
            gen_op('*');
# 2267 "tcc_src/tccgen.c"
            {
                gen_opic(op);
            }

            vtop->type = type1;
        }
    } else if (is_float(bt1) || is_float(bt2)) {

        if (bt1 == 10 || bt2 == 10) {
            t = 10;
        } else if (bt1 == 9 || bt2 == 9) {
            t = 9;
        } else {
            t = 8;
        }

        if (op != '+' && op != '-' && op != '*' && op != '/' &&
            (op < 0x92 || op > 0x9f))
            tcc_error("invalid operands for binary operation");
        goto std_op;
    } else if (op == 0xc9 || op == 0x02 || op == 0x01) {
        t = bt1 == 4 ? 4 : 3;
        if ((t1 & (0x000f | 0x0010 | 0x0080)) == (t | 0x0010))
          t |= 0x0010;
        t |= (0x0800 & t1);
        goto std_op;
    } else if (bt1 == 4 || bt2 == 4) {

        t = 4 | 0x0800;
        if (bt1 == 4)
            t &= t1;
        if (bt2 == 4)
            t &= t2;

        if ((t1 & (0x000f | 0x0010 | 0x0080)) == (4 | 0x0010) ||
            (t2 & (0x000f | 0x0010 | 0x0080)) == (4 | 0x0010))
            t |= 0x0010;
        goto std_op;
    } else {

        t = 3 | (0x0800 & (t1 | t2));

        if ((t1 & (0x000f | 0x0010 | 0x0080)) == (3 | 0x0010) ||
            (t2 & (0x000f | 0x0010 | 0x0080)) == (3 | 0x0010))
            t |= 0x0010;
    std_op:


        if (t & 0x0010) {
            if (op == 0x02)
                op = 0xc9;
            else if (op == '/')
                op = 0xb0;
            else if (op == '%')
                op = 0xb1;
            else if (op == 0x9c)
                op = 0x92;
            else if (op == 0x9f)
                op = 0x97;
            else if (op == 0x9e)
                op = 0x96;
            else if (op == 0x9d)
                op = 0x93;
        }
        vswap();
        type1.t = t;
        type1.ref = ((void*)0);
        gen_cast(&type1);
        vswap();


        if (op == 0xc9 || op == 0x02 || op == 0x01)
            type1.t = 3;
        gen_cast(&type1);
        if (is_float(t))
            gen_opif(op);
        else
            gen_opic(op);
        if (op >= 0x92 && op <= 0x9f) {

            vtop->type.t = 3;
        } else {
            vtop->type.t = t;
        }
    }

    if (vtop->r & 0x0100)
        gv(is_float(vtop->type.t & 0x000f) ? 0x0002 : 0x0001);
}



static void gen_cvt_itof1(int t)
{



    if ((vtop->type.t & (0x000f | 0x0010)) ==
        (4 | 0x0010)) {

        if (t == 8)
            vpush_global_sym(&func_old_type, TOK___floatundisf);

        else if (t == 10)
            vpush_global_sym(&func_old_type, TOK___floatundixf);

        else
            vpush_global_sym(&func_old_type, TOK___floatundidf);
        vrott(2);
        gfunc_call(1);
        vpushi(0);
        vtop->r = reg_fret(t);
    } else {
        gen_cvt_itof(t);
    }

}



static void gen_cvt_ftoi1(int t)
{



    int st;

    if (t == (4 | 0x0010)) {

        st = vtop->type.t & 0x000f;
        if (st == 8)
            vpush_global_sym(&func_old_type, TOK___fixunssfdi);

        else if (st == 10)
            vpush_global_sym(&func_old_type, TOK___fixunsxfdi);

        else
            vpush_global_sym(&func_old_type, TOK___fixunsdfdi);
        vrott(2);
        gfunc_call(1);
        vpushi(0);
        vtop->r = TREG_EAX;
        vtop->r2 = TREG_EDX;
    } else {
//        gen_cvt_ftoi(t);
    }

}


static void force_charshort_cast(int t)
{
    int bits, dbt;


    if ((nocode_wanted & 0xC0000000))
	return;

    dbt = t & 0x000f;

    if (dbt == 1)
        bits = 8;
    else
        bits = 16;
    if (t & 0x0010) {
        vpushi((1 << bits) - 1);
        gen_op('&');
    } else {
        if ((vtop->type.t & 0x000f) == 4)
            bits = 64 - bits;
        else
            bits = 32 - bits;
        vpushi(bits);
        gen_op(0x01);



        vtop->type.t &= ~0x0010;
        vpushi(bits);
        gen_op(0x02);
    }
}


static void gen_cast_s(int t)
{
    CType type;
    type.t = t;
    type.ref = ((void*)0);
    gen_cast(&type);
}

static void gen_cast(CType *type)
{
    int sbt, dbt, sf, df, c, p;




    if (vtop->r & 0x0400) {
        vtop->r &= ~0x0400;
        force_charshort_cast(vtop->type.t);
    }


    if (vtop->type.t & 0x0080) {
        gv(0x0001);
    }

    dbt = type->t & (0x000f | 0x0010);
    sbt = vtop->type.t & (0x000f | 0x0010);

    if (sbt != dbt) {
        sf = is_float(sbt);
        df = is_float(dbt);
        c = (vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030;
        p = (vtop->r & (0x003f | 0x0100 | 0x0200)) == (0x0030 | 0x0200);



        if (c) {


            if (sbt == 8)
                vtop->c.ld = vtop->c.f;
            else if (sbt == 9)
                vtop->c.ld = vtop->c.d;

            if (df) {
                if ((sbt & 0x000f) == 4) {
                    if ((sbt & 0x0010) || !(vtop->c.i >> 63))
                        vtop->c.ld = vtop->c.i;
                    else
                        vtop->c.ld = -(double)-vtop->c.i;
                } else if(!sf) {
                    if ((sbt & 0x0010) || !(vtop->c.i >> 31))
                        vtop->c.ld = (uint32_t)vtop->c.i;
                    else
                        vtop->c.ld = -(double)-(uint32_t)vtop->c.i;
                }

                if (dbt == 8)
                    vtop->c.f = (float)vtop->c.ld;
                else if (dbt == 9)
                    vtop->c.d = (double)vtop->c.ld;
            } else if (sf && dbt == (4|0x0010)) {
                vtop->c.i = vtop->c.ld;
            } else if (sf && dbt == 11) {
                vtop->c.i = (vtop->c.ld != 0);
            } else {
                if(sf)
                    vtop->c.i = vtop->c.ld;
                else if (sbt == (4|0x0010))
                    ;
                else if (sbt & 0x0010)
                    vtop->c.i = (uint32_t)vtop->c.i;




                else if (sbt != 4)
                    vtop->c.i = ((uint32_t)vtop->c.i |
                                  -(vtop->c.i & 0x80000000));

                if (dbt == (4|0x0010))
                    ;
                else if (dbt == 11)
                    vtop->c.i = (vtop->c.i != 0);




                else if (dbt != 4) {
                    uint32_t m = ((dbt & 0x000f) == 1 ? 0xff :
                                  (dbt & 0x000f) == 2 ? 0xffff :
                                  0xffffffff);
                    vtop->c.i &= m;
                    if (!(dbt & 0x0010))
                        vtop->c.i |= -(vtop->c.i & ((m >> 1) + 1));
                }
            }
        } else if (p && dbt == 11) {
            vtop->r = 0x0030;
            vtop->c.i = 1;
        } else {

            if (sf && df) {

                gen_cvt_ftof(dbt);
            } else if (df) {

                gen_cvt_itof1(dbt);
            } else if (sf) {

                if (dbt == 11) {
                     vpushi(0);
                     gen_op(0x95);
                } else {

                    if (dbt != (3 | 0x0010) &&
                        dbt != (4 | 0x0010) &&
                        dbt != 4)
                        dbt = 3;
                    gen_cvt_ftoi1(dbt);
                    if (dbt == 3 && (type->t & (0x000f | 0x0010)) != dbt) {

                        vtop->type.t = dbt;
                        gen_cast(type);
                    }
                }

            } else if ((dbt & 0x000f) == 4) {
                if ((sbt & 0x000f) != 4) {


                    gv(0x0001);

                    if (sbt == (3 | 0x0010)) {
                        vpushi(0);
                        gv(0x0001);
                    } else {
                        if (sbt == 5) {


                            gen_cast_s(3);
                        }
                        gv_dup();
                        vpushi(31);
                        gen_op(0x02);
                    }

                    vtop[-1].r2 = vtop->r;
                    vpop();
                }
# 2624 "tcc_src/tccgen.c"
            } else if (dbt == 11) {

                vpushi(0);
                gen_op(0x95);
            } else if ((dbt & 0x000f) == 1 ||
                       (dbt & 0x000f) == 2) {
                if (sbt == 5) {
                    vtop->type.t = 3;
                    tcc_warning("nonportable conversion from pointer to char/short");
                }
                force_charshort_cast(dbt);

            } else if ((dbt & 0x000f) == 3) {

                if ((sbt & 0x000f) == 4) {

                    lexpand();
                    vpop();
                }




            }
        }
    } else if ((dbt & 0x000f) == 5 && !(vtop->r & 0x0100)) {


        vtop->r = (vtop->r & ~(0x1000 | 0x2000 | 0x4000))
                  | (lvalue_type(type->ref->type.t) & (0x1000 | 0x2000 | 0x4000));
    }
    vtop->type = *type;
}


static int type_size(CType *type, int *a)
{
    Sym *s;
    int bt;

    bt = type->t & 0x000f;
    if (bt == 7) {

        s = type->ref;
        *a = s->r;
        return s->c;
    } else if (bt == 5) {
        if (type->t & 0x0040) {
            int ts;

            s = type->ref;
            ts = type_size(&s->type, a);

            if (ts < 0 && s->c < 0)
                ts = -ts;

            return ts * s->c;
        } else {
            *a = 4;
            return 4;
        }
    } else if (IS_ENUM(type->t) && type->ref->c == -1) {
        return -1;
    } else if (bt == 10) {
        *a = 4;
        return 12;
    } else if (bt == 9 || bt == 4) {




        *a = 4;
# 2706 "tcc_src/tccgen.c"
        return 8;
    } else if (bt == 3 || bt == 8) {
        *a = 4;
        return 4;
    } else if (bt == 2) {
        *a = 2;
        return 2;
    } else if (bt == 13 || bt == 14) {
        *a = 8;
        return 16;
    } else {

        *a = 1;
        return 1;
    }
}

static inline CType *pointed_type(CType *type)
{
    return &type->ref->type;
}


static void mk_pointer(CType *type)
{
    Sym *s;
    s = sym_push(0x20000000, type, 0, -1);
    type->t = 5 | (type->t & (0x00001000 | 0x00002000 | 0x00004000 | 0x00008000));
    type->ref = s;
}


static int is_compatible_func(CType *type1, CType *type2)
{
    Sym *s1, *s2;

    s1 = type1->ref;
    s2 = type2->ref;
    if (!is_compatible_types(&s1->type, &s2->type))
        return 0;

    if (s1->f.func_call != s2->f.func_call)
        return 0;

    if (s1->f.func_type == 2 || s2->f.func_type == 2)
        return 1;
    if (s1->f.func_type != s2->f.func_type)
        return 0;
    while (s1 != ((void*)0)) {
        if (s2 == ((void*)0))
            return 0;
        if (!is_compatible_unqualified_types(&s1->type, &s2->type))
            return 0;
        s1 = s1->next;
        s2 = s2->next;
    }
    if (s2)
        return 0;
    return 1;
}






static int compare_types(CType *type1, CType *type2, int unqualified)
{
    int bt1, t1, t2;

    t1 = type1->t & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)));
    t2 = type2->t & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)));
    if (unqualified) {

        t1 &= ~(0x0100 | 0x0200);
        t2 &= ~(0x0100 | 0x0200);
    }


    if ((t1 & 0x000f) != 1) {
        t1 &= ~0x0020;
        t2 &= ~0x0020;
    }

    if (t1 != t2)
        return 0;

    bt1 = t1 & 0x000f;
    if (bt1 == 5) {
        type1 = pointed_type(type1);
        type2 = pointed_type(type2);
        return is_compatible_types(type1, type2);
    } else if (bt1 == 7) {
        return (type1->ref == type2->ref);
    } else if (bt1 == 6) {
        return is_compatible_func(type1, type2);
    } else {
        return 1;
    }
}




static int is_compatible_types(CType *type1, CType *type2)
{
    return compare_types(type1,type2,0);
}



static int is_compatible_unqualified_types(CType *type1, CType *type2)
{
    return compare_types(type1,type2,1);
}





static void type_to_str(char *buf, int buf_size,
                 CType *type, const char *varstr)
{
    int bt, v, t;
    Sym *s, *sa;
    char buf1[256];
    const char *tstr;

    t = type->t;
    bt = t & 0x000f;
    buf[0] = '\0';

    if (t & 0x00001000)
        pstrcat(buf, buf_size, "extern ");
    if (t & 0x00002000)
        pstrcat(buf, buf_size, "static ");
    if (t & 0x00004000)
        pstrcat(buf, buf_size, "typedef ");
    if (t & 0x00008000)
        pstrcat(buf, buf_size, "inline ");
    if (t & 0x0200)
        pstrcat(buf, buf_size, "volatile ");
    if (t & 0x0100)
        pstrcat(buf, buf_size, "const ");

    if (((t & 0x0020) && bt == 1)
        || ((t & 0x0010)
            && (bt == 2 || bt == 3 || bt == 4)
            && !IS_ENUM(t)
            ))
        pstrcat(buf, buf_size, (t & 0x0010) ? "unsigned " : "signed ");

    buf_size -= strlen(buf);
    buf += strlen(buf);

    switch(bt) {
    case 0:
        tstr = "void";
        goto add_tstr;
    case 11:
        tstr = "_Bool";
        goto add_tstr;
    case 1:
        tstr = "char";
        goto add_tstr;
    case 2:
        tstr = "short";
        goto add_tstr;
    case 3:
        tstr = "int";
        goto maybe_long;
    case 4:
        tstr = "long long";
    maybe_long:
        if (t & 0x0800)
            tstr = "long";
        if (!IS_ENUM(t))
            goto add_tstr;
        tstr = "enum ";
        goto tstruct;
    case 8:
        tstr = "float";
        goto add_tstr;
    case 9:
        tstr = "double";
        goto add_tstr;
    case 10:
        tstr = "long double";
    add_tstr:
        pstrcat(buf, buf_size, tstr);
        break;
    case 7:
        tstr = "struct ";
        if (((t & ((((1 << (6+6)) - 1) << 20 | 0x0080)|0x000f)) == (1 << 20 | 7)))
            tstr = "union ";
    tstruct:
        pstrcat(buf, buf_size, tstr);
        v = type->ref->v & ~0x40000000;
        if (v >= 0x10000000)
            pstrcat(buf, buf_size, "<anonymous>");
        else
            pstrcat(buf, buf_size, get_tok_str(v, ((void*)0)));
        break;
    case 6:
        s = type->ref;
        type_to_str(buf, buf_size, &s->type, varstr);
        pstrcat(buf, buf_size, "(");
        sa = s->next;
        while (sa != ((void*)0)) {
            type_to_str(buf1, sizeof(buf1), &sa->type, ((void*)0));
            pstrcat(buf, buf_size, buf1);
            sa = sa->next;
            if (sa)
                pstrcat(buf, buf_size, ", ");
        }
        pstrcat(buf, buf_size, ")");
        goto no_var;
    case 5:
        s = type->ref;
        if (t & 0x0040) {
            snprintf(buf1, sizeof(buf1), "%s[%d]", varstr ? varstr : "", s->c);
            type_to_str(buf, buf_size, &s->type, buf1);
            goto no_var;
        }
        pstrcpy(buf1, sizeof(buf1), "*");
        if (t & 0x0100)
            pstrcat(buf1, buf_size, "const ");
        if (t & 0x0200)
            pstrcat(buf1, buf_size, "volatile ");
        if (varstr)
            pstrcat(buf1, sizeof(buf1), varstr);
        type_to_str(buf, buf_size, &s->type, buf1);
        goto no_var;
    }
    if (varstr) {
        pstrcat(buf, buf_size, " ");
        pstrcat(buf, buf_size, varstr);
    }
 no_var: ;
}



static void gen_assign_cast(CType *dt)
{
    CType *st, *type1, *type2;
    char buf1[256], buf2[256];
    int dbt, sbt;

    st = &vtop->type;
    dbt = dt->t & 0x000f;
    sbt = st->t & 0x000f;
    if (sbt == 0 || dbt == 0) {
	if (sbt == 0 && dbt == 0)
	    ;
# 2994 "tcc_src/tccgen.c"
	else
    	    tcc_error("cannot cast from/to void");
    }
    if (dt->t & 0x0100)
        tcc_warning("assignment of read-only location");
    switch(dbt) {
    case 5:


        if (is_null_pointer(vtop))
            goto type_ok;

        if (is_integer_btype(sbt)) {
            tcc_warning("assignment makes pointer from integer without a cast");
            goto type_ok;
        }
        type1 = pointed_type(dt);

        if (sbt == 6) {
            if ((type1->t & 0x000f) != 0 &&
                !is_compatible_types(pointed_type(dt), st))
                tcc_warning("assignment from incompatible pointer type");
            goto type_ok;
        }
        if (sbt != 5)
            goto error;
        type2 = pointed_type(st);
        if ((type1->t & 0x000f) == 0 ||
            (type2->t & 0x000f) == 0) {

        } else {


            if (!is_compatible_unqualified_types(type1, type2)) {




		if ((type1->t & (0x000f|0x0800)) != (type2->t & (0x000f|0x0800))
                    || IS_ENUM(type1->t) || IS_ENUM(type2->t)
                    )
		    tcc_warning("assignment from incompatible pointer type");
	    }
        }

        if ((!(type1->t & 0x0100) && (type2->t & 0x0100)) ||
            (!(type1->t & 0x0200) && (type2->t & 0x0200)))
            tcc_warning("assignment discards qualifiers from pointer target type");
        break;
    case 1:
    case 2:
    case 3:
    case 4:
        if (sbt == 5 || sbt == 6) {
            tcc_warning("assignment makes integer from pointer without a cast");
        } else if (sbt == 7) {
            goto case_VT_STRUCT;
        }

        break;
    case 7:
    case_VT_STRUCT:
        if (!is_compatible_unqualified_types(dt, st)) {
        error:
            type_to_str(buf1, sizeof(buf1), st, ((void*)0));
            type_to_str(buf2, sizeof(buf2), dt, ((void*)0));
            tcc_error("cannot cast '%s' to '%s'", buf1, buf2);
        }
        break;
    }
 type_ok:
    gen_cast(dt);
}


static void vstore(void) {
    int sbt, dbt, ft, r, t, size, align, bit_size, bit_pos, rc, delayed_cast;
    ft = vtop[-1].type.t;
    sbt = vtop->type.t & 0x000f;
    dbt = ft & 0x000f;
    if ((((sbt == 3 || sbt == 2) && dbt == 1) ||
         (sbt == 3 && dbt == 2))
	&& !(vtop->type.t & 0x0080)) {
        delayed_cast = 0x0400;
        vtop->type.t = ft & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)));
        if (ft & 0x0100)
            tcc_warning("assignment of read-only location");
    } else {
        delayed_cast = 0;
        if (!(ft & 0x0080))
            gen_assign_cast(&vtop[-1].type);
    }
    if (sbt == 7) {
            size = type_size(&vtop->type, &align);
            vswap();
            vtop->type.t = 5;
            gaddrof();
            vpush_global_sym(&func_old_type, TOK_memmove);
            vswap();
            vpushv(vtop - 2);
            vtop->type.t = 5;
            gaddrof();
            vpushi(size);
            gfunc_call(3);
    } else if (ft & 0x0080) {
        vdup(), vtop[-1] = vtop[-2];
        bit_pos = (((ft) >> 20) & 0x3f);
        bit_size = (((ft) >> (20 + 6)) & 0x3f);
        vtop[-1].type.t = ft & ~(((1 << (6+6)) - 1) << 20 | 0x0080);
        if ((ft & 0x000f) == 11) {
            gen_cast(&vtop[-1].type);
            vtop[-1].type.t = (vtop[-1].type.t & ~0x000f) | (1 | 0x0010);
        }
        r = adjust_bf(vtop - 1, bit_pos, bit_size);
        if (r == 7) {
            gen_cast_s((ft & 0x000f) == 4 ? 4 : 3);
            store_packed_bf(bit_pos, bit_size);
        } else {
            unsigned long long mask = (1ULL << bit_size) - 1;
            if ((ft & 0x000f) != 11) {
                if ((vtop[-1].type.t & 0x000f) == 4)
                    vpushll(mask);
                else
                    vpushi((unsigned)mask);
                gen_op('&');
            }
            vpushi(bit_pos);
            gen_op(0x01);
            vswap();
            vdup();
            vrott(3);
            if ((vtop->type.t & 0x000f) == 4)
                vpushll(~(mask << bit_pos));
            else
                vpushi(~((unsigned)mask << bit_pos));
            gen_op('&');
            gen_op('|');
            vstore();
            vpop();
        }
    } else if (dbt == 0) {
        --vtop;
    } else {
            rc = 0x0001;
            if (is_float(ft)) {
                rc = 0x0002;
            }
            r = gv(rc);
            if ((vtop[-1].r & 0x003f) == 0x0031) {
                SValue sv;
                t = get_reg(0x0001);
                sv.type.t = 3;
                sv.r = 0x0032 | 0x0100;
                sv.c.i = vtop[-1].c.i;
                load(t, &sv);
                vtop[-1].r = t | 0x0100;
            }
            if ((ft & 0x000f) == 4) {
                int addr_type = 3, load_size = 4, load_type = 3;
                vtop[-1].type.t = load_type;
                store(r, vtop - 1);
                vswap();
                vtop->type.t = addr_type;
                gaddrof();
                vpushi(load_size);
                gen_op('+');
                vtop->r |= 0x0100;
                vswap();
                vtop[-1].type.t = load_type;
                store(vtop->r2, vtop - 1);
            } else {
                store(r, vtop - 1);
            }

        vswap();
        vtop--;
        vtop->r |= delayed_cast;
    }
}

static void inc(int post, int c)
{
    test_lvalue();
    vdup();
    if (post) {
        gv_dup();
        vrotb(3);
        vrotb(3);
    }

    vpushi(c - 0xa3);
    gen_op('+');
    vstore();
    if (post)
        vpop();
}

static void parse_mult_str (CString *astr, const char *msg)
{

    if (tok != 0xb9)
        expect(msg);
    cstr_new(astr);
    while (tok == 0xb9) {

        cstr_cat(astr, tokc.str.data, -1);
        next();
    }
    cstr_ccat(astr, '\0');
}



static int exact_log2p1(int i)
{
  int ret;
  if (!i)
    return 0;
  for (ret = 1; i >= 1 << 8; ret += 8)
    i >>= 8;
  if (i >= 1 << 4)
    ret += 4, i >>= 4;
  if (i >= 1 << 2)
    ret += 2, i >>= 2;
  if (i >= 1 << 1)
    ret++;
  return ret;
}

static void parse_attribute(AttributeDef *ad) {
    int t, n;
    CString astr;

redo:
    if (tok != TOK_ATTRIBUTE1 && tok != TOK_ATTRIBUTE2)
        return;
}

static Sym * find_field (CType *type, int v)
{
    Sym *s = type->ref;
    v |= 0x20000000;
    while ((s = s->next) != ((void*)0)) {
	if ((s->v & 0x20000000) &&
	    (s->type.t & 0x000f) == 7 &&
	    (s->v & ~0x20000000) >= 0x10000000) {
	    Sym *ret = find_field (&s->type, v);
	    if (ret)
	        return ret;
	}
	if (s->v == v)
	  break;
    }
    return s;
}

static void struct_add_offset (Sym *s, int offset)
{
    while ((s = s->next) != ((void*)0)) {
	if ((s->v & 0x20000000) &&
	    (s->type.t & 0x000f) == 7 &&
	    (s->v & ~0x20000000) >= 0x10000000) {
	    struct_add_offset(s->type.ref, offset);
	} else
	  s->c += offset;
    }
}

static void struct_layout(CType *type, AttributeDef *ad)
{
    int size, align, maxalign, offset, c, bit_pos, bit_size;
    int packed, a, bt, prevbt, prev_bit_size;
    int pcc = 0;
    int pragma_pack = *tcc_state->pack_stack_ptr;
    Sym *f;

    maxalign = 1;
    offset = 0;
    c = 0;
    bit_pos = 0;
    prevbt = 7;
    prev_bit_size = 0;



    for (f = type->ref->next; f; f = f->next) {
        if (f->type.t & 0x0080)
            bit_size = (((f->type.t) >> (20 + 6)) & 0x3f);
        else
            bit_size = -1;
        size = type_size(&f->type, &align);
        a = f->a.aligned ? 1 << (f->a.aligned - 1) : 0;
        packed = 0;

        if (pcc && bit_size == 0) {


        } else {

            if (pcc && (f->a.packed || ad->a.packed))
                align = packed = 1;


            if (pragma_pack) {
                packed = 1;
                if (pragma_pack < align)
                    align = pragma_pack;

                if (pcc && pragma_pack < a)
                    a = 0;
            }
        }

        if (a)
            align = a;

        if (type->ref->type.t == (1 << 20 | 7)) {
	    if (pcc && bit_size >= 0)
	        size = (bit_size + 7) >> 3;
	    offset = 0;
	    if (size > c)
	        c = size;

	} else if (bit_size < 0) {
            if (pcc)
                c += (bit_pos + 7) >> 3;
	    c = (c + align - 1) & -align;
	    offset = c;
	    if (size > 0)
	        c += size;
	    bit_pos = 0;
	    prevbt = 7;
	    prev_bit_size = 0;

	} else {


            if (pcc) {






                if (bit_size == 0) {
            new_field:
		    c = (c + ((bit_pos + 7) >> 3) + align - 1) & -align;
		    bit_pos = 0;
                } else if (f->a.aligned) {
                    goto new_field;
                } else if (!packed) {
                    int a8 = align * 8;
	            int ofs = ((c * 8 + bit_pos) % a8 + bit_size + a8 - 1) / a8;
                    if (ofs > size / align)
                        goto new_field;
                }


                if (size == 8 && bit_size <= 32)
                    f->type.t = (f->type.t & ~0x000f) | 3, size = 4;

                while (bit_pos >= align * 8)
                    c += align, bit_pos -= align * 8;
                offset = c;




		if (f->v & 0x10000000

                    )
		    align = 1;

	    } else {
		bt = f->type.t & 0x000f;
		if ((bit_pos + bit_size > size * 8)
                    || (bit_size > 0) == (bt != prevbt)
                    ) {
		    c = (c + align - 1) & -align;
		    offset = c;
		    bit_pos = 0;




		    if (bit_size || prev_bit_size)
		        c += size;
		}




		if (bit_size == 0 && prevbt != bt)
		    align = 1;
		prevbt = bt;
                prev_bit_size = bit_size;
	    }

	    f->type.t = (f->type.t & ~(0x3f << 20))
		        | (bit_pos << 20);
	    bit_pos += bit_size;
	}
	if (align > maxalign)
	    maxalign = align;
# 3638 "tcc_src/tccgen.c"
	if (f->v & 0x10000000 && (f->type.t & 0x000f) == 7) {
	    Sym *ass;







	    int v2 = f->type.ref->v;
	    if (!(v2 & 0x20000000) &&
		(v2 & ~0x40000000) < 0x10000000) {
		Sym **pps;





		ass = f->type.ref;
		f->type.ref = sym_push(anon_sym++ | 0x20000000,
				       &f->type.ref->type, 0,
				       f->type.ref->c);
		pps = &f->type.ref->next;
		while ((ass = ass->next) != ((void*)0)) {
		    *pps = sym_push(ass->v, &ass->type, 0, ass->c);
		    pps = &((*pps)->next);
		}
		*pps = ((void*)0);
	    }
	    struct_add_offset(f->type.ref, offset);
	    f->c = 0;
	} else {
	    f->c = offset;
	}

	f->r = 0;
    }

    if (pcc)
        c += (bit_pos + 7) >> 3;


    a = bt = ad->a.aligned ? 1 << (ad->a.aligned - 1) : 1;
    if (a < maxalign)
        a = maxalign;
    type->ref->r = a;
    if (pragma_pack && pragma_pack < maxalign && 0 == pcc) {


        a = pragma_pack;
        if (a < bt)
            a = bt;
    }
    c = (c + a - 1) & -a;
    type->ref->c = c;






    for (f = type->ref->next; f; f = f->next) {
        int s, px, cx, c0;
        CType t;

        if (0 == (f->type.t & 0x0080))
            continue;
        f->type.ref = f;
        f->auxtype = -1;
        bit_size = (((f->type.t) >> (20 + 6)) & 0x3f);
        if (bit_size == 0)
            continue;
        bit_pos = (((f->type.t) >> 20) & 0x3f);
        size = type_size(&f->type, &align);
        if (bit_pos + bit_size <= size * 8 && f->c + size <= c)
            continue;


        c0 = -1, s = align = 1;
        for (;;) {
            px = f->c * 8 + bit_pos;
            cx = (px >> 3) & -align;
            px = px - (cx << 3);
            if (c0 == cx)
                break;
            s = (px + bit_size + 7) >> 3;
            if (s > 4) {
                t.t = 4;
            } else if (s > 2) {
                t.t = 3;
            } else if (s > 1) {
                t.t = 2;
            } else {
                t.t = 1;
            }
            s = type_size(&t, &align);
            c0 = cx;
        }

        if (px + bit_size <= s * 8 && cx + s <= c) {

            f->c = cx;
            bit_pos = px;
	    f->type.t = (f->type.t & ~(0x3f << 20))
		        | (bit_pos << 20);
            if (s != size)
                f->auxtype = t.t;






        } else {

            f->auxtype = 7;




        }
    }
}


static void struct_decl(CType *type, int u)
{
    int v, c, size, align, flexible;
    int bit_size, bsize, bt;
    Sym *s, *ss, **ps;
    AttributeDef ad, ad1;
    CType type1, btype;

    memset(&ad, 0, sizeof ad);
    next();
    parse_attribute(&ad);
    if (tok != '{') {
        v = tok;
        next();

        if (v < 256)
            expect("struct/union/enum name");
        s = struct_find(v);
        if (s && (s->sym_scope == local_scope || tok != '{')) {
            if (u == s->type.t)
                goto do_decl;
            if (u == (2 << 20) && IS_ENUM(s->type.t))
                goto do_decl;
            tcc_error("redefinition of '%s'", get_tok_str(v, ((void*)0)));
        }
    } else {
        v = anon_sym++;
    }

    type1.t = u == (2 << 20) ? u | 3 | 0x0010 : u;
    type1.ref = ((void*)0);

    s = sym_push(v | 0x40000000, &type1, 0, -1);
    s->r = 0;
do_decl:
    type->t = s->type.t;
    type->ref = s;

    if (tok == '{') {
        next();
        if (s->c != -1)
            tcc_error("struct/union/enum already defined");


        ps = &s->next;
        if (u == (2 << 20)) {
            long long ll = 0, pl = 0, nl = 0;
	    CType t;
            t.ref = s;

            t.t = 3|0x00002000|(3 << 20);
            for(;;) {
                v = tok;
                if (v < TOK_DEFINE)
                    expect("identifier");
                ss = sym_find(v);
                if (ss && !local_stack)
                    tcc_error("redefinition of enumerator '%s'",
                              get_tok_str(v, ((void*)0)));
                next();
                if (tok == '=') {
                    next();
		    ll = expr_const64();
                }
                ss = sym_push(v, &t, 0x0030, 0);
                ss->enum_val = ll;
                *ps = ss, ps = &ss->next;
                if (ll < nl)
                    nl = ll;
                if (ll > pl)
                    pl = ll;
                if (tok != ',')
                    break;
                next();
                ll++;

                if (tok == '}')
                    break;
            }
            skip('}');

            t.t = 3;
            if (nl >= 0) {
                if (pl != (unsigned)pl)
                    t.t = (4==8 ? 4|0x0800 : 4);
                t.t |= 0x0010;
            } else if (pl != (int)pl || nl != (int)nl)
                t.t = (4==8 ? 4|0x0800 : 4);
            s->type.t = type->t = t.t | (2 << 20);
            s->c = 0;

            for (ss = s->next; ss; ss = ss->next) {
                ll = ss->enum_val;
                if (ll == (int)ll)
                    continue;
                if (t.t & 0x0010) {
                    ss->type.t |= 0x0010;
                    if (ll == (unsigned)ll)
                        continue;
                }
                ss->type.t = (ss->type.t & ~0x000f)
                    | (4==8 ? 4|0x0800 : 4);
            }
        } else {
            c = 0;
            flexible = 0;
            while (tok != '}') {
                if (!parse_btype(&btype, &ad1)) {
		    skip(';');
		    continue;
		}
                while (1) {
		    if (flexible)
		        tcc_error("flexible array member '%s' not at the end of struct",
                              get_tok_str(v, ((void*)0)));
                    bit_size = -1;
                    v = 0;
                    type1 = btype;
                    if (tok != ':') {
			if (tok != ';')
                            type_decl(&type1, &ad1, &v, 2);
                        if (v == 0) {
                    	    if ((type1.t & 0x000f) != 7)
                        	expect("identifier");
                    	    else {
				int v = btype.ref->v;
				if (!(v & 0x20000000) && (v & ~0x40000000) < 0x10000000) {
				}
                    	    }
                        }
                        if (type_size(&type1, &align) < 0) {
			    if ((u == 7) && (type1.t & 0x0040) && c)
			        flexible = 1;
			    else
			        tcc_error("field '%s' has incomplete type",
                                      get_tok_str(v, ((void*)0)));
                        }
                        if ((type1.t & 0x000f) == 6 ||
                            (type1.t & (0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)))
                            tcc_error("invalid type for '%s'",
                                  get_tok_str(v, ((void*)0)));
                    }
                    if (tok == ':') {
                        next();
                        bit_size = expr_const();

                        if (bit_size < 0)
                            tcc_error("negative width in bit-field '%s'",
                                  get_tok_str(v, ((void*)0)));
                        if (v && bit_size == 0)
                            tcc_error("zero width for bit-field '%s'",
                                  get_tok_str(v, ((void*)0)));
			parse_attribute(&ad1);
                    }
                    size = type_size(&type1, &align);
                    if (bit_size >= 0) {
                        bt = type1.t & 0x000f;
                        if (bt != 3 &&
                            bt != 1 &&
                            bt != 2 &&
                            bt != 11 &&
                            bt != 4)
                            tcc_error("bitfields must have scalar type");
                        bsize = size * 8;
                        if (bit_size > bsize) {
                            tcc_error("width of '%s' exceeds its type",
                                  get_tok_str(v, ((void*)0)));
                        } else if (bit_size == bsize
                                    && !ad.a.packed && !ad1.a.packed) {

                            ;
                        } else if (bit_size == 64) {
                            tcc_error("field width 64 not implemented");
                        } else {
                            type1.t = (type1.t & ~(((1 << (6+6)) - 1) << 20 | 0x0080))
                                | 0x0080
                                | (bit_size << (20 + 6));
                        }
                    }
                    if (v != 0 || (type1.t & 0x000f) == 7) {


			c = 1;
                    }


                    if (v == 0 &&
			((type1.t & 0x000f) == 7 ||
			 bit_size >= 0)) {
		        v = anon_sym++;
		    }
                    if (v) {
                        ss = sym_push(v | 0x20000000, &type1, 0, 0);
                        ss->a = ad1.a;
                        *ps = ss;
                        ps = &ss->next;
                    }
                    if (tok == ';' || tok == (-1))
                        break;
                    skip(',');
                }
                skip(';');
            }
            skip('}');
	    parse_attribute(&ad);
	    struct_layout(type, &ad);
        }
    }
}

static void sym_to_attr(AttributeDef *ad, Sym *s)
{
    if (s->a.aligned && 0 == ad->a.aligned)
        ad->a.aligned = s->a.aligned;
    if (s->f.func_call && 0 == ad->f.func_call)
        ad->f.func_call = s->f.func_call;
    if (s->f.func_type && 0 == ad->f.func_type)
        ad->f.func_type = s->f.func_type;
    if (s->a.packed)
        ad->a.packed = 1;
}



static void parse_btype_qualify(CType *type, int qualifiers)
{
    while (type->t & 0x0040) {
        type->ref = sym_push(0x20000000, &type->ref->type, 0, type->ref->c);
        type = &type->ref->type;
    }
    type->t |= qualifiers;
}




static int parse_btype(CType *type, AttributeDef *ad) {
    int t, u, bt, st, type_found, typespec_found, g;
    Sym *s;
    CType type1;
    memset(ad, 0, sizeof(AttributeDef));
    type_found = 0;
    typespec_found = 0;
    t = 3;
    bt = st = -1;
    type->ref = ((void*)0);
    while(1) {
        switch(tok) {
        case TOK_EXTENSION:
            next();
            continue;
        case TOK_CHAR:
            u = VT_BYTE;
        basic_type:
            next();
        basic_type1:
            if (u == VT_SHORT || u == VT_LONG) {
                if (st != -1 || (bt != -1 && bt != VT_INT))
                    tmbt: tcc_error("too many basic types");
                st = u;
            } else {
                if (bt != -1 || (st != -1 && u != VT_INT))
                    goto tmbt;
                bt = u;
            }
            if (u != VT_INT)
                t = (t & ~(VT_BTYPE|VT_LONG)) | u;
            typespec_found = 1;
            break;
        case TOK_VOID:
            u = VT_VOID;
            goto basic_type;
        case TOK_SHORT:
            u = VT_SHORT;
            goto basic_type;
        case TOK_INT:
            u = VT_INT;
            goto basic_type;
        case TOK_LONG:
            if ((t & VT_BTYPE) == VT_DOUBLE) {
                t = (t & ~(VT_BTYPE|VT_LONG)) | VT_DOUBLE;
            } else if ((t & (VT_BTYPE|VT_LONG)) == VT_LONG) {
                t = (t & ~(VT_BTYPE|VT_LONG)) | VT_LLONG;
            } else {
                u = VT_LONG;
                goto basic_type;
            }
            next();
            break;
        case TOK_BOOL:
            u = VT_BOOL;
            goto basic_type;
        case TOK_FLOAT:
            u = VT_FLOAT;
            goto basic_type;
        case TOK_DOUBLE:
            if ((t & (VT_BTYPE|VT_LONG)) == VT_LONG) {
                t = (t & ~(VT_BTYPE|VT_LONG)) | VT_LDOUBLE;
            } else {
                u = VT_DOUBLE;
                goto basic_type;
            }
            next();
            break;
        case TOK_ENUM:
            struct_decl(&type1, VT_ENUM);
        basic_type2:
            u = type1.t;
            type->ref = type1.ref;
            goto basic_type1;
        case TOK_STRUCT:
            struct_decl(&type1, VT_STRUCT);
            goto basic_type2;
        case TOK_UNION:
            struct_decl(&type1, VT_UNION);
            goto basic_type2;
        case TOK_CONST1:
        case TOK_CONST2:
        case TOK_CONST3:
            type->t = t;
            parse_btype_qualify(type, VT_CONSTANT);
            t = type->t;
            next();
            break;
        case TOK_VOLATILE1:
        case TOK_VOLATILE2:
        case TOK_VOLATILE3:
            type->t = t;
            parse_btype_qualify(type, VT_VOLATILE);
            t = type->t;
            next();
            break;
        case TOK_SIGNED1:
        case TOK_SIGNED2:
        case TOK_SIGNED3:
            if ((t & (VT_DEFSIGN|VT_UNSIGNED)) == (VT_DEFSIGN|VT_UNSIGNED))
                tcc_error("signed and unsigned modifier");
            t |= VT_DEFSIGN;
            next();
            typespec_found = 1;
            break;
        case TOK_REGISTER:
        case TOK_AUTO:
        case TOK_RESTRICT1:
        case TOK_RESTRICT2:
        case TOK_RESTRICT3:
            next();
            break;
        case TOK_UNSIGNED:
            if ((t & (VT_DEFSIGN|VT_UNSIGNED)) == VT_DEFSIGN)
                tcc_error("signed and unsigned modifier");
            t |= VT_DEFSIGN | VT_UNSIGNED;
            next();
            typespec_found = 1;
            break;


        case TOK_EXTERN:
            g = VT_EXTERN;
            goto storage;
        case TOK_STATIC:
            g = VT_STATIC;
            goto storage;
        case TOK_TYPEDEF:
            g = VT_TYPEDEF;
            goto storage;
       storage:
            if (t & (VT_EXTERN|VT_STATIC|VT_TYPEDEF) & ~g)
                tcc_error("multiple storage classes");
            t |= g;
            next();
            break;
        case TOK_INLINE1:
        case TOK_INLINE2:
        case TOK_INLINE3:
            t |= VT_INLINE;
            next();
            break;


        case TOK_ATTRIBUTE1:
        case TOK_ATTRIBUTE2:
            parse_attribute(ad);
            if (ad->attr_mode) {
                u = ad->attr_mode -1;
                t = (t & ~(VT_BTYPE|VT_LONG)) | u;
            }
            break;

        case TOK_TYPEOF1:
        case TOK_TYPEOF2:
        case TOK_TYPEOF3:
            next();
            parse_expr_type(&type1);
            type1.t &= ~(VT_STORAGE&~VT_TYPEDEF);
	    if (type1.ref)
                sym_to_attr(ad, type1.ref);
            goto basic_type2;
        default:
            if (typespec_found)
                goto the_end;
            s = sym_find(tok);
            if (!s || !(s->type.t & VT_TYPEDEF))
                goto the_end;
            t &= ~(VT_BTYPE|VT_LONG);
            u = t & ~(VT_CONSTANT | VT_VOLATILE), t ^= u;
            type->t = (s->type.t & ~VT_TYPEDEF) | u;
            type->ref = s->type.ref;
            if (t)
                parse_btype_qualify(type, t);
            t = type->t;

            sym_to_attr(ad, s);
            next();
            typespec_found = 1;
            st = bt = -2;
            break;
        }
        type_found = 1;
    }
the_end:
    bt = t & (VT_BTYPE|VT_LONG);
    if (bt == VT_LONG)
        t |= LONG_SIZE == 8 ? VT_LLONG : VT_INT;
    type->t = t;
    return type_found;
}



static inline void convert_parameter_type(CType *pt)
{


    pt->t &= ~(0x0100 | 0x0200);

    pt->t &= ~0x0040;
    if ((pt->t & 0x000f) == 6) {
        mk_pointer(pt);
    }
}

static int post_type(CType *type, AttributeDef *ad, int storage, int td)
{
    int n, l, t1, arg_size, align;
    Sym **plast, *s, *first;
    AttributeDef ad1;
    CType pt;

    if (tok == '(') {

        next();
	if (td && !(td & 1))
	  return 0;
	if (tok == ')')
	  l = 0;
	else if (parse_btype(&pt, &ad1))
	  l = 1;
	else if (td)
	  return 0;
	else
	  l = 2;
        first = ((void*)0);
        plast = &first;
        arg_size = 0;
        if (l) {
            for(;;) {

                if (l != 2) {
                    if ((pt.t & 0x000f) == 0 && tok == ')')
                        break;
                    type_decl(&pt, &ad1, &n, 2 | 1);
                    if ((pt.t & 0x000f) == 0)
                        tcc_error("parameter declared as void");
                    arg_size += (type_size(&pt, &align) + 4 - 1) / 4;
                } else {
                    n = tok;
                    if (n < TOK_DEFINE)
                        expect("identifier");
                    pt.t = 0;
                    next();
                }
                convert_parameter_type(&pt);
                s = sym_push(n | 0x20000000, &pt, 0, 0);
                *plast = s;
                plast = &s->next;
                if (tok == ')')
                    break;
                skip(',');
                if (l == 1 && tok == 0xc8) {
                    l = 3;
                    next();
                    break;
                }
		if (l == 1 && !parse_btype(&pt, &ad1))
		    tcc_error("invalid type");
            }
        } else

            l = 2;
        skip(')');


        type->t &= ~0x0100;



        if (tok == '[') {
            next();
            skip(']');
            mk_pointer(type);
        }

        ad->f.func_args = arg_size;
        ad->f.func_type = l;
        s = sym_push(0x20000000, type, 0, 0);
        s->a = ad->a;
        s->f = ad->f;
        s->next = first;
        type->t = 6;
        type->ref = s;
    } else if (tok == '[') {
	int saved_nocode_wanted = nocode_wanted;

        next();
        if (tok == TOK_RESTRICT1)
            next();
        n = -1;
        t1 = 0;
        if (tok != ']') {
            if (!local_stack || (storage & 0x00002000))
                vpushi(expr_const());
            else {




		nocode_wanted = 0;
		gexpr();
	    }
            if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {
                n = vtop->c.i;
                if (n < 0)
                    tcc_error("invalid array size");
            } else {
                if (!is_integer_btype(vtop->type.t & 0x000f))
                    tcc_error("size of variable length array should be an integer");
                t1 = 0x0400;
            }
        }
        skip(']');

        post_type(type, ad, storage, 0);
        if (type->t == 6)
            tcc_error("declaration of an array of functions");
        t1 |= type->t & 0x0400;

        if (t1 & 0x0400) {
            loc -= type_size(&int_type, &align);
            loc &= -align;
            n = loc;

            gen_op('*');
            vset(&int_type, 0x0032|0x0100, n);
            vswap();
            vstore();
        }
        if (n != -1)
            vpop();
	nocode_wanted = saved_nocode_wanted;



        s = sym_push(0x20000000, type, 0, n);
        type->t = (t1 ? 0x0400 : 0x0040) | 5;
        type->ref = s;
    }
    return 1;
}
# 4401 "tcc_src/tccgen.c"
static CType *type_decl(CType *type, AttributeDef *ad, int *v, int td)
{
    CType *post, *ret;
    int qualifiers, storage;


    storage = type->t & (0x00001000 | 0x00002000 | 0x00004000 | 0x00008000);
    type->t &= ~(0x00001000 | 0x00002000 | 0x00004000 | 0x00008000);
    post = ret = type;

    while (tok == '*') {
        qualifiers = 0;
    redo:
        next();
        switch(tok) {
        case TOK_CONST1:
        case TOK_CONST2:
        case TOK_CONST3:
            qualifiers |= 0x0100;
            goto redo;
        case TOK_VOLATILE1:
        case TOK_VOLATILE2:
        case TOK_VOLATILE3:

            qualifiers |= 0x0200;
            goto redo;
        case TOK_RESTRICT1:
        case TOK_RESTRICT2:
        case TOK_RESTRICT3:
            goto redo;

	case TOK_ATTRIBUTE1:
	case TOK_ATTRIBUTE2:
	    parse_attribute(ad);
	    break;
        }
        mk_pointer(type);
        type->t |= qualifiers;
	if (ret == type)

	    ret = pointed_type(type);
    }

    if (tok == '(') {


	if (!post_type(type, ad, 0, td)) {




	    parse_attribute(ad);
	    post = type_decl(type, ad, v, td);
	    skip(')');
	}
    } else if (tok >= 256 && (td & 2)) {

	*v = tok;
	next();
    } else {
	if (!(td & 1))
	  expect("identifier");
	*v = 0;
    }
    post_type(post, ad, storage, 0);
    parse_attribute(ad);
    type->t |= storage;
    return ret;
}


static int lvalue_type(int t)
{
    int bt, r;
    r = 0x0100;
    bt = t & 0x000f;
    if (bt == 1 || bt == 11)
        r |= 0x1000;
    else if (bt == 2)
        r |= 0x2000;
    else
        return r;
    if (t & 0x0010)
        r |= 0x4000;
    return r;
}


static void indir(void)
{
    if ((vtop->type.t & 0x000f) != 5) {
        if ((vtop->type.t & 0x000f) == 6)
            return;
        expect("pointer");
    }
    if (vtop->r & 0x0100)
        gv(0x0001);
    vtop->type = *pointed_type(&vtop->type);

    if (!(vtop->type.t & 0x0040) && !(vtop->type.t & 0x0400)
        && (vtop->type.t & 0x000f) != 6) {
        vtop->r |= lvalue_type(vtop->type.t);
    }
}


static void gfunc_param_typed(Sym *func, Sym *arg)
{
    int func_type;
    CType type;

    func_type = func->f.func_type;
    if (func_type == 2 ||
        (func_type == 3 && arg == ((void*)0))) {

        if ((vtop->type.t & 0x000f) == 8) {
            gen_cast_s(9);
        } else if (vtop->type.t & 0x0080) {
            type.t = vtop->type.t & (0x000f | 0x0010);
	    type.ref = vtop->type.ref;
            gen_cast(&type);
        }
    } else if (arg == ((void*)0)) {
        tcc_error("too many arguments to function");
    } else {
        type = arg->type;
        type.t &= ~0x0100;
        gen_assign_cast(&type);
    }
}


static void expr_type(CType *type, void (*expr_fn)(void))
{
    nocode_wanted++;
    expr_fn();
    *type = vtop->type;
    vpop();
    nocode_wanted--;
}



static void parse_expr_type(CType *type)
{
    int n;
    AttributeDef ad;

    skip('(');
    if (parse_btype(type, &ad)) {
        type_decl(type, &ad, &n, 1);
    } else {
        expr_type(type, gexpr);
    }
    skip(')');
}

static void parse_type(CType *type)
{
    AttributeDef ad;
    int n;

    if (!parse_btype(type, &ad)) {
        expect("type");
    }
    type_decl(type, &ad, &n, 1);
}

static void parse_builtin_params(int nc, const char *args)
{
    char c, sep = '(';
    CType t;
    if (nc)
        nocode_wanted++;
    next();
    while ((c = *args++)) {
	skip(sep);
	sep = ',';
	switch (c) {
	    case 'e': expr_eq(); continue;
	    case 't': parse_type(&t); vpush(&t); continue;
	    default: tcc_error("internal error"); break;
	}
    }
    skip(')');
    if (nc)
        nocode_wanted--;
}

static void unary(void)
{
    int n, t, align, size, r, sizeof_caller;
    CType type;
    Sym *s;
    AttributeDef ad;

    sizeof_caller = in_sizeof;
    in_sizeof = 0;
    type.ref = ((void*)0);


 tok_next:
    switch(tok) {
    case TOK_EXTENSION:
        next();
        goto tok_next;
    case 0xb4:




    case 0xb5:
    case 0xb3:
	t = 3;
 push_tokc:
	type.t = t;
	vsetc(&type, 0x0030, &tokc);
        next();
        break;
    case 0xb6:
        t = 3 | 0x0010;
        goto push_tokc;
    case 0xb7:
        t = 4;
	goto push_tokc;
    case 0xb8:
        t = 4 | 0x0010;
	goto push_tokc;
    case 0xbb:
        t = 8;
	goto push_tokc;
    case 0xbc:
        t = 9;
	goto push_tokc;
    case 0xbd:
        t = 10;
	goto push_tokc;
    case 0xce:
        t = (4 == 8 ? 4 : 3) | 0x0800;
	goto push_tokc;
    case 0xcf:
        t = (4 == 8 ? 4 : 3) | 0x0800 | 0x0010;
	goto push_tokc;
    case TOK___FUNCTION__:
        if (!gnu_ext)
            goto tok_identifier;

    case TOK___FUNC__:
        {
            void *ptr;
            int len;

            len = strlen(funcname) + 1;

            type.t = 1;
            mk_pointer(&type);
            type.t |= 0x0040;
            type.ref->c = len;
            vpush_ref(&type, data_section, data_section->data_offset, len);
            if (!(nocode_wanted > 0)) {
                ptr = section_ptr_add(data_section, len);
                memcpy(ptr, funcname, len);
            }
            next();
        }
        break;
    case 0xba:



        t = 3;

        goto str_init;
    case 0xb9:

        t = 1;
    str_init:
        if (tcc_state->warn_write_strings)
            t |= 0x0100;
        type.t = t;
        mk_pointer(&type);
        type.t |= 0x0040;
        memset(&ad, 0, sizeof(AttributeDef));
        decl_initializer_alloc(&type, &ad, 0x0030, 2, 0, 0);
        break;
    case '(':
        next();

        if (parse_btype(&type, &ad)) {
            type_decl(&type, &ad, &n, 1);
            skip(')');

            if (tok == '{') {

                if (global_expr)
                    r = 0x0030;
                else
                    r = 0x0032;

                if (!(type.t & 0x0040))
                    r |= lvalue_type(type.t);
                memset(&ad, 0, sizeof(AttributeDef));
                decl_initializer_alloc(&type, &ad, r, 1, 0, 0);
            } else {
                if (sizeof_caller) {
                    vpush(&type);
                    return;
                }
                unary();
                gen_cast(&type);
            }
        } else if (tok == '{') {
	    int saved_nocode_wanted = nocode_wanted;
            if (const_wanted)
                tcc_error("expected constant");

            save_regs(0);





            block(((void*)0), ((void*)0), 1);
	    nocode_wanted = saved_nocode_wanted;
            skip(')');
        } else {
            gexpr();
            skip(')');
        }
        break;
    case '*':
        next();
        unary();
        indir();
        break;
    case '&':
        next();
        unary();





        if ((vtop->type.t & 0x000f) != 6 &&
            !(vtop->type.t & 0x0040))
            test_lvalue();
        mk_pointer(&vtop->type);
        gaddrof();
        break;
    case '!':
        next();
        unary();
        if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {
            gen_cast_s(11);
            vtop->c.i = !vtop->c.i;
        } else if ((vtop->r & 0x003f) == 0x0033)
            vtop->c.i ^= 1;
        else {
            save_regs(1);
            vseti(0x0034, gvtst(1, 0));
        }
        break;
    case '~':
        next();
        unary();
        vpushi(-1);
        gen_op('^');
        break;
    case '+':
        next();
        unary();
        if ((vtop->type.t & 0x000f) == 5)
            tcc_error("pointer not accepted for unary plus");



	if (!is_float(vtop->type.t)) {
	    vpushi(0);
	    gen_op('+');
	}
        break;
    case TOK_SIZEOF:
    case TOK_ALIGNOF1:
    case TOK_ALIGNOF2:
        t = tok;
        next();
        in_sizeof++;
        expr_type(&type, unary);
        s = vtop[1].sym;
        size = type_size(&type, &align);
        if (s && s->a.aligned)
            align = 1 << (s->a.aligned - 1);
        if (t == TOK_SIZEOF) {
            if (!(type.t & 0x0400)) {
                if (size < 0)
                    tcc_error("sizeof applied to an incomplete type");
                vpushs(size);
            } else {
            }
        } else {
            vpushs(align);
        }
        vtop->type.t |= 0x0010;
        break;

    case TOK_builtin_expect:

	parse_builtin_params(0, "ee");
	vpop();
        break;
    case TOK_builtin_types_compatible_p:
	parse_builtin_params(0, "tt");
	vtop[-1].type.t &= ~(0x0100 | 0x0200);
	vtop[0].type.t &= ~(0x0100 | 0x0200);
	n = is_compatible_types(&vtop[-1].type, &vtop[0].type);
	vtop -= 2;
	vpushi(n);
        break;
    case TOK_builtin_choose_expr:
	{
	    int64_t c;
	    next();
	    skip('(');
	    c = expr_const64();
	    skip(',');
	    if (!c) {
		nocode_wanted++;
	    }
	    expr_eq();
	    if (!c) {
		vpop();
		nocode_wanted--;
	    }
	    skip(',');
	    if (c) {
		nocode_wanted++;
	    }
	    expr_eq();
	    if (c) {
		vpop();
		nocode_wanted--;
	    }
	    skip(')');
	}
        break;
    case TOK_builtin_constant_p:
	parse_builtin_params(1, "e");
	n = (vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030;
	vtop--;
	vpushi(n);
        break;
    case TOK_builtin_frame_address:
    case TOK_builtin_return_address:
        {
            int tok1 = tok;
            int level;
            next();
            skip('(');
            if (tok != 0xb5) {
                tcc_error("%s only takes positive integers",
                          tok1 == TOK_builtin_return_address ?
                          "__builtin_return_address" :
                          "__builtin_frame_address");
            }
            level = (uint32_t)tokc.i;
            next();
            skip(')');
            type.t = 0;
            mk_pointer(&type);
            vset(&type, 0x0032, 0);
            while (level--) {
                mk_pointer(&vtop->type);
                indir();
            }
            if (tok1 == TOK_builtin_return_address) {

                vpushi(4);
                gen_op('+');
                mk_pointer(&vtop->type);
                indir();
            }
        }
        break;
# 4942 "tcc_src/tccgen.c"
    case 0xa4:
    case 0xa2:
        t = tok;
        next();
        unary();
        inc(0, t);
        break;
    case '-':
        next();
        unary();
        t = vtop->type.t & 0x000f;
	if (is_float(t)) {


	    vpush(&vtop->type);
	    if (t == 8)
	        vtop->c.f = -1.0 * 0.0;
	    else if (t == 9)
	        vtop->c.d = -1.0 * 0.0;
	    else
	        vtop->c.ld = -1.0 * 0.0;
	} else
	    vpushi(0);
	vswap();
	gen_op('-');
        break;
    case 0xa0:
        if (!gnu_ext)
            goto tok_identifier;
        next();

        if (tok < TOK_DEFINE)
            expect("label identifier");
        s = label_find(tok);
        if (!s) {
            s = label_push(&global_label_stack, tok, 1);
        } else {
            if (s->r == 2)
                s->r = 1;
        }
        if (!s->type.t) {
            s->type.t = 0;
            mk_pointer(&s->type);
            s->type.t |= 0x00002000;
        }
        vpushsym(&s->type, s);
        next();
        break;

    case TOK_GENERIC:
    {
	CType controlling_type;
	int has_default = 0;
	int has_match = 0;
	int learn = 0;
	TokenString *str = ((void*)0);

	next();
	skip('(');
	expr_type(&controlling_type, expr_eq);
	controlling_type.t &= ~(0x0100 | 0x0200 | 0x0040);
	for (;;) {
	    learn = 0;
	    skip(',');
	    if (tok == TOK_DEFAULT) {
		if (has_default)
		    tcc_error("too many 'default'");
		has_default = 1;
		if (!has_match)
		    learn = 1;
		next();
	    } else {
	        AttributeDef ad_tmp;
		int itmp;
	        CType cur_type;
		parse_btype(&cur_type, &ad_tmp);
		type_decl(&cur_type, &ad_tmp, &itmp, 1);
		if (compare_types(&controlling_type, &cur_type, 0)) {
		    if (has_match) {
		      tcc_error("type match twice");
		    }
		    has_match = 1;
		    learn = 1;
		}
	    }
	    skip(':');
	    if (learn) {
		if (str)
		    tok_str_free(str);
		skip_or_save_block(&str);
	    } else {
		skip_or_save_block(((void*)0));
	    }
	    if (tok == ')')
		break;
	}
	if (!str) {
	    char buf[60];
	    type_to_str(buf, sizeof buf, &controlling_type, ((void*)0));
	    tcc_error("type '%s' does not match any association", buf);
	}
	begin_macro(str, 1);
	next();
	expr_eq();
	if (tok != (-1))
	    expect(",");
	end_macro();
        next();
	break;
    }

    case TOK___NAN__:
        vpush64(9, 0x7ff8000000000000ULL);
        next();
        break;
    case TOK___SNAN__:
        vpush64(9, 0x7ff0000000000001ULL);
        next();
        break;
    case TOK___INF__:
        vpush64(9, 0x7ff0000000000000ULL);
        next();
        break;

    default:
    tok_identifier:
        t = tok;
        next();
        if (t < TOK_DEFINE)
            expect("identifier");
        s = sym_find(t);
        if (!s || (((s)->type.t & (0x000f | (0 | 0x0010))) == (0 | 0x0010))) {
            const char *name = get_tok_str(t, ((void*)0));
            if (tok != '(')
                tcc_error("'%s' undeclared", name);
            if (tcc_state->warn_implicit_function_declaration
            )
                tcc_warning("implicit declaration of function '%s'", name);
            s = external_global_sym(t, &func_old_type, 0);
        }
        r = s->r;
        if ((r & 0x003f) < 0x0030)
            r = (r & ~0x003f) | 0x0032;
        vset(&s->type, r, s->c);
	vtop->sym = s;
        if (r & 0x0200) {
            vtop->c.i = 0;
        } else if (r == 0x0030 && IS_ENUM(s->type.t)) {
            vtop->c.i = s->enum_val;
        }
        break;
    }


    while (1) {
        if (tok == 0xa4 || tok == 0xa2) {
            inc(1, tok);
            next();
        } else if (tok == '.' || tok == 0xc7 || tok == 0xbc) {
            int qualifiers;

            if (tok == 0xc7)
                indir();
            qualifiers = vtop->type.t & (0x0100 | 0x0200);
            test_lvalue();
            gaddrof();

            if ((vtop->type.t & 0x000f) != 7)
                expect("struct or union");
            if (tok == 0xbc)
                expect("field name");
            next();
            if (tok == 0xb5 || tok == 0xb6)
                expect("field name");
	    s = find_field(&vtop->type, tok);
            if (!s)
                tcc_error("field not found: %s",  get_tok_str(tok & ~0x20000000, &tokc));

            vtop->type = char_pointer_type;
            vpushi(s->c);
            gen_op('+');

            vtop->type = s->type;
            vtop->type.t |= qualifiers;

            if (!(vtop->type.t & 0x0040)) {
                vtop->r |= lvalue_type(vtop->type.t);


                if (0 && (vtop->r & 0x003f) != 0x0032)
                    vtop->r |= 0x0800;

            }
            next();
        } else if (tok == '[') {
            next();
            gexpr();
            gen_op('+');
            indir();
            skip(']');
        } else if (tok == '(') {
            SValue ret;
            Sym *sa;
            int nb_args, ret_nregs, ret_align, regsize, variadic;


            if ((vtop->type.t & 0x000f) != 6) {

                if ((vtop->type.t & (0x000f | 0x0040)) == 5) {
                    vtop->type = *pointed_type(&vtop->type);
                    if ((vtop->type.t & 0x000f) != 6)
                        goto error_func;
                } else {
                error_func:
                    expect("function pointer");
                }
            } else {
                vtop->r &= ~0x0100;
            }

            s = vtop->type.ref;
            next();
            sa = s->next;
            nb_args = regsize = 0;
            ret.r2 = 0x0030;

            if ((s->type.t & 0x000f) == 7) {
                variadic = (s->f.func_type == 3);
                ret_nregs = gfunc_sret(&s->type, variadic, &ret.type,
                                       &ret_align, &regsize);
                if (!ret_nregs) {

                    size = type_size(&s->type, &align);
# 5199 "tcc_src/tccgen.c"
                    loc = (loc - size) & -align;
                    ret.type = s->type;
                    ret.r = 0x0032 | 0x0100;


                    vseti(0x0032, loc);
                    ret.c = vtop->c;
                    nb_args++;
                }
            } else {
                ret_nregs = 1;
                ret.type = s->type;
            }

            if (ret_nregs) {

                if (is_float(ret.type.t)) {
                    ret.r = reg_fret(ret.type.t);




                } else {




                    if ((ret.type.t & 0x000f) == 4)

                        ret.r2 = TREG_EDX;

                    ret.r = TREG_EAX;
                }
                ret.c.i = 0;
            }
            if (tok != ')') {
                for(;;) {
                    expr_eq();
                    gfunc_param_typed(s, sa);
                    nb_args++;
                    if (sa)
                        sa = sa->next;
                    if (tok == ')')
                        break;
                    skip(',');
                }
            }
            if (sa)
                tcc_error("too few arguments to function");
            skip(')');
            gfunc_call(nb_args);


            for (r = ret.r + ret_nregs + !ret_nregs; r-- > ret.r;) {
                vsetc(&ret.type, r, &ret.c);
                vtop->r2 = ret.r2;
            }


            if (((s->type.t & 0x000f) == 7) && ret_nregs) {
                int addr, offset;

                size = type_size(&s->type, &align);


		if (regsize > align)
		  align = regsize;
                loc = (loc - size) & -align;
                addr = loc;
                offset = 0;
                for (;;) {
                    vset(&ret.type, 0x0032 | 0x0100, addr + offset);
                    vswap();
                    vstore();
                    vtop--;
                    if (--ret_nregs == 0)
                        break;
                    offset += regsize;
                }
                vset(&s->type, 0x0032 | 0x0100, addr);
            }
        } else {
            break;
        }
    }
}

static void expr_prod(void)
{
    int t;

    unary();
    while (tok == '*' || tok == '/' || tok == '%') {
        t = tok;
        next();
        unary();
        gen_op(t);
    }
}

static void expr_sum(void)
{
    int t;

    expr_prod();
    while (tok == '+' || tok == '-') {
        t = tok;
        next();
        expr_prod();
        gen_op(t);
    }
}

static void expr_shift(void)
{
    int t;

    expr_sum();
    while (tok == 0x01 || tok == 0x02) {
        t = tok;
        next();
        expr_sum();
        gen_op(t);
    }
}

static void expr_cmp(void)
{
    int t;

    expr_shift();
    while ((tok >= 0x96 && tok <= 0x9f) ||
           tok == 0x92 || tok == 0x93) {
        t = tok;
        next();
        expr_shift();
        gen_op(t);
    }
}

static void expr_cmpeq(void)
{
    int t;

    expr_cmp();
    while (tok == 0x94 || tok == 0x95) {
        t = tok;
        next();
        expr_cmp();
        gen_op(t);
    }
}

static void expr_and(void)
{
    expr_cmpeq();
    while (tok == '&') {
        next();
        expr_cmpeq();
        gen_op('&');
    }
}

static void expr_xor(void)
{
    expr_and();
    while (tok == '^') {
        next();
        expr_and();
        gen_op('^');
    }
}

static void expr_or(void)
{
    expr_xor();
    while (tok == '|') {
        next();
        expr_xor();
        gen_op('|');
    }
}

static void expr_land(void)
{
    expr_or();
    if (tok == 0xa0) {
	int t = 0;
	for(;;) {
	    if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {
                gen_cast_s(11);
		if (vtop->c.i) {
		    vpop();
		} else {
		    nocode_wanted++;
		    while (tok == 0xa0) {
			next();
			expr_or();
			vpop();
		    }
		    nocode_wanted--;
		    if (t)
		      gsym(t);
		    gen_cast_s(3);
		    break;
		}
	    } else {
		if (!t)
		  save_regs(1);
		t = gvtst(1, t);
	    }
	    if (tok != 0xa0) {
		if (t)
		  vseti(0x0035, t);
		else
		  vpushi(1);
		break;
	    }
	    next();
	    expr_or();
	}
    }
}

static void expr_lor(void)
{
    expr_land();
    if (tok == 0xa1) {
	int t = 0;
	for(;;) {
	    if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {
                gen_cast_s(11);
		if (!vtop->c.i) {
		    vpop();
		} else {
		    nocode_wanted++;
		    while (tok == 0xa1) {
			next();
			expr_land();
			vpop();
		    }
		    nocode_wanted--;
		    if (t)
		      gsym(t);
		    gen_cast_s(3);
		    break;
		}
	    } else {
		if (!t)
		  save_regs(1);
		t = gvtst(0, t);
	    }
	    if (tok != 0xa1) {
		if (t)
		  vseti(0x0034, t);
		else
		  vpushi(0);
		break;
	    }
	    next();
	    expr_land();
	}
    }
}




static int condition_3way(void)
{
    int c = -1;
    if ((vtop->r & (0x003f | 0x0100)) == 0x0030 &&
	(!(vtop->r & 0x0200) || !vtop->sym->a.weak)) {
	vdup();
        gen_cast_s(11);
	c = vtop->c.i;
	vpop();
    }
    return c;
}

static void expr_cond(void)
{
    int tt, u, r1, r2, rc, t1, t2, bt1, bt2, islv, c, g;
    SValue sv;
    CType type, type1, type2;

    expr_lor();
    if (tok == '?') {
        next();
	c = condition_3way();
        g = (tok == ':' && gnu_ext);
        if (c < 0) {


            if (is_float(vtop->type.t)) {
                rc = 0x0002;





            } else
                rc = 0x0001;
            gv(rc);
            save_regs(1);
            if (g)
                gv_dup();
            tt = gvtst(1, 0);

        } else {
            if (!g)
                vpop();
            tt = 0;
        }

        if (1) {
            if (c == 0)
                nocode_wanted++;
            if (!g)
                gexpr();

            type1 = vtop->type;
            sv = *vtop;
            vtop--;
            skip(':');

            u = 0;
            if (c < 0)
                u = gjmp(0);
            gsym(tt);

            if (c == 0)
                nocode_wanted--;
            if (c == 1)
                nocode_wanted++;
            expr_cond();
            if (c == 1)
                nocode_wanted--;

            type2 = vtop->type;
            t1 = type1.t;
            bt1 = t1 & 0x000f;
            t2 = type2.t;
            bt2 = t2 & 0x000f;
            type.ref = ((void*)0);


            if (is_float(bt1) || is_float(bt2)) {
                if (bt1 == 10 || bt2 == 10) {
                    type.t = 10;

                } else if (bt1 == 9 || bt2 == 9) {
                    type.t = 9;
                } else {
                    type.t = 8;
                }
            } else if (bt1 == 4 || bt2 == 4) {

                type.t = 4 | 0x0800;
                if (bt1 == 4)
                    type.t &= t1;
                if (bt2 == 4)
                    type.t &= t2;

                if ((t1 & (0x000f | 0x0010 | 0x0080)) == (4 | 0x0010) ||
                    (t2 & (0x000f | 0x0010 | 0x0080)) == (4 | 0x0010))
                    type.t |= 0x0010;
            } else if (bt1 == 5 || bt2 == 5) {


		if (is_null_pointer (vtop))
		  type = type1;
		else if (is_null_pointer (&sv))
		  type = type2;


		else
		  type = type1;
            } else if (bt1 == 6 || bt2 == 6) {

                type = bt1 == 6 ? type1 : type2;
            } else if (bt1 == 7 || bt2 == 7) {

                type = bt1 == 7 ? type1 : type2;
            } else if (bt1 == 0 || bt2 == 0) {

                type.t = 0;
            } else {

                type.t = 3 | (0x0800 & (t1 | t2));

                if ((t1 & (0x000f | 0x0010 | 0x0080)) == (3 | 0x0010) ||
                    (t2 & (0x000f | 0x0010 | 0x0080)) == (3 | 0x0010))
                    type.t |= 0x0010;
            }


            islv = (vtop->r & 0x0100) && (sv.r & 0x0100) && 7 == (type.t & 0x000f);
            islv &= c < 0;


            if (c != 1) {
                gen_cast(&type);
                if (islv) {
                    mk_pointer(&vtop->type);
                    gaddrof();
                } else if (7 == (vtop->type.t & 0x000f))
                    gaddrof();
            }

            rc = 0x0001;
            if (is_float(type.t)) {
                rc = 0x0002;





            } else if ((type.t & 0x000f) == 4) {


                rc = 0x0004;
            }

            tt = r2 = 0;
            if (c < 0) {
                r2 = gv(rc);
                tt = gjmp(0);
            }
            gsym(u);



            if (c != 0) {
                *vtop = sv;
                gen_cast(&type);
                if (islv) {
                    mk_pointer(&vtop->type);
                    gaddrof();
                } else if (7 == (vtop->type.t & 0x000f))
                    gaddrof();
            }

            if (c < 0) {
                r1 = gv(rc);
                move_reg(r2, r1, type.t);
                vtop->r = r2;
                gsym(tt);
                if (islv)
                    indir();
            }
        }
    }
}

static void expr_eq(void)
{
    int t;

    expr_cond();
    if (tok == '=' ||
        (tok >= 0xa5 && tok <= 0xaf) ||
        tok == 0xde || tok == 0xfc ||
        tok == 0x81 || tok == 0x82) {
        test_lvalue();
        t = tok;
        next();
        if (t == '=') {
            expr_eq();
        } else {
            vdup();
            expr_eq();
            gen_op(t & 0x7f);
        }
        vstore();
    }
}

static void gexpr(void)
{
    while (1) {
        expr_eq();
        if (tok != ',')
            break;
        vpop();
        next();
    }
}


static void expr_const1(void)
{
    const_wanted++;
    nocode_wanted++;
    expr_cond();
    nocode_wanted--;
    const_wanted--;
}


static inline int64_t expr_const64(void)
{
    int64_t c;
    expr_const1();
    if ((vtop->r & (0x003f | 0x0100 | 0x0200)) != 0x0030)
        expect("constant expression");
    c = vtop->c.i;
    vpop();
    return c;
}



static int expr_const(void)
{
    int c;
    int64_t wc = expr_const64();
    c = wc;
    if (c != wc && (unsigned)c != wc)
        tcc_error("constant exceeds 32 bit");
    return c;
}



static int is_label(void)
{
    int last_tok;


    if (tok < TOK_DEFINE)
        return 0;

    last_tok = tok;
    next();
    if (tok == ':') {
        return last_tok;
    } else {
        unget_tok(last_tok);
        return 0;
    }
}


static void gfunc_return(CType *func_type)
{
    if ((func_type->t & 0x000f) == 7) {
        CType type, ret_type;
        int ret_align, ret_nregs, regsize;
        ret_nregs = gfunc_sret(func_type, func_var, &ret_type,
                               &ret_align, &regsize);
        if (0 == ret_nregs) {


            type = *func_type;
            mk_pointer(&type);
            vset(&type, 0x0032 | 0x0100, func_vc);
            indir();
            vswap();

            vstore();
        } else {

            int r, size, addr, align;
            size = type_size(func_type,&align);
            if ((vtop->r != (0x0032 | 0x0100) ||
                 (vtop->c.i & (ret_align-1)))
                && (align & (ret_align-1))) {
                loc = (loc - size) & -ret_align;
                addr = loc;
                type = *func_type;
                vset(&type, 0x0032 | 0x0100, addr);
                vswap();
                vstore();
                vpop();
                vset(&ret_type, 0x0032 | 0x0100, addr);
            }
            vtop->type = ret_type;
            if (is_float(ret_type.t))
                r = rc_fret(ret_type.t);
            else
                r = 0x0004;

            if (ret_nregs == 1)
                gv(r);
            else {
                for (;;) {
                    vdup();
                    gv(r);
                    vpop();
                    if (--ret_nregs == 0)
                      break;



                    r <<= 1;
                    vtop->c.i += regsize;
                }
            }
        }
    } else if (is_float(func_type->t)) {
        gv(rc_fret(func_type->t));
    } else {
        gv(0x0004);
    }
    vtop--;
}


static int case_cmp(const void *pa, const void *pb)
{
    int64_t a = (*(struct case_t**) pa)->v1;
    int64_t b = (*(struct case_t**) pb)->v1;
    return a < b ? -1 : a > b;
}

static void gcase(struct case_t **base, int len, int *bsym)
{
    struct case_t *p;
    int e;
    int ll = (vtop->type.t & 0x000f) == 4;
    gv(0x0001);
    while (len > 4) {

        p = base[len/2];
        vdup();
	if (ll)
	    vpushll(p->v2);
	else
	    vpushi(p->v2);
        gen_op(0x9e);
        e = gtst(1, 0);
        vdup();
	if (ll)
	    vpushll(p->v1);
	else
	    vpushi(p->v1);
        gen_op(0x9d);
        gtst_addr(0, p->sym);

        gcase(base, len/2, bsym);
        if (cur_switch->def_sym)
            gjmp_addr(cur_switch->def_sym);
        else
            *bsym = gjmp(*bsym);

        gsym(e);
        e = len/2 + 1;
        base += e; len -= e;
    }

    while (len--) {
        p = *base++;
        vdup();
	if (ll)
	    vpushll(p->v2);
	else
	    vpushi(p->v2);
        if (p->v1 == p->v2) {
            gen_op(0x94);
            gtst_addr(0, p->sym);
        } else {
            gen_op(0x9e);
            e = gtst(1, 0);
            vdup();
	    if (ll)
	        vpushll(p->v1);
	    else
	        vpushi(p->v1);
            gen_op(0x9d);
            gtst_addr(0, p->sym);
            gsym(e);
        }
    }
}

static void block(int *bsym, int *csym, int is_expr)
{
    int a, b, c, d, cond;
    Sym *s;
    if (is_expr) {
        vpushi(0);
        vtop->type.t = 0;
    }
    if (tok == TOK_IF) {
	int saved_nocode_wanted = nocode_wanted;
        next();
        skip('(');
        gexpr();
        skip(')');
	cond = condition_3way();
        if (cond == 1)
            a = 0, vpop();
        else
            a = gvtst(1, 0);
        if (cond == 0)
	    nocode_wanted |= 0x20000000;
        block(bsym, csym, 0);
	if (cond != 1)
	    nocode_wanted = saved_nocode_wanted;
        c = tok;
        if (c == TOK_ELSE) {
            next();
            d = gjmp(0);
            gsym(a);
	    if (cond == 1)
	        nocode_wanted |= 0x20000000;
            block(bsym, csym, 0);
            gsym(d);
	    if (cond != 0)
		nocode_wanted = saved_nocode_wanted;
        } else
            gsym(a);
    } else if (tok == TOK_WHILE) {
	int saved_nocode_wanted;
	nocode_wanted &= ~0x20000000;
        next();
        d = ind;
        skip('(');
        gexpr();
        skip(')');
        a = gvtst(1, 0);
        b = 0;
        ++local_scope;
	saved_nocode_wanted = nocode_wanted;
        block(&a, &b, 0);
	nocode_wanted = saved_nocode_wanted;
        --local_scope;
        gjmp_addr(d);
        gsym(a);
        gsym_addr(b, d);
    } else if (tok == '{') {
        Sym *llabel;
        int block_vla_sp_loc = vla_sp_loc, saved_vlas_in_scope = vlas_in_scope;

        next();

        s = local_stack;
        llabel = local_label_stack;
        ++local_scope;


        if (tok == TOK_LABEL) {
            next();
            for(;;) {
                if (tok < TOK_DEFINE)
                    expect("label identifier");
                label_push(&local_label_stack, tok, 2);
                next();
                if (tok == ',') {
                    next();
                } else {
                    skip(';');
                    break;
                }
            }
        }
        while (tok != '}') {
	    if ((a = is_label()))
		unget_tok(a);
	    else
	        decl(0x0032);
            if (tok != '}') {
                if (is_expr)
                    vpop();
                block(bsym, csym, is_expr);
            }
        }
        label_pop(&local_label_stack, llabel, is_expr);
        --local_scope;
	sym_pop(&local_stack, s, is_expr);
        if (vlas_in_scope > saved_vlas_in_scope) {
            vla_sp_loc = saved_vlas_in_scope ? block_vla_sp_loc : vla_sp_root_loc;
        }
        vlas_in_scope = saved_vlas_in_scope;
        next();
    } else if (tok == TOK_RETURN) {
        next();
        if (tok != ';') {
            gexpr();
            gen_assign_cast(&func_vt);
            if ((func_vt.t & 0x000f) == 0)
                vtop--;
            else
                gfunc_return(&func_vt);
        }
        skip(';');
        if (tok != '}' || local_scope != 1)
            rsym = gjmp(rsym);
	nocode_wanted |= 0x20000000;
    } else if (tok == TOK_BREAK) {
        if (!bsym)
            tcc_error("cannot break");
        *bsym = gjmp(*bsym);
        next();
        skip(';');
	nocode_wanted |= 0x20000000;
    } else if (tok == TOK_CONTINUE) {

        if (!csym)
            tcc_error("cannot continue");
        *csym = gjmp(*csym);
        next();
        skip(';');
    } else if (tok == TOK_FOR) {
        int e;
	int saved_nocode_wanted;
	nocode_wanted &= ~0x20000000;
        next();
        skip('(');
        s = local_stack;
        ++local_scope;
        if (tok != ';') {

            if (!decl0(0x0032, 1, ((void*)0))) {

                gexpr();
                vpop();
            }
        }
        skip(';');
        d = ind;
        c = ind;
        a = 0;
        b = 0;
        if (tok != ';') {
            gexpr();
            a = gvtst(1, 0);
        }
        skip(';');
        if (tok != ')') {
            e = gjmp(0);
            c = ind;
            gexpr();
            vpop();
            gjmp_addr(d);
            gsym(e);
        }
        skip(')');
	saved_nocode_wanted = nocode_wanted;
        block(&a, &b, 0);
	nocode_wanted = saved_nocode_wanted;
        gjmp_addr(c);
        gsym(a);
        gsym_addr(b, c);
        --local_scope;
        sym_pop(&local_stack, s, 0);

    } else
    if (tok == TOK_DO) {
	int saved_nocode_wanted;
	nocode_wanted &= ~0x20000000;
        next();
        a = 0;
        b = 0;
        d = ind;
	saved_nocode_wanted = nocode_wanted;
        block(&a, &b, 0);
        skip(TOK_WHILE);
        skip('(');
        gsym(b);
	gexpr();
	c = gvtst(0, 0);
	gsym_addr(c, d);
	nocode_wanted = saved_nocode_wanted;
        skip(')');
        gsym(a);
        skip(';');
    } else
    if (tok == TOK_SWITCH) {
        struct switch_t *saved, sw;
	int saved_nocode_wanted = nocode_wanted;
	SValue switchval;
        next();
        skip('(');
        gexpr();
        skip(')');
	switchval = *vtop--;
        a = 0;
        b = gjmp(0);
        sw.p = ((void*)0); sw.n = 0; sw.def_sym = 0;
        saved = cur_switch;
        cur_switch = &sw;
        block(&a, csym, 0);
	nocode_wanted = saved_nocode_wanted;
        a = gjmp(a);

        gsym(b);
        qsort(sw.p, sw.n, sizeof(void*), case_cmp);
        for (b = 1; b < sw.n; b++)
            if (sw.p[b - 1]->v2 >= sw.p[b]->v1)
                tcc_error("duplicate case value");


        if ((switchval.type.t & 0x000f) == 4)
            switchval.type.t &= ~0x0010;
        vpushv(&switchval);
        gcase(sw.p, sw.n, &a);
        vpop();
        if (sw.def_sym)
          gjmp_addr(sw.def_sym);
        dynarray_reset(&sw.p, &sw.n);
        cur_switch = saved;

        gsym(a);
    } else
    if (tok == TOK_CASE) {
        struct case_t *cr = tcc_malloc(sizeof(struct case_t));
        if (!cur_switch)
            expect("switch");
	nocode_wanted &= ~0x20000000;
        next();
        cr->v1 = cr->v2 = expr_const64();
        if (gnu_ext && tok == 0xc8) {
            next();
            cr->v2 = expr_const64();
            if (cr->v2 < cr->v1)
                tcc_warning("empty case range");
        }
        cr->sym = ind;
        dynarray_add(&cur_switch->p, &cur_switch->n, cr);
        skip(':');
        is_expr = 0;
        goto block_after_label;
    } else
    if (tok == TOK_DEFAULT) {
        next();
        skip(':');
        if (!cur_switch)
            expect("switch");
        if (cur_switch->def_sym)
            tcc_error("too many 'default'");
        cur_switch->def_sym = ind;
        is_expr = 0;
        goto block_after_label;
    } else
    if (tok == TOK_GOTO) {
        next();
        if (tok == '*' && gnu_ext) {

            next();
            gexpr();
            if ((vtop->type.t & 0x000f) != 5)
                expect("pointer");
//            ggoto();
        } else if (tok >= TOK_DEFINE) {
            s = label_find(tok);

            if (!s) {
                s = label_push(&global_label_stack, tok, 1);
            } else {
                if (s->r == 2)
                    s->r = 1;
            }
	    if (s->r & 1)
                s->jnext = gjmp(s->jnext);
            else
                gjmp_addr(s->jnext);
            next();
        } else {
            expect("label identifier");
        }
        skip(';');
    } else {
        b = is_label();
        if (b) {

	    next();
            s = label_find(b);
            if (s) {
                if (s->r == 0)
                    tcc_error("duplicate label '%s'", get_tok_str(s->v, ((void*)0)));
                gsym(s->jnext);
                s->r = 0;
            } else {
                s = label_push(&global_label_stack, b, 0);
            }
            s->jnext = ind;

        block_after_label:
	    nocode_wanted &= ~0x20000000;
            if (tok == '}') {
                tcc_warning("deprecated use of label at end of compound statement");
            } else {
                if (is_expr)
                    vpop();
                block(bsym, csym, is_expr);
            }
        } else {

            if (tok != ';') {
                if (is_expr) {
                    vpop();
                    gexpr();
                } else {
                    gexpr();
                    vpop();
                }
            }
            skip(';');
        }
    }
}

static void skip_or_save_block(TokenString **str) {
    int braces = tok == '{';
    int level = 0;
    if (str)
      *str = tok_str_alloc();

    while ((level > 0 || (tok != '}' && tok != ',' && tok != ';' && tok != ')'))) {
	int t;
	if (tok == (-1)) {
	     if (str || level > 0)
	       tcc_error("unexpected end of file");
	     else
	       break;
	}
	if (str)
	  tok_str_add_tok(*str);
	t = tok;
	next();
	if (t == '{' || t == '(') {
	    level++;
	} else if (t == '}' || t == ')') {
	    level--;
	    if (level == 0 && braces && t == '}')
	      break;
	}
    }
    if (str) {
	tok_str_add(*str, -1);
	tok_str_add(*str, 0);
    }
}




static void parse_init_elem(int expr_type)
{
    int saved_global_expr;
    switch(expr_type) {
    case 1:

        saved_global_expr = global_expr;
        global_expr = 1;
        expr_const1();
        global_expr = saved_global_expr;


        if (((vtop->r & (0x003f | 0x0100)) != 0x0030
	     && ((vtop->r & (0x0200|0x0100)) != (0x0200|0x0100)
		 || vtop->sym->v < 0x10000000))



            )
            tcc_error("initializer element is not constant");
        break;
    case 2:
        expr_eq();
        break;
    }
}


static void init_putz(Section *sec, unsigned long c, int size)
{
    if (sec) {

    } else {
        vpush_global_sym(&func_old_type, TOK_memset);
        vseti(0x0032, c);




        vpushi(0);
        vpushs(size);

        gfunc_call(3);
    }
}







static int decl_designator(CType *type, Section *sec, unsigned long c,
                           Sym **cur_field, int size_only, int al)
{
    Sym *s, *f;
    int index, index_last, align, l, nb_elems, elem_size;
    unsigned long corig = c;

    elem_size = 0;
    nb_elems = 1;
    if (gnu_ext && (l = is_label()) != 0)
        goto struct_field;

    while (nb_elems == 1 && (tok == '[' || tok == '.')) {
        if (tok == '[') {
            if (!(type->t & 0x0040))
                expect("array type");
            next();
            index = index_last = expr_const();
            if (tok == 0xc8 && gnu_ext) {
                next();
                index_last = expr_const();
            }
            skip(']');
            s = type->ref;
	    if (index < 0 || (s->c >= 0 && index_last >= s->c) ||
		index_last < index)
	        tcc_error("invalid index");
            if (cur_field)
		(*cur_field)->c = index_last;
            type = pointed_type(type);
            elem_size = type_size(type, &align);
            c += index * elem_size;
            nb_elems = index_last - index + 1;
        } else {
            next();
            l = tok;
        struct_field:
            next();
            if ((type->t & 0x000f) != 7)
                expect("struct/union type");
	    f = find_field(type, l);
            if (!f)
                expect("field");
            if (cur_field)
                *cur_field = f;
	    type = &f->type;
            c += f->c;
        }
        cur_field = ((void*)0);
    }
    if (!cur_field) {
        if (tok == '=') {
            next();
        } else if (!gnu_ext) {
	    expect("=");
        }
    } else {
        if (type->t & 0x0040) {
	    index = (*cur_field)->c;
	    if (type->ref->c >= 0 && index >= type->ref->c)
	        tcc_error("index too large");
            type = pointed_type(type);
            c += index * type_size(type, &align);
        } else {
            f = *cur_field;
	    while (f && (f->v & 0x10000000) && (f->type.t & 0x0080))
	        *cur_field = f = f->next;
            if (!f)
                tcc_error("too many field init");
	    type = &f->type;
            c += f->c;
        }
    }


    if (!size_only && c - corig > al)
	init_putz(sec, corig + al, c - corig - al);
    decl_initializer(type, sec, c, 0, size_only);


    if (!size_only && nb_elems > 1) {
        unsigned long c_end;
        uint8_t *src, *dst;
        int i;

        if (!sec) {
	    vset(type, 0x0032|0x0100, c);
	    for (i = 1; i < nb_elems; i++) {
		vset(type, 0x0032|0x0100, c + elem_size * i);
		vswap();
		vstore();
	    }
	    vpop();
        } else if (!(nocode_wanted > 0)) {
	    c_end = c + nb_elems * elem_size;
	    if (c_end > sec->data_allocated)
	        section_realloc(sec, c_end);
	    src = sec->data + c;
	    dst = src;
	    for(i = 1; i < nb_elems; i++) {
		dst += elem_size;
		memcpy(dst, src, elem_size);
	    }
	}
    }
    c += nb_elems * type_size(type, &align);
    if (c - corig > al)
      al = c - corig;
    return al;
}


static void init_putv(CType *type, Section *sec, unsigned long c)
{
    int bt;
    void *ptr;
    CType dtype;

    dtype = *type;
    dtype.t &= ~0x0100;

    if (sec) {
	int size, align;


        gen_assign_cast(&dtype);
        bt = type->t & 0x000f;

        if ((vtop->r & 0x0200)
            && bt != 5
            && bt != 6
            && (bt != (4 == 8 ? 4 : 3)
                || (type->t & 0x0080))
            && !((vtop->r & 0x0030) && vtop->sym->v >= 0x10000000)
            )
            tcc_error("initializer element is not computable at load time");

        if ((nocode_wanted > 0)) {
            vtop--;
            return;
        }

	size = type_size(type, &align);
	section_reserve(sec, c + size);
        ptr = sec->data + c;


	if ((vtop->r & (0x0200|0x0030)) == (0x0200|0x0030) &&
	    vtop->sym->v >= 0x10000000 &&
# 6488 "tcc_src/tccgen.c"
	    (vtop->type.t & 0x000f) != 5) {

	    Section *ssec;
	    Elf32_Sym *esym;
	    Elf32_Rel *rel;
	    esym = elfsym(vtop->sym);
	    ssec = tcc_state->sections[esym->st_shndx];
	    memmove (ptr, ssec->data + esym->st_value, size);
	    if (ssec->reloc) {




		int num_relocs = ssec->reloc->data_offset / sizeof(*rel);
		rel = (Elf32_Rel*)(ssec->reloc->data + ssec->reloc->data_offset);
		while (num_relocs--) {
		    rel--;
		    if (rel->r_offset >= esym->st_value + size)
		      continue;
		    if (rel->r_offset < esym->st_value)
		      break;






		    put_elf_reloca(symtab_section, sec,
				   c + rel->r_offset - esym->st_value,
				   ((rel->r_info) & 0xff),
				   ((rel->r_info) >> 8),



				   0

				  );
		}
	    }
	} else {
            if (type->t & 0x0080) {
                int bit_pos, bit_size, bits, n;
                unsigned char *p, v, m;
                bit_pos = (((vtop->type.t) >> 20) & 0x3f);
                bit_size = (((vtop->type.t) >> (20 + 6)) & 0x3f);
                p = (unsigned char*)ptr + (bit_pos >> 3);
                bit_pos &= 7, bits = 0;
                while (bit_size) {
                    n = 8 - bit_pos;
                    if (n > bit_size)
                        n = bit_size;
                    v = vtop->c.i >> bits << bit_pos;
                    m = ((1 << n) - 1) << bit_pos;
                    *p = (*p & ~m) | (v & m);
                    bits += n, bit_size -= n, bit_pos = 0, ++p;
                }
            } else
            switch(bt) {



	    case 11:
		vtop->c.i = vtop->c.i != 0;
	    case 1:
		*(char *)ptr |= vtop->c.i;
		break;
	    case 2:
		*(short *)ptr |= vtop->c.i;
		break;
	    case 8:
		*(float*)ptr = vtop->c.f;
		break;
	    case 9:
		*(double *)ptr = vtop->c.d;
		break;
	    case 10:

                if (sizeof (long double) >= 10)
                    memcpy(ptr, &vtop->c.ld, 10);

                else if (vtop->c.ld == 0.0)
                    ;
                else

                if (sizeof(double) == 12)
		    *(double*)ptr = vtop->c.ld;
                else if (sizeof(double) == 12)
		    *(double *)ptr = (double)vtop->c.ld;
                else
                    tcc_error("can't cross compile long double constants");
		break;

	    case 4:
		*(long long *)ptr |= vtop->c.i;
		break;



	    case 5:
		{
		    Elf32_Addr val = vtop->c.i;






		    if (vtop->r & 0x0200)
		      greloc(sec, vtop->sym, c, 1);
		    *(Elf32_Addr *)ptr |= val;

		    break;
		}
	    default:
		{
		    int val = vtop->c.i;






		    if (vtop->r & 0x0200)
		      greloc(sec, vtop->sym, c, 1);
		    *(int *)ptr |= val;

		    break;
		}
	    }
	}
        vtop--;
    } else {
        vset(&dtype, 0x0032|0x0100, c);
        vswap();
        vstore();
        vpop();
    }
}






static void decl_initializer(CType *type, Section *sec, unsigned long c,
                             int first, int size_only)
{
    int len, n, no_oblock, nb, i;
    int size1, align1;
    int have_elem;
    Sym *s, *f;
    Sym indexsym;
    CType *t1;
    have_elem = tok == '}' || tok == ',';
    if (!have_elem && tok != '{' &&
	tok != 0xba && tok != 0xb9 &&
	!size_only) {
	parse_init_elem(!sec ? 2 : 1);
	have_elem = 1;
    }
    if (have_elem &&
	!(type->t & 0x0040) &&
	is_compatible_unqualified_types(type, &vtop->type)) {
        init_putv(type, sec, c);
    } else if (type->t & 0x0040) {
        s = type->ref;
        n = s->c;
        t1 = pointed_type(type);
        size1 = type_size(t1, &align1);
        no_oblock = 1;
        if ((first && tok != 0xba && tok != 0xb9) ||
            tok == '{') {
            if (tok != '{')
                tcc_error("character array initializer must be a literal,"
                    " optionally enclosed in braces");
            skip('{');
            no_oblock = 0;
        }
        if ((tok == 0xba &&
             (t1->t & 0x000f) == 3
            ) || (tok == 0xb9 && (t1->t & 0x000f) == 1)) {
	    len = 0;
            while (tok == 0xb9 || tok == 0xba) {
                int cstr_len, ch;
                if (tok == 0xb9)
                    cstr_len = tokc.str.size;
                else
                    cstr_len = tokc.str.size / sizeof(nwchar_t);
                cstr_len--;
                nb = cstr_len;
                if (n >= 0 && nb > (n - len))
                    nb = n - len;
                if (!size_only) {
                    if (cstr_len > nb)
                        tcc_warning("initializer-string for array is too long");
                    if (sec && tok == 0xb9 && size1 == 1) {
                        if (!(nocode_wanted > 0))
                            memcpy(sec->data + c + len, tokc.str.data, nb);
                    } else {
                        for(i=0;i<nb;i++) {
                            if (tok == 0xb9)
                                ch = ((unsigned char *)tokc.str.data)[i];
                            else
                                ch = ((nwchar_t *)tokc.str.data)[i];
			    vpushi(ch);
                            init_putv(t1, sec, c + (len + i) * size1);
                        }
                    }
                }
                len += nb;
                next();
            }
            if (n < 0 || len < n) {
                if (!size_only) {
		    vpushi(0);
                    init_putv(t1, sec, c + (len * size1));
                }
                len++;
            }
	    len *= size1;
        } else {
	    indexsym.c = 0;
	    f = &indexsym;
          do_init_list:
	    len = 0;
	    while (tok != '}' || have_elem) {
		len = decl_designator(type, sec, c, &f, size_only, len);
		have_elem = 0;
		if (type->t & 0x0040) {
		    ++indexsym.c;
		    if (no_oblock && len >= n*size1)
		        break;
		} else {
		    if (s->type.t == (1 << 20 | 7))
		        f = ((void*)0);
		    else
		        f = f->next;
		    if (no_oblock && f == ((void*)0))
		        break;
		}
		if (tok == '}')
		    break;
		skip(',');
	    }
        }
	if (!size_only && len < n*size1)
	    init_putz(sec, c + len, n*size1 - len);
        if (!no_oblock)
            skip('}');
        if (n < 0)
            s->c = size1 == 1 ? len : ((len + size1 - 1)/size1);
    } else if ((type->t & 0x000f) == 7) {
	size1 = 1;
        no_oblock = 1;
        if (first || tok == '{') {
            skip('{');
            no_oblock = 0;
        }
        s = type->ref;
        f = s->next;
        n = s->c;
	goto do_init_list;
    } else if (tok == '{') {
        next();
        decl_initializer(type, sec, c, first, size_only);
        skip('}');
    } else if (size_only) {
        skip_or_save_block(((void*)0));
    } else {
	if (!have_elem) {
	    if (tok != 0xb9 && tok != 0xba)
	      expect("string constant");
	    parse_init_elem(!sec ? 2 : 1);
	}
        init_putv(type, sec, c);
    }
}

static void decl_initializer_alloc(CType *type, AttributeDef *ad, int r,
                                   int has_init, int v, int scope) {
    int size, align, addr;
    TokenString *init_str = ((void*)0);
    Section *sec;
    Sym *flexible_array;
    Sym *sym = ((void*)0);
    int saved_nocode_wanted = nocode_wanted;
    int bcheck = 0;
    if (type->t & 0x00002000)
        nocode_wanted |= (nocode_wanted > 0) ? 0x40000000 : 0x80000000;
    flexible_array = ((void*)0);
    if ((type->t & 0x000f) == 7) {
        Sym *field = type->ref->next;
        if (field) {
            while (field->next)
                field = field->next;
            if (field->type.t & 0x0040 && field->type.ref->c < 0)
                flexible_array = field;
        }
    }
    size = type_size(type, &align);
    if (size < 0 || (flexible_array && has_init)) {
        if (!has_init)
            tcc_error("unknown type size");
        if (has_init == 2) {
	    init_str = tok_str_alloc();
            while (tok == 0xb9 || tok == 0xba) {
                tok_str_add_tok(init_str);
                next();
            }
	    tok_str_add(init_str, -1);
	    tok_str_add(init_str, 0);
        } else {
	    skip_or_save_block(&init_str);
        }
        unget_tok(0);
        begin_macro(init_str, 1);
        next();
        decl_initializer(type, ((void*)0), 0, 1, 1);
        macro_ptr = init_str->str;
        next();
        size = type_size(type, &align);
        if (size < 0)
            tcc_error("unknown type size");
    }
    if (flexible_array &&
	flexible_array->type.ref->c > 0)
        size += flexible_array->type.ref->c
	        * pointed_size(&flexible_array->type);
    if (ad->a.aligned) {
	int speca = 1 << (ad->a.aligned - 1);
        if (speca > align)
            align = speca;
    } else if (ad->a.packed) {
        align = 1;
    }
    if ((nocode_wanted > 0))
        size = 0, align = 1;

    if ((r & 0x003f) == 0x0032) {
        sec = ((void*)0);

        if (bcheck && (type->t & 0x0040)) {
            loc--;
        }

        loc = (loc - size) & -align;
        addr = loc;




        if (bcheck && (type->t & 0x0040)) {
            Elf32_Addr *bounds_ptr;

            loc--;

            bounds_ptr = section_ptr_add(lbounds_section, 2 * sizeof(Elf32_Addr));
            bounds_ptr[0] = addr;
            bounds_ptr[1] = size;
        }

        if (v) {


	    if (ad->asm_label) {
	    }

            sym = sym_push(v, type, r, addr);
            sym->a = ad->a;
        } else {

            vset(type, r, addr);
        }
    } else {
        if (v && scope == 0x0030) {

            sym = sym_find(v);
            if (sym) {
                patch_storage(sym, ad, type);

                if (!has_init && sym->c && elfsym(sym)->st_shndx != 0)
                    goto no_alloc;
            }
        }


        sec = ad->section;
        if (!sec) {
            if (has_init)
                sec = data_section;
        }

        if (sec) {
	    addr = section_add(sec, size, align);


            if (bcheck)
                section_add(sec, 1, 1);

        } else {
            addr = align;
	    sec = common_section;
        }

        if (v) {
            if (!sym) {
                sym = sym_push(v, type, r | 0x0200, 0);
                patch_storage(sym, ad, ((void*)0));
            }


            sym->sym_scope = 0;

	    put_extern_sym(sym, sec, addr, size);
        } else {

            sym = get_sym_ref(type, sec, addr, size);
	    vpushsym(type, sym);
	    vtop->r |= r;
        }




        if (bcheck) {
            Elf32_Addr *bounds_ptr;

            greloca(bounds_section, sym, bounds_section->data_offset, 1, 0);

            bounds_ptr = section_ptr_add(bounds_section, 2 * sizeof(Elf32_Addr));
            bounds_ptr[0] = 0;
            bounds_ptr[1] = size;
        }

    }
    if (has_init) {
	size_t oldreloc_offset = 0;
	if (sec && sec->reloc)
	  oldreloc_offset = sec->reloc->data_offset;
        decl_initializer(type, sec, addr, 1, 0);
	if (sec && sec->reloc)
	  squeeze_multi_relocs(sec, oldreloc_offset);


        if (flexible_array)
            flexible_array->type.ref->c = -1;
    }
 no_alloc:
    if (init_str) {
        end_macro();
        next();
    }
    nocode_wanted = saved_nocode_wanted;
}



static void gen_function(Sym *sym)
{
    nocode_wanted = 0;
    ind = cur_text_section->data_offset;

    put_extern_sym(sym, cur_text_section, ind, 0);
    funcname = get_tok_str(sym->v, ((void*)0));
    func_ind = ind;

    vla_sp_loc = -1;
    vla_sp_root_loc = -1;


    sym_push2(&local_stack, 0x20000000, 0, 0);
    local_scope = 1;
    gfunc_prolog(&sym->type);
    local_scope = 0;
    rsym = 0;
    block(((void*)0), ((void*)0), 0);
    nocode_wanted = 0;
    gsym(rsym);
    gfunc_epilog();
    cur_text_section->data_offset = ind;
    label_pop(&global_label_stack, ((void*)0), 0);

    local_scope = 0;
    sym_pop(&local_stack, ((void*)0), 0);


    elfsym(sym)->st_size = ind - func_ind;

    cur_text_section = ((void*)0);
    funcname = "";
    func_vt.t = 0;
    func_var = 0;
    ind = 0;
    nocode_wanted = 0x80000000;
    check_vstack();
}

static void gen_inline_functions(TCCState *s) {
    Sym *sym;
    int inline_generated, i, ln;
    struct InlineFunc *fn;
    ln = file->line_num;
    do {
        inline_generated = 0;
        for (i = 0; i < s->nb_inline_fns; ++i) {
            fn = s->inline_fns[i];
            sym = fn->sym;
            if (sym && sym->c) {
                fn->sym = ((void*)0);
                if (file)
                    pstrcpy(file->filename, sizeof file->filename, fn->filename);
                sym->type.t &= ~VT_INLINE;
                begin_macro(fn->func_str, 1);
                next();
                cur_text_section = text_section;
                gen_function(sym);
                end_macro();
                inline_generated = 1;
            }
        }
    } while (inline_generated);
    file->line_num = ln;
}

static void free_inline_functions(TCCState *s)
{
    int i;

    for (i = 0; i < s->nb_inline_fns; ++i) {
        struct InlineFunc *fn = s->inline_fns[i];
        if (fn->sym)
            tok_str_free(fn->func_str);
    }
    dynarray_reset(&s->inline_fns, &s->nb_inline_fns);
}

static int decl0(int l, int is_for_loop_init, Sym *func_sym) {
    int v, has_init, r;
    CType type, btype;
    Sym *sym;
    AttributeDef ad;
    while (1) {
        if (!parse_btype(&btype, &ad)) {
            if (is_for_loop_init)
                return 0;
            if (tok == ';' && l != VT_CMP) {
                next();
                continue;
            }
            if (l != VT_CONST)
                break;
            if (tok >= TOK_DEFINE) {
                btype.t = VT_INT;
            } else {
                if (tok != (TOK_EOF))
                    expect("declaration");
                break;
            }
        }
        if (tok == ';') {
	    if ((btype.t & VT_BTYPE) == VT_STRUCT) {
		int v = btype.ref->v;
		if (!(v & SYM_FIELD) && (v & ~SYM_STRUCT) >= SYM_FIRST_ANOM)
        	    tcc_warning("unnamed struct/union that defines no instances");
                next();
                continue;
	    }
            if (IS_ENUM(btype.t)) {
                next();
                continue;
            }
        }
        while (1) {
            type = btype;
	    if ((type.t & VT_ARRAY) && type.ref->c < 0) {
		type.ref = sym_push(SYM_FIELD, &type.ref->type, 0, type.ref->c);
	    }
            type_decl(&type, &ad, &v, TYPE_DIRECT);
            if ((type.t & VT_BTYPE) == VT_FUNC) {
                if ((type.t & VT_STATIC) && (l == VT_LOCAL)) {
                    tcc_error("function without file scope cannot be static");
                }
                sym = type.ref;
                if (sym->f.func_type == FUNC_OLD && l == VT_CONST)
                    decl0(VT_CMP, 0, sym);
            }
            if (tok == '{') {
                if (l != VT_CONST)
                    tcc_error("cannot use local functions");
                if ((type.t & VT_BTYPE) != VT_FUNC)
                    expect("function definition");
                sym = type.ref;
                while ((sym = sym->next) != ((void*)0)) {
                    if (!(sym->v & ~SYM_FIELD))
                        expect("identifier");
		    if (sym->type.t == VT_VOID)
		        sym->type = int_type;
		}
                if ((type.t & (VT_EXTERN | VT_INLINE)) == (VT_EXTERN | VT_INLINE))
                    type.t = (type.t & ~VT_EXTERN) | VT_STATIC;
                sym = external_global_sym(v, &type, 0);
                type.t &= ~VT_EXTERN;
                patch_storage(sym, &ad, &type);
                if ((type.t & (VT_INLINE | VT_STATIC)) ==
                    (VT_INLINE | VT_STATIC)) {
                    struct InlineFunc *fn;
                    const char *filename;
                    filename = file ? file->filename : "";
                    fn = tcc_malloc(sizeof *fn + strlen(filename));
                    strcpy(fn->filename, filename);
                    fn->sym = sym;
		    skip_or_save_block(&fn->func_str);
                    dynarray_add(&tcc_state->inline_fns,
				 &tcc_state->nb_inline_fns, fn);
                } else {
                    cur_text_section = ad.section;
                    if (!cur_text_section)
                        cur_text_section = text_section;
                    gen_function(sym);
                }
                break;
            } else {
		if (l == VT_CMP) {
		    for (sym = func_sym->next; sym; sym = sym->next)
			if ((sym->v & ~SYM_FIELD) == v)
			    goto found;
		    tcc_error("declaration for parameter '%s' but no such parameter",
			      get_tok_str(v, ((void*)0)));
found:
		    if (type.t & VT_STORAGE)
		        tcc_error("storage class specified for '%s'",
				  get_tok_str(v, ((void*)0)));
		    if (sym->type.t != VT_VOID)
		        tcc_error("redefinition of parameter '%s'",
				  get_tok_str(v, ((void*)0)));
		    convert_parameter_type(&type);
		    sym->type = type;
		} else if (type.t & VT_TYPEDEF) {
                    sym = sym_find(v);
                    if (sym && sym->sym_scope == local_scope) {
                        if (!is_compatible_types(&sym->type, &type)
                            || !(sym->type.t & VT_TYPEDEF))
                            tcc_error("incompatible redefinition of '%s'",
                                get_tok_str(v, ((void*)0)));
                        sym->type = type;
                    } else {
                        sym = sym_push(v, &type, 0, 0);
                    }
                    sym->a = ad.a;
                    sym->f = ad.f;
                } else {
                    r = 0;
                    if ((type.t & VT_BTYPE) == VT_FUNC) {
                        type.ref->f = ad.f;
                    } else if (!(type.t & VT_ARRAY)) {
                        r |= lvalue_type(type.t);
                    }
                    has_init = (tok == '=');
                    if (has_init && (type.t & VT_VLA))
                        tcc_error("variable length array cannot be initialized");
                    if (((type.t & VT_EXTERN) && (!has_init || l != VT_CONST)) ||
			((type.t & VT_BTYPE) == VT_FUNC) ||
                        ((type.t & VT_ARRAY) && (type.t & VT_STATIC) &&
                         !has_init && l == VT_CONST && type.ref->c < 0)) {
                        type.t |= VT_EXTERN;
                        sym = external_sym(v, &type, r, &ad);
                        if (ad.alias_target) {
                            Elf32_Sym *esym;
                            Sym *alias_target;
                            alias_target = sym_find(ad.alias_target);
                            esym = elfsym(alias_target);
                            if (!esym)
                                tcc_error("unsupported forward __alias__ attribute");
                            sym->sym_scope = 0;
                            put_extern_sym2(sym, esym->st_shndx, esym->st_value, esym->st_size, 0);
                        }
                    } else {
                        if (type.t & VT_STATIC)
                            r |= VT_CONST;
                        else
                            r |= l;
                        if (has_init)
                            next();
                        else if (l == VT_CONST)
                            type.t |= VT_EXTERN;
                        decl_initializer_alloc(&type, &ad, r, has_init, v, l);
                    }
                }
                if (tok != ',') {
                    if (is_for_loop_init)
                        return 1;
                    skip(';');
                    break;
                }
                next();
            }
            ad.a.aligned = 0;
        }
    }
    return 0;
}

static void decl(int l) {
    decl0(l, 0, ((void*)0));
}

static Section *text_section, *data_section, *bss_section;
static Section *common_section;
static Section *cur_text_section;
static Section *last_text_section;
static Section *bounds_section;
static Section *lbounds_section;
static Section *symtab_section;
static Section *stab_section, *stabstr_section;
static int new_undef_sym = 0;

static void tccelf_new(TCCState *s) {
    dynarray_add(&s->sections, &s->nb_sections, ((void*)0));
    text_section = new_section(s, ".text", 1, (1 << 1) | (1 << 2));
    data_section = new_section(s, ".data", 1, (1 << 1) | (1 << 0));
    bss_section = new_section(s, ".bss", 8, (1 << 1) | (1 << 0));
    common_section = new_section(s, ".common", 8, 0x80000000);
    common_section->sh_num = 0xfff2;
    symtab_section = new_symtab(s, ".symtab", 2, 0,
                                ".strtab",
                                ".hashtab", 0x80000000);
    s->symtab = symtab_section;
    s->dynsymtab_section = new_symtab(s, ".dynsymtab", 2, 0x80000000|0x40000000,
                                      ".dynstrtab",
                                      ".dynhashtab", 0x80000000);
}

static void free_section(Section *s) {
    tcc_free(s->data);
}

static void tccelf_delete(TCCState *s1) {
    int i;
    for(i = 1; i < s1->nb_sections; i++)
        free_section(s1->sections[i]);
    dynarray_reset(&s1->sections, &s1->nb_sections);
    for(i = 0; i < s1->nb_priv_sections; i++)
        free_section(s1->priv_sections[i]);
    dynarray_reset(&s1->priv_sections, &s1->nb_priv_sections);
    tcc_free(s1->sym_attrs);
    symtab_section = ((void*)0);
}

static void tccelf_begin_file(TCCState *s1) {
    Section *s; int i;
    for (i = 1; i < s1->nb_sections; i++) {
        s = s1->sections[i];
        s->sh_offset = s->data_offset;
    }
    s = s1->symtab, s->reloc = s->hash, s->hash = ((void*)0);
}

static void tccelf_end_file(TCCState *s1) {
    Section *s = s1->symtab;
    int first_sym, nb_syms, *tr, i;
    first_sym = s->sh_offset / sizeof (Elf32_Sym);
    nb_syms = s->data_offset / sizeof (Elf32_Sym) - first_sym;
    s->data_offset = s->sh_offset;
    s->link->data_offset = s->link->sh_offset;
    s->hash = s->reloc, s->reloc = ((void*)0);
    tr = tcc_mallocz(nb_syms * sizeof *tr);
    for (i = 0; i < nb_syms; ++i) {
        Elf32_Sym *sym = (Elf32_Sym*)s->data + first_sym + i;
        if (sym->st_shndx == 0
            && (((unsigned char) (sym->st_info)) >> 4) == 0)
            sym->st_info = (((1) << 4) + ((((sym->st_info) & 0xf)) & 0xf));
        tr[i] = set_elf_sym(s, sym->st_value, sym->st_size, sym->st_info,
            sym->st_other, sym->st_shndx, s->link->data + sym->st_name);
    }
    for (i = 1; i < s1->nb_sections; i++) {
        Section *sr = s1->sections[i];
        if (sr->sh_type == 9 && sr->link == s) {
            Elf32_Rel *rel = (Elf32_Rel*)(sr->data + sr->sh_offset);
            Elf32_Rel *rel_end = (Elf32_Rel*)(sr->data + sr->data_offset);
            for (; rel < rel_end; ++rel) {
                int n = ((rel->r_info) >> 8) - first_sym;

                rel->r_info = (((tr[n]) << 8) + ((((rel->r_info) & 0xff)) & 0xff));
            }
        }
    }
    tcc_free(tr);
}

static Section *new_section(TCCState *s1, const char *name, int sh_type, int sh_flags) {
    Section *sec;
    sec = tcc_mallocz(sizeof(Section) + strlen(name));
    strcpy(sec->name, name);
    sec->sh_type = sh_type;
    sec->sh_flags = sh_flags;
    switch(sh_type) {
    case 5:
    case 9:
    case 4:
    case 11:
    case 2:
    case 6:
        sec->sh_addralign = 4;
        break;
    case 3:
        sec->sh_addralign = 1;
        break;
    default:
        sec->sh_addralign =  4;
        break;
    }
    if (sh_flags & 0x80000000) {
        dynarray_add(&s1->priv_sections, &s1->nb_priv_sections, sec);
    } else {
        sec->sh_num = s1->nb_sections;
        dynarray_add(&s1->sections, &s1->nb_sections, sec);
    }
    return sec;
}

static Section *new_symtab(TCCState *s1,
                           const char *symtab_name, int sh_type, int sh_flags,
                           const char *strtab_name,
                           const char *hash_name, int hash_sh_flags) {
    Section *symtab, *strtab, *hash;
    int *ptr, nb_buckets;
    symtab = new_section(s1, symtab_name, sh_type, sh_flags);
    symtab->sh_entsize = sizeof(Elf32_Sym);
    strtab = new_section(s1, strtab_name, 3, sh_flags);
    put_elf_str(strtab, "");
    symtab->link = strtab;
    put_elf_sym(symtab, 0, 0, 0, 0, 0, ((void*)0));
    nb_buckets = 1;
    hash = new_section(s1, hash_name, 5, hash_sh_flags);
    hash->sh_entsize = sizeof(int);
    symtab->hash = hash;
    hash->link = symtab;
    ptr = section_ptr_add(hash, (2 + nb_buckets + 1) * sizeof(int));
    ptr[0] = nb_buckets;
    ptr[1] = 1;
    memset(ptr + 2, 0, (nb_buckets + 1) * sizeof(int));
    return symtab;
}

static void section_realloc(Section *sec, unsigned long new_size) {
    unsigned long size;
    unsigned char *data;
    size = sec->data_allocated;
    if (size == 0)
        size = 1;
    while (size < new_size)
        size = size * 2;
    data = tcc_realloc(sec->data, size);
    memset(data + sec->data_allocated, 0, size - sec->data_allocated);
    sec->data = data;
    sec->data_allocated = size;
}

static size_t section_add(Section *sec, Elf32_Addr size, int align) {
    size_t offset, offset1;

    offset = (sec->data_offset + align - 1) & -align;
    offset1 = offset + size;
    if (sec->sh_type != 8 && offset1 > sec->data_allocated)
        section_realloc(sec, offset1);
    sec->data_offset = offset1;
    if (align > sec->sh_addralign)
        sec->sh_addralign = align;
    return offset;
}

static void *section_ptr_add(Section *sec, Elf32_Addr size) {
    size_t offset = section_add(sec, size, 1);
    return sec->data + offset;
}

static void section_reserve(Section *sec, unsigned long size) {
    if (size > sec->data_allocated)
        section_realloc(sec, size);
    if (size > sec->data_offset)
        sec->data_offset = size;
}

static int put_elf_str(Section *s, const char *sym) {
    int offset, len;
    char *ptr;
    len = strlen(sym) + 1;
    offset = s->data_offset;
    ptr = section_ptr_add(s, len);
    memmove(ptr, sym, len);
    return offset;
}

static unsigned long elf_hash(const unsigned char *name) {
    unsigned long h = 0, g;
    while (*name) {
        h = (h << 4) + *name++;
        g = h & 0xf0000000;
        if (g)
            h ^= g >> 24;
        h &= ~g;
    }
    return h;
}

static void rebuild_hash(Section *s, unsigned int nb_buckets) {
    Elf32_Sym *sym;
    int *ptr, *hash, nb_syms, sym_index, h;
    unsigned char *strtab;
    strtab = s->link->data;
    nb_syms = s->data_offset / sizeof(Elf32_Sym);
    if (!nb_buckets)
        nb_buckets = ((int*)s->hash->data)[0];
    s->hash->data_offset = 0;
    ptr = section_ptr_add(s->hash, (2 + nb_buckets + nb_syms) * sizeof(int));
    ptr[0] = nb_buckets;
    ptr[1] = nb_syms;
    ptr += 2;
    hash = ptr;
    memset(hash, 0, (nb_buckets + 1) * sizeof(int));
    ptr += nb_buckets + 1;
    sym = (Elf32_Sym *)s->data + 1;
    for(sym_index = 1; sym_index < nb_syms; sym_index++) {
        if ((((unsigned char) (sym->st_info)) >> 4) != 0) {
            h = elf_hash(strtab + sym->st_name) % nb_buckets;
            *ptr = hash[h];
            hash[h] = sym_index;
        } else {
            *ptr = 0;
        }
        ptr++;
        sym++;
    }
}

static int put_elf_sym(Section *s, Elf32_Addr value, unsigned long size,
    int info, int other, int shndx, const char *name) {
    int name_offset, sym_index;
    int nbuckets, h;
    Elf32_Sym *sym;
    Section *hs;
    sym = section_ptr_add(s, sizeof(Elf32_Sym));
    if (name && name[0])
        name_offset = put_elf_str(s->link, name);
    else
        name_offset = 0;
    sym->st_name = name_offset;
    sym->st_value = value;
    sym->st_size = size;
    sym->st_info = info;
    sym->st_other = other;
    sym->st_shndx = shndx;
    sym_index = sym - (Elf32_Sym *)s->data;
    hs = s->hash;
    if (hs) {
        int *ptr, *base;
        ptr = section_ptr_add(hs, sizeof(int));
        base = (int *)hs->data;
        if ((((unsigned char) (info)) >> 4) != 0) {
            nbuckets = base[0];
            h = elf_hash((unsigned char *)s->link->data + name_offset) % nbuckets;
            *ptr = base[2 + h];
            base[2 + h] = sym_index;
            base[1]++;
            hs->nb_hashed_syms++;
            if (hs->nb_hashed_syms > 2 * nbuckets) {
                rebuild_hash(s, 2 * nbuckets);
            }
        } else {
            *ptr = 0;
            base[1]++;
        }
    }
    return sym_index;
}

static int find_elf_sym(Section *s, const char *name) {
    Elf32_Sym *sym;
    Section *hs;
    int nbuckets, sym_index, h;
    const char *name1;
    hs = s->hash;
    if (!hs)
        return 0;
    nbuckets = ((int *)hs->data)[0];
    h = elf_hash((unsigned char *) name) % nbuckets;
    sym_index = ((int *)hs->data)[2 + h];
    while (sym_index != 0) {
        sym = &((Elf32_Sym *)s->data)[sym_index];
        name1 = (char *) s->link->data + sym->st_name;
        if (!strcmp(name, name1))
            return sym_index;
        sym_index = ((int *)hs->data)[2 + nbuckets + sym_index];
    }
    return 0;
}

static int set_elf_sym(Section *s, Elf32_Addr value, unsigned long size,
                       int info, int other, int shndx, const char *name) {
    Elf32_Sym *esym;
    int sym_bind, sym_index, sym_type, esym_bind;
    unsigned char sym_vis, esym_vis, new_vis;
    sym_bind = (((unsigned char) (info)) >> 4);
    sym_type = ((info) & 0xf);
    sym_vis = ((other) & 0x03);
    if (sym_bind != 0) {
        sym_index = find_elf_sym(s, name);
        if (!sym_index)
            goto do_def;
        esym = &((Elf32_Sym *)s->data)[sym_index];
        if (esym->st_value == value && esym->st_size == size && esym->st_info == info
            && esym->st_other == other && esym->st_shndx == shndx)
            return sym_index;
        if (esym->st_shndx != 0) {
            esym_bind = (((unsigned char) (esym->st_info)) >> 4);
            esym_vis = ((esym->st_other) & 0x03);
            if (esym_vis == 0) {
                new_vis = sym_vis;
            } else if (sym_vis == 0) {
                new_vis = esym_vis;
            } else {
                new_vis = (esym_vis < sym_vis) ? esym_vis : sym_vis;
            }
            esym->st_other = (esym->st_other & ~((-1) & 0x03))
                             | new_vis;
            other = esym->st_other;
            if (shndx == 0) {
            } else if (sym_bind == 1 && esym_bind == 2) {
                goto do_patch;
            } else if (sym_bind == 2 && esym_bind == 1) {
            } else if (sym_bind == 2 && esym_bind == 2) {
            } else if (sym_vis == 2 || sym_vis == 1) {
            } else if ((esym->st_shndx == 0xfff2
                            || esym->st_shndx == bss_section->sh_num)
                        && (shndx < 0xff00
                            && shndx != bss_section->sh_num)) {
                goto do_patch;
            } else if (shndx == 0xfff2 || shndx == bss_section->sh_num) {
            } else if (s->sh_flags & 0x40000000) {
	    } else if (esym->st_other & 0x04) {
		goto do_patch;
            } else {
                tcc_error_noabort("'%s' defined twice", name);
            }
        } else {
        do_patch:
            esym->st_info = (((sym_bind) << 4) + ((sym_type) & 0xf));
            esym->st_shndx = shndx;
            new_undef_sym = 1;
            esym->st_value = value;
            esym->st_size = size;
            esym->st_other = other;
        }
    } else {
    do_def:
        sym_index = put_elf_sym(s, value, size,
                                (((sym_bind) << 4) + ((sym_type) & 0xf)), other,
                                shndx, name);
    }
    return sym_index;
}

static void put_elf_reloca(Section *symtab, Section *s, unsigned long offset,
                            int type, int symbol, Elf32_Addr addend) {
    char buf[256];
    Section *sr;
    Elf32_Rel *rel;
    sr = s->reloc;
    if (!sr) {
        snprintf(buf, sizeof(buf), ".rel%s", s->name);
        sr = new_section(tcc_state, buf, 9, symtab->sh_flags);
        sr->sh_entsize = sizeof(Elf32_Rel);
        sr->link = symtab;
        sr->sh_info = s->sh_num;
        s->reloc = sr;
    }
    rel = section_ptr_add(sr, sizeof(Elf32_Rel));
    rel->r_offset = offset;
    rel->r_info = (((symbol) << 8) + ((type) & 0xff));
    if (addend)
        tcc_error("non-zero addend on REL architecture");

}

static void squeeze_multi_relocs(Section *s, size_t oldrelocoffset) {
    Section *sr = s->reloc;
    Elf32_Rel *r, *dest;
    ssize_t a;
    Elf32_Addr addr;
    if (oldrelocoffset + sizeof(*r) >= sr->data_offset)
      return;
    for (a = oldrelocoffset + sizeof(*r); a < sr->data_offset; a += sizeof(*r)) {
	ssize_t i = a - sizeof(*r);
	addr = ((Elf32_Rel*)(sr->data + a))->r_offset;
	for (; i >= (ssize_t)oldrelocoffset &&
	       ((Elf32_Rel*)(sr->data + i))->r_offset > addr; i -= sizeof(*r)) {
	    Elf32_Rel tmp = *(Elf32_Rel*)(sr->data + a);
	    *(Elf32_Rel*)(sr->data + a) = *(Elf32_Rel*)(sr->data + i);
	    *(Elf32_Rel*)(sr->data + i) = tmp;
	}
    }
    r = (Elf32_Rel*)(sr->data + oldrelocoffset);
    dest = r;
    for (; r < (Elf32_Rel*)(sr->data + sr->data_offset); r++) {
	if (dest->r_offset != r->r_offset)
	  dest++;
	*dest = *r;
    }
    sr->data_offset = (unsigned char*)dest - sr->data + sizeof(*r);
}

static void sort_syms(TCCState *s1, Section *s) {
    int *old_to_new_syms;
    Elf32_Sym *new_syms;
    int nb_syms, i;
    Elf32_Sym *p, *q;
    Elf32_Rel *rel;
    Section *sr;
    int type, sym_index;
    nb_syms = s->data_offset / sizeof(Elf32_Sym);
    new_syms = tcc_malloc(nb_syms * sizeof(Elf32_Sym));
    old_to_new_syms = tcc_malloc(nb_syms * sizeof(int));
    p = (Elf32_Sym *)s->data;
    q = new_syms;
    for(i = 0; i < nb_syms; i++) {
        if ((((unsigned char) (p->st_info)) >> 4) == 0) {
            old_to_new_syms[i] = q - new_syms;
            *q++ = *p;
        }
        p++;
    }
    if( s->sh_size )
        s->sh_info = q - new_syms;
    p = (Elf32_Sym *)s->data;
    for(i = 0; i < nb_syms; i++) {
        if ((((unsigned char) (p->st_info)) >> 4) != 0) {
            old_to_new_syms[i] = q - new_syms;
            *q++ = *p;
        }
        p++;
    }
    memcpy(s->data, new_syms, nb_syms * sizeof(Elf32_Sym));
    tcc_free(new_syms);
    for(i = 1; i < s1->nb_sections; i++) {
        sr = s1->sections[i];
        if (sr->sh_type == 9 && sr->link == s) {
            for (rel = (Elf32_Rel *) sr->data + 0; rel < (Elf32_Rel *) (sr->data + sr->data_offset); rel++) {
                sym_index = ((rel->r_info) >> 8);
                type = ((rel->r_info) & 0xff);
                sym_index = old_to_new_syms[sym_index];
                rel->r_info = (((sym_index) << 8) + ((type) & 0xff));
            }
        }
    }
    tcc_free(old_to_new_syms);
}

static int alloc_sec_names(TCCState *s1, int file_type, Section *strsec) {
    int i;
    Section *s;
    int textrel = 0;
    for(i = 1; i < s1->nb_sections; i++) {
        s = s1->sections[i];
        if (file_type == 3 &&
            s->sh_type == 9 &&
            !(s->sh_flags & (1 << 1)) &&
            (s1->sections[s->sh_info]->sh_flags & (1 << 1)) &&
            0) {
                if (s1->sections[s->sh_info]->sh_flags & (1 << 2))
                    textrel = 1;
        } else if ( file_type == 4 ||
            (s->sh_flags & (1 << 1)) ||
	    i == (s1->nb_sections - 1)) {

            s->sh_size = s->data_offset;
        }
	if (s->sh_size || (s->sh_flags & (1 << 1)))
            s->sh_name = put_elf_str(strsec, s->name);
    }
    strsec->sh_size = strsec->data_offset;
    return textrel;
}

struct dyn_inf {
    Section *dynamic;
    Section *dynstr;
    unsigned long data_offset;
    Elf32_Addr rel_addr;
    Elf32_Addr rel_size;
};

static int layout_sections(TCCState *s1, Elf32_Phdr *phdr, int phnum,
                           Section *interp, Section* strsec,
                           struct dyn_inf *dyninf, int *sec_order) {
    int i, j, k, file_type, sh_order_index, file_offset;
    unsigned long s_align;
    long long tmp;
    Elf32_Addr addr;
    Elf32_Phdr *ph;
    Section *s;
    file_type = s1->output_type;
    sh_order_index = 1;
    file_offset = 0;
    if (s1->output_format == 0)
        file_offset = sizeof(Elf32_Ehdr) + phnum * sizeof(Elf32_Phdr);
    s_align = 0x1000;
    if (s1->section_align)
        s_align = s1->section_align;
    if (phnum > 0) {
        if (s1->has_text_addr) {
            int a_offset, p_offset;
            addr = s1->text_addr;
            a_offset = (int) (addr & (s_align - 1));
            p_offset = file_offset & (s_align - 1);
            if (a_offset < p_offset)
                a_offset += s_align;
            file_offset += (a_offset - p_offset);
        } else {
            if (file_type == 3)
                addr = 0;
            else
                addr = 0x08048000;

            addr += (file_offset & (s_align - 1));
        }
        ph = &phdr[0];
        if (interp)
            ph += 2;
        dyninf->rel_addr = dyninf->rel_size = 0;
        for(j = 0; j < 2; j++) {
            ph->p_type = 1;
            if (j == 0)
                ph->p_flags = (1 << 2) | (1 << 0);
            else
                ph->p_flags = (1 << 2) | (1 << 1);
            ph->p_align = s_align;
            for(k = 0; k < 5; k++) {
                for(i = 1; i < s1->nb_sections; i++) {
                    s = s1->sections[i];
                    if (j == 0) {
                        if ((s->sh_flags & ((1 << 1) | (1 << 0))) !=
                            (1 << 1))
                            continue;
                    } else {
                        if ((s->sh_flags & ((1 << 1) | (1 << 0))) !=
                            ((1 << 1) | (1 << 0)))
                            continue;
                    }
                    if (s == interp) {
                        if (k != 0)
                            continue;
                    } else if (s->sh_type == 11 ||
                               s->sh_type == 3 ||
                               s->sh_type == 5) {
                        if (k != 1)
                            continue;
                    } else if (s->sh_type == 9) {
                        if (k != 2)
                            continue;
                    } else if (s->sh_type == 8) {
                        if (k != 4)
                            continue;
                    } else {
                        if (k != 3)
                            continue;
                    }
                    sec_order[sh_order_index++] = i;
                    tmp = addr;
                    addr = (addr + s->sh_addralign - 1) &
                        ~(s->sh_addralign - 1);
                    file_offset += (int) ( addr - tmp );
                    s->sh_offset = file_offset;
                    s->sh_addr = addr;
                    if (ph->p_offset == 0) {
                        ph->p_offset = file_offset;
                        ph->p_vaddr = addr;
                        ph->p_paddr = ph->p_vaddr;
                    }
                    if (s->sh_type == 9) {
                        if (dyninf->rel_size == 0)
                            dyninf->rel_addr = addr;
                        dyninf->rel_size += s->sh_size;
                    }
                    addr += s->sh_size;
                    if (s->sh_type != 8)
                        file_offset += s->sh_size;
                }
            }
	    if (j == 0) {
		ph->p_offset &= ~(ph->p_align - 1);
		ph->p_vaddr &= ~(ph->p_align - 1);
		ph->p_paddr &= ~(ph->p_align - 1);
	    }
            ph->p_filesz = file_offset - ph->p_offset;
            ph->p_memsz = addr - ph->p_vaddr;
            ph++;
            if (j == 0) {
                if (s1->output_format == 0) {
                    if ((addr & (s_align - 1)) != 0)
                        addr += s_align;
                } else {
                    addr = (addr + s_align - 1) & ~(s_align - 1);
                    file_offset = (file_offset + s_align - 1) & ~(s_align - 1);
                }
            }
        }
    }
    for(i = 1; i < s1->nb_sections; i++) {
        s = s1->sections[i];
        if (phnum > 0 && (s->sh_flags & (1 << 1)))
            continue;
        sec_order[sh_order_index++] = i;
        file_offset = (file_offset + s->sh_addralign - 1) &
            ~(s->sh_addralign - 1);
        s->sh_offset = file_offset;
        if (s->sh_type != 8)
            file_offset += s->sh_size;
    }
    return file_offset;
}

static void tcc_output_elf(TCCState *s1, FILE *f, int phnum, Elf32_Phdr *phdr,
                           int file_offset, int *sec_order) {
    int i, shnum, offset, size, file_type;
    Section *s;
    Elf32_Ehdr ehdr;
    Elf32_Shdr shdr, *sh;
    file_type = s1->output_type;
    shnum = s1->nb_sections;
    memset(&ehdr, 0, sizeof(ehdr));
    if (phnum > 0) {
        ehdr.e_phentsize = sizeof(Elf32_Phdr);
        ehdr.e_phnum = phnum;
        ehdr.e_phoff = sizeof(Elf32_Ehdr);
    }
    file_offset = (file_offset + 3) & -4;
    ehdr.e_ident[0] = 0x7f;
    ehdr.e_ident[1] = 'E';
    ehdr.e_ident[2] = 'L';
    ehdr.e_ident[3] = 'F';
    ehdr.e_ident[4] = 1;
    ehdr.e_ident[5] = 1;
    ehdr.e_ident[6] = 1;
    switch(file_type) {
    default:
    case 2:
        ehdr.e_type = 2;
        break;
    case 3:
        ehdr.e_type = 3;
        ehdr.e_entry = text_section->sh_addr;
        break;
    case 4:
        ehdr.e_type = 1;
        break;
    }
    ehdr.e_machine = 3;
    ehdr.e_version = 1;
    ehdr.e_shoff = file_offset;
    ehdr.e_ehsize = sizeof(Elf32_Ehdr);
    ehdr.e_shentsize = sizeof(Elf32_Shdr);
    ehdr.e_shnum = shnum;
    ehdr.e_shstrndx = shnum - 1;
    fwrite(&ehdr, 1, sizeof(Elf32_Ehdr), f);
    fwrite(phdr, 1, phnum * sizeof(Elf32_Phdr), f);
    offset = sizeof(Elf32_Ehdr) + phnum * sizeof(Elf32_Phdr);
    sort_syms(s1, symtab_section);
    for(i = 1; i < s1->nb_sections; i++) {
        s = s1->sections[sec_order[i]];
        if (s->sh_type != 8) {
            while (offset < s->sh_offset) {
                fputc(0, f);
                offset++;
            }
            size = s->sh_size;
            if (size)
                fwrite(s->data, 1, size, f);
            offset += size;
        }
    }
    while (offset < ehdr.e_shoff) {
        fputc(0, f);
        offset++;
    }
    for(i = 0; i < s1->nb_sections; i++) {
        sh = &shdr;
        memset(sh, 0, sizeof(Elf32_Shdr));
        s = s1->sections[i];
        if (s) {
            sh->sh_name = s->sh_name;
            sh->sh_type = s->sh_type;
            sh->sh_flags = s->sh_flags;
            sh->sh_entsize = s->sh_entsize;
            sh->sh_info = s->sh_info;
            if (s->link)
                sh->sh_link = s->link->sh_num;
            sh->sh_addralign = s->sh_addralign;
            sh->sh_addr = s->sh_addr;
            sh->sh_offset = s->sh_offset;
            sh->sh_size = s->sh_size;
        }
        fwrite(sh, 1, sizeof(Elf32_Shdr), f);
    }
}

static int tcc_write_elf_file(TCCState *s1, const char *filename, int phnum,
                              Elf32_Phdr *phdr, int file_offset, int *sec_order) {
    int fd, mode, file_type;
    FILE *f;
    unlink(filename);
    f = fopen(filename, "wb");
    tcc_output_elf(s1, f, phnum, phdr, file_offset, sec_order);
    fclose(f);
    return 0;
}

static int elf_output_file(TCCState *s1, const char *filename)
{
    int i, ret, phnum, shnum, file_type, file_offset, *sec_order;
    struct dyn_inf dyninf = {0};
    Elf32_Phdr *phdr;
    Elf32_Sym *sym;
    Section *strsec, *interp, *dynamic, *dynstr;
    int textrel;
    file_type = s1->output_type;
    s1->nb_errors = 0;
    ret = -1;
    phdr = ((void*)0);
    sec_order = ((void*)0);
    interp = dynamic = dynstr = ((void*)0);
    textrel = 0;
    strsec = new_section(s1, ".shstrtab", 3, 0);
    put_elf_str(strsec, "");
    textrel = alloc_sec_names(s1, file_type, strsec);
    phnum = 0;
    phdr = tcc_mallocz(phnum * sizeof(Elf32_Phdr));
    shnum = s1->nb_sections;
    sec_order = tcc_malloc(sizeof(int) * shnum);
    sec_order[0] = 0;
    file_offset = layout_sections(s1, phdr, phnum, interp, strsec, &dyninf,
                                  sec_order);
    ret = tcc_write_elf_file(s1, filename, phnum, phdr, file_offset, sec_order);
    s1->nb_sections = shnum;
 the_end:
    tcc_free(sec_order);
    tcc_free(phdr);
    return ret;
}

int tcc_output_file(TCCState *s, const char *filename) {
// LJW DONE
    int ret;
    ret = elf_output_file(s, filename);
    return ret;
}

static const int reg_classes[5] = {
      0x0001 | 0x0004,
      0x0001 | 0x0010,
      0x0001 | 0x0020,
      (0x0001 | 0x0040) * 0,
      0x0002 | 0x0008,
};

static unsigned long func_sub_sp_offset;
static int func_ret_sub;

static Elf32_Addr func_bound_offset;
static unsigned long func_bound_ind;



static void g(int c)
{
    int ind1;
    if (nocode_wanted)
        return;
    ind1 = ind + 1;
    if (ind1 > cur_text_section->data_allocated)
        section_realloc(cur_text_section, ind1);
    cur_text_section->data[ind] = c;
    ind = ind1;
}

static void o(unsigned int c)
{
    while (c) {
        g(c);
        c = c >> 8;
    }
}

static void gen_le16(int v)
{
    g(v);
    g(v >> 8);
}

static void gen_le32(int c)
{
    g(c);
    g(c >> 8);
    g(c >> 16);
    g(c >> 24);
}


static void gsym_addr(int t, int a)
{
    while (t) {
        unsigned char *ptr = cur_text_section->data + t;
        uint32_t n = read32le(ptr);
        write32le(ptr, a - t - 4);
        t = n;
    }
}

static void gsym(int t)
{
    gsym_addr(t, ind);
}


static int oad(int c, int s)
{
    int t;
    if (nocode_wanted)
        return s;
    o(c);
    t = ind;
    gen_le32(s);
    return t;
}

static void gen_addr32(int r, Sym *sym, int c) {
    if (r & 0x0200)
        greloc(cur_text_section, sym, ind, 1);
    gen_le32(c);
}

static void gen_addrpc32(int r, Sym *sym, int c) {
    if (r & 0x0200)
        greloc(cur_text_section, sym, ind, 2);
    gen_le32(c - 4);
}

static void gen_modrm(int op_reg, int r, Sym *sym, int c) {
    op_reg = op_reg << 3;
    if ((r & 0x003f) == 0x0030) {

        o(0x05 | op_reg);
        gen_addr32(r, sym, c);
    } else if ((r & 0x003f) == 0x0032) {

        if (c == (char)c) {

            o(0x45 | op_reg);
            g(c);
        } else {
            oad(0x85 | op_reg, c);
        }
    } else {
        g(0x00 | op_reg | (r & 0x003f));
    }
}


static void load(int r, SValue *sv) {
    int v, t, ft, fc, fr;
    SValue v1;
    fr = sv->r;
    ft = sv->type.t & ~0x0020;
    fc = sv->c.i;

    ft &= ~(0x0200 | 0x0100);

    v = fr & 0x003f;
    if (fr & 0x0100) {
        if (v == 0x0031) {
            v1.type.t = 3;
            v1.r = 0x0032 | 0x0100;
            v1.c.i = fc;
            fr = r;
            if (!(reg_classes[fr] & 0x0001))
                fr = get_reg(0x0001);
            load(fr, &v1);
        }
        if ((ft & 0x000f) == 8) {
            o(0xd9);
            r = 0;
        } else if ((ft & 0x000f) == 9) {
            o(0xdd);
            r = 0;
        } else if ((ft & 0x000f) == 10) {
            o(0xdb);
            r = 5;
        } else if ((ft & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)))) == 1 || (ft & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)))) == 11) {
            o(0xbe0f);
        } else if ((ft & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)))) == (1 | 0x0010)) {
            o(0xb60f);
        } else if ((ft & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)))) == 2) {
            o(0xbf0f);
        } else if ((ft & (~((0x00001000 | 0x00002000 | 0x00004000 | 0x00008000)|(((1 << (6+6)) - 1) << 20 | 0x0080)))) == (2 | 0x0010)) {
            o(0xb70f);
        } else {
            o(0x8b);
        }
        gen_modrm(r, fr, sv->sym, fc);
    } else {
        if (v == 0x0030) {
            o(0xb8 + r);
            gen_addr32(fr, sv->sym, fc);
        } else if (v == 0x0032) {
            if (fc) {
                o(0x8d);
                gen_modrm(r, 0x0032, sv->sym, fc);
            } else {
                o(0x89);
                o(0xe8 + r);
            }
        } else if (v == 0x0033) {
            oad(0xb8 + r, 0);
            o(0x0f);
            o(fc);
            o(0xc0 + r);
        } else if (v == 0x0034 || v == 0x0035) {
            t = v & 1;
            oad(0xb8 + r, t);
            o(0x05eb);
            gsym(fc);
            oad(0xb8 + r, t ^ 1);
        } else if (v != r) {
            o(0x89);
            o(0xc0 + r + v * 8);
        }
    }
}

static void store(int r, SValue *v) {
    int fr, bt, ft, fc;
    ft = v->type.t;
    fc = v->c.i;
    fr = v->r & 0x003f;
    ft &= ~(0x0200 | 0x0100);
    bt = ft & 0x000f;

    if (bt == 8) {
        o(0xd9);
        r = 2;
    } else if (bt == 9) {
        o(0xdd);
        r = 2;
    } else if (bt == 10) {
        o(0xc0d9);
        o(0xdb);
        r = 7;
    } else {
        if (bt == 2)
            o(0x66);
        if (bt == 1 || bt == 11)
            o(0x88);
        else
            o(0x89);
    }
    if (fr == 0x0030 ||
        fr == 0x0032 ||
        (v->r & 0x0100)) {
        gen_modrm(r, v->r, v->sym, fc);
    } else if (fr != r) {
        o(0xc0 + fr + r * 8);
    }
}

static void gadd_sp(int val) {
    if (val == (char)val) {
        o(0xc483);
        g(val);
    } else {
        oad(0xc481, val);
    }
}

static void gcall_or_jmp(int is_jmp) {
    int r;
    if ((vtop->r & (0x003f | 0x0100)) == 0x0030 && (vtop->r & 0x0200)) {

        greloc(cur_text_section, vtop->sym, ind + 1, 2);
        oad(0xe8 + is_jmp, vtop->c.i - 4);
    } else {

        r = gv(0x0001);
        o(0xff);
        o(0xd0 + r + (is_jmp << 4));
    }
    if (!is_jmp) {
        int rt;
        rt = vtop->type.ref->type.t;
        switch (rt & 0x000f) {
            case 1:
                if (rt & 0x0010) {
                    o(0xc0b60f);
                }
                else {
                    o(0xc0be0f);
                }
                break;
            case 2:
                if (rt & 0x0010) {
                    o(0xc0b70f);
                }
                else {
                    o(0xc0bf0f);
                }
                break;
            default:
                break;
        }
    }
}

static int gfunc_sret(CType *vt, int variadic, CType *ret, int *ret_align, int *regsize) {
    *ret_align = 1;
    return 0;
}

static void gfunc_call(int nb_args) {
    int size, align, r, args_size, i, func_call;
    Sym *func_sym;

    args_size = 0;
    for(i = 0;i < nb_args; i++) {
        if ((vtop->type.t & 0x000f) == 7) {
            size = type_size(&vtop->type, &align);

            size = (size + 3) & ~3;

            oad(0xec81, size);

            r = get_reg(0x0001);
            o(0x89);
            o(0xe0 + r);
            vset(&vtop->type, r | 0x0100, 0);
            vswap();
            vstore();
            args_size += size;
        } else if (is_float(vtop->type.t)) {
            gv(0x0002);
            if ((vtop->type.t & 0x000f) == 8)
                size = 4;
            else if ((vtop->type.t & 0x000f) == 9)
                size = 8;
            else
                size = 12;
            oad(0xec81, size);
            if (size == 12)
                o(0x7cdb);
            else
                o(0x5cd9 + size - 4);
            g(0x24);
            g(0x00);
            args_size += size;
        } else {
            r = gv(0x0001);
            if ((vtop->type.t & 0x000f) == 4) {
                size = 8;
                o(0x50 + vtop->r2);
            } else {
                size = 4;
            }
            o(0x50 + r);
            args_size += size;
        }
        vtop--;
    }
    save_regs(0);
    func_sym = vtop->type.ref;
    func_call = func_sym->f.func_call;
    if ((vtop->type.ref->type.t & 0x000f) == 7)
        args_size -= 4;

    gcall_or_jmp(0);

    if (args_size && func_call != 1 && func_call != 5)
        gadd_sp(args_size);
    vtop--;
}

static void gfunc_prolog(CType *func_type) {
    int addr, align, size, func_call;
    int param_index, param_addr;
    Sym *sym;
    CType *type;
    sym = func_type->ref;
    func_call = sym->f.func_call;
    addr = 8;
    loc = 0;
    func_vc = 0;
    param_index = 0;
    ind += (9 + 0);
    func_sub_sp_offset = ind;
    func_vt = sym->type;
    func_var = (sym->f.func_type == 3);
    if ((func_vt.t & 0x000f) == 7) {
        func_vc = addr;
        addr += 4;
        param_index++;
    }
    while ((sym = sym->next) != ((void*)0)) {
        type = &sym->type;
        size = type_size(type, &align);
        size = (size + 3) & ~3;
        param_addr = addr;
        addr += size;
        sym_push(sym->v & ~0x20000000, type,
                 0x0032 | lvalue_type(type->t), param_addr);
        param_index++;
    }
    func_ret_sub = 0;
    if (func_call == 1 || func_call == 5)
        func_ret_sub = addr - 8;
    else if (func_vc)
        func_ret_sub = 4;
}

static void gfunc_epilog(void)
{
    Elf32_Addr v, saved_ind;
    v = (-loc + 3) & -4;
    o(0xc9);
    if (func_ret_sub == 0) {
        o(0xc3);
    } else {
        o(0xc2);
        g(func_ret_sub);
        g(func_ret_sub >> 8);
    }
    saved_ind = ind;
    ind = func_sub_sp_offset - (9 + 0);
    {
        o(0xe58955);
        o(0xec81);
        gen_le32(v);
    }
    o(0x53 * 0);
    ind = saved_ind;
}

static int gjmp(int t) {
    return oad(0xe9,t);
}


static void gjmp_addr(int a) {
    int r;
    r = a - ind - 2;
    if (r == (char)r) {
        g(0xeb);
        g(r);
    } else {
        oad(0xe9, a - ind - 5);
    }
}

static void gtst_addr(int inv, int a) {
    int v = vtop->r & 0x003f;
    if (v == 0x0033) {
	inv ^= (vtop--)->c.i;
	a -= ind + 2;
	if (a == (char)a) {
	    g(inv - 32);
	    g(a);
	} else {
	    g(0x0f);
	    oad(inv - 16, a - 4);
	}
    } else if ((v & ~1) == 0x0034) {
	if ((v & 1) != inv) {
	    gjmp_addr(a);
	    gsym(vtop->c.i);
	} else {
	    gsym(vtop->c.i);
	    o(0x05eb);
	    gjmp_addr(a);
	}
	vtop--;
    }
}

static int gtst(int inv, int t) {
    int v = vtop->r & 0x003f;
    if (nocode_wanted) {
        ;
    } else if (v == 0x0033) {

        g(0x0f);
        t = oad((vtop->c.i - 16) ^ inv,t);
    } else if (v == 0x0034 || v == 0x0035) {

        if ((v & 1) == inv) {

            uint32_t n1, n = vtop->c.i;
            if (n) {
                while ((n1 = read32le(cur_text_section->data + n)))
                    n = n1;
                write32le(cur_text_section->data + n, t);
                t = vtop->c.i;
            }
        } else {
            t = gjmp(t);
            gsym(vtop->c.i);
        }
    }
    vtop--;
    return t;
}


static void gen_opi(int op)
{
    int r, fr, opc, c;

    switch(op) {
    case '+':
    case 0xc3:
        opc = 0;
    gen_op8:
        if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {
            vswap();
            r = gv(0x0001);
            vswap();
            c = vtop->c.i;
            if (c == (char)c) {

                if (c==1 && opc==0 && op != 0xc3) {
                    o (0x40 | r);
                } else if (c==1 && opc==5 && op != 0xc5) {
                    o (0x48 | r);
                } else {
                    o(0x83);
                    o(0xc0 | (opc << 3) | r);
                    g(c);
                }
            } else {
                o(0x81);
                oad(0xc0 | (opc << 3) | r, c);
            }
        } else {
            gv2(0x0001, 0x0001);
            r = vtop[-1].r;
            fr = vtop[0].r;
            o((opc << 3) | 0x01);
            o(0xc0 + r + fr * 8);
        }
        vtop--;
        if (op >= 0x92 && op <= 0x9f) {
            vtop->r = 0x0033;
            vtop->c.i = op;
        }
        break;
    case '-':
    case 0xc5:
        opc = 5;
        goto gen_op8;
    case 0xc4:
        opc = 2;
        goto gen_op8;
    case 0xc6:
        opc = 3;
        goto gen_op8;
    case '&':
        opc = 4;
        goto gen_op8;
    case '^':
        opc = 6;
        goto gen_op8;
    case '|':
        opc = 1;
        goto gen_op8;
    case '*':
        gv2(0x0001, 0x0001);
        r = vtop[-1].r;
        fr = vtop[0].r;
        vtop--;
        o(0xaf0f);
        o(0xc0 + fr + r * 8);
        break;
    case 0x01:
        opc = 4;
        goto gen_shift;
    case 0xc9:
        opc = 5;
        goto gen_shift;
    case 0x02:
        opc = 7;
    gen_shift:
        opc = 0xc0 | (opc << 3);
        if ((vtop->r & (0x003f | 0x0100 | 0x0200)) == 0x0030) {

            vswap();
            r = gv(0x0001);
            vswap();
            c = vtop->c.i & 0x1f;
            o(0xc1);
            o(opc | r);
            g(c);
        } else {

            gv2(0x0001, 0x0010);
            r = vtop[-1].r;
            o(0xd3);
            o(opc | r);
        }
        vtop--;
        break;
    case '/':
    case 0xb0:
    case 0xb2:
    case '%':
    case 0xb1:
    case 0xc2:
        gv2(0x0004, 0x0010);
        r = vtop[-1].r;
        fr = vtop[0].r;
        vtop--;
        save_reg(TREG_EDX);
        save_reg_upstack(TREG_EAX, 1);
        if (op == 0xc2) {
            o(0xf7);
            o(0xe0 + fr);
            vtop->r2 = TREG_EDX;
            r = TREG_EAX;
        } else {
            if (op == 0xb0 || op == 0xb1) {
                o(0xf7d231);
                o(0xf0 + fr);
            } else {
                o(0xf799);
                o(0xf8 + fr);
            }
            if (op == '%' || op == 0xb1)
                r = TREG_EDX;
            else
                r = TREG_EAX;
        }
        vtop->r = r;
        break;
    default:
        opc = 7;
        goto gen_op8;
    }
}

static void gen_opf(int op) {
    int a, ft, fc, swapped, r;
    if ((vtop[-1].r & (VT_VALMASK | VT_LVAL)) == VT_CONST) {
        vswap();
        gv(RC_FLOAT);
        vswap();
    }
    if ((vtop[0].r & (VT_VALMASK | VT_LVAL)) == VT_CONST)
        gv(RC_FLOAT);
    if ((vtop[-1].r & VT_LVAL) &&
        (vtop[0].r & VT_LVAL)) {
        vswap();
        gv(RC_FLOAT);
        vswap();
    }
    swapped = 0;
    if (vtop[-1].r & VT_LVAL) {
        vswap();
        swapped = 1;
    }
    if (op >= TOK_ULT && op <= TOK_GT) {
        load(TREG_ST0, vtop);
        save_reg(TREG_EAX);
        if (op == TOK_GE || op == TOK_GT)
            swapped = !swapped;
        else if (op == TOK_EQ || op == TOK_NE)
            swapped = 0;
        if (swapped)
            o(0xc9d9);
        if (op == TOK_EQ || op == TOK_NE)
            o(0xe9da);
        else
            o(0xd9de);
        o(0xe0df);
        if (op == TOK_EQ) {
            o(0x45e480);
            o(0x40fC80);
        } else if (op == TOK_NE) {
            o(0x45e480);
            o(0x40f480);
            op = TOK_NE;
        } else if (op == TOK_GE || op == TOK_LE) {
            o(0x05c4f6);
            op = TOK_EQ;
        } else {
            o(0x45c4f6);
            op = TOK_EQ;
        }
        vtop--;
        vtop->r = VT_CMP;
        vtop->c.i = op;
    } else {
// LJW BOOKMARK convert defines into enums
        if ((vtop->type.t & 0x000f) == 10) {
            load(TREG_ST0, vtop);
            swapped = !swapped;
        }
        switch(op) {
        default:
        case '+':
            a = 0;
            break;
        case '-':
            a = 4;
            if (swapped)
                a++;
            break;
        case '*':
            a = 1;
            break;
        case '/':
            a = 6;
            if (swapped)
                a++;
            break;
        }
        ft = vtop->type.t;
        fc = vtop->c.i;
        if ((ft & 0x000f) == 10) {
            o(0xde);
            o(0xc1 + (a << 3));
        } else {
            r = vtop->r;
            if ((r & 0x003f) == 0x0031) {
                SValue v1;
                r = get_reg(0x0001);
                v1.type.t = 3;
                v1.r = 0x0032 | 0x0100;
                v1.c.i = fc;
                load(r, &v1);
                fc = 0;
            }
            if ((ft & 0x000f) == 9)
                o(0xdc);
            else
                o(0xd8);
            gen_modrm(a, r, vtop->sym, fc);
        }
        vtop--;
    }
}



static void gen_cvt_itof(int t)
{
    save_reg(TREG_ST0);
    gv(0x0001);
    if ((vtop->type.t & 0x000f) == 4) {


        o(0x50 + vtop->r2);
        o(0x50 + (vtop->r & 0x003f));
        o(0x242cdf);
        o(0x08c483);
    } else if ((vtop->type.t & (0x000f | 0x0010)) ==
               (3 | 0x0010)) {

        o(0x6a);
        g(0x00);
        o(0x50 + (vtop->r & 0x003f));
        o(0x242cdf);
        o(0x08c483);
    } else {

        o(0x50 + (vtop->r & 0x003f));
        o(0x2404db);
        o(0x04c483);
    }
    vtop->r = TREG_ST0;
}

static void gen_cvt_ftof(int t) {
    gv(0x0002);
}

static char *pstrcpy(char *buf, int buf_size, const char *s) {
    char *q, *q_end;
    int c;
    if (buf_size > 0) {
        q = buf;
        q_end = buf + buf_size - 1;
        while (q < q_end) {
            c = *s++;
            if (c == '\0')
                break;
            *q++ = c;
        }
        *q = '\0';
    }
    return buf;
}

static char *pstrcat(char *buf, int buf_size, const char *s) {
    int len;
    len = strlen(buf);
    if (len < buf_size)
        pstrcpy(buf + len, buf_size - len, s);
    return buf;
}

static char *pstrncpy(char *out, const char *in, size_t num) {
    memcpy(out, in, num);
    out[num] = '\0';
    return out;
}

char *tcc_basename(const char *name) {
// LJW DONE
    char *p = strchr(name, 0);
    while (p > name && !(p[-1] == '/'))
        --p;
    return p;
}

void tcc_free(void *ptr) {
// LJW DONE
    free(ptr);
}

void *tcc_malloc(unsigned long size) {
// LJW DONE
    void *ptr;
    ptr = malloc(size);
    if (!ptr && size)
        tcc_error("memory full (malloc)");
    return ptr;
}

void *tcc_mallocz(unsigned long size) {
// LJW DONE
    void *ptr;
    ptr = tcc_malloc(size);
    memset(ptr, 0, size);
    return ptr;
}

void *tcc_realloc(void *ptr, unsigned long size) {
// LJW DONE
    void *ptr1;
    ptr1 = realloc(ptr, size);
    if (!ptr1 && size)
        tcc_error("memory full (realloc)");
    return ptr1;
}

char *tcc_strdup(const char *str) {
// LJW DONE
    char *ptr;
    ptr = tcc_malloc(strlen(str) + 1);
    strcpy(ptr, str);
    return ptr;
}

static void dynarray_add(void *ptab, int *nb_ptr, void *data) {
    int nb, nb_alloc;
    void **pp;
    nb = *nb_ptr;
    pp = *(void ***)ptab;
    if ((nb & (nb - 1)) == 0) {
        if (!nb)
            nb_alloc = 1;
        else
            nb_alloc = nb * 2;
        pp = tcc_realloc(pp, nb_alloc * sizeof(void *));
        *(void***)ptab = pp;
    }
    pp[nb++] = data;
    *nb_ptr = nb;
}

static void dynarray_reset(void *pp, int *n) {
    void **p;
    for (p = *(void***)pp; *n; ++p, --*n)
        if (*p)
            tcc_free(*p);
    tcc_free(*(void**)pp);
    *(void**)pp = ((void*)0);
}

static void tcc_split_path(TCCState *s, void *p_ary, int *p_nb_ary, const char *in) {
    const char *p;
    do {
        int c;
        CString str;
        cstr_new(&str);
        for (p = in; c = *p, c != '\0' && c != ":"[0]; ++p) {
            cstr_ccat(&str, c);
        }
        if (str.size) {
            cstr_ccat(&str, '\0');
            dynarray_add(p_ary, p_nb_ary, tcc_strdup(str.data));
        }
        cstr_free(&str);
        in = p+1;
    } while (*p);
}

static void strcat_vprintf(char *buf, int buf_size, const char *fmt, va_list ap) {
    int len;
    len = strlen(buf);
    vsnprintf(buf + len, buf_size - len, fmt, ap);
}

static void strcat_printf(char *buf, int buf_size, const char *fmt, ...) {
    va_list ap;
    ap = ((char *)&(fmt)) + ((sizeof(fmt)+3)&~3);
    strcat_vprintf(buf, buf_size, fmt, ap);
}

static void error1(TCCState *s1, int is_warning, const char *fmt, va_list ap) {
    char buf[2048];
    BufferedFile **pf, *f;
    buf[0] = '\0';
    for (f = file; f && f->filename[0] == ':'; f = f->prev);
    if (f) {
        for(pf = s1->include_stack; pf < s1->include_stack_ptr; pf++)
            strcat_printf(buf, sizeof(buf), "In file included from %s:%d:\n",
                (*pf)->filename, (*pf)->line_num);
            strcat_printf(buf, sizeof(buf), "%s:%d: ",
                f->filename, f->line_num - !!(tok_flags & 0x0001));
    } else {
        strcat_printf(buf, sizeof(buf), "tcc: ");
    }
    if (is_warning)
        strcat_printf(buf, sizeof(buf), "warning: ");
    else
        strcat_printf(buf, sizeof(buf), "error: ");
    strcat_vprintf(buf, sizeof(buf), fmt, ap);
    if (!s1->error_func) {
        if (s1->output_type == 5 && s1->ppfp == stdout)
            printf("\n"), fflush(stdout);
        fflush(stdout);
        fprintf(stderr, "%s\n", buf);
        fflush(stderr);
    } else {
        s1->error_func(s1->error_opaque, buf);
    }
    if (!is_warning || s1->warn_error)
        s1->nb_errors++;
}

void tcc_set_error_func(TCCState *s, void *error_opaque,
                        void (*error_func)(void *opaque, const char *msg)) {
// LJW DONE
    s->error_opaque = error_opaque;
    s->error_func = error_func;
}

void tcc_error_noabort(const char *fmt, ...) {
// LJW DONE
    TCCState *s1 = tcc_state;
    va_list ap;
    ap = ((char *)&(fmt)) + ((sizeof(fmt)+3)&~3);
    error1(s1, 0, fmt, ap);
}

void tcc_error(const char *fmt, ...) {
    TCCState *s1 = tcc_state;
    va_list ap;
    ap = ((char *)&(fmt)) + ((sizeof(fmt)+3)&~3);
    error1(s1, 0, fmt, ap);
    exit(1);
}

void tcc_warning(const char *fmt, ...) {
// LJW DONE
    TCCState *s1 = tcc_state;
    va_list ap;
    if (s1->warn_none)
        return;
    ap = ((char *)&(fmt)) + ((sizeof(fmt)+3)&~3);
    error1(s1, 1, fmt, ap);
}

static void tcc_open_bf(TCCState *s1, const char *filename, int initlen) {
    BufferedFile *bf;
    int buflen = initlen ? initlen : 8192;
    bf = tcc_mallocz(sizeof(BufferedFile) + buflen);
    bf->buf_ptr = bf->buffer;
    bf->buf_end = bf->buffer + initlen;
    bf->buf_end[0] = '\\';
    pstrcpy(bf->filename, sizeof(bf->filename), filename);
    bf->true_filename = bf->filename;
    bf->line_num = 1;
    bf->ifdef_stack_ptr = s1->ifdef_stack_ptr;
    bf->fd = -1;
    bf->prev = file;
    file = bf;
    tok_flags = 0x0001 | 0x0002;
}

static void tcc_close(void) {
    BufferedFile *bf = file;
    if (bf->fd > 0) {
        close(bf->fd);
        total_lines += bf->line_num;
    }
    if (bf->true_filename != bf->filename)
        tcc_free(bf->true_filename);
    file = bf->prev;
    tcc_free(bf);
}

static int tcc_open(TCCState *s1, const char *filename) {
    int fd;
    fd = open(filename, 00 | 0);
    if (fd < 0)
        return -1;
    tcc_open_bf(s1, filename, 0);
    file->fd = fd;
    return fd;
}

static int tcc_compile(TCCState *s1) {
    Sym *define_start;
    int filetype;
    define_start = define_stack;
    filetype = s1->filetype;
    tccelf_begin_file(s1);
    s1->nb_errors = 0;
    preprocess_start(s1, 0);
    tccgen_compile(s1);
    preprocess_end(s1);
    free_inline_functions(s1);
    free_defines(define_start);
    sym_pop(&global_stack, ((void*)0), 0);
    sym_pop(&local_stack, ((void*)0), 0);
    tccelf_end_file(s1);
    return s1->nb_errors != 0 ? -1 : 0;
}

int tcc_compile_string(TCCState *s, const char *str) {
// LJW DONE
    int len, ret;
    len = strlen(str);
    tcc_open_bf(s, "<string>", len);
    memcpy(file->buffer, str, len);
    ret = tcc_compile(s);
    tcc_close();
    return ret;
}

void tcc_define_symbol(TCCState *s1, const char *sym, const char *value) {
// LJW DONE
    int len1, len2;
    if (!value)
        value = "1";
    len1 = strlen(sym);
    len2 = strlen(value);
    tcc_open_bf(s1, "<define>", len1 + len2 + 1);
    memcpy(file->buffer, sym, len1);
    file->buffer[len1] = ' ';
    memcpy(file->buffer + len1 + 1, value, len2);
    next_nomacro();
    parse_define();
    tcc_close();
}

static void tcc_cleanup(void) {
    if (((void*)0) == tcc_state)
        return;
    while (file)
        tcc_close();
    tccpp_delete(tcc_state);
    tcc_state = ((void*)0);
    dynarray_reset(&sym_pools, &nb_sym_pools);
    sym_free_first = ((void*)0);
}

TCCState *tcc_new(void) {
// LJW DONE
    TCCState *s;
    tcc_cleanup();
    s = tcc_mallocz(sizeof(TCCState));
    if (!s)
        return ((void*)0);
    tcc_state = s;
    ++nb_states;
    s->alacarte_link = 1;
    s->warn_implicit_function_declaration = 1;
    s->seg_size = 32;
    tccelf_new(s);
    tccpp_new(s);
    define_push(TOK___LINE__, MACRO_OBJ, ((void*)0), ((void*)0));
    define_push(TOK___FILE__, MACRO_OBJ, ((void*)0), ((void*)0));
    define_push(TOK___DATE__, MACRO_OBJ, ((void*)0), ((void*)0));
    define_push(TOK___TIME__, MACRO_OBJ, ((void*)0), ((void*)0));
    define_push(TOK___COUNTER__, MACRO_OBJ, ((void*)0), ((void*)0));
    char buffer[32];
    sprintf(buffer, "0.9.27");
    tcc_define_symbol(s, "__TINYC__", buffer);
    tcc_define_symbol(s, "__STDC__", ((void*)0));
    tcc_define_symbol(s, "__STDC_VERSION__", "199901L");
    tcc_define_symbol(s, "__STDC_HOSTED__", ((void*)0));
    tcc_define_symbol(s, "__i386__", ((void*)0));
    tcc_define_symbol(s, "__i386", ((void*)0));
    tcc_define_symbol(s, "i386", ((void*)0));
    tcc_define_symbol(s, "__unix__", ((void*)0));
    tcc_define_symbol(s, "__unix", ((void*)0));
    tcc_define_symbol(s, "unix", ((void*)0));
    tcc_define_symbol(s, "__linux__", ((void*)0));
    tcc_define_symbol(s, "__linux", ((void*)0));
    tcc_define_symbol(s, "__SIZE_TYPE__", "unsigned int");
    tcc_define_symbol(s, "__PTRDIFF_TYPE__", "int");
    tcc_define_symbol(s, "__ILP32__", ((void*)0));
    tcc_define_symbol(s, "__WCHAR_TYPE__", "int");
    tcc_define_symbol(s, "__WINT_TYPE__", "unsigned int");
    tcc_define_symbol(s, "__REDIRECT(name, proto, alias)",
        "name proto __asm__ (#alias)");
    tcc_define_symbol(s, "__REDIRECT_NTH(name, proto, alias)",
        "name proto __asm__ (#alias) __THROW");
    tcc_define_symbol(s, "__builtin_extract_return_addr(x)", "x");
    return s;
}

void tcc_delete(TCCState *s1) {
// LJW DONE
    tcc_cleanup();
    tccelf_delete(s1);
    dynarray_reset(&s1->cached_includes, &s1->nb_cached_includes);
    dynarray_reset(&s1->include_paths, &s1->nb_include_paths);
    dynarray_reset(&s1->cmd_include_files, &s1->nb_cmd_include_files);
    tcc_free(s1->outfile);
    dynarray_reset(&s1->files, &s1->nb_files);
    dynarray_reset(&s1->target_deps, &s1->nb_target_deps);
    dynarray_reset(&s1->argv, &s1->argc);
    tcc_free(s1);
}

int tcc_set_output_type(TCCState *s, int output_type) {
// LJW DONE
    s->output_type = output_type;
    s->output_format = TCC_OUTPUT_FORMAT_ELF;
    return 0;
}

int tcc_add_include_path(TCCState *s, const char *pathname) {
// LJW DONE
    tcc_split_path(s, &s->include_paths, &s->nb_include_paths, pathname);
    return 0;
}

static int tcc_add_file_internal(TCCState *s1, const char *filename, int flags) {
    int ret;
    ret = tcc_open(s1, filename);
    dynarray_add(&s1->target_deps, &s1->nb_target_deps,
            tcc_strdup(filename));
    ret = tcc_compile(s1);
    tcc_close();
    return ret;
}

int tcc_add_file(TCCState *s, const char *filename) {
// LJW DONE
    int filetype = s->filetype;
    int flags = AFF_PRINT_ERROR;
    if (filetype == 0) {
        s->filetype = 1;
    }
    return tcc_add_file_internal(s, filename, flags);
}

static int strstart(const char *val, const char **str)
{
    const char *p, *q;
    p = *str;
    q = val;
    while (*q) {
        if (*p != *q)
            return 0;
        p++;
        q++;
    }
    *str = p;
    return 1;
}

typedef struct TCCOption {
    const char *name;
    uint16_t index;
    uint16_t flags;
} TCCOption;

enum {
    TCC_OPTION_I,
    TCC_OPTION_D,
    TCC_OPTION_l,
    TCC_OPTION_c,
    TCC_OPTION_o,
    TCC_OPTION_nostdinc,
    TCC_OPTION_nostdlib,
};

static const TCCOption tcc_options[] = {
    { "I", TCC_OPTION_I, 0x0001 },
    { "D", TCC_OPTION_D, 0x0001 },
    { "l", TCC_OPTION_l, 0x0001 | 0x0002 },
    { "c", TCC_OPTION_c, 0 },
    { "o", TCC_OPTION_o, 0x0001 },
    { "nostdinc", TCC_OPTION_nostdinc, 0 },
    { "nostdlib", TCC_OPTION_nostdlib, 0 },

    { ((void*)0), 0, 0 },
};

static void parse_option_D(TCCState *s1, const char *optarg) {
    char *sym = tcc_strdup(optarg);
    char *value = strchr(sym, '=');
    if (value)
        *value++ = '\0';
    tcc_define_symbol(s1, sym, value);
    tcc_free(sym);
}

static void args_parser_add_file(TCCState *s, const char* filename, int filetype) {
    struct filespec *f = tcc_malloc(sizeof *f + strlen(filename));
    f->type = filetype;
    f->alacarte = s->alacarte_link;
    strcpy(f->name, filename);
    dynarray_add(&s->files, &s->nb_files, f);
}

static int args_parser_make_argv(const char *r, int *argc, char ***argv) {
    int ret = 0, q, c;
    CString str;
    for(;;) {
        while (c = (unsigned char)*r, c && c <= ' ')
	    ++r;
        if (c == 0)
            break;
        q = 0;
        cstr_new(&str);
        while (c = (unsigned char)*r, c) {
            ++r;
            if (c == '\\' && (*r == '"' || *r == '\\')) {
                c = *r++;
            } else if (c == '"') {
                q = !q;
                continue;
            } else if (q == 0 && c <= ' ') {
                break;
            }
            cstr_ccat(&str, c);
        }
        cstr_ccat(&str, 0);
        dynarray_add(argv, argc, tcc_strdup(str.data));
        cstr_free(&str);
        ++ret;
    }
    return ret;
}

static void args_parser_listfile(TCCState *s,
    const char *filename, int optind, int *pargc, char ***pargv) {
    int fd, i;
    size_t len;
    char *p;
    int argc = 0;
    char **argv = ((void*)0);
    fd = open(filename, 00 | 0);
    if (fd < 0)
        tcc_error("listfile '%s' not found", filename);
    len = lseek(fd, 0, 2);
    p = tcc_malloc(len + 1), p[len] = 0;
    lseek(fd, 0, 0), read(fd, p, len), close(fd);
    for (i = 0; i < *pargc; ++i)
        if (i == optind)
            args_parser_make_argv(p, &argc, &argv);
        else
            dynarray_add(&argv, &argc, tcc_strdup((*pargv)[i]));
    tcc_free(p);
    dynarray_reset(&s->argv, &s->argc);
    *pargc = s->argc = argc, *pargv = s->argv = argv;
}

 int tcc_parse_args(TCCState *s, int *pargc, char ***pargv, int optind) {
    const TCCOption *popt;
    const char *optarg, *r;
    int last_o = -1;
    CString linker_arg;
    int tool = 0, arg_start = 0, noaction = optind;
    char **argv = *pargv;
    int argc = *pargc;
    cstr_new(&linker_arg);
    while (optind < argc) {
        r = argv[optind];
        optind++;
reparse:
        if (r[0] != '-' || r[1] == '\0') {
            if (r[0] != '@'){
                args_parser_add_file(s, r, s->filetype);
            }
            continue;
        }
        for(popt = tcc_options; ; ++popt) {
            const char *p1 = popt->name;
            const char *r1 = r + 1;
            if (p1 == ((void*)0))
                tcc_error("invalid option -- '%s'", r);
            if (!strstart(p1, &r1))
                continue;
            optarg = r1;
            if (popt->flags & 0x0001) {
                if (*r1 == '\0' && !(popt->flags & 0x0002)) {
                    if (optind >= argc)
                arg_err:
                        tcc_error("argument to '%s' is missing", r);
                    optarg = argv[optind++];
                }
            } else if (*r1 != '\0')
                continue;
            break;
        }
        switch(popt->index) {
        case TCC_OPTION_I:
            tcc_add_include_path(s, optarg);
            break;
        case TCC_OPTION_D:
            parse_option_D(s, optarg);
            break;
        case TCC_OPTION_l:
            args_parser_add_file(s, optarg, 4);
            s->nb_libraries++;
            break;
        case TCC_OPTION_c:
            s->output_type = TCC_OUTPUT_OBJ;
            break;
        case TCC_OPTION_o:
            if (s->outfile) {
                tcc_warning("multiple -o option");
                tcc_free(s->outfile);
            }
            s->outfile = tcc_strdup(optarg);
            break;
        case TCC_OPTION_nostdinc:
            break;
        case TCC_OPTION_nostdlib:
            break;
        default:
unsupported_option:
            if (s->warn_unsupported)
                tcc_warning("unsupported option '%s'", r);
            break;
        }
    }
    if (last_o > 0)
        tcc_define_symbol(s, "__OPTIMIZE__", ((void*)0));
    if (linker_arg.size) {
        r = linker_arg.data;
        goto arg_err;
    }
    *pargc = argc - arg_start;
    *pargv = argv + arg_start;
    if (optind != noaction)
        return 0;
    return 1;
}

static unsigned long le2belong(unsigned long ul) {
    return ((ul & 0xFF0000)>>8)+((ul & 0xFF000000)>>24) +
        ((ul & 0xFF)<<24)+((ul & 0xFF00)<<8);
}


static int contains_any(const char *s, const char *list) {
  const char *l;
  for (; *s; s++) {
      for (l = list; *l; l++) {
          if (*s == *l)
              return 1;
      }
  }
  return 0;
}

static void print_dirs(const char *msg, char **paths, int nb_paths) {
    int i;
    printf("%s:\n%s", msg, nb_paths ? "" : "  -\n");
    for(i = 0; i < nb_paths; i++)
        printf("  %s\n", paths[i]);
}

int main(int argc0, char **argv0) {
    TCCState *s;
    int ret, opt, n = 0, t = 0;
    unsigned start_time = 0;
    const char *first_file;
    int argc; char **argv;
    FILE *ppfp = stdout;
redo:
    argc = argc0, argv = argv0;
    s = tcc_new();
    opt = tcc_parse_args(s, &argc, &argv, 1);
    n = s->nb_files;
    tcc_set_output_type(s, s->output_type);
    s->ppfp = ppfp;
    for (first_file = ((void*)0), ret = 0;;) {
        struct filespec *f = s->files[s->nb_files - n];
        s->filetype = f->type;
        s->alacarte_link = f->alacarte;
        if (!first_file){
            first_file = f->name;
        }
        if (tcc_add_file(s, f->name) < 0){
            ret = 1;
        }
        s->filetype = 0;
        s->alacarte_link = 1;
        if (--n == 0 || ret || (s->output_type == 4 && !0)){
            break;
        }
    }
    if (0 == ret) {
        if (tcc_output_file(s, s->outfile)){
            ret = 1;
        }
    }
    tcc_delete(s);
    if (ret == 0 && n)
        goto redo;
    if (t)
        goto redo;
    if (ppfp && ppfp != stdout)
        fclose(ppfp);
    return ret;
}

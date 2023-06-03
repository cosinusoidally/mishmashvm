print("JS CC overriding functions");

i8r=function(o){
  return HEAP8[o];
};

i32r=function(o){
  return HEAP32[o>>2];
};

i32w=function(o,v){
  HEAP32[o>>2]=v;
};

TCCState$g$nb_files=function(s){
  return i32r(s+716);
};

TCCState$g$output_type=function(s){
  return i32r(s+4);
};

TCCState$g$files=function(s){
  return i32r(s+712);
};

TCCState$g$outfile=function(s){
  return i32r(s+728);
};

TCCState$s$filetype=function(s,v){
  i32w(s+724,v);
}

TCCState$s$alacarte_link=function(s,v){
  i32w(s+0,v);
}

filespec$g$type=function(f){
  return i8r(f+0);
};

filespec$g$alacarte=function(f){
  return i8r(f+1);
};

filespec$g$name=function(f){
  return (f+2);
};
_main=function($argc0,$argv0){
    var sp=STACKTOP;STACKTOP=(STACKTOP+16)|0;
    var $argc=sp;
    var $argv=(sp)+(8);
    var $ret=1;
    var $s;
    var $ret, $opt, $n = 0, $t = 0;
    var $start_time = 0;
    var $first_file;
    var $argc; var $argv;
    i32w($argc, $argc0);
    i32w($argv, $argv0);
    $s = _tcc_new();
    $opt = _tcc_parse_args($s, $argc, $argv, 1);
    $n = TCCState$g$nb_files($s);
    _tcc_set_output_type($s, TCCState$g$output_type($s));
    for ($first_file = 0, $ret = 0;;) {
      $f = i32r(TCCState$g$files($s)+TCCState$g$nb_files($s) - $n);
      TCCState$s$filetype($s,filespec$g$type($f));
      TCCState$s$alacarte_link($s,filespec$g$alacarte($f));
      if (!$first_file){
        $first_file = filespec$g$name($f);
      }
      if (_tcc_add_file($s, filespec$g$name($f)) < 0){
        $ret = 1;
      }
      TCCState$s$filetype($s,0);
      TCCState$s$alacarte_link($s,1);
      if (--$n == 0 || $ret || (TCCState$g$output_type($s) == 4 && !0)){
          break;
      }
  }
  if (0 == $ret) {
    if (_tcc_output_file($s, TCCState$g$outfile($s))){
      $ret = 1;
    }
  };
  _tcc_delete($s);
  STACKTOP=sp;return $ret;
};

read_string=function(x){
  var c;
  var a=[];
  while((c=i8r(x++))!==0){
    a.push(c);
  };
  return a.map(function(y){
    return String.fromCharCode(y);
  }).join("");
};

(function(){
var file=76648;
var orig_greloc=_greloc;
_greloc=function($s,$sym,$offset,$type){
  if($sym){
// printf("greloca %s in section %s file %s:%d\n", get_tok_str(sym->v,0), s->name, file->filename,file->line_num);
    var ident=read_string(_get_tok_str(i32r($sym),0));
    var filename=read_string(i32r(file)+40);
    var line_num=i32r(i32r(file)+16);
    var section_name=read_string($s+72);
    print("js_greloc intercept : "+ident+" file: "+filename+" line: "+line_num
    +" section: "+section_name);
  } else {
   print("sym null");
  };
  return orig_greloc($s,$sym,$offset,$type);
};

})();

(function(){
var orig_set_elf_sym=_set_elf_sym;
_set_elf_sym=function($s,$value,$size,$info,$other,$shndx,$name){
  print("js_set_elf_sym name: "+read_string($name)+" shndx: "+$shndx);
// printf("FOO define elf symbol %s in section %s shndx %d\n",name,s->name,shndx);
  return orig_set_elf_sym($s,$value,$size,$info,$other,$shndx,$name);
}

})();

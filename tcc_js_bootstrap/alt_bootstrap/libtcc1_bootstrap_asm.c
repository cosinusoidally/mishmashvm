typedef unsigned int USItype;

sub_ddmmss(sh, sl, ah, al, bh, bl) {
  __asm__ ("subl %5,%1\n\tsbbl %3,%0"
           : "=r" ((USItype) (sh)),
             "=&r" ((USItype) (sl)) 
           : "0" ((USItype) (ah)),
             "g" ((USItype) (bh)),
             "1" ((USItype) (al)),
             "g" ((USItype) (bl)));
}
umul_ppmm(w1, w0, u, v) {
  __asm__ ("mull %3"
           : "=a" ((USItype) (w0)),
             "=d" ((USItype) (w1))
           : "%0" ((USItype) (u)),
             "rm" ((USItype) (v)));
}
udiv_qrnnd(q, r, n1, n0, dv) {
  __asm__ ("divl %4"
           : "=a" ((USItype) (q)),
             "=d" ((USItype) (r)) 
           : "0" ((USItype) (n0)),
             "1" ((USItype) (n1)),
             "rm" ((USItype) (dv)));
}
count_leading_zeros(count, x) {
    USItype __cbtmp;
    __asm__ ("bsrl %1,%0"
             : "=r" (__cbtmp) : "rm" ((USItype) (x)));
    (count) = __cbtmp ^ 31;
}

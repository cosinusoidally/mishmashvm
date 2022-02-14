print();
print("Putting Duktape through its paces");
print("=================================");
print('Some simple maths: 2 + 3 = '+ (2+3));

print("Test the mandelbrot demo from the duktape repo:");

function mandel() {
    var w = 76, h = 28, iter = 100;
    var i, j, k, c;
    var x0, y0, xx, yy, xx2, yy2;
    var line;

    for (i = 0; i < h; i++) {
        y0 = (i / h) * 2.5 - 1.25;

        for (j = 0, line = []; j < w; j++) {
            x0 = (j / w) * 3.0 - 2.0;

            for (k = 0, xx = 0, yy = 0, c = '#'; k < iter; k++) {
                /* z -> z^2 + c
                 *   -> (xx+i*yy)^2 + (x0+i*y0)
                 *   -> xx*xx+i*2*xx*yy-yy*yy + x0 + i*y0
                 *   -> (xx*xx - yy*yy + x0) + i*(2*xx*yy + y0)
                 */

                xx2 = xx*xx; yy2 = yy*yy;

                if (xx2 + yy2 < 4.0) {
                    yy = 2*xx*yy + y0;
                    xx = xx2 - yy2 + x0;
                } else {
                    /* xx^2 + yy^2 >= 4.0 */
                    if (k < 3) { c = '.'; }
                    else if (k < 5) { c = ','; }
                    else if (k < 10) { c = '-'; }
                    else { c = '='; }
                    break;
                }
            }

            line.push(c);
        }

        print(line.join(''));
    }
}

try {
    mandel();
} catch (e) {
    print(e.stack || e);
}

print("Let's try throwing an error as that needs longjmp");
try {
  print("Throwing error ...");
  throw "error";
} catch (e){
  print("... caught error");
}

print("Some maths:");
print("Math.E: ",Math.E);
print("Math.LN2: ",Math.LN2);
print("Math.LN10: ",Math.LN10);
print("Math.LOG2E: ",Math.LOG2E);
print("Math.LOG10E: ",Math.LOG10E);
print("Math.PI: ",Math.PI);
print("Math.SQRT1_2: ",Math.SQRT1_2);
print("Math.SQRT2: ",Math.SQRT2);
print("Math.abs(1): "+Math.abs(1));
print("Math.abs(-1): "+Math.abs(-1));
print("Math.acos(0): "+Math.acos(0));
print("Math.asin(0): "+Math.asin(0));
print("Math.atan(0): "+Math.atan(0));
print("Math.sin(1): "+Math.sin(1));
print("Math.cos(1): "+Math.cos(1));
print("Math.tan(1): "+Math.tan(1));
print("Math.pow(2,2): "+Math.pow(2,2));
print("Some hyperbolic functions seem to be missing in duktape");

try {
  print("Math.acosh(0): "+Math.acosh(0));
  print("Math.asinh(0): "+Math.asinh(0));
  print("Math.atanh(0): "+Math.atanh(0));
} catch (e) {
  print("Caught error for missing functions: "+e);
}

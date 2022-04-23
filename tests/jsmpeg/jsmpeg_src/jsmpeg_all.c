foo(){
  exit(0);
}

#include "mpeg1.c"
#include "mp2.c"
#include "buffer.c"

int clamp(int x){
  if(x>255){x=255;}
  if(x<0){x=0;}
  return x;
}

// YCbCrToRGBA = function(y, cb, cr, rgba, width, height) {
void YCbCrToRGBA(char *y, char *cb, char *cr, char *rgba, int width, int height){

//        var w = ((width + 15) >> 4) << 4,
        int w = ((width + 15) >> 4) << 4,
//                w2 = w >> 1;
                w2 = w >> 1;
//        var yIndex1 = 0,
        int yIndex1 = 0,
//                yIndex2 = w,
                yIndex2 = w,
//                yNext2Lines = w + (w - width);
                yNext2Lines = w + (w - width);
//
//        var cIndex = 0,
        int cIndex = 0,
//                cNextLine = w2 - (width >> 1);
                cNextLine = w2 - (width >> 1);

//        var rgbaIndex1 = 0,
        int rgbaIndex1 = 0,
//                rgbaIndex2 = width * 4,
                rgbaIndex2 = width * 4,
//                rgbaNext2Lines = width * 4;
                rgbaNext2Lines = width * 4;

//        var cols = width >> 1,
        int cols = width >> 1,
//                rows = height >> 1;
                rows = height >> 1;

//        var ccb, ccr, r, g, b;
        int ccb, ccr, r, g, b;
//
//        for (var row = 0; row < rows; row++) {
        for (int row = 0; row < rows; row++) {
//                for (var col = 0; col < cols; col++) {
                for (int col = 0; col < cols; col++) {
//                        ccb = cb[cIndex];
                        ccb = cb[cIndex];
//                        ccr = cr[cIndex];
                        ccr = cr[cIndex];
//                        cIndex++;
                        cIndex++;

//                        r = (ccb + ((ccb * 103) >> 8)) - 179;
                        r = (ccb + ((ccb * 103) >> 8)) - 179;
//                        g = ((ccr * 88) >> 8) - 44 + ((ccb * 183) >> 8) - 91;
                        g = ((ccr * 88) >> 8) - 44 + ((ccb * 183) >> 8) - 91;
//                        b = (ccr + ((ccr * 198) >> 8)) - 227;
                        b = (ccr + ((ccr * 198) >> 8)) - 227;

//                        // Line 1
//                        var y1 = y[yIndex1++];
                        int y1 = y[yIndex1++];
//                        var y2 = y[yIndex1++];
                        int y2 = y[yIndex1++];
//                        rgba[rgbaIndex1]   = y1 + r;
                        rgba[rgbaIndex1]   = clamp(y1 + r);
//                        rgba[rgbaIndex1+1] = y1 - g;
                        rgba[rgbaIndex1+1] = clamp(y1 - g);
//                        rgba[rgbaIndex1+2] = y1 + b;
                        rgba[rgbaIndex1+2] = clamp(y1 + b);
//                        rgba[rgbaIndex1+4] = y2 + r;
                        rgba[rgbaIndex1+4] = clamp(y2 + r);
//                        rgba[rgbaIndex1+5] = y2 - g;
                        rgba[rgbaIndex1+5] = clamp(y2 - g);
//                        rgba[rgbaIndex1+6] = y2 + b;
                        rgba[rgbaIndex1+6] = clamp(y2 + b);
//                        rgbaIndex1 += 8;
                        rgbaIndex1 += 8;

//                        // Line 2
//                        var y3 = y[yIndex2++];
                        int y3 = y[yIndex2++];
//                        var y4 = y[yIndex2++];
                        int y4 = y[yIndex2++];
//                        rgba[rgbaIndex2]   = y3 + r;
                        rgba[rgbaIndex2]   = clamp(y3 + r);
//                        rgba[rgbaIndex2+1] = y3 - g;
                        rgba[rgbaIndex2+1] = clamp(y3 - g);
//                        rgba[rgbaIndex2+2] = y3 + b;
                        rgba[rgbaIndex2+2] = clamp(y3 + b);
//                        rgba[rgbaIndex2+4] = y4 + r;
                        rgba[rgbaIndex2+4] = clamp(y4 + r);
//                        rgba[rgbaIndex2+5] = y4 - g;
                        rgba[rgbaIndex2+5] = clamp(y4 - g);
//                        rgba[rgbaIndex2+6] = y4 + b;
                        rgba[rgbaIndex2+6] = clamp(y4 + b);
//                        rgbaIndex2 += 8;
                        rgbaIndex2 += 8;
//                }
                }
//
//                yIndex1 += yNext2Lines;
                yIndex1 += yNext2Lines;
//                yIndex2 += yNext2Lines;
                yIndex2 += yNext2Lines;
//                rgbaIndex1 += rgbaNext2Lines;
                rgbaIndex1 += rgbaNext2Lines;
//                rgbaIndex2 += rgbaNext2Lines;
                rgbaIndex2 += rgbaNext2Lines;
//                cIndex += cNextLine;
                cIndex += cNextLine;
//        }
        }
//};

  return;
}

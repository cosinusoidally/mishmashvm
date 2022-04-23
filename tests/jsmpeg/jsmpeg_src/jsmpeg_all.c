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

        int w = ((width + 15) >> 4) << 4,
                w2 = w >> 1;

        int yIndex1 = 0,
                yIndex2 = w,
                yNext2Lines = w + (w - width);

        int cIndex = 0,
                cNextLine = w2 - (width >> 1);

        int rgbaIndex1 = 0,
                rgbaIndex2 = width * 4,
                rgbaNext2Lines = width * 4;

        int cols = width >> 1,
                rows = height >> 1;

        int ccb, ccr, r, g, b;

        for (int row = 0; row < rows; row++) {
                for (int col = 0; col < cols; col++) {
                        ccb = cb[cIndex];
                        ccr = cr[cIndex];
                        cIndex++;

                        r = (ccb + ((ccb * 103) >> 8)) - 179;
                        g = ((ccr * 88) >> 8) - 44 + ((ccb * 183) >> 8) - 91;
                        b = (ccr + ((ccr * 198) >> 8)) - 227;

                        // Line 1
                        int y1 = y[yIndex1++];
                        int y2 = y[yIndex1++];
                        rgba[rgbaIndex1]   = clamp(y1 + r);
                        rgba[rgbaIndex1+1] = clamp(y1 - g);
                        rgba[rgbaIndex1+2] = clamp(y1 + b);
                        rgba[rgbaIndex1+4] = clamp(y2 + r);
                        rgba[rgbaIndex1+5] = clamp(y2 - g);
                        rgba[rgbaIndex1+6] = clamp(y2 + b);
                        rgbaIndex1 += 8;

                        // Line 2
                        int y3 = y[yIndex2++];
                        int y4 = y[yIndex2++];
                        rgba[rgbaIndex2]   = clamp(y3 + r);
                        rgba[rgbaIndex2+1] = clamp(y3 - g);
                        rgba[rgbaIndex2+2] = clamp(y3 + b);
                        rgba[rgbaIndex2+4] = clamp(y4 + r);
                        rgba[rgbaIndex2+5] = clamp(y4 - g);
                        rgba[rgbaIndex2+6] = clamp(y4 + b);
                        rgbaIndex2 += 8;
                }

                yIndex1 += yNext2Lines;
                yIndex2 += yNext2Lines;
                rgbaIndex1 += rgbaNext2Lines;
                rgbaIndex2 += rgbaNext2Lines;
                cIndex += cNextLine;
        }
  return;
}

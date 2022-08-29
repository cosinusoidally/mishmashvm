/*
Copyright (c) 2012, Peter de Rivaz
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the copyright holder nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
	var editor=false;

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           return window.setTimeout(callback, 1000/60);
         };
	})();
	var path_rpi = 'http://www.raspberrypi.org/penguin_assets/data/';
	var path = 'data/'; /* I wonder why the levels and images will not load if accessed on a different URL? */
	var path_local = 'data/';
    var gl;
    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
			gl.canvas = canvas;
        } catch (e) {
        }
        if (!gl) {
            alert("Your browser does not support WebGL.  This game will not work, sorry.");
			window.location="http://penguinspuzzle.appspot.com";
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    var shader;
    var sun_shader;
    var shadow_shader;
    var water_shader;
	var expl_shader;

    function Shader(prefix) {
        var fragmentShader = getShader(gl, prefix+"shader-fs");
        var vertexShader = getShader(gl, prefix+"shader-vs");

        var program = gl.createProgram();
		this.shaderProgram = program; 
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			alert(gl.getProgramInfoLog(program));
            alert("Could not initialise shaders");
        }

        this.attr_tex = gl.getAttribLocation(program, "tex");
        this.attr_vertex = gl.getAttribLocation(program, "vertex");
        this.attr_normal = gl.getAttribLocation(program, "normal");
        this.unif_world = gl.getUniformLocation(program, "world");
        this.unif_view = gl.getUniformLocation(program, "view");
        this.unif_view_reflect = gl.getUniformLocation(program, "view_reflect");
        this.unif_color = gl.getUniformLocation(program, "color");
        this.unif_texture = gl.getUniformLocation(program, "texture");
        this.unif_texture_reflect = gl.getUniformLocation(program, "texture_reflect");
        this.unif_blend = gl.getUniformLocation(program, "blend");

    }
	
	Shader.prototype.select=function(bx,by,bz,bw)
	{
		if (!bx) {var bx=0;}
		if (!by) {var by=0;}
		if (!bz) {var bz=0;}
		if (!bw) {var bw=0;}
		gl.useProgram ( this.shaderProgram );
        //gl.uniform4f(this.unif_color, 0.5, 0.5, 0.8, 1.0);
        gl.uniform1i(this.unif_texture, 0);
        gl.uniform4f(this.unif_blend, bx, by, bz, bw);
        //if (this.unif_texture_reflect>=0)
        gl.uniform1i(this.unif_texture_reflect, 1);
	}
	
	Shader.prototype.blend=function(bx,by,bz,bw)
	{
		if (!bx) {var bx=0;}
		if (!by) {var by=0;}
		if (!bz) {var bz=0;}
		if (!bw) {var bw=0;}
		gl.uniform4f(this.unif_blend, bx, by, bz, bw);
	}
	
	Shader.prototype.unifMatrix=function(u,M)
	{
		var E=[];
		for(var i=0;i<4;i++)
		{
			extend(E,M[i]);
		}
	    var A = new Float32Array(E);
		gl.uniformMatrix4fv(u,gl.FALSE,A);
	}
	
	Shader.prototype.selectWorld=function(M)
	{
		this.unifMatrix(this.unif_world,M);
	}
	
	Shader.prototype.selectView=function(M,M2)
	{
		this.unifMatrix(this.unif_view,M);
		if (!M2)
			return;
		this.unifMatrix(this.unif_view_reflect,M2);
	}
	
	var PENG=0;
	var TREE=1;
	var CHEST=2;
	var NONE=3;  // Used for deleted objects
	var FRAGMENT=4;
	var FISHPAIL=5;
	var ROBOT=6;
	var OGUN=7;
	var BULLET=8;
	var BOMB=9;
	var DETONATOR=10;
	var FIRE=11;
	var SPOTLIGHT=12;
	var WSNOWBALL=13;
	var ROCKET=14;
	var EXPLOSION=15;
	var BARREL=16;
	var CAMERA=17;
	var SOUTHPOLE=18;
	var SMHAT=19;
	var OLASER=20;
	var OMIRROR=21;
	var OSHIELD=22;
	var OROCKET=23;
	var OSHIELDBLOCK=24;
	var BABYPENG=25;
	
	var BOPPING=0,WALKING=1,STILL=2,FEEDING=3,CONTROLLED=4,FED=5;
	var PUZZLER=6,FFRAGMENT=7,FSMOKE=8,FFLASH=9,FEXPLOSION=10,FDEBRIS=11,FLASER=12;
	
	var lastMouseX = 0;
	var lastMouseY = 0;
	var level;
	var water;
	var sea;
	var expl;
	var sky;
	var view = new View();
	var sun_view = new View();
	var world = new World();
	var iceblock;
	var tree;
	var mainpeng;
	var mirror_fb;
	
	var models = {};
	function handleMouseMove(event) {
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
	}
	
	
	var BICE=0;
	var BCRACKED=1;
	var BSEA=2;
	var BSNOW=3;
	var BEXIT=4;
	var BDOOR=5;
	var BFISHINGROD=6;
	var BSKIS=7;
	var BTILE=8;
	var BPOLE=9;
	var BBUTTON=10;
	var BFRAGILE=11;
	
	function mat_mult(A,B)
	{
		var C=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		for(var i=0;i<4;i++)
		{
			for(var j=0;j<4;j++)
			{
				var t=0;
				for(var k=0;k<4;k++)
					t+=A[i][k]*B[k][j];
				C[i][j]=t;
			}
		}
		return C;
	}
	
	function vec_mult(A,B)
	{
		var C=[0,0,0,0];
		for(var j=0;j<4;j++)
		{
			var t=0;
			for(var k=0;k<4;k++)
				t+=A[k]*B[k][j];
			C[j]=t;
		}
		return C;
	}
	
	function LookAtMatrix(at,eye,reflect)
	{ 
		var up=[0,0,1];
		if (reflect)
		{
			var depth=-20.0;
			eye[2]=2*depth-eye[2];
			at[2]=2*depth-at[2];
		}
		var zaxis = vec_normal(vec_sub(at,eye));
		var xaxis = vec_normal(vec_cross(up,zaxis));
		var yaxis = vec_cross(zaxis,xaxis);
		xaxis.push(-vec_dot(xaxis,eye))
		yaxis.push(-vec_dot(yaxis,eye))
		zaxis.push(-vec_dot(zaxis,eye))
		var z=[0,0,0,1.0]
		var C=[0,0,0,0];
		for(var a=0;a<4;a++)
		{
			C[a]=[xaxis[a],yaxis[a],zaxis[a],z[a]];
		}
		if (reflect)
		{
			var depth=-20.0;
			eye[2]=2*depth-eye[2];
			at[2]=2*depth-at[2];
		}
		return C;
	}
	
	function ProjectionMatrix(ortho)
	{
		var near=10;
		var far=2000.0;
		if (ortho)
		{
			var s = 0.002;
			// Scale z to far
			// Keep w as unity
			return [[s,0,0,0],[0,s,0,0],[0,0,s,0],[0,0,0,1]];
		}
		//var fov_h=1.7;
		var fov_v=1.4;
		//var w=1./Math.tan(fov_h*0.5);
		var h=1./Math.tan(fov_v*0.5);
		var w = h * gl.viewportHeight / gl.viewportWidth;
		var Q=far/(far-near);
		
		return [[w,0,0,0],[0,h,0,0],[0,0,Q,1],[0,0,-Q*near,0]];		
	}
		
	function vec_sub(A,B)
	{
		var C=[]
		for(var i=0;i<A.length;i++)
			C.push(A[i]-B[i]);
		return C;
	}
	
	function vec_add(A,B)
	{
		var C=[]
		for(var i=0;i<A.length;i++)
			C.push(A[i]+B[i]);
		return C;
	}
	
	function vec_scale(A,s)
	{
		var C=[]
		for(var i=0;i<A.length;i++)
			C.push(A[i]*s);
		return C;
	}
	
	function vec_dot(A,B)
	{
		var t=0.0;
		for(var i=0;i<A.length;i++)
			t+=A[i]*B[i];
		return t;
	}

	function vec_cross(a,b)
	{
		return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
    }
	
	function vec_normal(A)
	{
		var n=Math.sqrt(vec_dot(A,A))+0.0001;
		var C=[];
		var inv = 1.0/n;
		for(var i=0;i<A.length;i++)
			C.push(A[i]*inv);
		return C;
	}
	// Add all the items in data to the array A
	function extend(A,data)
	{
		for(var i=0;i<data.length;i++)
			A.push(data[i]);
	}
	
	function Buffer(pts,tex,faces)
	{
		for(var i=0;i<tex.length;i++)
		{
			if (tex[i].length<3)
				tex[i].push(1.0); // Add full lighting
		}
		var normals=new Array(tex.length);
		for(var i=0;i<pts.length;i++)
		{
			normals[i]=[0,0,1];
		}
		for(var i=0;i<faces.length;i++)
		{
			var a = faces[i][0];
			var b = faces[i][1];
			var c = faces[i][2];
			var n = vec_normal(vec_cross(vec_sub(pts[b],pts[a]),vec_sub(pts[c],pts[a])));
			normals[a]=n;
			normals[b]=n;
			normals[c]=n;
		}
		var B = []
		for(var i=0;i<pts.length;i++)
		{
			extend(B,pts[i]);
			extend(B,tex[i]);
			extend(B,normals[i]);
		}
		var E = []
		for(var i=0;i<faces.length;i++)
		{
			for(var j=0;j<3;j++)
				E.push(faces[i][j]);
		}
		this.ntris=faces.length;
		this.vbuf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(B), gl.STATIC_DRAW);
		this.vbuf.numItems = pts.length;
		
		this.ebuf = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebuf);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(E), gl.STATIC_DRAW);
		this.ebuf.numItems = E.length;
	}
	Buffer.prototype.select = function(s)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebuf);
		gl.vertexAttribPointer(s.attr_normal, 3, gl.FLOAT, 0, 36, 24); 
        gl.vertexAttribPointer(s.attr_vertex, 3, gl.FLOAT, 0, 36, 0);
        gl.vertexAttribPointer(s.attr_tex, 2, gl.FLOAT, 0, 36, 12);
        gl.enableVertexAttribArray(s.attr_normal);
        gl.enableVertexAttribArray(s.attr_vertex);
        gl.enableVertexAttribArray(s.attr_tex);
	}
	Buffer.prototype.draw = function(s)
	{
		this.select(s)
        gl.drawElements ( gl.TRIANGLES, this.ebuf.numItems, gl.UNSIGNED_SHORT, 0 );
	}
	Buffer.prototype.drawfan = function(s)
	{
		this.select(s)
        gl.drawArrays ( gl.TRIANGLE_FAN, 0, this.vbuf.numItems );
	}
	Buffer.prototype.drawstrip = function(s)
	{
		this.select(s)
        gl.drawArrays ( gl.TRIANGLE_STRIP, 0, this.vbuf.numItems );
	}
	
	function Texture(texname) {
		var t = this;
		t.tex = gl.createTexture();
		t.image = new Image();
		t.image.onload = function() {
			t.handleLoadedTexture();
		}
		t.image.src = texname;
		this.loaded=false;
	}
	Texture.prototype.handleLoadedTexture = function() {
		gl.bindTexture(gl.TEXTURE_2D, this.tex);
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);  // not normally needed
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.loaded=true;
		view.changed=true;
	}
	Texture.prototype.select = function() {
		//gl.activeTexture(gl.TEXTURE0);
		if (this.loaded)
			gl.bindTexture(gl.TEXTURE_2D, this.tex);
	}
	
	// Allocate a new frame buffer of given dimensions
	// and set it up in texture unit 1
	function Framebuffer(w,h,add_depth)
	{
		this.tex = gl.createTexture();
		this.w=w;
		this.h=h;
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D,this.tex);
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,w,h,0,gl.RGB,gl.UNSIGNED_BYTE,null);
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		this.fb=gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.tex,0);
		gl.activeTexture(gl.TEXTURE0);
		if (!add_depth) return;
		var depthbuf = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER,depthbuf);
		gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,w,h);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthbuf);
	}
	Framebuffer.prototype.select = function()
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.fb);
		gl.viewport(0, 0, this.w, this.h);
	}
	// Use the generated texture in channel 1
	Framebuffer.prototype.selectTexture = function()
	{
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D,this.tex);
		gl.activeTexture(gl.TEXTURE0);
	}
	
	// Pass in name of 3ds model and Texture object
	// Can scale down the z axis
	function Model(name,t,id,scalez) {
		var request = new XMLHttpRequest();
		var m = this;
		if (!scalez)
		{
			var scalez = 1;
		}
		m.t = t;
		m.loaded = false;
		m.scalez = scalez;
		request.open("GET", name);
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				m.handleLoaded(JSON.parse(request.responseText));
			}
		}
		request.send();
		models[id]=this;
	}
	Model.prototype.handleLoaded = function(data) {
		this.A = [];
		for(var i=0;i<data.length;i++)
		{
			var x = data[i][1];
			var pts = x[0];
			for(var j=0;j<pts.length;j++)
			{
				pts[j][2]*=this.scalez;
			}
			this.A.push( new Buffer(x[0],x[1],x[2]));
		}
		this.loaded=true;
		view.changed=true;
	}
	Model.prototype.draw = function(s) {
		if (!this.loaded)
			return;
		this.t.select();
		for(var i=0;i<this.A.length;i++)
		{
			this.A[i].draw(s);
		}
	}
	// Sets up a two-sided centered flat quad of width sz and at height depth.  Texture can also be scaled.
	function FlatQuad(t,sz,depth,texscale)
	{
        var pts = [];
        var tex = [];
        var faces = [];
        var deltas = [[0,0],[1,0],[1,1],[0,1]];
        var N=0;
        for(var i=0;i<4;i++)
		{
			dx=deltas[i][0];
			dy=deltas[i][1];
            pts.push([-sz*0.5+dx*sz,-sz*0.5+dy*sz,depth]);
            tex.push([dx*texscale,dy*texscale,1.0]);
		}
        faces.push([N,N+1,N+2]);
        faces.push([N,N+2,N+3]);
        faces.push([N,N+2,N+1]);
        faces.push([N,N+3,N+2]);
        this.buf=new Buffer(pts,tex,faces);
        this.t=t;
	}
	FlatQuad.prototype.draw = function(s)
	{
        this.t.select();
        this.buf.draw(s);
	}
	
	// Generate a triangle fan for the ocean
	function Sea(t,sz,depth,texscale)
	{
		var numpts=30;  // Number of points around circumference
        var pts = [];
        var tex = [];
        var faces = [];
        var N=0;
		pts.push([0,0,depth]);
		tex.push([0,0,1.0]);
        for(var i=0;i<=numpts;i++)
		{
			var angle=2*3.1416*i/numpts;
			var x = Math.cos(angle);
			var y = Math.sin(angle);
            pts.push([x*sz+400,y*sz+400,depth]);
            tex.push([x*texscale,y*texscale,1.0]);
		}
        this.buf=new Buffer(pts,tex,faces);
        this.t=t;
	}
	Sea.prototype.draw = function(s)
	{
        this.t.select();
        this.buf.drawfan(s);
	}
	
	// Generate a triangle fan for the sky
	function Sky(t,sz,depth,texscale)
	{
		var numpts=30;  // Number of points around circumference
        var pts = [];
        var tex = [];
        var faces = [];
        var N=0;
        for(var i=0;i<=numpts;i++)
		{
			var angle=2*3.1415*i/numpts;
			var x = Math.cos(angle);
			var y = Math.sin(angle);
            pts.push([x*sz+400,y*sz+400,depth]);
            tex.push([i*texscale/numpts,1.0,1.0]);
			pts.push([x*sz+400,y*sz+400,sz]);
            tex.push([i*texscale/numpts,0.0,1.0]);
		}
        this.buf=new Buffer(pts,tex,faces);
        this.t=t;
	}
	Sky.prototype.draw = function(s)
	{
        this.t.select();
        this.buf.drawstrip(s);
	}
	
	// Sets up a sequence of triangles to be used for an explosion
	// The position w.r.t. 0 gives the velocity
	// The texture dx,dy will construct the final vertex position aimed at the view
	function Explosion(t)
	{
        var pts = [];
        var tex = [];
        var faces = [];
        var deltas = [[0,0],[1,0],[1,1],[0,1]];
		for(var j=0;j<300;j++)
		{
			var N=pts.length;
			var x = (Math.random()-0.5)*40;
			var y = (Math.random()-0.5)*40;
			var z = (Math.random())*40;
			for(var i=0;i<4;i++)
			{
				dx=deltas[i][0];
				dy=deltas[i][1];
				pts.push([x,y,z]);
				tex.push([dx,dy,1.0]);
			}
			faces.push([N,N+1,N+2]);
			faces.push([N,N+2,N+3]);
			faces.push([N,N+2,N+1]);
			faces.push([N,N+3,N+2]);
		}
        this.buf=new Buffer(pts,tex,faces);
        this.t=t;
	}
	Explosion.prototype.draw = function(s)
	{
        this.t.select();
        this.buf.draw(s);
	}
	
	function is_baby(p)
	{
		return p.size<4;
	}
	
	function mysign(x) {
        //Turns number into +-1 or 0 depending on sign
		if (x>0.1) return 1;
		if (x<-0.1) return -1;
		return 0;
	}
	
	function CompleteLevel(levnum) {
		if(typeof(Storage)!=="undefined")
			localStorage["done.level."+levnum]="true";
	}
	
	function Level(t) 
	{
		this.t = t;
		this.mode = 0;
		this.grid = 64;
		this.sz = 40.0;
		this.loaded = 0;
		this.levnum = 0;
		this.backup=0;
		this.snapshots=[];
		for(var i=0;i<MAXBACKUPS;i++)
			this.snapshots[i]=0;
	}
	Level.prototype.block = function(x,y)
	{
		return this.L[x*this.grid+y][0];
	}
	Level.prototype.dist = function(a,b)
	{
		var dx = a.x-b.x;
		var dy = a.y-b.y;
		return Math.sqrt(dx*dx+dy*dy);
	}
	// If there are contents to the square then our height is determined based on what we are standing on.
	Level.prototype.pt = function(x,y,dx,dy,p)
	{
	    var A=[BSEA,null,0,0,0];
        if (0<=x && x<this.w && 0<=y && y<this.h)
		{
			A=this.L[x*this.grid+y];
		}
        var H=this.sz*(A[2]+dx*A[3]+dy*A[4])
        if (A[0]==BSEA)
            //H = -this.sz*0.5;
            H = -this.sz*1.0;
        var pt = [this.sz*(x+dx),this.sz*(y+dy),H];
		if (A[1])
		{
			// This square has a stack of objects
			if (!p || A[1]==p)
				return pt;
			// Determine height based on height of guy on the bottom
			pt[2]=this.groundpt(A[1])[2];
			for(var hit=A[1];hit && hit!=p;hit=hit.contents)
			{
				if (this.dist(hit,p)<this.sz*0.8)  // If the objects are too far apart (e.g. multiple sliders) then don't draw on top
					pt[2]+=objectHeights[hit.type]*this.sz;
			}
		}
		return pt;
	}
	// """compute point on the ground for a penguin"""    
	Level.prototype.groundpt = function(p)
	{
		var x = p.x;
		var y = p.y;
	    x /= this.sz;
		y /= this.sz;
		var ix=Math.floor(x);
		var iy=Math.floor(y);
        return this.pt(ix,iy,x-ix,y-iy,p)
	}
	// Compute the height for the float coordinates x,y w.r.t. square sq
	Level.prototype.squareHeight = function(sq,dx,dy)
	{
		var A=this.L[sq];
        var H=this.sz*(A[2]+dx*A[3]+dy*A[4]);
        if (A[0]==BSEA)
            H = -this.sz*1.0;
		return H;
	}
	// Returns the height of this penguin
	Level.prototype.calcPotential = function(p)
	{
		return this.squareHeight(p.square,0.5,0.5)+this.stackHeight(p);
	}
	// Returns the height of all the things the penguin is standing on
	Level.prototype.stackHeight = function(p)
	{
		var s=0;
		for(var hit=p.standingon;hit;hit=hit.standingon)
			s+=objectHeights[hit.type]*this.sz;
		return s;
	}
        
	Level.prototype.makeModel = function()
	{
        // The level is an array of square,contents,height,dx,dy
        //# Note that arrays are stored in [x*sz+y] order to match C structures
        var pts = [];
        var tex = [];
        var faces = [];
        var w=this.w;
        var h=this.h; 
        var deltas = [[0,0],[1,0],[1,1],[0,1]];
		var TC=[0,4,1,2,6,7,7,8,9,9,15,7];
            
        for(var y=0;y<h;y++)
		{
            for(var x=0;x<w;x++)
			{ 
                var N=pts.length;
				var c=this.block(x,y);
                if (c==BSEA) continue;
                var si=TC[c];
                var sx=(si&3)*0.25;
                var sy=(si>>2)*0.25;
				for (var i=0;i<4;i++)
				{
					var dx=deltas[i][0];
					var dy=deltas[i][1];
					pts.push(this.pt(x,y,dx,dy));
					tex.push([sx+0.25*dx,sy+0.25*dy,1.0]);
				}
				faces.push([N,N+1,N+2]);
				faces.push([N,N+2,N+3]);
                for(var i=0;i<4;i++)
				{
					var dx=deltas[i][0];
					var dy=deltas[i][1];
                    var dx2=deltas[(i+1)&3][0];
					var dy2=deltas[(i+1)&3][1];
                    var ex=dx+dx2-1;
                    var ey=dy+dy2-1;
                    var a=this.pt(x,y,dx,dy);
                    var b=this.pt(x,y,dx2,dy2);
                    var a2=this.pt(x+ex,y+ey,dx-ex,dy-ey);
                    var b2=this.pt(x+ex,y+ey,dx2-ex,dy2-ey);
                    if ((a[2]>a2[2]+0.1) || (b[2]>b2[2]+0.1))
					{
                        N=pts.length;
                        pts.push(a,b,b2,a2);
						for(var j=0;j<4;j++)
						{
							var dx3=deltas[j][0];
							var dy3=deltas[j][1];
                            tex.push([0.25+0.25*dx3,0.75+0.25*dy3,0.6]);
						}
                        faces.push([N,N+2,N+1]);
                        faces.push([N,N+3,N+2]);
					}
				}
			}
		}
        this.buf=new Buffer(pts,tex,faces)
	}
	Level.prototype.drawTiles = function(s) 
	{
		this.t.select();
		if (level.loaded)
		{
			this.buf.draw(s);
		}
	}
	Level.prototype.drawObjects = function(s,v,transparent) 
	{
		if (!level.loaded) return;
		for(var i=0;i<this.P.length;i++)
		{
			var p = this.P[i];
			if (p.type in models)
			{
				if (!transparent && p.type==CHEST) continue;
				if (transparent && p.type!=CHEST) continue;
				world.identity();
				world.translate(level.groundpt(p));
				//if (p.type==PENG || p.type==BABYPENG || p.type==OGUN)
				{
					if (Math.abs(p.thetaf)>1)
					{
						world.rotate(p.thetaf);
					}
					if (p.bounce>0)
					{
						world.rotatex(p.bounce*2);
					}
				}
				s.selectWorld(world.V);
				models[p.type].draw(s);
				if (p.type==PENG && p.numfish>0)
				{
					world.translate([0,0,40]);
					s.selectWorld(world.V);
					models[FISHPAIL].draw(s);
				}
			}
		}
	}
	Level.prototype.drawFragments = function(s) 
	{
		if (!level.loaded) return;
		for(var i=0;i<this.P.length;i++)
		{
			var p = this.P[i];
			if (p.type == FRAGMENT)
			{
				world.identity();
				world.translate([p.x,p.y,p.d]);
				s.selectWorld(world.V);
				s.blend(p.steps);
				expl.draw(s);
			}
		}
	}
	var MAXBACKUPS=64; // Should be 2**n
	Level.prototype.advanceSnapshot = function()
	{
		this.backup=(this.backup+1)&(MAXBACKUPS-1);
		return this.snapshots[this.backup];
	}
	Level.prototype.snapshot = function()
	{
		var oldL = [];
		var L=this.L;
		for(var y=0;y<this.h;y++)
		{
			for(var x=0;x<this.w;x++)
			{
				var ind=x*this.grid+y;
				oldL[ind]=L[ind].slice(0);
			}
		}
		var oldP = [];
		var P=this.P;
		for(var y=0;y<P.length;y++)
		{
			oldP[y]={};
			for(var prop in P[y])
			{
				oldP[y][prop]=P[y][prop];
			}
		}
		this.snapshots[this.backup]=[oldL,oldP];
	}
	Level.prototype.clearSnapshots = function()
	{
		this.snapshots[this.backup]=false;
		this.advanceSnapshot();
		this.snapshots[this.backup]=false;
		this.advanceSnapshot();
		this.snapshots[this.backup]=false;
		this.retreatSnapshot();
	}
	Level.prototype.retreatSnapshot = function()
	{
		this.backup=(this.backup-1)&(MAXBACKUPS-1);
		return this.snapshots[this.backup];
	}
	Level.prototype.undo = function()
	{
		if (!this.snapshots[this.backup])
		{
			this.advanceSnapshot();
			return;
		}
		var oldL=this.snapshots[this.backup][0];
		var oldP=this.snapshots[this.backup][1];
		var L=this.L;
		for(var y=0;y<this.h;y++)
		{
			for(var x=0;x<this.w;x++)
			{
				var ind=x*this.grid+y;
				L[ind]=oldL[ind].slice(0);
			}
		}
		var P=this.P;
		for(var y=0;y<oldP.length;y++)
		{
			for(var prop in oldP[y])
			{
				P[y][prop]=oldP[y][prop];
			}
		}
		this.makeModel();
	}
	Level.prototype.handleLoadedLevel = function(data)
	{
		var L=data[0];
		this.P = data[1];
		this.w = L.length;
		this.h = L[0].length;
		this.L = new Array(this.grid*this.grid);
		// Offset out by 32 to give us extra drawing space
		var off=8;
		for(var y=0;y<this.grid;y++)
		{
			//if (y>=off && y<this.h+off) continue;
			for(var x=0;x<this.grid;x++)
			{
				//if (x>=off && x<this.w+off) continue;
				this.L[x*this.grid+y]=[BSEA,null,0,0,0];
			}
		}for(var y=0;y<this.h;y++)
		{
			for(var x=0;x<this.w;x++)
			{
				L[x][y][1] = null; // Clear the contents
				this.L[(x+off)*this.grid+y+off]=L[x][y];
			}
		}
		
		this.h+=Math.min(this.grid,off*2);
		this.w+=Math.min(this.grid,off*2);
		this.makeModel();
		this.loaded = 1;
		view.changed=true;
		for(var i=0;i<this.P.length;i++)
		{
			var p=this.P[i];
            if (p.state==PUZZLER)
                heropeng=p;
			if (p.type==PENG && is_baby(p))
				p.type=BABYPENG;
			if (p.type==OGUN || p.type==OLASER)
				p.thetaf += 180;
			p.speed=ICESPEED;
			p.x+=off*this.sz;
			p.y+=off*this.sz;
			if (p.type==CAMERA)
			{
				p.dx+=off*this.sz;
				p.vx+=off*this.sz;
				p.dy+=off*this.sz;
				p.vy+=off*this.sz;
			}
			p.contents=false;
			p.standingon=false;
			if (!(p.type in fakeObjects))
			{
				var ns = this.getsquare(p.x,p.y);
				if (ns>=0)
				{
					var on = this.L[ns][1];
					p.contents = on;
					if (on)
						on.standingon=p;
					this.L[ns][1]=p;
				}
				p.square=ns;
			}
			p.numfish=0;
			p.bounce=0; // Note must init variables or undo will go funny!
		}
		// Capture the initial snapshot
		this.backup=-1;
		this.snapshot();
		this.advanceSnapshot();
	}
	Level.prototype.save = function(redirect)
	{
		// First go through and compute extent of the level
		var maxx=0;
		var maxy=0;
		var minx=1000;
		var miny=1000;
		for(var y=0;y<this.h;y++)
		{
			for(var x=0;x<this.w;x++)
			{
				if (this.L[x*this.grid+y][0]!=BSEA)
				{
					maxy=Math.max(maxy,y);
					maxx=Math.max(maxx,x);
					miny=Math.min(miny,y);
					minx=Math.min(minx,x);
				}
			}
		}
		var X = [];
		for(var x=minx;x<=maxx;x++)	
		{
			var A=[];
			for(var y=miny;y<=maxy;y++)
			{
				var s = this.L[x*this.grid+y];
				A.push([s[0],-1,s[2],s[3],s[4]]);
			}
			X.push(A);
		}
		var P = [];
		for(var i=0;i<this.P.length;i++)
		{
			var p = this.P[i];
			var p2={};
			if (p.type==NONE) continue;
			p2.x=p.x-this.sz*minx;
			p2.y=p.y-this.sz*miny;
			p2.dx=p.dx;
			p2.dy=p.dy;
			p2.vy=p.vy;
			p2.vx=p.vx;
			if (p.type==CAMERA)
			{
				p2.dx-=minx*this.sz;
				p2.vx-=minx*this.sz;
				p2.dy-=miny*this.sz;
				p2.vy-=miny*this.sz;
			}
			p2.thetaf=p.thetaf;
			p2.speed=p.speed;
			p2.type=p.type;
			p2.state=p.state;
			p2.steps=p.steps;
			p2.numfish=p.numfish;
			p2.d=p.d;
			p2.size=p.size;
			P.push(p2);
		}
		if (redirect)
		{
			//window.location = "penguins.html?data="+encodeURIComponent(JSON.stringify([X,P]));
			window.location = "penguins.html#"+encodeURIComponent(JSON.stringify([X,P]));
		}
		else
		{
			document.getElementById("output").innerHTML="Level="+this.levnum+"<br>"+JSON.stringify([X,P]);	
		}
	}
	Level.prototype.load = function() 
	{
		var request = new XMLHttpRequest();
		this.loaded=false;
		request.level = this;
		var levname=path_local+"lev"+this.levnum+".json";
		request.open("GET", levname);
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				request.level.handleLoadedLevel(JSON.parse(request.responseText));
			}
		}
		request.send();
		this.mode=0;
		this.delay=20; // Don't allow any keypresses for a while
		this.clearSnapshots();
	}
	
	
	
	var moveable = {};
	moveable[PENG]=true;
	moveable[BABYPENG]=true;
	moveable[CHEST]=true;
	moveable[BOMB]=true;
	moveable[FISHPAIL]=true;
	var fixed ={};
	fixed[TREE]=true;
	fixed[OGUN]=true;
	fixed[OLASER]=true;
	var fakeObjects = {};
	fakeObjects[CAMERA] = true;
	fakeObjects[NONE] = true;
	var objectHeights={};
	objectHeights[PENG]=1.0;
	objectHeights[BABYPENG]=0.5;
	objectHeights[CHEST]=1.0;
	objectHeights[TREE]=2.0;
	// TODO should probably include fishpail here!
	
	Level.prototype.getsquare = function(x,y) {
		var nx = Math.floor(x/this.sz);
        var ny = Math.floor(y/this.sz);
        w=this.w;
        h=this.h;
        if (0<=nx && nx<w && 0<=ny && ny<h)
			return nx*this.grid+ny;
        return -1;
	}
	Level.prototype.deleteObject = function(p) {
		if (!p) return;
		if (p.state==PUZZLER)
			this.switchpengs();
		this.remove(p);
		if (p==heropeng)
		{
			this.mode=2;
			this.delay=10;
			p.bounce=0;
			keyPressed=false;
			return; // don't actually delete the penguin so we can still see it in the water...
		}
		p.type=NONE;  // Splice is less good as would change order of elements
	}
	// Take an object away from its square
	Level.prototype.remove = function(p) {	
		if (p.standingon)
		{
			p.standingon.contents=p.contents; // Drop anything above us down one
		}
		else if (p.square>=0)
		{
			this.L[p.square][1]=p.contents;  // Remove pointer if we are at the base of the list
		}
		if (p.contents)
		{
			p.contents.standingon=null;
		}
		p.contents=null;
		p.standingon=null;
	}
	var BOUNCETIME = 10;
	Level.prototype.trymove = function(p,push) {
	    //If push is true then it means there is a penguin pushing this (rather than just a collision)
        //Try to push an object in its currently set up vx,vy direction.
        //If it cannot move p.steps will be cleared and we return false
        //otherwise changes square to next location
		// Also sets bounce so that we can show some movement (probably by forward rotation)
		var ns = this.getsquare(p.x+p.vx*p.steps,p.y+p.vy*p.steps);
		// We transfer our momentum if we have a moving object
		if (ns>=0)
		{
			// First lets look to see if the wall is too high to slide over
			// Or if we have insufficient potential to get to our edge
			var newh = this.squareHeight(ns,      0.5+p.vx*p.steps*-0.5/this.sz,0.5+p.vy*p.steps*-0.5/this.sz);
			var oldh = this.squareHeight(p.square,0.5+p.vx*p.steps*0.5/this.sz ,0.5+p.vy*p.steps*0.5/this.sz)+this.stackHeight(p);
			if (newh>oldh+this.sz*0.3 || oldh>p.potential+5)
			{
				p.thetaf+=p.vturn*p.steps;
				p.potential=this.calcPotential(p);
				p.steps=0;
				p.bounce=BOUNCETIME;
				return false;
			}
			// Now lets look to see if we need to push a penguin
			
			// In the new scheme we never run out of momentum until we reach half height
			// Check for this when looking to see if we continue moving!
			var sqh = this.squareHeight(ns,      0.5,0.5);
			var lastobj=null;
			for(var hit = this.L[ns][1];hit;hit=hit.contents)
			{
				var objh = objectHeights[hit.type]*this.sz;
				sqh+=objh;
				if (oldh>(sqh-5))
				{
					// We are going to move above this object, so don't collide
					lastobj=hit;
					continue;
				}
				if (hit.type in fixed)
				{
					p.thetaf+=p.vturn*p.steps;
					p.potential=this.calcPotential(p);
					p.steps=0;
					p.bounce=BOUNCETIME;
					return false;
				}
				else if (p.type==PENG && hit.type == FISHPAIL)
				{
					p.numfish++;
					PlaySound('woohoo');
					this.deleteObject(hit);
					break;
				}
				else if (p.type==BABYPENG && hit.type == FISHPAIL)
				{
					PlaySound('woohoo');
					this.deleteObject(hit);
					if (p.state==BOPPING)
					{
						p.state = FED;
						while(p.state==FED)
							this.switchpengs();
					}
					else
						p.numfish++;
				}
				else if (p.type==PENG && p.numfish>0 && hit.type == BABYPENG && hit.state==BOPPING)
				{
					p.numfish--;
					PlaySound('woohoo');
					p.thetaf+=p.vturn*p.steps;
					p.steps=0;
					p.state=FED;
					p.potential=this.calcPotential(p);
					hit.state=PUZZLER;
					hit.bounce=BOUNCETIME; // Prevents an update on this cycle
					hit.steps=0;
					return false;
				}
				// TODO feed babypeng
				else if (hit.type in moveable)
				{
					// Warning, this may not check for certain actions!
					hit.x+=hit.vx*hit.steps;
					hit.y+=hit.vy*hit.steps;
					hit.thetaf+=hit.vturn*hit.steps;
					hit.vx=p.vx;
					hit.vy=p.vy;
					hit.steps=p.steps;
					hit.speed=p.speed;
					hit.vturn=0;
					hit.thetaf=p.thetaf+p.vturn*p.steps;
					// When transferring momentum take account of the difference in height (allows us to push uphill)
					hit.potential=this.calcPotential(hit)+p.potential-this.calcPotential(p);
					if (!this.trymove(hit,push)) // Blocked
					{
						p.thetaf+=p.vturn*p.steps;
						p.bounce=BOUNCETIME;
						p.steps=0;
						p.potential=this.calcPotential(p);
						return false;
					}
					this.movepenguin(hit,1);
					if (!push) // If sliding then we transfer our momentum instead.
					{
						p.thetaf+=p.vturn*p.steps;
						p.bounce=BOUNCETIME;
						p.steps=0;
						p.potential=this.calcPotential(p);
						return false;
					}
				}
				else
				{
					alert("Unknown type "+hit.type);
				}
			}
		}
		// May want to check here what we have landed on!
		
		// This is the only place that squares change
		// May be easier to maintain a doubly linked list.
		this.remove(p);
		// Place us into the new square at appropriate location
		// Should not be possible for there to be something above lastobj or we would collide with it!
        p.square=ns;
		if (lastobj)
		{
			lastobj.contents=p;
			p.standingon=lastobj;
		}
		else
		{
			this.L[p.square][1]=p;
			p.standingon=null;
		}
		return true;
	}
    var ICESPEED=3;    
	Level.prototype.movepenguin = function(p,checkice) {
		if (!checkice)
		{
			var checkice = true;
		}
		var sz = this.sz;
		this.L[-1]=[BSEA,-1,0,0,0];
		var res = this.L[p.square];
        var b=res[0];
		var c=res[1];
		var h=res[2];
		var vx=res[3];
		var vy=res[4]; 
        if (p.steps<=0)
		{
            // Just check for ice below us in case we need to be made to slide off in a new direction
			if (b.standingon)  // TODO this line looks odd?, perhaps should be p instead of b?
			{
				return;
			}
            if (b!=BICE)
			{
				return;
			}
            vx=mysign(vx);
            vy=mysign(vy);
            if (vx==0 && vy==0) return;
            p.speed = ICESPEED;
            p.vx = -p.speed*vx;
            p.vy = -p.speed*vy; 
            p.vturn=0;
			p.potential=this.calcPotential(p);
		}
        else
		{
            // Take a step
            p.x += p.vx;
            p.y += p.vy;
            p.thetaf += p.vturn;
            p.steps -= 1;
            // TODO Ski jumping...
		}
        if  (p.steps>0) return;
        // Place into rounded location
        p.x = sz*Math.floor(p.x/sz)+sz*0.5;
        p.y = sz*Math.floor(p.y/sz)+sz*0.5;
        // Round angle to 90 degrees
        p.thetaf = ((4.5+p.thetaf/90)&3)*90;
        // Now should look at what we have landed on
		if (p.type==PENG && b==BCRACKED)  // This applies even if the PENG is on top!
		{
			b=this.crackice(p.square);
			//this.mode=2;
			//this.delay=10;
			//keyPressed=false;
			PlaySound('boom');
		}
		var onice=false;
		if (p.standingon)
		{
			if (p.standingon.type==CHEST)
				onice = true;
		}
		else
		{
			if (b==BICE)
				onice = true;
		}
        if (onice && (p.vx || p.vy))
		{
            // Look to see if the slope is too steep for us (this may want to give us a chance to step off!)
			// Giving a little margin to prevent early stops should ensure we can get back up to our starting height
			if ((this.squareHeight(p.square,mysign(p.vx)*0.5+0.5,mysign(p.vy)*0.5+0.5)+this.stackHeight(p))>(p.potential+5))
			{
				p.vx=p.vy=p.vturn=0;
			}
			else
			{
				p.steps = Math.floor(sz/p.speed);
				if (this.trymove(p,0))
				{
					if (p.type==BABYPENG)
					{
						// Spinning
						PlaySound('wheee');
					}
					else if (p.vturn)
					{
						PlaySound('whooo');
					}
				}
			}
		}
		else if (p==heropeng && b==BEXIT)
		{
			this.mode=1;
			this.delay=10;
			keyPressed=false;
			CompleteLevel(this.levnum);
			this.levnum++;
			PlaySound('audio1',true);
			this.clearSnapshots();
		}
		else if ((p.type==PENG || p.type==BABYPENG) && b==BSEA)
		{
			PlaySound('splosh',true);
			this.deleteObject(p);
		}
		else if (p.type==CHEST && b==BSEA)
		{
			PlaySound('splosh',true);
		}
		else if (p.type==CHEST && b==BCRACKED)
		{
			this.crackice(p.square);
			PlaySound('boom',true);
		}
		else if (b==BFRAGILE)
		{
			this.L[p.square][0]=BCRACKED;
			this.makeModel();
			PlaySound('shot',true);
		}
	}
	// Make this square have the height of the smallest corner
	Level.prototype.flatten = function(sq)
	{
		// 3,4 are dx,dy
		var a=this.L[sq];
		a[2]+=Math.min(0,a[3]);
		a[2]+=Math.min(0,a[4]);
		a[3]=0;
		a[4]=0;
	}
	// Crack the ice and return the new block type
	Level.prototype.crackice = function(sq)
	{
		this.crackice_r(sq);
		this.makeModel();
		return this.L[sq][0];
	}
	Level.prototype.crackice_r = function(sq)
	{
		if (sq<=0) return;
		if (!(sq in this.L)) return;
		var b = this.L[sq][0];
		if (b!=BCRACKED && b!=BFRAGILE) return;
		this.flatten(sq);
		this.L[sq][2]-=1.0;
		this.L[sq][0]=BICE;
		var p = this.newpenguin(sq,FRAGMENT,true);
		p.d=this.L[sq][2]*this.sz;
		if (this.L[sq][2]<-0.1)
		{
			this.L[sq][0]=BSEA;
			while(1)
			{
				var p = this.L[sq][1];
				if (!p) break;
				if (p.type==CHEST) break; // This floats!
				PlaySound("splosh",true);
				this.deleteObject(p);
			}
		}
		this.crackice_r(sq-this.grid);
		this.crackice_r(sq+this.grid);
		this.crackice_r(sq+1);
		this.crackice_r(sq-1);
	}
	Level.prototype.switchpengs = function()
	{
		var found=false;
		for(var r=0;r<2;r++)
		for(var i=0;i<this.P.length;i++)
		{
			var p = this.P[i];
			if (p.type==NONE) continue;
			if (p.state==PUZZLER)
			{
				found=true;
				p.state=FED;
			}
			else if (p.state==FED && found)
			{
				p.state=PUZZLER;
				p.bounce=10;
				return;
			}
		}
	}
	
	function clearKeys(){
		var keys=[KEY_LEFT,KEY_RIGHT,KEY_UP,KEY_DOWN,KEY_SPACE];
		for (var j=0;j<keys.length;j++)
			currentlyPressedKeys[keys[j]]=false;
	}
	
    var KEY_Q = 81;      
    var KEY_U = 85;      
    var KEY_R = 82;  
	var KEY_Z = 90;
	var KEY_BACKSPACE = 8;	
	var KEY_SPACE = 32;	
    var KEY_LEFT = 37;      
    var KEY_UP = 38;      
    var KEY_RIGHT = 39;      
    var KEY_DOWN = 40;  
    var KEY_ESCAPE = 27;    
    Level.prototype.update = function() {
	    if (!this.loaded) return;
		var takeSnapshot=false;
		var left = currentlyPressedKeys[KEY_LEFT];
		var right = currentlyPressedKeys[KEY_RIGHT];
		var up = currentlyPressedKeys[KEY_UP];
		var down = currentlyPressedKeys[KEY_DOWN];
		var space = currentlyPressedKeys[KEY_SPACE];
		var backspace = currentlyPressedKeys[KEY_BACKSPACE] || currentlyPressedKeys[KEY_U];
		if (this.delay>0)
		{
			this.delay--;
			left = up = right = down = 0;
		}
		if (sounddelay>0)
		{
			sounddelay--;
		}
		if (currentlyPressedKeys[KEY_ESCAPE])
		{
			window.location="http://penguinspuzzle.appspot.com";
			return;
		}
		
		if (currentlyPressedKeys[KEY_R])
		{
			this.load();
			return;
		}				
		if (this.delay==0 && level.mode>0)
		{
			// Just spin around heropeng!
			if (!keyPressed)
				return;
			if (this.mode==1)
			{
				this.load();
				this.delay=10;
				clearKeys();
			}
			else if (this.mode==2)
			{
				// Go into rewind mode if press left or right, or start from beginning if press up/down
				if (up || down)
				{
					var b=this.backup;
					this.backup=-1;
					this.undo();
					clearKeys();
					this.backup=b; // Restore backup so even if we restart we can still undo
					this.mode=0;
					this.delay=10;
				}
				else if (left || right)
				{
					this.retreatSnapshot();
					this.undo();
					level.mode=3;
					this.delay=10;
				}
				else if (backspace)
				{
					currentlyPressedKeys[KEY_BACKSPACE]=false;
					currentlyPressedKeys[KEY_U]=false;
					this.retreatSnapshot();
					this.undo();
					this.mode=0;
				}
				else if (currentlyPressedKeys[KEY_R])
				{
					currentlyPressedKeys[KEY_R]=false;
					this.load();
					this.mode=0;
				}
			}
			else if (level.mode==3)
			{
				// Go into rewind mode if press left or right, or start if press up/down
				if (up || down || space)
				{
					level.mode=0;
					this.delay=10;
					clearKeys();
				}
				else if (left || right || backspace)
				{
					if (right)
					{
						if (!this.advanceSnapshot())
							this.retreatSnapshot()
					}
					else
					{
						if (!this.retreatSnapshot())
							this.advanceSnapshot();
					}
					this.undo();
					this.delay=10;
				}
			}
			return;
		}
		
        if (backspace)
		{
			currentlyPressedKeys[KEY_BACKSPACE]=false;
			currentlyPressedKeys[KEY_U]=false;
			this.retreatSnapshot();
			this.undo();
			return;
		}
		if (level.mode>0)
			return;
		// Take a copy of the level and the penguins
        for(var i=0;i<this.P.length;i++)
		{	
			var p = this.P[i];
			if (p.bounce>0)
				p.bounce--;
            if ((p.type==PENG || p.type==BABYPENG) && p.state==PUZZLER && p.steps==0 && !(p.bounce>0))
			{
				var useAbsoluteKeys = true;
				var turnAndMove = true;
				// To prevent autorepeat, eat directional keypresses at this stage
				clearKeys();
				if (space)
				{
					this.switchpengs();
				}
				if (useAbsoluteKeys && (up || down || right || left))
				{
					this.snapshot();
					this.advanceSnapshot(); // May have slight problem with blocks not rewinding eactly unless heropeng is first in list?
					
					var target=0; // Target angle
					var allowReverse = true;
					if (up)
						target=0;
					else if (down)
						target=180;
					else if (left)
						target=270;
					else if (right)
						target=90;
					var up_target=view.findUp();
					target=(target+up_target)%360;
					left = up = right = down = 0;
					var d=target-p.thetaf;
					if (d<=-179) d+=360;
					if (d>=179) d-=360;
					if (Math.abs(d)<1)
					{
						up=true;
					}
					else if (allowReverse && Math.abs(d+180)<1)
					{
						down=true;
					}
					else if (d<0)
					{
						left=true;
					}
					else
					{
						right=true;
					}
					if (turnAndMove)
					{
						p.vx=p.speed*Math.sin(target*3.1415/180.0);
						p.vy=-p.speed*Math.cos(target*3.1415/180.0);
						p.vturn=0;
						p.steps=Math.floor(this.sz/p.speed);
						if (down)
							p.vturn = 180;
						if (left)
							p.vturn = -90;
						if (right) 
							p.vturn = 90;
						p.vturn /= p.steps;
						p.potential = this.calcPotential(p); 
						var x=this.L[p.square]
						if (!(x[0]==BICE && (x[3]!=0 || x[4]!=0)))
						{
							p.potential+=10; // Enough to get up half slope, but don't give any extra if on a slopy ice
						}
						this.trymove(p,false);
					}
				}
				if (!turnAndMove)
				{
					if (left || right)
					{
						p.vx=0;
						p.vy=0;
						p.vturn=-9;
						if (right) 
							p.vturn=9;
						p.steps=10;
					}
					else if ( up || down)
					{
						var sgn = 1;
						if (down) sgn = -1;
						p.vx=sgn*p.speed*Math.sin(p.thetaf*3.1415/180.0);
						p.vy=-sgn*p.speed*Math.cos(p.thetaf*3.1415/180.0);
						p.vturn=0;
						p.steps=Math.floor(this.sz/p.speed);
						p.potential = this.calcPotential(p)+10; // Enough to get up a half height slope
						this.trymove(p,false);
					}
				}
				this.movepenguin(p);
			}
            else if (p.type in moveable)
			{
                this.movepenguin(p);
			}
			else if (p.type==FRAGMENT)
			{
				p.steps++;
				if (p.steps>202)
					this.deleteObject(p);
			}
		}
	}
	Level.prototype.newpenguin = function(sq,t,skip_place)
	{
		var y = sq%this.grid;
		var x = Math.floor(sq/this.grid);
        p={}
		p.x=(x+0.5)*this.sz;
		p.y=(y+0.5)*this.sz;
		p.thetaf=0;
		p.d=4.0;  
		p.size=8.0;
		p.state=BOPPING;
		p.type=t;
		p.speed=ICESPEED;
		p.steps=0;
		p.numfish=0;
		p.bounce=0;
		p.dx=0
		p.dy=0;
		p.vx=0;
		p.vy=0;
		p.tol=0;
		p.thetah=0;
		p.thetac=0;
		p.lastz=0;
		p.vturn=0;
		if (sq>=0 && !skip_place)
		{
			p.square=sq;
			var on=this.L[p.square][1];
			if (on)
			{
				while(on.contents)
					on=on.contents;
				p.standingon=on;
				on.contents=p;
			}
			else
			{
				this.L[p.square][1]=p;
			}
		}
		else
		{
			p.square=-1;
		}
		p.standingon=null;
		p.iden=0;
		p.team=0;
		this.P.push(p);
		//alert("Added to "+sq+"="+x+","+y);
		return p;
	}
	
	// Find the closest camera
	Level.prototype.updateView = function()
	{
		//view.lookAt([0,0,0],[lastMouseX,-200,lastMouseY]);
		//return;
		var bestdist = 100000000;
		if (!this.loaded) return;
		if (this.mode>0 && this.mode<=2)
		{
			var H=this.groundpt(heropeng);
			var s = 0.003;
			if (this.mode==2)
				s=0.0003;
			var a = 100;
			var dx=a*Math.cos(lastTime*s);
			var dy=a*Math.sin(lastTime*s);
			view.lookAt(H,[H[0]+dx,H[1]+dy,H[2]+50]);
			return;
		}
		for(var i=0;i<this.P.length;i++)
		{
			var p=this.P[i];
			if (p.type!=CAMERA) continue;
			var dx=p.x-heropeng.x;
			var dy=p.y-heropeng.y;
            var camdist=dx*dx+dy*dy;
            if (camdist>bestdist) continue;
            cam=p;
            bestdist=camdist;
		}
		if (!cam)
		{
			view.lookAt([0,0,0],[0,-200,100]);
			return;
		}
		target=[cam.dx,cam.dy,cam.d];
        view.lookAt(target,[cam.vx,cam.vy,cam.size],false,true);
	}
	
	function vec_movetowards(old_at,at,speed) {
		var d = vec_sub(at,old_at);
		var dist = Math.sqrt(vec_dot(d,d))+0.001;
		var move = Math.min(dist,speed);
		return vec_add(old_at,vec_scale(d,move/dist));
	}
	function View()
	{
		this.changed = true;
		this.old_at=[0,0,0];
		this.old_eye=[100,100,100];
	}
	var zoom_out=false;
	View.prototype.lookAt=function(at,eye,ortho,adapt)
	{
		//if (at==this.old_at && eye==this.old_eye)  // Doesn't test as true anyway
		//	return;
		if (adapt)
		{
			if (zoom_out)
			{
				eye = vec_add(at,vec_scale(vec_sub(eye,at),1.5));
			}
			at = vec_movetowards(this.old_at,at,5.0);
			eye = vec_movetowards(this.old_eye,eye,5.0);
		}
		this.L = LookAtMatrix(at,eye,0);
		this.P = ProjectionMatrix(ortho);
		this.M = mat_mult(this.L,this.P);
        this.L_reflect = LookAtMatrix(at,eye,1);
        this.M_reflect = mat_mult(this.L_reflect,this.P);
		this.changed=true;
		this.old_at = at;
		this.old_eye = eye;
	}
	// Returns the angle 0,90,180,270 that most moves the penguin up the screen
	View.prototype.findUp = function()
	{
		var pt = [heropeng.x,heropeng.y,0,1];
		var a = vec_mult(pt,this.M);
		var oldscreeny = 0;
		var best = 0;
		for(var target=0;target<360;target+=90)
		{
			var dx=40*Math.sin(target*3.1415/180.0);
			var dy=-40*Math.cos(target*3.1415/180.0);			
			var pt2 = [heropeng.x+dx,heropeng.y+dy,0,1];
			var b = vec_mult(pt2,this.M);
			var screeny = b[1]/b[3];
			if (target==0 || screeny>oldscreeny)
			{
				oldscreeny=screeny;
				best=target;
			}
		}
		return best;
	}
	View.prototype.findSquare = function(mx,my)
	{
		mx/=gl.viewportWidth;
		my/=gl.viewportHeight;
		mx=mx*2-1;
		my=my*2-1;
		my*=-1;
		// Returns address of square in the level closest to these coordinates
		var bestsq=0;
		var bestd=-1;
		var bestx=0;
		var besty=0;
		for(var y=0;y<level.h;y++)
		for(var x=0;x<level.w;x++)
		{
			var pt = level.pt(x,y,0.5,0.5);
			pt[2]=0; // Always aim at the ground level
			pt.push(1);
			var b = vec_mult(pt,this.M);
			var screenx = b[0]/b[3];
			var screeny = b[1]/b[3];
			var dx=screenx-mx;
			var dy=screeny-my;
			var d=dx*dx+dy*dy;
			if (bestd<0 || d<bestd)
			{
				bestd=d;
				bestsq=x*level.grid+y;
				bestx=x;
				besty=y;
			}
		}
		return [bestsq,bestx,besty];
	}
	
	function World()
	{
	}
	World.prototype.identity=function()
	{
		this.V = [ [1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
	}
	World.prototype.translate=function(pt)
	{
		A=[]
		for(var i=0;i<4;i++)
		{
			var t=this.V[3][i];
			for(var j=0;j<3;j++)
				t+=pt[j]*this.V[j][i];
			A.push(t);
		}
		this.V = [this.V[0],this.V[1],this.V[2],A];
	}
	// Rotate around z axis
	World.prototype.rotate=function(angle)
	{
		var c=Math.cos(angle*3.1415/180.0);
        var s=Math.sin(angle*3.1415/180.0);
        var M=[[c,s,0,0],[-s,c,0,0],[0,0,1,0],[0,0,0,1]];
        this.V=mat_mult(M,this.V);
	}
	// Rotate around x axis
	World.prototype.rotatex=function(angle)
	{
		var c=Math.cos(angle*3.1415/180.0);
        var s=Math.sin(angle*3.1415/180.0);
        var M=[[1,0,0,0],[0,c,s,0],[0,-s,c,0],[0,0,0,1]];
        this.V=mat_mult(M,this.V);
	}
	
	function billboardMatrix() {
    //Define a matrix that copies x,y and sets z to 0.9
		return [ [1.0,0.0,0.0,0.0],[0.0,1.0,0.0,0.0],[0.0,0.0,0.0,0.0],[0.0,0.0,0.9,1.0]];
	}
	function check_window_size() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		gl.canvas.width = w;
		gl.viewportWidth = w;
		gl.canvas.height = h;
        gl.viewportHeight = h;
		gl.canvas.style.position = "fixed";
		//gl.canvas.setAttribute("width", canvasWidth);
		//gl.canvas.setAttribute("height", canvasHeight);
		//gl.canvas.style.top = (viewportHeight - canvasHeight) / 2;
		//gl.canvas.style.left = (viewportWidth - canvasWidth) / 2;

	}
	var frame=0;
	var high_quality=true;
	function drawScene() {
		check_window_size();
	    var redraw = view.changed;
		var skyMoving = true;
		if (!editor) frame++;
		
		//sun_view.M=view.M;
		if (currentlyPressedKeys[KEY_Q])
		{
			high_quality = !high_quality;
			currentlyPressedKeys[KEY_Q] = false
			//view.M = sun_view.M;
		}
		if (currentlyPressedKeys[KEY_Z])
		{
			zoom_out = !zoom_out;
			currentlyPressedKeys[KEY_Z] = false
			//view.M = sun_view.M;
		}
		if (high_quality)
		{
			gl.colorMask(true,true,true,true);
			shadow_fb.select();
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			world.identity();
			sun_shader.select();
			sun_shader.selectView(sun_view.M);
			sun_shader.selectWorld(world.V);
			level.drawTiles(sun_shader);
			level.drawObjects(sun_shader,sun_view);
			level.drawObjects(sun_shader,sun_view,true);
			gl.finish();
		}
		
		var br=288;
		gl.clearColor(129/br, 168/br, 207/br, 1.0);
		if (high_quality)
		{
			mirror_fb.select();
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			//shader.selectView(billboardMatrix());
			//sky.draw(shader);
			world.identity();
			shader.select(frame*0.0001);
			shader.selectView(view.M_reflect);
			shader.selectWorld(world.V);
			sky.draw(shader);
			shader.select();
			level.drawObjects(shader,view);
			level.drawObjects(shader,view,true);
			world.identity();
			shader.selectWorld(world.V);
			level.drawTiles(shader);
			gl.finish();
		}
		
		
		gl.bindFramebuffer(gl.FRAMEBUFFER,null);
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        if (level.mode==3)
		{
			gl.clearColor(0, 129, 0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.colorMask(false,true,false,true);
		}
		else	
		{
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.colorMask(true,true,true,true);
		}
		shadow_fb.selectTexture();
		world.identity();
		var level_shader=shader;
		if (high_quality)
			level_shader = shadow_shader;
		level_shader.select();
		level_shader.selectView(view.M,sun_view.M);
		level_shader.selectWorld(world.V);
		level.drawTiles(level_shader);
		shader.select(frame*0.0001);
		shader.selectView(view.M);
		shader.selectWorld(world.V);
		sky.draw(shader);
		shader.select();
		level.drawObjects(shader,view);
		var slow=0.4;   
		mirror_fb.selectTexture();
		world.identity();
		if (high_quality)
		{
			water_shader.select(frame*0.001*slow,frame*0.002*slow,-frame*0.0017*slow,-frame*0.003*slow)
			water_shader.selectView(view.M,view.M_reflect);     
			shader.selectWorld(world.V);  // shouldn't this be water_shader?
			sea.draw(water_shader); 
		}
		// Now draw transparent objects
		shader.select();
		shader.selectView(view.M);
		if (high_quality)
		{
			gl.depthMask(false);
			gl.blendEquation(gl.FUNC_ADD);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE,gl.ONE_MINUS_CONSTANT_ALPHA);
			gl.blendColor(0,0,0,0.7);
		}
		level.drawObjects(shader,view,true);
		
		if (high_quality)
		{
			//gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
			gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
			expl_shader.select();
			expl_shader.selectView(view.M);
			level.drawFragments(expl_shader);
			//world.identity();
			//world.translate(level.groundpt(heropeng));
			//expl_shader.selectWorld(world.V);
			//expl.draw(expl_shader);
		}
		gl.disable(gl.BLEND);
		gl.depthMask(true);
		
		//shader.select();
		//shader.selectView(billboardMatrix());
		//sky.draw(shader);  // I don't understand why this doesn't stick the sky in the background?
			
		gl.finish();
		if (redraw)
		{
			view.changed = false;
		}
    }
	
	var cam = null;
	var heropeng;
	
	function tick() {
		requestAnimFrame(tick);
		level.updateView();
		level.update();
		if (!high_quality)
			level.update();
		drawScene();
		animate();
	  }
  
	var lastTime = 0;
	function animate() {
		var timeNow = new Date().getTime();
		if (lastTime != 0) {
		  var elapsed = timeNow - lastTime;
		}
		lastTime = timeNow;
	}
	
	var currentlyPressedKeys = {};  // Remove keys from here to avoid repeated presses
	var currentlyDownKeys = {};
	var keyPressed = false;
	function handleKeyDown(event) {
		var key= (event || window.event).keyCode;
		if (key in currentlyDownKeys && currentlyDownKeys[key]==true)
			return;
		currentlyDownKeys[event.keyCode] = true;
		currentlyPressedKeys[event.keyCode] = true;
		keyPressed=true;
		var c = String.fromCharCode(event.keyCode);
			
		if (currentlyDownKeys[17]&&currentlyDownKeys[89])
		{
			editor = !editor;
			return;
		}
		
		if (editor)
		{
			var res = view.findSquare(lastMouseX,lastMouseY);
			var s=res[0];
			var bx=res[1];
			var by=res[2]; 
			var sq = level.L[s];
			var p;
			switch(c)
			{
			case "N":
				document.getElementById("output").innerHTML="";
				level.levnum+=1;
				level.load();
				return;
			case "J":
				document.getElementById("output").innerHTML="";
				level.levnum+=10;
				level.load();
				return;
			case "M":
				document.getElementById("output").innerHTML="";
				level.levnum-=1;
				level.load();
				return;
			case "S":
				sq[0]=BSNOW;
				level.makeModel();
				return;
			case "O":
				sq[0]=BSEA;
				level.makeModel();
				return;
			case "E":
				sq[0]=BEXIT;
				level.makeModel();
				return;
			case "I":
				sq[0]=BICE;
				level.makeModel();
				return;
			case "C":
				sq[0]=BCRACKED;
				level.makeModel();
				return;
			case "V":
				sq[0]=BFRAGILE;
				level.makeModel();
				return;
			case "B":
				level.newpenguin(s,CHEST);
				return;
			case "P":
				p=level.newpenguin(s,BABYPENG);
				return;
			case "T":
				p=level.newpenguin(s,TREE);
				return;
			case "F":
				p=level.newpenguin(s,FISHPAIL);
				return;
			case "Q":
				level.deleteObject(sq[1]);
				return;
			case "W":
				level.save(0);
				return;
			case "X":
				level.save(1);
				return;
			
			case "A":
			case "R":
				return;
			}
			switch(event.keyCode)
			{
			case 106: //*
				level.deleteObject(cam);
				return;
			case 107: //+
				sq[2]+=0.5;
				break
			case 109: //-
				sq[2]=Math.max(0,sq[2]-0.5);
				break;
			case 219: //[
				sq[3]+=0.5;
				if (sq[3]>0.5) sq[3]=-0.5;
				sq[4]=0;
				break;
			case 221: //]
				sq[4]+=0.5;
				if (sq[4]>0.5) sq[4]=-0.5;
				sq[3]=0;
				break;
			case 104:
				cam.vy+=10;
				//target=[cam.dx,cam.dy,cam.d];
				//view.lookAt(target,[cam.vx,cam.vy,cam.size],false,true);
				return;
			case 98:
				cam.vy-=10;
				return;
			case 100:
				cam.vx-=10;
				return;
			case 102:
				cam.vx+=10;
				return;
			case 105:
				cam.size+=10;
				return;
			case 99:
				cam.size-=10;
				return;
			case 101:
				cam.dx=bx*level.sz;
				cam.dy=by*level.sz;
				cam.d=0;
				return;
			case KEY_LEFT:
			case KEY_RIGHT:
			case KEY_UP:
			case KEY_DOWN:
			case KEY_SPACE:
			case KEY_BACKSPACE:
			case 116: // F5
			case 17: // ctrl
				break;
			case 76: //L
				{
					var newlev=prompt("Paste in a level description in Json format","");
					level.handleLoadedLevel(JSON.parse(newlev));
					request.send();
					level.mode=0;
					level.delay=20; // Don't allow any keypresses for a while
					level.clearSnapshots();
					break;
				}
			default:
				alert("Key="+event.keyCode);
			}
			level.makeModel();
		}
		
	}
	function handleKeyUp(event) {
		currentlyPressedKeys[event.keyCode] = false;
		currentlyDownKeys[event.keyCode] = false;
	}
	
	function getLevnum()
	{
	  var regexS = "[\\?&]lev=([0-9]*)";
	  var regex = new RegExp(regexS);
	  var results = regex.exec(window.location.search);
	  if(results == null)
		return 0;
	  var r = parseInt(results[1]);
	  if (r==NaN)
		return 0;
	  return r;
	}
	
	function getLevdata2()
	{
		var regexS = "[\\?&]data=(.*)";
	    var regex = new RegExp(regexS);
	    var results = regex.exec(window.location.search);
	    if(results == null)
			return 0;
		level.handleLoadedLevel(JSON.parse(decodeURIComponent(results[1])));
		return 1;
	}
	
	function getLevdata()
	{
		var a = location.hash;
		if (!a) return 0;
		if (a==null) return 0;
		if (a.length<10) return 0;
		level.handleLoadedLevel(JSON.parse(decodeURIComponent(a.substring(1))));
		return 1;
	}
	
	function webGLStart() {
        var canvas = document.getElementById("mycanvas");
        initGL(canvas);
		gl.frontFace(gl.CW)
		gl.cullFace(gl.BACK)
		gl.enable(gl.CULL_FACE)
		gl.enable(gl.DEPTH_TEST)
		gl.depthRange(-1.0,1.0);
		gl.clearDepth(1.0);
		mirror_fb = new Framebuffer(1024,1024,true);
		shadow_fb = new Framebuffer(1024,1024,true); 
        shader = new Shader('');
        expl_shader = new Shader('expl');
        shadow_shader = new Shader('shadow');
        sun_shader = new Shader('sun');
        water_shader = new Shader('water');
        var tm = new Texture(path_local+'texmain9.bmp');
        var ts = new Texture(path_local+'texsecond8.bmp');
		var tw = new Texture(path_local+'water.jpg');
		var tc = new Texture(path_local+'clouds.jpg');
		level = new Level(tm);
		level.levnum = getLevnum();
		if (getLevdata())
		{
			level.mode=0;
			level.delay=20;
			level.clearSnapshots();
		}
		else
		{
			level.load();
		}
		new Model(path+'iceblock.json',tm,CHEST,0.75);
		new Model(path+'tree.json',tm,TREE);
		new Model(path+'mainpeng.json',ts,PENG,0.75);
		new Model(path+'babypeng.json',ts,BABYPENG);
		new Model(path+'bucket.json',tm,FISHPAIL);
		expl = new Explosion(ts);
		//water = new FlatQuad(tw,3000.0,-20.0,15.0);
		sea = new Sea(tw,1500.0,-20.0,15.0);
		//sky = new FlatQuad(tc,2.0,0.0,1.0);
		sky = new Sky(tc,1500.0,-20.0,2.0);
		document.onmousemove = handleMouseMove;
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;
		view.lookAt([0,0,0],[0,-100,50]);
		sun_view.lookAt([300+240,300+240,0],[300+30+240,300-20+240,40],1);
        //sun_view.lookAt([0,0,0],[400,0,0],1);
        tick();
    }

	var sounddelay=0;
	function PlaySound(soundobj,ignore_delay) {
	  var thissound=document.getElementById(soundobj);
	  if (sounddelay>0 && !ignore_delay) return;
	  sounddelay=30;
	  thissound.play();
	}

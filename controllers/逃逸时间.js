"use strict";
//逃逸时间
var timeXd = -2,
	timeXp = 0.5,
	timeYd = -1.14,
	timeYp = 1.14,
	timeW, timeH
var 逃逸时间 = {
	类型: "",
	算法: function() {},
	参量: [],
	最大迭代次数: 0,
	清晰度: 0,
	宽: 0,
	高: 0,
	迭代次数表: []
}
var eTrange = {
	MinX: -2,
	MaxX: 0.5,
	MinY: -1.14,
	MaxY: 1.14
}

function beforeP(id) {
	timeXd = eTrange.MinX, timeYd = eTrange.MinY
	qS("#cvsSel").getContext('2d').clearRect(0, 0, 10000, 10000)
		//qS("#cvsSel").getContext('2d').fillStyle="rgba(255,255,255,0)";
	escapeTime(id)
}

function escapeTime(id) {
	var Δ = 9 - $('#清晰度').val()
	var canvas = qS('#' + id),
		ctx = canvas.getContext('2d')
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	var dX = eTrange.MaxX - eTrange.MinX,
		dY = eTrange.MaxY - eTrange.MinY
	var CvsW, CvsH
	if (dY * canvas.width > dX * canvas.height) {
		CvsH = canvas.height, CvsW = Math.floor(CvsH * dX / dY)
	} else {
		CvsW = canvas.width, CvsH = Math.floor(CvsW * dY / dX)
	}
	timeXp = canvas.width / CvsW * dX + eTrange.MinX
	timeYp = canvas.height / CvsH * dY + eTrange.MinY
	Tx = timeXp - timeXd, Ty = timeYp - timeYd

	var cR = +$('#JR').val(),
		cC = +$('#JC').val()
	var R = 1,p = 3
	var 计时 = new Date().getTime()
	//将像素点坐标压缩到复平面
	var x2p = [],y2p = [],
		xStep = Δ*dX / CvsW,yStep = Δ*dY / CvsH,
		dx = 0,dy = 0
	for (var i = 0; i < CvsW; i += Δ, dx += xStep) x2p[i] = eTrange.MinX + dx
	for (var i = 0; i < CvsH; i += Δ, dy += yStep) y2p[i] = eTrange.MinY + dy

	var 其它参数 = {
		"Julia": [cR, cC, null],
		"Lyapunov": [cR, cC, null],
		"Newton": [+$('#NewtonN').val(), null, null],
		"Nova": [+$('#NovN').val(), +$('#NovR').val(), +$('#NovC').val()]
	}[逃逸时间.类型] || [null, null, null]
	var m = +$('#MaxIter').val(),
		R_2 = Math.pow(+$('#IterR').val(), 2)
		// var m=逃逸时间.参量[5],R_2=Math.pow(逃逸时间.参量[6],2)
	var Iter = new Array((CvsH + 1))
	for (var Y = 0; Y < CvsH; Y += Δ) {
		Iter[Y] = new Array((CvsW + 1))
		for (var X = 0; X < CvsW; X += Δ) {
			Iter[Y][X] = 逃逸时间.算法(x2p[X], y2p[Y], m, R_2, 其它参数[0], 其它参数[1],其它参数[2])
		}
	}

	逃逸时间.宽=CvsW, 逃逸时间.高=CvsH
	逃逸时间.清晰度=Δ
	逃逸时间.最大迭代次数=m
	逃逸时间.迭代次数表 = Iter
	//alert((canvas.height-CvsH)++)
	var 类型 = "HSL"
	var col2iter = 迭代到色彩(类型,m)
	//var startY=canvas.height-CvsH
	上色(ctx,col2iter,canvas.height,CvsW)
	//var ctxda=ctx.getImageData(1, 1, CvsW, CvsH)
	$("#msg").html("绘制时间:" + (new Date().getTime() - 计时) / 1000 + "s");
	console.log(ctx.getImageData(0,0,100,100)); 

}

var 上色 = function(ctx,col2iter,height){

	/*var imgData=ctx.createImageData(screen.width,screen.height);
	for (var i=0;i<imgData.data.length;i+=4){
		imgData.data[i+0]=255;
		imgData.data[i+1]=0;
		imgData.data[i+2]=0;
		imgData.data[i+3]=255;
	}
	ctx.putImageData(imgData,0,0);
*/


	var Iter  = 逃逸时间.迭代次数表,
		Δ     = 逃逸时间.清晰度,
		width = 逃逸时间.宽
	//上色时间减半
	for (var Y = 0; Y < height; Y += Δ) {
		var dx = 0, x0 = 1
		for (var X = 0; X < width; X += Δ) {
			dx += Δ
			if (Iter[Y][X] != Iter[Y][X+1]) {
				ctx.fillStyle = col2iter[Iter[Y][X]]
				ctx.fillRect(x0, Y+1, dx, Δ)
				x0 = X + 1
				dx = 0
			}
		}
	}
	/*for (var Y = 0; Y < height; Y += Δ) {
		var dx = 0, x0 = 1
		for (var X = 0; X < width; X += Δ) {
			dx += Δ
			ctx.fillStyle = col2iter[Iter[Y][X]]
			ctx.fillRect(x0, Y+1, dx, Δ)
		}
	}*/
}
var 迭代到色彩 = function(类型,m) {
	var col2iter = new Array((m + 1)),
		stp = Math.pow(2, +$('#色阶').val()),
		h = +$('#色相').val()

	if (类型 == "HSL") { //HSL上色方案
		for (var i = 0, n = col2iter.length; i < n; i++, h += stp) {
			if (h > 360) h -= 360
			col2iter[i] = "hsl(" + h + ",100%,50%)"
		}
	} else if(类型 == "RGB") { //RGB上色方案
		var i = 0
		do {
			// 黒→紫
			for (var j = 0; j < 256 && i <= m; j += stp, i++)
				col2iter[i] = "rgb(" + j + ",0," + j + ")"
			// 紫→蓝
			for (var j = 254; j >= 0 && i <= m; j -= stp, i++)
				col2iter[i] = "rgb(" + j + ",0,255)"
			// 蓝→靛
			for (var j = 1; j < 256 && i <= m; j += stp, i++)
				col2iter[i] = "rgb(0," + j + ",255)"
			// 靛→绿
			for (var j = 254; j >= 0 && i <= m; j -= stp, i++)
				col2iter[i] = "rgb(0,255," + j + ")"
			// 绿→黄
			for (var j = 1; j < 256 && i <= m; j += stp, i++)
				col2iter[i] = "rgb(" + j + ",255,0)"
			// 黄→红
			for (var j = 254; j >= 0 && i <= m; j -= stp, i++)
				col2iter[i] = "rgb(255," + j + ",0)"
			// 红→白
			for (var j = 1; j < 256 && i <= m; j += stp, i++)
				col2iter[i] = "rgb(255," + j + "," + j + ")"
			// 白→黒
			for (var j = 254; j > 0 && i <= m; j -= stp, i++)
				col2iter[i] = "rgb(" + j + "," + j + "," + j + ")"
		} while (i <= m)
	}
	return col2iter
}

var RGBToHSI = function(a, c, b) {
	var g = (a - c + a - b) / 2 / Math.sqrt((a - c) * (a - c) + (a - b) * (c - b)) || 0,
		g = Math.acos(g),
		g = b > c ? 2 * Math.PI - g : g,
		e = 1 - 3 * Math.min(a, c, b) / (a + c + b);
	g > 2 * Math.PI && (g = 2 * Math.PI);
	0 > g && (g = 0);
	return {
		H: g,
		S: e,
		I: (a + c + b) / 3
	}
}
console.log(RGBToHSI(0,1,1));
var HSIToRGB = function(a, b, f) {
	0 > a ? (a %= 2 * Math.PI, a += 2 * Math.PI) : a %= 2 * Math.PI;
	if (a <= 2 * Math.PI / 3) var g = f * (1 - b),
		e = f * (1 + b * Math.cos(a) / Math.cos(Math.PI / 3 - a)),
		j = 3 * f - (e + g);
	else a <= 4 * Math.PI / 3 ? (a -=
		2 * Math.PI / 3, e = f * (1 - b), j = f * (1 + b * Math.cos(a) / Math.cos(Math.PI / 3 - a)), g = 3 * f - (j + e)) : (a -= 4 * Math.PI / 3, j = f * (1 - b), g = f * (1 + b * Math.cos(a) / Math.cos(Math.PI / 3 - a)), e = 3 * f - (j + g));
	return {
		R: e,
		G: j,
		B: g
	}
}
console.log(HSIToRGB(0,2 * Math.PI,1));
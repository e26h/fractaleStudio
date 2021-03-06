"use strict";
//迭代
function drawPoint(id) {
	let canvas = qS('#' + id)
		//初始化画布状态矩阵
	let w = canvas.width,
		h = canvas.height,
		isPrint = new Array(h);
	for (var i = 0; i < h; i++) {
		isPrint[i] = new Array(w)
		for (var j = 0; j < w; j++) {
			isPrint[i][j] = false
		}
	}
	var ctx = canvas.getContext("2d")
	ctx.clearRect(0, 0, w, h)
	var CS = data.IFS_CS[$("#IFSType").val()]
	var row = $("#IFS_dg").datagrid("getRows");
	for (var i = 0; i < row.length; i++) {
		for (var key in row[i]) {
			row[i][key] = +row[i][key]
		}
	}
	var tmp = 0,
		p = []
	for (var i = 0; i < row.length; i++) tmp += row[i].p
	for (var i = 0; i < row.length; i++) p[i] = (row[i].p / tmp)
	for (var i = 1; i < p.length; i++) p[i] += p[i - 1]
	let startTime = new Date().getTime(),
		时间阀值 = 1000, // 1秒
		x = 0,
		y = 0,
		coltmp = 256,
		pointX, pointY,
		样本上限 = 5000,
		有效样本 = 0,
		样本阀值 = 0.01 * 样本上限, //1%的样本
		样本总数 = 0
	let number = 0,
		arr = []

	function* creatPoint() {
		for (;;) {
			let rnd = Math.random(),
				j = 0
			while (rnd > p[j]) {
				j++
			}
			[x, y] = [row[j].a * x + row[j].b * y + row[j].e, row[j].c * x + row[j].d * y + row[j].f]
			// pointX = Math.floor(CS[0] * x + CS[1])
			// pointY = Math.floor(CS[0] * y + CS[2])
			[pointX, pointY] = [Math.floor(x + CS[1]), Math.floor(y + CS[2])]
			if (number < 20000) {
				number += 1
				arr.push([pointX, pointY])
			};
			yield
		}
	}
	let is超时 = () => new Date().getTime() - startTime > 时间阀值
	function is继续生成(){
		样本总数 += 1
		if (!isPrint[pointX][pointY]) {
			// ctx.fillStyle = ('#' + coltmp.toString(16))
			coltmp += 8
			// ctx.fillRect(pointX, pointY, 1, 1);
			isPrint[pointX][pointY] = true
			有效样本 += 1
		}
		if (样本总数 == 样本上限) {
			if ((有效样本 < 样本阀值) || is超时()) {
				return false
			}
			有效样本 = 样本总数 = 0
		}
		return true
	}
	// 每生成 样本上限 个点,计算 有效样本 的量,
	// 当有效样本过少时说明再计算已经对更新影响不大,此时停止更新
	// 为防止 超时 ,加入超时限制
	// let getNewPoint = creatPoint()

	for (i of creatPoint()){
		if (!is继续生成()) {
			break;
		};
	}
	do {
		getNewPoint.next()
		if (!is继续生成()) {break};
	} while (true);

	ctx.fillStyle = '#ff0000'
	for (var i = 0; i < arr.length; i++) {
		ctx.fillRect(arr[i][0], arr[i][1], 1, 1);
	}
	console.log(arr.length);
}
"use strict";

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

//迭代
function drawPoint(id) {
	var marked1$0 = [creatPoint].map(regeneratorRuntime.mark);

	var canvas = qS("#" + id);
	//初始化画布状态矩阵
	var w = canvas.width,
	    h = canvas.height,
	    isPrint = new Array(h);
	for (var i = 0; i < h; i++) {
		isPrint[i] = new Array(w);
		for (var j = 0; j < w; j++) {
			isPrint[i][j] = false;
		}
	}
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, w, h);
	var CS = data.IFS_CS[$("#IFSType").val()];
	var row = $("#IFS_dg").datagrid("getRows");
	for (var i = 0; i < row.length; i++) {
		for (var key in row[i]) {
			row[i][key] = +row[i][key];
		}
	}
	var tmp = 0,
	    p = [];
	for (var i = 0; i < row.length; i++) tmp += row[i].p;
	for (var i = 0; i < row.length; i++) p[i] = row[i].p / tmp;
	for (var i = 1; i < p.length; i++) p[i] += p[i - 1];
	var startTime = new Date().getTime(),
	    时间阀值 = 1000,
	    // 1秒
	x = 0,
	    y = 0,
	    coltmp = 256,
	    pointX = undefined,
	    pointY = undefined,
	    样本上限 = 5000,
	    有效样本 = 0,
	    样本阀值 = 0.01 * 样本上限,
	    //1%的样本
	样本总数 = 0;
	var number = 0,
	    arr = [];

	function creatPoint() {
		var rnd, _j, _ref, _ref2;

		return regeneratorRuntime.wrap(function creatPoint$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					rnd = Math.random(), _j = 0;

					while (rnd > p[_j]) {
						_j++;
					}
					_ref = [row[_j].a * x + row[_j].b * y + row[_j].e, row[_j].c * x + row[_j].d * y + row[_j].f]
					// pointX = Math.floor(CS[0] * x + CS[1])
					// pointY = Math.floor(CS[0] * y + CS[2])
					[(pointX, pointY)] = [Math.floor(x + CS[1]), Math.floor(y + CS[2])];
					_ref2 = _slicedToArray(_ref, 2);
					x = _ref2[0];
					y = _ref2[1];

					if (number < 20000) {
						number += 1;
						arr.push([pointX, pointY]);
					};
					context$2$0.next = 10;
					return;

				case 10:
					context$2$0.next = 0;
					break;

				case 12:
				case "end":
					return context$2$0.stop();
			}
		}, marked1$0[0], this);
	}
	is超时 = function () {
		return new Date().getTime() - startTime > 时间阀值;
	};
	is继续生成 = function () {
		样本总数 += 1;
		if (!isPrint[pointX][pointY]) {
			// ctx.fillStyle = ('#' + coltmp.toString(16))
			coltmp += 8;
			// ctx.fillRect(pointX, pointY, 1, 1);
			isPrint[pointX][pointY] = true;
			有效样本 += 1;
		}
		if (样本总数 == 样本上限) {
			if (有效样本 < 样本阀值 || is超时()) {
				return false;
			}
			有效样本 = 样本总数 = 0;
		}
		return true;
	};
	// 每生成 样本上限 个点,计算 有效样本 的量,
	// 当有效样本过少时说明再计算已经对更新影响不大,此时停止更新
	// 为防止 超时 ,加入超时限制
	var getNewPoint = creatPoint();
	do {
		getNewPoint.next();
		if (!is继续生成()) {
			break;
		};
	} while (true);

	ctx.fillStyle = "#ff0000";
	for (var i = 0; i < arr.length; i++) {
		ctx.fillRect(arr[i][0], arr[i][1], 1, 1);
	}
	console.log(arr.length);
	// var dg = function (x,y,ctx) {
	// 	for (var j = 0; j < row.length; j++){
	// 		tmp = row[j].c * x + row[j].d * y + row[j].f
	// 		x = row[j].a * x + row[j].b * y + row[j].e
	// 		y = tmp
	// 		pointX = Math.floor(CS[0] * x + CS[1])
	// 		pointY = Math.floor(CS[0] * y + CS[2])
	// 		ctx.fillRect(pointX, pointY, 10, 10);
	// 	}
	// }
	// for (var i = 0; i < row.length; i++){
	// 	pointX = Math.floor(CS[0] * row[i].e + CS[1])
	// 	pointY = Math.floor(CS[0] * row[i].f + CS[2])
	// 	ctx.fillRect(pointX, pointY, 10, 10);
	// 	dg(row[i].e,row[i].f,ctx)
	// }
}

"use strict";

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

//迭代
function drawPoint(id) {
	var marked1$0 = [creatPoint].map(regeneratorRuntime.mark);

	var canvas = qS("#" + id);
	//初始化画布状态矩阵
	var w = canvas.width,
	    h = canvas.height,
	    isPrint = new Array(h);
	for (var i = 0; i < h; i++) {
		isPrint[i] = new Array(w);
		for (var j = 0; j < w; j++) {
			isPrint[i][j] = false;
		}
	}
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, w, h);
	var CS = data.IFS_CS[$("#IFSType").val()];
	var row = $("#IFS_dg").datagrid("getRows");
	for (var i = 0; i < row.length; i++) {
		for (var key in row[i]) {
			row[i][key] = +row[i][key];
		}
	}
	var tmp = 0,
	    p = [];
	for (var i = 0; i < row.length; i++) tmp += row[i].p;
	for (var i = 0; i < row.length; i++) p[i] = row[i].p / tmp;
	for (var i = 1; i < p.length; i++) p[i] += p[i - 1];
	var startTime = new Date().getTime(),
	    时间阀值 = 1000,
	    // 1秒
	x = 0,
	    y = 0,
	    coltmp = 256,
	    pointX = undefined,
	    pointY = undefined,
	    样本上限 = 5000,
	    有效样本 = 0,
	    样本阀值 = 0.01 * 样本上限,
	    //1%的样本
	样本总数 = 0;
	var number = 0,
	    arr = [];

	function creatPoint() {
		var rnd, _j, _ref, _ref2;

		return regeneratorRuntime.wrap(function creatPoint$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					rnd = Math.random(), _j = 0;

					while (rnd > p[_j]) {
						_j++;
					}
					_ref = [row[_j].a * x + row[_j].b * y + row[_j].e, row[_j].c * x + row[_j].d * y + row[_j].f]
					// pointX = Math.floor(CS[0] * x + CS[1])
					// pointY = Math.floor(CS[0] * y + CS[2])
					[(pointX, pointY)] = [Math.floor(x + CS[1]), Math.floor(y + CS[2])];
					_ref2 = _slicedToArray(_ref, 2);
					x = _ref2[0];
					y = _ref2[1];

					if (number < 20000) {
						number += 1;
						arr.push([pointX, pointY]);
					};
					context$2$0.next = 10;
					return;

				case 10:
					context$2$0.next = 0;
					break;

				case 12:
				case "end":
					return context$2$0.stop();
			}
		}, marked1$0[0], this);
	}
	var is超时 = function is超时() {
		return new Date().getTime() - startTime > 时间阀值;
	};
	function is继续生成() {
		样本总数 += 1;
		if (!isPrint[pointX][pointY]) {
			// ctx.fillStyle = ('#' + coltmp.toString(16))
			coltmp += 8;
			// ctx.fillRect(pointX, pointY, 1, 1);
			isPrint[pointX][pointY] = true;
			有效样本 += 1;
		}
		if (样本总数 == 样本上限) {
			if (有效样本 < 样本阀值 || is超时()) {
				return false;
			}
			有效样本 = 样本总数 = 0;
		}
		return true;
	}
	// 每生成 样本上限 个点,计算 有效样本 的量,
	// 当有效样本过少时说明再计算已经对更新影响不大,此时停止更新
	// 为防止 超时 ,加入超时限制
	var getNewPoint = creatPoint();
	do {
		getNewPoint.next();
		if (!is继续生成()) {
			break;
		};
	} while (true);

	ctx.fillStyle = "#ff0000";
	for (var i = 0; i < arr.length; i++) {
		ctx.fillRect(arr[i][0], arr[i][1], 1, 1);
	}
	console.log(arr.length);
	// var dg = function (x,y,ctx) {
	// 	for (var j = 0; j < row.length; j++){
	// 		tmp = row[j].c * x + row[j].d * y + row[j].f
	// 		x = row[j].a * x + row[j].b * y + row[j].e
	// 		y = tmp
	// 		pointX = Math.floor(CS[0] * x + CS[1])
	// 		pointY = Math.floor(CS[0] * y + CS[2])
	// 		ctx.fillRect(pointX, pointY, 10, 10);
	// 	}
	// }
	// for (var i = 0; i < row.length; i++){
	// 	pointX = Math.floor(CS[0] * row[i].e + CS[1])
	// 	pointY = Math.floor(CS[0] * row[i].f + CS[2])
	// 	ctx.fillRect(pointX, pointY, 10, 10);
	// 	dg(row[i].e,row[i].f,ctx)
	// }
}


"use strict";
//界面参数
function qSA(query) {
	return document.querySelectorAll(query);
}

function qS(query) {
	return document.querySelector(query);
}
var rAF = requestAnimationFrame
$(function() {
	$("#tabs").tabs({
		collapsible: true,
		selected: 1,
		onSelect: function() {
			var tabs2 = $("#tabsShow").tabs({
				selected: (function() {
					var tab = $('#tabs').tabs('getSelected');
					var index = $('#tabs').tabs('getTabIndex', tab);
					return index
				})()
			});
		}
	});
	$('#tabsShow').tabs('hideHeader');
	var tmp, tmp2, L = ['eT', 'DG', 'LS', 'IFS', 'IFS3D']
	for (var i = 1; i < L.length; i++) {
		tmp = ''
		for (var key in data[L[i]]) {
			tmp2 = ''
			for (var key2 in data[L[i]][key]) {
				tmp2 += "<option value='" + key2 + "'>" + key2 + "</option>"
			}
			tmp += "<optgroup label='" + key + "'>" + tmp2 + "</optgroup>"
		}
		$('#' + L[i] + 'Type').html(tmp)
	}
	//逃逸时间算法列表
	var 列表 = []
	for (var 类型 in data[L[0]]) {
		var 组 = [],
			长 = data[L[0]][类型].参量.length
		if (长 == 1) {
			列表.push("<option value='" + (类型 + '-' + 0) + "'>" + 类型 + '集' + "</option>")
		} else {
			for (var i = 0; i < 长; i++) 组.push("<option value='" + (类型 + '-' + i) + "'>" + (类型 + (i+1)) + "</option>")
			列表.push("<optgroup label='" + 类型 + '集' + "'>" + 组.join("") + "</optgroup>")
		}
	}
	$('#' + L[0] + 'Type').append(列表.join(""))
	逃逸参数($("#eTType").val());
	递归参数($("#DGType").val());
	迭代参数($("#IFSType").val());
	文法参数($("#LSType").val());
	迭代参数3D($("#IFS3DType").val());
	//根据屏幕分辨率初始画布尺寸
	$("#tabsShow canvas").attr({
		"width": screen.width,
		"height": screen.height
	})
	$('#清晰度').slider('setValue', {
		0.75: 8,1: 7,1.5: 6,2: 5
	}[devicePixelRatio])
});

$('#eTType').change(function() {逃逸参数(this.value)})
//面板折叠
$('#收起').click(function() {
	$('.setBox').slideToggle()
	this.innerHTML = (this.innerHTML === '∧' ? '∨' : '∧')
})
//绘图
$("#huizhi").click(function() {beforeP('canvas')})
//改变配色方案
$('#改配色').change(function() {
	$('#配色').attr('href', ('./style/themes/' + this.value + '/easyui.css'))
	$("body,#canvas,#cvsIFS").css("background-color", this.value)
	$(".setBox").css({
		"background-color": this.value,
		"opacity": {
			"black": 0.618,
			"white": 0.8
		}[this.value]
	})
})
//保存图片
$("#savePic").click(function() {保存('canvas')})
//重新着色
$("#reColor").click(function() {
	var 计时 = new Date().getTime()
	var col2iter = 迭代到色彩("HSL",逃逸时间.最大迭代次数)
	var canvas=qS('#canvas'),ctx=canvas.getContext('2d')
	// 上色(ctx,col2iter,canvas.height)
	var height = canvas.height
	var Iter = 逃逸时间.迭代次数表,
		Δ = 逃逸时间.清晰度,
		width = 逃逸时间.宽
	//减少绘图调用次数
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
	$("#msgcol").text("上色时间:" + (new Date().getTime() - 计时) / 1000 + "s");
})

function 逃逸参数(value) {
	var arr = value.split('-'),类型 = arr[0]
	逃逸时间.类型 = 类型
	逃逸时间.算法 = data.eT[类型].算法
	逃逸时间.参量 = data.eT[类型].参量[parseInt(arr[1])]
	eTrange = {
		MinX: 逃逸时间.参量[0],MaxX: 逃逸时间.参量[1],
		MinY: 逃逸时间.参量[2],MaxY: 逃逸时间.参量[3]
	}
	var Item = ['dCol', 'MaxIter', 'IterR']
	for (var i = 0; i < Item.length; i++) $('#' + Item[i]).val(逃逸时间.参量[i + 4])
	if (类型 === "Julia") {
		$('#RC').show()
		$('#JR').val(逃逸时间.参量[7])
		$('#JC').val(逃逸时间.参量[8])
	} else {
		$('#RC').hide()
	}

	if (类型 === "Newton") {
		$('#Newton').show()
	} else {
		$('#Newton').hide()
	}

	if (类型 === "Nova") {
		$('#Nova').show()
		+$('#NovN').val(逃逸时间.参量[7])
		+$('#NovR').val(逃逸时间.参量[8])
		+$('#NovC').val(逃逸时间.参量[9])
	} else {
		$('#Nova').hide()
	}
}

function 递归参数(value) {
	for (var key in data.DG) {
		for (var key2 in data.DG[key]) {
			if (key2 == value) {
				$("#DGn").val(data.DG[key][value])
				return null
			}
		}
	}
}

function 文法参数(value) {
	for (var key in data.LS) {
		for (var key2 in data.LS[key]) {
			if (key2 == value) {
				var Lsys = data.LS[key][value]
				var pgdata = {
					"total": 10,
					"rows": [{
						"name": "公理",
						"value": Lsys.初始,
						"group": "可定义",
						"editor": "text"
					}, {
						"name": "角(°)",
						"value": Lsys.角度,
						"group": "可定义",
						"editor": "numberbox"
					}, {
						"name": "绘制",
						"value": Lsys.字母[0],
						"group": "可定义",
						"editor": "text"
					}, {
						"name": "移动",
						"value": Lsys.字母[1],
						"group": "可定义",
						"editor": "text"
					}, {
						"name": "代换",
						"value": Lsys.字母[2],
						"group": "可定义",
						"editor": "text"
					}, {
						"name": "初始角",
						"value": Lsys.初始角,
						"group": "可定义",
						"editor": "numberbox"
					}, {
						"name": "记录",
						"value": "[",
						"group": "约定"
					}, {
						"name": "返回",
						"value": "]",
						"group": "约定"
					}, {
						"name": "正转",
						"value": "+",
						"group": "约定"
					}, {
						"name": "反转",
						"value": "-",
						"group": "约定"
					}, {
						"name": "转180°",
						"value": "|",
						"group": "约定"
					}]
				}
				$('#LS_pg').datagrid({data: pgdata});
				$('#LSStep').val(Lsys.迭代)
				$('#LSColor').val("#ffff00")

				var jsdata = []
				for (var i = 0; i < Lsys.规则.length; i++) {
					jsdata.push({
						"LSRul": Lsys.规则[i][0],
						"LSP": Lsys.规则[i][1] || null
					})
				}
				$('#LS_tt').datagrid('loadData', {
					'total': jsdata.length,
					'rows': jsdata
				});
				return null
			}
		}
	}
}
$("#IFSType").change(function () {
	迭代参数(this.value)
	drawPoint('cvsIFS')
})
function 迭代参数(value) {
	for (var key in data.IFS) {
		for (var key2 in data.IFS[key]) {
			if (key2 == value) {
				var W = data.IFS[key][value],
					jsdata = []
				for (var i = 0; i < W.length; i++) {
					jsdata[i] = {
						'a': W[i][0],'b': W[i][1],
						'c': W[i][2],'d': W[i][3],
						'e': W[i][4],'f': W[i][5],
						'p': W[i][6]
					}
				}
				$('#IFS_dg').datagrid('loadData', {
					'total': jsdata.length,
					'rows': jsdata
				});
				return null
			}
		}
	}
}

function 迭代参数3D(value) {
	for (var key in data.IFS) {
		for (var key2 in data.IFS[key]) {
			if (key2 == value) {
				var W = data.IFS[key][value],
					jsdata = []
				for (var i = 0; i < W.length; i++) {
					jsdata[i] = {
						'a': W[i][0],'b': W[i][1],
						'c': W[i][2],'d': W[i][3],
						'e': W[i][4],'f': W[i][5],
						'p': W[i][6]
					}
				}
				$('#IFS_dg3D').datagrid('loadData', {
					'total': jsdata.length,
					'rows': jsdata
				});
				return null
			}
		}
	}
}

function 保存(id) {
		window.location.href = qS('#' + id).toDataURL("image/png").replace("image/png", "image/octet-stream")
	}
	//清除空白字符
String.prototype.trimAll = function() {
	return this.replace(/\s+/g, "");
}
$("#getLocal").click(function() {
	$("#showLocal").text(
		'minX: '+eTrange.MinX+
		'maxX: '+eTrange.MaxX+
		"minY: "+eTrange.MinY+
		"maxY: "+eTrange.MaxY
	)
})
	//αβγδεζηθικλμνξοπρστυφχψω
	//ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ
	//ABCDEFGHIJKLMNOPQRSTUVWXYZ
	//abcdefghijklmnopqrstuvwxyz

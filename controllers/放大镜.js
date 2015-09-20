//放大镜
var DownX = 0,
	DownY = 0,
	movX = 0,
	movY = 0,
	dDownX = 0,
	dDownY = 0,
	dmovX = 0,
	dmovY = 0
var ctxSel, selW, selH, boxW, boxH
var timeXd, timeXp, timeYd, timeYp, Tx, Ty

function mousedown(e) {
	e = e || window.event
	var cvsSelBox = qS("#cvsSel")
	ctxSel = cvsSelBox.getContext('2d')
	ctxSel.fillStyle = "rgba(12,12,12,0.5)"
	ctxSel.strokeStyle = "white"
	ctxSel.lineWidth = 1
	boxW = cvsSelBox.width, boxH = cvsSelBox.height
	var x = e.offsetX || (e.layerX - 1),
		y = e.offsetY || (e.layerY - 1)
	if (x < Math.min(DownX, movX) || x > Math.max(DownX, movX) || y < Math.min(DownY, movY) || y > Math.max(DownY, movY)) { //鼠标不在选择框内
		DownX = x, DownY = y;
		qS("#cvsSel").onmousemove = mousemove
	} else { //鼠标在选择框内
		dDownX = DownX - x, dDownY = DownY - y;
		dmovX = movX - x, dmovY = movY - y;
		selW = Math.abs(DownX - movX), selH = Math.abs(DownY - movY);
		//$("#cvsSel").mousemove(mMove2(e))//不可用
		qS("#cvsSel").onmousemove = mMove2
	}
}

function mousemove(e) {
	e = e || window.event
	ctxSel.clearRect(0, 0, boxW, boxH)
	ctxSel.fillRect(0, 0, boxW, boxH)
	movX = e.offsetX || (e.layerX - 1), movY = e.offsetY || (e.layerY - 1)
	drawSel(DownX, DownY, movX - DownX, movY - DownY)
	showLocal()
}

function mMove2(e) {
	e = e || window.event
	ctxSel.clearRect(0, 0, boxW, boxH)
	ctxSel.fillRect(0, 0, boxW, boxH)
	var x = e.offsetX || (e.layerX - 1),
		y = e.offsetY || (e.layerY - 1)
	DownX = dDownX + x, DownY = dDownY + y, movX = dmovX + x, movY = dmovY + y
	drawSel(DownX, DownY, selW, selH)
	showLocal()
}

function mouseup() {
	showLocal()
	qS("#cvsSel").onmousemove = null;
	qS("#cvsSel").style.cursor = "crosshair";
}

function showLocal() {
	var x1 = DownX / boxW * Tx + timeXd, x2 = movX / boxW * Tx + timeXd,
		y1 = DownY / boxH * Ty + timeYd, y2 = movY / boxH * Ty + timeYd;
	var xp = Math.max(x1, x2), xd = Math.min(x1, x2),
		yp = Math.max(y1, y2), yd = Math.min(y1, y2);
	/*var v = [
		(Tx / screen.width).toPrecision(2).length - 2,
		(Ty / screen.height).toPrecision(2).length - 2
	]
	var x = Math.pow(10, v[0]),
		y = Math.pow(10, v[1])
	xd = Math.round(xd * x) / x, xp = Math.round(xp * x) / x
	yd = Math.round(yd * y) / y, yp = Math.round(yp * y) / y*/
	eTrange = {
		MinX: xd, MaxX: xp,
		MinY: yd, MaxY: yp
	}
}

function drawSel(x, y, W, H) {
	ctxSel.clearRect(x, y, W, H)
	ctxSel.strokeRect(x, y, W, H)
	ctxSel.strokeRect(x + W / 3, y, W / 3, H)
	ctxSel.strokeRect(x, y + H / 3, W, H / 3)
	ctxSel.stroke()
}
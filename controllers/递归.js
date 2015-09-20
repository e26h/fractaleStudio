"use strict";
//递归
function DG(id){
	var DGsvg="",Xmin=0,Xmax=0,Ymin=0,Ymax=0
	var canvas=document.getElementById(id)
	var CvsW=canvas.width,CvsH=canvas.height
	var n=+$("#DGn").val()
	var xy=function (List){
		for(var i=0,n=List.length;i<n;i++){
			if(List[i]<Xmin){Xmin=List[i]}else if(List[i]>Xmax){Xmax=List[i]}
			i+=1
			if(List[i]<Ymin){Ymin=List[i]}else if(List[i]>Ymax){Ymax=List[i]}
		}
	}
	//递归函数定义
	var 树1=function(x,y,x0,y0,L,a,dir,n){
		DGsvg+='M'+x+' '+y+'L'+x0+' '+y0
		xy([x,y,x0,y0])
		// if(x<Xmin){Xmin=x}else if(x>Xmax){Xmax=x}
		// if(x0<Xmin){Xmin=x0}else if(x0>Xmax){Xmax=x0}
		// if(y<Ymin){Ymin=y}else if(y>Ymax){Ymax=y}
		// if(y0<Ymin){Ymin=y0}else if(y0>Ymax){Ymax=y0}
		if(n){
			L*=0.8
			var x1=x0+L*Math.cos(dir-a),y1=y0-L*Math.sin(dir-a),x2=x0+L*Math.cos(dir+a),y2=y0-L*Math.sin(dir+a)
			树1(x0,y0,x1,y1,L,a,dir-a,n-1)
			树1(x0,y0,x2,y2,L,a,dir+a,n-1)
		}
	}
	var 树2=function (xa,ya,L,a,dir,n){
		xy([xa,ya])
		var xb=xa+L*Math.cos(dir),yb=ya-L*Math.sin(dir)
		DGsvg+='M'+xa+' '+ya+'L'+xb+' '+yb
		L*=0.5
		var	xf=xb+L*Math.cos(dir-a),yf=yb-L*Math.sin(dir-a),
			xg=xb+L*Math.cos(dir+a),yg=yb-L*Math.sin(dir+a)
		DGsvg+='M'+xf+' '+yf+'L'+xb+' '+yb+'L'+xg+' '+yg
		var	xc=(2*xa+xb)/3,yc=(2*ya+yb)/3,
			xd=xc+L*Math.cos(dir-a),yd=yc-L*Math.sin(dir-a),
			xe=xc+L*Math.cos(dir+a),ye=yc-L*Math.sin(dir+a)
		DGsvg+='M'+xd+' '+yd+'L'+xc+' '+yc+'L'+xe+' '+ye
		if(L>3){
			L*=2
			var β=10*π/180
			树2(xb,yb,L/1.3,a,dir-β,n-1)
			树2(xf,yf,L/3,a,dir-a-β,n-1)
			树2(xg,yg,L/3,a,dir+a-β,n-1)
			树2(xd,yd,L/3,a,dir-a-β,n-1)
			树2(xe,ye,L/3,a,dir+a-β,n-1)
		}
	}
	function 树3(){

	return 0
	}
	function 树4(){

	return 0
	}
	var DGCantor=function (){

	return 0
	}
	var DGKontLine=function (ax,ay,bx,by,n){
		if(n){
			var cx=ax+(bx-ax)/3,cy=ay+(by-ay)/3,ex=bx-(bx-ax)/3,ey=by-(by-ay)/3
			DGKontLine(ax,ay,cx,cy,n-1)
			DGKontLine(ex,ey,bx,by,n-1)
			
			var l=Math.sqrt((Math.pow(ex-cx,2)+Math.pow(ey-cy,2)))
			var alfa=Math.atan((ey-cy)/(ex-cx))
			
			if(ex<cx){alfa+=π}
			alfa+=π/3
			var dx=cx+Math.cos(alfa)*l,dy=cy+Math.sin(alfa)*l
			
			DGKontLine(cx,cy,dx,dy,n-1)
			DGKontLine(dx,dy,ex,ey,n-1)
		}else{
			DGsvg+='M'+parseInt(ax)+' '+parseInt(ay)+' '+'L'+parseInt(bx)+' '+parseInt(by)
			xy([ax,ay,bx,by])
		}
	}
	var 雪花=function(x,y,L,n){
		var sqrt3=Math.sqrt(3)
		var x1=-1*L,y1=L/sqrt3,x2=L,y2=L/sqrt3,x3=0,y3=-2*L/sqrt3
		DGKontLine(x1,y1,x2,y2,n)
		DGKontLine(x2,y2,x3,y3,n)
		DGKontLine(x3,y3,x1,y1,n)
	}
	function DGArb(){

	return 0
	}
	var Spk3=function (x1,y1,x2,y2,x3,y3,n){
		if(n){
			var x12=(x1+x2)/2,y12=(y1+y2)/2,x23=(x2+x3)/2,y23=(y2+y3)/2,x13=(x1+x3)/2,y13=(y1+y3)/2
			Spk3(x1,y1,x12,y12,x13,y13,n-1)
			Spk3(x2,y2,x23,y23,x12,y12,n-1)
			Spk3(x3,y3,x23,y23,x13,y13,n-1)
		}else{
			xy([x1,y1,x2,y2,x3,y3])
			DGsvg+=
				'M'+parseInt(x1)+' '+parseInt(y1)+
				'L'+parseInt(x2)+' '+parseInt(y2)+
				'L'+parseInt(x3)+' '+parseInt(y3)+
				'L'+parseInt(x1)+' '+parseInt(y1)
		}
	}
	var Spk4=function (x,y,L,n){
		if(n){
			var L_3=L/3
			Spk4(x-L_3,y-L_3,L_3,n-1)
			Spk4(x-L_3,y,L_3,n-1)
			Spk4(x-L_3,y+L_3,L_3,n-1)
			Spk4(x,y-L_3,L_3,n-1)
			Spk4(x,y+L_3,L_3,n-1)
			Spk4(x+L_3,y-L_3,L_3,n-1)
			Spk4(x+L_3,y,L_3,n-1)
			Spk4(x+L_3,y+L_3,L_3,n-1)
		}else{
			xy([x,y])
			var xtmp=x-L/2,ytmp=y-L/2
			DGsvg+=
				'M'+xtmp+' '+ytmp+
				'l'+L+' '+0+
				'l'+0+' '+L+
				'l'+(-1*L)+' '+0+
				'l'+0+' '+(-1*L)
		}
	}
	function DGHilbLine(){
		
	return 0
	}
	var C曲线=function (x1,y1,x2,y2,n){
		if(n){
			var x3=(x1+y1+x2-y2)/2,y3=(x2+y2+y1-x1)/2
			C曲线(x1,y1,x3,y3,n-1)
			C曲线(x3,y3,x2,y2,n-1)
		}else{
			xy([x1,y1,x2,y2])		
			DGsvg+='M'+x1+' '+y1+'L'+x2+' '+y2
		}
	}
	//调用
	switch($("#DGType").val()){
		case "树一":树1(CvsW/2,CvsH,CvsW/2,CvsH-200,200,15*π/180,90*π/180,n);break;
		case "树二":树2(CvsW/2,CvsH,100,50*π/180,90*π/180,n);break;
		case "树三":树3();break;
		case "树四":树4();break;
		case "Cantor三分集":DGCantor();break;
		case "Kont曲线":DGKontLine(0,CvsH/2,CvsW,CvsH/2,n);break;
		case "雪花":雪花(CvsW/2,CvsH/2,Math.min(CvsH,CvsW)/2,n);break;
		case "Arboresent肺":DGArb();break;
		case "Sierpinski三角":Spk3(CvsW/2,0,0,CvsH,CvsW,CvsH,n);break;
		case "Sierpinski地毯":Spk4(CvsW/2,CvsH/2,600,n);break;
		case "Hilbert_Peano曲线":DGHilbLine();break;
		case "C曲线":C曲线(CvsW/4,CvsH/3,CvsW-CvsW/4,CvsH/3,n);break;
	}
	var dx=Xmax-Xmin,dy=Ymax-Ymin
		// "<svg id='LSsvg' width="+(dx/10+3)+" height="+(dy/10+3)+">"+// style='border:1px solid'
			// "<g transform='scale(0.1,0.1),translate("+(1-minX)+","+(1-minY)+")'>"+
				// "<path fill='none' stroke='yellow' stroke-width="+(2*10)+" d='"+newW.join('')+"'/>"+
	$("#DGsvgb").html(
	"<svg id='LSsvg' width="+dx+" height="+dy+">"+
		"<g transform='translate("+(1-Xmin)+","+(1-Ymin)+")'>"+
			"<path fill='' stroke='yellow' stroke-width=2 d='"+DGsvg+"'/>"+
		"</g>"+
	"</svg>"
	)
}
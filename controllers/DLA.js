"use strict";
function sgn(x){return x>0 ? 1 : (x<0 ? -1 : 0)}
function DLA(id){
	var cvs=document.getElementById(id),
		W=cvs.width,H=cvs.height,
		x0=W/2,y0=H/2,R=20
		ctx=cvs.getContext("2d")
	ctx.clearRect(0,0,W,H)
	ctx.fillStyle=('#fff')
	ctx.fillRect(x0,y0,1,1);
	function check(x,y){
		if(ctx.getImageData(x+1,y,1,1).lenght || ctx.getImageData(x-1,y,1,1).lenght || ctx.getImageData(x,y-1,1,1).lenght || ctx.getImageData(x,y+1,1,1).lenght){return true}else{return false}
	}
	function isOut(x,y){
		if(x<0 || y<0 || x>W || y>H){return true}else{return false}
	}
	for(var i=0,n=qS('#DLAIterNum').value*10000;i<n;i++){
		var x=R*(Math.random()-0.5)+x0,y=R*(Math.random()-0.5)+y0,notFound=true
		var max=0
		do{
			f_x=Math.random()-0.5,f_y=Math.random()-0.5
			dx=sgn(f_x),dy=sgn(f_y)
			x+=dx,y+=dy
			if(check(x,y)){
				ctx.fillRect(x,y,1,1),notFound=false
			}else if(isOut(x,y)){
				notFound=false
			}
			max+=1
		}while(notFound && max<100)
	}
	alert("finish")
}

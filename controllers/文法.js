"use strict";
//文法
function getLS(){
	accept_LS()
	var rows=$("#LS_tt").datagrid("getRows")//规则表
	var 次=+$("#LSStep").val()//迭代次数
	var 参=$("#LS_pg").datagrid("getRows"),//符号表
		文法= 参[0].value,
		转=参[1].value*π/180,
		绘=参[2].value,绘=绘.trimAll(),
		移=参[3].value || '',移=移.trimAll(),
		无=参[4].value || '',无=无.trimAll(),
		dir=-1*参[5].value*π/180,//初始角
		size=(参[1].value % 45==0)?1:1.5,
		len=size*2*10;
	//查找缓存是否有记录
	var 验证1 = function(){
		var found=false
		var maxCache=0,LS_i
		for(var i=0,m=cache.LS.length;i<m;i++){
			var 规则相同=true
			for(var j=0,m2=cache.LS[i].规则.length;j<m2;j++){
				//&& cache.LS[i].规则.LSP[j]==rows[j].LSP
				if(cache.LS[i].规则[j].LSRul!=rows[j].LSRul){规则相同=false;break}
			}
			if(规则相同 && (cache.LS[i].初始[0]==参[0].value)){
				maxCache=Math.min(次,cache.LS[i].初始.length-1)
				文法=cache.LS[i].初始[maxCache]
				found=true
				LS_i=i
				break
			}
		}
	}
	var found=false
	var maxCache=0,LS_i
	for(var i=0,m=cache.LS.length;i<m;i++){
		var 规则相同=true
		for(var j=0,m2=cache.LS[i].规则.length;j<m2;j++){
			//&& cache.LS[i].规则.LSP[j]==rows[j].LSP
			if(cache.LS[i].规则[j].LSRul!=rows[j].LSRul){规则相同=false;break}
		}
		if(规则相同 && (cache.LS[i].初始[0]==参[0].value)){
			maxCache=Math.min(次,cache.LS[i].初始.length-1)
			文法=cache.LS[i].初始[maxCache]
			found=true
			LS_i=i
			break
		}
	}
	if(!found){
		LS_i=cache.LS.length
		cache.LS.push({初始:[文法],规则:rows})
	}
	//分解规则元素
	var 替=[],换=[],权=[];
	for(var i=0;i<rows.length;i++){
		var tmp=rows[i].LSRul.trimAll().split('=',2);
		替.push(tmp[0])
		换.push(tmp[1])
		权.push(rows[i].LSP || null)
	}
	//生成文法，如有必要增加cache
	for(var i=maxCache;i<次;i++){
		var 文法tmp=''
		for(var j=0,m=文法.length;j<m;j++){
			var tmp=替.indexOf(文法[j])
			文法tmp+=(tmp+1) ? 换[tmp] : 文法[j]
		}
		文法=文法tmp
		if(!cache.LS[LS_i].初始[i+1]){cache.LS[LS_i].初始[i+1]=文法}
	}
	//统计文法长度
	var textLen=0
	for(var i=0,n=文法.length;i<n;i++){
		if ((绘.indexOf(文法[i])>=0) || (移.indexOf(文法[i])>=0)){textLen+=1}
	}
	//计算路径
	var x=0,y=0,minX=0,maxX=0,minY=0,maxY=0,xtmp=[],ytmp=[],dirtmp=[]
	var newW=[['M',x,y]]
	for(var i=0,n=文法.length;i<n;i++){
		if (绘.indexOf(文法[i])>=0){
			x+=len*Math.cos(dir),y+=len*Math.sin(dir);
			newW.push(['L',Math.round(x),Math.round(y)])
		}else if(移.indexOf(文法[i])>=0){
			x+=len*Math.cos(dir),y+=len*Math.sin(dir);
			newW.push(['M',Math.round(x),Math.round(y)])
		}else if(无.indexOf(文法[i])>=0){}
		else{
			switch(文法[i]){
				case '+' : dir+=转;break;
				case '-' : dir-=转;break;
				case '|' : dir+=π;break;
				case '[' : xtmp.push(x),ytmp.push(y),dirtmp.push(dir);break;
				case ']' : x=xtmp.pop(),y=ytmp.pop(),dir=dirtmp.pop(),
				newW.push(['M',Math.round(x),Math.round(y)]);
				break;
			}
		}
		if(x<minX){minX=x}else if(x>maxX){maxX=x}
		if(y<minY){minY=y}else if(y>maxY){maxY=y}
	}
	var dx=Math.ceil((maxX-minX)),dy=Math.ceil((maxY-minY))
	//根据文法数量级选择绘图格式绘图
	if(textLen<=Math.pow(2,17)){//svg
		for(var i=0,n=newW.length;i<n;i++){newW[i]=newW[i].join(' ')}
		qS("#svgb").innerHTML=(
		"<svg id='LSsvg' width="+(dx/10+3)+" height="+(dy/10+3)+">"+// style='border:1px solid'
			"<g transform='scale(0.1,0.1),translate("+(1-minX)+","+(1-minY)+")'>"+
				"<path fill='none' stroke='yellow' stroke-width="+(size*10)+" d='"+newW.join('')+"'/>"+
			"</g>"+
		"</svg>")
		//$("#svgb").html
	}else{//canvas
		if(!qS('#LSCvs')){
			qS('#svgb').innerHTML=(
			"<button onclick="+"保存('LSCvs')"+";>保存(后缀为png)</button><br>"+
			"<canvas id='LSCvs'></canvas>"// style='border:1px solid'
			)
			//$("#svgb").html
		}
		var canvas=qS('#LSCvs'),ctx=canvas.getContext('2d')
		canvas.width=dx/10+3,canvas.height=dy/10+3
		ctx.clearRect(0,0,canvas.width,canvas.height)
		ctx.strokeStyle="#ffff00"
		ctx.lineWidth=size*10
		ctx.scale(0.1,0.1)
		ctx.translate(1-Math.floor(minX),1-Math.floor(minY))
		ctx.beginPath()
		for(var i=0,n=newW.length;i<n;i++){
			if(newW[i][0]==='M'){
				ctx.moveTo(newW[i][1],newW[i][2]);
			}else{ //if(newW[i][0]==='L'){
				ctx.lineTo(newW[i][1],newW[i][2]);
			}
		}
		ctx.stroke();
		ctx.scale(10,10)
		ctx.translate(Math.floor(minX)-1,Math.floor(minY)-1)
	}
}
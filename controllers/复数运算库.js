"use strict";
//复数运算库
var π=Math.PI
//θρ
var 复数 = function (a,b){
	this.a=a,this.b=b
	this.m_2 = a*a+b*b
	//,this.m=Math.sqrt(this.m_2)
}
复数.prototype.mod2 = function(){return this.a*this.a+this.b*this.b}
复数.prototype.mod = function(){return Math.sqrt(this.m_2)}
复数.prototype.pow = function(n){
	var a=this.a,b=this.b
	if(n == 0) return new 复数(1,0)
	if(n == 1) return new 复数(z.a,z.b)
	if(n == 2) return new 复数((a-b)*(a+b),2*a*b)
	var nθ=n*Math.atan2(b,a),ρ_n=Math.pow(this.mod2(),n/2)
	return new 复数(ρ_n*Math.cos(nθ),ρ_n*Math.sin(nθ))
}

function 加(z1,z2){return new 复数(z1.a+z2.a,z1.b+z2.b)}
function 减(z1,z2){return new 复数(z1.a-z2.a,z1.b-z2.b)}
function 乘(z1,z2){return new 复数(z1.a*z2.a-z1.b*z2.b,z1.a*z2.b+z1.b*z2.a)}
function 除(z1,z2){
	var a=z1.a,b=z1.b,c=z2.a,d=z2.b
	var tmp=c*c+d*d
	return new 复数((a*c+b*d)/tmp,(b*c-a*d)/tmp)
}

复数.prototype.add = function(z){
	if(z.a) return new 复数(this.a+z.a,this.b+z.b)
	return new 复数(this.a+z,this.b)
}
复数.prototype.cut = function(z){return new 复数(this.a-z.a,this.b-z.b)}
复数.prototype.mul = function(z){
	if(z.a) return new 复数(this.a*z.a-this.b*z.b,this.a*z.b+this.b*z.a)
	return new 复数(this.a*z,this.b*z)
}
复数.prototype.div = function(z){
	var a=this.a,b=this.b,c=z.a,d=z.b
	var tmp=c*c+d*d
	return new 复数((a*c+b*d)/tmp,(b*c-a*d)/tmp)
}

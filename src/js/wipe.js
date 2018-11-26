/*
 * author:569999675@qq.com
 * data:2018-11-16
*/
function Wipe(obj){
	this.coverType=obj.coverType;//类型
	this.coverTypeValue=obj.coverType==="color"?obj.color:obj.imgUrl;//涂抹颜色或覆盖图
	this.conID = obj.id;
	this.cas = document.getElementById(this.conID);
	this.context = cas.getContext("2d");
	this._w = obj.width;
	this._h = obj.height;
	this.radius = obj.radius;//涂抹半径
	this.lock = false;//表示鼠标状态,false为未按下,true为按下,
	this.posY=null;
	this.posX=null;
	this.background = obj.url;//背景图路径
	this.cas.setAttribute("width",this._w);
	this.cas.setAttribute("height",this._h);
	this.cas.style.background="url("+this.background+")"+" 0 0 no-repeat";
	this.percent1= obj.percent;
	this.state = false;
	this.drawMask();
	this.incident();
}
//drawT()画点和画线的函数
//参数:如果是传递两个参数,功能是画圆,x与y是圆的中心坐标
// 如果是传递4个参数,功能是画线,x,y是起始坐标,x1,y1是结束坐标
Wipe.prototype.drawT = function(x,y,x1,y1){
	this.context.save();
	this.context.beginPath();
	if (arguments.length===2) {
		this.state = false;
		this.context.arc(x-getAllOffsetLeft(cas)+getScrollLeft(),y-getAllOffsetTop(cas)+getScrollTop(),this.radius,0,2*Math.PI);
		this.context.globalCompositeOperation ="destination-out";
		// context.fillStyle="white";
		this.context.fill();
		this.context.save();
	}else if(arguments.length===4){
		this.state = false;
		this.context.lineCap = "round";
		this.context.lineWidth=this.radius*2;
		// 以原点为起点,绘制一条线
		console.log(getScrollTop())
		this.context.moveTo(x-getAllOffsetLeft(cas)+getScrollLeft(),y-getAllOffsetTop(cas)+getScrollTop());
		this.context.lineTo(x1-getAllOffsetLeft(cas)+getScrollLeft(),y1-getAllOffsetTop(cas)+getScrollTop());
	}else{
		return false;
	}
	this.context.stroke();
	// 恢复原有绘图状态
	this.context.restore();
};
// 初始化颜色
Wipe.prototype.drawMask = function(){
		this.context.beginPath();
		var that = this;
	if (this.coverType==="color") {
		this.context.fillStyle=this.coverTypeValue||"#666";
		this.context.fill();
		this.context.fillRect(0,0,this._w,this._h);
	}else if(this.coverType==="image"){
		var img1=new Image();
		img1.src = this.coverTypeValue;
		img1.onload = function(){
			that.context.drawImage(img1,0,0,that._w,that._h,0,0,that._w,that._h);
		};
	}
	this.context.stroke();
	this.context.restore();
};
//清除
Wipe.prototype.clearRect = function(){
	this.context.clearRect(0,0,this._w,this._h);
};

// 获取透明点占整个画布的百分比
Wipe.prototype.getTransparencyPercent = function(){
	var imgData = this.context.getImageData(0,0,this._w,this._h);
	var num = 0;
	var that = this;
	setTimeout(function(){
		that.state = true;
	},1000)
	if (this.state) {
		for (var i = 0; i < imgData.data.length; i+=4) {
			var a = imgData.data[i+3];
			if(a===0){
				num++;
			}
		}
	}
	this.percent = (num/(this._w*this._h))*100;
	// console.log("透明个数"+num);
	// console.log("占总面积"+Math.ceil(percent)+"%");
	return Math.round(Math.ceil(this.percent));
};

// device保存设备类型,如果是移动端则为true,PC端为false
var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
// console.log(device)
var down = device?"touchstart":"mousedown";
var move = device?"touchmove":"mousemove";
var end = device?"touchend":"mouseup";


Wipe.prototype.incident = function(){
	// 在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
	var that = this;
	// console.log("监听成功")
	cas.addEventListener(down,function(ev){
		// console.log("鼠标按下监听成功");
		var evt = ev || window.event;
		// 获取鼠标在视口的坐标,传递参数到drawPoint
		that.posY = device ? evt.touches[0].clientY: evt.clientY;
		that.posX = device ? evt.touches[0].clientX: evt.clientX;
		that.drawT(that.posX,that.posY);
		that.lock=true;
		
	},false);

	// 监听手指移动事件
	cas.addEventListener(move,function(ev){
		if (that.lock===true) {
			var evt = ev||window.event;
			// 获取鼠标在视口的坐标,传递参数到drawPoint
			evt.preventDefault();
			var moveX = device ? evt.touches[0].clientX :evt.clientX;
			var moveY= device ? evt.touches[0].clientY : evt.clientY;
			
			// drawLine(context,posX,posY,moveX,moveY);
			that.drawT(that.posX,that.posY,moveX,moveY);
			// 每一次的结束点变成下一次开始的点
			that.posX = moveX;
			that.posY = moveY;

		}else{
			return false;
		}
	},false);

	// 监听手指离开屏幕
	cas.addEventListener(end,function(ev){
		that.lock=false;
		// 透明大于50的时候,清除画布中的内容
		if(that.getTransparencyPercent()>=that.percent1){
			// console.log("大于"+that.percent1+"%面积");
			wipeCallback(that.getTransparencyPercent());
			that.clearRect(that.context);
		}
	},false);
};
// 获取元素的偏移量
function getAllOffsetLeft(element){
	var allLeft=0;//用来保存所有的offsetLeft之和
	while(element){
		//将对象的offsetLeft属性保存到allLeft中
		allLeft+=element.offsetLeft;
		//找到对象的offsetParent,即其有定位属性的父元素，将其重新将其赋值给element,实现逐级向上查找功能，一直到body标签结束
		element=element.offsetParent;
	}
	return allLeft;
}
function getAllOffsetTop(element){
	var allTop=0;//用来保存所有的offsetLeft之和
	while(element){
		//将对象的offsetLeft属性保存到allLeft中
		allTop+=element.offsetTop;
		//找到对象的offsetParent,将其赋值给element,
		element=element.offsetParent;
	}
	return allTop;
}
// 获取滚动条高度
function getScrollTop(){  
    var scrollTop=0;  
    if(document.documentElement&&document.documentElement.scrollTop){  
        scrollTop=document.documentElement.scrollTop;  
    }else if(document.body){  
        scrollTop=document.body.scrollTop;  
    }  
    return scrollTop;  
}
// 获取滚动条宽度
function getScrollLeft(){  
    var scrollLeft=0;  
    if(document.documentElement&&document.documentElement.scrollLeft){  
        scrollLeft=document.documentElement.scrollLeft;  
    }else if(document.body){  
        scrollLeft=document.body.scrollLeft;  
    }  
    return scrollLeft;  
}
console.log(getScrollLeft())
var cas = document.querySelector("#cas");
var context = cas.getContext("2d");
var _w = cas.width;
var _h = cas.height;
var radius = 20;//涂抹半径
var lock = false;//表示鼠标状态,false为未按下,true为按下,
var posY;
var posX;
// device保存设备类型,如果是移动端则为true,PC端为false
var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
// console.log(device)
var down = device?"touchstart":"mousedown";
var move = device?"touchmove":"mousemove";
var end = device?"touchend":"mouseup";

// 在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener(down,function(ev){
	var evt = ev || window.event;
	// 获取鼠标在视口的坐标,传递参数到drawPoint
	posY = device ? evt.touches[0].clientY: evt.clientY;
	posX = device ? evt.touches[0].clientX: evt.clientX;
	// drawPoint(context,posY,posX);
	drawAll(context,posX,posY);
	lock=true;
},false);


// 监听手指移动事件
cas.addEventListener(move,function(ev){
	if (lock===true) {
		var evt = ev||window.event;
		// 获取鼠标在视口的坐标,传递参数到drawPoint
		evt.preventDefault();
		var moveX = device ? evt.touches[0].clientX :evt.clientX;
		var moveY= device ? evt.touches[0].clientY : evt.clientY;
		
		// drawLine(context,posX,posY,moveX,moveY);
		drawAll(context,posX,posY,moveX,moveY);
		// 每一次的结束点变成下一次开始的点
		posX = moveX;
		posY = moveY;

	}else{
		return false;
	}
},false);

// 监听手指离开屏幕
cas.addEventListener(end,function(ev){
	lock=false;
	// 透明大于50的时候,清除画布中的内容
	if(getTransparencyPercent(context)>=50){
		console.log("大于50%面积");
		clearRect(context);
	}
},false);

function drawMask(context){
	context.beginPath();
	context.fillStyle="#666";
	context.fill();
	context.fillRect(0,0,_w,_h);
	context.stroke();
	context.restore();
}
// 在画布上画半径为30的圆
/*function drawPoint(context,posY,posX){
	context.save();
	context.beginPath();
	context.arc(posX,posY,radius,0,2*Math.PI);
	context.globalCompositeOperation ="destination-out";
	// context.fillStyle="white";
	context.fill();
	context.save();
	context.stroke();
	// 恢复原有绘图状态
	context.restore();
}
// 画直线
function drawLine(context,x1,y1,x2,y2){
	// 保存当前绘图状态
	context.save();
	context.beginPath();
	context.lineCap = "round";
	context.lineWidth=radius*2;
	// 以原点为起点,绘制一条线
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
	// 恢复原有绘图状态
	context.restore();
}*/

function drawAll(context,x,y,x1,y1){
	context.save();
	context.beginPath();
	if (arguments.length===3) {
		context.arc(x,y,radius,0,2*Math.PI);
		context.globalCompositeOperation ="destination-out";
		// context.fillStyle="white";
		context.fill();
		context.save();
	}else if(arguments.length===5){
		context.lineCap = "round";
		context.lineWidth=radius*2;
		// 以原点为起点,绘制一条线
		context.moveTo(x,y);
		context.lineTo(x1,y1);
	}else{
		return false;
	}
	context.stroke();
	// 恢复原有绘图状态
	context.restore();
}/**/
// 清除画布
function clearRect(context){
	context.clearRect(0,0,_w,_h);
}
window.onload=function(){
	drawMask(context);
	// drawLine(context);
};

function getTransparencyPercent(context){
	var imgData = context.getImageData(0,0,_w,_h);
	var num = 0;
	for (var i = 0; i < imgData.data.length; i+=4) {
		var a = imgData.data[i+3];
		if(a===0){
			num++;
		}
	}
	var percent = (num/(_w*_h))*100;
	// console.log("透明个数"+num);
	// console.log("占总面积"+Math.ceil(percent)+"%");
	return Math.round(Math.ceil(percent));
}
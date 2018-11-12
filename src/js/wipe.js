var cas = document.querySelector("#cas");
var context = cas.getContext("2d");
var _w = cas.width;
var _h = cas.height;
var radius = 20;//涂抹半径
var lock = false;//表示鼠标状态,false为未按下,true为按下,
var posY;
var posX;


function drawMask(context){
	context.beginPath();
	context.fillStyle="#666";
	context.fill();
	context.fillRect(0,0,_w,_h);
	context.stroke();
	context.restore();
}
// 在画布上画半径为30的圆
function drawPoint(context,posY,posX){
	context.save();
	context.beginPath();
	context.arc(posX,posY,radius,0,2*Math.PI);
	context.globalCompositeOperation ="destination-out";
	context.fillStyle="red";
	context.fill();
	context.save();
	context.stroke();
	// 恢复原有绘图状态
	context.restore();
}

// 在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener("mousedown",function(ev){
	var evt = ev || window.event;
	// 获取鼠标在视口的坐标,传递参数到drawPoint
	posY = evt.clientY;
	posX = evt.clientX;
	drawPoint(context,posY,posX);
	lock=true;
},false);

cas.addEventListener("mouseup",function(evt){
	lock=false;
	// 透明大于50的时候,清除画布中的内容
	if(getTransparencyPercent(context)>=50){
		console.log("大于50%面积");
		clearRect(context);
	}
	
});
// 清除画布
function clearRect(context){
	context.clearRect(0,0,_w,_h);
}

cas.addEventListener("mousemove",function(ev){
	if (lock===true) {
		var evt = ev||window.event;
		// 获取鼠标在视口的坐标,传递参数到drawPoint
		var moveY= evt.clientY;
		var moveX = evt.clientX;
		// drawPoint(context,posY,posX);
		drawLine(context,posX,posY,moveX,moveY);
		// 每一次的结束点变成下一次开始的点
		posX = moveX;
		posY = moveY;

	}else{
		return false;
	}
},false);

function drawLine(context,x1,y1,x2,y2){
	// 保存当前绘图状态
	context.save();

	context.lineCap = "round";
	context.lineWidth=radius*2;

	context.beginPath();
	// 以原点为起点,绘制一条线
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
	// 恢复原有绘图状态
	context.restore();
}

window.onload=function(){
	drawMask(context);
	drawLine(context);
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
	console.log("透明个数"+num);
	console.log("占总面积"+Math.ceil(percent)+"%");
	return Math.round(Math.ceil(percent));
}
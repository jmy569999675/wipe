/*
 * author:569999675@qq.com
 * data:2018-11-16
*/
function Wipe(obj){
	this.coverType=obj.coverType;//����
	this.coverTypeValue=obj.coverType==="color"?obj.color:obj.imgUrl;//ͿĨ��ɫ�򸲸�ͼ
	this.conID = obj.id;
	this.cas = document.getElementById(this.conID);
	this.context = cas.getContext("2d");
	this._w = obj.width;
	this._h = obj.height;
	this.radius = obj.radius;//ͿĨ�뾶
	this.lock = false;//��ʾ���״̬,falseΪδ����,trueΪ����,
	this.posY=null;
	this.posX=null;
	this.background = obj.url||obj.text;//����ͼ·��
	console.log(this.background)
	this.cas.setAttribute("width",this._w);
	this.cas.setAttribute("height",this._h);
	if (this.background===obj.url) {
		this.cas.style.background="url("+this.background+")"+" 0 0 no-repeat";
	}else{
		this.cas.innerHTML = obj.text;
	}
	this.percent1= obj.percent;
	this.state = false;
	this.drawMask();
	this.incident();
}
//drawT()����ͻ��ߵĺ���
//����:����Ǵ�����������,�����ǻ�Բ,x��y��Բ����������
// ����Ǵ���4������,�����ǻ���,x,y����ʼ����,x1,y1�ǽ�������
Wipe.prototype.drawT = function(x,y,x1,y1){
	this.context.save();
	this.context.beginPath();
	if (arguments.length===2) {
		// this.state = false;
		this.context.arc(x-getAllOffsetLeft(cas)+getScrollLeft(),y-getAllOffsetTop(cas)+getScrollTop(),this.radius,0,2*Math.PI);
		this.context.globalCompositeOperation ="destination-out";
		// context.fillStyle="white";
		this.context.fill();
		this.context.save();
	}else if(arguments.length===4){
		// this.state = false;
		this.context.lineCap = "round";
		this.context.lineWidth=this.radius*2;
		// ��ԭ��Ϊ���,����һ����
		this.context.moveTo(x-getAllOffsetLeft(cas)+getScrollLeft(),y-getAllOffsetTop(cas)+getScrollTop());
		this.context.lineTo(x1-getAllOffsetLeft(cas)+getScrollLeft(),y1-getAllOffsetTop(cas)+getScrollTop());
	}else{
		return false;
	}
	this.context.stroke();
	// �ָ�ԭ�л�ͼ״̬
	this.context.restore();
};
// ��ʼ����ɫ
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
//���
Wipe.prototype.clearRect = function(){
	this.context.clearRect(0,0,this._w,this._h);
};

// ��ȡ͸����ռ���������İٷֱ�
Wipe.prototype.getTransparencyPercent = function(){
	var imgData = this.context.getImageData(0,0,this._w,this._h);
	var num = 0;
	var that = this;
	
	for (var i = 0; i < imgData.data.length; i+=4) {
		var a = imgData.data[i+3];
		if(a===0){
			num++;
		}
	}
	
	this.percent = (num/(this._w*this._h))*100;
	// console.log("͸������"+num);
	// console.log("ռ�����"+Math.ceil(percent)+"%");
	return Math.round(Math.ceil(this.percent));
};

// device�����豸����,������ƶ�����Ϊtrue,PC��Ϊfalse
var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
// console.log(device)
var down = device?"touchstart":"mousedown";
var move = device?"touchmove":"mousemove";
var end = device?"touchend":"mouseup";


Wipe.prototype.incident = function(){
	// ��canvas�����ϼ����Զ����¼�"mousedown",����drawPoint����
	var that = this;
	// console.log("�����ɹ�")
	cas.addEventListener(down,function(ev){
		// console.log("��갴�¼����ɹ�");
		var evt = ev || window.event;
		// ��ȡ������ӿڵ�����,���ݲ�����drawPoint
		that.posY = device ? evt.touches[0].clientY: evt.clientY;
		that.posX = device ? evt.touches[0].clientX: evt.clientX;
		that.drawT(that.posX,that.posY);
		that.lock=true;
		
	},false);

	// ������ָ�ƶ��¼�
	cas.addEventListener(move,function(ev){
		if (that.lock===true) {
			var evt = ev||window.event;
			// ��ȡ������ӿڵ�����,���ݲ�����drawPoint
			evt.preventDefault();
			var moveX = device ? evt.touches[0].clientX :evt.clientX;
			var moveY= device ? evt.touches[0].clientY : evt.clientY;
			
			// drawLine(context,posX,posY,moveX,moveY);
			that.drawT(that.posX,that.posY,moveX,moveY);
			// ÿһ�εĽ���������һ�ο�ʼ�ĵ�
			that.posX = moveX;
			that.posY = moveY;

		}else{
			return false;
		}
	},false);

	// ������ָ�뿪��Ļ
	cas.addEventListener(end,function(ev){
		that.lock=false;
		// ͸������50��ʱ��,��������е�����
		if(that.getTransparencyPercent()>=that.percent1){
			// console.log("����"+that.percent1+"%���");
			wipeCallback(that.getTransparencyPercent());
			that.clearRect(that.context);
		}
	},false);
};
// ��ȡԪ�ص�ƫ����
function getAllOffsetLeft(element){
	var allLeft=0;//�����������е�offsetLeft֮��
	while(element){
		//�������offsetLeft���Ա��浽allLeft��
		allLeft+=element.offsetLeft;
		//�ҵ������offsetParent,�����ж�λ���Եĸ�Ԫ�أ��������½��丳ֵ��element,ʵ�������ϲ��ҹ��ܣ�һֱ��body��ǩ����
		element=element.offsetParent;
	}
	return allLeft;
}
function getAllOffsetTop(element){
	var allTop=0;//�����������е�offsetLeft֮��
	while(element){
		//�������offsetLeft���Ա��浽allLeft��
		allTop+=element.offsetTop;
		//�ҵ������offsetParent,���丳ֵ��element,
		element=element.offsetParent;
	}
	return allTop;
}
// ��ȡ�������߶�
function getScrollTop(){  
    var scrollTop=0;  
    if(document.documentElement&&document.documentElement.scrollTop){  
        scrollTop=document.documentElement.scrollTop;  
    }else if(document.body){  
        scrollTop=document.body.scrollTop;  
    }  
    return scrollTop;  
}
// ��ȡ���������
function getScrollLeft(){  
    var scrollLeft=0;  
    if(document.documentElement&&document.documentElement.scrollLeft){  
        scrollLeft=document.documentElement.scrollLeft;  
    }else if(document.body){  
        scrollLeft=document.body.scrollLeft;  
    }  
    return scrollLeft;  
}

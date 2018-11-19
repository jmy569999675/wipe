ver 0.0.1
PC端实现涂抹擦除效果,超过50%的涂抹面积可以查看全部.涂抹颜色和背景图片手动指定.2018-11-12
## ver 1.0.0 ##
1. 实现了对移动端的支持
1. 函数优化
## ver 2.0.0 ##
实现了面向对象方式
增加了参数配置
## ver 3.0.0 ##
1. 浏览器在滚动距离下bug修复
1. canvas画布在有偏移和绝对定位下bug修复
1. 增加了回调函数。让用户可以自己完成后续功能

## 使用步骤说明 ##
1. 在html中添加一个指定id的canvas标签。例如：` <canvas id="cas"></canvas> `
2. 编辑配置文件:
| 属性名 | 取值类型 | 备注 |
| id | string | canvas标签的id |
| coverType | string | 取值"color"或"image" |
| imgUrl | 字符串 | 覆盖图片的路径|
|color| 字符串| 十六进制颜色码或rgba(),如果不指定颜色默认为"#666"|
|url | 字符串|涂层底部图片路径|
| width | 数字 | canvas的宽度|
|hight| 数字 | canvas的高度|
|radius| 数字| 涂抹的半径|
|percent| 数字| 透明面积占整个画布的百分比,超出就会显示全部画布|

例如:
``` 
id:"cas",//canvas 的id
coverType:"color",//表面是覆盖颜色或者是图片 color|image
imgUrl:"image/wipe2.jpg",
color:"#221234",//背景颜色
url:"image/wipe1.jpg",//背景图片
width:500,//宽度
height:667,//高度
radius:20,//画笔的半径
percent:80,//面积
 ```3. 初始化wipe插件,并将上一步的配置作为参数传入例如:``` 
 new Wipe(wipeConfig);
 ``` 4. 编写回调函数,用户在涂抹完成后继操作必须写在此回调函数中  例如: ``` 
function wipeCallback(percent){
	if(percent>50){
		console.log("面积大于"+percent+"%");
	}
}
 ``` 
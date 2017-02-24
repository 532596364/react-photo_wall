require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

var imageDates = require('../data/imageDatas.json');             //获取图片的json数据
//利用getImageURL函数，将图片信息转换成图片URL路径信息
imageDates = (function getImageURL(imageDatesArr) {
  for (var i = 0; i < imageDatesArr.length; i++) {
        var singleImageData = imageDatesArr[i];
        singleImageData.imageURL = require('../images/'+singleImageData.fileName);
        imageDatesArr[i] = singleImageData;
  }
  return imageDatesArr;
})(imageDates);

/*
 * 取范围内的随机整数
 * @param  low,high
 */
 function getRangeRandom(low,high) {
     return Math.ceil(Math.random()*(high-low)+low);
 }
//单个图片组件
class ImgFigure extends React.Component{
  render(){
    var styleObj={};
    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    return(
        <figure className="img-figure" style={styleObj}>
          <img  src={this.props.data.imageURL} alt={this.props.data.title} />
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
        </figure>

      );
  }
}

//主要的舞台组件
class AppComponent extends React.Component {


  /*
  * 重新布局所有图片
  * @param centerIndex 指定居中排布哪个图片
  */
  rearrange(centerIndex){
      var imgsArrangeArr = this.state.imgsArrangeArr, //获取图片位置信息数组
          Constant = this.Constant,                   //获取定位位置对象
          centerPos = Constant.centerPos,             //获取  居中位置信息
          hPosRange = Constant.hPosRange,             //获取  水平位置信息
          h_leftSecX = hPosRange.leftSecX,              //获取  左侧x位置信息
          h_rightSecX= hPosRange.rightSecX,             //获取  右侧x位置信息
          h_y = hPosRange.h_y,                          //获取  y位置信息
          vPosRange = Constant.vPosRange,             //获取  顶部位置信息
          v_x = vPosRange.v_x,                          //获取  顶部x位置信息
          v_y = vPosRange.v_y;                          //获取  顶部y位置信息

      //获取居中图片index并居中处理
      var imgsArrangeArrCenter = imgsArrangeArr.splice(centerIndex,1);
          imgsArrangeArrCenter.pos= centerPos;
      //获取顶部图片index并处理
      var topImgNum = Math.ceil(Math.random()*2),
          topIndex = 0,
          imgsArrangeArrTop = [];
          if (topImgNum) {
            topIndex = Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum+1));
            imgsArrangeArrTop = imgsArrangeArr.splice(topIndex,topImgNum);
            imgsArrangeArrTop.forEach(function(value,index){
              imgsArrangeArrTop[index].pos={
                left: getRangeRandom(v_x[0],v_x[1]),
                top: getRangeRandom(v_y[0],v_y[1])
              };
            });
          }
      //获取水平方向上的图片信息并处理
      var k = Math.ceil(imgsArrangeArr.length/2);
      for (var i = 0; i <  imgsArrangeArr.length; i++) {
          if (i<k) {
            imgsArrangeArr[i].pos = {
              left:  getRangeRandom(h_leftSecX[0],h_leftSecX[1]),
              top: getRangeRandom(h_y [0],h_y [1])
            }
          }else{
            imgsArrangeArr[i].pos = {
              left: getRangeRandom(h_rightSecX[0],h_rightSecX[1]),
              top: getRangeRandom(h_y [0],h_y [1])
            }
          }
      }

      //将取出的数组元素修改之后放回去
      //顶部图片
      if (imgsArrangeArr && imgsArrangeArrTop) {
        for (var i = topImgNum-1; i >= 0; i--) {
           imgsArrangeArr.splice(topIndex,0,imgsArrangeArrTop[i]);
        }
      }
      //中间图片
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeArrCenter);

      this.setState({
          imgsArrangeArr: imgsArrangeArr
      })

  }
  //初始化数据
  constructor(props) {
        super(props);
        this.state = { imgsArrangeArr: []};
        //位置范围常量
        this.Constant= {
          centerPos:{
            left:0,
            top: 0
          },
          hPosRange:{
            leftSecX:[0,0],
            rightSecX:[0,0],
            h_y:[0,0]
          },
          vPosRange:{
            v_x:[0,0],
            v_y:[0,0]
          }
        };
    }
  //组件加载后运行函数
  componentDidMount(){
      //舞台的宽高以及半宽半高
      var stageDOM = this.refs.stage,
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW/2),
          halfStageH = Math.ceil(stageH/2);

      //图片的宽高以及半宽半高
      var imgDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
          imgW = imgDOM.scrollWidth,
          imgH = imgDOM.scrollHeight,
          halfImgW = Math.ceil(imgW/2),
          halfImgH = Math.ceil(imgH/2);


      //中央图片的位置
      this.Constant.centerPos = {
          left: halfStageW - halfImgW,
          top: halfStageH - halfImgH
      };
  //水平方向上左右两侧图片范围start
      //左
      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      //右
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      //垂直
      this.Constant.hPosRange.h_y[0] = -halfImgH;
      this.Constant.hPosRange.h_y[1] = stageH - halfImgH;
  //水平方向上左右两侧图片范围end
  //垂直方向上顶部图片范围start
      this.Constant.vPosRange.v_x[0] = halfStageW - imgW;
      this.Constant.vPosRange.v_x[1] = halfStageW;
      this.Constant.vPosRange.v_y[0] = -halfImgH;
      this.Constant.vPosRange.v_y[1] = halfStageH - halfStageH*3;
  //垂直方向上顶部图片范围end
      //默认居中第一章图片
      this.rearrange(0);
  }

  render() {
    var controllerUnits=[],
        that = this,
        imgFigures=[];
    imageDates.map(function(value,index){
        //如果图片的位置信息不存在的话，初始化所有图片位置
        if (!that.state.imgsArrangeArr[index]) {
          that.state.imgsArrangeArr[index]={
              pos:{
                left:0,
                top:0
              }
          }
        }
        imgFigures.push(<ImgFigure key={index} data={value} arrange={this.state.imgsArrangeArr[index]} ref={'imgFigure'+index} />);
      }.bind(this));
    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

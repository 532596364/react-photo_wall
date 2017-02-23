require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//获取图片的json数据
var imageDates = require('../data/imageDatas.json');
//利用getImageURL函数，将图片信息转换成图片URL路径信息
imageDates = (function getImageURL(imageDatesArr) {
  for (var i = 0; i < imageDatesArr.length; i++) {
        var singleImageData = imageDatesArr[i];
        singleImageData.imageURL = require("../images/"+singleImageData.fileName);
        imageDatesArr[i] = singleImageData;
  };
  return imageDatesArr;
})(imageDates);


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
          <section className="img-sec">
          </section>
          <nav className="controller-nav">
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

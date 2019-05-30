# 项目介绍

本项目是一个uni-app，使用HBuilderX工具打开即可。因项目中运用了微信小程序组件，所以只能运行在微信小程序端。

# 功能

能够用于复利计算，定投计算，分期利率等计算。

# 体验

使用微信扫码即可体验

![](README_files/1.jpg)

# 目录结构

fuli2
├─ .gitignore	
├─ App.vue
├─ common      通用样式文件
│    ├─ bootstrap.wxss
│    ├─ vant.css
│    └─ weui.wxss
├─ components  复合uni-app规范的组件
│    ├─ guide.vue  提示用户添加小程序的组件
│    └─ u-charts   展示图表的工具
│           └─ u-charts.js
├─ main.js     主要配置
├─ manifest.json
├─ pages      页面文件夹
│    ├─ compound      计算复利
│    │    └─ compound.vue    
│    ├─ houseModel    计算二手房投资
│    │    └─ houseModel.vue
│    ├─ installment   计算分期利率
│    │    └─ installment.vue
│    ├─ investment    计算定投
│    │    └─ investment.vue
│    ├─ investmentChart  图表展示
│    │    └─ investmentChart.vue
│    └─ more
│           └─ more.vue   更多页面
├─ pages.json          小程序配置
├─ static              静态资源
├─ uni.scss
└─ wxcomponents
       ├─ customer     自定义组件库
       │    └─ cell
       ├─ i-view       iview组件库
       └─ vant         有赞组件库

# License
 
 MIT

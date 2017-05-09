# KonaChan mirror
konachan的主页是在是太丑了，所以做了个[美化站](http://konachan.zcwsr.com)，内容完全一样，支持关键词搜索，滚动到底自动加载

## 注意
本站不支持手机浏览，懒得搞响应式，见谅！

由于konachan使用了防盗链技术，所以本站无法在页内直接显示全分辨率大图，点击图片会直接打开源站点图片详情页

__还请多多支持konachan原站点，人家开放接口已经很良心了!__

## API
### HOST: konachan-api.zcwsr.com
支持jsonP

类别 | 接口 | 返回参数 | 传入参数 | 描述
--- | --- | --- | --- | ---
TAG | /tag/[:tag] | 见[konachan.com/tag.json](http://konachan.com/tag.json) | 无 | 不传tag则获取全部
POST | /post | 见[konachan.com/tag.json](http://konachan.com/post.json) | tags | 要搜索的tags,用逗号分割
| | | | page | 页数，从第一页开始，不传默认返回第一页
| | | | safe | 返回的图片是否包括R-18，false为是

 ## 技术栈
 后台：express做的jsonp代理

 前端：react + antDesign 

 算是尝试的第一个react小项目，接下来会完善一下。
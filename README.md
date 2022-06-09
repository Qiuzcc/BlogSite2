# 个人博客网站

### 一、项目简介

#### 背景

学习计算机专业多年，从来没有自己做过网站，觉得是一个遗憾。今年开年的学期，没有课程了，所以决定自己动手造一个网站，由于自己平时喜欢拍拍照片、出去游玩，所以就决定造一个图文类的博客网站。但是之前没有学过前端的技术，几乎从零开始，边学边做。前一周学和练HTML和CSS，但是只能做静态网页。后面找到了Express框架，终于可以搭建一个能够和服务端数据库交互的真正意义上的网站（而不只是网页）。话不多说，直接上实现后的界面效果图



#### 效果图

**主页**

![image-20220609110722728](https://qiuzcc-typora-images.oss-cn-shenzhen.aliyuncs.com/images/2022/202206091112321.png)



**分类页**

![image-20220609110747279](https://qiuzcc-typora-images.oss-cn-shenzhen.aliyuncs.com/images/2022/202206091112015.png)



**照片页**

![image-20220609110756776](https://qiuzcc-typora-images.oss-cn-shenzhen.aliyuncs.com/images/2022/202206091112378.png)



**后台管理页**

![image-20220609110813437](https://qiuzcc-typora-images.oss-cn-shenzhen.aliyuncs.com/images/2022/202206091112641.png)





### 二、项目规划

实际项目搭建花了两次，第一次是刚接触Express框架，作为熟悉入门，但是后面文件越建越多的时候，明显感觉到项目极不规范，

所以这时重头搭建了一次，从项目的全局规划开始，

**第一步**，设计全局的路由规划、数据Model、资源目录的分组、项目文件的分组；

**第二步**，学习git版本管理，按项目进度阶段保存项目的版本（所以也是git管理的练手项目）；

**第三步**，就是分页面进行UI设计、功能实现。

下面是具体的规划设计（实际项目过程中有一些变动，另外增加了一个Model）

#### **路由规划**

| 地址                       | 页面                                         | 控制器、方法                           | view                       |
| -------------------------- | -------------------------------------------- | -------------------------------------- | -------------------------- |
| /                          | 首页                                         | homeController.home                    | home                       |
| /article/:id               | 文章详情页                                   | articleController.detail               | article_detail             |
| /article/classifier        | 文章分类页                                   | articleController.classifier           | classifier                 |
| /article/classifier/study  | 文章分类页（学习笔记）                       | articleController.classifier_study     | classifier_study           |
| /article/classifier/life   | 文章分类页（生活感悟）                       | articleController.classifier_life      | classifier_life            |
| /article/classifier/other  | 文章分类页（其它）                           | articleController.classifier_other     | classifier_other           |
|                            |                                              |                                        |                            |
| /photos                    | 照片展示页                                   | photoController.home                   | photos                     |
| /photos/:id                | 照片详情页                                   | photoController.detail                 | photo_detail               |
|                            |                                              |                                        |                            |
| /manage/article/all        | 文章管理页（全部分类）<br />后台管理默认页面 | articleController.manage_list          | manage_article             |
| /manage/article/study      | 文章管理页（学习笔记）                       | articleController.manage_study         | manage_article_study       |
| /manage/article/life       | 文章管理页（生活感悟）                       | articleController.manage_life          | manage_article_life        |
| /manage/article/other      | 文章管理页（其它）                           | articleController.manage_other         | manage_article_other       |
| /manage/article/:id        | 文章详情管理页                               | articleController.manage_detail        | manage_article_detail      |
| /manage/article/:id/update | 无页面（提交文章修改post）                   | articleController.manage_detail_update | 重定向到文章详情页         |
| /manage/article/:id/remove | 无页面（提交文章删除请求）                   | articleController.manage_detail_remove | 重定向到文章管理页（全部） |
|                            |                                              |                                        |                            |
| /manage/photos             | 照片管理页                                   | photoController.manage_list            | manage_photos              |
| /manage/photos/:id         | 照片详情管理页                               | photoController.manage_detail          | manage_photos_detail       |
| /manage/photos/:id/update  | 无（提交照片修改post）                       | photoController.manage_detail_update   | 重定向到照片详情页         |
| /manage/photos/:id/remove  | 无（提交照片remove）                         | photoController.manage_detail_remove   | 重定向到照片管理页         |
|                            |                                              |                                        |                            |
| /manage/people             | 个人信息管理页                               | peopleController.manage                | manage_people              |
| /manage/people/update      | 无页面（提交修改表单）                       | peopleController.update                | 重定向到manage_people      |
|                            |                                              |                                        |                            |
| /manage/new/article        | 文章发布页                                   | articleController.manage_new           | manage_new_article         |
| /manage/new/article/create | 无页面（提交文章新建的post）                 | articleController.manage_new_create    | 重定向到文章详情页         |
| /manage/new/photo          | 照片上传页                                   | photoController.manage_new             | manage_new_photo           |
| /manage/new/photo/upload   | 无页面（照片上传的post）                     | photoController.manage_new_upload      | 重定向到照片详情页         |



#### **数据Model**

- Article

| 字段           | 类型    | 描述                                          |
| -------------- | ------- | --------------------------------------------- |
| title          | String  | 文章标题 required:true                        |
| classification | String  | 文章分类 required: true, default: "其它"      |
| abstract       | String  | 文章摘要                                      |
| content        | String  | 文章内容                                      |
| picture        | String  | 配图的路径+文件名                             |
| timestamp      | Date    | 创建时间 default: Date.now()                  |
| url            | virtual | /article/this.id                              |
| date           | virtual | moment(this.timestamp).format("YYYY MMMM Do") |

- People

| 字段        | 类型   | 描述                                |
| ----------- | ------ | ----------------------------------- |
| name        | String | 昵称                                |
| description | String | 简介                                |
| photo       | String | 头像的路径+文件名                   |
| github      | String | github链接（需要添加前缀https://)   |
| wechat      | String | 微信名片图片的路径+文件名           |
| weibo       | String | 微博首页链接（需要添加前缀https://) |

- Photos

| 字段        | 类型    | 描述                                          |
| ----------- | ------- | --------------------------------------------- |
| title       | String  | 照片标题                                      |
| description | String  | 照片简介                                      |
| file        | String  | 照片保存的路径+文件名                         |
| timestamp   | Date    | 照片上传的时间 default:Date.now()             |
| views       | Number  | 点击量 default:0                              |
| url         | virtual | /photos/this.id                               |
| date        | virtual | moment(this.timestamp).format("YYYY MMMM Do") |



#### **public目录**

| 目录            | 说明                   |
| --------------- | ---------------------- |
| ...             | 其它自带的目录         |
| /images/article | 保存所有的文章配图     |
| /images/people  | 保存个人头像、微信名片 |
| /images/photos  | 保存所有上传的照片     |



### 三、项目收获

#### 项目亮点

外观设计比较整洁美观，页面做了响应式设计，具有交互性的动效

功能比较完整，能够在网页上实现增删改的操作



#### 项目难点

**富文本编辑器的应用**

这是目前为止，没有解决的问题。文章管理那一部分，我本来是想通过一个富文本编辑器的插件来实现编辑和修改的。可用的富文本编辑器插件有很多，原理基本都是把编辑器的内容保存为html文件，存放到服务器上，访问文章的时候返回html文件。这里涉及到一个冲突，因为文章页我自己设计的是有一个导航栏+页头背景图的，所以已经需要有一个jade文件来渲染了，所以没有办法直接返回只有文章内容的html（学习了html之后，发现可能可以通过iframe实现html的嵌入）。另外文章图片的插入预想也比较麻烦，文章里面（或者说html里面）不可能直接放置照片，只能放置照片的url，所以照片的保存需要另外处理。文章的修改也比较麻烦，预想方案是文章纯文本和html各自保存一份，修改直接在纯文本上做，改完覆盖掉原来的html。



**文章分类数量的管理**

算不上难点，但也能算是一个技术点，涉及到数据库的操作思路。在首页放置了一个分类的卡片标签，左侧为分类名字，右侧为该分类下的文章数量。一开始规划的时候之后Article一个数据模型，里面保存了文章的详细信息和分类信息，但是如果只有这个Model的话，每次加载首页的时候，都要把Article 集合（Collection）里面所有记录遍历一遍，所以明显不够合理。为此，增加了一个Classifier的数据Model，专门用来记录分类的数量信息。这样做的优势在于：查询效率很高；缺点在于：文章做增删改查时多了一个要维护的数据Model，增加了文章增删改查的工作量。



#### 实践经验

通过这次项目，上手练习了多项技术，有**Express框架、bootstrap框架、MongoDB数据库、Node.js服务器、jade语言，还有git版本管理工具**。

以上列举的，都是第一次使用的框架和工具。

**Express框架**是通过另外一个教程接触的，但是在搭建本项目的过程中，才更深刻地了解到里面的一些原理，如它的路由机制是怎样一条链路（网页的链接url——router文件——Controller管理器的具体函数——[渲染的新页面]）。

为了高效的管理页面样式，在编辑页面UI之前，特定花了一两天时间，阅读了一边**bootstrap5**的参考文档，在设计页面的时候尽量使用了bootstrap的元素和组件，比如所有的卡片、照片页的轮播图、表单、侧边导航栏。

为了实现开发过程中的版本管理，花了半天的时间学习**git如何使用**，并记录了阅读笔记，在开发过程中，通过tag和分支保存并同步到github多个版本。

页面采用**jade语言**写的（问为什么选jade，因为express默认采用了jade模板引擎），这个语言也是之前完全陌生的，所以写的时候遇到很多不知道解决的问题，尽管它确实有很多优势（语法糖、书写简洁、可以嵌套、可以复用等），但是配套的教程文档太少，有时一些特别的问题无从解决。



在开发过程中，也深切感受到了Express的一些局限（也有可能是我还没有发掘出Express对应的用法）

比如Express使用jade模板引擎，有一个好处就是每次可以传入不同的数据从而渲染出不同的页面。但是也有一个弊端，就是jade没有办法像html一样嵌入javasript代码或文件，所以想要实现涉及到数据方面的交互很困难（一般都交互还是可以的，把javasript文件放到public目录下就可以引用了）。当时想要在页面里面做一个分类管理的时候，发现没有办法通过js交互来改变显示的数据。



#### 不足

这个项目是在零星学了一些HTML和CSS的基础上开始的，在做这个项目之前没有比较体系化地接受到前端知识的培训，所以在实际做的过程中存在着挺多局限。在写此文的时候，笔者已经较为系统地学习了HTML和CSS的入门知识，就已经发现了一个很不规范的地方，就是页面书写的时候没有结构化的意识，大量使用了div这种无语义的元素（知识局限、不知道有那么多的语义元素），所以写出来的文件可读性较差。
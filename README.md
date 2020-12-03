## 目的
通过自己动手构建React开发环境来熟悉Webpack以及Git的使用，通过平时学习小案例来充实项目

### 1. npm init -y
在工作目录初始化一个package.json文件来管理项目用到的依赖

### 2. 安装webpack打包工具(webpack webpack-dev-server)
`npm install webpack webpack-dev-server webpack-cli --save-dev` 由于后面因为webpack和webpack-dev-server版本兼容出现了问题，所以这里指定版本号`npm i webpack@3.10.0 webpack-dev-server@2.9.7 --save-dev`

### 3. 安装React核心依赖(react react-dom)
`npm i react react-dom --save`

### 4. 安装html-webpack-plugin处理html文件
`npm i html-webpack-plugin --save-dev`
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
```
**目前就可以实现一次简单的React开发了**
> 目前没有安装处理ES6等高级语法的loader，也没有安装处理jsx的loader，所以我们创建元素就不能使用React推荐的jsx语法，只能使用`React.createElement()`创建

```javascript
  // src/index.html
  <!DOCTYPE html>
  <html>
    <head></head>
    <body>
      <div id='root'></div>
    </body>
  </html>
  // src/index.js
  import React from 'react';
  import ReactDOM from 'react-dom';

  ReactDOM.render(React.createElement('h1',null,'hello'),document.getElementById('root'));
```
在终端执行`node_modules/.bin/webpack`就可以进行打包，当然为了方便可以对这句命令进行配置，在package.json中添加一下字段
```json
  "scripts": {
      "dist": "node_modules/.bin/webpack"
    },
```
这样我们就可以使用`npm run dist`进行打包了
打包完成后会在当前目录下出现一个dist文件，里面有打包好的文件，执行index.html就可以看到结果，它会自动引入打包好的js文件
但是每次都需要重新打包，webpack-dev-server解决自动重新打包
```javascript
  // webpack.config.js
  module.export = {
    ...
    devServer: {
      contentBase: "./dist",
      port: 3000,
      open: true,
    },
  }
  // package.json中script下添加配置
  "dev": "node_modules/.bin/webpack-dev-server"
```
这样`npm run dev`就可以实现动态打包，实时显示内容了

## 处理`ES6`语法
1. 安装`loader`

```
npm install babel-core babel-preset-env babel-loader --dev
```
2. 添加配置

```
module.exports = {
    // entry, output 省略
    module: {
        rules: [
            {
                test: /\.js$/,  // 需要处理的文件
                exclude: /(node_modules)/,  // 排除一些文件
                use: {
                    loader: 'babel-loader',
                    options: {
                        preset: ['env'],   // 'babel-preset-env'的缩写
                    }
                }
            }
        ]
    }
    // plugin省略
}
```

## 处理`React`语法
1. 安装`babel-preset-react`

```
yarn add babel-preset-react --dev
```
2. 添加配置，很简单只需要在上述`ES6`处理中的`preset`后面添加`react`就好

`preset: ['env']  --> preset: ['env','react']`

## 处理css
1. 安装loader

```
yarn add style-loader css-loader --dev
```

2. 添加配置

```
module.exports = {
    // entry, output 省略
    module: {
        rules: [
            // babel-loader省略
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']  // 注意处理从右向左
            }
        ]
    }
    // plugin省略
}
```


## 使用`extract-text-webpack-plugin`插件
1. 为什么要使用它
> 上述处理css的方法，打包完成后css文件被打包在了js文件中，它会在所有js执行完在执行css，如果js文件很多的话会有一段时间是没有样式的，所以我们需要将css文件单独打包到一个文件中
2. 安装插件

```
yarn add extract-text-webpack-plugin --dev
```
3. 修改配置（只需要修改即可）

```
    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: "css-loader'
        })
    }

    // 在plugin中注册一下
    plugin: [
        new ExtractTextPlugin('style.css')      // 输出文件名
    ]
```
4. 打包完成后会在dist文件下生成style.css

## 处理scss
```
yarn add sass-loader --dev
```
和处理css样式一样，只需要修改fallback下面的use
`use: 'css-loader'  -->   use: ['css-loader', 'sass-loader']`

**注意有个坑，安装sass-loader后还必须安装node-sass,这个包安装起来很慢哦**

## 处理图片`file-loader`或者`url-loader`
> url-loader 功能与 file-loader 类似，但是对于文件大小低于指定限制时，可以放回一个 DataURL，不单独生产文件
**url-loader依赖与file-loader，也就是说两个都要安装**
1. 安装loader

```
yarn add file-loader url-loader --dev
```

2. 添加配置

```
module.exports = {
    // entry,output省略

        // css,sass配置省略
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192     // 小于 8k生成base64文件
                    }
                }
            ]
        }
    // plugin省略
}
```

## 字体配置
<a href='http://www.fontawesome.com.cn/'>Font Awesome中文网</a>

1. 安装font awesome
```
yarn add font-awesome
```

2. 引入
   在node_modules下找到font-awesome，选择自己想用的css/less/scss记住路径就好
```
// 在index.js中引入
import 'font-awesome/css/font-awesome.min.css';
```
**一般字体的引入写在样式引入的最前面**
3. 然后就可以在文件中使用了，具体怎么使用就要看你喜欢什么字体，然后通过文档进行具体引入
4. 对字体文件使用file-loader处理或者url-loader处理

```
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            }
```

<h3 style='color: red;'>一切都是那么的ok</h3>

## 实现自动刷新`webpack-dev-server`
1. 安装

```
yarn add webpack-dev-server --dev
```
2. 在`webpack.config.js`中配置
```
module.exports = {
    // 省略

    devServer: {
        contentBase: './dist'
    }
}
```

3. 如果发现样式很字体图标无法显示，可能是dist/index.html引入这些文件时，路经却一点，此时可以在webpack.config.js中的output下加入`publicPath: '/dist/'`,


## 问题
1. Cannot find module 'webpack-cli/bin/config-yargs'
产生原因: `webpack`版本与`webpack-dev-server`版本不兼容
处理办法: 指定webpack和webpack-dev-server的版本为3.10.0 和 2.9.7
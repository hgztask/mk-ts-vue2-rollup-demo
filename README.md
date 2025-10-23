# 油猴脚本使用typeScript+vue2+rollup项目演示

## 项目介绍

这是一个油猴脚本项目，使用typeScript + vue2 + rollup打包

local_build.js为默认配置打包名，可自定义

## 项目运行

```bash
# 安装依赖
npm install

# 或者使用yarn安装依赖
yarn
# 开发模式
npm run dev

# 生产模式
npm run build
```

## 项目打包

- 打包

```bash
  yarn run build
```

```bash
  npm run build
```

## 本地项目部署

- 假设已经按照了油猴插件
- 在插件拓展设置中勾选上`允许访问文件 URL`
- 插件中新建一个脚本，填写如下内容

```javascript
// ==UserScript==
// @name      mk-vue2-rollup-demo
// @namespace http://tampermonkey.net/
// @license   Apache-2.0
// @version   1.0
// @author    byhgz
// @icon      https://static.hdslb.com/images/favicon.ico
// @noframes  
// @run-at    document-start
// @grant     GM_setValue
// @grant     GM_getValue
// @grant     GM_deleteValue
// @grant     GM_addStyle
// @grant     GM_unregisterMenuCommand
// @grant     GM_registerMenuCommand
// @match     *://localhost/*
// @require   https://unpkg.com/vue@2.7.16/dist/vue.min.js
// @require   https://unpkg.com/element-ui@2.15.14/lib/index.js
// @require     file://E:\js\dist\local_build.js
// ==/UserScript==

/**
 * 上面中的引用地址，根据项目本地实际路径进行修改，这里仅供参考
 * file://E:\js\dist\local_build.js
 *
 */
```

- 如果在localhost本地地址测试时，不需要其他脚本干扰，可以在对应脚本头部配置中添加
- `@exclude   http://localhost:3002/`
- 这里的端口可根据项目实际端口进行修改
- 如需本地测试，将[rollup.config.js](rollup.config.js)配置中serve函数取消注释掉，并运行`npm run dev`
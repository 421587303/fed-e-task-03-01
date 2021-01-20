# Vue-Router原理

### Hash模式和History模式的区别

#### 表现形式的区别

- Hash模式
  - https://music.163.com/#/playlist?id=123
- History模式(服务端配合)
  - Https://music.163.com/playlist/123

#### 原理的区别

- Hash模式是基于锚点，以及onhashchange事件
- History模式是基于HTML5中的History API
  - history.pushState()  IE10以后才支持
  - history.replaceState()

#### History模式的使用

- History需要服务器的支持
- 单页应用中，服务器不存在http://xxx.xxx.com/login这样的地址会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的index.html

#### History模式-Node.js

通过content-history-api-fallback模块来处理history

#### History模式-nginx

![image-20200717140210187](/Users/diaomin/Library/Application Support/typora-user-images/image-20200717140210187.png)

需要这一行nginx的配置



### VueRouter 实现原理

#### Hash模式

- URL中#后面的内容作为路径地址
- 监听hashchange事件
- 根据当前路由地址找到对应组件重新渲染

#### History模式

- 通过history.pushState()方法改变地址栏
- 监听popstate事件
- 根据当前的路由地址找到对应组件重新渲染

#### 类图

 <img src="/Users/diaomin/Library/Application Support/typora-user-images/image-20200717141232367.png" alt="image-20200717141232367" style="zoom:30%;" />

#### VueRouter-install

``` javascript
export default class VueRouter {
  static install(Vue) {
    // 如果插件已经安装直接返回
    if (VueRouter.install.installed && _Vue === Vue) return;
    VueRouter.install.installed = true;
    _Vue = Vue;
    Vue.mixin({
      beforeCreate() {
        // 判断 router 对象是否已经挂载了 Vue 实例上
        if (this.$options.router) {
          // 把 router 对象注入到 Vue 实例上
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }
}
```



#### VueRouter-constructor

```javascript
constructor (options) { 
  this.options = options 
  // 记录路径和对应的组件 
  this.routeMap = {} 
  this.data = _Vue.observable({
    current: '/' 
    }) 
}
```



#### VueRouter-createRouteMap

遍历所有路由规则解析成键值对的形式存储到routeMap中

```javascript
initRouteMap () { 
  // routes => [{ name: '', path: '', component: }] 
  // 遍历所有的路由信息，记录路径和组件的映射 
  this.options.routes.forEach(route => { 
    // 记录路径和组件的映射关系 
    this.routeMap[route.path] = route.component }) 
}
```

#### VueRouter-initComponents

- 创建了router-link组件

- 创建router-view

  ```javascript
  initComponents () { 
    _Vue.component('RouterLink', { 
      props: { to: String },
  // 需要带编译器版本的 Vue.js 
  // template: "<a :href='\"#\" + to'><slot></slot></a>" 
  // 使用运行时版本的 Vue.js 
    render (h) { 
    return h('a', { attrs: { href: '#' + this.to } }, [this.$slots.default]) } 
    })
    const self = this 
    _Vue.component('RouterView', { render (h) { 
    // 根据当前路径找到对应的组件，注意 this 的问题 
    const component = self.routeMap[self.app.current] 
    return h(component) } }) 
  }
  ```

- 注意：

  - vue-cli 创建的项目默认使用的是运行时版本的 Vue.js
  - 如果想切换成带编译器版本的 Vue.js，需要修改 vue-cli 配置
    - 项目根目录创建 vue.config.js 文件，添加 runtimeCompiler

  ```javascript
  module.exports = { runtimeCompiler: true }
  ```



#### VueRouter-init

```javascript
init () { 
  this.initRouteMap() 
  this.initEvents() 
  this.initComponents() 
}

// 插件的 install() 方法中调用 init() 初始化 
if (this.$options.router) { 
  _Vue.prototype.$router = this.$options.router 
  // 初始化插件的时候，调用 init 
  this.$options.router.init() 
}
```





#### VueRouter-initEvent

通过popstate事件处理浏览器的问题

``` javascript
initEvents () { 
  // 当路径变化之后，重新获取当前路径并记录到 current 
  window.addEventListener('hashchange', this.onHashChange.bind(this)) 
  window.addEventListener('load', this.onHashChange.bind(this)) 
}

onHashChange () { 
    this.data.current = window.location.hash.substr(1) || '/' 
}
```


import Vue from 'vue'
import App from './App.vue'
import VueRouter from './vuerouter'

Vue.config.productionTip = false

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('./components/HelloWorld')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('./components/Home')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./components/About')
  }
];
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
new Vue({
  render: h => h(App),
  router
}).$mount('#app');

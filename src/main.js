// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency'
 
Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;

Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to, from, next) => {
  //console.log('to', to, 'from', from, 'next', next);

  if(to.meta.requiresAuth) {
    console.log('needs auth');

    const api = `${process.env.API_PATH}/api/user/check`;
    axios.post(api).then((response) => {
        //console.log(response.data);
        if(response.data.success) {
          next();
        } else {
          next({
            path: '/login',
          });
        }
    });
  } else {
    next();
  }

});

import Vue, { registerElement } from 'nativescript-vue';
import * as views from './views';


Vue.component(views.Home.name, views.Home);
new Vue({
    template: `
      <Frame>
        <Home />
      </Frame>
    `
}).$start();

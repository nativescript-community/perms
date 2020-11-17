import { Trace } from '@nativescript/core';
import { PermsTraceCategory } from '@nativescript-community/perms';
import Vue from 'nativescript-vue';
import * as views from './views';

Trace.addCategories(PermsTraceCategory);
// Trace.addCategories(CollectionViewTraceCategory);
Trace.enable();
Vue.component(views.Home.name, views.Home);
new Vue({
    template: `
      <Frame>
        <Home />
      </Frame>
    `
}).$start();

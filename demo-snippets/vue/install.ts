import Vue from 'nativescript-vue';
import Basic from './Basic.vue';
import { Trace } from '@nativescript/core';
import { PermsTraceCategory } from '@nativescript-community/perms';
Trace.addCategories(PermsTraceCategory);
Trace.enable();

export function installPlugin() {}

export const demos = [{ name: 'Basic', path: 'basic', component: Basic }];

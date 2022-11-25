/// <reference path="./node_modules/@nativescript/types-ios/lib/ios.d.ts" />
/// <reference path="./node_modules/@nativescript/types-android/lib/android-32.d.ts" />
/// <reference path="../src/references.d.ts" />

// typings/custom.d.ts
declare module 'nativescript-worker-loader!*' {
    const content: any;
    export = content;
}

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

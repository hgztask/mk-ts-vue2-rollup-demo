// src/shims-vue.d.ts
declare const __DEV__: boolean;

declare module '*.vue' {
    export default Vue;
}
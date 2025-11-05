// src/shims-vue.d.ts
declare const __DEV__: boolean;

declare module '*.vue' {
    export default Vue;
}

declare module "*.css" {
    const content: string;
    export default content;
}

interface DefReturnTempValType {
    state: boolean,
    type?: string,
    matching?: string | number
}

interface Window {
    mk_win: Window,
    parseUrl,
    addButton
}
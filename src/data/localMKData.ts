export default {
    //获取抽屉快捷键
    getDrawerShortcutKeyGm() {
        return GM_getValue('drawer_shortcut_key_gm', '`')
    }
}
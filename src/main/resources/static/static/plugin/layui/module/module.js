window.rootPath = (function (src) {
    src = document.currentScript
        ? document.currentScript.src
        : document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.config({
    base: rootPath,
    version: "2.9.3"
}).extend({
    admin: "admin/admin",// 框架布局组件
    convert: "convert/convert",// 数据转换
    drawer: "drawer/drawer",// 抽屉弹层组件
    excel: "excel/excel",// excel导出组件
    frame: "frame/frame",// 内容页面组件
    fullscreen: "fullscreen/fullscreen",//全屏组件
    loading: "loading/loading",// 加载组件
    menu: "menu/menu",// 数据菜单组件
    message: "message/message",// 通知组件
    popup: "popup/popup",// 弹层封装
    xmSelect: "xmSelect/xm-select",// 选择组件
    tab: "tab/tab",// 多选项卡组件
    tinymce: "tinymce/tinymce",
    theme: "theme/theme",// 主题转换
    yaml: "yaml/yaml",// yaml 解析组件
}).use(['layer', 'theme'], function () {
    layui.theme.changeTheme(window, false);
});
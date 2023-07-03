/*Layui Module 的路径*/
window.modulePath = (function (src) {
    src = document.currentScript
        ? document.currentScript.src
        : document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.config({
    base: modulePath,
    version: "2.8.4"
}).extend({
    iconPicker: 'iconPicker/iconPicker'
});
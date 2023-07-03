/**
 * Layui图标选择器
 * Layui version 2.8.4
 * version 1.1
 */

layui.define(['laypage', 'form'], function (exports) {
    "use strict";

    let IconPicker = function () {
        this.v = '1.1';
    }
        , _MOD = 'iconPicker'
        , $ = layui.jquery
        , BODY = 'body'
        , iconPickerPath = layui.cache.modules['iconPicker'];

    /**
     * 渲染组件
     * @param options.elem {Object} DOM选择器
     * @param options.url {String} Layui图标svg的url地址
     * @param options.type {String} 图标数据类型：fontClass/unicode
     * @param options.page {Boolean} 是否分页：true/false
     * @param options.limit {Number} 每页显示数量
     * @param options.search {Boolean} 是否开启搜索：true/false
     * @param options.cellWidth {Object} 每个图标格子的宽度：'43px'或'20%'
     * @param options.click {Object} 点击回调
     * @param options.success {Object} 渲染成功后的回调
     */
    IconPicker.prototype.render = function (options) {
        let layuiParentPath = iconPickerPath.substring(0, iconPickerPath.lastIndexOf('/layui/'))
        let defaultSvgUrl = layuiParentPath + '/layui/font/iconfont.svg';//Layui图标的svg默认路径
        let elem = options.elem
            , svg_url = options.url == null ? defaultSvgUrl : options.url
            , type = options.type == null ? 'fontClass' : options.type
            , page = options.page == null ? true : options.page
            , limit = options.limit == null ? 12 : options.limit
            , search = options.search == null ? true : options.search
            , cellWidth = options.cellWidth
            , click = options.click
            , success = options.success
            , data = {} // json数据
            , tmp = new Date().getTime()// 唯一标识
            , isFontClass = type === 'fontClass'// 是否使用的class数据
            , ORIGINAL_ELEM_VALUE = $(elem).val()// 初始化时input的值
            , TITLE = 'layui-select-title'
            , TITLE_ID = 'layui-select-title-' + tmp
            , ICON_BODY = 'layui-iconPicker-' + tmp
            , PICKER_BODY = 'layui-iconPicker-body-' + tmp
            , PAGE_ID = 'layui-iconPicker-page-' + tmp
            , LIST_BOX = 'layui-iconPicker-list-box'
            , selected = 'layui-form-selected'
            , unselect = 'layui-unselect';

        let picker = {
            init: function () {
                data = common.getData[type]();

                picker.hideElem().createSelect().createBody().toggleSelect();
                picker.preventEvent().inputListen();
                common.loadCss();

                if (success) {
                    success(this.successHandle());
                }

                return picker;
            }, successHandle: function () {
                return {
                    options: options, data: data, id: tmp, elem: $('#' + ICON_BODY)
                };
            }, /**
             * 隐藏elem
             */
            hideElem: function () {
                $(elem).hide();
                return picker;
            }, /**
             * 绘制select下拉选择框
             */
            createSelect: function () {
                let oriIcon = '<i class="layui-icon">';

                if (isFontClass) {
                    oriIcon = '<i class="layui-icon ' + ORIGINAL_ELEM_VALUE + '">';
                } else {
                    oriIcon += ORIGINAL_ELEM_VALUE;
                }
                oriIcon += '</i>';

                let selectHtml = '<div class="layui-iconPicker layui-unselect layui-form-select" id="' + ICON_BODY + '">' + '<div class="' + TITLE + '" id="' + TITLE_ID + '">' + '<div class="layui-iconPicker-item">' + '<span class="layui-iconPicker-icon layui-unselect">' + oriIcon + '</span>' + '<i class="layui-edge"></i>' + '</div>' + '</div>' + '<div class="layui-anim layui-anim-upbit" style="">' + '123' + '</div>';
                $(elem).after(selectHtml);
                return picker;
            }, /**
             * 展开/折叠下拉框
             */
            toggleSelect: function () {
                let item = '#' + TITLE_ID + ' .layui-iconPicker-item,#' + TITLE_ID + ' .layui-iconPicker-item .layui-edge';
                picker.event('click', item, function (e) {
                    let $icon = $('#' + ICON_BODY);
                    if ($icon.hasClass(selected)) {
                        $icon.removeClass(selected).addClass(unselect);
                    } else {
                        // 隐藏其他picker
                        $('.layui-form-select').removeClass(selected);
                        // 显示当前picker
                        $icon.addClass(selected).removeClass(unselect);
                    }
                    e.stopPropagation();
                });
                return picker;
            }, /**
             * 绘制主体部分
             */
            createBody: function () {
                // 获取数据
                let searchHtml = '';

                if (search) {
                    searchHtml = '<div class="layui-iconPicker-search">' + '<input class="layui-input">' + '<i class="layui-icon">&#xe615;</i>' + '</div>';
                }

                // 组合dom
                let bodyHtml = '<div class="layui-iconPicker-body" id="' + PICKER_BODY + '">' + searchHtml + '<div class="' + LIST_BOX + '"></div> ' + '</div>';
                $('#' + ICON_BODY).find('.layui-anim').eq(0).html(bodyHtml);
                picker.search().createList(null).check().page();

                return picker;
            }, /**
             * 绘制图标列表
             * @param text 模糊查询关键字
             * @returns {Object}
             */
            createList: function (text) {
                let d = data
                    , l = d.length
                    , pageHtml = ''
                    , listHtml = $('<div class="layui-iconPicker-list">')//'<div class="layui-iconPicker-list">';

                // 计算分页数据
                let _limit = limit, // 每页显示数量
                    _pages;

                // 图标列表
                let icons = [];

                for (let i = 0; i < l; i++) {
                    let obj = d[i];

                    // 判断是否模糊查询
                    if (text && obj.indexOf(text) === -1) {
                        continue;
                    }

                    // 是否自定义格子宽度
                    let style = '';
                    if (cellWidth !== null) {
                        style += ' style="width:' + cellWidth + '"';
                    }

                    // 每个图标dom
                    let icon = '<div class="layui-iconPicker-icon-item" title="' + obj + '" ' + style + '>';
                    if (isFontClass) {
                        icon += '<i class="layui-icon ' + obj + '"></i>';
                    } else {
                        icon += '<i class="layui-icon">' + obj.replace('amp;', '') + '</i>';
                    }
                    icon += '</div>';

                    icons.push(icon);
                }

                // 查询出图标后再分页
                l = icons.length;
                _pages = l % _limit === 0 ? l / _limit : parseInt(l / _limit + 1);
                for (let i = 0; i < _pages; i++) {
                    // 按limit分块
                    let lm = $('<div class="layui-iconPicker-icon-limit" id="layui-iconPicker-icon-limit-' + tmp + (i + 1) + '">');

                    for (let j = i * _limit; j < (i + 1) * _limit && j < l; j++) {
                        lm.append(icons[j]);
                    }

                    listHtml.append(lm);
                }

                // 无数据
                if (l === 0) {
                    listHtml.append('<p class="layui-iconPicker-tips">无数据</p>');
                }

                // 判断是否分页
                if (page) {
                    $('#' + PICKER_BODY).addClass('layui-iconPicker-body-page');
                    pageHtml = '<div class="layui-iconPicker-page" id="' + PAGE_ID + '">' + '<div class="layui-iconPicker-page-count">' + '<span id="' + PAGE_ID + '-current">1</span>/' + '<span id="' + PAGE_ID + '-pages">' + _pages + '</span>' + ' (<span id="' + PAGE_ID + '-length">' + l + '</span>)' + '</div>' + '<div class="layui-iconPicker-page-operate">' + '<i class="layui-icon" id="' + PAGE_ID + '-prev" data-index="0" prev>&#xe603;</i> ' + '<i class="layui-icon" id="' + PAGE_ID + '-next" data-index="2" next>&#xe602;</i> ' + '</div>' + '</div>';
                }


                $('#' + ICON_BODY).find('.layui-anim').find('.' + LIST_BOX).html('').append(listHtml).append(pageHtml);
                return picker;
            },
            // 阻止Layui的一些默认事件
            preventEvent: function () {
                let item = '#' + ICON_BODY + ' .layui-anim';
                picker.event('click', item, function (e) {
                    e.stopPropagation();
                });
                return picker;
            },
            // 分页
            page: function () {
                let icon = '#' + PAGE_ID + ' .layui-iconPicker-page-operate .layui-icon';

                $(icon).unbind('click');
                picker.event('click', icon, function (e) {
                    let elem = e.currentTarget, total = parseInt($('#' + PAGE_ID + '-pages').html()),
                        isPrev = $(elem).attr('prev') !== undefined, // 按钮上标的页码
                        index = parseInt($(elem).attr('data-index')), $cur = $('#' + PAGE_ID + '-current'), // 点击时正在显示的页码
                        current = parseInt($cur.html());

                    // 分页数据
                    if (isPrev && current > 1) {
                        current = current - 1;
                        $(icon + '[prev]').attr('data-index', current);
                    } else if (!isPrev && current < total) {
                        current = current + 1;
                        $(icon + '[next]').attr('data-index', current);
                    }
                    $cur.html(current);

                    // 图标数据
                    $('#' + ICON_BODY + ' .layui-iconPicker-icon-limit').hide();
                    $('#layui-iconPicker-icon-limit-' + tmp + current).show();
                    e.stopPropagation();
                });
                return picker;
            },
            //搜索
            search: function () {
                let item = '#' + PICKER_BODY + ' .layui-iconPicker-search .layui-input';
                picker.event('input propertychange', item, function (e) {
                    let elem = e.target, t = $(elem).val();
                    picker.createList(t);
                });
                return picker;
            },
            //点击选中图标
            check: function () {
                let item = '#' + PICKER_BODY + ' .layui-iconPicker-icon-item';
                picker.event('click', item, function (e) {
                    let el = $(e.currentTarget).find('.layui-icon')
                        , _icon;
                    if (isFontClass) {
                        let clsArr = el.attr('class').split(/[\s\n]/)
                            , cls = clsArr[1]
                        _icon = cls;
                        $('#' + TITLE_ID).find('.layui-iconPicker-item .layui-icon').html('').attr('class', clsArr.join(' '));
                    } else {
                        let cls = el.html();
                        _icon = cls;
                        $('#' + TITLE_ID).find('.layui-iconPicker-item .layui-icon').html(_icon);
                    }

                    $('#' + ICON_BODY).removeClass(selected).addClass(unselect);
                    $(elem).val(_icon).attr('value', _icon);
                    // 回调
                    if (click) {
                        click({
                            icon: _icon
                        });
                    }
                });
                return picker;
            }, // 监听原始input数值改变
            inputListen: function () {
                let el = $(elem);
                picker.event('change', elem, function () {
                    let value = el.val();
                })
                return picker;
            }, event: function (evt, el, fn) {
                $(BODY).on(evt, el, fn);
            }
        };

        let common = {
            //加载样式表
            loadCss: function () {
                let cssContent;//css内容
                $.ajax({
                    url: iconPickerPath.substring(0, iconPickerPath.lastIndexOf('/')) + '/iconPicker.css'
                    , type: 'get'
                    , dataType: 'text'
                    , async: false
                    , success: function (result) {
                        cssContent = result;
                    }
                });
                let $style = $('head').find('style[iconPicker]');
                if ($style.length === 0) {
                    $('head').append('<style rel="stylesheet" iconPicker>' + cssContent + '</style>');
                }
            },
            //获取数据
            getData: {
                fontClass: function () {
                    let iconData = [];
                    let icons = this.loadSvgData();
                    for (let i = 0; i < icons.length; i++) {
                        let iconName = icons[i].getAttribute("glyph-name");
                        iconData.push("layui-icon-" + iconName);
                    }
                    return iconData;
                }, unicode: function () {
                    let iconData = [];
                    let icons = this.loadSvgData();
                    for (let i = 0; i < icons.length; i++) {
                        let unicode = icons[i].getAttribute("unicode");
                        iconData.push(unicode);
                    }
                    return iconData;
                },
                //加载图标的Svg数据
                loadSvgData: function () {
                    let svg;
                    $.ajax({
                        url: svg_url, type: 'get', dataType: 'xml', async: false, success: function (result) {
                            svg = result;
                        }
                    });
                    return svg.getElementsByTagName("svg")[0].getElementsByTagName("defs")[0].getElementsByTagName("font")[0].getElementsByTagName("glyph");
                }
            }
        };

        picker.init();//图标选择器初始化
        return new IconPicker();
    };

    /**
     * 选中图标
     * @param filter lay-filter
     * @param iconName 图标名称，自动识别fontClass/unicode
     */
    IconPicker.prototype.checkIcon = function (filter, iconName) {
        let el = $('*[lay-filter=' + filter + ']'), p = el.next().find('.layui-iconPicker-item .layui-icon'),
            c = iconName;

        if (c.indexOf('#xe') > 0) {
            p.html(c);
        } else {
            p.html('').attr('class', 'layui-icon ' + c);
        }
        el.attr('value', c).val(c);
    };

    let iconPicker = new IconPicker();
    exports(_MOD, iconPicker);
});
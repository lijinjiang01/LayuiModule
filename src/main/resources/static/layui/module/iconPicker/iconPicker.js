/**
 * Layui图标选择器
 * Layui version 2.8.4
 * version 1.0
 */

layui.define(['laypage', 'form'],
    function (exports) {
        "use strict";

        let IconPicker = function () {
                this.v = '1.0';
            }, _MOD = 'iconPicker',
            $ = layui.jquery,
            BODY = 'body';

        /**
         * 渲染组件
         */
        IconPicker.prototype.render = function (options) {
            let opts = options,
                // DOM选择器
                elem = opts.elem,
                svg_url = opts.url == null ? 'layui/font/iconfont.svg' : opts.url,
                // 数据类型：fontClass/unicode
                type = opts.type == null ? 'fontClass' : opts.type,
                // 是否分页：true/false
                page = opts.page == null ? true : opts.page,
                // 每页显示数量
                limit = opts.limit == null ? 12 : opts.limit,
                // 是否开启搜索：true/false
                search = opts.search == null ? true : opts.search,
                // 每个图标格子的宽度：'43px'或'20%'
                cellWidth = opts.width,
                // 点击回调
                click = opts.click,
                // 渲染成功后的回调
                success = opts.success,
                // json数据
                data = {},
                // 唯一标识
                tmp = new Date().getTime(),
                // 是否使用的class数据
                isFontClass = type === 'fontClass',
                // 初始化时input的值
                ORIGINAL_ELEM_VALUE = $(elem).val(),
                TITLE = 'layui-select-title',
                TITLE_ID = 'layui-select-title-' + tmp,
                ICON_BODY = 'layui-iconPicker-' + tmp,
                PICKER_BODY = 'layui-iconPicker-body-' + tmp,
                PAGE_ID = 'layui-iconPicker-page-' + tmp,
                LIST_BOX = 'layui-iconPicker-list-box',
                selected = 'layui-form-selected',
                unselect = 'layui-unselect';

            let a = {
                init: function () {
                    data = common.getData[type]();

                    a.hideElem().createSelect().createBody().toggleSelect();
                    a.preventEvent().inputListen();
                    common.loadCss();

                    if (success) {
                        success(this.successHandle());
                    }

                    return a;
                },
                successHandle: function () {
                    return {
                        options: opts,
                        data: data,
                        id: tmp,
                        elem: $('#' + ICON_BODY)
                    };
                },
                /**
                 * 隐藏elem
                 */
                hideElem: function () {
                    $(elem).hide();
                    return a;
                },
                /**
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

                    let selectHtml = '<div class="layui-iconPicker layui-unselect layui-form-select" id="' + ICON_BODY + '">' +
                        '<div class="' + TITLE + '" id="' + TITLE_ID + '">' +
                        '<div class="layui-iconPicker-item">' +
                        '<span class="layui-iconPicker-icon layui-unselect">' +
                        oriIcon +
                        '</span>' +
                        '<i class="layui-edge"></i>' +
                        '</div>' +
                        '</div>' +
                        '<div class="layui-anim layui-anim-upbit" style="">' +
                        '123' +
                        '</div>';
                    $(elem).after(selectHtml);
                    return a;
                },
                /**
                 * 展开/折叠下拉框
                 */
                toggleSelect: function () {
                    let item = '#' + TITLE_ID + ' .layui-iconPicker-item,#' + TITLE_ID + ' .layui-iconPicker-item .layui-edge';
                    a.event('click', item, function (e) {
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
                    return a;
                },
                /**
                 * 绘制主体部分
                 */
                createBody: function () {
                    // 获取数据
                    let searchHtml = '';

                    if (search) {
                        searchHtml = '<div class="layui-iconPicker-search">' +
                            '<input class="layui-input">' +
                            '<i class="layui-icon">&#xe615;</i>' +
                            '</div>';
                    }

                    // 组合dom
                    let bodyHtml = '<div class="layui-iconPicker-body" id="' + PICKER_BODY + '">' +
                        searchHtml +
                        '<div class="' + LIST_BOX + '"></div> ' +
                        '</div>';
                    $('#' + ICON_BODY).find('.layui-anim').eq(0).html(bodyHtml);
                    a.search().createList().check().page();

                    return a;
                },
                /**
                 * 绘制图标列表
                 * @param text 模糊查询关键字
                 * @returns {string}
                 */
                createList: function (text) {
                    let d = data,
                        l = d.length,
                        pageHtml = '',
                        listHtml = $('<div class="layui-iconPicker-list">')//'<div class="layui-iconPicker-list">';

                    // 计算分页数据
                    let _limit = limit, // 每页显示数量
                        _pages = l % _limit === 0 ? l / _limit : parseInt(l / _limit + 1);

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
                        pageHtml = '<div class="layui-iconPicker-page" id="' + PAGE_ID + '">' +
                            '<div class="layui-iconPicker-page-count">' +
                            '<span id="' + PAGE_ID + '-current">1</span>/' +
                            '<span id="' + PAGE_ID + '-pages">' + _pages + '</span>' +
                            ' (<span id="' + PAGE_ID + '-length">' + l + '</span>)' +
                            '</div>' +
                            '<div class="layui-iconPicker-page-operate">' +
                            '<i class="layui-icon" id="' + PAGE_ID + '-prev" data-index="0" >&#xe603;</i> ' +
                            '<i class="layui-icon" id="' + PAGE_ID + '-next" data-index="2" >&#xe602;</i> ' +
                            '</div>' +
                            '</div>';
                    }


                    $('#' + ICON_BODY).find('.layui-anim').find('.' + LIST_BOX).html('').append(listHtml).append(pageHtml);
                    return a;
                },
                // 阻止Layui的一些默认事件
                preventEvent: function () {
                    let item = '#' + ICON_BODY + ' .layui-anim';
                    a.event('click', item, function (e) {
                        e.stopPropagation();
                    });
                    return a;
                },
                // 分页
                page: function () {
                    let icon = '#' + PAGE_ID + ' .layui-iconPicker-page-operate .layui-icon';

                    $(icon).unbind('click');
                    a.event('click', icon, function (e) {
                        let elem = e.currentTarget,
                            total = parseInt($('#' + PAGE_ID + '-pages').html()),
                            isPrev = $(elem).attr('prev') !== undefined,
                            // 按钮上标的页码
                            index = parseInt($(elem).attr('data-index')),
                            $cur = $('#' + PAGE_ID + '-current'),
                            // 点击时正在显示的页码
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
                    return a;
                },
                /**
                 * 搜索
                 */
                search: function () {
                    let item = '#' + PICKER_BODY + ' .layui-iconPicker-search .layui-input';
                    a.event('input propertychange', item, function (e) {
                        let elem = e.target,
                            t = $(elem).val();
                        a.createList(t);
                    });
                    return a;
                },
                /**
                 * 点击选中图标
                 */
                check: function () {
                    let item = '#' + PICKER_BODY + ' .layui-iconPicker-icon-item';
                    a.event('click', item, function (e) {
                        let el = $(e.currentTarget).find('.layui-icon'),
                            icon = '';
                        if (isFontClass) {
                            let clsArr = el.attr('class').split(/[\s\n]/),
                                cls = clsArr[1],
                                icon = cls;
                            $('#' + TITLE_ID).find('.layui-iconPicker-item .layui-icon').html('').attr('class', clsArr.join(' '));
                        } else {
                            let cls = el.html(),
                                icon = cls;
                            $('#' + TITLE_ID).find('.layui-iconPicker-item .layui-icon').html(icon);
                        }

                        $('#' + ICON_BODY).removeClass(selected).addClass(unselect);
                        $(elem).val(icon).attr('value', icon);
                        // 回调
                        if (click) {
                            click({
                                icon: icon
                            });
                        }

                    });
                    return a;
                },
                // 监听原始input数值改变
                inputListen: function () {
                    let el = $(elem);
                    a.event('change', elem, function () {
                        let value = el.val();
                    })
                    return a;
                },
                event: function (evt, el, fn) {
                    $(BODY).on(evt, el, fn);
                }
            };

            let common = {
                /**
                 * 加载样式表
                 */
                loadCss: function () {
                    let css = '.layui-iconPicker {max-width: 280px;}.layui-iconPicker .layui-anim{display:none;position:absolute;left:0;top:42px;padding:5px 0;z-index:899;min-width:100%;border:1px solid #d2d2d2;max-height:300px;overflow-y:auto;background-color:#fff;border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,.12);box-sizing:border-box;}.layui-iconPicker-item{border:1px solid #e6e6e6;width:90px;height:38px;border-radius:4px;cursor:pointer;position:relative;}.layui-iconPicker-icon{border-right:1px solid #e6e6e6;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;width:60px;height:100%;float:left;text-align:center;background:#fff;transition:all .3s;}.layui-iconPicker-icon i{line-height:38px;font-size:18px;}.layui-iconPicker-item > .layui-edge{left:70px;}.layui-iconPicker-item:hover{border-color:#D2D2D2!important;}.layui-iconPicker-item:hover .layui-iconPicker-icon{border-color:#D2D2D2!important;}.layui-iconPicker.layui-form-selected .layui-anim{display:block;}.layui-iconPicker-body{padding:6px;}.layui-iconPicker .layui-iconPicker-list{background-color:#fff;border:1px solid #ccc;border-radius:4px;}.layui-iconPicker .layui-iconPicker-icon-item{display:inline-block;width:21.1%;line-height:36px;text-align:center;cursor:pointer;vertical-align:top;height:36px;margin:4px;border:1px solid #ddd;border-radius:2px;transition:300ms;}.layui-iconPicker .layui-iconPicker-icon-item i.layui-icon{font-size:17px;}.layui-iconPicker .layui-iconPicker-icon-item:hover{background-color:#eee;border-color:#ccc;-webkit-box-shadow:0 0 2px #aaa,0 0 2px #fff inset;-moz-box-shadow:0 0 2px #aaa,0 0 2px #fff inset;box-shadow:0 0 2px #aaa,0 0 2px #fff inset;text-shadow:0 0 1px #fff;}.layui-iconPicker-search{position:relative;margin:0 0 6px 0;border:1px solid #e6e6e6;border-radius:2px;transition:300ms;}.layui-iconPicker-search:hover{border-color:#D2D2D2!important;}.layui-iconPicker-search .layui-input{cursor:text;display:inline-block;width:86%;border:none;padding-right:0;margin-top:1px;}.layui-iconPicker-search .layui-icon{position:absolute;top:11px;right:4%;}.layui-iconPicker-tips{text-align:center;padding:8px 0;cursor:not-allowed;}.layui-iconPicker-page{margin-top:6px;margin-bottom:-6px;font-size:12px;padding:0 2px;}.layui-iconPicker-page-count{display:inline-block;}.layui-iconPicker-page-operate{display:inline-block;float:right;cursor:default;}.layui-iconPicker-page-operate .layui-icon{font-size:12px;cursor:pointer;}.layui-iconPicker-body-page .layui-iconPicker-icon-limit{display:none;}.layui-iconPicker-body-page .layui-iconPicker-icon-limit:first-child{display:block;}';
                    let $style = $('head').find('style[iconPicker]');
                    if ($style.length === 0) {
                        $('head').append('<style rel="stylesheet" iconPicker>' + css + '</style>');
                    }
                },
                /**
                 * 获取数据
                 */
                getData: {
                    fontClass: function () {
                        let iconData = [];
                        let svg;
                        $.ajax({
                            url: svg_url,
                            type: 'get',
                            dataType: 'xml',
                            async: false,
                            success: function (result) {
                                svg = result;
                            }
                        })
                        let icons = svg.getElementsByTagName("svg")[0].getElementsByTagName("defs")[0].getElementsByTagName("font")[0].getElementsByTagName("glyph");
                        for (let i = 0; i < icons.length; i++) {
                            let iconName = icons[i].getAttribute("glyph-name");
                            iconData.push("layui-icon-" + iconName);
                        }
                        return iconData;
                    },
                    unicode: function () {
                        return ["&amp;#xe6c9;", "&amp;#xe67b;", "&amp;#xe67a;", "&amp;#xe678;", "&amp;#xe679;", "&amp;#xe677;", "&amp;#xe676;", "&amp;#xe675;", "&amp;#xe673;", "&amp;#xe66f;", "&amp;#xe9aa;", "&amp;#xe672;", "&amp;#xe66b;", "&amp;#xe668;", "&amp;#xe6b1;", "&amp;#xe702;", "&amp;#xe66e;", "&amp;#xe68e;", "&amp;#xe674;", "&amp;#xe669;", "&amp;#xe666;", "&amp;#xe66c;", "&amp;#xe66a;", "&amp;#xe667;", "&amp;#xe7ae;", "&amp;#xe665;", "&amp;#xe664;", "&amp;#xe716;", "&amp;#xe656;", "&amp;#xe653;", "&amp;#xe663;", "&amp;#xe6c6;", "&amp;#xe6c5;", "&amp;#xe662;", "&amp;#xe661;", "&amp;#xe660;", "&amp;#xe65d;", "&amp;#xe65f;", "&amp;#xe671;", "&amp;#xe65e;", "&amp;#xe659;", "&amp;#xe735;", "&amp;#xe756;", "&amp;#xe65c;", "&amp;#xe715;", "&amp;#xe705;", "&amp;#xe6b2;", "&amp;#xe6af;", "&amp;#xe69c;", "&amp;#xe698;", "&amp;#xe657;", "&amp;#xe65b;", "&amp;#xe65a;", "&amp;#xe681;", "&amp;#xe67c;", "&amp;#xe601;", "&amp;#xe857;", "&amp;#xe655;", "&amp;#xe770;", "&amp;#xe670;", "&amp;#xe63d;", "&amp;#xe63e;", "&amp;#xe654;", "&amp;#xe652;", "&amp;#xe651;", "&amp;#xe6fc;", "&amp;#xe6ed;", "&amp;#xe688;", "&amp;#xe645;", "&amp;#xe64f;", "&amp;#xe64e;", "&amp;#xe64b;", "&amp;#xe62b;", "&amp;#xe64d;", "&amp;#xe64a;", "&amp;#xe64c;", "&amp;#xe650;", "&amp;#xe649;", "&amp;#xe648;", "&amp;#xe647;", "&amp;#xe646;", "&amp;#xe644;", "&amp;#xe62a;", "&amp;#xe643;", "&amp;#xe63f;", "&amp;#xe642;", "&amp;#xe641;", "&amp;#xe640;", "&amp;#xe63c;", "&amp;#xe63b;", "&amp;#xe63a;", "&amp;#xe639;", "&amp;#xe638;", "&amp;#xe637;", "&amp;#xe636;", "&amp;#xe635;", "&amp;#xe634;", "&amp;#xe633;", "&amp;#xe632;", "&amp;#xe631;", "&amp;#xe630;", "&amp;#xe62f;", "&amp;#xe62e;", "&amp;#xe62d;", "&amp;#xe62c;", "&amp;#xe629;", "&amp;#xe628;", "&amp;#xe625;", "&amp;#xe623;", "&amp;#xe621;", "&amp;#xe620;", "&amp;#xe61f;", "&amp;#xe61c;", "&amp;#xe60b;", "&amp;#xe619;", "&amp;#xe61a;", "&amp;#xe603;", "&amp;#xe602;", "&amp;#xe617;", "&amp;#xe615;", "&amp;#xe614;", "&amp;#xe613;", "&amp;#xe612;", "&amp;#xe611;", "&amp;#xe60f;", "&amp;#xe60e;", "&amp;#xe60d;", "&amp;#xe60c;", "&amp;#xe60a;", "&amp;#xe609;", "&amp;#xe605;", "&amp;#xe607;", "&amp;#xe606;", "&amp;#xe604;", "&amp;#xe600;", "&amp;#xe658;", "&amp;#x1007;", "&amp;#x1006;", "&amp;#x1005;", "&amp;#xe608;"];
                    }
                }
            };

            a.init();
            return new IconPicker();
        };

        /**
         * 选中图标
         * @param filter lay-filter
         * @param iconName 图标名称，自动识别fontClass/unicode
         */
        IconPicker.prototype.checkIcon = function (filter, iconName) {
            let el = $('*[lay-filter=' + filter + ']'),
                p = el.next().find('.layui-iconPicker-item .layui-icon'),
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
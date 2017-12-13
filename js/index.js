/**
 * @file
 * @author
 * @desc 逻辑图原始逻辑代码
 * @version 1.0
 * @date  2017-08-25
 * @last modified by lzz
 * @last modified time  2017-09-08
 */

/**
 *  @发布时需处理代码@
 *  @ 包含上一行注释的代码需要在发布前处理，否则会影响发布后功能。
 */

/***** 修改 *****/
// var tempList1 = [];
/****************************/
////@发布时需处理代码@ 在发布后解锁改方法
var flag = getParameter("flag");
////@发布时需处理代码@ 在发布后隐藏下一行代码
//var flag = 1;
/****************************** */
var tempList1 = loadMyChart() || [];


// 全局的 pageMeta 对象
var pageMeta = {
    container: 'holder',

    /***************************/

    // 重置绘图区域的宽高
    canvasSize: {
        width: 10000,
        height: 5000
    },
    bodyWidth: 0,
    bodyHeight: 0,
    canvasExtent: {
        minx: 0,
        maxx: 0,
        miny: 0,
        maxy: 0
    },
    canvasPageExtent: {
        minx: 0,
        maxx: 0,
        miny: 0,
        maxy: 0
    },

    // 设置管点
    addPointState: false,

    // 矩形选区数组
    selectAreaList: [],
    isSelectArea: false,

    // 文本工具
    isOpenTextTools: false,

    /*****************************/

    canvas: null,
    extent: null,
    panel: null,
    collection: null,
    'mouse_x': 0,
    'mouse_y': 0,
    'start_x': 0,
    'start_y': 0,
    'panel_x': 0,
    'panel_y': 0,
    movePanel: false,
    drawExtent: false,
    selectedShapeList: [],
    selectedShapeLocatList: [],
    facilityType: '',
    url: '',
    warningurl: '',
    writeHistory: true,
    maxHistoryLength: 50,
    historyList: [],
    historyIndex: -1,
    keyState: true,
    editable: true,
    /**********************************/
    textInput: ChartConfig.textInputList,
    /*************************************/
    selectedBean: null,
    thickState: false,
    italicState: false,
    panelVisible: true,
    attributemove: false,
    attributeclick: false,
    attributetable: null,
    'attr_mouse_x': 0,
    'attr_mouse_y': 0,
    'attr_start_x': 0,
    'attr_start_y': 0,
    /**
     * @ ls 20170909
     * @ 记录画布拖动状态
     */
    canvasmoveType: {
        type: false,
        x: null,
        y: null
    },
    MultiselectEle: {
        type: false,
        list: []
    },
    /**
     *  @ ls 20170911
     *  @ 增加判断放大缩小拖动的开关
     */
    isOpenEnlarge: false,
    isOpennarrow: false,
    isOpenDragBg: false,
    getZoomVal: function () {
        var zoom = $("#holder").css("zoom") == undefined ? 1 : $("#holder").css("zoom");
        var zoom = $("#holder").css("zoom") == "normal" ? 1 : $("#holder").css("zoom");
        return zoom;
    },
    zoomOffset: {
        left: null,
        top: null
    },
    lineType: "BrokenLine",
    dataCaching: {
        obj: null,
        num: 0,
        ID: null,
        Robj: null,
        Rnum: null,
        RID: null,
        createList: [],
        ComponentLocation: []
    },
    copylist: {
        before: [],
        after: [],
        beforex: 0,
        beforey: 0,
        afterx: 0,
        aftery: 0,
        beforeZoom: 1
    },
    textSelectedState: [],
    textSelectedStateRotate: null,
    stretching: {
        flag: false,
        moveFlag: false,
        type: "",
        originX: 0,
        originY: 0,
        mouseX: 0,
        mouseY: 0
    },
    Editmode: false,
    CLN: {
        image: null,
        type: null,
        id: null,
        Twinkle: null,
        flag: null
    },
    //存储
    locationShapInfo: {
        type: false,
        arr: []
    },
    //存储模拟数据变量;演示主辅路切换效果
    // MainAndSideRoads: [
    //     "079", "080", "081", "082", "083", "088", "086", "089", "090", "091", "092", "084", "093", "094", "095", "100", "101", "102", "103", "156", "157", "158", "159", "160", "161", "162", "163", "164", "166", "167", "168", "170", "169", "171", "172", "174", "175", "177"
    // ],
    bulb:["次高/中一路","过滤计量二路","调压一路","调压二路"],
    ItShouldOpenButClose: [
        "132", "133", "134"
    ],
    ShouldBeClosedButOpen: [
        "185", "186", "187"
    ],
    ValveClosing: [ "025",
        "052",
        "076",
        "101",
        "107",
        "123",
        "146",
        "169",
        "183",
        "202",
        "018",
        "XDT-002",
        "XDT-059",
        "XDT-028",
        "XDT-038",
        "XDT-039",
        "XDT-051",
        "XDT-015",
        "XDT-016",
        "205",
        "030",
        "048",
        "064",
        "089",
        "105",
        "179",
        "207",
        "020",
        "053",
        "077",
        "102",
        "108",
        "124",
        "147",
        "170",
        "184",
        "203",
        "206",
        "021",
        "031",
        "049",
        "065",
        "090",
        "106",
        "180",
        "XDT-003",
        "XDT-058",
        "005",
        "019",
        "026",
        "208",
        "217",
        "039",
        "017",
        "024",
        "051",
        "182",
        "XDT-055",
        "122",
        "145",
        "168",
        "XDT-029",
        "XDT-052"
    ],
    //集合所有需要在加载后的对象位号，然后分别加载状态。
    TwinkleS: [],
    loadIsOver: false,
    //用于保存正在定位闪烁的元件的计时器timer
    CancelBlink: [],
    //异常警报
    AbnormalAlarm: false,
    // MainAndSideRoads2: [
    //     {
    //         name: "调压一路",
    //         list: ["110", "109", "111", "112", "113", "114", "115", "116", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131"]
    //     }
    //     , {
    //         name: "调压二路",
    //         list: ["132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155"]
    //     }
    //     , {
    //         name: "调压三路",
    //         list: ["155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177"]
    //     }
    //     , {
    //         name: "过滤计量一路",
    //         list: ["054", "055", "056", "057", "058", "060", "061", "063", "064", "065", "066", "067", "073", "068", "069", "070", "071", "074", "075", "076", "077", "078"]
    //     }
    //     , {
    //         name: "过滤计量二路",
    //         list: ["079", "080", "081", "082", "083", "086", "088", "089", "090", "091", "092", "084", "093", "094", "095", "096", "099", "100", "101", "102", "103"]
    //     }
    // ]
};

$(function () {
    // 初始化画布
    // pageMeta.canvas = Raphael(pageMeta.container, 2000, 1000);
    // pageMeta.collection = new ShapeCollection();
    pageMeta.canvas = Raphael(pageMeta.container, pageMeta.canvasSize.width, pageMeta.canvasSize.height); // 创建Raphael画布
    pageMeta.canvasDiv = $('#' + pageMeta.container); // Raphael画布容器
    pageMeta.collection = new ShapeCollection(); // 创建图片连接的实例化对象

    //接口获取当前加载状态。编辑模式为true，预览模式为false
    if (flag) {
        //编辑模式
        pageMeta.Editmode = true;
    } else {
        //预览模式
        pageMeta.Editmode = false;
    }

    // 加载左侧工具栏的图标
    for (var a in imageMeta) {
        if (a.length == 2) {
            var image = $('#image' + a);
            var td = $('#td' + a);
            td.attr('url', imageMeta[a].url);
            td.attr('warningurl', imageMeta[a].warningurl);
            image.attr('src', imageMeta[a].url);
        }
    }

    // 展示画布尺寸的大小
    // resizeCanvas();
    {
        $('#canvasWidth').val(pageMeta.canvasSize.width);
        $('#canvasHeight').val(pageMeta.canvasSize.height);
    }
    ;

    // 如果有图形  在面板上绘制图形
    createGeometrys(tempList1);
    // 选择区域 对选中区域内部的元素进行平移操作
    {
        pageMeta.extent = new ShapeBean();
        pageMeta.extent.raphael = pageMeta.canvas;
        pageMeta.extent.shapeType = ShapeConfig.SHAPE_RECT;
        pageMeta.extent.x = -1000;
        pageMeta.extent.y = -1000;
        pageMeta.extent.width = 1;
        pageMeta.extent.height = 1;
        pageMeta.extent.border = 1;
        pageMeta.extent.radius = 2;
        pageMeta.extent.hasExtent = false;
        pageMeta.extent.fillColor = '#0000FF';
        pageMeta.extent.color = '#0000FF';
        pageMeta.extent.opacity = 0.2;
        pageMeta.extent.scope = pageMeta.canvasExtent;
        pageMeta.extent.moveFun = function () {
            var zoom = pageMeta.getZoomVal();
            var dx = pageMeta.extent.x - pageMeta.panel_x;
            var dy = pageMeta.extent.y - pageMeta.panel_y;
            for (var i = 0; i < pageMeta.selectedShapeList.length; i++) {
                var shape = pageMeta.selectedShapeList[i];
                var locat = pageMeta.selectedShapeLocatList[i];
                if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                    shape.x = locat.x + dx;
                    shape.y = locat.y + dy;
                    shape.moveTo();
                } else {
                    /**
                     *  @ ls 20170908
                     *  @ 修改判断条件，解决在多元素拖动过程中c1c2点无法同时移动问题。
                     */
                    //if (shape.geometryType == ShapeConfig.GEOMETRY_POLYLINE) {
                    if (shape.beginShape == null || shape.endShape == null) {

                        if (shape.beginShape == null) {
                            shape.bx = locat.bx + dx;
                            shape.by = locat.by + dy;
                        }
                        if (shape.endShape == null) {
                            shape.ex = locat.ex + dx;
                            shape.ey = locat.ey + dy;
                        }
                        if (shape.mShape) {
                            shape.cx = locat.cx + dx;
                            shape.cy = locat.cy + dy;
                        }
                        /*
                            @ ls 20170908
                            @ 增加c1c2两点移动方法
                        */
                        // if (shape.c1Shape) {
                        //     shape.c1x = locat.c1x + dx;
                        //     shape.c1y = locat.c1y + dy;
                        // }
                        // if (shape.c2Shape) {
                        //     shape.c2x = locat.c2x + dx;
                        //     shape.c2y = locat.c2y + dy;
                        // }
                        /***************************/
                        shape.moveTo();
                    } else {
                        if (shape.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
                            shape.cx = locat.cx + dx;
                            shape.cy = locat.cy + dy;
                            shape.moveTo();
                            shape.resetShape();
                        }
                    }
                }
            }
        };
        pageMeta.extent.upFun = function () {
            saveView();
        };
        pageMeta.extent.createShape();
    }
    ;
    /**
     *  @ ls 20170909
     *  @ 增加鼠标右键重写，覆盖鼠标右键菜单功能
     */
    document.oncontextmenu = function (event) {
        if (document.all) window.event.returnValue = false;// for IE
        else event.preventDefault();
    };
    /*************************************/
    // 绘图面板区域的事件
    var containerDiv = $('#' + pageMeta.container);
    containerDiv.css('cursor', 'default');
    containerDiv.mousedown(function (e) {
        if (!pageMeta.Editmode) {
            //预览模式下，隐藏框选框
            pageMeta.extent.shape.hide();
            hideExtent();
        }
        var zoom = pageMeta.getZoomVal();
        if (!pageMeta.isOpenDragBg) {
            if (e.button == 0) {
                var offset = $(this).offset();
                //b
                /**
                 *  @ ls 170915
                 *  @ 修改移动方法
                 */
                pageMeta.start_x = (e.pageX / zoom - parseInt($("#shapepanel").css("left")) / zoom - pageMeta.zoomOffset.left / zoom);
                pageMeta.start_y = (e.pageY / zoom - pageMeta.zoomOffset.top / zoom);


                var remove = true;
                var box = pageMeta.extent.shape.getBBox();
                if (pageMeta.start_x >= box.x && pageMeta.start_x <= box.x + box.width && pageMeta.start_y >= box.y && pageMeta.start_y <= box.y + box.height) {
                    remove = false;
                }
                if (remove) {
                    hideExtent();
                    /************* 修改 ****************/
                    //  pageMeta.drawExtent = true;
                    if (pageMeta.isSelectArea) {
                        var createSelectObj = cloneSelectAreaObj();
                        createSelectObj.isSelectAreaMove = true;
                        pageMeta.selectAreaList.push(createSelectObj);
                        pageMeta.drawExtent = false;
                    } else if (pageMeta.isOpenTextTools) {
                        drawMouseDown(10, 10, ShapeConfig.FACILITY_CREATETEXT, "image/nobg.svg", "image/nobg.svg");
                        $("#textTools img").trigger("click");
                    } else {
                        pageMeta.drawExtent = true;
                    }
                }
            } else if (e.button == 2) {
                //鼠标右键功能
                pageMeta.canvasmoveType.type = true;
                pageMeta.canvasmoveType.x = e.offsetX;
                pageMeta.canvasmoveType.y = e.offsetY;
                pageMeta.drawExtent = true;
            }
        } else {
            /**
             *  @ ls 20170909
             *  @ 增加鼠标拖动功能
             */
            pageMeta.canvasmoveType.type = true;
            pageMeta.canvasmoveType.x = e.offsetX;
            pageMeta.canvasmoveType.y = e.offsetY;
            pageMeta.drawExtent = true;
            /*******************************************/
        }
    });
    containerDiv.mousemove(function (e) {
        pageMeta.stretching.mouseX = e.offsetX;
        pageMeta.stretching.mouseY = e.offsetY;
        var zoom = pageMeta.getZoomVal();
        if (!pageMeta.canvasmoveType.type) {
            if (pageMeta.drawExtent) {
                //绘制选框
                // var relativeX = (e.pageX / zoom  - offset.left);
                // var relativeY = (e.pageY / zoom  - offset.top);
                var relativeX = (e.pageX / zoom - parseInt($("#shapepanel").css("left")) / zoom - pageMeta.zoomOffset.left / zoom)
                var relativeY = (e.pageY / zoom - pageMeta.zoomOffset.top / zoom);
                pageMeta.extent.shape.show();
                var x = 0;
                var y = 0;
                var width = 0;
                var height = 0;
                if (relativeX > pageMeta.start_x) {
                    x = pageMeta.start_x;
                    width = relativeX - pageMeta.start_x;
                } else {
                    x = relativeX;
                    width = pageMeta.start_x - relativeX;
                }
                if (relativeY > pageMeta.start_y) {
                    y = pageMeta.start_y;
                    height = relativeY - pageMeta.start_y;
                } else {
                    y = relativeY;
                    height = pageMeta.start_y - relativeY;
                }
                pageMeta.extent.x = x + width / 2;
                pageMeta.extent.y = y + height / 2;
                pageMeta.extent.width = width;
                pageMeta.extent.height = height;
                pageMeta.extent.moveTo();
            }
            ;

            /*********** 新增 ***********************/
            var areaList = pageMeta.selectAreaList;
            if (pageMeta.isSelectArea && areaList.length > 0) {
                var currentSelectArea = areaList[areaList.length - 1];
                if (currentSelectArea.isSelectAreaMove) {
                    var offset = $(this).offset();
                    var relativeX = (e.pageX - offset.left);
                    var relativeY = (e.pageY - offset.top);
                    currentSelectArea.shape.show();
                    var x = 0;
                    var y = 0;
                    var width = 0;
                    var height = 0;
                    if (relativeX > pageMeta.start_x) {
                        x = pageMeta.start_x;
                        width = relativeX - pageMeta.start_x;
                    } else {
                        x = relativeX;
                        width = pageMeta.start_x - relativeX;
                    }
                    if (relativeY > pageMeta.start_y) {
                        y = pageMeta.start_y;
                        height = relativeY - pageMeta.start_y;
                    } else {
                        y = relativeY;
                        height = pageMeta.start_y - relativeY;
                    }
                    currentSelectArea.x = x + width / 2;
                    currentSelectArea.y = y + height / 2;
                    currentSelectArea.width = width;
                    currentSelectArea.height = height;
                    currentSelectArea.moveTo();
                }
            }
            ;
            /**********************************/
        } else {
            /**
             *  @ ls 20170909
             *  @ 拖动画布方法
             */
            var x = e.offsetX - pageMeta.canvasmoveType.x;
            var y = e.offsetY - pageMeta.canvasmoveType.y;
            if (document.scrollingElement) {
                document.scrollingElement.scrollTop = document.scrollingElement.scrollTop - y;
                document.scrollingElement.scrollLeft = document.scrollingElement.scrollLeft - x;
            } else {
                document.documentElement.scrollTop = document.documentElement.scrollTop - y;
                document.documentElement.scrollLeft = document.documentElement.scrollLeft - x;
            }

            /*********************************************/
        }
        //$("#ConnectionPrompt").css("top", -10000).css("left", -10000).html("")
    });
    containerDiv.mouseup(function (e) {
        if (pageMeta.drawExtent) {
            pageMeta.drawExtent = false;
            selectShape();
            getSelectShapeLoact();
        }
        /***********************************/
        if (pageMeta.isSelectArea) {
            pageMeta.isSelectArea = false;
            pageMeta.selectAreaList[pageMeta.selectAreaList.length - 1].isSelectAreaMove = false;
            $("#selectArea img")[0].src = "icon/select_area_01.png";
            saveView();
        }
        if (pageMeta.isOpenEnlarge && e.button == 0) {
            if (pageMeta.extent.height > 10 && pageMeta.extent.width > 10) {
                var zoom = pageMeta.getZoomVal() * 100;
                var top = $(window).scrollTop() / (zoom / 100);
                var left = $(window).scrollLeft() / (zoom / 100);
                $("#zoom").val(zoom + 10);
                $("#holder").css("zoom", zoom + 10 + "%");
                if (document.scrollingElement) {
                    document.scrollingElement.scrollTop = top * ((zoom + 10) / 100);
                    document.scrollingElement.scrollLeft = left * ((zoom + 10) / 100);
                } else {
                    document.documentElement.scrollTop = top * ((zoom + 10) / 100);
                    document.documentElement.scrollLeft = left * ((zoom + 10) / 100);
                }
            }
        } else if (pageMeta.isOpennarrow && e.button == 0) {
            if (pageMeta.extent.height > 10 && pageMeta.extent.width > 10) {
                var zoom = pageMeta.getZoomVal() * 100;
                var top = $(window).scrollTop() / (zoom / 100);
                var left = $(window).scrollLeft() / (zoom / 100);
                $("#zoom").val(zoom - 10);
                $("#holder").css("zoom", zoom - 10 + "%");
                if (document.scrollingElement) {
                    document.scrollingElement.scrollTop = top * ((zoom - 10) / 100);
                    document.scrollingElement.scrollLeft = left * ((zoom - 10) / 100);
                } else {
                    document.documentElement.scrollTop = top * ((zoom - 10) / 100);
                    document.documentElement.scrollLeft = left * ((zoom - 10) / 100);
                }

            }
        }
        if (pageMeta.textSelectedState.length) {
            var i = 0, len = pageMeta.textSelectedState.length, text = pageMeta.textSelectedState;
            for (; i < len; i++) {
                text[i].textExtent.hide();
            }
            pageMeta.textSelectedStateRotate = null;
            pageMeta.textSelectedState.length = 0;
        }
        /**********************************/
        /**
         * @ ls 20170909
         * 判断鼠标状态
         */
        pageMeta.canvasmoveType.type = false;
        /*******************************/
    });

    // 图形菜单栏的显示与隐藏
    pageMeta.panel = $('#selectpanel');
    var mouseCurrentX;
    var mouseCurrentY;

    // 整个页面的鼠标事件
    $(document).mousemove(function (e) {
        drawMouseMove(e);
    });
    $(document).mouseup(function (e) {
        //记录复制坐标
        if (e.target.nodeName == "svg") {
            var zoom = pageMeta.getZoomVal();
            pageMeta.copylist.afterx = e.pageX - 120;
            pageMeta.copylist.aftery = e.pageY - 40;
        }
        drawMouseUp();
    });

    // 键盘事件

    $(document).keydown(function (e) {
        if (e.ctrlKey && pageMeta.Editmode) {
            pageMeta.MultiselectEle.type = true;
        }
        if (e.ctrlKey) {//ctrl
            pageMeta.locationShapInfo.type = true;
        }
    }).keyup(function (e) {
        if (e.keyCode == 17 && pageMeta.Editmode) {
            pageMeta.MultiselectEle.type = false;
        }
        if (e.key == "Control") {//ctrl
            pageMeta.locationShapInfo.type = false;
            locationShapInfo(pageMeta.locationShapInfo.arr)
        }
        if (pageMeta.keyState && pageMeta.Editmode) {
            e = window.event || e;
            var keyCode = e.keyCode || e.which;
            // e.preventDefault();
            e.stopPropagation();
            if (e.ctrlKey && keyCode == 89) {//ctrl+y
                //	nextView();
            }
            if (e.ctrlKey && keyCode == 90) {//ctrl+z
                //	previousView();
            }
            if (e.ctrlKey && keyCode == 67) {//ctrl+C
                copyShape();
            }
            if (e.ctrlKey && keyCode == 86) {//ctrl+v
                pasteShape();
            }
            if (keyCode == 46) {//del
                clearShape(false);
            }
        }
    })

    $(window).resize(function () {
        resizeWindow();
    });

    // 属性悬浮框
    pageMeta.attributetable = $('#attributepanel');
    pageMeta.attributetable.css({
        'left': $(window).width() - 230,
        'top': 70,
    });
    $('#attributeheader').mousedown(function (e) {
        pageMeta.attributemove = true;
        pageMeta.attr_start_x = parseInt(pageMeta.attributetable.css('left').replace('px', ''));
        pageMeta.attr_start_y = parseInt(pageMeta.attributetable.css('top').replace('px', ''));
        pageMeta.attr_mouse_x = e.screenX;
        pageMeta.attr_mouse_y = e.screenY;
        pageMeta.attributeclick = true;
    });
    $(window).mousemove(function (e) {
        if (pageMeta.attributemove) {
            pageMeta.attributeclick = false;
            var x = e.screenX - pageMeta.attr_mouse_x + pageMeta.attr_start_x;
            var y = e.screenY - pageMeta.attr_mouse_y + pageMeta.attr_start_y;
            pageMeta.attributetable.css({
                'left': x,
                'top': y,
            });
        }
    });
    $(window).mouseup(function (e) {
        if (pageMeta.attributemove) {
            pageMeta.attributemove = false;
            if (pageMeta.attributeclick) {
                var attributeview = $('#attributeview');
                if (attributeview.is(':hidden')) {
                    attributeview.show();
                } else {
                    attributeview.hide();
                }
            }
        }
    });
    resizeWindow();
    saveView();
    $("#accordion>li:first .link").trigger("click");
    //预览模式下，屏蔽在页面上元素的选中状态
    $("body").css("user-select", "none");
    getZoomOffset();
    if (!pageMeta.Editmode) {
        $("#attributepanel").css("display", "none");
        visitPanel();
        //隐藏工具栏
        $("#shapepanel").hide();
        //隐藏属性栏
        $(".editShow").hide();
    } else {
        $(".previewShow").hide();
    }
    /**
     *  @ls 20171102
     *  @ 调用页面重置比例，全局浏览加载方法 固定比例20%
     */
    createOverallSituation();
    var zoom = pageMeta.getZoomVal();
    localStorage.setItem("bodywidth", $("body").width() * zoom / 100);
    localStorage.setItem("bodyheight", $("body").height() * zoom / 100);

});


/**
 *  @ ls 20170916
 *  @ 获取offset值
 */

function getZoomOffset() {
    var zoom = pageMeta.getZoomVal();
    if (zoom == 1) {
        var offset = $("#holder").offset();
        pageMeta.zoomOffset.left = offset.left;
        pageMeta.zoomOffset.top = offset.top;
    }

}

/**
 * @desc  重置窗口大小
 */
function resizeWindow() {
    var win = $(window);
    var accordion = $("#accordion");
    var shapepanel = $('#shapepanel');
    shapepanel.height(win.height() - $("#headerTools").outerHeight());
    accordion.height(win.height() - $("#headerTools").outerHeight());
    getOpenHeight();
    /************ 新增 ******************************/
    pageMeta.bodyWidth = win.width();
    pageMeta.bodyHeight = win.height();
    pageMeta.canvasPageExtent.minx = pageMeta.canvasDiv.offset().left;
    pageMeta.canvasPageExtent.maxx = pageMeta.canvasDiv.offset().left + pageMeta.canvasSize.width;
    pageMeta.canvasPageExtent.miny = pageMeta.canvasDiv.offset().top;
    pageMeta.canvasPageExtent.maxy = pageMeta.canvasDiv.offset().top + pageMeta.canvasSize.height;
    pageMeta.canvasExtent.minx = 0;
    pageMeta.canvasExtent.maxx = pageMeta.canvasSize.width;
    pageMeta.canvasExtent.miny = 0;
    pageMeta.canvasExtent.maxy = pageMeta.canvasSize.height;
}

// 设置左侧图形菜单的显隐
function visitPanel() {
    var left1 = 0;
    var left2 = 124;
    if (pageMeta.panelVisible) {
        left1 = -114;
        left2 = 0;
    }
    $('#shapepanel').animate({
        left: left1
    }, 500);
    $('#viewpanel').animate({
        left: left2
    }, 500);
    pageMeta.panelVisible = !pageMeta.panelVisible;
}

function drawMouseDown(w, h, ft, url, warningurl) {
    /************ 新增 ******************************/
    if (ft == "FACILITY_M" || ft == "FACILITY_PL") {
        w = 83;
        h = 20;
    } else if (ft == "FACILITY_EU") {
        w = 83;
        h = 24;
    } else if (ft == "FACILITY_F") {
        w = 42;
        h = 24;
    } else if (ft == "FACILITY_FST") {
        w = 24;
        h = 83;
    }
    /***********************************************/
    pageMeta.facilityType = ft;
    pageMeta.start_x = pageMeta.mouse_x;
    pageMeta.start_y = pageMeta.mouse_y;
    pageMeta.panel_x = pageMeta.mouse_x - w / 2;
    pageMeta.panel_y = pageMeta.mouse_y - h / 2;
    pageMeta.panel.css({
        'top': pageMeta.panel_y,
        'left': pageMeta.panel_x,
        'height': h,
        'width': w,
    });
    pageMeta.panel.attr('src', url);
    pageMeta.url = url;
    pageMeta.warningurl = warningurl;
    pageMeta.movePanel = true;
}

function drawMouseMove(e) {
    var zoom = pageMeta.getZoomVal();
    pageMeta.mouse_x = e.pageX;
    pageMeta.mouse_y = e.pageY;
    if (pageMeta.movePanel) {
        //新增元件时拖动方法
        pageMeta.panel.css({
            'top': pageMeta.panel_y + (pageMeta.mouse_y - pageMeta.start_y),
            'left': pageMeta.panel_x + (pageMeta.mouse_x - pageMeta.start_x),
        });
    }
}

function drawMouseUp(e) {
    var zoom = pageMeta.getZoomVal();
    if (pageMeta.movePanel) {
        pageMeta.movePanel = false;
        var offset = $('#' + pageMeta.container).offset();
        /**
         *  @ ls 20170914
         *  @ 修正添加元件错位问题
         */

        var x = pageMeta.panel_x + (pageMeta.mouse_x / zoom - pageMeta.start_x) - pageMeta.zoomOffset.left / zoom;
        var y = pageMeta.panel_y + (pageMeta.mouse_y / zoom - pageMeta.start_y) - pageMeta.zoomOffset.top / zoom;
        var w = pageMeta.panel.width();
        var h = pageMeta.panel.height();
        var shape = null;
        if (x > 0 && y > 0) {
            var x1 = x + w / 2 - 1;
            var y1 = y + h / 2 - 1;
            var x2 = x - 1;
            var y2 = y + h / 2 - 1;
            if (pageMeta.facilityType == ShapeConfig.FACILITY_BAV
                || pageMeta.facilityType == ShapeConfig.FACILITY_GAV
                || pageMeta.facilityType == ShapeConfig.FACILITY_GLV
                || pageMeta.facilityType == ShapeConfig.FACILITY_THV
                || pageMeta.facilityType == ShapeConfig.FACILITY_FM
                || pageMeta.facilityType == ShapeConfig.FACILITY_FA
                || pageMeta.facilityType == ShapeConfig.FACILITY_BUV
                || pageMeta.facilityType == ShapeConfig.FACILITY_CHV
                || pageMeta.facilityType == ShapeConfig.FACILITY_NV
                || pageMeta.facilityType == ShapeConfig.FACILITY_SV
                || pageMeta.facilityType == ShapeConfig.FACILITY_PSV
                || pageMeta.facilityType == ShapeConfig.FACILITY_FV
                || pageMeta.facilityType == ShapeConfig.FACILITY_CABLECONNECTION
                || pageMeta.facilityType == ShapeConfig.FACILITY_FXC
                || pageMeta.facilityType == ShapeConfig.FACILITY_ZS
                || pageMeta.facilityType == ShapeConfig.FACILITY_EV
                || pageMeta.facilityType == ShapeConfig.FACILITY_ELV
                || pageMeta.facilityType == ShapeConfig.FACILITY_FC     // 流量调节阀
                || pageMeta.facilityType == ShapeConfig.FACILITY_E      // 换热器
                || pageMeta.facilityType == ShapeConfig.FACILITY_FEBO   // 8字盲板(开启)
                || pageMeta.facilityType == ShapeConfig.FACILITY_FEBC   // 8字盲板(关闭)
                || pageMeta.facilityType == ShapeConfig.FACILITY_M      // 汇管
                || pageMeta.facilityType == ShapeConfig.FACILITY_PL     // 清球发射器
                || pageMeta.facilityType == ShapeConfig.FACILITY_EU     // U形换热器
                || pageMeta.facilityType == ShapeConfig.FACILITY_F      // 卧式过滤器
                || pageMeta.facilityType == ShapeConfig.FACILITY_IJ     // 绝缘接头
                || pageMeta.facilityType == ShapeConfig.FACILITY_FST    // 放散塔
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE1
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE2
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE3
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE4
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE53
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE54
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE55
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE56
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE57
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE58
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE59
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE60
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE61
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE62
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE72
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE73
                || pageMeta.facilityType == ShapeConfig.FACILITY_SHAPE74


                || pageMeta.facilityType == ShapeConfig.FACILITY_CYAN_MARK
                || pageMeta.facilityType == ShapeConfig.FACILITY_RED_MARK
                || pageMeta.facilityType == ShapeConfig.FACILITY_LEFT_MARK1
                || pageMeta.facilityType == ShapeConfig.FACILITY_LEFT_MARK2
                || pageMeta.facilityType == ShapeConfig.FACILITY_RIGHT_MARK1
                || pageMeta.facilityType == ShapeConfig.FACILITY_RIGHT_MARK2
                || pageMeta.facilityType == ShapeConfig.FACILITY_MARK
                || pageMeta.facilityType == ShapeConfig.FACILITY_TRIANGLE_MARK
                || pageMeta.facilityType == ShapeConfig.FACILITY_GROUND
                || pageMeta.facilityType == ShapeConfig.FACILITY_TRIANGLE
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW1
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW2
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW63
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW64
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW65
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW66
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW67
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW68
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW69
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW70
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW71
                || pageMeta.facilityType == ShapeConfig.FACILITY_ARROW75


                || pageMeta.facilityType == ShapeConfig.FACILITY_CREATETEXT  // 文字工具创建的图形


            /********************/
            ) {
                createShape(pageMeta.url, pageMeta.warningurl, x1, y1, pageMeta.panel.width(), pageMeta.panel.height(), pageMeta.facilityType);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_BLACK_BOLD) {
                // createBlackBoldLine(x2, y2, pageMeta.facilityType);
                createLine(x2, y2, pageMeta.facilityType, "#000000", "#000000", 4, 2);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_BLACK) {
                // createBlackLine(x2, y2, pageMeta.facilityType);
                createLine(x2, y2, pageMeta.facilityType, "#000000", "#000000", 2, 1);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_RED) {
                // createRedLine(x2, y2, pageMeta.facilityType);
                createLine(x2, y2, pageMeta.facilityType, "red", "red", 2, 1);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_BLUE) {
                // createBlueLine(x2, y2, pageMeta.facilityType);
                createLine(x2, y2, pageMeta.facilityType, "blue", "blue", 2, 1);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_CYAN) {
                // createCyanLine(x2, y2, pageMeta.facilityType);
                createLine(x2, y2, pageMeta.facilityType, "cyan", "cyan", 2, 1);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_YELLOW) {
                // createYellowLine(x2, y2, pageMeta.facilityType);
                createLine(x2, y2, pageMeta.facilityType, "yellow", "yellow", 2, 1);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_PINK_DASHED) {
                createPinkDashedLine(x2, y2, pageMeta.facilityType);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_CONNECTIONLINE) {
                createConnectLine(x2, y2, pageMeta.facilityType);
            } else if (pageMeta.facilityType == ShapeConfig.LINE_WIRE
                || pageMeta.facilityType == ShapeConfig.LINE_ANODECABLE
                || pageMeta.facilityType == ShapeConfig.LINE_CATHODECABLE) {
                createWireLine(x2, y2, pageMeta.facilityType);
            }
        }
        pageMeta.panel.css({
            'top': -100,
            'left': -100,
        });
        pageMeta.facilityType = '';
        pageMeta.url = '';
        pageMeta.warningurl = '';
    }
}

function selectShape() {
    var box = pageMeta.extent.shape.getBBox();
    pageMeta.selectedShapeList = pageMeta.collection.getGeometry(box);
    for (var i = 0; i < pageMeta.selectedShapeList.length; i++) {
        if (pageMeta.selectedShapeList[i].facilityType != ShapeConfig.FACILITY_PIPECABLECONNECTION) {
            pageMeta.selectedShapeList[i].select();
        }
    }
    pageMeta.panel_x = pageMeta.extent.x;
    pageMeta.panel_y = pageMeta.extent.y;
}

function getSelectShapeLoact() {
    pageMeta.selectedShapeLocatList = [];
    if (!pageMeta.Editmode) {
        var list = [];
        for (var j = 0; j < pageMeta.selectedShapeList.length; j++) {
            if (pageMeta.selectedShapeList[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.selectedShapeList[j].bitNumber != undefined) {
                list.push(pageMeta.selectedShapeList[j])
            }
        }
        locationShapInfo(list);
    }
    for (var i = 0; i < pageMeta.selectedShapeList.length; i++) {
        pageMeta.selectedShapeLocatList.push({
            x: pageMeta.selectedShapeList[i].x,
            y: pageMeta.selectedShapeList[i].y,
            bx: pageMeta.selectedShapeList[i].bx,
            by: pageMeta.selectedShapeList[i].by,
            cx: pageMeta.selectedShapeList[i].cx,
            cy: pageMeta.selectedShapeList[i].cy,
            /*
                @ ls 20170908
                @ 增加c1c2两点坐标。加入历史记录
            */
            // c1x: pageMeta.selectedShapeList[i].c1x,
            // c1y: pageMeta.selectedShapeList[i].c1y,
            // c2x: pageMeta.selectedShapeList[i].c2x,
            // c2y: pageMeta.selectedShapeList[i].c2y,
            /**********************************/
            ex: pageMeta.selectedShapeList[i].ex,
            ey: pageMeta.selectedShapeList[i].ey,
        });
    }
}

function unSelectShape() {
    for (var i = 0; i < pageMeta.selectedShapeList.length; i++) {
        pageMeta.selectedShapeList[i].unSelect();
    }
    if (pageMeta.MultiselectEle.list.length > 0) {
        for (var j = 0; j < pageMeta.MultiselectEle.list.length; j++) {
            pageMeta.MultiselectEle.list[j].unSelect();
        }
    }
    pageMeta.MultiselectEle.list = [];
    pageMeta.selectedShapeList = [];
    pageMeta.selectedShapeLocatList = [];
}

function hideExtent() {
    unSelectShape();
    pageMeta.extent.x = -1000;
    pageMeta.extent.y = -1000;
    pageMeta.extent.width = 0;
    pageMeta.extent.height = 0;
    pageMeta.extent.moveTo();
    pageMeta.extent.shape.toFront();
}

var old

/**
 * @desc  加载数据 绘图
 */
function createGeometrys(list) {
    pageMeta.collection.clear();
    //$("#infoAlert").show();
    pageMeta.dataCaching.obj = list;
    pageMeta.dataCaching.num = 0;
    pageMeta.dataCaching.ID == setTimeout(dataCaching, 0);
}

/**
 *  @ ls 20170921
 *  优化加载方法，防止加载时大量DOM操作阻塞主线程，导致假死甚至浏览器崩溃
 *  dataCaching
 *  dataCachingR
 *
 */
// function da(){
//     if (pageMeta.dataCaching.num < pageMeta.dataCaching.obj.length) {
//         for(var i=0;i<100;i++){
//             new createGeometry(pageMeta.dataCaching.obj[pageMeta.dataCaching.num])
//             pageMeta.dataCaching.num++;
//             //console.log(pageMeta.dataCaching.num)
//         }
//         //setTimeout(da,0);
//     }else{
//         clearInterval(pageMeta.dataCaching.ID)
//         //console.log((new Date() - old) / 1000)
//     }

// }
function dataCaching() {
    if (typeof (pageMeta.dataCaching.obj) == "string") {
        pageMeta.dataCaching.obj = JSON.parse(pageMeta.dataCaching.obj)
    }
    if (pageMeta.dataCaching.num < pageMeta.dataCaching.obj.length) {
        //var text = "图形加载中..." + Math.floor((pageMeta.dataCaching.num / pageMeta.dataCaching.obj.length) * 100) + "%"
        //$("#infoAlert").text(text)

        pageMeta.dataCaching.ComponentLocation.push(new createGeometry(pageMeta.dataCaching.obj[pageMeta.dataCaching.num]))
        pageMeta.dataCaching.num++;
        pageMeta.dataCaching.ID = setTimeout(dataCaching, 1)
        //pageMeta.dataCaching.ID = requestAnimationFrame(dataCaching)
    } else {
        clearTimeout(pageMeta.dataCaching.ID);
        pageMeta.dataCaching.num = 0;
        //cancelAnimationFrame(pageMeta.dataCaching.ID);
        /////////////////////////////////////////////////
        pageMeta.dataCaching.Robj = pageMeta.collection.shapeList;
        if (pageMeta.copylist.after.length) {
            var list = [];
            for (var i = 0; i < pageMeta.dataCaching.Robj.length; i++) {
                for (var j = 0; j < pageMeta.copylist.after.length; j++) {
                    if (pageMeta.dataCaching.Robj[i].id == pageMeta.copylist.after[j].id) {
                        list.push(pageMeta.dataCaching.Robj[i]);
                    }
                }
            }
            pageMeta.dataCaching.Robj = list;
            var zoom = pageMeta.getZoomVal();
            pageMeta.copylist.before = pageMeta.dataCaching.Robj;
            pageMeta.copylist.beforex = pageMeta.copylist.afterx / zoom;
            pageMeta.copylist.beforey = pageMeta.copylist.aftery / zoom;
        }
        //pageMeta.dataCaching.RID = dataCachingR();
        pageMeta.dataCaching.Rnum = 0;
        pageMeta.dataCaching.RID = setTimeout(dataCachingR, 0);
    }

}

function dataCachingR() {
    if (pageMeta.dataCaching.Rnum < pageMeta.dataCaching.Robj.length) {
        // var text = "图形关系加载中..." + Math.floor((pageMeta.dataCaching.Rnum / pageMeta.dataCaching.Robj.length) * 100) + "%"
        // $("#infoAlert").text(text);
        new createConnection(pageMeta.dataCaching.Robj[pageMeta.dataCaching.Rnum]);
        pageMeta.dataCaching.Rnum++;
        //pageMeta.dataCaching.RID = requestAnimationFrame(dataCachingR)
        pageMeta.dataCaching.RID = setTimeout(dataCachingR, 1)
    } else {
        clearTimeout(pageMeta.dataCaching.RID)
        var len = pageMeta.dataCaching.createList.length;
        pageMeta.dataCaching.Rnum = 0;
        $("#infoAlert").hide();
        if (pageMeta.copylist.after.length) {
            newDisplay("粘贴完毕");
        } else {
            loadTwinkle()
            //加载完成执行方法
            pageMeta.loadIsOver = true;
        }
        //cancelAnimationFrame(pageMeta.dataCaching.RID);
        console.log("加载完成")
        //ComponentLocations(["013", "014"])
    }
}

function createGeometry(obj) {
    this.obj = obj;
    this.shape = null;
    if (this.obj) {
        if (this.obj.facilityType != ShapeConfig.FACILITY_PIPECABLECONNECTION) {
            if (this.obj.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                this.shape = new ShapeBean();
            } else if (this.obj.geometryType == ShapeConfig.GEOMETRY_POLYLINE) {
                this.shape = new PolyLineBean();
                this.shape.middleUp = this.shape.deleteConnectFun = this.shape.createConnectFun = saveView;
            } else if (this.obj.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
                this.shape = new CurveLineBean();
            } else if (this.obj.geometryType == ShapeConfig.GEOMETRY_LINE) {
                this.shape = new LineBean();
                this.shape.middleUp = this.shape.deleteConnectFun = this.shape.createConnectFun = saveView;
            }
            for (var k in this.obj) {
                this.shape[k] = this.obj[k];
            }

            if (this.obj.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                this.shape.lineList = [];
            }

            this.shape.raphael = pageMeta.canvas;
            this.shape.shapeCollection = pageMeta.collection;


            /************* 修改 *****************/
            // shape.clickFun = shapeClick;
            pageMeta.addPointState,
                this.shape.clickFun = shapeClick;
            this.shape.scope = pageMeta.canvasExtent;
            // shape.createConnectFun = saveView;
            /*********************************/
            this.shape.upFun = this.shape.textUpFun = saveView;
            this.shape.canMove = pageMeta.editable;
            this.shape.createShape();
            this.shape.hasBackShape = pageMeta.addPointState || pageMeta.isSelectArea;
            return this.shape;
        }
    }
}

function createConnection(obj) {
    this.obj = obj;
    this.beginShape = null;
    this.endShape = null;
    if (this.obj) {
        if (this.obj.geometryType != ShapeConfig.GEOMETRY_POLYGON) {
            this.beginShape = pageMeta.collection.getGeometryById(this.obj.beginShape);
            this.endShape = pageMeta.collection.getGeometryById(this.obj.endShape);
            this.obj.beginShape = this.beginShape;
            this.obj.endShape = this.endShape;
            if (this.obj.beginShape) {
                this.obj.beginShape.addLine(this.obj);
            }
            if (this.obj.endShape) {
                this.obj.endShape.addLine(this.obj);
            }
        }
    }
}

// function createGeometry(obj) {
//     if (obj) {
//         if (obj.facilityType != ShapeConfig.FACILITY_PIPECABLECONNECTION) {
//             var shape = null;
//             if (obj.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
//                 shape = new ShapeBean();
//             } else if (obj.geometryType == ShapeConfig.GEOMETRY_POLYLINE) {
//                 shape = new PolyLineBean();
//                 shape.middleUp = shape.deleteConnectFun = shape.createConnectFun = saveView;
//             } else if (obj.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
//                 shape = new CurveLineBean();
//             } else if (obj.geometryType == ShapeConfig.GEOMETRY_LINE) {
//                 shape = new LineBean();
//                 shape.middleUp = shape.deleteConnectFun = shape.createConnectFun = saveView;
//             }

//             for (var k in obj) {
//                 shape[k] = obj[k];
//             }

//             if (obj.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
//                 shape.lineList = [];
//             }

//             shape.raphael = pageMeta.canvas;
//             shape.shapeCollection = pageMeta.collection;


//             /************* 修改 *****************/
//             // shape.clickFun = shapeClick;
//             pageMeta.addPointState,
//             shape.clickFun = shapeClick;
//             shape.scope = pageMeta.canvasExtent;
//             // shape.createConnectFun = saveView;
//             /*********************************/
//             shape.upFun = shape.textUpFun = saveView;
//             shape.canMove = pageMeta.editable;
//             shape.createShape();
//             shape.hasBackShape = pageMeta.addPointState || pageMeta.isSelectArea;
//             console.log(shape)
//             return shape
//         }
//     }
// }

// function createConnection(obj) {
//     if (obj) {
//         if (obj.geometryType != ShapeConfig.GEOMETRY_POLYGON) {
//             var beginShape = pageMeta.collection.getGeometryById(obj.beginShape);
//             var endShape = pageMeta.collection.getGeometryById(obj.endShape);
//             obj.beginShape = beginShape;
//             obj.endShape = endShape;
//             if (obj.beginShape) {
//                 obj.beginShape.addLine(obj);
//             }
//             if (obj.endShape) {
//                 obj.endShape.addLine(obj);
//             }
//         }
//     }
// }

function createShape(url, warningurl, x, y, w, h, ft) {
    /************* 修改 **************/
    var shape = null;

    shape = createGeometry({
        geometryType: ShapeConfig.GEOMETRY_POLYGON,
        shapeType: ShapeConfig.SHAPE_IMAGE,
        facilityType: ft,
        color: url,
        warningColor: warningurl,
        textColor: '#000000',
        x: x,
        y: y,
        width: w,
        height: h,
    });


    saveView();
    return shape;
    /***********************************/
}

function createPolyLine() {
    createGeometry({
        geometryType: ShapeConfig.GEOMETRY_POLYLINE,
        color: '#000000',
        fillColor: '#FFFFFF',
        warningColor: '#FF0000',
        warningFillColor: '#FFFFFF',
        border: 5,
        pointSize: 1,
    });
    saveView();
}

function createWireLine(x, y, ft) {
    var shapeType = ShapeConfig.SHAPE_ELLIPSE;
    var url = '';
    var size = 3;
    if (ft == ShapeConfig.LINE_ANODECABLE) {
        shapeType = ShapeConfig.SHAPE_IMAGE;
        url = 'image/icon_01.png';
        size = 10;
    } else if (ft == ShapeConfig.LINE_CATHODECABLE) {
        shapeType = ShapeConfig.SHAPE_IMAGE;
        url = 'image/icon_02.png';
        size = 10;
    } else {
        shapeType = ShapeConfig.SHAPE_ELLIPSE;
        url = '';
        size = 3;
    }
    createGeometry({
        geometryType: ShapeConfig.GEOMETRY_CURVELINE,
        color: '#000000',
        fillColor: '#FFFFFF',
        warningColor: '#0000FF',
        warningFillColor: '#FFFFFF',
        middleShapeType: shapeType,
        facilityType: ft,
        middleColor: url ? url : '#000000',
        middleFillColor: '#FFFFFF',
        warningMiddleColor: url ? url : '#0000FF',
        warningMiddleFillColor: '#FFFFFF',
        bx: x,
        by: y,
        cx: x + 21,
        cy: y,
        ex: x + 42,
        ey: y,
        middleWidth: size,
        middleHeight: size,
        border: 1,
        pointSize: 1,
    });
    saveView();
}

function createLine(x, y, ft, warningColor, color, border, pointSize) {
    var lineType = "BrokenLine"
    if (pageMeta.lineType == "StraightLine") {
        lineType = "StraightLine"
    }
    var line = createGeometry({
        geometryType: ShapeConfig.GEOMETRY_POLYLINE,
        facilityType: ft,
        warningColor: warningColor,
        warningFillColor: warningColor,
        color: color,
        fillColor: color,
        border: border,
        bx: x,
        by: y,
        /**
         * @ ls 20170909
         * @ 增加折点
         */
        // 添加折点
        // c1x: x + 10,
        // c1y: y,
        // c2x: x + 32,
        // c2y: y,

        ex: x + 42,
        ey: y,
        pointSize: pointSize,
        lineType: lineType,
    });
    saveView();
    return line;
}


/**
 * @desc  创建粉色虚线
 */
function createPinkDashedLine(x, y, ft) {
    var lineType = "BrokenLine"
    if (pageMeta.lineType == "StraightLine") {
        lineType = "StraightLine"
    }
    var line = createGeometry({
        geometryType: ShapeConfig.GEOMETRY_POLYLINE,
        facilityType: ft,
        warningColor: '#ff00ff',
        warningFillColor: '#ff00ff',
        bx: x,
        by: y,
        // 添加折点
        // c1x: x + 10,
        // c1y: y,
        // c2x: x + 32,
        // c2y: y,

        ex: x + 42,
        ey: y,
        dasharray: ['--'],
        color: '#ff00ff',
        fillColor: '#ff00ff',
        border: 2,
        pointSize: 3,
        lineType: lineType,
    });
    saveView();
    return line;
}

function createConnectLine(x, y, ft) {
    var lineType = "BrokenLine"
    if (pageMeta.lineType == "StraightLine") {
        lineType = "StraightLine"
    }
    createGeometry({
        geometryType: ShapeConfig.GEOMETRY_POLYLINE,
        facilityType: ft,
        color: '#000000',
        fillColor: '#000000',
        dasharray: ['--'],
        bx: x + 21,
        by: y + 14.5,
        // 添加折点
        // c1x: x + 10,
        // c1y: y,
        // c2x: x + 32,
        // c2y: y,

        ex: x - 21,
        ey: y + 14.5,
        border: 2,
        pointSize: 3,
        lineType: lineType,
    });
    saveView();
}

/************** 修改  ****************************/
var attributeList = ChartConfig.nodeAttributeConfig;

/*****************************************/

/**
 * @desc  图形的点击事件
 */
function shapeClick(shape) {
    if (pageMeta.MultiselectEle.type) {
        pageMeta.MultiselectEle.list.push(shape);
        for (var i = 0; i < pageMeta.MultiselectEle.list.length; i++) {
            pageMeta.MultiselectEle.list[i].select();
        }
    } else {
        var attributeview = $('#attributeview');
        var table = $('#attributeTable');
        hideExtent();
        if (pageMeta.selectedBean) {
            pageMeta.selectedBean.unSelect();
        }
        table.children().remove();
        if (pageMeta.selectedBean == shape) {
            pageMeta.selectedBean = null;
            attributeview.hide();
        } else {
            var textInput = pageMeta.textInput;
            shape.select();
            pageMeta.selectedBean = shape;
            var list = attributeList[shape.facilityType];
            var html = '';
            var textType = ""
            if (!isNull(list)) {
                for (var a = 0; a < list.length; a++) {
                    var input = textInput[list[a]];
                    html += '<tr>';
                    html += '<td style="width: 60px;">' + input.label + '</td>';
                    html += '<td>';
                    if (input.item) {
                        html += '<select name="' + input.name + '" type="select-one" style="width: 100%; height: 23px; font-size: 10px;" onfocus="pageMeta.keyState = false;" onblur="pageMeta.keyState = true;">';
                        for (var b = 0; b < input.item.length; b++) {
                            html += '<option value="' + input.item[b].value + '">' + input.item[b].label + '</option>';
                        }
                        html += '</select>';
                    } else if (input.color) {
                        html += '<input name="' + input.name + '" class="select-color" type="text" value="#000000" style="width: 100%; height: 16px; font-size: 10px;" onfocus="pageMeta.keyState = false;" onblur="pageMeta.keyState = true;">';
                    } else {
                        if ((shape.geometryType == "GEOMETRY_POLYGON" && input.name == "ID") || (shape.geometryType == "GEOMETRY_POLYLINE" && input.name == "text")) {
                            html += '<input name="' + input.name + '" type="text" style="width: 100%; height: 16px; font-size: 10px;" onfocus="pageMeta.keyState = false;" onblur="pageMeta.keyState = true;">';
                        } else if (shape.geometryType == "GEOMETRY_POLYGON" && input.name == "magnification") {
                            html += '<input name="' + input.name + '" type="number" min="1" max="10" style="width: 100%; height: 16px; font-size: 10px;" onfocus="pageMeta.keyState = false;" onblur="pageMeta.keyState = true;">';
                        } else {
                            if ((shape.realtext.search(shape[input.name]) > -1 && shape.realtextSandH == "show") || (shape.realtext2.search(shape[input.name]) > -1 && shape.realtext2SandH == "show")) {
                                html += '<input name="' + input.name + '" type="text" style="width: 70%; height: 16px; font-size: 10px;" onfocus="pageMeta.keyState = false;" onblur="pageMeta.keyState = true;"><input type="button" onclick="textHiddenSwitch(this)" value="隐藏">';
                            } else if ((shape.realtext.search(shape[input.name]) > -1 && shape.realtextSandH == "hide") || (shape.realtext2.search(shape[input.name]) > -1 && shape.realtext2SandH == "hide")) {
                                html += '<input name="' + input.name + '" type="text" style="width: 70%; height: 16px; font-size: 10px;" onfocus="pageMeta.keyState = false;" onblur="pageMeta.keyState = true;"><input type="button" onclick="textHiddenSwitch(this)" value="显示">';
                            }
                        }
                    }
                    html += '</td>';
                    html += '</tr>';
                }
                html += '<tr><td colspan="2"><input type="button" value="确定" onclick="setShapeAttr()"></td></tr>';
                table.append(html);
                $(".select-color").simpleColor({displayColorCode: true});
                for (var c = 0; c < list.length; c++) {
                    var input = textInput[list[c]];
                    if (input.name == "stroke-width") {
                        Tools.setValue(input.name, 0, shape["border"]);
                    } else {
                        Tools.setValue(input.name, 0, shape[input.name]);
                    }
                    if (input.name == "textColor" || input.name == "text2Color" || input.name == "color") {
                        Tools.setValue(input.name, 0, shape[input.name]);
                        var a = $("input[name=" + input.name + "]+.simpleColorContainer>.simpleColorDisplay");
                        a.html(shape[input.name]).css("background-color", shape[input.name]);
                    }
                    if (input.name == "magnification") {
                        shape[input.name] == undefined ? 1 : shape[input.name];
                        Tools.setValue(input.name, 0, Number(shape[input.name]));
                    }
                }
                attributeview.show();
                /**
                 *  @ ls 20170918
                 *  @ 增加输出数据接口
                 */

                if (pageMeta.locationShapInfo.type) {
                    pageMeta.locationShapInfo.arr.push(shape)
                } else {
                    locationShapInfo([shape]);
                }

                if(shape.facilityType == "FACILITY_CREATETEXT"){
                    var name = shape.realtext + "&" + sessionStorage.getItem("stationName");
                    console.log(name)
                    technology_recordView(name)
                }
            }
        }
    }
}

/**
 * @desc  设置图形的属性
 */
function setShapeAttr() {
    if (pageMeta.selectedBean) {
        var realtext = "";  // 图例真实显示的名称
        var realtext2 = "";
        var textInput = pageMeta.textInput;
        var list = attributeList[pageMeta.selectedBean.facilityType];
        for (var a = 0; a < list.length; a++) {
            var input = textInput[list[a]];
            if (input.name == "magnification") {
                pageMeta.selectedBean.width = pageMeta.selectedBean.width / pageMeta.selectedBean.magnification;
                pageMeta.selectedBean.height = pageMeta.selectedBean.height / pageMeta.selectedBean.magnification;
            }
            pageMeta.selectedBean[input.name] = $($("[name='" + input.name + "']")[0]).val();
            /**
             *  @ ls 20170912
             *  @ 增加修改线宽度方法
             */
            if (input.name == "stroke-width") {
                var swVal = Number($($("[name='" + input.name + "']")[0]).val());
                pageMeta.selectedBean.shape.attr({
                    "stroke-width": $($("[name='" + input.name + "']")[0]).val()
                });
                pageMeta.selectedBean.border = swVal
                pageMeta.selectedBean.bShape.shape.attr("rx", swVal)
                pageMeta.selectedBean.bShape.shape.attr("ry", swVal)
            }
            if (input.name == "magnification") {
                pageMeta.selectedBean.magnification = pageMeta.selectedBean.magnification > 10 ? 10 : pageMeta.selectedBean.magnification;
                pageMeta.selectedBean.magnification = pageMeta.selectedBean.magnification < 1 ? 1 : pageMeta.selectedBean.magnification;
                pageMeta.selectedBean.width = pageMeta.selectedBean.width * pageMeta.selectedBean.magnification;
                pageMeta.selectedBean.height = pageMeta.selectedBean.height * pageMeta.selectedBean.magnification;
            }

            if (input.name == "color") {
                var colorVal = $($("[name='" + input.name + "']")[0]).val();
                pageMeta.selectedBean.fillColor = colorVal;
                pageMeta.selectedBean.shape.attr("stroke", colorVal);
                pageMeta.selectedBean.bShape.shape.fill = colorVal;
                pageMeta.selectedBean.bShape.shape.stroke = colorVal;
                pageMeta.selectedBean.eShape.shape.fill = colorVal;
                pageMeta.selectedBean.eShape.shape.stroke = colorVal;
                pageMeta.selectedBean.bShape.shape.attr({"fill": colorVal, "stroke": colorVal});
                pageMeta.selectedBean.eShape.shape.attr({"fill": colorVal, "stroke": colorVal});
            }
        }
        //线条显示 长度*管径
        if (pageMeta.selectedBean.facilityType == 'LINE_BLACK_BOLD' ||
            pageMeta.selectedBean.facilityType == 'LINE_BLACK' ||
            pageMeta.selectedBean.facilityType == 'LINE_RED' ||
            pageMeta.selectedBean.facilityType == 'LINE_BLUE' ||
            pageMeta.selectedBean.facilityType == 'LINE_CYAN' ||
            pageMeta.selectedBean.facilityType == 'LINE_YELLOW' ||
            pageMeta.selectedBean.facilityType == 'LINE_PINK_DASHED' ||
            pageMeta.selectedBean.facilityType == 'LINE_ANODECABLE' ||
            pageMeta.selectedBean.facilityType == 'LINE_CATHODECABLE' ||
            pageMeta.selectedBean.facilityType == 'LINE_WIRE' ||
            pageMeta.selectedBean.facilityType == 'LINE_CONNECTIONLINE') {

            //站内的管道不显示 长度和管径
            if (!isNull($($("[name='diameter']")[0]).val()) && !isNull($($("[name='length']")[0]).val())) {
                realtext = $($("[name='length']")[0]).val() + "km";
                realtext2 = $($("[name='diameter']")[0]).val() + "mm";
            } else if (isNull($($("[name='diameter']")[0]).val()) && isNull($($("[name='length']")[0]).val())) {
                realtext = "";
                realtext2 = "";
            } else if (isNull($($("[name='length']")[0]).val())) {
                realtext = $($("[name='diameter']")[0]).val() + "mm";
                realtext2 = "";
            } else {
                realtext = "";
                realtext2 = $($("[name='length']")[0]).val() + "km";
            }
        } else if (pageMeta.selectedBean.facilityType == 'FACILITY_CREATETEXT') {
            realtext = $($("[name='text']")[0]).val()
        } else {  //基本元件显示 名字和位号
            realtext = $($("[name='text']")[0]).val();
            realtext2 = $($("[name='bitNumber']")[0]).val()
        }
        pageMeta.selectedBean['realtext'] = realtext;
        pageMeta.selectedBean['realtext2'] = realtext2;
        pageMeta.selectedBean.moveTo();
        saveView();
    }
}


/**
 * @desc  保存视图
 */
function saveView() {
    if (pageMeta.writeHistory) {
        var historyBean = new HistoryBean();
        historyBean.actions = pageMeta.collection.getGeometryAttribute();
        var historyLength = pageMeta.historyList.length;
        if (pageMeta.historyIndex == historyLength - 1) {
            if (historyLength < pageMeta.maxHistoryLength) {
                pageMeta.historyList.push(historyBean);
                pageMeta.historyIndex++;
            } else {
                var list = [];
                for (var a = 1; a < pageMeta.maxHistoryLength; a++) {
                    list.push(pageMeta.historyList[a]);
                }
                list.push(historyBean);
                pageMeta.historyList = list;
            }
        } else {
            var list = [];
            for (var b = 0; b <= pageMeta.historyIndex; b++) {
                list.push(pageMeta.historyList[b]);
            }
            list.push(historyBean);
            pageMeta.historyList = list;
            pageMeta.historyIndex++;
        }
    }
}


/**
 * @desc  撤销
 */
function previousView() {
    if (pageMeta.writeHistory && pageMeta.historyIndex > 0) {
        hideExtent();
        pageMeta.historyIndex--;
        createGeometrys(pageMeta.historyList[pageMeta.historyIndex].actions);
    }
}


/**
 * @desc  恢复
 */
function nextView() {
    if (pageMeta.writeHistory && pageMeta.historyIndex < pageMeta.historyList.length - 1) {
        hideExtent();
        pageMeta.historyIndex++;
        createGeometrys(pageMeta.historyList[pageMeta.historyIndex].actions);
    }
}


/**
 * @desc  保存
 */
function save() {
    var attr = JSON.stringify(pageMeta.collection.getGeometryAttribute());
    $('#textarea').val(attr);
    saveChart(attr);
}


/**
 * @desc  保存成图片
 */
function saveAsImage() {
    var panel = $('#' + pageMeta.container);
    var image = document.getElementById('exportImage');
    image.width = panel.innerWidth();
    image.height = panel.innerHeight();
    var divContent = document.getElementById(pageMeta.container).innerHTML;
    for (var a in imageMeta) {
        divContent = divContent.replace(new RegExp(imageMeta[a].url, 'gm'), imageMeta[a].html);
        // if (a.length == 2) {
        divContent = divContent.replace(new RegExp(imageMeta[a].warningurl, 'gm'), imageMeta[a].warninghtml);
        // }
    }
    var data = "data:image/svg+xml," + divContent;
    image.onload = function () {
        image.src = data;
        var canvas = document.getElementById('exportCanvas');
        canvas.width = panel.innerWidth();
        canvas.height = panel.innerHeight();
        var context = canvas.getContext('2d');
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.drawImage(image, 0, 0);

        // 将canvas的透明背景设置成白色
        var imageDataForColor = context.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < imageDataForColor.data.length; i += 4) {
            // 当该像素是透明的，则设置成白色
            if (imageDataForColor.data[i + 3] == 0) {
                imageDataForColor.data[i] = 255;
                imageDataForColor.data[i + 1] = 255;
                imageDataForColor.data[i + 2] = 255;
                imageDataForColor.data[i + 3] = 255;
            }
        }
        context.putImageData(imageDataForColor, 0, 0);

        var type = 'png';
        var imgData = canvas.toDataURL(type);
        var fixType = function (type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            var r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
        };
        imgData = imgData.replace(fixType(type), 'image/octet-stream');
        var saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        saveLink.href = imgData;

        //获取当前时间字符串
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString();
        var day = (now.getDate()).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        var dateTime = year + month + day;

        // saveLink.download = (new Date()).getTime() + '.' + type;
        saveLink.download = "工艺流程图_" + dateTime + '.' + type;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveLink.dispatchEvent(event);
    }
    image.src = data;
}


/**
 * @desc  删除图形
 */
function clearShape(all) {
    var number = 0;
    if (all) {
        number = pageMeta.collection.clear();
    } else {
        if (pageMeta.selectAreaList.length > 0) {
            var idx = null;
            for (var i = 0; i < pageMeta.selectAreaList.length; i++) {
                if (pageMeta.selectAreaList[i].selected) {
                    pageMeta.selectAreaList[i].remove();
                    idx = i;
                }
            }
            if (idx != null) {
                removeArrayOfN(pageMeta.selectAreaList, idx);
            }
        }
        {
            pageMeta.selectShape = null;
            number = pageMeta.collection.removeSelectShape();
            pageMeta.selectedShapeList = [];
            pageMeta.selectedShapeLocatList = [];
        }
    }
    if (number > 0) {
        saveView();
    }
}

function imageMouseOver(image) {
    image.src = image.src.replace('_01', '_02');
    image.src = image.src.replace('_03', '_02');
}

function imageMouseOut(image) {
    image.src = image.src.replace('_02', '_01');
    image.src = image.src.replace('_03', '_01');
}

function imageMouseDown(image) {
    image.src = image.src.replace('_01', '_03');
    image.src = image.src.replace('_02', '_03');
}

function imageMouseUp(image) {
    image.src = image.src.replace('_01', '_02');
    image.src = image.src.replace('_03', '_02');
}

function imageStateMouseOver(image) {
    image.src = image.src.replace('_01', '_02');
}

function imageStateMouseOut(image) {
    image.src = image.src.replace('_02', '_01');
}

function thickMouseDown(image) {
    if (pageMeta.thickState) {
        image.src = 'icon/thick_01.png';
    } else {
        image.src = 'icon/thick_03.png';
    }
    pageMeta.thickState = !pageMeta.thickState;
    setAllTextStyle(2);
}

function italicMouseDown(image) {
    if (pageMeta.italicState) {
        image.src = 'icon/italic_01.png';
    } else {
        image.src = 'icon/italic_03.png';
    }
    pageMeta.italicState = !pageMeta.italicState;
    setAllTextStyle(3);
}

function alignShape(type) {
    var list = pageMeta.collection.getSelectShape();
    var topShape = null;
    var leftShape = null;
    var shapeNumber = 0;
    var minTop = 100000000;
    var minLeft = 100000000;
    for (var a = 0; a < list.length; a++) {
        var shape = list[a];

        if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
            var box = shape.shape.getBBox();
            if (box.y < minTop) {
                minTop = box.y;
                topShape = shape;
            }
            if (box.x < minLeft) {
                minLeft = box.x;
                leftShape = shape;
            }
            shapeNumber++;
        }
    }
    var line = 0;
    if (shapeNumber > 1) {
        for (var b = 0; b < list.length; b++) {
            var shape = list[b];
            if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                if (type == 'left') {
                    line = topShape.x - topShape.width / 2;
                    shape.x = line + shape.width / 2;
                }
                if (type == 'right') {
                    line = topShape.x + topShape.width / 2;
                    shape.x = line - shape.width / 2;
                }
                if (type == 'center') {
                    line = topShape.x;
                    shape.x = line;
                }
                if (type == 'top') {
                    line = leftShape.y - leftShape.height / 2;
                    shape.y = line + shape.height / 2;
                }
                if (type == 'middle') {
                    line = leftShape.y;
                    shape.y = line;
                }
                if (type == 'bottom') {
                    line = leftShape.y + leftShape.height / 2;
                    shape.y = line - shape.height / 2;
                }
                shape.moveTo();
            }
        }
        getSelectShapeLoact();
        saveView();
    }
}

function setAllTextStyle(type) {
    var list = pageMeta.collection.shapeList;
    for (var a = 0; a < list.length; a++) {
        var shape = list[a];
        if (type == 1) {
            shape.textSize = parseInt($('#alltextsize').val());
        }
        if (type == 2) {
            if (pageMeta.thickState) {
                shape.textWeight = 'bold';
            } else {
                shape.textWeight = 'normal';
            }
        }
        if (type == 3) {
            if (pageMeta.italicState) {
                shape.textStyle = 'italic';
            } else {
                shape.textStyle = 'normal';
            }
        }
        shape.setText();
    }
}

function rotateShape(angle) {
    var list = pageMeta.collection.getSelectShape();
    for (var a = 0; a < list.length; a++) {
        var shape = list[a];
        // if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
        /******************* 修改 *****************/
        if (shape.textRotateAble && shape.textExtentShow && pageMeta.textSelectedStateRotate) {
            if (angle == 0 || angle == 90 || angle == 270) {
                if (pageMeta.textSelectedStateRotate.id == shape.textShape.id) {
                    var Rectification = DirectionEstimation(shape, "textShape");
                    shape.textShape.rotate(Rectification);
                    shape.textShape.textExtent.rotate(Rectification);
                    shape.textShape.rotate(angle);
                    shape.textShape.textExtent.rotate(angle);
                    shape.textAngle = angle;
                } else if (pageMeta.textSelectedStateRotate.id == shape.textShape2.id) {
                    var Rectification = DirectionEstimation(shape, "textShape2");
                    shape.textShape2.rotate(Rectification);
                    shape.textShape2.textExtent.rotate(Rectification);
                    shape.textShape2.rotate(angle);
                    shape.textShape2.textExtent.rotate(angle);
                    shape.textAngle2 = angle;
                }
                saveView();
            }
        } else {
            shape.rotate(angle);
        }
        /**********************************/
        // }
    }
}

function DirectionEstimation(shape, type) {
    if (shape[type][0].transform.animVal.length > 0) {
        var matrix = shape[type][0].transform.animVal[0].matrix;
        if (matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1) {
            //0或360
            return 0;
        } else if (matrix.a == 0 && matrix.b == 1 && matrix.c == -1 && matrix.d == 0) {
            //当前90 返回270度进行旋转，纠正旋转度数
            return 270;
        } else if (matrix.a == 0 && matrix.b == -1 && matrix.c == 1 && matrix.d == 0) {
            //当前270 返回90度进行旋转，纠正旋转度数
            return 90;
        }
    } else {
        return 0;
    }
}


function debug(str) {
    $('#textarea').val($('#textarea').val() + '\n' + str);
}

/*****************************************************************************/

// 基本图形配置
ShapeConfig = {
    SHAPE_RECT: 'SHAPE_RECT',
    SHAPE_ELLIPSE: 'SHAPE_ELLIPSE',
    SHAPE_IMAGE: 'SHAPE_IMAGE',

    GEOMETRY_POLYGON: 'GEOMETRY_POLYGON',  // 多边形
    GEOMETRY_POLYLINE: 'GEOMETRY_POLYLINE', // 多段线
    GEOMETRY_CURVELINE: 'GEOMETRY_CURVELINE', // 曲线
    GEOMETRY_LINE: 'GEOMETRY_LINE', // 线

    FACILITY_BAV: 'FACILITY_BAV',
    FACILITY_GAV: 'FACILITY_GAV',
    FACILITY_GLV: 'FACILITY_GLV',
    FACILITY_THV: 'FACILITY_THV',
    FACILITY_FM: 'FACILITY_FM',
    FACILITY_FA: 'FACILITY_FA',
    FACILITY_BUV: 'FACILITY_BUV',
    FACILITY_CHV: 'FACILITY_CHV',
    FACILITY_NV: 'FACILITY_NV',
    FACILITY_SV: 'FACILITY_SV',
    FACILITY_PSV: 'FACILITY_PSV',
    FACILITY_FV: 'FACILITY_FV',
    FACILITY_CABLECONNECTION: 'FACILITY_CABLECONNECTION',
    FACILITY_PIPECABLECONNECTION: 'FACILITY_PIPECABLECONNECTION',
    FACILITY_FXC: 'FACILITY_FXC',
    FACILITY_ZS: 'FACILITY_ZS',
    FACILITY_EV: 'FACILITY_EV',
    FACILITY_ELV: 'FACILITY_ELV',


    FACILITY_FC: "FACILITY_FC",    // 流量调节阀
    FACILITY_E: "FACILITY_E",      // 换热器
    FACILITY_FEBO: "FACILITY_FEBO",   // 8字盲板(开启)
    FACILITY_FEBC: "FACILITY_FEBC",  // 8字盲板(关闭)
    FACILITY_M: "FACILITY_M",     // 汇管
    FACILITY_PL: "FACILITY_PL",     // 清球发射器
    FACILITY_EU: "FACILITY_EU",    // U形换热器
    FACILITY_F: "FACILITY_F",    // 卧式过滤器
    FACILITY_IJ: "FACILITY_IJ",     // 绝缘接头
    FACILITY_FST: "FACILITY_FST",   // 放散塔
    FACILITY_SHAPE1: "FACILITY_SHAPE1",
    FACILITY_SHAPE2: "FACILITY_SHAPE2",
    FACILITY_SHAPE3: "FACILITY_SHAPE3",
    FACILITY_SHAPE4: "FACILITY_SHAPE4",
    FACILITY_SHAPE53: "FACILITY_SHAPE53",
    FACILITY_SHAPE54: "FACILITY_SHAPE54",
    FACILITY_SHAPE55: "FACILITY_SHAPE55",
    FACILITY_SHAPE56: "FACILITY_SHAPE56",
    FACILITY_SHAPE57: "FACILITY_SHAPE57",
    FACILITY_SHAPE58: "FACILITY_SHAPE58",
    FACILITY_SHAPE59: "FACILITY_SHAPE59",
    FACILITY_SHAPE60: "FACILITY_SHAPE60",
    FACILITY_SHAPE61: "FACILITY_SHAPE61",
    FACILITY_SHAPE62: "FACILITY_SHAPE62",
    FACILITY_SHAPE72: "FACILITY_SHAPE72",
    FACILITY_SHAPE73: "FACILITY_SHAPE73",
    FACILITY_SHAPE74: "FACILITY_SHAPE74",

    FACILITY_CREATETEXT: "FACILITY_CREATETEXT",  // 文字工具


    TEXT_INPUT: "TEXT_INPUT", // 自定义选择区域
    SELECT_AREA: "SELECT_AREA", // 自定义选择区域

    FACILITY_CYAN_MARK: "FACILITY_CYAN_MARK",  // 箭头1
    FACILITY_RED_MARK: "FACILITY_RED_MARK", // 箭头1
    FACILITY_LEFT_MARK1: "FACILITY_LEFT_MARK1",
    FACILITY_LEFT_MARK2: "FACILITY_LEFT_MARK2", // 在用
    FACILITY_RIGHT_MARK1: "FACILITY_RIGHT_MARK1",
    FACILITY_RIGHT_MARK2: "FACILITY_RIGHT_MARK1",
    FACILITY_MARK: "FACILITY_MARK", // 切备用
    FACILITY_TRIANGLE_MARK: "FACILITY_TRIANGLE_MARK", // 切在用
    FACILITY_GROUND: "FACILITY_GROUND",
    FACILITY_TRIANGLE: "FACILITY_TRIANGLE",
    FACILITY_ARROW1: "FACILITY_ARROW1",
    FACILITY_ARROW2: "FACILITY_ARROW2",
    FACILITY_ARROW63: "FACILITY_ARROW63",
    FACILITY_ARROW64: "FACILITY_ARROW64",
    FACILITY_ARROW65: "FACILITY_ARROW65",
    FACILITY_ARROW66: "FACILITY_ARROW66",
    FACILITY_ARROW67: "FACILITY_ARROW67",
    FACILITY_ARROW68: "FACILITY_ARROW68",
    FACILITY_ARROW69: "FACILITY_ARROW69",
    FACILITY_ARROW70: "FACILITY_ARROW70",
    FACILITY_ARROW71: "FACILITY_ARROW71",
    FACILITY_ARROW75: "FACILITY_ARROW75",


    LINE_BLACK_BOLD: 'LINE_BLACK_BOLD',// 3PE管道
    LINE_BLACK: 'LINE_BLACK',// 非3PE管道
    LINE_RED: "LINE_RED",
    LINE_BLUE: "LINE_BLUE",
    LINE_CYAN: "LINE_CYAN",
    LINE_YELLOW: "LINE_YELLOW",
    LINE_PINK_DASHED: "LINE_PINK_DASHED",

    LINE_ANODECABLE: 'LINE_ANODECABLE',// 阳极电缆
    LINE_CATHODECABLE: 'LINE_CATHODECABLE',// 阴极电缆
    LINE_WIRE: 'LINE_WIRE',// 跨接电缆
    LINE_CONNECTIONLINE: 'LINE_CONNECTIONLINE',// 连接线

};

// 图形之间的关系
ShapeCollection = function () {
    this.relation = {
        LINE_BLACK_BOLD: {
            FACILITY_BAV: 1, // 场站
            FACILITY_GAV: 1, // 阀室
            FACILITY_THV: 1, // 三通
            FACILITY_FM: 1, // 大小头
            FACILITY_NV: 1, // 无保护装置绝缘接头
            FACILITY_SV: 1, // 有保护装置绝缘接头
            FACILITY_PSV: 1, // 无保护装置绝缘法兰
            FACILITY_FV: 1, // 有保护装置绝缘法兰
            FACILITY_CABLECONNECTION: 1, // 连接点
            FACILITY_GLV: 1, // 架空线

            FACILITY_FA: 1, // 恒电位仪
            FACILITY_BUV: 1, // 浅埋阳极地床
            FACILITY_CHV: 1, // 深井阳极地床
            FACILITY_PIPECABLECONNECTION: 1, // 管道连接点
            FACILITY_FXC: 1, // 自定义装置1
            FACILITY_ZS: 1, // 自定义装置1
            FACILITY_EV: 1, // 自定义装置1
            FACILITY_ELV: 1, // 自定义装置1


            FACILITY_FC: 1,    // 流量调节阀
            FACILITY_E: 1,      // 换热器
            FACILITY_FEBO: 1,   // 8字盲板(开启)
            FACILITY_FEBC: 1,  // 8字盲板(关闭)
            FACILITY_M: 1,     // 汇管
            FACILITY_PL: 1,     // 清球发射器
            FACILITY_EU: 1,    // U形换热器
            FACILITY_F: 1,    // 卧式过滤器
            FACILITY_IJ: 1,     // 绝缘接头
            FACILITY_FST: 1,   // 放散塔
            FACILITY_SHAPE1: 1,
            FACILITY_SHAPE2: 1,
            FACILITY_SHAPE3: 1,
            FACILITY_SHAPE4: 1,
            FACILITY_SHAPE53: 1,
            FACILITY_SHAPE54: 1,
            FACILITY_SHAPE55: 1,
            FACILITY_SHAPE56: 1,
            FACILITY_SHAPE57: 1,
            FACILITY_SHAPE58: 1,
            FACILITY_SHAPE59: 1,
            FACILITY_SHAPE60: 1,
            FACILITY_SHAPE61: 1,
            FACILITY_SHAPE62: 1,
            FACILITY_SHAPE72: 1,
            FACILITY_SHAPE73: 1,
            FACILITY_SHAPE74: 1,


            SELECT_AREA: 1,

            FACILITY_CYAN_MARK: 1,
            FACILITY_RED_MARK: 1,
            FACILITY_LEFT_MARK1: 1,
            FACILITY_LEFT_MARK2: 1,
            FACILITY_RIGHT_MARK1: 1,
            FACILITY_RIGHT_MARK2: 1,
            FACILITY_MARK: 1,
            FACILITY_TRIANGLE_MARK: 1,
            FACILITY_GROUND: 1,
            FACILITY_TRIANGLE: 1,
            FACILITY_ARROW1: 1,
            FACILITY_ARROW2: 1,
            FACILITY_ARROW63: 1,
            FACILITY_ARROW64: 1,
            FACILITY_ARROW65: 1,
            FACILITY_ARROW66: 1,
            FACILITY_ARROW67: 1,
            FACILITY_ARROW68: 1,
            FACILITY_ARROW69: 1,
            FACILITY_ARROW70: 1,
            FACILITY_ARROW71: 1,
            FACILITY_ARROW75: 1,


        },
        LINE_WIRE: {
            FACILITY_GLV: 1,
            FACILITY_THV: 1,
            FACILITY_FM: 1,
            FACILITY_PIPECABLECONNECTION: 1,

            FACILITY_BAV: 1,
            FACILITY_GAV: 1,
            FACILITY_NV: 1,
            FACILITY_SV: 1,
            FACILITY_PSV: 1,
            FACILITY_FV: 1,
            FACILITY_CABLECONNECTION: 1,
            FACILITY_FA: 1, // 恒电位仪
            FACILITY_BUV: 1, // 浅埋阳极地床
            FACILITY_CHV: 1, // 深井阳极地床
            FACILITY_FXC: 1, // 自定义装置1
            FACILITY_ZS: 1, // 自定义装置1
            FACILITY_EV: 1, // 自定义装置1
            FACILITY_ELV: 1, // 自定义装置1

            FACILITY_FC: 1,    // 流量调节阀
            FACILITY_E: 1,      // 换热器
            FACILITY_FEBO: 1,   // 8字盲板(开启)
            FACILITY_FEBC: 1,  // 8字盲板(关闭)
            FACILITY_M: 1,     // 汇管
            FACILITY_PL: 1,     // 清球发射器
            FACILITY_EU: 1,    // U形换热器
            FACILITY_F: 1,    // 卧式过滤器
            FACILITY_IJ: 1,     // 绝缘接头
            FACILITY_FST: 1,   // 放散塔
            FACILITY_SHAPE1: 1,
            FACILITY_SHAPE2: 1,
            FACILITY_SHAPE3: 1,
            FACILITY_SHAPE4: 1,
            FACILITY_SHAPE53: 1,
            FACILITY_SHAPE54: 1,
            FACILITY_SHAPE55: 1,
            FACILITY_SHAPE56: 1,
            FACILITY_SHAPE57: 1,
            FACILITY_SHAPE58: 1,
            FACILITY_SHAPE59: 1,
            FACILITY_SHAPE60: 1,
            FACILITY_SHAPE61: 1,
            FACILITY_SHAPE62: 1,
            FACILITY_SHAPE72: 1,
            FACILITY_SHAPE73: 1,
            FACILITY_SHAPE74: 1,

            SELECT_AREA: 1,

            FACILITY_CYAN_MARK: 1,
            FACILITY_RED_MARK: 1,
            FACILITY_LEFT_MARK1: 1,
            FACILITY_LEFT_MARK2: 1,
            FACILITY_RIGHT_MARK1: 1,
            FACILITY_RIGHT_MARK2: 1,
            FACILITY_MARK: 1,
            FACILITY_TRIANGLE_MARK: 1,
            FACILITY_GROUND: 1,
            FACILITY_TRIANGLE: 1,
            FACILITY_ARROW1: 1,
            FACILITY_ARROW2: 1,
            FACILITY_ARROW63: 1,
            FACILITY_ARROW64: 1,
            FACILITY_ARROW65: 1,
            FACILITY_ARROW66: 1,
            FACILITY_ARROW67: 1,
            FACILITY_ARROW68: 1,
            FACILITY_ARROW69: 1,
            FACILITY_ARROW70: 1,
            FACILITY_ARROW71: 1,
            FACILITY_ARROW75: 1,
        },
        LINE_CONNECTIONLINE: {
            FACILITY_BAV: 1,
            FACILITY_FA: 1,

            FACILITY_GAV: 1,
            FACILITY_THV: 1,
            FACILITY_FM: 1,
            FACILITY_NV: 1,
            FACILITY_SV: 1,
            FACILITY_PSV: 1,
            FACILITY_FV: 1,
            FACILITY_CABLECONNECTION: 1,
            FACILITY_GLV: 1,
            FACILITY_BUV: 1, // 浅埋阳极地床
            FACILITY_CHV: 1, // 深井阳极地床
            FACILITY_PIPECABLECONNECTION: 1, // 管道连接点
            FACILITY_FXC: 1, // 自定义装置1
            FACILITY_ZS: 1, // 自定义装置1
            FACILITY_EV: 1, // 自定义装置1
            FACILITY_ELV: 1, // 自定义装置1

            FACILITY_FC: 1,    // 流量调节阀
            FACILITY_E: 1,      // 换热器
            FACILITY_FEBO: 1,   // 8字盲板(开启)
            FACILITY_FEBC: 1,  // 8字盲板(关闭)
            FACILITY_M: 1,     // 汇管
            FACILITY_PL: 1,     // 清球发射器
            FACILITY_EU: 1,    // U形换热器
            FACILITY_F: 1,    // 卧式过滤器
            FACILITY_IJ: 1,     // 绝缘接头
            FACILITY_FST: 1,   // 放散塔
            FACILITY_SHAPE1: 1,
            FACILITY_SHAPE2: 1,
            FACILITY_SHAPE3: 1,
            FACILITY_SHAPE4: 1,
            FACILITY_SHAPE53: 1,
            FACILITY_SHAPE54: 1,
            FACILITY_SHAPE55: 1,
            FACILITY_SHAPE56: 1,
            FACILITY_SHAPE57: 1,
            FACILITY_SHAPE58: 1,
            FACILITY_SHAPE59: 1,
            FACILITY_SHAPE60: 1,
            FACILITY_SHAPE61: 1,
            FACILITY_SHAPE62: 1,
            FACILITY_SHAPE72: 1,
            FACILITY_SHAPE73: 1,
            FACILITY_SHAPE74: 1,

            SELECT_AREA: 1,

            FACILITY_CYAN_MARK: 1,
            FACILITY_RED_MARK: 1,
            FACILITY_LEFT_MARK1: 1,
            FACILITY_LEFT_MARK2: 1,
            FACILITY_RIGHT_MARK1: 1,
            FACILITY_RIGHT_MARK2: 1,
            FACILITY_MARK: 1,
            FACILITY_TRIANGLE_MARK: 1,
            FACILITY_GROUND: 1,
            FACILITY_TRIANGLE: 1,
            FACILITY_ARROW1: 1,
            FACILITY_ARROW2: 1,
            FACILITY_ARROW63: 1,
            FACILITY_ARROW64: 1,
            FACILITY_ARROW65: 1,
            FACILITY_ARROW66: 1,
            FACILITY_ARROW67: 1,
            FACILITY_ARROW68: 1,
            FACILITY_ARROW69: 1,
            FACILITY_ARROW70: 1,
            FACILITY_ARROW71: 1,
            FACILITY_ARROW75: 1,
        },
    };
    this.clear = function () {
        var number = this.shapeList.length;
        var list = [];
        for (var i = 0; i < number; i++) {
            list.push(this.shapeList[i]);
        }
        for (var j = 0; j < number; j++) {
            list[j].remove();
        }
        this.shapeList = [];
        return number;
    };
    this.shapeList = [];
    this.addShape = function (shape) {
        var add = true;
        for (var i = 0; i < this.shapeList.length; i++) {
            if (this.shapeList[i].id == shape.id) {
                add = false;
                break;
            }
        }
        if (add) {
            this.shapeList.push(shape);
        }
        return this;
    };
    this.removeShape = function (shape) {
        var list = [];
        for (var i = 0; i < this.shapeList.length; i++) {
            if (this.shapeList[i].id != shape.id) {
                list.push(this.shapeList[i]);
            }
        }
        this.shapeList = list;
        return this;
    };
    this.getShapeByLocat = function (x, y, facilityType) {
        var shapeBean = null;
        for (var i = 0; i < this.shapeList.length; i++) {
            var shape = this.shapeList[i];
            if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                if (this.relation[facilityType][shape.facilityType]) {
                    var box = shape.shape.getBBox();
                    var minx = box.x - 10;
                    var miny = box.y - 10;
                    var maxx = box.x + box.width + 10;
                    var maxy = box.y + box.height + 10;
                    if (x >= minx && x <= maxx && y >= miny && y <= maxy) {
                        shapeBean = this.shapeList[i];
                        break;
                    }
                }
            }
        }
        return shapeBean;
    };
    this.getGeometry = function (box) {
        var x = box.x, y = box.y, width = box.width, height = box.height;
        var list = [];
        for (var i = 0; i < this.shapeList.length; i++) {
            var shape = this.shapeList[i];
            var box = shape.shape.getBBox();
            var minx = box.x;
            var miny = box.y;
            var maxx = box.x + box.width;
            var maxy = box.y + box.height;
            if (minx >= x && maxx <= x + width && miny >= y && maxy <= y + height) {
                list.push(shape);
            }
        }
        return list;
    };
    this.getGeometryById = function (id) {
        var shape = null;
        for (var i = 0; i < this.shapeList.length; i++) {
            if (id == this.shapeList[i].id) {
                shape = this.shapeList[i];
                break;
            }
        }
        return shape;
    };
    this.getSelectShape = function () {
        var list = [];
        for (var i = 0; i < this.shapeList.length; i++) {
            var shape = this.shapeList[i];
            if (shape.selected) {
                list.push(shape);
            }

        }
        return list;
    };
    this.removeSelectShape = function () {
        var list = this.getSelectShape();
        var number = list.length;
        for (var i = 0; i < number; i++) {
            var shape = list[i];
            shape.remove();

        }
        return number;
    };
    this.getGeometryAttribute = function () {
        var list = [];
        for (var i = 0; i < this.shapeList.length; i++) {
            list.push(this.shapeList[i].getAttribute());
        }
        return list;
    };
    this.setWarning = function (id, state) {
        var shape = this.getGeometryById(id);
        if (shape) {
            shape.setWarning(state);
        }
        return this;
    };
    this.setAllWarning = function (state) {
        for (var i = 0; i < this.shapeList.length; i++) {
            var shape = this.shapeList[i];
            shape.setWarning(state);
        }
    };
};

// 几何对象
GeometryBean = function () {
    var _this = this;
    this.id = Tools.getUUID();
    this.geometryType = '';
    this.facilityType = '';
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.bx = 0;
    this.by = 0;
    this.cx = 0;
    this.cy = 0;
    this.ex = 0;
    this.ey = 0;
    this.direction = {};
    this.extentBorder = 5;
    this.hasExtent = true;
    this.extent = null;
    this.selected = false;
    this.color = '#000000';
    this.warningColor = '#FF0000';
    this.fillColor = '#FFFFFF';
    this.warningFillColor = '#FFFFFF';
    this.path = [];
    this.shape = null;
    this.text = '';
    this.realtext = '';
    this.realtext2 = '';
    this.realtextSandH = "show";
    this.realtext2SandH = "show";
    this.textSize = 12;
    this.text2Size = 12;
    this.textShape = null;
    this.textShape2 = null;
    this.textFamily = '微软雅黑';
    this.text2Family = '微软雅黑';
    this.textWeight = 'normal';
    this.text2Weight = 'normal';
    this.textStyle = 'normal';
    this.text2Style = 'normal';
    this.textTop = 0;
    this.textLeft = 0;
    this.textTop2 = 0;
    this.textLeft2 = 0;
    this.textColor = '#000000';
    this.text2Color = '#000000';
    this.raphael = null;
    this.shapeCollection = null;
    this.createShape = function () {
    };
    this.moveTo = function () {
    };
    this.disconnect = function () {
    };
    this.remove = function () {
    };
    this.setWarning = function (state) {
    };
    this.textMoveFun = null;
    this.textUpFun = null;

    // 文字旋转
    this.textRaphael = null;
    this.textRotateAble = false;
    this.textExtentShow = false;

    this.moveFun = null;
    this.upFun = null;
    this.clickFun = null;
    this.dbClickFun = null;
    this.overFun = null;
    this.outFun = null;
    this.canMove = true;
    this.setText = function () {
        if (this.raphael) {
            if (this.textAngle != 0 && this.textAngle != undefined && this.textShape != null) {
                this.textShape.rotate(-this.textAngle);
            }
            if (this.textShape) {
                this.textShape.attr({
                    x: this.cx + this.textLeft,
                    y: this.cy - this.textTop,
                    text: this.realtext,
                    fill: this.textColor,
                    'font-size': this.textSize,
                    cursor: 'default',
                    'font-family': this.textFamily,
                    'font-style': this.textStyle,
                    'font-weight': this.textWeight,
                });
                if (this.textAngle != 0 && this.textAngle != undefined) {
                    this.textShape.rotate(this.textAngle);
                }
            } else {
                this.textShape = this.raphael.text(this.cx + this.textLeft, this.cy - this.textTop, this.realtext).attr({
                    fill: this.textColor,
                    'font-size': this.textSize,
                    cursor: 'default',
                    'font-family': this.textFamily,
                    'font-style': this.textStyle,
                    'font-weight': this.textWeight,
                });
                if (this.textAngle != 0 && this.textAngle != undefined) {
                    this.textShape.rotate(this.textAngle);
                }
                if (this.realtextSandH == "hide") {
                    this.textShape.hide();
                }
                this.textShape.drag(textMove, textDragger, textUp);
                this.textRaphael = pageMeta.canvas;
                this.textShape.click(textClick);
            }
            if (this.textShape2) {
                /**
                 *  @ ls 20170918
                 *  @ text2方法
                 */

                if (this.textAngle2 != 0 && this.textAngle2 != undefined && this.textShape != null) {
                    this.textShape2.rotate(-this.textAngle2);
                }
                this.textShape2.attr({
                    x: this.cx + this.textLeft2,
                    y: this.cy + 20 - this.textTop2,
                    text: this.realtext2,
                    fill: this.text2Color,
                    'font-size': this.text2Size,
                    cursor: 'default',
                    'font-family': this.text2Family,
                    'font-style': this.text2Style,
                    'font-weight': this.text2Weight,
                });
                if (this.textAngle2 != 0 && this.textAngle2 != undefined) {
                    this.textShape2.rotate(this.textAngle2);
                }
            } else {
                /**
                 *  @ ls 20170918
                 *  @ text2方法
                 */
                this.textShape2 = this.raphael.text(this.cx + this.textLeft2, this.cy + 20 - this.textTop2, this.realtext2).attr({
                    fill: this.text2Color,
                    'font-size': this.text2Size,
                    cursor: 'default',
                    'font-family': this.text2Family,
                    'font-style': this.text2Style,
                    'font-weight': this.text2Weight,
                });
                if (this.textAngle2 != 0 && this.textAngle2 != undefined) {
                    this.textShape2.rotate(this.textAngle2);
                }
                if (this.realtext2SandH == "hide") {
                    this.textShape2.hide();
                }
                this.textShape2.drag(textMove, textDragger, textUp);
                this.textRaphael = pageMeta.canvas;
                this.textShape2.click(textClick);
            }
            /**
             *  @ ls 20170927
             *  @ 文字边框跟随移动方法
             */
            if (pageMeta.textSelectedStateRotate) {
                var box = pageMeta.textSelectedStateRotate.getBBox();
                var attr = pageMeta.textSelectedStateRotate.textExtent.attr({
                    x: box.x - 10,
                    y: box.y - 10,
                    width: box.width + 20,
                    height: box.height + 20,
                })
            }


        }
        return this;
    };

    this.panTo = function (x, y) {
        this.x += x;
        this.y += y;
        this.cx += x;
        this.cy += y;
        this.bx += x;
        this.by += y;
        this.ex += x;
        this.ey += y;
        this.moveTo();
    };
    this.select = function () {
        if (this.extent) {
            if (this.facilityType != "FACILITY_CREATETEXT") {
                this.extent.show();
            }
        }
        this.selected = true;
        return this;
    };
    this.unSelect = function () {
        if (this.extent) {
            this.extent.hide();
        }
        this.selected = false;
        return this;
    };
    this.reverseSelect = function () {
        if (this.selected) {
            this.unSelect();
        } else {
            this.select();
        }
        return this;
    };
    this.setExtent = function () {
        if (this.hasExtent) {
            var box = this.shape.getBBox();
            if (this.extent) {
                this.extent.attr({
                    x: box.x - this.extentBorder,
                    y: box.y - this.extentBorder,
                    width: box.width + this.extentBorder * 2,
                    height: box.height + this.extentBorder * 2,
                });
            } else {
                this.extent = this.raphael.rect(box.x - this.extentBorder, box.y - this.extentBorder, box.width + this.extentBorder * 2, box.height + this.extentBorder * 2, 4);
                this.extent.attr({
                    'stroke-dasharray': ['-'],
                    stroke: '#FF00FF',
                });
                this.extent.toBack();
            }
        }
        return this;
    };
    this.getAttribute = function () {
        var obj = this;
        var attr = {};
        for (var k in obj) {
            if (Tools.isString(obj[k]) || Tools.isNumber(obj[k]) || Tools.isBoolean(obj[k])) {
                attr[k] = obj[k];
            }
        }
        if (obj.beginShape) {
            attr.beginShape = obj.beginShape.id;
        }
        if (obj.endShape) {
            attr.endShape = obj.endShape.id;
        }
        if (obj.lineList) {
            var list1 = [];
            for (var a = 0; a < obj.lineList.length; a++) {
                list1.push(obj.lineList[a].id);
            }
            attr.lineList = list1;
        }
        if (obj.shapeList) {
            var list2 = [];
            for (var b = 0; b < obj.shapeList.length; b++) {
                var shape = obj.shapeList[b];
                list2.push({
                    shape: shape.shape.id,
                    x: shape.shape.x,
                    y: shape.shape.y,
                });
            }
            attr.shapeList = list2;
        }
        if (obj.direction) {
            attr.direction = obj.direction;
        }
        if (obj.dasharray) {
            attr.dasharray = obj.dasharray;
        }
        if (obj.freeLineList) {
            attr.freeLineList = obj.freeLineList;
        }
        return attr;
    };
    this.getDirection = function (box) {
        var pointList = [];
        pointList.push({x: box.x + box.width / 2, y: box.y});
        pointList.push({x: box.x + box.width, y: box.y + box.height / 2});
        pointList.push({x: box.x + box.width / 2, y: box.y + box.height});
        pointList.push({x: box.x, y: box.y + box.height / 2});
        return pointList;
    };
    var tox = 0;
    var toy = 0;
    var tox2 = 0;
    var toy2 = 0;
    var textHasMove = false;
    var textDragger = function (x, y, e) {
        e.stopPropagation();
        if (_this.canMove) {
            textHasMove = false;
            tox = _this.cx + _this.textLeft;
            toy = _this.cy - _this.textTop;
            tox2 = _this.cx + _this.textLeft2;
            toy2 = _this.cy - _this.textTop2;
        }
    };
    var textMove = function (dx, dy, x, y, e) {
        if (pageMeta.Editmode) {
            var type = "";
            if (_this.realtext == e.target.innerHTML) {
                type = 1;
            } else if (_this.realtext2 == e.target.innerHTML) {
                type = 2;
            }
            e.stopPropagation();
            if (_this.canMove && type == 1) {
                textHasMove = true;
                _this.textLeft = tox + dx - _this.cx;
                _this.textTop = _this.cy - toy - dy;
                _this.setText();
                if (_this.textMoveFun) {
                    _this.textMoveFun(_this);
                }
            }
            if (_this.canMove && type == 2) {
                textHasMove = true;
                _this.textLeft2 = tox2 + dx - _this.cx;
                _this.textTop2 = _this.cy - toy2 - dy;
                _this.setText();
                if (_this.textMoveFun) {
                    _this.textMoveFun(_this);
                }
            }
        }
    };
    var textUp = function () {
        if (textHasMove == true && _this.textUpFun) {
            _this.textUpFun(_this);
        } else if (textHasMove == false && _this.clickFun) {
            _this.clickFun(_this);
        }

    };

    /*********** 新增 ************/
    var textSetExtent = function (self) {
        if (isNull(self.textExtent)) {
            if (_this.textRotateAble) {
                var box = self.getBBox();
                self.textExtent = _this.textRaphael.rect(box.x - 10, box.y - 10, box.width + 20, box.height + 20, 4);
                self.textExtent.attr({
                    'stroke-dasharray': ['-'],
                    stroke: '#FF00FF',
                });
                self.textExtent.toBack();
                self.textExtent.show();
                _this.textExtentShow = true;
            }
        } else {
            if (_this.textRotateAble) {
                self.textExtent.show();
                var box = self.getBBox();
                self.textExtent.attr({
                    x: box.x - 10,
                    y: box.y - 10,
                    width: box.width + 20,
                    height: box.height + 20,
                })
                _this.textExtentShow = true;
            } else {
                self.textExtent.hide();
                _this.textExtentShow = false;
            }
        }
    }
    var textClick = function () {
        _this.textRotateAble = true;
        pageMeta.textSelectedState.push(this);
        pageMeta.textSelectedStateRotate = this;
        textSetExtent(this);
    };
};


// 历史记录
HistoryBean = function () {
    var _this = this;
    this.type = '';
    this.datetime = new Date();
    this.actions = [];
};


// 图形对象
ShapeBean = function () {
    var _this = this;
    GeometryBean.call(this);
    this.geometryType = ShapeConfig.GEOMETRY_POLYGON;   // 多边形
    this.lineList = [];
    this.freeLineList = [];
    this.freeDirection = {x: 0, y: 0, differenceX: 0, differenceY: 0};
    this.hasBackShape = false;
    // this.backShape = null;
    // this.middleShapeType = ShapeConfig.SHAPE_RECT;
    // this.middleWidth = 6;
    // this.middleHeight = 6;
    // this.middleColor = '#999999';
    // this.middleFillColor = '#999999';

    this.shapeType = ShapeConfig.SHAPE_RECT;   // 矩形
    this.border = 2;
    this.radius = 5;
    this.angle = 0;
    this.textAngle = 0;
    this.textAngle2 = 0;
    this.autoLine = false;
    this.opacity = 1;
    this.toTop = false;
    this.magnification = 1; //放大倍数
    this.createShape = function () {
        if (this.raphael) {
            this.angle = this.angle % 360;
            if (this.shapeType == ShapeConfig.SHAPE_RECT) {
                this.shape = this.raphael.rect(this.x - getHalfWidth(), this.y - getHalfHeight(), this.width, this.height, this.radius);
            }
            if (this.shapeType == ShapeConfig.SHAPE_ELLIPSE) {
                this.shape = this.raphael.ellipse(this.x, this.y, this.width, this.height);
            }
            if (this.shapeType == ShapeConfig.SHAPE_IMAGE) {
                //this.shape = this.raphael.image(this.color, this.x - getHalfWidth(), this.y - getHalfHeight(), this.width, this.height);
                this.shape = this.raphael.image(this.color, this.x - getHalfWidth(), this.y - getHalfHeight(), this.width, this.height);
            }
            if (this.toTop) {
                this.shape.toFront();
            } else {
                this.shape.toBack();
            }
            if (this.shapeType == ShapeConfig.SHAPE_IMAGE) {
                this.shape.attr({
                    cursor: 'default',
                    src: this.color,
                });
            } else {
                this.shape.attr({
                    fill: this.fillColor,
                    stroke: this.color,
                    'stroke-width': this.border,
                    'fill-opacity': this.opacity,
                    cursor: 'default',
                });
            }
            /********* 修改 *************/
            this.setCenter().setText();
            /*********************/
            this.shape.drag(shapeMove, shapeDragger, shapeUp);

            this.shape.mouseover(function () {
                if (_this.overFun) {
                    _this.overFun(_this);
                }
            });
            this.shape.mouseout(function () {
                if (_this.outFun) {
                    _this.outFun(_this);
                }
                $("#ConnectionPrompt").css("top", -10000).css("left", -10000).html("")
            });
            if (pageMeta.Editmode) {
                this.shape.dblclick(shapeDbclick);
            }
            ;
            this.shape.mousemove(function (e) {
                if (pageMeta.Editmode) {
                    if (_this.hasBackShape) {
                        var attr = _this.shape.attr();
                        if (e.offsetX == attr.x && e.offsetY >= attr.y && e.offsetY <= attr.y + attr.height) {
                            _this.freeDirection.x = e.offsetX;
                            _this.freeDirection.y = e.offsetY;
                            $("#ConnectionPrompt").css("top", e.y).css("left", e.x + 15).html("(添加扩展点)");
                        } else if (e.offsetX == attr.x + attr.width && e.offsetY >= attr.y && e.offsetY <= attr.y + attr.height) {
                            _this.freeDirection.x = e.offsetX;
                            _this.freeDirection.y = e.offsetY;
                            $("#ConnectionPrompt").css("top", e.y).css("left", e.x + 15).html("(添加扩展点)");
                        } else if (e.offsetY == attr.y && e.offsetX >= attr.x && e.offsetX <= attr.x + attr.width) {
                            _this.freeDirection.x = e.offsetX;
                            _this.freeDirection.y = e.offsetY;
                            $("#ConnectionPrompt").css("top", e.y).css("left", e.x + 15).html("(添加扩展点)");
                        } else if (e.offsetY == attr.y + attr.height && e.offsetX >= attr.x && e.offsetX <= attr.x + attr.width) {
                            _this.freeDirection.x = e.offsetX;
                            _this.freeDirection.y = e.offsetY;
                            $("#ConnectionPrompt").css("top", e.y).css("left", e.x + 15).html("(添加扩展点)");
                        } else {
                            $("#ConnectionPrompt").css("top", -10000).css("left", -10000).html("");
                        }
                        _this.freeDirection.differenceX = Math.abs(attr.x - _this.freeDirection.x);
                        _this.freeDirection.differenceY = Math.abs(attr.y - _this.freeDirection.y);
                    }
                    //  else {
                    //     var attr = _this.shape.attr();
                    //     if (e.offsetX >= attr.x && e.offsetX <= attr.x + 5 && e.offsetX && e.offsetY >= attr.y && e.offsetY <= attr.y + attr.height) {
                    //         pageMeta.stretching.type = "左";
                    //         pageMeta.stretching.flag = true;
                    //         _this.shape.attr({
                    //             cursor: "w-resize"
                    //         })
                    //     }
                    //     // else if (e.offsetX <= attr.x + attr.width && e.offsetX >= attr.x + attr.width - 5 && e.offsetY >= attr.y && e.offsetY <= attr.y + attr.height) {
                    //     //     pageMeta.stretching.type = "右";
                    //     //     pageMeta.stretching.flag = true;
                    //     //     _this.shape.attr({
                    //     //         cursor: "w-resize"
                    //     //     })
                    //     // }
                    //     else if (e.offsetY >= attr.y && e.offsetY <= attr.y + 5 && e.offsetX >= attr.x && e.offsetX <= attr.x + attr.width) {
                    //         pageMeta.stretching.type = "上";
                    //         pageMeta.stretching.flag = true;
                    //         _this.shape.attr({
                    //             cursor: "s-resize"
                    //         })
                    //     }
                    //     // else if (e.offsetY <= attr.y + attr.height && e.offsetY >= attr.y + attr.height - 5 && e.offsetX >= attr.x && e.offsetX <= attr.x + attr.width) {
                    //     //     pageMeta.stretching.type = "下";
                    //     //     pageMeta.stretching.flag = true;
                    //     //     _this.shape.attr({
                    //     //         cursor: "s-resize"
                    //     //     })
                    //     // }
                    //     else {
                    //         pageMeta.stretching.type = "";
                    //         pageMeta.stretching.flag = false;
                    //         _this.shape.attr({
                    //             cursor: "default"
                    //         })
                    //     }
                    // }
                }
            });
            this.shape.mousedown(function (e) {
                pageMeta.stretching.moveFlag = false;
                if (pageMeta.stretching.flag) {
                    pageMeta.stretching.originX = e.offsetX;
                    pageMeta.stretching.originY = e.offsetY;
                    pageMeta.stretching.moveFlag = true;
                }
            })
            this.shape.mouseup(function () {
                pageMeta.stretching.flag = false;
                pageMeta.stretching.moveFlag = false;
            })
            if (this.angle != 0) {
                this.shape.rotate(this.angle);
            }
            ;
            this.setExtent().unSelect();
            if (this.shapeCollection) {
                this.shapeCollection.addShape(this);
            }
            this.shape.click(function () {
                _this.bulb();
                if (_this.hasBackShape) {
                    var a = $.extend(true, {}, _this.freeDirection);
                    var type = true;
                    if (a.x != 0 && a.y != 0) {
                        for (var i = 0; i < _this.freeLineList.length; i++) {
                            if (a == _this.freeLineList[i]) {
                                type = false;
                                break;
                            }
                        }
                        if (type) {
                            _this.freeLineList.push(a);
                        }
                        _this.freeDirection.x = 0;
                        _this.freeDirection.y = 0;
                    }
                }

            });
            this.shape.dblclick(function () {
                outPutShapInfo(_this.bitNumber);
            })
        }
        return this;
    };
    this.moveTo = function () {
        if (pageMeta.Editmode || pageMeta.drawExtent) {
            if (this.angle != 0) {
                this.shape.rotate(-this.angle);
            }
            var zoom = pageMeta.getZoomVal();
            var x = this.x - getHalfWidth();
            var y = this.y - getHalfHeight();
            if (this.freeLineList.length) {
                for (i = 0; i < this.freeLineList.length; i++) {
                    this.freeLineList[i].x = x + this.freeLineList[i].differenceX;
                    this.freeLineList[i].y = y + this.freeLineList[i].differenceY;
                }
            }
            var att = "";
            att = this.shapeType == ShapeConfig.SHAPE_ELLIPSE ? {
                cx: x,
                cy: y,
                rx: this.width,
                ry: this.height
            } : {
                x: x,
                y: y,
                width: this.width,
                height: this.height
            };
            // if (pageMeta.stretching.moveFlag) {
            //     switch (pageMeta.stretching.type) {
            //         case "左":
            //             att = {
            //                 x: pageMeta.stretching.mouseX,
            //                 width: this.width + -(this.x - pageMeta.stretching.originX)
            //             }
            //             pageMeta.stretching.originX = this.x;
            //             this.width = att.width;
            //             break;
            //         case "上":
            //             att = {
            //                 y: pageMeta.stretching.mouseY,
            //                 height: this.height + -(this.y - pageMeta.stretching.originY)
            //             }
            //             pageMeta.stretching.originY = this.y;
            //             this.height = att.height;
            //             break;
            //     }
            // } else {

            // }
            this.shape.attr(att);
            if (this.angle != 0) {
                this.shape.rotate(this.angle);
            }
            this.setCenter();
            this.resetLine();
            this.setText();
            this.setExtent();
            return this;
        }
    };
    this.setWarning = function (state) {
        if (state) {
            if (this.shapeType == ShapeConfig.SHAPE_IMAGE) {
                this.shape.attr({
                    src: this.warningColor,
                });
            } else {
                this.shape.attr({
                    fill: this.warningFillColor,
                    stroke: this.warningColor,
                });
            }
        } else {
            if (this.shapeType == ShapeConfig.SHAPE_IMAGE) {
                this.shape.attr({
                    src: this.color,
                });
            } else {
                this.shape.attr({
                    fill: this.fillColor,
                    stroke: this.color,
                });
            }
        }
    };
    this.rotate = function (angle) {
        angle = angle % 360;
        if (this.angle != 0) {
            this.shape.rotate(-this.angle);
        }
        if (angle != 0) {
            this.shape.rotate(angle);
        }
        this.angle = angle;
        this.setExtent();
        this.resetLine();
        return this;
    };
    this.setCenter = function () {
        this.cx = this.x;
        this.cy = this.y;
        return this;
    };
    this.resetSingleLine = function (line) {
        if (this.autoLine) {
            this.autoResetSingleLine(line);
        } else {
            this.fixedResetSingleLine(line);
        }
        return this;
    };
    this.autoResetSingleLine = function (line) {
        var box1 = null;
        var box2 = null;
        var p1 = [];
        var p2 = [];
        var resetBegin = true;
        var resetEnd = true;
        if (line.beginShape == this) {
            box1 = line.beginShape.shape.getBBox();
            if (line.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
                p2 = [{x: line.mShape.x, y: line.mShape.y}];
                resetEnd = false;
            } else if (line.endShape) {
                box2 = line.endShape.shape.getBBox();
            } else {
                p2 = [{x: line.ex, y: line.ey}];
            }
        } else if (line.endShape == this) {
            box2 = line.endShape.shape.getBBox();
            if (line.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
                p1 = [{x: line.mShape.x, y: line.mShape.y}];
                resetBegin = false;
            } else if (line.beginShape) {
                box1 = line.beginShape.shape.getBBox();
            } else {
                p1 = [{x: line.bx, y: line.by}];
            }
        }
        if (box1) {
            p1 = [];
            p1.push({x: box1.x + box1.width / 2, y: box1.y});
            p1.push({x: box1.x + box1.width / 2, y: box1.y + box1.height});
            p1.push({x: box1.x, y: box1.y + box1.height / 2});
            p1.push({x: box1.x + box1.width, y: box1.y + box1.height / 2});
        }
        if (box2) {
            p2 = [];
            p2.push({x: box2.x + box2.width / 2, y: box2.y});
            p2.push({x: box2.x + box2.width / 2, y: box2.y + box2.height});
            p2.push({x: box2.x, y: box2.y + box2.height / 2});
            p2.push({x: box2.x + box2.width, y: box2.y + box2.height / 2});
        }
        var dis = 100000000;
        var bx = 0;
        var by = 0;
        var ex = 0;
        var ey = 0;
        for (var b = 0; b < p1.length; b++) {
            for (var c = 0; c < p2.length; c++) {
                var dx = Math.abs(p1[b].x - p2[c].x);
                var dy = Math.abs(p1[b].y - p2[c].y);
                if (dis > dx * dx + dy * dy) {
                    dis = dx * dx + dy * dy;
                    bx = p1[b].x;
                    by = p1[b].y;
                    ex = p2[c].x;
                    ey = p2[c].y;
                }
            }
        }
        if (resetBegin) {
            line.bx = bx;
            line.by = by;
            line.bShape.x = bx;
            line.bShape.y = by;
        }
        if (resetEnd) {
            line.ex = ex;
            line.ey = ey;
            line.eShape.x = ex;
            line.eShape.y = ey;
        }
        line.moveTo();
        return this;
    };
    this.fixedResetSingleLine = function (line) {
        var box = null;
        var resetBegin = false;
        var resetEnd = false;
        if (line.beginShape == this) {
            box = line.beginShape.shape.getBBox();
            resetBegin = true;
        } else if (line.endShape == this) {
            box = line.endShape.shape.getBBox();
            resetEnd = true;
        }
        var ponits = this.getDirection(box).concat(this.freeLineList);
        var point = ponits[this.direction[line.id]];
        var x = point.x;
        var y = point.y;
        if (resetBegin) {
            line.bx = x;
            line.by = y;
        }
        if (resetEnd) {
            line.ex = x;
            line.ey = y;
        }
        line.moveTo();
        return this;
    };
    this.resetLine = function () {
        for (var a = 0; a < this.lineList.length; a++) {
            this.resetSingleLine(this.lineList[a]);
        }
        return this;
    };
    this.addLine = function (lineBean) {
        var x = 0;
        var y = 0;
        var dir = 0;
        if (lineBean.beginShape == this) {
            x = lineBean.bx;
            y = lineBean.by;
        }
        if (lineBean.endShape == this) {
            x = lineBean.ex;
            y = lineBean.ey;
        }
        var box = this.shape.getBBox();
        var pointList = this.getDirection(box);
        var dis = 100000000;
        pointList = pointList.concat($.extend(true, [], _this.freeLineList))
        for (var b = 0; b < pointList.length; b++) {
            var dx = Math.abs(pointList[b].x - x);
            var dy = Math.abs(pointList[b].y - y);
            var dxy = dx * dx + dy * dy;
            if (dis > dxy) {
                dis = dxy;
                dir = b;
            }
        }
        var add = true;
        for (var i = 0; i < this.lineList.length; i++) {
            if (this.lineList[i].id == lineBean.id) {
                add = false;
                break;
            }
        }
        if (add) {
            this.lineList.push(lineBean);
            this.direction[lineBean.id] = dir;
        }
        this.resetSingleLine(lineBean);
        return this;
    };
    this.removeLine = function (lineBean) {
        var list = [];
        var dir = {};
        for (var i = 0; i < this.lineList.length; i++) {
            if (this.lineList[i].id != lineBean.id) {
                list.push(this.lineList[i]);
                dir[this.lineList[i].id] = this.direction[this.lineList[i].id];
            }
        }
        this.lineList = list;
        this.direction = dir;
        return this;
    };
    this.disconnect = function () {
        for (var a = 0; a < this.lineList.length; a++) {
            var line = this.lineList[a];
            if (line.beginShape == this) {
                line.beginShape = null;
            }
            if (line.endShape == this) {
                line.endShape = null;
            }
        }
        this.lineList = [];
    };
    this.remove = function () {
        this.disconnect();
        this.textShape.remove();
        this.textShape2.remove();
        this.shape.remove();
        if (this.extent) {
            this.extent.remove();
        }
        if (this.shapeCollection) {
            this.shapeCollection.removeShape(this);
        }
        return this;
    };
    this.closeTwinkle = function () {
        //取消闪烁方法
        if (_this.color.search("shape_BG_") > -1) {
            var b = _this.color.split("shape_BG_");
            _this.color = b[0] + "shape_" + b[1];
            pageMeta.CLN.image = "shape";
            $(_this.shape[0]).attr("href", _this.color);
        }
        // for (var i = 0; i < pageMeta.TwinkleS.length; i++) {
        //     if (_this.bitNumber == pageMeta.TwinkleS[i].bitNumber) {
        //         if (pageMeta.TwinkleS[i].type == "ItShouldOpenButClose") {
        //             pageMeta.TwinkleS[i].timer = setInterval(_this.ItShouldOpenButClose, 1000)
        //         } else if (pageMeta.TwinkleS[i].type == "ShouldBeClosedButOpen") {
        //             pageMeta.TwinkleS[i].timer = setInterval(_this.ShouldBeClosedButOpen, 1000)
        //         } else if (pageMeta.TwinkleS[i].type == "ClosingValve") {
        //             _this.ClosingValve();
        //         }
        //     }
        // }
    }
    this.Twinkle = function () {
        //闪烁方法 执行定位闪烁
        pageMeta.selectedBean = _this;
        if (_this.color.search("shape_BG_") > -1) {
            //高亮转普通
            var b = _this.color.split("shape_BG_");
            _this.color = b[0] + "shape_" + b[1];
            pageMeta.CLN.image = "shape";
        } else if (_this.color.search("shape_R_") > -1) {
            //关闭转普通
            var b = _this.color.split("shape_R_");
            _this.color = b[0] + "shape_" + b[1];
            pageMeta.CLN.image = "shape";
        } else if (_this.color.search("shape_BR_") > -1) {
            //打开应关闭转普通
            var b = _this.color.split("shape_BR_");
            _this.color = b[0] + "shape_" + b[1];
            pageMeta.CLN.image = "shape";
        } else if (_this.color.search("shape_RG_") > -1) {
            //关闭应打开转普通
            var b = _this.color.split("shape_RG_");
            _this.color = b[0] + "shape_" + b[1];
            pageMeta.CLN.image = "shape";
        }
        else if (_this.color.search("shape_BA_") > -1) {
            //辅路转普通
            var b = _this.color.split("shape_BA_");
            _this.color = b[0] + "shape_" + b[1];
            pageMeta.CLN.image = "shape";
        } else {
            var b = _this.color.split("shape_");
            //普通转高亮
            _this.color = b[0] + "shape_BG_" + b[1];
            pageMeta.CLN.image = "shape_H";
        }
        $(_this.shape[0]).attr("href", _this.color);
    }
    //关闭按钮状态
    this.ClosingValve = function () {
        if (_this.color.search("shape_BA_") > -1) {
            //如果是辅路元件切换成关闭状态
            var b = _this.color.split("shape_BA_");
            _this.color = b[0] + "shape_R_" + b[1];
        } else {
            var b = _this.color.split("shape_");
            //如果是普通元件切换成关闭状态
            _this.color = b[0] + "shape_R_" + b[1];
        }
        $(_this.shape[0]).attr("href", _this.color);
    }
    //Should be closed but open // 应关闭但是打开的
    this.closeShouldBeClosedButOpen = function () {
        if (_this.color.search("shape_RG_") > -1) {
            //打开转关闭
            var b = _this.color.split("shape_RG_");
            _this.color = b[0] + "shape_R_" + b[1];
        }
        $(_this.shape[0]).attr("href", _this.color);
    }
    this.ShouldBeClosedButOpen = function () {
        if (_this.color.search("shape_R_") > -1) {
            //关闭转打开状态
            var b = _this.color.split("shape_R_");
            _this.color = b[0] + "shape_RG_" + b[1];
        } else if (_this.color.search("shape_RG_") > -1) {
            //打开转关闭状态
            var b = _this.color.split("shape_RG_");
            _this.color = b[0] + "shape_R_" + b[1];
        } else if (_this.color.search("shape_BA_") > -1) {
            //辅路转关闭状态
            var b = _this.color.split("shape_BA_");
            _this.color = b[0] + "shape_R_" + b[1];
        } else if (_this.color.search("shape_BG_") > -1) {
            //高亮转关闭状态
            var b = _this.color.split("shape_BG_");
            _this.color = b[0] + "shape_R_" + b[1];
        } else {
            var b = _this.color.split("shape_");
            //普通转关闭状态
            _this.color = b[0] + "shape_R_" + b[1];
        }
        $(_this.shape[0]).attr("href", _this.color);
    }
    //It should open but close  // 应打开但是关闭的
    this.closeItShouldOpenButClose = function () {
        if (_this.color.search("shape_BR_") > -1) {
            //关闭转打开
            var b = _this.color.split("shape_BR_");
            _this.color = b[0] + "shape_" + b[1];
        }
        $(_this.shape[0]).attr("href", _this.color);
    }
    this.ItShouldOpenButClose = function () {
        if (_this.color.search("shape_BR_") > -1) {
            //关闭转打开
            var b = _this.color.split("shape_BR_");
            _this.color = b[0] + "shape_" + b[1];
        } else if (_this.color.search("shape_BA_") > -1) {
            //辅路转打开
            var b = _this.color.split("shape_BA_");
            _this.color = b[0] + "shape_" + b[1];
        } else if (_this.color.search("shape_BG_") > -1) {
            //高亮转打开
            var b = _this.color.split("shape_BG_");
            _this.color = b[0] + "shape_" + b[1];
        } else {
            var b = _this.color.split("shape_");
            //打开转关闭
            _this.color = b[0] + "shape_BR_" + b[1];
        }
        $(_this.shape[0]).attr("href", _this.color);
    }
    //显示主辅路切换
    this.MainAndAuxiliarySwitching = function () {
        if (_this.color.search("shape_BA_") > -1) {
            //关闭转打开
            var b = _this.color.split("shape_BA_");
            _this.color = b[0] + "shape_" + b[1];
        } else if (_this.color.search("shape_R_") > -1) {
            //关闭转打开
            var b = _this.color.split("shape_R_");
            _this.color = b[0] + "shape_BA_" + b[1];
        } else {
            var b = _this.color.split("shape_");
            _this.color = b[0] + "shape_BA_" + b[1];
        }
        $(_this.shape[0]).attr("href", _this.color);
        var pdclen = pageMeta.dataCaching.ComponentLocation.length
        var dir = _this.direction;
        for (var j in dir) {
            for (var i = 0; i < pdclen; i++) {
                if (pageMeta.dataCaching.ComponentLocation[i].geometryType == "GEOMETRY_POLYLINE" && pageMeta.dataCaching.ComponentLocation[i].id == j) {
                    pageMeta.dataCaching.ComponentLocation[i].shape.attr("stroke", "#666666");
                }
            }
        }
    }
    this.bulb = function () {
        var reg = /调压/ig;
        var reg2 = /次高/ig
        if(_this.facilityType == "FACILITY_ARROW75"){
            if(_this.realtext.search(reg) > -1 || _this.realtext.search(reg2) > -1){
                if (_this.color.search("shape_BG_") > -1) {
                    var b = _this.color.split("shape_BG_");
                    _this.color = b[0] + "shape_BL_" + b[1];
                }else if (_this.color.search("shape_BL_") > -1) {
                    var b = _this.color.split("shape_BL_");
                    _this.color = b[0] + "shape_BG_" + b[1];
                } else {
                    var b = _this.color.split("shape_");
                    _this.color = b[0] + "shape_BL_" + b[1];
                }
                $(_this.shape[0]).attr("href", _this.color);
            }else{
                if (_this.color.search("shape_BG_") > -1) {
                    var b = _this.color.split("shape_BG_");
                    _this.color = b[0] + "shape_" + b[1];
                } else {
                    var b = _this.color.split("shape_");
                    _this.color = b[0] + "shape_BG_" + b[1];
                }
                $(_this.shape[0]).attr("href", _this.color);
            }

        }
    }

    var ox = 0;
    var oy = 0;
    var hasMove = false;
    var shapeDragger = function (x, y, e) {
        e.stopPropagation();
        hasMove = false;
        if (_this.canMove) {
            ox = _this.x;
            oy = _this.y;
        }
    };
    var shapeMove = function (dx, dy, x, y, e) {
        if (_this.canMove) {
            e.stopPropagation();
            if (dx != 0 || dy != 0) {
                hasMove = true;
            } else {
                hasMove = false;
            }
            if (_this.path && _this.path.length > 0) {
                var point = Tools.getNearlyPointToLine(_this.path, ox + dx, oy + dy);
                _this.x = point[0];
                _this.y = point[1];
            } else {
                _this.x = ox + dx;
                _this.y = oy + dy;
            }
            _this.moveTo();
            if (_this.moveFun) {
                _this.moveFun(_this);
            }
        }
    };
    var shapeUp = function () {
        if (_this.canMove) {
            if (hasMove && _this.upFun) {
                _this.upFun(_this);
            }
        }
        if (hasMove == false && _this.clickFun) {
            _this.clickFun(_this);
        }
    };
    var shapeDbclick = function () {
        if (hasMove == false && _this.dbClickFun) {
            _this.dbClickFun(_this);
        }
    };
    var getHalfWidth = function () {
        if (_this.shapeType == ShapeConfig.SHAPE_ELLIPSE) {
            return 0;
        } else {
            return _this.width / 2;
        }
    };
    var getHalfHeight = function () {
        if (_this.shapeType == ShapeConfig.SHAPE_ELLIPSE) {
            return 0;
        } else {
            return _this.height / 2;
        }
    };

};

// 线条对象
PolyLineBean = function () {
    var _this = this;
    GeometryBean.call(this);
    this.geometryType = ShapeConfig.GEOMETRY_POLYLINE;


    /********** 新增 ***********/
    // this.width = 0;
    // this.border = 5;
    // this.pointSize = 4;
    this.border = 0;
    this.pointSize = 4;
    /***************************/


    this.bShape = null;
    this.eShape = null;
    this.beginShape = null;
    this.endShape = null;
    // this.c1Shape = null;
    // this.c2Shape = null;
    this.lineType = null;
    this.middleShapeType = ShapeConfig.SHAPE_RECT;
    this.middleWidth = 6;
    this.middleHeight = 6;
    this.middleColor = '#999999';
    this.middleFillColor = '#999999';
    this.warningMiddleColor = '#999999';
    this.warningMiddleFillColor = '#999999';
    this.middleFacilityType = ShapeConfig.FACILITY_PIPECABLECONNECTION;
    this.backShape = null;
    this.hasBackShape = false;
    this.shapeList = [];
    this.createConnectFun = null;
    this.deleteConnectFun = null;
    this.middleUp = null;
    this.dasharray = [''];
    var lastSelectShape = null;
    this.setPath = function (id) {
        var cx1 = _this.c1x;
        var cy1 = _this.c1y;
        var cx2 = _this.c2x;
        var cy2 = _this.c2y;
        if (Math.abs(_this.ex - _this.bx) > Math.abs(_this.ey - _this.by)) {
            if (id == 1) {
                cx2 = cx1;
            } else {
                cx1 = cx2;
            }
            if (Math.abs(_this.by - _this.ey) <= 3 && id == 3) {
                _this.ey = _this.by;
            }
            if (Math.abs(_this.by - _this.ey) <= 3 && id == 0) {
                _this.by = _this.ey;
            }
            if (Math.abs(cx1 - _this.bx) <= 3) {
                cx1 = cx2 = _this.bx;
            }
            if (Math.abs(cx1 - _this.ex) <= 3) {
                cx1 = cx2 = _this.ex;
            }
            //cx1 = (_this.ex + _this.bx) / 2;
            cy1 = _this.by;
            //cx2 = (_this.ex + _this.bx) / 2;
            cy2 = _this.ey;
            _this.c1y = cy1;
            _this.c2y = cy2;
            _this.c1x = cx1;
            _this.c2x = cx2;
        } else {
            if (id == 1) {
                cy2 = cy1;
            } else {
                cy1 = cy2;
            }
            if (Math.abs(_this.bx - _this.ex) <= 3 && id == 3) {
                _this.ex = _this.bx;
            }
            if (Math.abs(_this.bx - _this.ex) <= 3 && id == 0) {
                _this.bx = _this.ex;
            }
            if (Math.abs(cy1 - _this.by) <= 3) {
                cy1 = cy2 = _this.by;
            }
            if (Math.abs(cy1 - _this.ey) <= 3) {
                cy1 = cy2 = _this.ey;
            }
            cx1 = _this.bx;
            //cy1 = (_this.ey + _this.by) / 2;
            cx2 = _this.ex;
            //cy2 = (_this.ey + _this.by) / 2;
            _this.c1y = cy1;
            _this.c2y = cy2;
            _this.c1x = cx1;
            _this.c2x = cx2;
        }
        this.path[0] = {x: this.bx, y: this.by};
        this.path[1] = {x: cx1, y: cy1};
        this.path[2] = {x: cx2, y: cy2};
        this.path[3] = {x: this.ex, y: this.ey};
    };
    this.createShape = function () {
        if (this.raphael) {
            this.setPath();
            var path = this.getPath();
            /*************** 修改  ****************/
            this.shape = this.raphael.path(path).attr({
                stroke: this.color,
                fill: "none",
                "stroke-width": this.border,
                'stroke-dasharray': this.dasharray,
            });

            /************************************/
            this.shape.toFront();
            this.shape.mousedown(function (e) {
                e.stopPropagation();
            });
            this.shape.click(function (e) {
                e.stopPropagation();
                shapeClick(_this);
            });
            this.shape.mouseover(function (e) {
                if (_this.hasBackShape && _this.canMove) {
                    var offset = $('#holder').offset();
                    var x = (e.pageX - offset.left);
                    var y = (e.pageY - offset.top);
                    _this.visitBashShape(true, x, y);
                }
                if (_this.overFun) {
                    _this.overFun(_this);
                }
            });
            this.shape.mouseout(function (e) {
                if (_this.outFun) {
                    _this.outFun(_this);
                }
            });

            this.bShape = new ShapeBean();
            this.bShape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            this.bShape.x = this.bx;
            this.bShape.y = this.by;
            this.bShape.hasExtent = false;
            this.bShape.raphael = this.raphael;
            this.bShape.width = this.pointSize;
            this.bShape.height = this.pointSize;
            this.bShape.canMove = this.canMove;
            this.bShape.border = 1;
            this.bShape.color = this.color;
            this.bShape.fillColor = this.fillColor;
            this.bShape.warningColor = this.warningColor;
            this.bShape.warningFillColor = this.warningFillColor;
            this.bShape.toTop = true;
            this.bShape.overFun = shapeOver;
            this.bShape.outFun = shapeOut;
            this.bShape.moveFun = function (shape) {
                _this.bx = _this.bShape.x;
                _this.by = _this.bShape.y;
                _this.moveTo();
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
                    if (shapeBean == _this.endShape) {
                        shapeBean = null;
                    }
                }
                if (lastSelectShape != shapeBean && lastSelectShape) {
                    lastSelectShape.unSelect();
                }
                if (shapeBean) {
                    shapeBean.select();
                    lastSelectShape = shapeBean;
                }
                if (_this.beginShape) {
                    _this.beginShape.removeLine(_this);
                }
                _this.beginShape = null;
                _this.resetShape();
                if (_this.moveFun) {
                    _this.moveFun(this, -1);
                }
            };
            this.bShape.upFun = function (shape) {
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
                    if (shapeBean == _this.endShape) {
                        shapeBean = null;
                    }
                }
                if (_this.beginShape) {
                    _this.beginShape.removeLine(_this);
                }
                _this.beginShape = shapeBean;
                if (shapeBean) {
                    shapeBean.addLine(_this);
                    shapeBean.unSelect();
                }
                if (_this.upFun) {
                    _this.upFun(this, -1);
                }
            };
            this.bShape.clickFun = shapeClick;
            this.bShape.createShape();

            /**
             *  @ ls 20170912
             *  @ 增加c1c2两点
             */
            // this.c1Shape = new ShapeBean();
            // this.c1Shape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            // this.c1Shape.x = this.c1x;
            // this.c1Shape.y = this.c1y;
            // this.c1Shape.hasExtent = false;
            // this.c1Shape.raphael = this.raphael;
            // this.c1Shape.width = this.pointSize;
            // this.c1Shape.height = this.pointSize;
            // this.c1Shape.canMove = this.canMove;
            // this.c1Shape.border = 1;
            // this.c1Shape.color = this.color;
            // this.c1Shape.fillColor = this.fillColor;
            // this.c1Shape.warningColor = this.warningColor;
            // this.c1Shape.warningFillColor = this.warningFillColor;
            // this.c1Shape.toTop = true;
            // this.c1Shape.overFun = shapeOver;
            // this.c1Shape.outFun = shapeOut;
            // this.c1Shape.moveFun = function (shape) {
            //     _this.c1x = _this.c1Shape.x;
            //     _this.c1y = _this.c1Shape.y;
            //     _this.moveTo(1);
            //     var shapeBean = null;
            //     if (_this.shapeCollection) {
            //         shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
            //         if (shapeBean == _this.endShape) {
            //             shapeBean = null;
            //         }
            //     }
            //     if (lastSelectShape != shapeBean && lastSelectShape) {
            //         lastSelectShape.unSelect();
            //     }
            //     if (shapeBean) {
            //         shapeBean.select();
            //         lastSelectShape = shapeBean;
            //     }
            //     if (_this.beginShape) {
            //         _this.beginShape.removeLine(_this);
            //     }
            //     _this.beginShape = null;
            //     _this.resetShape();
            //     if (_this.moveFun) {
            //         _this.moveFun(this, -1);
            //     }
            // };
            // this.c1Shape.upFun = function (shape) {
            //     var shapeBean = null;
            //     if (_this.shapeCollection) {
            //         shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
            //         if (shapeBean == _this.endShape) {
            //             shapeBean = null;
            //         }
            //     }
            //     if (_this.beginShape) {
            //         _this.beginShape.removeLine(_this);
            //     }
            //     _this.beginShape = shapeBean;
            //     if (shapeBean) {
            //         shapeBean.addLine(_this);
            //         shapeBean.unSelect();
            //     }
            //     if (_this.upFun) {
            //         _this.upFun(this, -1);
            //     }
            // };
            // this.c1Shape.clickFun = shapeClick;
            // this.c1Shape.createShape();

            // this.c2Shape = new ShapeBean();
            // this.c2Shape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            // this.c2Shape.x = this.c2x;
            // this.c2Shape.y = this.c2y;
            // this.c2Shape.hasExtent = false;
            // this.c2Shape.raphael = this.raphael;
            // this.c2Shape.width = this.pointSize;
            // this.c2Shape.height = this.pointSize;
            // this.c2Shape.canMove = this.canMove;
            // this.c2Shape.border = 1;
            // this.c2Shape.color = this.color;
            // this.c2Shape.fillColor = this.fillColor;
            // this.c2Shape.warningColor = this.warningColor;
            // this.c2Shape.warningFillColor = this.warningFillColor;
            // this.c2Shape.toTop = true;
            // this.c2Shape.overFun = shapeOver;
            // this.c2Shape.outFun = shapeOut;
            // this.c2Shape.moveFun = function (shape) {
            //     _this.c2x = _this.c2Shape.x;
            //     _this.c2y = _this.c2Shape.y;
            //     _this.moveTo(2);
            //     var shapeBean = null;
            //     if (_this.shapeCollection) {
            //         shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
            //         if (shapeBean == _this.endShape) {
            //             shapeBean = null;
            //         }
            //     }
            //     if (lastSelectShape != shapeBean && lastSelectShape) {
            //         lastSelectShape.unSelect();
            //     }
            //     if (shapeBean) {
            //         shapeBean.select();
            //         lastSelectShape = shapeBean;
            //     }
            //     if (_this.beginShape) {
            //         _this.beginShape.removeLine(_this);
            //     }
            //     _this.beginShape = null;
            //     _this.resetShape();
            //     if (_this.moveFun) {
            //         _this.moveFun(this, -1);
            //     }
            // };
            // this.c2Shape.upFun = function (shape) {
            //     var shapeBean = null;
            //     if (_this.shapeCollection) {
            //         shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
            //         if (shapeBean == _this.endShape) {
            //             shapeBean = null;
            //         }
            //     }
            //     if (_this.beginShape) {
            //         _this.beginShape.removeLine(_this);
            //     }
            //     _this.beginShape = shapeBean;
            //     if (shapeBean) {
            //         shapeBean.addLine(_this);
            //         shapeBean.unSelect();
            //     }
            //     if (_this.upFun) {
            //         _this.upFun(this, -1);
            //     }
            // };
            // this.c2Shape.clickFun = shapeClick;
            // this.c2Shape.createShape();


            this.eShape = new ShapeBean();
            this.eShape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            this.eShape.x = this.ex;
            this.eShape.y = this.ey;
            this.eShape.hasExtent = false;
            this.eShape.raphael = this.raphael;
            this.eShape.width = this.pointSize;
            this.eShape.height = this.pointSize;
            this.eShape.border = 1;
            this.eShape.canMove = this.canMove;
            this.eShape.color = this.color;
            this.eShape.fillColor = this.fillColor;
            this.eShape.warningColor = this.warningColor;
            this.eShape.warningFillColor = this.warningFillColor;
            this.eShape.toTop = true;
            this.eShape.overFun = shapeOver;
            this.eShape.outFun = shapeOut;
            this.eShape.moveFun = function (shape) {
                _this.ex = _this.eShape.x;
                _this.ey = _this.eShape.y;
                _this.moveTo();
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.ex, _this.ey, _this.facilityType);
                    if (shapeBean == _this.beginShape) {
                        shapeBean = null;
                    }
                }
                if (lastSelectShape != shapeBean && lastSelectShape) {
                    lastSelectShape.unSelect();
                }
                if (shapeBean) {
                    shapeBean.select();
                    lastSelectShape = shapeBean;
                }
                if (_this.endShape) {
                    _this.endShape.removeLine(_this);
                }
                _this.endShape = null;
                _this.resetShape();
                if (_this.moveFun) {
                    _this.moveFun(this, 1);
                }
            };
            this.eShape.upFun = function (shape) {
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.ex, _this.ey, _this.facilityType);
                    if (shapeBean == _this.beginShape) {
                        shapeBean = null;
                    }
                }
                if (_this.endShape) {
                    _this.endShape.removeLine(_this);
                }
                _this.endShape = shapeBean;
                if (shapeBean) {
                    shapeBean.addLine(_this);
                    shapeBean.unSelect();
                }
                if (_this.upFun) {
                    _this.upFun(this, -1);
                }
            };
            this.eShape.clickFun = shapeClick;
            this.eShape.createShape();
            this.setCenter().setText().setExtent().unSelect().setBackShape().visitBashShape(false);

            if (this.shapeCollection) {
                this.shapeCollection.addShape(this);
            }
            this.initMiddleShape();
        }
        return this;
    };
    var canHideBackShape = true;
    this.setBackShape = function () {
        // if (this.hasBackShape && this.canMove) {
        this.backShape = new ShapeBean();
        this.backShape.shapeType = this.middleShapeType;
        this.backShape.x = -1000;
        this.backShape.y = -1000;
        this.backShape.hasExtent = false;
        this.backShape.raphael = this.raphael;
        this.backShape.width = this.middleWidth;
        this.backShape.height = this.middleWidth;
        this.backShape.canMove = false;
        this.backShape.border = 1;
        this.backShape.opacity = 0.2;
        this.backShape.radius = 0;
        this.backShape.color = this.middleColor;
        this.backShape.fillColor = this.middleFillColor;
        this.backShape.toTop = true;
        this.backShape.overFun = function (e) {
            canHideBackShape = false;
        };
        this.backShape.outFun = function (e) {
            canHideBackShape = true;
            _this.visitBashShape(false);
        };
        this.backShape.clickFun = function (shape) {
            var shp = createMiddelShape(null, _this.backShape.x, _this.backShape.y);
        };
        this.backShape.createShape();
        // }
        return this;
    };
    var createMiddelShape = function (id, x, y) {
        var shape = new ShapeBean();
        shape.shapeType = _this.middleShapeType;
        shape.x = x;
        shape.y = y;
        if (id) {
            shape.id = id;
        }
        shape.hasExtent = true;
        shape.facilityType = _this.middleFacilityType;
        shape.raphael = _this.raphael;
        shape.width = _this.middleWidth;
        shape.height = _this.middleWidth;
        shape.shapeCollection = _this.shapeCollection;
        shape.border = 1;
        shape.opacity = 0.9;
        shape.radius = 0;
        shape.autoLine = true;
        shape.path = _this.path;
        shape.color = _this.middleColor;
        shape.fillColor = _this.middleFillColor;
        shape.canMove = _this.canMove;
        shape.toTop = true;
        shape.dbClickFun = function (shape) {
            _this.removeMiddleShape(shape);
            shape.remove();
            if (_this.deleteConnectFun) {
                _this.deleteConnectFun(_this);
            }
        };
        shape.moveFun = function (shape) {
            _this.updateMiddleShape(shape);
        };
        shape.upFun = function (shape) {
            if (_this.middleUp) {
                _this.middleUp(shape);
            }
        };
        shape.createShape();
        _this.updateMiddleShape(shape);
        if (_this.createConnectFun) {
            _this.createConnectFun(_this);
        }
        return shape;
    };
    this.initMiddleShape = function () {
        if (this.shapeList && this.shapeList.length > 0) {
            var list = [];
            for (var a = 0; a < this.shapeList.length; a++) {
                var shape = this.shapeList[a];
                if (Tools.isString(shape.shape)) {
                    list.push({
                        shape: shape.shape,
                        x: shape.x,
                        y: shape.y,
                    });
                }
            }
            this.shapeList = [];
            for (var b = 0; b < list.length; b++) {
                createMiddelShape(list[b].shape, list[b].x, list[b].y);
            }
        }
    };
    this.updateMiddleShape = function (shape) {
        var percent = this.getShapePercent(shape);
        var add = true;
        for (var a = 0; a < this.shapeList.length; a++) {
            if (this.shapeList[a].shape.id == shape.id) {
                add = false;
                this.shapeList[a].percent = percent;
                break;
            }
        }
        if (add) {
            this.shapeList.push({
                shape: shape,
                percent: percent,
            });
        }
        return this;
    };
    this.removeMiddleShape = function (shape) {
        var list = [];
        for (var a = 0; a < this.shapeList.length; a++) {
            if (this.shapeList[a].shape.id != shape.id) {
                list.push(this.shapeList[a]);
            }
        }
        this.shapeList = list;
        return this;
    };
    this.getShapePercent = function (shape) {
        var length = this.shape.getTotalLength();
        var x = shape.x;
        var y = shape.y;
        var point = Tools.getNearlyPointToLine(this.path, x, y);
        var l = 0;
        var i = parseInt(point[2]);
        for (var a = 0; a < i; a++) {
            l += Math.sqrt((this.path[a].x - this.path[a + 1].x) * (this.path[a].x - this.path[a + 1].x) + (this.path[a].y - this.path[a + 1].y) * (this.path[a].y - this.path[a + 1].y));
        }
        l += Math.sqrt((this.path[i].x - x) * (this.path[i].x - x) + (this.path[i].y - y) * (this.path[i].y - y));
        var percent = l / length;
        return percent;
    };
    this.visitBashShape = function (visible, x, y) {
        if (this.hasBackShape) {
            // if (this.backShape) {
            if (visible) {
                var point = Tools.getNearlyPointToLine(this.path, x, y);
                this.backShape.x = point[0];
                this.backShape.y = point[1];
                this.backShape.shape.show();
                this.backShape.moveTo();
            } else {
                if (this.backShape) {
                    this.backShape.shape.hide();
                }
            }
        }
        return this;
    };
    this.moveTo = function (id) {
        this.setPath(id);
        this.shape.attr({
            path: this.getPath()
        });
        this.bShape.x = this.bx;
        this.bShape.y = this.by;
        this.eShape.x = this.ex;
        this.eShape.y = this.ey;
        /**
         *  @ ls 20170912
         *  @ 设置c1c2两点位置
         */
        // this.c1Shape.x = this.c1x;
        // this.c1Shape.y = this.c1y;
        // this.c2Shape.x = this.c2x;
        // this.c2Shape.y = this.c2y;

        this.bShape.moveTo();
        this.eShape.moveTo();

        // this.c1Shape.moveTo();
        // this.c2Shape.moveTo();

        this.setCenter();

        /*********** 修改  ************/
        this.setText();
        /************************/

        this.setExtent();
        var length = this.shape.getTotalLength();
        for (var a = 0; a < this.shapeList.length; a++) {
            var percent = this.shapeList[a].percent;
            var shape = this.shapeList[a].shape;
            var point = this.shape.getPointAtLength(length * percent);
            shape.x = point.x;
            shape.y = point.y;
            shape.moveTo();
        }
        return this;
    };
    this.setWarning = function (state) {
        if (state) {
            this.shape.attr({
                stroke: this.warningColor,
            });
        } else {
            this.shape.attr({
                stroke: this.color,
            });
        }
        this.bShape.setWarning(state);
        this.eShape.setWarning(state);
    };
    this.setCenter = function () {
        this.cx = (this.bx + this.ex) / 2;
        this.cy = (this.by + this.ey) / 2;
        return this;
    };

    this.setPath = function () {
        if (this.lineType != "StraightLine") {
            var cx1 = 0;
            var cy1 = 0;
            var cx2 = 0;
            var cy2 = 0;
            if (Math.abs(_this.ex - _this.bx) > Math.abs(_this.ey - _this.by)) {
                // cx1 = (_this.ex + _this.bx) / 2;
                // cy1 = _this.by;
                // cx2 = (_this.ex + _this.bx) / 2;
                // cy2 = _this.ey;
                cx1 = cx2 = _this.ex;
                cy1 = cy2 = _this.by;
            } else {
                // cx1 = _this.bx;
                // cy1 = (_this.ey + _this.by) / 2;
                // cx2 = _this.ex;
                // cy2 = (_this.ey + _this.by) / 2;
                cx1 = cx2 = _this.bx;
                cy1 = cy2 = _this.ey;
            }
            this.path[0] = {x: this.bx, y: this.by};
            this.path[1] = {x: cx1, y: cy1};
            this.path[2] = {x: cx2, y: cy2};
            this.path[3] = {x: this.ex, y: this.ey};
        } else {
            this.path[0] = {x: this.bx, y: this.by};
            this.path[1] = {x: this.bx, y: this.by};
            this.path[2] = {x: this.ex, y: this.ey};
            this.path[3] = {x: this.ex, y: this.ey};
        }
    };
    this.getPath = function () {
        // // path(起点,右，下，左);  M 起点  L直线到(x,y)坐标
        var path = ['M', this.path[0].x, this.path[0].y, 'L', this.path[1].x, this.path[1].y, 'L', this.path[2].x, this.path[2].y, 'L', this.path[3].x, this.path[3].y].join(',');
        return path;
    };
    this.disconnect = function () {
        if (this.beginShape) {
            this.beginShape.removeLine(this);
        }
        if (this.endShape) {
            this.endShape.removeLine(this);
        }
        this.beginShape = null;
        this.endShape = null;
        return this;
    };
    this.remove = function () {
        this.disconnect();
        this.shape.remove();
        this.bShape.remove();
        /*
            @ ls 20170908
            @ 增加删除c1c2节点方法
        */
        // this.c1Shape.remove();
        // this.c2Shape.remove();
        /***********************/
        this.eShape.remove();
        this.textShape.remove();
        this.textShape2.remove();
        if (this.backShape) {
            this.backShape.remove();
        }
        for (var a = 0; a < this.shapeList.length; a++) {
            this.shapeList[a].shape.remove();
        }
        if (this.extent) {
            this.extent.remove();
        }
        if (this.shapeCollection) {
            this.shapeCollection.removeShape(this);
        }
        return this;
    };
    this.resetShape = function () {
        if (this.beginShape) {
            this.beginShape.resetSingleLine(_this);
        }
        if (this.endShape) {
            this.endShape.resetSingleLine(_this);
        }
        return this;
    };
    var shapeClick = function (shape) {
        _this.shape.toFront();
        _this.bShape.shape.toFront();
        _this.eShape.shape.toFront();
        if (_this.backShape) {
            _this.backShape.shape.toFront();
        }
        for (var a = 0; a < _this.shapeList.length; a++) {
            _this.shapeList[a].shape.shape.toFront();
        }
        _this.textShape.toFront();
        _this.textShape2.toFront();
        if (_this.clickFun) {
            _this.clickFun(_this);
        }
    };
    var shapeOver = function (shape) {
        shape.width = shape.width * 2;
        shape.height = shape.height * 2;
        shape.moveTo();
        if (_this.overFun) {
            _this.overFun(shape);
        }
    };
    var shapeOut = function (shape) {
        shape.width = shape.width / 2;
        shape.height = shape.height / 2;
        shape.moveTo();
        if (_this.outFun) {
            _this.outFun(shape);
        }
    };
};


// 曲线
CurveLineBean = function () {
    var _this = this;
    PolyLineBean.call(this);
    this.geometryType = ShapeConfig.GEOMETRY_CURVELINE;
    this.mShape = null;
    var lastSelectShape = null;
    this.createShape = function () {
        if (this.raphael) {
            this.setPath();
            var path = this.getPath();
            this.shape = this.raphael.path(path).attr({
                stroke: this.color,
                fill: "none",
                "stroke-width": this.border
            });
            this.shape.toFront();
            this.shape.mousedown(function (e) {
                e.stopPropagation();
            });
            this.shape.click(function (e) {
                e.stopPropagation();
                shapeClick(_this);
            });
            this.shape.mouseover(function (e) {
                if (_this.overFun) {
                    _this.overFun(_this);
                }
            });
            this.shape.mouseout(function (e) {
                if (_this.outFun) {
                    _this.outFun(_this);
                }
            });

            this.bShape = new ShapeBean();
            this.bShape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            this.bShape.x = this.bx;
            this.bShape.y = this.by;
            this.bShape.hasExtent = false;
            this.bShape.raphael = this.raphael;
            this.bShape.width = this.pointSize;
            this.bShape.height = this.pointSize;
            this.bShape.border = 1;
            this.bShape.canMove = this.canMove;
            this.bShape.color = this.color;
            this.bShape.fillColor = this.fillColor;
            this.bShape.warningColor = this.warningColor;
            this.bShape.warningFillColor = this.warningFillColor;
            this.bShape.toTop = true;
            this.bShape.overFun = shapeOver;
            this.bShape.outFun = shapeOut;
            this.bShape.moveFun = function (shape) {
                _this.bx = _this.bShape.x;
                _this.by = _this.bShape.y;
                _this.moveTo();
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
                    if (shapeBean == _this.endShape) {
                        shapeBean = null;
                    }
                }
                if (lastSelectShape != shapeBean && lastSelectShape) {
                    lastSelectShape.unSelect();
                }
                if (shapeBean) {
                    shapeBean.select();
                    lastSelectShape = shapeBean;
                }
                if (_this.moveFun) {
                    _this.moveFun(this, -1);
                }
            };
            this.bShape.upFun = function (shape) {
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
                    if (shapeBean == _this.endShape) {
                        shapeBean = null;
                    }
                }
                if (_this.beginShape) {
                    _this.beginShape.removeLine(_this);
                }
                _this.beginShape = shapeBean;
                if (shapeBean) {
                    shapeBean.addLine(_this);
                    shapeBean.unSelect();
                }
                if (_this.upFun) {
                    _this.upFun(this, -1);
                }
            };
            this.bShape.clickFun = shapeClick;
            this.bShape.createShape();

            this.mShape = new ShapeBean();
            this.mShape.shapeType = this.middleShapeType;
            this.mShape.x = this.cx;
            this.mShape.y = this.cy;
            this.mShape.hasExtent = false;
            this.mShape.raphael = this.raphael;
            this.mShape.width = this.middleWidth;
            this.mShape.height = this.middleWidth;
            this.mShape.border = 1;
            this.mShape.canMove = this.canMove;
            this.mShape.color = this.middleColor;
            this.mShape.fillColor = this.middleFillColor;
            this.mShape.warningColor = this.warningMiddleColor;
            this.mShape.warningFillColor = this.warningMiddleFillColor;
            this.mShape.toTop = true;
            this.mShape.overFun = shapeOver;
            this.mShape.outFun = shapeOut;
            this.mShape.moveFun = function (shape) {
                _this.cx = shape.x;
                _this.cy = shape.y;
                _this.moveTo();
                _this.resetShape();
                if (_this.moveFun) {
                    _this.moveFun(this, 0);
                }
            };
            this.mShape.upFun = function (shape) {
                if (_this.upFun) {
                    _this.upFun(this, 0);
                }
            };
            this.mShape.clickFun = shapeClick;
            this.mShape.createShape();

            this.eShape = new ShapeBean();
            this.eShape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            this.eShape.x = this.ex;
            this.eShape.y = this.ey;
            this.eShape.hasExtent = false;
            this.eShape.raphael = this.raphael;
            this.eShape.width = this.pointSize;
            this.eShape.height = this.pointSize;
            this.eShape.border = 1;
            this.eShape.canMove = this.canMove;
            this.eShape.color = this.color;
            this.eShape.fillColor = this.fillColor;
            this.eShape.warningColor = this.warningColor;
            this.eShape.warningFillColor = this.warningFillColor;
            this.eShape.toTop = true;
            this.eShape.overFun = shapeOver;
            this.eShape.outFun = shapeOut;
            this.eShape.moveFun = function (shape) {
                _this.ex = _this.eShape.x;
                _this.ey = _this.eShape.y;
                _this.moveTo();
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.ex, _this.ey, _this.facilityType);
                    if (shapeBean == _this.beginShape) {
                        shapeBean = null;
                    }
                }
                if (lastSelectShape != shapeBean && lastSelectShape) {
                    lastSelectShape.unSelect();
                }
                if (shapeBean) {
                    shapeBean.select();
                    lastSelectShape = shapeBean;
                }
                if (_this.moveFun) {
                    _this.moveFun(this, 1);
                }
            };
            this.eShape.upFun = function (shape) {
                var shapeBean = null;
                if (_this.shapeCollection) {
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.ex, _this.ey, _this.facilityType);
                    if (shapeBean == _this.beginShape) {
                        shapeBean = null;
                    }
                }
                if (_this.endShape) {
                    _this.endShape.removeLine(_this);
                }
                _this.endShape = shapeBean;
                if (shapeBean) {
                    shapeBean.addLine(_this);
                    shapeBean.unSelect();
                }
                if (_this.upFun) {
                    _this.upFun(this, -1);
                }
            };
            this.eShape.clickFun = shapeClick;
            this.eShape.createShape();
            this.setText();
            this.setExtent().unSelect();
            if (this.shapeCollection) {
                this.shapeCollection.addShape(this);
            }
        }
        return this;
    };
    this.moveTo = function () {
        this.setPath();
        this.shape.attr({
            path: this.getPath(),
        });
        this.bShape.x = this.bx;
        this.bShape.y = this.by;
        this.mShape.x = this.cx;
        this.mShape.y = this.cy;
        this.eShape.x = this.ex;
        this.eShape.y = this.ey;
        this.bShape.moveTo();
        this.mShape.moveTo();
        this.eShape.moveTo();
        this.setText();
        this.setExtent();
        return this;
    };
    this.setWarning = function (state) {
        if (state) {
            this.shape.attr({
                stroke: this.warningColor,
            });
        } else {
            this.shape.attr({
                stroke: this.color,
            });
        }
        this.bShape.setWarning(state);
        this.mShape.setWarning(state);
        this.eShape.setWarning(state);
    };
    this.setPath = function () {
        this.path[0] = {x: this.bx, y: this.by};
        this.path[1] = {x: this.cx, y: this.cy};
        this.path[2] = {x: this.ex, y: this.ey};
    };
    this.getPath = function () {
        var path = ['M', this.path[0].x, this.path[0].y, 'R', this.path[1].x, this.path[1].y, this.path[2].x, this.path[2].y].join(',');
        return path;
    };
    this.remove = function () {
        this.disconnect();
        this.shape.remove();
        this.bShape.remove();
        this.mShape.remove();
        this.eShape.remove();
        this.textShape.remove();
        this.textShape2.remove();
        if (this.extent) {
            this.extent.remove();
        }
        if (this.shapeCollection) {
            this.shapeCollection.removeShape(this);
        }
        return this;
    };
    var shapeClick = function (shape) {
        _this.shape.toFront();
        _this.bShape.shape.toFront();
        _this.mShape.shape.toFront();
        _this.eShape.shape.toFront();
        _this.textShape.toFront();
        _this.textShape2.toFront();
        if (_this.clickFun) {
            _this.clickFun(_this);
        }
    };
    var shapeOver = function (shape) {
        shape.width = shape.width * 2;
        shape.height = shape.height * 2;
        shape.moveTo();
        if (_this.overFun) {
            _this.overFun(shape);
        }
    };
    var shapeOut = function (shape) {
        shape.width = shape.width / 2;
        shape.height = shape.height / 2;
        shape.moveTo();
        if (_this.outFun) {
            _this.outFun(shape);
        }
    };
};


// 直线
LineBean = function () {
    var _this = this;
    PolyLineBean.call(this);
    this.geometryType = ShapeConfig.GEOMETRY_LINE;
    this.setPath = function () {
        this.path[0] = {x: this.bx, y: this.by};
        this.path[1] = {x: this.ex, y: this.ey};
    };
    this.getPath = function () {
        var path = ['M', this.path[0].x, this.path[0].y, 'L', this.path[1].x, this.path[1].y].join(',');
        return path;
    };
};
// 工具对象
Tools = {
    isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    isObject: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },
    isNumber: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Number]';
    },
    isString: function (obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    },
    isFunction: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    },
    isBoolean: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Boolean]';
    },
    isNull: function (obj) {
        return obj == null || obj == '' || obj == undefined;
    },
    isNotNull: function (obj) {
        return !this.isNull(obj);
    },
    getUUID: function () {
        var s = [];
        var hexDigits = '0123456789abcdefghijklmnopqrstuvwxyz';
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[8] = s[13] = s[18] = s[23] = '-';
        var uuid = s.join('');
        return uuid;
    },
    setValue: function (name, index, val) {
        if (val != null && val != undefined) {
            try {
                var htmlType = $($("[name='" + name + "']")[index]).attr("type");
                if (htmlType == "text" || htmlType == "double" || htmlType == "textarea" || htmlType == "select-one" || htmlType == "hidden" || htmlType == "button" || htmlType == "number") {
                    $($("[name='" + name + "']")[index]).val(val);
                } else if (htmlType == "radio") {
                    $($("input[type=radio][name='" + name + "'][value='" + val + "']")[index]).attr("checked", true);
                } else if (htmlType == "checkbox") {
                    var vals = val.split(",");
                    for (var i = 0; i < vals.length; i++) {
                        $($("input[type=checkbox][name='" + name + "'][value='" + vals[i] + "']")[index]).attr("checked", true);
                    }
                } else {
                    $($("[name='" + name + "']")[index]).html(val);
                }
            } catch (e) {
            }
        }
    },
    getNearlyPointToLine: function (path, oX, oY) {
        var pointToPoint = -1;
        var pointToLine = -1;
        var point1 = [];
        var point2 = [];
        for (var i = 0; i < path.length; i++) {
            var tm1 = Math.sqrt((path[i].x - oX) * (path[i].x - oX) + (path[i].y - oY) * (path[i].y - oY));
            if (i == 0) {
                pointToPoint = tm1;
                point1[0] = path[i].x;
                point1[1] = path[i].y;
                point1[2] = i;
                point1[3] = pointToPoint;
            }
            if (tm1 < pointToPoint) {
                pointToPoint = tm1;
                point1[0] = path[i].x;
                point1[1] = path[i].y;
                point1[2] = i;
                point1[3] = pointToPoint;
            }
            if (i > 0 && (path[i].x - path[i - 1].x != 0 || path[i].y - path[i - 1].y != 0)) {
                var a = (path[i - 1].x - oX) * (path[i - 1].x - oX) + (path[i - 1].y - oY) * (path[i - 1].y - oY);
                var b = (path[i].x - oX) * (path[i].x - oX) + (path[i].y - oY) * (path[i].y - oY);
                var c = (path[i].x - path[i - 1].x) * (path[i].x - path[i - 1].x) + (path[i].y - path[i - 1].y) * (path[i].y - path[i - 1].y);
                if (a + c >= b && b + c >= a) {
                    var x0 = 0;
                    var y0 = 0;
                    if (path[i].x - path[i - 1].x == 0) {
                        x0 = path[i].x;
                        y0 = oY;
                    } else if (path[i].y - path[i - 1].y == 0) {
                        x0 = oX;
                        y0 = path[i].y;
                    } else {
                        var k1 = 0.0;
                        if (path[i].x - path[i - 1].x == 0) {
                            k1 = 1.0;
                        } else {
                            k1 = (path[i].y - path[i - 1].y) / (path[i].x - path[i - 1].x);
                        }
                        var k2 = 0.0;
                        if (k1 == 0.0) {
                            k2 = 1.0;
                        } else if (k1 == 1.0) {
                            k2 = 0.0;
                        } else {
                            k2 = -1 / k1;
                        }
                        var b1 = path[i].y - k1 * path[i].x;
                        var b2 = oY - k2 * oX;
                        x0 = (b2 - b1) / (k1 - k2);
                        y0 = k1 * x0 + b1;
                    }
                    var tm2 = Math.sqrt((x0 - oX) * (x0 - oX) + (y0 - oY) * (y0 - oY));
                    if (pointToLine == -1) {
                        pointToLine = tm2;
                        point2[0] = x0;
                        point2[1] = y0;
                        point2[2] = i - 1;
                        point2[3] = i;
                        point2[4] = pointToLine;
                    }
                    if (tm2 < pointToLine) {
                        pointToLine = tm2;
                        point2[0] = x0;
                        point2[1] = y0;
                        point2[2] = i - 1;
                        point2[3] = i;
                        point2[4] = pointToLine;
                    }
                }
            }
        }
        if (pointToPoint < pointToLine && pointToLine != -1) {
            return point1;
        } else if (pointToPoint > pointToLine && pointToLine != -1) {
            return point2;
        } else {
            return point1;
        }
    }
};


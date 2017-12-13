/**
 * @file
 * @author
 * @desc 逻辑图增改逻辑代码
 * @version 1.0
 * @date  2017-08-25
 * @last modified by lzz
 * @last modified time  2017-09-08
 */

// var zoomOld = 100;  // 画布原始百分比
$(document).ready(function () {
    // 时间选择器初始化
    initDateTimePicker();
    // 画布背景颜色选取插件
    // 调用方法：jPicker([settings, [commitCallback, [liveCallback, [cancelCallback]]]])
    $('#changeColorTd').jPicker({
        window: {
            expandable: true,
            position: {
                x: 'left',
                y: 'bottom'
            }
        },
        color: {
            alphaSupport: true,
            active: new $.jPicker.Color({ahex: 'ffffffff'})
        }
    }, function (color, context) {
        var all = color.val('all');
        if (all) {
            var color = all.r + "," + all.g + "," + all.b + "," + all.a;
            $("#holder").css("background", "rgba(" + color + ") url()");
        } else {
            $("#holder").css("background", "#fff url(./image/canvas.png)");
        }

    });

    // 可手动输入放大缩小面板的比例
    // $("#zoom").focus(function(){
    //     zoomOld = parseInt($("#zoom").val());
    //     console.log(zoomOld);
    // }).blur(function(){
    //     changeHolderSize($("#holder")[0]);
    // });

    if (flag == 1) {
        $(".bianjitoggle").removeClass("HIDE");
        $(".history").removeClass("HIDE");
        $(".download").removeClass("HIDE");
        $(".save").removeClass("HIDE");
        $(".cut-off").removeClass("HIDE");
        $(".showquery").addClass("HIDE");
    }
});

var MainAndSideRoads = {"type": false}

/**
 * @desc 加载本地json文件展示逻辑图
 */
function loadMyChart() {
    var station = sessionStorage.getItem("stationName");
    var dataArray;
    //"data/留仙洞调压站.json",

    //存储模拟数据判断
    if (station == "留仙洞调压站") {
        MainAndSideRoads.type = true;
    }
    $.ajax({
        url: "data/" + station + ".json",
        method: "get",
        async: false,
        success: function (res) {
            dataArray = res;
        },
        error: function (a, b, c) {
        }
    });
    return dataArray;
}

/**
 * @desc 保存草稿
 * (由于现在没有后台支持，所以现在只是保存成json文件了后期如果与后台结合，一定要能自动保存)
 * (使用了FileSaver插件)
 * @param {json} defination 逻辑图信息
 */
function saveChart(defination) {

    var blob = new Blob([defination], {type: "text/plain;charset=utf-8"});
    //out_put_string为需要保存到文件的字符串内容
    saveAs(blob, "chart.json");//filename.php为保存的文件名
}


/**
 * @desc 添加管点
 */
function addMiddlePointMouseDown(image) {
    if (pageMeta.addPointState) {
        image.src = 'icon/addpoint_01.png';
    } else {
        image.src = 'icon/addpoint_03.png';
    }
    pageMeta.addPointState = !pageMeta.addPointState;
    var shapeList = pageMeta.collection.shapeList;
    for (var a = 0; a < shapeList.length; a++) {
        var shape = shapeList[a];
        shape.hasBackShape = pageMeta.addPointState;
        // if (shape.facilityType == ShapeConfig.LINE_BLACK_BOLD || shape.facilityType == ShapeConfig.LINE_BLACK || shape.facilityType == ShapeConfig.LINE_RED || shape.facilityType == ShapeConfig.LINE_BLUE || shape.facilityType == ShapeConfig.LINE_CYAN || shape.facilityType == ShapeConfig.LINE_YELLOW || shape.facilityType == ShapeConfig.LINE_PINK_DASHED) {
        //     shape.hasBackShape = pageMeta.addPointState;
        // }
    }
}

/**
 * @desc 创建文本区域的开关
 */
function createTextArea(image) {
    pageMeta.isOpenTextTools = !pageMeta.isOpenTextTools;
    if (pageMeta.isOpenTextTools) {
        image.src = 'icon/testinput_03.png';
    } else {
        image.src = 'icon/testinput_01.png';
    }
}


/**
 * @desc 创建矩形选区对象
 */
function cloneSelectAreaObj() {
    var selectAreaObj = new ShapeBean();
    selectAreaObj.raphael = pageMeta.canvas;
    selectAreaObj.shapeType = ShapeConfig.SHAPE_RECT;
    selectAreaObj.facilityType = "SELECT_AREA";
    selectAreaObj.selected = false;
    selectAreaObj.remove = false;
    selectAreaObj.extent = null;
    selectAreaObj.hasExtent = true;
    selectAreaObj.shapeCollection = pageMeta.collection;
    selectAreaObj.x = 1;
    selectAreaObj.y = 1;
    selectAreaObj.width = 50;
    selectAreaObj.height = 50;
    selectAreaObj.border = 1;
    selectAreaObj.radius = 2;
    selectAreaObj.hasShow = false;
    selectAreaObj.fillColor = 'none';
    selectAreaObj.color = '#eb03ec';
    selectAreaObj.opacity = 0.2;
    selectAreaObj.isSelectAreaMove = false;
    selectAreaObj.upFun = function () {
        saveView();
    };
    selectAreaObj.select = function () {
        if (this.extent) {
            this.extent.show();
        }
        this.selected = true;
        return this;
    };
    selectAreaObj.unSelect = function () {
        if (this.extent) {
            this.extent.hide();
        }
        this.selected = false;
        return this;
    };
    selectAreaObj.remove = function () {
        this.shape.remove();
        if (this.extent) {
            this.extent.remove();
        }
        return this;
    };
    selectAreaObj.clickFun = function () {
        for (var i = 0; i < pageMeta.selectAreaList.length; i++) {
            pageMeta.selectAreaList[i].unSelect();
        }
        this.setExtent();
        this.select();
    };
    selectAreaObj.createShape();
    return selectAreaObj;
}


/**
 * @desc 创建矩形选区
 */
function drawSelectArea(image) {
    pageMeta.isSelectArea = !pageMeta.isSelectArea;
    if (pageMeta.isSelectArea) {
        image.src = 'icon/select_area_03.png';
    } else {
        image.src = 'icon/select_area_01.png';
    }
}


/**
 * @desc 重置画布
 */
function resizeCanvas() {
    if ($('#canvasWidth').val()) {
        pageMeta.canvasSize.width = parseInt($('#canvasWidth').val());
    }
    if ($('#canvasHeight').val()) {
        pageMeta.canvasSize.height = parseInt($('#canvasHeight').val());
    }
    pageMeta.canvas.setSize(pageMeta.canvasSize.width, pageMeta.canvasSize.height);
    resizeWindow();
}

// 重置比例
function resizeZoom() {
    $("#holder").css("zoom", "100%");
    $("#zoom").val("100")
}

// 总览全局
function viewAll() {
    $("#holder").css("zoom", "20%");
    pageMeta.canvasSize.width = 5000;
    pageMeta.canvasSize.height = 3000;
    pageMeta.canvas.setSize(pageMeta.canvasSize.width, pageMeta.canvasSize.height);
    resizeWindow();
}

//属性配置
var ChartConfig = {
    //输入框配置列表
    'textInputList': [{
        label: '字体大小',
        name: 'textSize',
        inputtype: 'select',
        type: 'int',
        item: [ // 0
            {
                label: '5px',
                value: 5
            },
            {
                label: '6px',
                value: 6
            },
            {
                label: '7px',
                value: 7
            },
            {
                label: '8px',
                value: 8
            },
            {
                label: '9px',
                value: 9
            },
            {
                label: '10px',
                value: 10
            },
            {
                label: '11px',
                value: 11
            },
            {
                label: '12px',
                value: 12
            },
            {
                label: '13px',
                value: 13
            },
            {
                label: '14px',
                value: 14
            },
            {
                label: '15px',
                value: 15
            },
            {
                label: '16px',
                value: 16
            },
            {
                label: '17px',
                value: 17
            },
            {
                label: '18px',
                value: 18
            },
            {
                label: '19px',
                value: 19
            },
            {
                label: '20px',
                value: 20
            },
            {
                label: '21px',
                value: 21
            },
            {
                label: '22px',
                value: 22
            },
            {
                label: '23px',
                value: 23
            },
            {
                label: '24px',
                value: 24
            },
            {
                label: '25px',
                value: 25
            },
            {
                label: '26px',
                value: 26
            },
            {
                label: '27px',
                value: 27
            },
            {
                label: '28px',
                value: 28
            },
            {
                label: '29px',
                value: 29
            },
            {
                label: '30px',
                value: 30
            }
        ]
    }, {
        label: '字体类型',
        name: 'textFamily',
        inputtype: 'select',
        type: 'string',
        item: [ // 1
            {
                label: '微软雅黑',
                value: '微软雅黑'
            },
            {
                label: '宋体',
                value: '宋体'
            }
        ]
    }, {
        label: '字体颜色',
        name: 'textColor',
        inputtype: 'input',
        type: 'string', // 2
        color: "color"
    }, {
        label: '名称',
        name: 'text',
        inputtype: 'input',
        type: 'string' // 3
    }, {
        label: '位号',
        name: 'bitNumber',
        inputtype: 'input',
        type: 'string' // 4
    }, {
        label: '线色',
        name: 'color',
        inputtype: 'input',
        type: 'string',
        color: "color"// 5
    }, {
        label: '长度km',
        name: 'length',
        inputtype: 'input',
        type: 'double' // 6
    }, {
        label: '线径mm',
        name: 'diameter',
        inputtype: 'input',
        type: 'double' // 7
    }, {
        label: '设备ID',
        name: 'ID',
        inputtype: 'input',
        type: 'string' // 8
    }, {
        label: '管线大小',
        name: 'stroke-width',
        inputtype: 'select',
        type: 'int',
        item: [ // 9
            {
                label: '1px',
                value: 1
            },
            {
                label: '2px',
                value: 2
            },
            {
                label: '3px',
                value: 3
            },
            {
                label: '4px',
                value: 4
            },
            {
                label: '5px',
                value: 5
            },
            {
                label: '6px',
                value: 6
            },
            {
                label: '7px',
                value: 7
            },
            {
                label: '8px',
                value: 8
            },
            {
                label: '9px',
                value: 9
            },
            {
                label: '10px',
                value: 10
            }
        ]
    }, {
        label: '元件放大',
        name: 'magnification',
        inputtype: 'input',
        type: 'number' // 10
    }, {
        label: '字体大小',
        name: 'text2Size',
        inputtype: 'select',
        type: 'int',
        item: [ // 11
            {
                label: '5px',
                value: 5
            },
            {
                label: '6px',
                value: 6
            },
            {
                label: '7px',
                value: 7
            },
            {
                label: '8px',
                value: 8
            },
            {
                label: '9px',
                value: 9
            },
            {
                label: '10px',
                value: 10
            },
            {
                label: '11px',
                value: 11
            },
            {
                label: '12px',
                value: 12
            },
            {
                label: '13px',
                value: 13
            },
            {
                label: '14px',
                value: 14
            },
            {
                label: '15px',
                value: 15
            },
            {
                label: '16px',
                value: 16
            },
            {
                label: '17px',
                value: 17
            },
            {
                label: '18px',
                value: 18
            },
            {
                label: '19px',
                value: 19
            },
            {
                label: '20px',
                value: 20
            },
            {
                label: '21px',
                value: 21
            },
            {
                label: '22px',
                value: 22
            },
            {
                label: '23px',
                value: 23
            },
            {
                label: '24px',
                value: 24
            },
            {
                label: '25px',
                value: 25
            },
            {
                label: '26px',
                value: 26
            },
            {
                label: '27px',
                value: 27
            },
            {
                label: '28px',
                value: 28
            },
            {
                label: '29px',
                value: 29
            },
            {
                label: '30px',
                value: 30
            }
        ]
    }, {
        label: '字体类型',
        name: 'text2Family',
        inputtype: 'select',
        type: 'string',
        item: [ // 12
            {
                label: '微软雅黑',
                value: '微软雅黑'
            },
            {
                label: '宋体',
                value: '宋体'
            }
        ]
    }, {
        label: '字体颜色',
        name: 'text2Color',
        inputtype: 'input',
        type: 'string', // 13
        color: "color"
    }],
    //节点属性显示配置
    'nodeAttributeConfig': {
        FACILITY_BAV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_GAV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_GLV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_THV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_FM: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_FA: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_BUV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_CHV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_NV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_SV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_PSV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_FV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],//
        FACILITY_FXC: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_ZS: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_EV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_ELV: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_FC: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],     // 流量调节阀
        FACILITY_E: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],     // 换热器
        FACILITY_FEBO: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],  // 8字盲板(开启)
        FACILITY_FEBC: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],   // 8字盲板(关闭)
        FACILITY_M: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],     // 汇管
        FACILITY_PL: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],     // 清球发射器
        FACILITY_EU: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],    // U形换热器
        FACILITY_F: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],    // 卧式过滤器
        FACILITY_IJ: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],    // 绝缘接头
        FACILITY_FST: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],    // 放散塔
        FACILITY_SHAPE1: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE2: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE3: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE4: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE53: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE54: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE55: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE56: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE57: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE58: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE59: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE60: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE61: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE62: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE72: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE73: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_SHAPE74: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],


        FACILITY_CYAN_MARK: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],  //
        FACILITY_RED_MARK: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_LEFT_MARK1: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_LEFT_MARK2: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_RIGHT_MARK1: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_RIGHT_MARK2: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_MARK: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_TRIANGLE_MARK: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10], //
        FACILITY_GROUND: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_TRIANGLE: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW1: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW2: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW63: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW64: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW65: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW66: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW67: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW68: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW69: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW70: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW71: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],
        FACILITY_ARROW75: [8, 3, 0, 1, 2, 4, 11, 12, 13, 10],

        FACILITY_CREATETEXT: [0, 1, 2, 3],  // 文字工具创建图形

        LINE_BLACK_BOLD: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],//  粗黑线
        LINE_BLACK: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],//  细灰线
        LINE_RED: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],//  红线
        LINE_BLUE: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],//  蓝线
        LINE_CYAN: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],//  浅绿线
        LINE_YELLOW: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],//  浅绿线
        LINE_PINK_DASHED: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],// 粉色虚线
        LINE_ANODECABLE: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],// 阳极电缆
        LINE_CATHODECABLE: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],// 阴极电缆
        LINE_WIRE: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],// 跨接电缆
        LINE_CONNECTIONLINE: [3, 5, 9, 6, 0, 1, 2, 7, 11, 12, 13],// 连接线

        FACILITY_CABLECONNECTION: [],// 连接点
        FACILITY_PIPECABLECONNECTION: [],// 管道连接点
    }
}

/**
 * @desc 复制元件
 */
function copyShape() {
    pageMeta.copylist.beforeZoom = pageMeta.getZoomVal();
    pageMeta.copylist.beforex = pageMeta.start_x;
    pageMeta.copylist.beforey = pageMeta.start_y;
    pageMeta.copylist.before = pageMeta.selectedShapeList;
    if (pageMeta.copylist.beforex != 0 && pageMeta.copylist.beforey != 0 && pageMeta.copylist.before.length > 0) {
        newDisplay("复制成功");
    }
}

function newDisplay(text) {
    $("#infoAlert").text(text).show(0)
    setTimeout(function () {
        $("#infoAlert").hide()
    }, 1000)
}

/**
 * @desc 元件复制粘贴
 */
function pasteShape() {
    if (pageMeta.copylist.before.length) {
        var uuid = Tools.getUUID();
        var zoom = pageMeta.getZoomVal();
        var i = 0;
        temlen = pageMeta.copylist.before.length;
        var list = [];
        var czx = pageMeta.copylist.afterx / zoom - pageMeta.copylist.beforex;
        var czy = pageMeta.copylist.aftery / zoom - pageMeta.copylist.beforey;
        for (; i < temlen; i++) {
            var a = pageMeta.copylist.before[i].getAttribute();
            a.id = a.id + uuid;
            if (a.lineList != undefined) {
                var j = 0;
                for (; j < a.lineList.length; j++) {
                    a.lineList[j] = a.lineList[j] + uuid;
                }
            }
            if (a.beginShape != undefined) {
                a.beginShape = a.beginShape + uuid;
            }
            if (a.endShape != undefined) {
                a.endShape = a.endShape + uuid;
            }
            if (a.direction != undefined) {
                var newDirection = {};
                for (var key in a.direction) {
                    var newkey = key + uuid;
                    newDirection[newkey] = a.direction[key];
                }
                a.direction = newDirection;
            }
            if (a.shapeList != undefined) {
                for (var v = 0; v < a.shapeList.length; v++) {
                    a.shapeList[v].shape = a.shapeList[v].shape + uuid;
                    a.shapeList[v].x = Number(a.shapeList[v].x) + czx;
                    a.shapeList[v].y = Number(a.shapeList[v].y) + czy;
                }
            }

            function addx(x) {
                return (x + czx);
            }

            function addy(y) {
                return (y + czy);
            }

            a.bx = addx(a.bx);
            a.by = addy(a.by);
            a.cx = addx(a.cx);
            a.cy = addy(a.cy);
            a.ex = addx(a.ex);
            a.ey = addy(a.ey);
            a.x = addx(a.x)
            a.y = addy(a.y);
            list.push(a);
        }
        pageMeta.copylist.after = list;
        pageMeta.dataCaching.obj = pageMeta.copylist.after;
        pageMeta.dataCaching.num = 0;
        pageMeta.dataCaching.ID = dataCaching();
        saveView();
    }
}


/**
 * @desc 设置选区内元件的属性
 */
function setSelectShapeAttr(oldShape) {
    var realtext = "";  // 图例真实显示的名称
    var realtext2 = "";
    var textInput = pageMeta.textInput;
    var selectList = pageMeta.selectedShapeList
    for (var i = 0; i < selectList.length; i++) {
        var attrList = attributeList[selectList[i].facilityType];
        for (var j = 0; j < attrList.length; j++) {
            var input = textInput[attrList[j]];
            selectList[i][input.name] = oldShape.text;
        }
        //线条显示 长度*管径
        if (selectList[i].facilityType == 'LINE_BLACK_BOLD' ||
            selectList[i].facilityType == 'LINE_BLACK' ||
            selectList[i].facilityType == 'LINE_RED' ||
            selectList[i].facilityType == 'LINE_BLUE' ||
            selectList[i].facilityType == 'LINE_CYAN' ||
            selectList[i].facilityType == 'LINE_YELLOW' ||

            selectList[i].facilityType == 'LINE_PINK_DASHED' ||
            selectList[i].facilityType == 'LINE_ANODECABLE' ||
            selectList[i].facilityType == 'LINE_CATHODECABLE' ||
            selectList[i].facilityType == 'LINE_WIRE' ||
            selectList[i].facilityType == 'LINE_CONNECTIONLINE') {

            //站内的管道不显示 长度和管径
            if (!isNull(oldShape.diameter) && !isNull(oldShape.length)) {
                realtext = oldShape.length + "km";
                realtext2 = oldShape.diameter + "mm"
            } else if (isNull(oldShape.diameter) && isNull(oldShape.length)) {
                realtext = "";
                realtext2 = "";
            } else if (isNull(oldShape.length)) {
                realtext = "";
                realtext2 = oldShape.diameter + "mm";
            } else {
                realtext2 = "";
                realtext = oldShape.length + "km";
            }

        } else if (selectList[i].facilityType == 'FACILITY_CREATETEXT') {
            realtext = oldShape.text
        } else {  //基本元件显示 名字和位号
            realtext = oldShape.text;
            realtext2 = ldShape.bitNumber;
        }
        selectList[i]['realtext'] = realtext;
        selectList[i]['realtext2'] = realtext2;
        selectList[i].moveTo();
        saveView();
    }
}


/**
 * @desc 属性窗口显隐
 */
function isAttrShow() {
    if ($('#attributepanel').css('display') == 'none') {
        $('#attributepanel').show();
    } else {
        $('#attributepanel').hide();
    }
}


/**
 * @desc  删除数组中指定下标的元素
 * @param {Array} arr  数组
 * @param {number} n  下标
 */
function removeArrayOfN(arr, n) {
    if (n > arr.length - 1 || n < 0) {
        alert('没有找到下标为' + n + '的元素！');
        return;
    }//如果n大于或小于指定数组的长度则返回

    var arr1 = [];
    for (var i = 0; i < arr.length; i++) {
        if (i == n) {
            continue
        }//如果删除的为第i个元素，跳出当前循环
        arr1.push(arr[i]);//把下标不为n的元素添加到arr1
    }
    arr.length = 0;//将arr的长度设为零

    for (var i = 0; i < arr1.length; i++) {
        arr[i] = arr1[i]//重新给arr赋值
    }
    return arr;//返回传进的数组
}


/**
 * @desc  判断是否非空
 * @param {String} param
 */
function isNull(param) {
    if (param == "" || param == null || param == undefined) {
        return true;
    } else {
        return false;
    }
}


/**
 * @desc  获取左侧菜单栏展开区域的高度
 * @param
 */
function getOpenHeight() {
    $("#accordion").height($(window).height() - $("#headerTools").outerHeight());
    var lis = $(".accordion>li").length,
        lisH = $(".accordion>li>.link").outerHeight(),
        openH = $("#accordion").height() - lis * lisH;
    $("#accordion .submenu").outerHeight(openH + "px");
}


/**
 * @desc  通过滚轮放大缩小画图面板
 * @param
 */
function changeHolderSize(i) {
    var zoom = parseInt(i.style.zoom, 10) || 100;
    zoom += event.wheelDelta / 12;
    if (zoom > 0) {
        i.style.zoom = zoom + '%';
        $("#zoom").val(zoom);
        $("#viewpanel").width($("#holder").width() / zoom);
        $("#viewpanel").height($("#holder").height() / zoom);
    }
    return false;
}

// 通过滚轮放大缩小画图面板  可手动输入百分比
// function changeHolderSize(i){
//     var zoomVal = parseInt($("#zoom").val());
//     var zoom = parseInt(i.style.zoom,10)|| zoomVal;
//     var wheel = event.wheelDelta;
//     if(isNull(wheel)){
//         if(zoomVal > zoomOld){
//             wheel = 120
//         }else{
//             wheel = -120
//         }
//     }
// 	zoom += wheel / 12;
// 	if(zoom > 0 ){
//         i.style.zoom=zoom+'%';
//         $("#zoom").val(zoom);
//     }
// 	return false;
// }

/**
 * @ ls 20170911
 * @ 增加放大缩小拖放功能
 */
function createEnlarge(image) {

    if (pageMeta.isOpennarrow) {
        pageMeta.isOpennarrow = false;
        $("#narrow")[0].src = "icon/narrow_01.png";
    }
    if (pageMeta.isOpenDragBg) {
        pageMeta.isOpenDragBg = false;
        $("#DragBg")[0].src = "icon/DragBg_01.png";
    }
    pageMeta.isOpenEnlarge = !pageMeta.isOpenEnlarge;
    if (pageMeta.isOpenEnlarge) {
        image.src = 'icon/enlarge_03.png';
    } else {
        image.src = 'icon/enlarge_01.png';
    }
}

function createNarrow(image) {
    if (pageMeta.isOpenEnlarge) {
        pageMeta.isOpenEnlarge = false;
        $("#enlarge")[0].src = "icon/enlarge_01.png";
    }
    if (pageMeta.isOpenDragBg) {
        pageMeta.isOpenDragBg = false;
        $("#DragBg")[0].src = "icon/DragBg_01.png";
    }
    pageMeta.isOpennarrow = !pageMeta.isOpennarrow;
    if (pageMeta.isOpennarrow) {
        image.src = 'icon/narrow_03.png';
    } else {
        image.src = 'icon/narrow_01.png';
    }
}

function createDragBg(image) {
    if (pageMeta.isOpenEnlarge) {
        pageMeta.isOpenEnlarge = false;
        $("#enlarge")[0].src = "icon/enlarge_01.png";
    }
    if (pageMeta.isOpennarrow) {
        pageMeta.isOpennarrow = false;
        $("#narrow")[0].src = "icon/narrow_01.png";
    }
    pageMeta.isOpenDragBg = !pageMeta.isOpenDragBg;
    if (pageMeta.isOpenDragBg) {
        image.src = 'icon/DragBg_03.png';
        $("#holder>svg").css("cursor", "pointer");
    } else {
        image.src = 'icon/DragBg_01.png';
        $("#holder>svg").css("cursor", "");
    }
}

function imageStateMouseDown(image) {
    $("#overallsituation")[0].src = "icon/overallsituation_03.svg";
}

function imageStateMouseUp(image) {
    $("#overallsituation")[0].src = "icon/overallsituation_02.svg";
}

function createOverallSituation() {
    $("#holder").css("zoom", "20%");
    $("#zoom").val("20");
    $(document).scrollLeft($(window).width() / 5);
    $(document).scrollTop($(window).height() / 3);
}

/***********************/
/**
 *  @ ls 20170917
 *  @ 增加修改直线折线修改
 */
function lineTypeChange(type) {
    switch (type) {
        case "BrokenLine":
            //折线
            pageMeta.lineType = "BrokenLine";
            $(".btnBrokenLine").removeClass("btnMouseUp").addClass("btnMouseDown");
            $(".btnStraightLine").removeClass("btnMouseDown").addClass("btnMouseUp");
            break;
        case "StraightLine":
            //直线
            pageMeta.lineType = "StraightLine";
            $(".btnBrokenLine").removeClass("btnMouseDown").addClass("btnMouseUp");
            $(".btnStraightLine").removeClass("btnMouseUp").addClass("btnMouseDown");
            break;
    }
}

// 框选图元筛选表格
function locationShapInfo(shapes) {
    var objlist = [];
    for (var i = 0; i < shapes.length; i++) {
        var obj = {}
        if (shapes[i].geometryType == "GEOMETRY_POLYGON") {
            //设备ID
            //shapes[i].ID
            obj.ID = shapes[i].ID == undefined ? "" : shapes[i].ID
            //设备位号
            //shapes[i].bitNumber
            obj.bitNumber = shapes[i].bitNumber == undefined ? "" : shapes[i].bitNumber

        } else if (shapes[i].geometryType == "GEOMETRY_POLYLINE") {
            //线径
            //shapes[i].diameter
            obj.diameter = shapes[i].diameter == undefined ? "" : shapes[i].diameter
            //长度
            //shapes[i].length
            obj.length = shapes[i].length == undefined ? "" : shapes[i].length
        }

        obj.text = shapes[i].text == undefined ? "" : shapes[i].text
        //设备名称
        //shapes[i].text
        objlist.push(obj);
    }
    if (objlist.length) {
        /**************************************/
        var deviceLocationNos = "";
        for (var i = 0; i < objlist.length; i++) {
            deviceLocationNos += (objlist[i].bitNumber + ",");
        }
        if (deviceLocationNos.length > 0){
            deviceLocationNos = deviceLocationNos.substr(0, deviceLocationNos.length - 1);
        }
        var query = {};
        if (deviceLocationNos) {
            query.deviceLocationNo = deviceLocationNos.toString();
        }
        $.extend(window.parent.deviceBaseTableQuery, query);
        $.extend(window.parent.deviceRepairTableQuery, query);
        // 获取父页面对象
        window.parent.$("#device-base-table").bootstrapTable('refresh', {silent: true});
        window.parent.$("#device-repair-table").bootstrapTable('refresh', {silent: true});
    }
    pageMeta.locationShapInfo.arr = [];
}

/**
 *  @ ls 20170918
 *  @ 控制文字层隐藏
 */
function textHiddenSwitch(th) {
    var name = th.previousElementSibling.value;
    var text1 = $(pageMeta.selectedBean.textShape[0]).text();
    var text2 = $(pageMeta.selectedBean.textShape2[0]).text();
    if (pageMeta.selectedBean.geometryType == "GEOMETRY_POLYLINE") {
        var regkm = /km/ig;
        var regmm = /mm/ig;
        if (text1.search(name) > -1) {
            if (text1.search(regkm) > -1) {
                text1 = text1.split(regkm)[0];
            } else if (text1.search(regmm) > 0) {
                text1 = text1.split(regmm)[0];
            }
        }
        if (text2.search(name) > -1) {
            if (text2.search(regkm) > -1) {
                text2 = text2.split(regkm)[0];
            } else if (text2.search(regmm) > 0) {
                text2 = text2.split(regmm)[0];
            }
        }
    }
    if (th.value == "隐藏") {
        th.value = "显示"
        if (name == text1) {
            pageMeta.selectedBean.textShape.hide();
            pageMeta.selectedBean.realtextSandH = "hide";
        } else if (name == text2) {
            pageMeta.selectedBean.textShape2.hide();
            pageMeta.selectedBean.realtext2SandH = "hide";
        }
    } else {
        th.value = "隐藏"
        if (name == text1) {
            pageMeta.selectedBean.textShape.show();
            pageMeta.selectedBean.realtextSandH = "show";
        } else if (name == text2) {
            pageMeta.selectedBean.textShape2.show();
            pageMeta.selectedBean.realtext2SandH = "show";
        }
    }
    saveView();
}

function showEdit(type) {
    if (type) {
        //编辑模式
        $("#attributepanel").css("display", "show");
        //隐藏工具栏
        $("#shapepanel").show();
        visitPanel();
        //隐藏属性栏
        $(".editShow").show();
        pageMeta.Editmode = true;
        for (var a in imageMeta) {
            if (a.length == 2) {
                var image = $('#image' + a);
                var td = $('#td' + a);
                td.attr('url', imageMeta[a].url);
                td.attr('warningurl', imageMeta[a].warningurl);
                image.attr('src', imageMeta[a].url);
            }
        }
        $(".bianjitoggle").addClass("HIDE");
        $(".fabutoggle").removeClass("HIDE");
    } else {
        //预览模式
        $("#attributepanel").css("display", "none");
        visitPanel();
        //隐藏工具栏
        $("#shapepanel").hide();
        //隐藏属性栏
        $(".editShow").hide();
        pageMeta.Editmode = false;
        $(".fabutoggle").addClass("HIDE");
        $(".bianjitoggle").removeClass("HIDE");
    }
}

//传入位号参数，定位当前元件
function ComponentLocation(id) {
    if (id == "") {
        clearTimeout(pageMeta.CLN.type)
        if (pageMeta.CLN.type != null) {
            pageMeta.dataCaching.Twinkle(false);
            pageMeta.CLN.type = null;
        }
    } else {
        var flag = false;
        if (pageMeta.CLN.id != id) {
            flag = true;
            pageMeta.CLN.id = id;
        }
        if (pageMeta.CLN.type != null && pageMeta.CLN.image != "shape") {
            pageMeta.CLN.type = setTimeout(function () {
                ComponentLocation(id)
            }, 500)
        }
        clearTimeout(pageMeta.CLN.type)
        var comLen = pageMeta.dataCaching.ComponentLocation.length;
        for (var i = 0; i < comLen; i++) {
            if (pageMeta.dataCaching.ComponentLocation[i].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[i].realtext == id) {
                if (flag) {
                    resizeZoom();
                    var ix = pageMeta.dataCaching.ComponentLocation[i].x;
                    var iy = pageMeta.dataCaching.ComponentLocation[i].y;
                    $(document).scrollLeft(ix - $(window).width() / 2);
                    $(document).scrollTop(iy - $(window).height() / 3);
                }
                var a = 0;
                for (var j = 0; j < pageMeta.TwinkleS.length; j++) {
                    if (id == pageMeta.TwinkleS[j].bitNumber) {
                        if (pageMeta.TwinkleS[j].timer) {
                            window.clearInterval(pageMeta.TwinkleS[j].timer)
                            pageMeta.TwinkleS[j].timer = 0;
                        }
                    }
                }
                pageMeta.dataCaching.Twinkle = pageMeta.dataCaching.ComponentLocation[i].Twinkle;
                pageMeta.dataCaching.ComponentLocation[i].Twinkle(true)
            }
        }
        pageMeta.CLN.type = setTimeout(function () {
            ComponentLocation(id)
        }, 500)
    }
}


//区域定位
function RegionalPositioning(NUMS) {
    var comLen = pageMeta.dataCaching.ComponentLocation.length;
    var obj = {"maxX": 0, "maxY": 0, "minX": 0, "minY": 0}
    for (var j = 0; j < NUMS.length; j++) {
        for (var i = 0; i < comLen; i++) {
            if (pageMeta.dataCaching.ComponentLocation[i].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[i].realtext == NUMS[j]) {
                obj.minX == 0 ? obj.minX = pageMeta.dataCaching.ComponentLocation[i].x : obj.minX = obj.minX;
                obj.minY == 0 ? obj.minY = pageMeta.dataCaching.ComponentLocation[i].y : obj.minY = obj.minY;
                pageMeta.dataCaching.ComponentLocation[i].x > obj.maxX ? obj.maxX = pageMeta.dataCaching.ComponentLocation[i].x : obj.maxX = obj.maxX;
                pageMeta.dataCaching.ComponentLocation[i].x < obj.minX ? obj.minX = pageMeta.dataCaching.ComponentLocation[i].x : obj.minX = obj.minX;
                pageMeta.dataCaching.ComponentLocation[i].y > obj.maxY ? obj.maxY = pageMeta.dataCaching.ComponentLocation[i].y : obj.maxY = obj.maxY;
                pageMeta.dataCaching.ComponentLocation[i].y < obj.minY ? obj.minY = pageMeta.dataCaching.ComponentLocation[i].y : obj.minY = obj.minY;

            }
            resizeZoom(100)
            $(document).scrollLeft(obj.maxX - (obj.maxX - obj.minX));
            $(document).scrollTop(obj.maxY - (obj.maxY - obj.minY));
        }
    }

    //resizeZoom();
    // var ix = pageMeta.dataCaching.ComponentLocation[i].x;
    // var iy = pageMeta.dataCaching.ComponentLocation[i].y;

}

// 输出元件信息
function outPutShapInfo(shapes) {
    if (shapes) {
        /**************************************/
        // 点击弹出窗代码
        // 根据设备位号和场站名称查询设备信息
        var url = rootPath + 'deviceCard/getDeviceByDeviceLocationNoAndStation.do?';
        var installstation = sessionStorage.getItem("stationName");
        var data = {deviceLocationNo: shapes, installStation: installstation};
        $.ajax({
            url: url,
            type: "POST",
            cache: false,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8', // contentType很重要
            success: function (res) {
                if (res.code === "success") {
                    baseShow(res.data + "_view", '设备信息详情', rootPath + 'system/device/devicecard/device_card_view.html?oid=' + res.data, 1000, 650);
                }
            }, error: function (data) {
                //console.log(data);
            }
        });
    }
}

//日期选择
function initDateTimePicker() {
    $("#startDate,#endDate").datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',
        autoclose: true,
        // minView: 'month',
        minuteStep: 5,
        todayHighlight: true
    })
}

/**
 * 高级查询
 * */
function superiorQuery() {
    var pageUrl = window.location.pathname;
    if (pageUrl == "/sim/jasframework/pipeline/index.html") {
        pageUrl = "/sim/system/device/devicecard/device_card_index.html";
    }
    var url = 'jasframework/querycolumn/query_panel.html?pageUrl=' + pageUrl + "&pageId=98";
    baseDialog("homepagePid", "统一查询", url, 700, 550, ['查询(Q)', '取消(C)'], ['search()']);
}

/**
 * pid图iframe中根据设备位号和设备编号查询
 */
function specifiedQuery() {
	debugger;
	if(deviceBaseTableQuery==null){
       var deviceBaseTableQuery = {};//基础信息表格查询条件对象
	}
	if(deviceRepairTableQuery==null){
    var deviceRepairTableQuery = {};//设备维修查询条件对象
	}
    var deviceNo = $("#searchValueOfDeviceNo").val();
    var deviceLocationNoQuery = $("#searchValueOfDeviceLocationNo").val();
    deviceBaseTableQuery.deviceNo = "";
    deviceBaseTableQuery.deviceLocationNoQuery = "";
    deviceRepairTableQuery.assetNumberQuery = "";
    deviceRepairTableQuery.deviceLocationNoQuery = "";
    deviceBaseTableQuery.commonQueryCondition = "";
    if (deviceNo) {
        deviceBaseTableQuery.deviceNo = deviceNo;
        deviceRepairTableQuery.assetNumberQuery = deviceNo;
    } else if (deviceLocationNoQuery) {
        deviceBaseTableQuery.deviceLocationNoQuery = deviceLocationNoQuery;
        deviceRepairTableQuery.deviceLocationNoQuery = deviceLocationNoQuery;
    }
    $.extend(window.parent.deviceBaseTableQuery, deviceBaseTableQuery);
    $.extend(window.parent.deviceRepairTableQuery, deviceRepairTableQuery);
    window.parent.$("#device-base-table").bootstrapTable('refresh', {silent: true});
    window.parent.$("#device-repair-table").bootstrapTable('refresh', {silent: true});
}

/**
 * pid图iframe中根据设备位号和设备编号查询
 */
function repairQuery() {
	debugger;
	if(deviceRepairTableQuery==null){
	   var deviceRepairTableQuery = {};//设备维修查询条件对象
	}
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();
    deviceRepairTableQuery.startDate = startDate;
    deviceRepairTableQuery.endDate = endDate;
    $.extend(window.parent.deviceRepairTableQuery, deviceRepairTableQuery);
    window.parent.$("#device-repair-table").bootstrapTable('refresh', {silent: true, query: deviceRepairTableQuery});
    window.parent.$('#device-info-table a[href="#device-repair-info"]').tab('show');
}

// /**
//  * @调用此方法，显示关闭阀门
//  * @param {*数组位号，将处于关闭的阀门的位号用数组的形式作为参数掺入} NUMS
//  */
// function ClosingValve(NUMS) {
//     var pdclen = pageMeta.dataCaching.ComponentLocation.length
//     for (var i = 0; i < NUMS.length; i++) {
//         for (var j = 0; j < pdclen; j++) {
//             if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[j].realtext == NUMS[i]) {
//                 pageMeta.dataCaching.ComponentLocation[j].ClosingValve();
//             }
//         }
//     }
// }
//
// function MainAndAuxiliarySwitching(NUMS) {
//     var pdclen = pageMeta.dataCaching.ComponentLocation.length
//     for (var i = 0; i < NUMS.length; i++) {
//         for (var j = 0; j < pdclen; j++) {
//             if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[j].realtext == NUMS[i]) {
//                 pageMeta.dataCaching.ComponentLocation[j].MainAndAuxiliarySwitching();
//             }
//         }
//     }
// }
//
// function ItShouldOpenButClose(NUMS) {
//     var pdclen = pageMeta.dataCaching.ComponentLocation.length
//     for (var i = 0; i < NUMS.length; i++) {
//         for (var j = 0; j < pdclen; j++) {
//             if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[j].realtext == NUMS[i]) {
//                 setInterval(pageMeta.dataCaching.ComponentLocation[j].ItShouldOpenButClose, 1000)
//             }
//         }
//     }
// }
//
// function ShouldBeClosedButOpen(NUMS) {
//     var pdclen = pageMeta.dataCaching.ComponentLocation.length
//     for (var i = 0; i < NUMS.length; i++) {
//         for (var j = 0; j < pdclen; j++) {
//             if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[j].realtext == NUMS[i]) {
//                 setInterval(pageMeta.dataCaching.ComponentLocation[j].ShouldBeClosedButOpen, 1000)
//             }
//         }
//     }
// }

function getTwinkle(obj) {
    if (typeof (obj) == "string") {
        obj = JSON.parse(obj);
    }
    var type = obj.type;
    var list = obj.list;
    switch (type) {
        case "MainAndSideRoads":
            pageMeta.MainAndSideRoads = list;
            break;
        case "ItShouldOpenButClose":
            pageMeta.ItShouldOpenButClose = list;
            break;
        case "ShouldBeClosedButOpen":
            pageMeta.ShouldBeClosedButOpen = list;
            break;
        case "ValveClosing":
            pageMeta.ValveClosing = list;
            break;
    }

}


function loadTwinkle() {
    for (var i = 0; i < pageMeta.ItShouldOpenButClose.length; i++) {
        pageMeta.TwinkleS.push({
            "type": "ItShouldOpenButClose",
            "timer": 0,
            "bitNumber": pageMeta.ItShouldOpenButClose[i],
            "node": null,
        })
    }
    for (var i = 0; i < pageMeta.ShouldBeClosedButOpen.length; i++) {
        pageMeta.TwinkleS.push({
            "type": "ShouldBeClosedButOpen",
            "timer": 0,
            "bitNumber": pageMeta.ShouldBeClosedButOpen[i],
            "node": null,
        })
    }
    for (var i = 0; i < pageMeta.ValveClosing.length; i++) {
        pageMeta.TwinkleS.push({
            "type": "ValveClosing",
            "timer": 0,
            "bitNumber": pageMeta.ValveClosing[i],
            "node": null,
        })
    }
    ShowTwinkleS();
}


function ShowTwinkleS() {
    var pdclen = pageMeta.dataCaching.ComponentLocation.length
    var TWlen = pageMeta.TwinkleS.length;
    for (var i = 0; i < TWlen; i++) {
        for (var j = 0; j < pdclen; j++) {
            if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[j].realtext == pageMeta.TwinkleS[i].bitNumber) {
                // if (pageMeta.TwinkleS[i].type == "MainAndSideRoads") {
                //     //执行主路状态显示
                //     pageMeta.TwinkleS[i].timer = 0
                //     pageMeta.dataCaching.ComponentLocation[j].MainAndAuxiliarySwitching();
                //     pageMeta.TwinkleS[i].node = pageMeta.dataCaching.ComponentLocation[j];
                // } else
                if (pageMeta.TwinkleS[i].type == "ValveClosing") {
                    //阀门关闭状态
                    pageMeta.TwinkleS[i].timer = 0
                    pageMeta.dataCaching.ComponentLocation[j].ClosingValve();
                    pageMeta.TwinkleS[i].node = pageMeta.dataCaching.ComponentLocation[j];
                }
            }
        }
    }
    bulb();
}

function AbnormalAlarm() {
    if (pageMeta.loadIsOver) {
        pageMeta.AbnormalAlarm = !pageMeta.AbnormalAlarm;
        if (pageMeta.AbnormalAlarm) {
            $("#abnormalBut").css("background", "red");
        } else {
            $("#abnormalBut").css("background", "#ebebeb")
        }
        var pdclen = pageMeta.dataCaching.ComponentLocation.length
        var TWlen = pageMeta.TwinkleS.length;
        if (pageMeta.AbnormalAlarm) {
            for (var i = 0; i < TWlen; i++) {
                for (var j = 0; j < pdclen; j++) {
                    if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[j].realtext == pageMeta.TwinkleS[i].bitNumber) {
                        if (pageMeta.TwinkleS[i].type == "ItShouldOpenButClose") {
                            pageMeta.TwinkleS[i].timer = setInterval(pageMeta.dataCaching.ComponentLocation[j].ItShouldOpenButClose, 1000)
                            pageMeta.TwinkleS[i].node = pageMeta.dataCaching.ComponentLocation[j];
                        } else if (pageMeta.TwinkleS[i].type == "ShouldBeClosedButOpen") {
                            //应关闭但打开的
                            pageMeta.TwinkleS[i].timer = setInterval(pageMeta.dataCaching.ComponentLocation[j].ShouldBeClosedButOpen, 1000)
                            pageMeta.TwinkleS[i].node = pageMeta.dataCaching.ComponentLocation[j];
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < TWlen; i++) {
                for (var j = 0; j < pdclen; j++) {
                    if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON" && pageMeta.dataCaching.ComponentLocation[j].realtext == pageMeta.TwinkleS[i].bitNumber) {
                        if (pageMeta.TwinkleS[i].type == "ItShouldOpenButClose") {
                            //应打开但关闭的
                            clearInterval(pageMeta.TwinkleS[i].timer)
                            pageMeta.dataCaching.ComponentLocation[j].closeItShouldOpenButClose();
                        } else if (pageMeta.TwinkleS[i].type == "ShouldBeClosedButOpen") {
                            //应关闭但打开的
                            clearInterval(pageMeta.TwinkleS[i].timer)
                            pageMeta.dataCaching.ComponentLocation[j].closeShouldBeClosedButOpen();
                        }
                    }
                }
            }
        }

    } else {
        //alert("加载中，请稍后在操作。。。")
    }

}


function ComponentLocations(NUMS, flag) {
    if (pageMeta.loadIsOver) {
        CancelBlink();
        //下一次查询时，清空上一次查询的状态。
        if (pageMeta.AbnormalAlarm === true) {
            alert("请关闭异常状态展示")
        } else {
            var comLen = pageMeta.dataCaching.ComponentLocation.length;
            for (var i = 0; i < NUMS.length; i++) {
                for (var j = 0; j < comLen; j++) {
                    if (pageMeta.dataCaching.ComponentLocation[j].geometryType == "GEOMETRY_POLYGON"
                        && (pageMeta.dataCaching.ComponentLocation[j].realtext == NUMS[i] || pageMeta.dataCaching.ComponentLocation[j].bitNumber == NUMS[i])
                        && pageMeta.dataCaching.ComponentLocation[j].facilityType != "FACILITY_CREATETEXT"
                    ) {
                        viewAll()
                        if (NUMS.length == 1) {
                            resizeZoom();
                            var ix = pageMeta.dataCaching.ComponentLocation[j].x;
                            var iy = pageMeta.dataCaching.ComponentLocation[j].y;
                            $(document).scrollLeft(ix - $(window).width() / 2);
                            $(document).scrollTop(iy - $(window).height() / 3);
                        } else {
                            viewAll()
                        }
                        var CL = {"timer": null, "bit": null};
                        CL.bit = pageMeta.dataCaching.ComponentLocation[j];
                        CL.timer = setInterval(pageMeta.dataCaching.ComponentLocation[j].Twinkle, 1000);
                        pageMeta.CancelBlink.push(CL);
                    }
                }
            }
        }
    } else {
        //alert("加载中，请稍后在操作。。。")
    }
}

function CancelBlink() {
    //清空
    if (pageMeta.loadIsOver) {
        for (var i = 0; i < pageMeta.CancelBlink.length; i++) {
            clearInterval(pageMeta.CancelBlink[i].timer);
            pageMeta.CancelBlink[i].bit.closeTwinkle();
        }
        pageMeta.CancelBlink = [];
    } else {
        //alert("加载中，请稍后在操作。。。")
    }
}

function doneadd() {
    var url = 'system/workflow/workflow_done_add.html';
    baseDialog(uuid(8), "新增工单信息", url, 900, 500, ['发起', '取消'], ['saveData()']);
}

function process_change() {
    var url = 'system/device/processchange/process_change_add_edit.html';
    baseDialog(uuid(8), "阀门开关", url, 900, 500, ['发起', '取消'], ['saveData()']);
}

function technology_record() {
    var url = 'system/technology/technology_record_add.html';
    baseDialog(uuid(8), "工艺转换", url, 900, 500, ['发起', '取消'], ['saveData()']);
}

function technology_recordView(name) {
    var url = 'system/technology/technology_record_view.html?name=' + name;
    baseDialog(uuid(8), "工艺基本详情", url, 900, 500, ['发起', '取消'], ['saveData()']);
}

function showmore() {
    if ($(".more").css("display") == "none") {
        $(".more").css("display", "block")
    } else {
        $(".more").css("display", "none")
    }
}

function bulb() {
    var comLen = pageMeta.dataCaching.ComponentLocation.length;
    for (var j = 0; j < comLen; j++) {
        for (var i = 0; i < pageMeta.bulb.length; i++) {
            if (pageMeta.dataCaching.ComponentLocation[j].facilityType == "FACILITY_ARROW75") {
                if (pageMeta.bulb[i] == "调压一路" || pageMeta.bulb[i] == "调压二路" || pageMeta.bulb[i] == "调压三路" || pageMeta.bulb[i] == "次高/中一路" || pageMeta.bulb[i] == "次高/中二路") {
                    pageMeta.dataCaching.ComponentLocation[j].bulb();
                }
                if (pageMeta.dataCaching.ComponentLocation[j].realtext == pageMeta.bulb[i]) {
                    pageMeta.dataCaching.ComponentLocation[j].bulb();
                    if (pageMeta.bulb[i] == "过滤计量一路") {
                        pageMeta.dataCaching.ComponentLocation[j].bulb();
                    }
                }
            }

        }
    }
}
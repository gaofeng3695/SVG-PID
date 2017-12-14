//*******************************************************************************************************************************************
/*
 ** 作者 ：Modified by GF on 2017.11.28
 ** 模块 ：ShapeConfig GeometryBean  ShapeBean PolyLineBean CurveLineBean TextBean  HistoryBean
 ** 依赖 ：无
 ** 入参 ：无
 */


(function () {
    // 基本图形配置
    ShapeConfig = {
        SHAPE_RECT: 'SHAPE_RECT',
        SHAPE_ELLIPSE: 'SHAPE_ELLIPSE',
        SHAPE_IMAGE: 'SHAPE_IMAGE',

        GEOMETRY_POLYGON: 'GEOMETRY_POLYGON', // 多边形
        GEOMETRY_POLYLINE: 'GEOMETRY_POLYLINE', // 多段线
        GEOMETRY_CURVELINE: 'GEOMETRY_CURVELINE', // 曲线
        GEOMETRY_TEXT: 'GEOMETRY_TEXT', // 字

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
        FACILITY_SOLIDPOINT: 'FACILITY_SOLIDPOINT', //实心连接点
        FACILITY_PIPECABLECONNECTION: 'FACILITY_PIPECABLECONNECTION',
        FACILITY_FONTS: 'FACILITY_FONTS', //文字
        FACILITY_FXC: 'FACILITY_FXC',
        FACILITY_ZS: 'FACILITY_ZS',
        FACILITY_EV: 'FACILITY_EV',
        FACILITY_ELV: 'FACILITY_ELV',


        FACILITY_FC: "FACILITY_FC", // 流量调节阀
        FACILITY_E: "FACILITY_E", // 换热器
        FACILITY_FEBO: "FACILITY_FEBO", // 8字盲板(开启)
        FACILITY_FEBC: "FACILITY_FEBC", // 8字盲板(关闭)
        FACILITY_M: "FACILITY_M", // 汇管
        FACILITY_PL: "FACILITY_PL", // 清球发射器
        FACILITY_EU: "FACILITY_EU", // U形换热器
        FACILITY_F: "FACILITY_F", // 卧式过滤器
        FACILITY_IJ: "FACILITY_IJ", // 绝缘接头
        FACILITY_FST: "FACILITY_FST", // 放散塔
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

        FACILITY_CREATETEXT: "FACILITY_CREATETEXT", // 文字工具


        TEXT_INPUT: "TEXT_INPUT", // 自定义选择区域
        SELECT_AREA: "SELECT_AREA", // 自定义选择区域

        FACILITY_CYAN_MARK: "FACILITY_CYAN_MARK", // 箭头1
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


        LINE_BLACK_BOLD: 'LINE_BLACK_BOLD', // 3PE管道
        LINE_BLACK: 'LINE_BLACK', // 非3PE管道
        LINE_RED: "LINE_RED",
        LINE_BLUE: "LINE_BLUE",
        LINE_CYAN: "LINE_CYAN",
        LINE_YELLOW: "LINE_YELLOW",
        LINE_PINK_DASHED: "LINE_PINK_DASHED",
        LINE_ACTUALBROKENLINE: 'LINE_ACTUALBROKENLINE', // 实折线
        LINE_IMAGINARYFOLDLINE: 'LINE_IMAGINARYFOLDLINE', // 虚折线

        LINE_ANODECABLE: 'LINE_ANODECABLE', // 阳极电缆
        LINE_CATHODECABLE: 'LINE_CATHODECABLE', // 阴极电缆
        LINE_WIRE: 'LINE_WIRE', // 跨接电缆
        LINE_CONNECTIONLINE: 'LINE_CONNECTIONLINE', // 连接线

    };

    //*******************************************************************************************************************************************

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
        this.isTwinkle = false; //是否闪烁，指的是extend2的闪烁
        this.direction = {};
        this.customJoinPoint = []; //自定义连接点
        this.extentBorder = 5;
        this.extent2Border = 2;
        this.bgcolor = 'red'; //extend2的背景色
        this.hasExtent = true;
        this.hasExtent2 = true;
        this.extent = null; //虚线框
        this.extent2 = null; //背景框
        this.isextent2show = false;
        this.selected = false; //控制虚线框的显隐
        this.color = '#000000';
        this.fillColor = '#FFFFFF';
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
        this.raphaelScreen = null;

        this.createShape = function () {};
        this.moveTo = function () {};
        this.disconnect = function () {};
        this.remove = function () {};
        this.setWarning = function (state) {};
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
        this.setMovable = function (bool) {
            this.canMove = bool;
            if (this.bShape) this.bShape.canMove = bool;
            if (this.eShape) this.eShape.canMove = bool;
        };
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
                    this.textRaphael = this.raphael;
                    this.textRaphaelScreen = this.raphaelScreen;
                    this.textShape.mouseover(function (e) {
                        if (_this.overFun) {
                            _this.overFun(_this, e);
                        }
                    });
                    this.textShape.mouseout(function (e) {
                        if (_this.outFun) {
                            _this.outFun(_this, e);
                        }
                    });
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
                    this.textRaphael = this.rephael;

                    this.textShape2.mouseover(function (e) {
                        if (_this.overFun) {
                            _this.overFun(_this, e);
                        }
                    });
                    this.textShape2.mouseout(function (e) {
                        if (_this.outFun) {
                            _this.outFun(_this, e);
                        }
                    });
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
        this.select = function () { //设定图形为选中状态
            if (this.extent) {
                if (this.facilityType != "FACILITY_CREATETEXT") {}
                this.extent.show();
            }
            this.selected = true;
            return this;
        };
        this.unSelect = function () { //设定图形为非选中状态
            if (this.extent) {
                this.extent.hide();
            }
            this.selected = false;
            return this;
        };
        this.reverseSelect = function () { //切换选中状态
            if (this.selected) {
                this.unSelect();
            } else {
                this.select();
            }
            return this;
        };
        this.setExtent = function () { //设定图形的背景范围，就是那个小红框
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
                        fill: 'none'

                    });
                    this.extent.toBack();
                }
            }
            return this;
        };
        this.setExtent2 = function () { //设定图形的背景
            if (this.hasExtent2) {
                var box = this.shape.getBBox();
                if (this.extent2) {
                    this.extent2.attr({
                        x: box.x - this.extent2Border,
                        y: box.y - this.extent2Border,
                        width: box.width + this.extent2Border * 2,
                        height: box.height + this.extent2Border * 2,
                        stroke: this.bgcolor,
                        fill: this.bgcolor,
                    });
                } else {
                    this.extent2 = this.raphael.rect(box.x - this.extent2Border, box.y - this.extent2Border, box.width + this.extent2Border * 2, box.height + this.extent2Border * 2, 4);
                    this.extent2.attr({
                        //'stroke-dasharray': ['-'],
                        stroke: this.bgcolor,
                        fill: this.bgcolor,
                    });
                    this.extent2.toBack();
                }
            }
            return this;
        };
        this.showExtent2 = function () {
            this.extent2.show();
            this.isextent2show = true;
        };
        this.hideExtent2 = function () {
            this.extent2.hide();
            this.isextent2show = false;
        };
        this.setTwinkle = function (color, nAllTime, nEachTime) { // 设置闪烁,入参闪烁颜色(默认红色)，闪烁总时长（默认无限），闪烁间隔（默认800毫秒）

            var that = this;

            if (this.timer) {
                clearInterval(this.timer);
            }
            nEachTime = nEachTime ? nEachTime : 800;
            var totalTime = 0;

            if (color) {
                this.bgcolor = color;
                this.setExtent2();
            }
            this.timer = setInterval(function () {

                if (that.isextent2show) {
                    that.extent2.hide();
                    that.isextent2show = false;
                } else {
                    that.extent2.show();
                    that.isextent2show = true;
                }
                totalTime += nEachTime;
                if (nAllTime && totalTime > nAllTime) {
                    that.clearTwinkle();
                }
            }, nEachTime);
            this.isTwinkle = true;
        };
        this.clearTwinkle = function () { //取消闪烁
            if (this.isTwinkle) {
                this.isTwinkle = false;
                if (this.timer) {
                    clearInterval(this.timer);
                }
                this.extent2.hide();
                this.isextent2show = false;
            }
        };
        this.cloneAttribute = function () {
            var obj = JSON.stringify(this.getAttribute());
            return JSON.parse(obj);

        };
        this.getAttribute = function () { //将属性中的引用关系，改为赋值关系
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
            if (obj.direction) {
                attr.direction = obj.direction;
            }
            if (obj.customJoinPoint && obj.customJoinPoint.length > 0) {

                attr.customJoinPoint = obj.customJoinPoint;
            }
            if (obj.dasharray) {
                attr.dasharray = obj.dasharray;
            }
            return attr;
        };
        this.addConnectPoint = function (x, y) {
            if (this.geometryType !== 'GEOMETRY_POLYGON') return;
            var box = this.shape.getBBox();
            this.customJoinPoint.push({
                "dx": (x - box.x) / this.width,
                "dy": (y - box.y) / this.height
            });
        };
        var aConnectPoints = [];
        this.showConnectPoints = function () { //显示连接点
            var that = this;
            if (this.isConnectPointsShow || !(this.shapeType === 'SHAPE_IMAGE' || this.facilityType === 'FACILITY_SOLIDPOINT')) return;
            this.isConnectPointsShow = true;
            var aPoints = this.getDirection(this.shape.getBBox());
            aConnectPoints = aPoints.map(function (item) {
                return that.raphael.circle(item.x, item.y, 2).attr({
                    fill: 'red',
                })
            });

        };
        this.hideConnectPoints = function () { //隐藏连接点
            if (!this.isConnectPointsShow) return;
            this.isConnectPointsShow = false;
            aConnectPoints.forEach(function (shape) {
                shape.remove();
            });
            aConnectPoints = [];
        };
        this.getDirection = function (box) { //获取连接点的坐标,依赖入参的box和customJoinPoint的坐标数组，返回所有连接点数组
            var pointList = [];
            pointList.push({
                x: box.x + box.width / 2,
                y: box.y
            });
            pointList.push({
                x: box.x + box.width,
                y: box.y + box.height / 2
            });
            pointList.push({
                x: box.x + box.width / 2,
                y: box.y + box.height
            });
            pointList.push({
                x: box.x,
                y: box.y + box.height / 2
            });
            //自定义连接点
            if (this.customJoinPoint.length > 0) {
                for (var i = 0; i < this.customJoinPoint.length; i++) {
                    pointList.push({
                        x: box.x + this.customJoinPoint[i].dx * this.width,
                        y: box.y + this.customJoinPoint[i].dy * this.height
                    })
                }
            }
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
            if (_this.canMove) {
                var scale = _this.raphaelScreen.zoom || 　1;
                dx = dx / scale;
                dy = dy / scale;

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
    };

    //*******************************************************************************************************************************************

    // 图形对象
    ShapeBean = function () {
        var _this = this;
        GeometryBean.call(this);
        this.geometryType = ShapeConfig.GEOMETRY_POLYGON; // 多边形
        this.shapeType = ShapeConfig.SHAPE_RECT; // 矩形

        this.lineList = []; //存放连接线的实例

        this.border = 2;
        this.radius = 5;
        this.angle = 0;
        this.textAngle = 0;
        this.textAngle2 = 0;

        this.opacity = 1;
        this.toTop = false;
        this.magnification = 1; //放大倍数
        this.state = null;

        //setState、setShapeSrc、getState 三个函数只针对于图片

        this.setState = function (state) { //设置状态，只针对于图片
            if (this.shape) {
                this.setShapeSrc(state);
                this.state = state;
            }
        };
        this.setShapeSrc = function (state) { //改变图片的src
            if (this.shape) {
                var arr = this.color.split('/');
                var name = arr[arr.length - 1].split('.')[0];
                var newname = name.split('_')[0] + '_' + state;
                this.color = this.color.replace(name, newname);
                this.shape.attr({
                    src: this.color,
                });
            }
        };
        this.getState = function () { //获取图片src里面的state
            var arr = this.color.split('/');
            var name = arr[arr.length - 1].split('.')[0];
            return newname = name.split('_')[1];
        };
        this.createShape = function () { //创建图形
            if (this.raphael) {
                this.angle = this.angle % 360;
                if (this.shapeType == ShapeConfig.SHAPE_RECT) { //
                    this.shape = this.raphael.rect(this.x - getHalfWidth(), this.y - getHalfHeight(), this.width, this.height, this.radius);
                }
                if (this.shapeType == ShapeConfig.SHAPE_ELLIPSE) {
                    this.shape = this.raphael.ellipse(this.x, this.y, this.width, this.height);
                }
                if (this.shapeType == ShapeConfig.SHAPE_IMAGE) {
                    this.shape = this.raphael.image(this.color, this.x - getHalfWidth(), this.y - getHalfHeight(), this.width, this.height);
                }
                if (this.toTop) {
                    this.shape.toFront();
                } else {
                    this.shape.toBack();
                }
                if (this.shapeType == ShapeConfig.SHAPE_IMAGE) { //是图片，设置图片路径
                    this.shape.attr({
                        cursor: 'default',
                        src: this.color,
                    });
                    this.state = this.state || this.getState();
                } else {
                    this.shape.attr({ //是图形，设置图形属性
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
                this.shape.drag(shapeMove, shapeDragger, shapeUp); //shapeMove, shapeDragger, shapeUp
                this.shape.dblclick(shapeDbclick);

                this.shape.mouseover(function (e) {
                    if (_this.overFun) {
                        _this.overFun(_this, e);
                    }
                });
                this.shape.mouseout(function (e) {
                    if (_this.outFun) {
                        _this.outFun(_this, e);
                    }
                });
                if (this.angle != 0) {
                    this.shape.rotate(this.angle);
                };
                this.setExtent().unSelect();
                this.setExtent2().hideExtent2();
                if (this.shapeCollection) {
                    this.shapeCollection.addShape(this);
                }
            }
            return this;
        };
        this.moveTo = function () { //根据已经修改的属性值移动图形，重新设定其宽和高和背景、连接线等
            if (this.angle != 0) {
                this.shape.rotate(-this.angle);
            }
            //x,y为图形左上角的svg坐标点
            var x = this.x - getHalfWidth();
            var y = this.y - getHalfHeight();

            var att = this.shapeType == ShapeConfig.SHAPE_ELLIPSE ? {
                'stroke-width': this.border,
                fill: this.fillColor,
                stroke: this.color,
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

            this.shape.attr(att);
            if (this.angle != 0) {
                this.shape.rotate(this.angle);
            }
            this.setCenter();
            this.resetLine();
            this.setText();
            this.setExtent();
            this.setExtent2();
            return this;
        };
        this.rotate = function (angle) { //旋转图形，需要调整虚线框、背景框、连接线的位置
            angle = angle % 360;
            //先旋转会0度
            if (this.angle != 0) {
                this.shape.rotate(-this.angle);
            }
            //再旋转回新的度数
            if (angle != 0) {
                this.shape.rotate(angle);
            }
            this.angle = angle;
            this.setExtent();
            this.setExtent2();
            this.resetLine();
            return this;
        };
        this.setCenter = function () { //设置图形中心点
            this.cx = this.x;
            this.cy = this.y;
            return this;
        };
        this.resetSingleLine = function (line) { //重新定位单条连接线
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
            var ponits = this.getDirection(box);
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
            line.moveTo(); //设置line的位置
            return this;
        };
        this.resetLine = function () { //重新点位所有连接线
            for (var a = 0; a < this.lineList.length; a++) {
                this.resetSingleLine(this.lineList[a]);
            }
            return this;
        };
        this.addLine = function (lineBean) { //为图形添加连接线，更新lineList和direction变量
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

            //遍历连接点数组，找到最近的一个连接点
            var dis = 100000000;
            for (var b = 0; b < pointList.length; b++) {
                var dx = Math.abs(pointList[b].x - x);
                var dy = Math.abs(pointList[b].y - y);
                var dxy = dx * dx + dy * dy;
                if (dis > dxy) {
                    dis = dxy;
                    dir = b;
                }
            }

            // 如果
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
        this.removeLine = function (lineBean) { //断开某一条连接线 入参lineInst
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
        this.disconnect = function () { //断开该图形上的所有连接线
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
        this.remove = function () { //移除该图形
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

        var ox = 0;
        var oy = 0;
        var hasMove = false;

        var shapeDragger = function (x, y, e) { //开始移动的函数
            e.stopPropagation();
            hasMove = false;
            if (_this.canMove) {
                ox = _this.x;
                oy = _this.y;
            }
        };
        var shapeMove = function (dx, dy, x, y, e) { //正在移动的函数
            // dx ，dy 鼠标移动的px
            // x ,y 鼠标的位置
            var scale = _this.raphaelScreen.zoom || 1; //放大倍数
            //因为有放大缩小的功能，所以要把鼠标移动的距离转换成svg上的距离
            dx = dx / scale;
            dy = dy / scale;
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
        var shapeUp = function (e) { //拖拽之后执行的函数,也绑定了单击事件，双击事件会触发两次单击事件
            if (e.button === 2) return;

            if (_this.canMove) {
                if (hasMove && _this.upFun) {
                    _this.upFun(_this);
                }
            }
            if (hasMove == false && _this.clickFun) {
                _this.clickFun(_this);
            }
        };

        var shapeDbclick = function (e) {
            if (e.button === 2) return;
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

    //*******************************************************************************************************************************************

    // 直线、折线线条对象
    PolyLineBean = function () {
        var _this = this;
        GeometryBean.call(this);
        this.geometryType = ShapeConfig.GEOMETRY_POLYLINE;

        this.lineType = null; //线段的类型
        var _lineTypeArray = ['StraightLine', 'BrokenLine']; //线段的所有类型，仅作为记录用

        this.dasharray = ['30,30'];

        this.border = 0; //线段border的大小
        this.pointSize = 4; //线段头尾处圆点的大小

        this.bShape = null; //线段头部圆点
        this.eShape = null; //线段尾部圆点
        this.beginShape = null; //线段头部所连接的图形
        this.endShape = null; //线段尾部所连接的图形

        this.createShape = function () { //创建线段
            if (this.raphael) {
                this.setPath();
                var path = this.getPath();

                this.shape = this.raphael.path(path).attr({
                    stroke: this.color,
                    fill: "none",
                    "stroke-width": this.border,
                    'stroke-dasharray': this.dasharray,
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

                this._create_bShape();
                this._create_eShape();

                this.setCenter().setText().setExtent().unSelect();
                this.setExtent2().hideExtent2();
                if (this.shapeCollection) {
                    this.shapeCollection.addShape(this);
                }
            }
            return this;
        };
        var lastSelectShape = null; //最近一次连接的图形
        this._create_bShape = function () { // 创建线段的头部圆圈

            this.bShape = new ShapeBean();
            this.bShape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            this.bShape.x = this.bx;
            this.bShape.y = this.by;
            this.bShape.raphaelScreen = this.raphaelScreen;
            this.bShape.hasExtent = false;
            this.bShape.raphael = this.raphael;
            this.bShape.width = this.pointSize;
            this.bShape.height = this.pointSize;
            this.bShape.canMove = this.canMove;
            this.bShape.border = 1;
            this.bShape.color = this.color;
            this.bShape.fillColor = this.fillColor;
            this.bShape.toTop = true;
            this.bShape.overFun = shapeOver;
            this.bShape.outFun = shapeOut;
            this.bShape.moveFun = function (shape) {
                _this.bx = _this.bShape.x;
                _this.by = _this.bShape.y;
                _this.moveTo(); //线段跟随头部移动
                var shapeBean = null;
                if (_this.shapeCollection) { //滑到了图形上
                    shapeBean = _this.shapeCollection.getShapeByLocat(_this.bx, _this.by, _this.facilityType);
                    if (shapeBean == _this.endShape) {
                        shapeBean = null;
                    }
                }
                if (lastSelectShape != shapeBean && lastSelectShape) {
                    lastSelectShape.unSelect().hideConnectPoints();
                }
                if (shapeBean) { // 如果滑到了图形上，设定该图形为选中，并展示该图形的连接点
                    shapeBean.select().showConnectPoints();
                    lastSelectShape = shapeBean;
                }

                if (_this.beginShape) { //如果存在连接的图形，断开连接
                    _this.beginShape.removeLine(_this);
                }
                _this.beginShape = null;
                _this.resetShape();

                if (_this.moveFun) {
                    _this.moveFun(this, -1);
                }
            };
            this.bShape.upFun = function (shape) { //如果放在了图形上，则连接该图形
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
                    shapeBean.unSelect().hideConnectPoints();
                }
                if (_this.upFun) {
                    _this.upFun(this, -1);
                }
            };
            this.bShape.clickFun = shapeClick;
            this.bShape.createShape();
        };
        this._create_eShape = function () { // 创建线段的尾部圆圈
            this.eShape = new ShapeBean();
            this.eShape.shapeType = ShapeConfig.SHAPE_ELLIPSE;
            this.eShape.x = this.ex;
            this.eShape.y = this.ey;
            this.eShape.hasExtent = false;
            this.eShape.raphael = this.raphael;
            this.eShape.raphaelScreen = this.raphaelScreen;
            this.eShape.width = this.pointSize;
            this.eShape.height = this.pointSize;
            this.eShape.border = 1;
            this.eShape.canMove = this.canMove;
            this.eShape.color = this.color;
            this.eShape.fillColor = this.fillColor;
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
                    lastSelectShape.unSelect().hideConnectPoints();
                }
                if (shapeBean) {
                    shapeBean.select().showConnectPoints();
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
                    shapeBean.unSelect().hideConnectPoints();
                }
                if (_this.upFun) {
                    _this.upFun(this, -1);
                }
            };
            this.eShape.clickFun = shapeClick;
            this.eShape.createShape();
        };
        this.moveTo = function (id) { //重新设定线段的位置等属性
            this.setPath(id);

            this.shape.attr({
                path: this.getPath()
            });

            this.bShape.x = this.bx;
            this.bShape.y = this.by;
            this.eShape.x = this.ex;
            this.eShape.y = this.ey;
            this.bShape.color =  this.eShape.color = this.color;
            this.bShape.fillColor =  this.eShape.fillColor = this.fillColor;

            this.bShape.moveTo();
            this.eShape.moveTo();

            this.setCenter();

            /*********** 修改  ************/
            this.setText();
            /************************/

            this.setExtent();
            this.setExtent2();

            return this;
        };
        this.setCenter = function () { //设定线段中心点的坐标
            this.cx = (this.bx + this.ex) / 2;
            this.cy = (this.by + this.ey) / 2;
            return this;
        };
        this.setPath = function () { //设定线段的路径点数组，分两类 直线和折线
            if (this.lineType !== "StraightLine") {
                var cx1 = 0;
                var cy1 = 0;
                var cx2 = 0;
                var cy2 = 0;

                if (Math.abs(_this.ex - _this.bx) > Math.abs(_this.ey - _this.by)) {
                    cx1 = cx2 = _this.ex;
                    cy1 = cy2 = _this.by;
                } else {
                    cx1 = cx2 = _this.bx;
                    cy1 = cy2 = _this.ey;
                }
                this.path[0] = {
                    x: this.bx,
                    y: this.by
                };
                this.path[1] = {
                    x: cx1,
                    y: cy1
                };
                this.path[2] = {
                    x: cx2,
                    y: cy2
                };
                this.path[3] = {
                    x: this.ex,
                    y: this.ey
                };
            } else {
                this.path[0] = {
                    x: this.bx,
                    y: this.by
                };
                this.path[1] = {
                    x: this.bx,
                    y: this.by
                };
                this.path[2] = {
                    x: this.ex,
                    y: this.ey
                };
                this.path[3] = {
                    x: this.ex,
                    y: this.ey
                };
            }
        };
        this.getPath = function () { //获取svg的path路径，根据路径点
            // // path(起点,右，下，左);  M 起点  L直线到(x,y)坐标
            var path = [
                'M',
                this.path[0].x,
                this.path[0].y,
                'L',
                this.path[1].x,
                this.path[1].y,
                'L',
                this.path[2].x,
                this.path[2].y,
                'L',
                this.path[3].x,
                this.path[3].y
            ].join(',');
            return path;
        };
        this.disconnect = function () { //断开所有连接的图形
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
        this.remove = function () { //删除该线段
            this.disconnect();
            this.shape.remove();
            this.bShape.remove();
            this.eShape.remove();
            this.textShape.remove();
            this.textShape2.remove();
            if (this.extent) {
                this.extent.remove();
            }
            if (this.extent2) {
                this.extent2.remove();
            }
            if (this.shapeCollection) {
                this.shapeCollection.removeShape(this);
            }
            return this;
        };
        this.resetShape = function () { //调整图形与连接点的位置关系
            if (this.beginShape) {
                this.beginShape.resetSingleLine(_this);
            }
            if (this.endShape) {
                this.endShape.resetSingleLine(_this);
            }
            return this;
        };

        //以下三个为头尾部圆点的鼠标事件
        var shapeClick = function (shape) {
            _this.shape.toFront();
            _this.bShape.shape.toFront();
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

    //*******************************************************************************************************************************************

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
                this.bShape.raphaelScreen = this.raphaelScreen;

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
                this.mShape.raphaelScreen = this.raphaelScreen;
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
                this.eShape.raphaelScreen = this.raphaelScreen;
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
                this.setExtent2().hideExtent2();
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
            this.setExtent2();
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
            this.path[0] = {
                x: this.bx,
                y: this.by
            };
            this.path[1] = {
                x: this.cx,
                y: this.cy
            };
            this.path[2] = {
                x: this.ex,
                y: this.ey
            };
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

    //*******************************************************************************************************************************************

    // 文字
    TextBean = function () {
        var _this = this;
        ShapeBean.call(this);
        this.geometryType = ShapeConfig.GEOMETRY_TEXT;
        //fill: this.main_textColor,
        this.main_realtext = '请输入文字';

        this.main_textSize = 12;
        this.main_textFamily = '微软雅黑';
        this.main_textStyle = 'normal';
        this.main_textWeight = 'normal';
        this.createShape = function () {
            if (this.raphael) {
                this.angle = this.angle % 360;

                //this.shape = this.raphael.image(this.color, this.x - getHalfWidth(), this.y - getHalfHeight(), this.width, this.height);
                //debugger;
                this.shape = this.raphael.text(this.x, this.y, this.main_realtext);

                this.shape.attr({
                    'fill': this.color,
                    'font-size': this.main_textSize,
                    'cursor': 'default',
                    'font-family': this.main_textFamily,
                    'font-style': this.main_textStyle,
                    'font-weight': this.main_textWeight,
                });

                if (this.toTop) {
                    this.shape.toFront();
                } else {
                    this.shape.toBack();
                }


                /********* 修改 *************/
                this.setCenter().setText();
                /*********************/
                this.shape.drag(shapeMove, shapeDragger, shapeUp); //shapeMove, shapeDragger, shapeUp


                this.shape.dblclick(shapeDbclick);

                this.shape.mouseover(function () {
                    if (_this.overFun) {
                        _this.overFun(_this);
                    }
                });
                this.shape.mouseout(function () {
                    if (_this.outFun) {
                        _this.outFun(_this);
                    }
                });

                if (this.angle != 0) {
                    this.shape.rotate(this.angle);
                };
                this.setExtent().unSelect();
                this.setExtent2().hideExtent2();
                if (this.shapeCollection) {
                    this.shapeCollection.addShape(this);
                }
            }
            return this;
        };

        this.moveTo = function () { //移动图形，重新设定其宽和高
            if (this.angle != 0) {
                this.shape.rotate(-this.angle);
            }
            this.shape.attr({
                'text': this.main_realtext,
                'font-size': this.main_textSize,
                'font-family': this.main_textFamily,
                'font-style': this.main_textStyle,
                'font-weight': this.main_textWeight,
                'fill': this.color,
                x: this.x,
                y: this.y,
            });
            if (this.angle != 0) {
                this.shape.rotate(this.angle);
            }
            this.setCenter();
            this.resetLine();
            this.setText();
            this.setExtent();
            this.setExtent2();
            return this;
        };
        var ox = 0;
        var oy = 0;
        var hasMove = false;
        var shapeDragger = function (x, y, e) { //开始移动的函数
            e.stopPropagation();
            hasMove = false;
            if (_this.canMove) {
                ox = _this.x;
                oy = _this.y;
            }
        };
        var shapeMove = function (dx, dy, x, y, e) { //正在移动的函数
            // dx ，dy 鼠标移动的px
            // x ,y 鼠标的位置
            var scale = _this.raphaelScreen.zoom || 1; //放大倍数
            //因为有放大缩小的功能，所以要把鼠标移动的距离转换成svg上的距离
            dx = dx / scale;
            dy = dy / scale;
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
        var shapeUp = function (e) { //拖拽之后执行的函数,也绑定了单击事件，双击事件会触发两次单击事件
            if (e.button === 2) return;

            if (_this.canMove) {
                if (hasMove && _this.upFun) {
                    _this.upFun(_this);
                }
            }
            if (hasMove == false && _this.clickFun) {
                _this.clickFun(_this);
            }
        };

        var shapeDbclick = function (e) {
            if (e.button === 2) return;
            if (hasMove == false && _this.dbClickFun) {
                _this.dbClickFun(_this);
            }
        };

    };

    //*******************************************************************************************************************************************

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
        isNution(obj) {
            return obj == null || obj == '' || obj == undefined;
        },
        isNotNull: function (obj) {
            return !this.isNull(obj)
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
                } catch (e) {}
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

    //*******************************************************************************************************************************************

    // 历史记录
    // HistoryBean = function () {
    //     var _this = this;
    //     this.type = '';
    //     this.datetime = new Date();
    //     this.actions = [];
    // };


})();
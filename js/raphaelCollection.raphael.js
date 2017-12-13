//*******************************************************************************************************************************************
/*
 ** 作者 ：Modified by GF on 2017.11.28
 ** 模块 ：ShapeCollection 图形之间的关系
 ** 依赖 ：ShapeConfig,ShapeBean,PolyLineBean,CurveLineBean,LineBean
 ** 入参 ：raphaelScreen 实例
 */
(function (ShapeConfig, ShapeBean, PolyLineBean, CurveLineBean, LineBean) {
    // 图形之间的关系
    ShapeCollection = function (raphaelScreen) { //r参RaphaelScreen实例
        this.raphaelScreen = raphaelScreen;
        this.raphael = raphaelScreen.raphael;
        this.shapeList = []; //图形数组
    };
    ShapeCollection.prototype = {
        constructor: ShapeCollection,
        clear: function () { //清空图形数组，并且调用每个图形实例的remove方法
            var number = this.shapeList.length;
            // var list = [];
            // for (var i = 0; i < number; i++) {
            //     list.push(this.shapeList[i]);
            // }
            // for (var j = 0; j < number; j++) {
            //     list[j].remove();
            // }
            this.raphael.clear();
            this.shapeList = [];
            return number;
        },
        addShape: function (shape) { //添加图形，如果原图形数组中存在此图形，就不添加

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
        },
        removeShape: function (shape) { //入参shape，从shape数组中移除某个shape
            var list = [];
            for (var i = 0; i < this.shapeList.length; i++) {
                if (this.shapeList[i].id != shape.id) {
                    list.push(this.shapeList[i]);
                }
            }
            this.shapeList = list;
            return this;
        },
        getShapeByLocat: function (x, y) { //入参坐标点和连接类型，返回包含此坐标点并且属于此坐标类型的第一个shape
            var shapeBean = null;
            for (var i = 0; i < this.shapeList.length; i++) {
                var shape = this.shapeList[i];
                if (shape.geometryType !== "GEOMETRY_POLYGON") continue;
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
            return shapeBean;
        },
        getGeometry: function (box) { //入参一个方块区域，返回完全包裹于此区域的shape集合
            var x = box.x,
                y = box.y,
                width = box.width,
                height = box.height;
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
        },
        getGeometryById: function (id) { // 根据id返回shape
            var shape = null;
            for (var i = 0; i < this.shapeList.length; i++) {
                if (id == this.shapeList[i].id) {
                    shape = this.shapeList[i];
                    break;
                }
            }
            return shape;
        },
        getGeometryByRealText: function (sText) { // 根据realText属性返回shape
            var shape = null;
            for (var i = 0; i < this.shapeList.length; i++) {
                if (sText == this.shapeList[i].realtext) {
                    shape = this.shapeList[i];
                    break;
                }
            }
            return shape;
        },
        getGeometryByMainRealtext: function (sText) { // 根据MainRealtext属性返回shape
            var shape = null;
            for (var i = 0; i < this.shapeList.length; i++) {
                if (sText == this.shapeList[i].main_realtext) {
                    shape = this.shapeList[i];
                    break;
                }
            }
            return shape;
        },
        getGeometrybyState: function (state) {
            return this.shapeList.filter(function (shape, index) {
                return shape.state === state
            });
        },
        getGeometryByBitNumber: function (bitNumber) { // 根据位号返回shape
            var shape = null;
            for (var i = 0; i < this.shapeList.length; i++) {
                if (bitNumber == this.shapeList[i].bitNumber) {
                    shape = this.shapeList[i];
                    break;
                }
            }
            return shape;
        },
        getGeometryByBitNumbers: function (abitNumber) { // 根据位号返回shapelist
            var arr = [];
            abitNumber.forEach(function (item, index) {
                var shape = that.getGeometryByBitNumber(item);
                if (shape) {
                    arr.push(shape)
                }
            });
            return arr;
        },
        getSelectShape: function () { //通过判断shape的选中属性，返回所有被选中的shape
            var list = [];
            for (var i = 0; i < this.shapeList.length; i++) {
                var shape = this.shapeList[i];
                if (shape.selected) {
                    list.push(shape);
                }
            }
            return list;
        },
        getTwinkleShape: function () { //获取正在闪烁的原件
            return this.shapeList.filter(function (shape, index) {
                return shape.isTwinkle;
            });
        },
        setTwinkleByBitNumberList: function (bitNumberList, color, nAllTime, nEachTime) { //入参位号id数组，闪烁背景色,设置原件闪烁
            var that = this;
            this.clearTwinkle();
            if (!color) {
                return;
            }
            var failList = [];
            bitNumberList.forEach(function (item, index) {
                var shape = that.getGeometryByBitNumber(item);
                if (shape) {
                    shape.setTwinkle(color, nAllTime, nEachTime);
                } else {
                    failList.push(item);
                }
            });
            return failList;
        },
        clearTwinkle: function () {
            var that = this;
            return this.shapeList.forEach(function (shape, index) {
                if (shape.isTwinkle) {
                    shape.clearTwinkle();
                }
            });
        },
        clearSelect: function () {
            var that = this;
            return this.shapeList.forEach(function (shape, index) {
                if (shape.selected) {
                    shape.unSelect();
                }
            });
        },
        locateShapes: function (bitNumberList) { //定位元件，入参原件binum数组
            var that = this;
            if (!this.raphaelScreen) {
                return;
            }
            var xmin, ymin, xmax, ymax = null;
            bitNumberList.forEach(function (item, index) {
                var shape = that.getGeometryByBitNumber(item);
                if (shape) {
                    var o = shape.shape.getBBox();
                    xmin = (xmin && o.x > xmin) ? xmin : o.x;
                    ymin = (ymin && o.y > ymin) ? ymin : o.y;
                    xmax = (xmax && o.x + o.width < xmax) ? xmax : o.x + o.width;
                    ymax = (ymax && o.y + o.height < ymax) ? ymax : o.y + o.height;
                }
            });
            if (xmin || ymin || xmax || ymax) {
                this.raphaelScreen.setViewBox(xmin - 100, ymin - 100, xmax + 100, ymax + 100);
                if (this.raphaelScreen.zoom > 1) {
                    this.raphaelScreen.setZoom(1);
                }
                this.raphaelScreen.setCenter((xmin + xmax) / 2, (ymin + ymax) / 2);
            }
        },
        getCenterByShapeList: function (shapeList) { //入参shapelist，获取shapes的中心点
            var xmin, ymin, xmax, ymax = null;
            shapeList.forEach(function (shape, index) {
                if (shape) {
                    var o = shape.shape.getBBox();
                    xmin = (xmin && o.x > xmin) ? xmin : o.x;
                    ymin = (ymin && o.y > ymin) ? ymin : o.y;
                    xmax = (xmax && o.x + o.width < xmax) ? xmax : o.x + o.width;
                    ymax = (ymax && o.y + o.height < ymax) ? ymax : o.y + o.height;
                }
            });
            return {
                x: (xmin + xmax) / 2,
                y: 　(ymin + ymax) / 2
            }
        },
        locateArea: function (aPoints) { //定位元件，入参aPoints数组 [{x,y}]
            var that = this;
            if (!this.raphaelScreen) {
                return;
            }
            var xmin, ymin, xmax, ymax = null;
            aPoints && aPoints.forEach(function (item, index) {
                var o = item;
                xmin = (xmin && o.x > xmin) ? xmin : o.x;
                ymin = (ymin && o.y > ymin) ? ymin : o.y;
                xmax = (xmax && o.x < xmax) ? xmax : o.x;
                ymax = (ymax && o.y < ymax) ? ymax : o.y;
            });
            if (xmin || ymin || xmax || ymax) {
                this.raphaelScreen.setViewBox(xmin - 100, ymin - 100, xmax + 100, ymax + 100);
                if (this.raphaelScreen.zoom > 1) {
                    this.raphaelScreen.setZoom(1);
                }
                this.raphaelScreen.setCenter((xmin + xmax) / 2, (ymin + ymax) / 2);
            }
        },
        removeSelectShape: function () { //移除所有被选中的shape，返回移除的shape数量
            var list = this.getSelectShape();
            var number = list.length;
            for (var i = 0; i < number; i++) {
                var shape = list[i];
                shape.remove();
            }
            return number;
        },
        getGeometryAttribute: function () { //以数组的形式，返回每个shape的属性
            var list = [];
            for (var i = 0; i < this.shapeList.length; i++) {
                list.push(this.shapeList[i].getAttribute());
            }
            return list;
        },
        setShapeStateByBitNumberList: function (state, bitNumberList) {
            var that = this;
            bitNumberList.forEach(function (item, index) {
                var shape = that.getGeometryByBitNumber(item);
                if (shape) {
                    shape.setState(state);
                }
            });
        },
        setShapeStateByShapeList: function (state, shapeList) {
            shapeList.forEach(function (shape, index) {
                shape.setState(state);
            });
        },
        moveShapes: function (aShapes, dx, dy) {
            aShapes.forEach(function (shape) {
                shape.x = shape.x + dx;
                shape.y = shape.y + dy;
                shape.moveTo();
            });
        },
        setNewPositionOfCopyObj: function (CopyObj, x, y) { // 设置复制对象中的图形的新位置，返回图形对象数组
            // 入参 复制对象
            // 入参 新位置的中心点坐标
            var offsetX = x - CopyObj.centerPoint.x;
            var offsetY = y - CopyObj.centerPoint.y;
            var aShapeObjs = CopyObj.aShapeObjs;
            aShapeObjs.forEach(function (shape, index) {
                shape.x = shape.x + offsetX;
                shape.y = shape.y + offsetY;
                shape.bx = shape.bx + offsetX;
                shape.by = shape.by + offsetY;
                shape.ex = shape.ex + offsetX;
                shape.ey = shape.ey + offsetY;
            });
            return aShapeObjs;
        },
        getCopyObjOfSelectedShapes: function (aShapeInsts) { // 复制选中的图形实例，返回复制对象
            // 入参： 图形实例
            if (!aShapeInsts) return;
            var that = this;
            var centerPoint = this.getCenterByShapeList(aShapeInsts);
            var aShapeObjs = aShapeInsts.map(function (item, index) {
                return item.cloneAttribute();
            });
            var s = JSON.stringify(aShapeObjs);
            aShapeObjs.forEach(function (shape, index) {
                s = s.replace(new RegExp(shape.id, 'g'), Tools.getUUID());
            });
            return {
                centerPoint: centerPoint,
                aShapeObjs: JSON.parse(s)
            };
        },
        createLineConnection: function (sLineId, beginShapeId, endShapeId) { //创建连接关系
            //入参 ： 连接线的Id值
            var lineInst = this.getGeometryById(sLineId);
            if (!lineInst || lineInst.geometryType === 'GEOMETRY_POLYGON') {
                return;
            }
            var beginShape = this.getGeometryById(beginShapeId);
            var endShape = this.getGeometryById(endShapeId);

            if (beginShape) {
                lineInst.beginShape = beginShape;
                lineInst.beginShape.addLine(lineInst);
            }
            if (endShape) {
                lineInst.endShape = endShape;
                lineInst.endShape.addLine(lineInst);
            }
        },
        createConnections: function (aGoes) { //批量创建连接关系
            // 入参
            var that = this;
            aGoes.forEach(function (item, index, attr) {
                that.createLineConnection(item.id, item.beginShape, item.endShape);
            })
        },
        createGeometrys: function (aGeos, finishedfn) { //批量创建图形
            var that = this;
            var index = 0;
            var aShapeList = [];
            var drawShape = function (aGeos, index) {
                if (index >= aGeos.length) {
                    that.createConnections(aGeos);
                    //console.log('创建连接关系','____',new Date())
                    finishedfn && finishedfn(aShapeList);
                    return;
                }
                setTimeout(function () {
                    //console.log(index,'____',new Date())

                    var item = aGeos[index];
                    var shape = that.createGeometry(item);
                    aShapeList.push(shape);
                    //that.bindShapeEvent(shape);
                    drawShape(aGeos, ++index);
                }, 0);
            };
            drawShape(aGeos, index);
        },
        setSvgSizeByShapes: function (aGeos, isResizeSvg) { //根据shapes获取svg的最适宜的大小
            var x0 = y0 = x1 = y1 = 0;
            aGeos.forEach(function (shape, index, arr) {
                var x = shape.x + shape.width + 100;
                var y = shape.y + shape.height + 100;
                x1 = x1 < x ? x : x1;
                y1 = y1 < y ? y : y1;
            });
            isResizeSvg && this.raphael.setSize(x1, y1);
            this.raphaelScreen.setViewBox(0, 0, x1, y1);
            return {
                x: x1,
                y: y1
            };
        },
        createGeometry: function (obj) {
            if (!obj) {
                return;
            }
            var shape = null;
            if (obj.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                shape = new ShapeBean();
            } else if (obj.geometryType == ShapeConfig.GEOMETRY_POLYLINE) {
                shape = new PolyLineBean();
            } else if (obj.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
                shape = new CurveLineBean();
            } else if (obj.geometryType == ShapeConfig.GEOMETRY_LINE) {
                shape = new LineBean();
            } else if (obj.geometryType == ShapeConfig.GEOMETRY_TEXT) {
                shape = new TextBean();
            }
            for (var k in obj) {
                shape[k] = obj[k];
            }
            if (obj.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                shape.lineList = [];
            }
            shape.raphael = this.raphael;
            shape.shapeCollection = this;
            shape.raphaelScreen = this.raphaelScreen;
            shape.createShape();
            return shape;
        },
        createShape: function (url, x, y, w, h, ft, shapeType) {
            if (shapeType === ShapeConfig.SHAPE_ELLIPSE) {
                url = '#000';
            }
            return this.createGeometry({
                geometryType: ShapeConfig.GEOMETRY_POLYGON,
                shapeType: shapeType || ShapeConfig.SHAPE_IMAGE,
                facilityType: ft,
                color: url,
                textColor: '#000',
                fillColor: '#000',
                x: x,
                y: y,
                width: w,
                height: h,
            });
        },
        createLine: function (lineType, dasharray, x, y, ft, warningColor, color, border, pointSize) { //创建直线或者折线
            // StraightLine  BrokenLine
            return this.createGeometry({
                geometryType: ShapeConfig.GEOMETRY_POLYLINE,
                facilityType: ft,
                warningColor: warningColor,
                warningFillColor: warningColor,
                color: color,
                fillColor: color,
                border: border,
                bx: x,
                by: y,
                ex: x + 80,
                ey: lineType === 'StraightLine' ? y : y + 40,
                pointSize: pointSize,
                lineType: lineType,
                dasharray: dasharray || null,
            });
        },
        createText: function (text, x, y, color, ft) {
            return this.createGeometry({
                geometryType: ShapeConfig.GEOMETRY_TEXT,
                facilityType: ft,
                color: color,
                x: x,
                y: y,
                main_realtext: text,
                main_textSize: '18',
                // main_textFamily : '',
                // main_textStyle : '',
                // main_textWeight : '',

            });
        },
        createWireLine: function (x, y, ft) {
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
            return this.createGeometry({
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
        }

    };
})(ShapeConfig, ShapeBean, PolyLineBean, CurveLineBean, LineBean);


//*******************************************************************************************************************************************
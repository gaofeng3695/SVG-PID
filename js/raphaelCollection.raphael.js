//*******************************************************************************************************************************************
/*
 ** 作者 ：Modified by GF on 2017.11.28
 ** 模块 ：ShapeCollection 图形之间的关系
 ** 依赖 ：ShapeConfig,ShapeBean,PolyLineBean,CurveLineBean,
 ** 入参 ：raphaelScreen 实例
 */
(function (ShapeConfig, ShapeBean, PolyLineBean, CurveLineBean,facilityConfig) {
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
                if (this.shapeList[i].bitNumber && bitNumber == this.shapeList[i].bitNumber) {
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
        setTwinkleByBitNumberList: function (bitNumberList, color, nAllTime, nEachTime , isNotClearTwinkle) { //入参位号id数组，闪烁背景色,设置原件闪烁
            var that = this;
            !isNotClearTwinkle && this.clearTwinkle();
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
        setRoadColor: function (sRoad, color, sTip) { //设定线路的状态，入参线路名称，颜色，线路状态
            color = color || 'blue';
            var shape = this.getGeometryByMainRealtext(sRoad);

            if (shape) {
                var box = shape.shape.getBBox();

                var centerY = box.y + box.height / 2;
                var height = box.height * 0.8; //                console.log(x, y, width, height)
                var width = 100;

                var x = box.x2 + 10;
                var y = centerY - height / 2 - 2;
                if (!this._roadStateMap) {
                    this._roadStateMap = {};
                }
                if (!this._roadStateMap[sRoad]) {
                    this._roadStateMap[sRoad] = {};
                }
                if (this._roadStateMap[sRoad].rect) {
                    this._roadStateMap[sRoad].rect.remove();
                }
                this._roadStateMap[sRoad].rect = this.raphael.rect(x, y, width, height);
                this._roadStateMap[sRoad].rect.attr({
                    stroke: color,
                    fill: color,
                    opacity: 0.8,
                    r: 2
                });
                if (sTip) {
                    if (this._roadStateMap[sRoad].text) {
                        this._roadStateMap[sRoad].text.remove();
                    }
                    this._roadStateMap[sRoad].text = this.raphael.text(x + width / 2, y + height / 2, sTip).attr({
                        'fill': '#fff',
                        'font-size': 18,
                        'font-family': '微软雅黑',
                    });
                }

            }
        },
        setRoadsColor: function (aRoads, color, sTip) { //批量设定线路状态
            var that = this;
            aRoads.forEach(function (sRoad) {
                that.setRoadColor(sRoad, color, sTip)
            });
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
        createConnections: function (aGeos, aShapeList, finishedfn) { //批量创建连接关系
            // 入参
            var that = this;
            var index = 0;
            var time = new Date();

            // var createConnection = function (aGeos, index) {
            //     if (index >= aGeos.length) {
            //         console.log('创建连接关系耗时：','____',(new Date() -time)/1000 + '秒')
            //         finishedfn && finishedfn(aShapeList);
            //         return;
            //     }
            //     setTimeout(function () {
            //         var item = aGeos[index];
            //         that.createLineConnection(item.id, item.beginShape, item.endShape);
            //         createConnection(aGeos, ++index);
            //     }, 0);

            // };
            // createConnection(aGeos,index);

            aGeos.forEach(function (item, index, attr) {
                setTimeout(function () {
                    that.createLineConnection(item.id, item.beginShape, item.endShape);
                    if (index >= aGeos.length - 1) {
                        console.log('____________  创建连接关系耗时：', (new Date() - time) / 1000 + '秒');
                        finishedfn && finishedfn(aShapeList);
                        console.log('____________  绘图完成')
                    }
                }, 0);
            });

        },
        createGeometrys: function (aGeos, finishedfn, isNotCreateConnect) { //批量创建图形
            var that = this;
            var index = 0;
            var aShapeList = [];

            var time = new Date();
            console.log('____________  绘图开始')

            var drawShape = function (aGeos, index) {
                if (index >= aGeos.length) {
                    console.log('____________  绘制耗时：', (new Date() - time) / 1000 + '秒');
                    if (isNotCreateConnect) { //如果不创建连接关系
                        finishedfn && finishedfn(aShapeList);
                        console.log('____________  绘图完成')
                    } else {
                        that.createConnections(aGeos, aShapeList, finishedfn);
                    }
                    return;
                }
                setTimeout(function () {

                    var item = aGeos[index];
                    var shape = that.createGeometry(item);
                    aShapeList.push(shape);
                    drawShape(aGeos, ++index);
                }, 0);
            };
            drawShape(aGeos, index);
        },
        setSvgSizeByShapes: function (aGeos, isResizeSvg) { //根据shapes获取svg的最适宜的大小
            if (!aGeos || aGeos.length < 1) {
                return;
            }
            var x0 = y0 = 100000000;
            var x1 = y1 = 0;


            aGeos.forEach(function (shape, index, arr) {

                var xArr = [shape.bx,shape.cx,shape.ex,shape.cx - shape.width/2,shape.cx + shape.width/2].filter(function(num){
                    return num;
                });
                var yArr = [shape.by,shape.cy,shape.ey,shape.cy - shape.height/2,shape.cy + shape.height/2].filter(function(num){
                    return num;
                });;

                var _x = Math.min.apply(null,xArr) - 100;
                var _y = Math.min.apply(null,yArr) - 100;
                var x = Math.max.apply(null,xArr) + 100;
                var y = Math.max.apply(null,yArr) + 100;

                _x = _x < 0 ? 0 : _x;
                _y = _y < 0 ? 0 : _y;

                x0 = x0 < _x ? x0 : _x;
                y0 = y0 < _y ? y0 : _y;
                x1 = x1 < x ? x : x1;
                y1 = y1 < y ? y : y1;

            });
            var resetxy = function (a, b) {
                if (b - a > 500) return [a, b];
                var m = (a + b) / 2;
                if (m < 250) return [0, 500];
                return [m - 250, m + 250];
            };
            var xArr = resetxy(x0, x1);
            var yArr = resetxy(y0, y1);
            isResizeSvg && this.raphael.setSize(xArr[1], yArr[1]);
            this.raphaelScreen.setViewBox(xArr[0], yArr[0],xArr[1], yArr[1]);
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
            } else if (obj.geometryType == ShapeConfig.GEOMETRY_TEXT) {
                shape = new TextBean();
            }
            for (var k in obj) {
                shape[k] = obj[k];
            }
            if (obj.geometryType == ShapeConfig.GEOMETRY_POLYGON) {
                shape.lineList = [];
            }
            shape.facilityName = facilityConfig[shape.facilityType] ? facilityConfig[shape.facilityType].name : '';
            shape.raphael = this.raphael;
            shape.shapeCollection = this;
            shape.raphaelScreen = this.raphaelScreen;
            shape.createShape();
            return shape;
        },
        createShape: function (url, x, y, w, h, ft, shapeType,name) {
            if (shapeType === ShapeConfig.SHAPE_ELLIPSE) {
                url = '#000';
            }
            return this.createGeometry({
                facilityName : name || '',
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
        createLine: function (lineType, dasharray, x, y, ft, warningColor, color, border, pointSize,name) { //创建直线或者折线
            // StraightLine  BrokenLine
            return this.createGeometry({
                facilityName : name || '',
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
        createText: function (text, x, y, color, ft,name) {
            return this.createGeometry({
                facilityName : name || '',
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
        createWireLine: function (x, y, ft,name) {
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
                facilityName : name || '',
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
})(ShapeConfig, ShapeBean, PolyLineBean, CurveLineBean,facilityConfig);


//*******************************************************************************************************************************************
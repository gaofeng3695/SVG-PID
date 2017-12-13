/*
** creeated by GF on 2017.11.28
** raphael 的屏幕缩放拖拽功能
** 依赖$，Raphael,入参obj

*/
RaphaelScreen = function (obj) {
    //

    // obj = {
    //     'sId': '',
    //     'width': '',
    //     'height': '',
    //     'selectRectFn': ''
    // }

    this.zoom = 1;
    this.downKeyName = '';
    this.width = 5000;
    this.height = 5000;
    this.wrapperId = '';
    this.selectRectFn = function () {};
    this.$wrap = null;
    this.stateRange = ['normal', 'move', 'enlarge'];
    this.state = 'normal';
    this.ismoving = false;
    this.init(obj);
}
RaphaelScreen.prototype = {
    constructor: RaphaelScreen,
    init: function (obj) {
        this.wrapperId = obj.sId;
        this.width = obj.width ? obj.width : this.width;
        this.height = obj.height ? obj.height : this.height;
        this.selectRectFn = obj.selectRectFn;
        this.initSvgPaper();
        this.bindEvent();
    },
    initSvgPaper: function () {
        this.$wrap = $('#' + this.wrapperId);
        this.$wrap.html('<div id="jas_raphael" style="width:100%;height:100%;overflow:auto;"></div>');
        this.$svgWrap = $('#jas_raphael');
        this.raphael = Raphael('jas_raphael', this.width, this.height);
        this.$svg = this.$svgWrap.find('svg');

        // this.raphael.circle(2000, 2000, 2000)
        // this.raphael.circle(2000, 2000, 1500)
        // this.raphael.circle(2000, 2000, 1000)
        // this.raphael.circle(2000, 2000, 500)
        // this.raphael.circle(2000, 2000, 2)

    },
    setState: function (state) { //sState
        this.state = state ? state : 'normal';
        if (state === 'move') {
            this.$svg.css("cursor", "pointer");
        } else {
            this.$svg.css("cursor", "");
        }
    },
    bindEvent: function () {
        var that = this;
        $(document).on('keydown',function(e){
            that.downKeyName = e.key;
        }).on('keyup',function(e){
            that.downKeyName = '';
        });
        this.bindEvent_zoom();
        this.bindEvent_move();
        this.bindEvent_selectRect();
    },
    bindEvent_zoom: function () { //绑定放大缩小相关事件
        var that = this;
        this.$svgWrap.on('mousewheel', function (e) { // 中心点放大缩小功能
            var x = e.pageX;
            var y = e.pageY;
            var delta = e.originalEvent.wheelDelta;
            var zoom = delta < 0 ? that.zoom - 0.1 : that.zoom + 0.1; //设置新的scale
            if (zoom <= 0) {
                return false;
            }
            var left = that.$svgWrap.scrollLeft();
            var top = that.$svgWrap.scrollTop();
            var oCoodinate1 = that.getSvgCoordinate(x, y); //更改之前鼠标所在的svg坐标
            //console.log('svg坐标：',oCoodinate1)

            that.setZoom(zoom); // 放大或缩小

            var oCoodinate2 = that.getScreenCoordinate(oCoodinate1.x, oCoodinate1.y); //更改之后svg坐标所在的屏幕位置
            if (!oCoodinate2) {
                return;
            }
            //console.log('移动后的屏幕坐标：',oCoodinate2)
            //屏幕坐标偏移量

            var _x = oCoodinate2.x - x;
            var _y = oCoodinate2.y - y;

            that.$svgWrap.scrollLeft(left + _x);
            that.$svgWrap.scrollTop(top + _y);
            return false;
        });
    },
    bindEvent_move: function () { //绑定画布拖拽相关事件
        var that = this;
        this.$svgWrap.on('contextmenu', function (event) { //去除浏览器右键菜单
            if (document.all) window.event.returnValue = false; // for IE
            else event.preventDefault();
        });

        this.$svgWrap.on('mousedown', function (e) {
            if (that.state === 'move' || e.button === 2) { //右键也可以拖动
                that.ismoving = true;
                that.start_left = that.$svgWrap.scrollLeft();
                that.start_top = that.$svgWrap.scrollTop();
                that.start_x0 = e.pageX;
                that.start_y0 = e.pageY;
            }
        });


        this.$svgWrap.on('mousemove', function (e) {
            if (that.ismoving) {
                var x = e.pageX;
                var y = e.pageY;
                that.$svgWrap.scrollLeft(that.start_left - (x - that.start_x0));
                that.$svgWrap.scrollTop(that.start_top - (y - that.start_y0));
            }
        });

        this.$svgWrap.on('mouseup', function (e) {
            that.ismoving = false;
        });
    },
    bindEvent_selectRect: function () {
        var that = this;
        var x0 = null;
        var y0 = null;
        var x1 = null;
        var y1 = null;

        var isDrawed = false;
        var rectShape = null; //存放svg上raphael画的矩形框的实例
        this.$svgWrap.on('mousedown', function (e) { //开始
            if (e.button === 0 && ['normal', 'enlarge'].indexOf(that.state) > -1) {
                isDrawed = true;
                var x = e.pageX;
                var y = e.pageY;
                var oloc = that.getSvgCoordinate(x, y)
                x0 = oloc.x;
                y0 = oloc.y;
            }
        });
        this.$svgWrap.on('mousemove', function (e) {
            if (isDrawed && ['normal', 'enlarge'].indexOf(that.state) > -1) {
                var x = e.pageX;
                var y = e.pageY;
                var oloc = that.getSvgCoordinate(x, y)

                if (rectShape) {
                    rectShape.remove();
                }
                x1 = oloc.x;
                y1 = oloc.y;
                rectShape = that.drawEnlargeRectangle(x0, y0, x1, y1);
                rectShape.attr({
                    'fill': '#00f',
                    'stroke': '#00f',
                    'stroke-width': '1',
                    'fill-opacity': 0.2
                });
            }
        });
        this.$svgWrap.on('mouseup', function (e) {

            if (isDrawed && ['normal', 'enlarge'].indexOf(that.state) > -1) {
                isDrawed = false;
                if (!x0 || !y0 || !x1 || !y1) return;

                if (that.state === 'normal') {
                    //console.log(x0, y0, x1, y1)
                    if (that.selectRectFn) {
                        that.selectRectFn.bind(that)(rectShape, x0, y0, x1, y1);
                    }
                }
                if (that.state === 'enlarge') {
                    //console.log(x0, y0, x1, y1)
                    rectShape.remove();
                    that.setViewBox(x0, y0, x1, y1)
                }

            }
            x0 = y0 = x1 = y1 = null;
        });
    },
    drawEnlargeRectangle: function (x0, y0, x1, y1) {
        var x = x0 > x1 ? x1 : x0;
        var y = y0 > y1 ? y1 : y0;
        var width = Math.abs(x0 - x1);
        var height = Math.abs(y0 - y1);
        return this.raphael.rect(x, y, width, height);
    },
    setZoom: function (zoom) {
        if (zoom <= 0) {
            return false;
        }
        this.zoom = zoom ? zoom : this.zoom;
        this.$svgWrap.find('svg').css('zoom', this.zoom);
    },
    getViewBox: function () {
        var zoom = this.zoom;
        var x0 = this.$svgWrap.scrollLeft() / zoom;
        var y0 = this.$svgWrap.scrollTop() / zoom;
        var width = this.$svgWrap.width();
        var height = this.$svgWrap.height();
        return {
            x0: x0,
            y0: y0,
            x1: x0 + width / zoom,
            y1: y0 + height / zoom
        }
    },
    setViewBox: function (_x0, _y0, _x1, _y1) { // 输入svg四角的坐标，自动设定zoom，和视图位置

        var x0 = _x0 > _x1 ? _x1 : _x0;
        var x1 = _x0 > _x1 ? _x0 : _x1;
        var y0 = _y0 > _y1 ? _y1 : _y0;
        var y1 = _y0 > _y1 ? _y0 : _y1;

        x0 = x0 < 0 ? 0 : x0;
        y0 = y0 < 0 ? 0 : y0;
        x1 = x1 > this.width ? this.width : x1;
        y1 = y1 > this.height ? this.height : y1;

        var w = x1 - x0;
        var h = y1 - y0;
        var zoom1 = this.$svgWrap.width() / w; //能把w这段坐标放进窗口中的 zoom
        var zoom2 = this.$svgWrap.height() / h; //能把h这段坐标放进窗口中的 zoom
        var zoom = zoom1 < zoom2 ? zoom1 : zoom2; //两者相比，取最小的 zoom

        this.setZoom(zoom); //先设定zoom

        // this.$svgWrap.scrollLeft(x0 * zoom); //再调整视图
        // this.$svgWrap.scrollTop(y0 * zoom);
        this.setCenter((x0+x1)/2,(y0+y1)/2);
    },
    setCenter: function (x, y) { //x ,y 坐标
        if (x < 0 || y < 0 || x > this.width || y > this.height) {
            console.error('参数错误')
            return;
        }
        var zoom = this.zoom;
        var width = this.$svgWrap.width() / zoom;
        var height = this.$svgWrap.height() / zoom;

        var x0 = x - width / 2;
        var y0 = y - height / 2;

        x0 = x0 < 0 ? 0 : x0;
        y0 = y0 < 0 ? 0 : y0;

        this.$svgWrap.scrollLeft(x0 * zoom);
        this.$svgWrap.scrollTop(y0 * zoom);
    },
    getSvgCoordinate: function (x, y) { // 鼠标坐标
        var zoom = this.zoom;
        var wrapTop = this.$svgWrap.offset().top;
        var wrapLeft = this.$svgWrap.offset().left;

        var _x = x - wrapLeft;
        var _y = y - wrapTop;

        if (_x < 0 || _y < 0) {
            return;
        }
        var oCo = this.getViewBox();
        return {
            x: oCo.x0 + _x / zoom,
            y: oCo.y0 + _y / zoom
        }
    },
    getScreenCoordinate: function (x, y) { //svg 坐标
        if (x < 0 || y < 0 || x > this.width || y > this.height) {
            //console.error('参数错误')
            return;
        }

        var zoom = this.zoom;
        var wrapTop = this.$svgWrap.offset().top;
        var wrapLeft = this.$svgWrap.offset().left;

        var oCo = this.getViewBox();

        return {
            x: (x - oCo.x0) * zoom + wrapLeft,
            y: (y - oCo.y0) * zoom + wrapTop
        }
    }

};

//*******************************************************************************************************************************************

// 基本图形配置
ShapeConfig = {
    SHAPE_RECT: 'SHAPE_RECT',
    SHAPE_ELLIPSE: 'SHAPE_ELLIPSE',
    SHAPE_IMAGE: 'SHAPE_IMAGE',

    GEOMETRY_POLYGON: 'GEOMETRY_POLYGON', // 多边形
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

    LINE_ANODECABLE: 'LINE_ANODECABLE', // 阳极电缆
    LINE_CATHODECABLE: 'LINE_CATHODECABLE', // 阴极电缆
    LINE_WIRE: 'LINE_WIRE', // 跨接电缆
    LINE_CONNECTIONLINE: 'LINE_CONNECTIONLINE', // 连接线

};
//*******************************************************************************************************************************************
// 图形之间的关系
ShapeCollection = function (RaphaelScreen) { //入参RaphaelScreen实例
    this.raphaelScreen = RaphaelScreen;
    this.clear = function () { //清空图形数组，并且调用每个图形实例的remove方法
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
    this.shapeList = []; //图形数组
    this.addShape = function (shape) { //添加图形，如果原图形数组中存在此图形，就不添加

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
    this.removeShape = function (shape) { //入参shape，从shape数组中移除某个shape
        var list = [];
        for (var i = 0; i < this.shapeList.length; i++) {
            if (this.shapeList[i].id != shape.id) {
                list.push(this.shapeList[i]);
            }
        }
        this.shapeList = list;
        return this;
    };
    this.getShapeByLocat = function (x, y, facilityType) { //入参坐标点和连接类型，返回包含此坐标点并且属于此坐标类型的第一个shape
        var shapeBean = null;
        for (var i = 0; i < this.shapeList.length; i++) {
            var shape = this.shapeList[i];
            if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON) { //shape的图形类型是多边形
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
        return shapeBean;
    };
    this.getGeometry = function (box) { //入参一个方块区域，返回完全包裹于此区域的shape集合
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
    };
    this.getGeometryById = function (id) { // 根据id返回shape
        var shape = null;
        for (var i = 0; i < this.shapeList.length; i++) {
            if (id == this.shapeList[i].id) {
                shape = this.shapeList[i];
                break;
            }
        }
        return shape;
    };
    this.getGeometryByRealText = function (sText) { // 根据realText属性返回shape
        var shape = null;
        for (var i = 0; i < this.shapeList.length; i++) {
            if (sText == this.shapeList[i].realtext) {
                shape = this.shapeList[i];
                break;
            }
        }
        return shape;
    };
    this.getGeometrybyState = function (state) {
        return this.shapeList.filter(function (shape, index) {
            return shape.state === state
        });
    };
    this.getGeometryByBitNumber = function (bitNumber) { // 根据位号返回shape
        var shape = null;
        for (var i = 0; i < this.shapeList.length; i++) {
            if (bitNumber == this.shapeList[i].bitNumber) {
                shape = this.shapeList[i];
                break;
            }
        }
        return shape;
    };
    this.getGeometryByBitNumbers = function (abitNumber) { // 根据位号返回shapelist
        var arr = [];
        abitNumber.forEach(function (item, index) {
            var shape = that.getGeometryByBitNumber(item);
            if (shape) {
                arr.push(shape)
            }
        });
        return arr;
    };
    this.getSelectShape = function () { //通过判断shape的选中属性，返回所有被选中的shape
        var list = [];
        for (var i = 0; i < this.shapeList.length; i++) {
            var shape = this.shapeList[i];
            if (shape.selected) {
                list.push(shape);
            }
        }
        return list;
    };
    this.getTwinkleShape = function () { //获取正在闪烁的原件
        return this.shapeList.filter(function (shape, index) {
            return shape.isTwinkle;
        });
    };
    this.setTwinkleByBitNumberList = function(bitNumberList,color,nAllTime,nEachTime){ //入参位号id数组，闪烁背景色,设置原件闪烁
        var that = this;
        if(!color){
            return;
        }
        bitNumberList.forEach(function (item, index) {
            var shape = that.getGeometryByBitNumber(item);
            if (shape) {
                shape.setTwinkle(color,nAllTime,nEachTime);
            }
        });
    },
    this.clearTwinkle = function(){
        var that = this;
        return this.shapeList.forEach(function (shape, index) {
            if (shape.isTwinkle){
                shape.clearTwinkle();
            }
        });
    };
    this.locateShapes = function(bitNumberList){ //定位元件，入参原件binum数组
        var that = this;
        if(!this.raphaelScreen){
            return;
        }
        var xmin,ymin,xmax,ymax = null;
        bitNumberList.forEach(function(item,index){
            var shape = that.getGeometryByBitNumber(item);
            if (shape) {
                var o = shape.shape.getBBox();
                xmin = (xmin && o.x > xmin) ? xmin:o.x;
                ymin = (ymin && o.y > ymin) ? ymin:o.y;
                xmax = (xmax && o.x+o.width < xmax) ? xmax:o.x+o.width;
                ymax = (ymax && o.y+o.height < ymax) ? ymax:o.y+o.height;
            }
        });
        if(xmin||ymin||xmax||ymax){
            this.raphaelScreen.setViewBox(xmin-100,ymin-100,xmax+100,ymax+100);
            if(this.raphaelScreen.zoom  > 1){
                this.raphaelScreen.setZoom(1);
            }
            this.raphaelScreen.setCenter((xmin+xmax)/2,(ymin+ymax)/2);
        }
    };
    this.removeSelectShape = function () { //移除所有被选中的shape，返回移除的shape数量
        var list = this.getSelectShape();
        var number = list.length;
        for (var i = 0; i < number; i++) {
            var shape = list[i];
            shape.remove();
        }
        return number;
    };
    this.getGeometryAttribute = function () { //以数组的形式，返回每个shape的属性
        var list = [];
        for (var i = 0; i < this.shapeList.length; i++) {
            list.push(this.shapeList[i].getAttribute());
        }
        return list;
    };
    this.setShapeStateByBitNumberList = function (state, bitNumberList) {
        var that = this;
        bitNumberList.forEach(function (item, index) {
            var shape = that.getGeometryByBitNumber(item);
            if (shape) {
                shape.setState(state);
            }
        });
    };
    this.setShapeStateByShapeList = function (state, shapeList) {
        shapeList.forEach(function (shape, index) {
            shape.setState(state);
        });
    };
    this.setWarning = function (id, state) { //设定某个id的图形变成警告的颜色
        var shape = this.getGeometryById(id);
        if (shape) {
            shape.setWarning(state);
        }
        return this;
    };
    this.setAllWarning = function (state) { //设定个所有图形变成警告的颜色
        for (var i = 0; i < this.shapeList.length; i++) {
            var shape = this.shapeList[i];
            shape.setWarning(state);
        }
    };
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
    this.extent = null;
    this.extent2 = null;
    this.isextent2show = false;
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
                this.textRaphael = this.rephael;
                this.textShape2.click(textClick);
            }
            /**
             *  @ ls 20170927
             *  @ 文字边框跟随移动方法
             */
            // if (pageMeta.textSelectedStateRotate) {
            //     var box = pageMeta.textSelectedStateRotate.getBBox();
            //     var attr = pageMeta.textSelectedStateRotate.textExtent.attr({
            //         x: box.x - 10,
            //         y: box.y - 10,
            //         width: box.width + 20,
            //         height: box.height + 20,
            //     })
            // }


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
            if (this.facilityType != "FACILITY_CREATETEXT") {
                this.extent.show();
            }
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
    this.setTwinkle = function (color,nAllTime,nEachTime) { // 设置闪烁,入参闪烁颜色(默认红色)，闪烁总时长（默认无限），闪烁间隔（默认800毫秒）

        var that = this;

        if (this.timer) {
            clearInterval(this.timer);
        }
        nEachTime = nEachTime ? nEachTime : 800;
        var totalTime = 0;

        if(color){
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
            if(nAllTime && totalTime > nAllTime ){
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
    this.addJoinPoint = function (x, y){
      var box = this.shape.getBBox();
      this.customJoinPoint.push({"dx":x-box.x, "dy":y-box.y});

    },
    this.getDirection = function (box) {
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
        if(this.customJoinPoint.length > 0){
          for(var i=0; i<this.customJoinPoint.length; i++){
            pointList.push({x:box.x+this.customJoinPoint[i].dx, y:box.y+this.customJoinPoint[i].dy})
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
    // var textSetExtent = function (self) {
    //     if (isNutextxtent) {
    //         if (_this.textRotateAble) {
    //             var box = self.getBBox();
    //             self.textExtent = _this.textRaphael.rect(box.x - 10, box.y - 10, box.width + 20, box.height + 20, 4);
    //             self.textExtent.attr({
    //                 'stroke-dasharray': ['-'],
    //                 stroke: '#FF00FF',
    //             });
    //             self.textExtent.toBack();
    //             self.textExtent.show();
    //             _this.textExtentShow = true;
    //         }
    //     } else {
    //         if (_this.textRotateAble) {
    //             self.textExtent.show();
    //             var box = self.getBBox();
    //             self.textExtent.attr({
    //                 x: box.x - 10,
    //                 y: box.y - 10,
    //                 width: box.width + 20,
    //                 height: box.height + 20,
    //             })
    //             _this.textExtentShow = true;
    //         } else {
    //             self.textExtent.hide();
    //             _this.textExtentShow = false;
    //         }
    //     }
    // }
    var textClick = function () {
        _this.textRotateAble = true;
        // pageMeta.textSelectedState.push(this);
        // pageMeta.textSelectedStateRotate = this;
        //textSetExtent(this);
    };
};

//*******************************************************************************************************************************************

// 历史记录
HistoryBean = function () {
    var _this = this;
    this.type = '';
    this.datetime = new Date();
    this.actions = [];
};

//*******************************************************************************************************************************************

// 图形对象
ShapeBean = function () {
    var _this = this;
    GeometryBean.call(this);
    this.geometryType = ShapeConfig.GEOMETRY_POLYGON; // 多边形
    this.state = null,
        this.lineList = [];
    this.freeLineList = [];
    this.freeDirection = {
        x: 0,
        y: 0,
        differenceX: 0,
        differenceY: 0
    };
    this.hasBackShape = false;
    // this.backShape = null;
    // this.middleShapeType = ShapeConfig.SHAPE_RECT;
    // this.middleWidth = 6;
    // this.middleHeight = 6;
    // this.middleColor = '#999999';
    // this.middleFillColor = '#999999';

    this.shapeType = ShapeConfig.SHAPE_RECT; // 矩形
    this.border = 2;
    this.radius = 5;
    this.angle = 0;
    this.textAngle = 0;
    this.textAngle2 = 0;
    this.autoLine = false;
    this.opacity = 1;
    this.toTop = false;
    this.magnification = 1; //放大倍数
    this.setState = function (state) { //设置状态
        if (this.shape) {
            this.setShapeSrc(state);
            this.state = state;
        }
    };
    this.setShapeSrc = function (state) { //改变shape的图片
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
    this.getState = function () { //获取url里面的state
        var arr = this.color.split('/');
        var name = arr[arr.length - 1].split('.')[0];
        return newname = name.split('_')[1];
    };
    this.createShape = function () {
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
            //this.shape.click(shapeClick);

            this.shape.mouseover(function () {
                if (_this.overFun) {
                    _this.overFun(_this);
                }
            });
            this.shape.mouseout(function () {
                if (_this.outFun) {
                    _this.outFun(_this);
                }
                //$("#ConnectionPrompt").css("top", -10000).css("left", -10000).html("")
            });

            if (this.angle != 0) {
                this.shape.rotate(this.angle);
            };
            this.setExtent().unSelect();
            this.setExtent2().hideExtent2();
            if (this.shapeCollection) {
                this.shapeCollection.addShape(this);
            }
            // this.shape.click(function () {
            //     if (_this.hasBackShape) {
            //         var a = $.extend(true, {}, _this.freeDirection);
            //         var type = true;
            //         if (a.x != 0 && a.y != 0) {
            //             for (var i = 0; i < _this.freeLineList.length; i++) {
            //                 if (a == _this.freeLineList[i]) {
            //                     type = false;
            //                     break;
            //                 }
            //             }
            //             if (type) {
            //                 _this.freeLineList.push(a);
            //             }
            //             _this.freeDirection.x = 0;
            //             _this.freeDirection.y = 0;
            //         }
            //     }
            // });
        }
        return this;
    };
    this.moveTo = function () { //移动图形，重新设定其宽和高
        if (this.angle != 0) {
            this.shape.rotate(-this.angle);
        }
        //x,y为图形左上角的svg坐标点
        var x = this.x - getHalfWidth();
        var y = this.y - getHalfHeight();



        var att = this.shapeType == ShapeConfig.SHAPE_ELLIPSE ? {
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
        this.setExtent2();
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
                p2 = [{
                    x: line.mShape.x,
                    y: line.mShape.y
                }];
                resetEnd = false;
            } else if (line.endShape) {
                box2 = line.endShape.shape.getBBox();
            } else {
                p2 = [{
                    x: line.ex,
                    y: line.ey
                }];
            }
        } else if (line.endShape == this) {
            box2 = line.endShape.shape.getBBox();
            if (line.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {
                p1 = [{
                    x: line.mShape.x,
                    y: line.mShape.y
                }];
                resetBegin = false;
            } else if (line.beginShape) {
                box1 = line.beginShape.shape.getBBox();
            } else {
                p1 = [{
                    x: line.bx,
                    y: line.by
                }];
            }
        }
        if (box1) {
            p1 = [];
            p1.push({
                x: box1.x + box1.width / 2,
                y: box1.y
            });
            p1.push({
                x: box1.x + box1.width / 2,
                y: box1.y + box1.height
            });
            p1.push({
                x: box1.x,
                y: box1.y + box1.height / 2
            });
            p1.push({
                x: box1.x + box1.width,
                y: box1.y + box1.height / 2
            });
        }
        if (box2) {
            p2 = [];
            p2.push({
                x: box2.x + box2.width / 2,
                y: box2.y
            });
            p2.push({
                x: box2.x + box2.width / 2,
                y: box2.y + box2.height
            });
            p2.push({
                x: box2.x,
                y: box2.y + box2.height / 2
            });
            p2.push({
                x: box2.x + box2.width,
                y: box2.y + box2.height / 2
            });
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

        // 此处以后会添加自由点
        // 自由点的方位表示，要用百分比的方式
        // 此处改动会影响之前画的图
        // 待讨论

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

    var ox = 0;
    var oy = 0;
    var hasMove = false;
    /*
        要看懂下面这三个函数，先去看raphael文档的drag方法
    */
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
        var scale = _this.raphael._jas_scale || 1; //放大倍数
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
    // var shapeClick = function (e) {
    //     if (e.button === 2) return;
    //     console.log('触发点击事件', e);
    //     if (hasMove == false && _this.clickFun) {
    //         _this.clickFun(_this);
    //     }
    // };
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
    this.dasharray = ['30,30'];
    var lastSelectShape = null;
    // this.setPath = function (id) { //设置线条的四个点
    //     var cx1 = _this.c1x;
    //     var cy1 = _this.c1y;
    //     var cx2 = _this.c2x;
    //     var cy2 = _this.c2y;
    //     console.log(_this.c1x,_this.c1y,_this.c2x,_this.c2y)

    //     if (Math.abs(_this.ex - _this.bx) > Math.abs(_this.ey - _this.by)) {
    //         if (id == 1) {
    //             cx2 = cx1;
    //         } else {
    //             cx1 = cx2;
    //         }
    //         if (Math.abs(_this.by - _this.ey) <= 3 && id == 3) {
    //             _this.ey = _this.by;
    //         }
    //         if (Math.abs(_this.by - _this.ey) <= 3 && id == 0) {
    //             _this.by = _this.ey;
    //         }
    //         if (Math.abs(cx1 - _this.bx) <= 3) {
    //             cx1 = cx2 = _this.bx;
    //         }
    //         if (Math.abs(cx1 - _this.ex) <= 3) {
    //             cx1 = cx2 = _this.ex;
    //         }
    //         //cx1 = (_this.ex + _this.bx) / 2;
    //         cy1 = _this.by;
    //         //cx2 = (_this.ex + _this.bx) / 2;
    //         cy2 = _this.ey;
    //         _this.c1y = cy1;
    //         _this.c2y = cy2;
    //         _this.c1x = cx1;
    //         _this.c2x = cx2;
    //     } else {
    //         if (id == 1) {
    //             cy2 = cy1;
    //         } else {
    //             cy1 = cy2;
    //         }
    //         if (Math.abs(_this.bx - _this.ex) <= 3 && id == 3) {
    //             _this.ex = _this.bx;
    //         }
    //         if (Math.abs(_this.bx - _this.ex) <= 3 && id == 0) {
    //             _this.bx = _this.ex;
    //         }
    //         if (Math.abs(cy1 - _this.by) <= 3) {
    //             cy1 = cy2 = _this.by;
    //         }
    //         if (Math.abs(cy1 - _this.ey) <= 3) {
    //             cy1 = cy2 = _this.ey;
    //         }
    //         cx1 = _this.bx;
    //         //cy1 = (_this.ey + _this.by) / 2;
    //         cx2 = _this.ex;
    //         //cy2 = (_this.ey + _this.by) / 2;
    //         _this.c1y = cy1;
    //         _this.c2y = cy2;
    //         _this.c1x = cx1;
    //         _this.c2x = cx2;
    //     }
    //     this.path[0] = {
    //         x: this.bx,
    //         y: this.by
    //     };
    //     this.path[1] = {
    //         x: cx1,
    //         y: cy1
    //     };
    //     this.path[2] = {
    //         x: cx2,
    //         y: cy2
    //     };
    //     this.path[3] = {
    //         x: this.ex,
    //         y: this.ey
    //     };
    // };
    this.createShape = function () {
        if (this.raphael) {
            this.setPath();
            var path = this.getPath();
            //console.log(path)
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
            this.setExtent2().hideExtent2();
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
        this.setExtent2();
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
    this.setCenter = function () { //设定图形中心点的坐标
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

// 直线
LineBean = function () {
    var _this = this;
    PolyLineBean.call(this);
    this.geometryType = ShapeConfig.GEOMETRY_LINE;
    this.setPath = function () {
        this.path[0] = {
            x: this.bx,
            y: this.by
        };
        this.path[1] = {
            x: this.ex,
            y: this.ey
        };
    };
    this.getPath = function () {
        var path = ['M', this.path[0].x, this.path[0].y, 'L', this.path[1].x, this.path[1].y].join(',');
        return path;
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

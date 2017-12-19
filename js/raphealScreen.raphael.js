//*******************************************************************************************************************************************
/*
** 作者 ：creeated by GF on 2017.11.28
** 模块 ：RaphaelScreen 屏幕操作相关，放大缩小关于屏幕的相关操作
** 依赖 ：ShapeConfig,ShapeBean,PolyLineBean,CurveLineBean,LineBean
** 入参 ：obj = {
             'sId': '',
             'width': '',
             'height': '',
             'selectRectFn': ''
         }
*/
(function ($,document) {
    RaphaelScreen = function (obj) {

        this.zoom = 1;
        this.downKeyName = '';
        this.width = 5000;
        this.height = 5000;
        this.wrapperId = '';
        this.selectRectFn = function () {};
        this.dragingRectFn = function () {};
        this.$wrap = null;
        this.stateRange = ['normal', 'move', 'enlarge','paste','addPoint']; //当前鼠标的操作样式
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
            this.dragingRectFn = obj.dragingRectFn;
            this.dragingRectUpFn = obj.dragingRectUpFn;
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
            } else if(state === 'paste'){
                this.$svg.css("cursor", "url('icon/paste_01.png'),auto");
            }else if(state === 'addPoint'){
                this.$svg.css("cursor", "crosshair");
            }else {
                this.$svg.css("cursor", "");
            }
        },
        bindEvent: function () {
            var that = this;
            $(document).on('keydown', function (e) {
                that.downKeyName = e.key;
            }).on('keyup', function (e) {
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
                e.preventDefault();
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
                rectShape && rectShape.hide();
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
                    x1 = oloc.x;
                    y1 = oloc.y;
                    if (rectShape) {
                        rectShape = that.drawEnlargeRectangle(x0, y0, x1, y1,rectShape);
                        rectShape.show();
                    }else{
                        rectShape = that.drawEnlargeRectangle(x0, y0, x1, y1);
                        rectShape.attr({
                            'fill': '#00f',
                            'stroke': '#00f',
                            'stroke-width': '1',
                            'fill-opacity': 0.2,
                            'cursor' : 'auto'
                        });
                        var _dx = _dy = 0;
                        rectShape.drag(function(dx, dy, x, y, e){
                            e.stopPropagation();
                            var zoom = that.zoom;
                            dx = dx / zoom;
                            dy = dy / zoom;
                            rectShape = rectShape.attr({
                                x : x0+dx,
                                y : y0+dy
                            });
                            if(that.dragingRectFn) {
                                that.dragingRectFn(dx-_dx,dy-_dy);
                                _dx = dx;
                                _dy = dy;
                            }
                        },function(x, y, e){
                            var oBox = rectShape.getBBox();
                            x0 = oBox.x;
                            y0 = oBox.y;
                            _dx = _dy = 0;
                            e.stopPropagation();
                        },function( e){
                            that.dragingRectUpFn && that.dragingRectUpFn();
                            e.stopPropagation();
                        });
                    }
                };
                e.preventDefault();
            });
            this.$svgWrap.on('mouseup', function (e) {

                if (isDrawed && ['normal', 'enlarge'].indexOf(that.state) > -1) {
                    isDrawed = false;
                    if (!x0 || !y0 || !x1 || !y1) return;

                    if (that.state === 'normal') {
                        //console.log(x0, y0, x1, y1)
                        if (that.selectRectFn && rectShape) {
                            that.selectRectFn.bind(that)(rectShape, x0, y0, x1, y1);
                        }
                    }
                    if (that.state === 'enlarge') {
                        //console.log(x0, y0, x1, y1)
                        rectShape.hide();
                        that.setViewBox(x0, y0, x1, y1)
                    }
                    x0 = y0 = x1 = y1 = null;

                }
            });
        },
        drawEnlargeRectangle: function (x0, y0, x1, y1,rect) {
            var x = x0 > x1 ? x1 : x0;
            var y = y0 > y1 ? y1 : y0;
            var width = Math.abs(x0 - x1);
            var height = Math.abs(y0 - y1);
            if(rect){
                rect.attr({
                    x :x,
                    y : y,
                    width : width,
                    height : height
                });
                return rect;
            }
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
            this.setCenter((x0 + x1) / 2, (y0 + y1) / 2);
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
        },
    };
})($,document);

//*******************************************************************************************************************************************

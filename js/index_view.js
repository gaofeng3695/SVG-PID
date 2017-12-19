$(document).ready(function () {
    drawSvgObj.init();
    topToolsObj.init();
});

/*
 ** creeated by GF on 2017.11.28
 ** svg画布操作对象
 */
(function (window, Raphael, $, RaphaelScreen, ShapeConfig) {
    //creeated by GF on 2017.11.28
    window.drawSvgObj = {

        isHasData: false, //判断pid是否有数据
        isLoaded: false, //PID图是否加载完成

        raphael: null, //svg的raphael实例
        raphaelScreen: null, // svg放大缩小相关操作的实例
        collection: null, // 元件相关操作的的实例

        selectedShapeList: [], //选中的带位号的元件

        isCreateMarkerMode: false,
        marker: { //自定义标记
            url: '',
            width: 30,
            height: 30
        },

        init: function () {
            var that = this;
            this.raphaelScreen = new RaphaelScreen({
                'sId': 'holder',
                'width': 5000,
                'height': 5000,
                'collection': this.collection,
                'selectRectFn': this.selectShapeByRect.bind(this)
            });
            this.collection = new ShapeCollection(this.raphaelScreen);
            this.raphael = this.raphaelScreen.raphael;
            this.isloadRequestData();

            //this.raphaelScreen.setViewBox(0, 0, 5000, 2000);
            //this.raphaelScreen.setViewBox(400, 800, 800, 1400);

            this.bindEvent();

            // $.ajax({
            //     url: "data/" + 'cccc' + ".json",
            //     method: "get",
            //     async: true,
            //     success: function (res) {
            //         // var res = res.filter(function(item){
            //         //     return item.main_realtext;
            //         // });

            //         that.collection.setSvgSizeByShapes(res, true); //设定画布范围
            //         that.collection.createGeometrys(res, function (aShapeList) { //渲染图形
            //             aShapeList.forEach(function (shape) {
            //                 that.bindGeometryEvent(shape); //绑定图形事件
            //             });
            //             that.isLoaded = true;
            //         },true);
            //     }
            // });


        },
        isloadRequestData: function () {
            var that = this;

            var obj = localStorage.getItem("chosenStationNode");
            if (obj != "" && obj != null) {
                that.requestDataByStationId(JSON.parse(obj));
            }



        },
        requestDataByStationId: function (obj) {
            var that = this;
            if (obj.stationOid && obj.stationOid != "") {
                localStorage.setItem("stationOid", obj.stationOid);
                localStorage.setItem("lastStationName", obj.stationName);
                var query = {
                    stationId: obj.stationOid
                };
                that.requestData(query, function () {
                    that.changeState();
                });
            }
        },
        bindEvent: function () {
            var that = this;

            window.addEventListener("storage", function (value) { // 监听场站变化，刷新页面
                var obj = localStorage.getItem("chosenStationNode");
                if (obj) {
                    var lastStationName = localStorage.getItem("lastStationName");
                    if (!JSON.parse(obj).stationAreaOid && JSON.parse(obj).stationOid && lastStationName != JSON.parse(obj).stationName) {
                        window.location.reload(); //drawSvgObj.requestDataByStationId(JSON.parse(obj));
                    }
                }
            });

            this.raphaelScreen.$svgWrap.on('mouseup', function (e) {
                if (e.button === 0 && that.isCreateMarkerMode) {
                    var o = that.raphaelScreen.getSvgCoordinate(e.pageX, e.pageY);
                    that.createMarker(o.x, o.y);
                }
            });
        },
        requestData: function (query, fn) {
            var that = this;
            $.ajax({
                url: rootPath + "StationPidChart/getDetail.do",
                type: "POST",
                data: JSON.stringify(query),
                cache: false,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    //                    console.log(res)
                    if (res.code == "success") {
                        if (res.data && res.data.length > 0) {
                            that.isHasData = true; //判断是否有数据

                            var aShapes = JSON.parse(res.data);
                            //                            console.log(aShapes.length)
                            that.collection.setSvgSizeByShapes(aShapes, true); //设定画布范围
                            that.collection.createGeometrys(aShapes, function (aShapeList) { //渲染图形
                                aShapeList.forEach(function (shape) {
                                    that.bindGeometryEvent(shape); //绑定图形事件
                                });
                                that.isLoaded = true;
                                fn && fn(aShapeList);
                            }, true);
                        }
                    }
                }
            });
        },
        changeState: function () { // 设置阀门和线路的状态
            var that = this;
            var url = rootPath + 'stationBaseStatus/getGateAndGroup.do?stationOid=' + localStorage.getItem("stationOid");
            var ValveClosing = []; //所有关闭状态下的位号
            var roadStatusMain = []; //主路状态下的路的名称
            var roadStatusSide = []; //辅路状态下的路的名称
            var roadStatusUse = []; //在用状态下的路的名称
            var roadStatusDisable = []; //停用状态下的路的名称
            var roadStatusNull = []; //空状态下的路的名称
            $.ajax({
                url: url,
                method: "post",
                async: false,
                success: function (res) {
                    for (var i = 0; i < res.data.device.length; i++) {
                        var tapStatus = res.data.device[i].tapStatus;
                        if (tapStatus == '关') {
                            ValveClosing.push(res.data.device[i].deviceLocationNo);
                        }
                    };
                    for (var j = 0; j < res.data.group.length; j++) {
                        var status = res.data.group[j].status;
                        if (status == 1) {
                            roadStatusMain.push(res.data.group[j].groupName);
                        } else if (status == 2) {
                            roadStatusSide.push(res.data.group[j].groupName);
                        } else if (status == 3) {
                            roadStatusUse.push(res.data.group[j].groupName);
                        } else if (status == 4) {
                            roadStatusDisable.push(res.data.group[j].groupName);
                        } else if (status == -1) {
                            roadStatusNull.push(res.data.group[j].groupName);
                        }
                    }
                },
                error: function () {
                    console.log('请求失败');
                }
            });
            console.log('roadStatusMain：', roadStatusMain);
            console.log('roadStatusSide：', roadStatusSide);
            console.log('roadStatusUse：', roadStatusUse);
            console.log('roadStatusDisable：', roadStatusDisable);
            console.log('roadStatusNull：', roadStatusNull);
            console.log('ValveClosing：', ValveClosing);

            this.collection.setShapeStateByBitNumberList('002', ValveClosing);

            this.collection.setRoadsColor(roadStatusMain, 'green', '主路');
            this.collection.setRoadsColor(roadStatusSide, 'blue', '辅路');
            this.collection.setRoadsColor(roadStatusUse, 'green', '在用');
            this.collection.setRoadsColor(roadStatusDisable, '#333', '停用');

        },
        bindGeometryEvent: function (shape) {
            var that = this;

            var click_timeout = null;
            var click_timeStart = 0;

            var mouseover_timeout = null;

            shape.setMovable(false);
            shape.clickFun = function (shape) {

                var nowTime = new Date().getTime();

                //console.log('时间差',nowTime - click_timeStart)
                var disTime = nowTime - click_timeStart;

                if (!click_timeStart || (click_timeStart && disTime > 300)) {
                    click_timeStart = nowTime;
                    click_timeout = setTimeout(function () {
                        //console.log('触发单击')
                        click_timeStart = 0;
                        that.chooseGeometry(shape);
                    }, 300);
                } else {
                    if (disTime < 300) {
                        clearTimeout(click_timeout);
                    }
                }

                //that.chooseGeometry(shape);
            };
            shape.overFun = function (shape, e) {

                // console.log('准备弹出图层')
                clearTimeout(mouseover_timeout);
                mouseover_timeout = setTimeout(function () {
                    //console.log('弹出了图层')
                    that.showbubble(shape, e);
                }, 300);


            };
            shape.outFun = function (shape, e) {
                //console.log('隐藏了了图层')
                clearTimeout(mouseover_timeout);
                that.hidebubble(shape, e);
            };
            shape.dbClickFun = function (shape) {
                //console.log(shape)
                that.showModal(shape);
            };
        },

        showbubble: function (shape, e) {
            //            console.log('鼠标划上'+shape.bitNumber+'的元件',e);
            var bubble = this.bubblePanel;
            var oLoca = this.raphaelScreen.getScreenCoordinate(shape.x, shape.y);
            if (bubble) {
                bubble.show();
            } else {
                bubble = $('<div style="position:fixed;width:100px;border:1px solid black;background:#fff;word-wrap:break-word;"></div>');
                $('body').append(bubble);
                this.bubblePanel = bubble;
            }
            var sHtml = [
                '名称：' + (shape.facilityName || ''),
                '位号：' + (shape.bitNumber || '')

            ].join('<br/>');

            bubble.html(sHtml);
            bubble.css({
                top: oLoca.y - bubble.height() - shape.shape.getBBox().height * this.raphaelScreen.zoom / 2 - 5,
                left: oLoca.x - bubble.width() / 2,
            });
        },
        hidebubble: function (a) {
            //console.log('鼠标划出了'+a.bitNumber+'的元件');
            if (this.bubblePanel) {
                this.bubblePanel.hide();
            }
        },
        showModal: function (a) {
            console.log(a);
            if (a.facilityType == "FACILITY_CREATETEXT") {
                var technologyUrl = rootPath + 'technologyActionRecord/getDetail.do?';
                var stationId = localStorage.getItem("stationOid");
                var groupName = a.main_realtext;
                var data = {
                    stationId: stationId,
                    groupName: groupName
                };
                $.ajax({
                    url: technologyUrl,
                    method: "post",
                    async: false,
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (res) {
                        if (res.data != null) {
                            var objectId = res.data.oid;
                            var url = rootPath + 'system/technology/technology_record_view.html?code=' + objectId;
                            baseShow(objectId + "_view", "工艺基本信息详情", url, 900, 600);
                        } else {
                            baseMsg("当前工艺无数据");
                        }
                    },
                    error: function () {
                        console.log('请求失败');
                    }
                });
            } else if (a.bitNumber != null) {
                var switchUrl = rootPath + 'processChange/getDetail.do?';
                var bitNumber = a.bitNumber;
                var stationId = localStorage.getItem("stationOid");
                var data = {
                    stationId: stationId,
                    deviceLocationNo: bitNumber
                };
                $.ajax({
                    url: switchUrl,
                    method: "post",
                    async: false,
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    success: function (res) {
                        console.log(res);
                        if (res.data != null) {
                            var objectId = res.data.oid;
                            console.log(objectId);
                            var url = rootPath + 'system/device/devicecard/device_card_view.html?oid=' + objectId;
                            baseShow(objectId + "_view", '设备信息详情', url, 1000, 650);
                        } else {
                            baseMsg("当前设备无数据");
                        }
                    },
                    error: function () {
                        console.log('请求失败');
                    }
                });
            }
        },
        chooseGeometry: function (shape) { //点击选择元件

            if (this.raphaelScreen.downKeyName !== 'Control') {
                this.unselectAllShape(shape);
            }
            shape.reverseSelect(); //选中或者不选中
            this.setSelectedShapeList();
        },
        selectShapeByRect: function (rect) { //框选元件
            if (this.raphaelScreen.downKeyName !== 'Control') {
                this.unselectAllShape();
            }
            var obox = rect.getBBox();
            var ashape = this.collection.getGeometry(obox);
            ashape.forEach(function (item) {
                //if (item.bitNumber) {
                item.select();
                //}
            });
            if (ashape.length > 0) {
                this.setSelectedShapeList();
            };
            rect.hide();

        },
        unselectAllShape: function (shapeExcept) { //取消选中所有元件
            //console.log(shapeExcept)
            this.collection.getSelectShape().forEach(function (shape) {
                //                console.log(shapeExcept.bitNumber)
                if (shapeExcept && shapeExcept.id === shape.id) {
                    return;
                }
                shape.unSelect();
            });
        },
        setSelectedShapeList: function () { //设置选中的元件
            // var arr = this.collection.getSelectShape().filter(function (item) {
            //     return item.bitNumber;
            // });
            // this.selectedShapeList = arr;
            this.selectedShapeList = this.collection.getSelectShape();
            //console.log(arr)
        },
        locateAndTwinkleShapes: function (aBitNumberList, color, nTotleTime, nEachTime) { //定位和闪烁元件, 返回未找到的bitlist
            // {
            //     aBitNumberList : [], //位号
            //     color : 'green', //闪烁背景色
            //     nTotleTime : 5000, //闪烁总毫秒数
            //     nEachTime : 5000, //闪烁间隔毫秒数
            // }
            if (drawSvgObj.isHasData) {
                if (drawSvgObj.isLoaded) {
                    this.collection.locateShapes(aBitNumberList);
                    return this.collection.setTwinkleByBitNumberList(aBitNumberList, color, nTotleTime, nEachTime);
                } else {
                    baseMsg("加载中，请稍后操作。。。");
                }
            } else {
                baseMsg("当前无PID图");
            }

        },
        locateAreaByPointsList: function (aPonits) { // [{x,y}]
            this.collection.locateArea(aPonits);
        },
        openCreateMarkerMode: function (callback,url, width, height) {
            this.isCreateMarkerMode = true;
            this.marker.url = url || '';
            this.marker.width = width || 30;
            this.marker.height = height || 30;
            this.marker.callback = callback || null;
        },
        closeCreateMarkerMode: function () {
            this.isCreateMarkerMode = false;
            this.marker.url = '';
            this.marker.width = 30;
            this.marker.height = 30;
        },
        createMarker: function (x, y) { //svg x,y
            if (this.marker.url) {
                this.collection.createShape(this.marker.url, x, y, this.marker.width, this.marker.height);
            }
            this.closeCreateMarkerMode();
            //            console.log('当前坐标点位:', x, y)
            var re = {
                x: x,
                y: y
            };

            this.marker.callback && this.marker.callback(re);
            return re;
        },
        showOrHideBitNumber: function (isShow) {
            this.collection.shapeList.forEach(function (shape) {
                if (!shape.bitNumber) return;

                var textName = shape.bitNumber === shape.realtext ? 'textShape' : 'textShape2';

                if (!shape[textName]) return;

                if (isShow) {
                    shape[textName].show();
                    shape[textName + 'SandH'] = 'show';
                } else {
                    shape[textName].hide();
                    shape[textName + 'SandH'] = 'hide';
                }
            });
        }
    }

})(window, Raphael, $, RaphaelScreen, ShapeConfig);

/*
 ** creeated by GF on 2017.11.28
 ** 顶部工具栏对象
 ** 依赖 ： baseDialog
 */
(function (window, $, drawSvgObj) {
    window.topToolsObj = {
        elem: {
            stateIcon: '.stateIcon',
            dragIcon: '#DragBg',
            enlargeIcon: '#enlarge',
            viewallIcon: '#overallsituation',
            notwinkleIcon: '#Broom',
            removeSelectIcon: '#removeSelect',
            infosearch: '#infosearch',
            repairsearch: '#fixsearch',
            superiorsearch: '#superiorQuery',
            showmoreBtn: "#showmore",
            alarmBtn: "#abnormalBut",
            addworkBtn: "#doneadd",
            switchBtn: "#process_change",
            technicBtn: "#technology_record",
            bitShowBtn: ".bitShowBtn",
            refresh:'#refresh'
        },
        init: function () {
            this.initElem();

            this.bindEvent();
        },
        initElem: function () {
            var eles = this.elem;
            for (var name in eles) {
                if (eles.hasOwnProperty(name)) {
                    this[name] = $(eles[name]);
                }
            }
        },
        bindEvent: function () {
            var that = this;

            this.bindEvent_state();
            this.bindEvent_DateTimePicker();

            this.viewallIcon.on('click', function () { //看全图
                var aShapes = drawSvgObj.collection.shapeList;
                if (aShapes && aShapes.length > 0) {
                    drawSvgObj.collection.setSvgSizeByShapes(aShapes);
                }
                //drawSvgObj.raphaelScreen.setViewBox(0, 0, 5000, 3000);
            });
            this.notwinkleIcon.on('click', function () { //取消闪烁
                drawSvgObj.collection.clearTwinkle();
                drawSvgObj.collection.clearSelect();

            });
            // this.removeSelectIcon.on('click', function () { //取消选中
            //     drawSvgObj.unselectAllShape();
            // });
            // this.infosearch.on('click', function () { //
            //     that.specifiedQuery();
            // });
            // this.repairsearch.on('click', function () { //
            //     that.repairQuery();
            // });
            // this.superiorsearch.on('click', function () { //
            //     that.superiorQuery();
            // });
            // this.showmoreBtn.on('click', function () { //
            //     that.showmore();
            // });
            //this.alarmBtn.on('click', function () { //
            //that.AbnormalAlarm();
            //});
            this.bitShowBtn.on('click', function (e) { //
                drawSvgObj.showOrHideBitNumber(that.isHideBitNum);
                that.isHideBitNum = !that.isHideBitNum;
                var tips = that.isHideBitNum ? '显示位号' : '隐藏位号';
                $(e.target).html(tips);
            });
            this.addworkBtn.on('click', function () { //
                that.createWorkList();
            });
            this.switchBtn.on('click', function () { //
                that.changeSwitcher();
            });
            this.technicBtn.on('click', function () { //
                that.changeTechnic();
            });
            this.refresh.on('click', function () { //
            	drawSvgObj.changeState();
            });
        },
        bindEvent_DateTimePicker() {
            if ($.datetimepicker) {
                $("#startDate,#endDate").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    autoclose: true,
                    // minView: 'month',
                    minuteStep: 5,
                    todayHighlight: true
                })
            }
        },
        bindEvent_state: function () {
            var that = this;
            this.stateIcon.on('mouseover', function (e) {
                var image = e.currentTarget;
                image.src = image.src.replace('_01', '_02');
            });
            this.stateIcon.on('mouseout', function (e) {
                var image = e.currentTarget;
                image.src = image.src.replace('_02', '_01');
            });
            this.dragIcon.on('click', function (e) {
                var image = e.currentTarget;
                var state = drawSvgObj.raphaelScreen.state;
                removeAllStateStyle();
                if (state === 'move') {
                    drawSvgObj.raphaelScreen.setState(); //取消移动状态
                } else {
                    drawSvgObj.raphaelScreen.setState('move'); //设置状态为移动
                    image.src = image.src.replace('_02', '_03');
                    image.src = image.src.replace('_01', '_03');

                }
            });
            this.enlargeIcon.on('click', function (e) {
                var image = e.currentTarget;
                var state = drawSvgObj.raphaelScreen.state;
                removeAllStateStyle();
                if (state === 'enlarge') {
                    drawSvgObj.raphaelScreen.setState(); //取消状态
                } else {
                    drawSvgObj.raphaelScreen.setState('enlarge'); //设置状态
                    image.src = image.src.replace('_02', '_03');
                    image.src = image.src.replace('_01', '_03');
                }
            });
            var removeAllStateStyle = function () {
                that.stateIcon.each(function (index, image) {
                    image.src = image.src.replace('_03', '_01');
                    image.src = image.src.replace('_02', '_01');
                });
            }
        },
        specifiedQuery: function () { //pid图iframe中根据设备位号和设备编号查询
            return;
            if (deviceBaseTableQuery == null) {
                var deviceBaseTableQuery = {}; //基础信息表格查询条件对象
            }
            if (deviceRepairTableQuery == null) {
                var deviceRepairTableQuery = {}; //设备维修查询条件对象
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
            window.parent.$("#device-base-table").bootstrapTable('refresh', {
                silent: true
            });
            window.parent.$("#device-repair-table").bootstrapTable('refresh', {
                silent: true
            });
        },
        repairQuery: function () { //pid图iframe中根据设备位号和设备编号查询
            return;
            if (deviceRepairTableQuery == null) {
                var deviceRepairTableQuery = {}; //设备维修查询条件对象
            }
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();
            deviceRepairTableQuery.startDate = startDate;
            deviceRepairTableQuery.endDate = endDate;
            $.extend(window.parent.deviceRepairTableQuery, deviceRepairTableQuery);
            window.parent.$("#device-repair-table").bootstrapTable('refresh', {
                silent: true,
                query: deviceRepairTableQuery
            });
            window.parent.$('#device-info-table a[href="#device-repair-info"]').tab('show');
        },
        superiorQuery: function () { //高级查询
            var pageUrl = window.location.pathname;
            if (pageUrl == "/sim/jasframework/pipeline/index.html") {
                pageUrl = "/sim/system/device/devicecard/device_card_index.html";
            }
            var url = 'jasframework/querycolumn/query_panel.html?pageUrl=' + pageUrl + "&pageId=98";
            baseDialog("homepagePid", "统一查询", url, 700, 550, ['查询(Q)', '取消(C)'], ['search()']);
        },
        showmore: function () {
            if ($(".more").css("display") === "none") {
                $(".more").css("display", "block")
            } else {
                $(".more").css("display", "none")
            }
        },
        AbnormalAlarm: function (res) {
            var res = res;
            var abnormalArr = res.data.result;
            var arrClose = [];
            var arrOpen = [];
            var arr = [];
            var alarmObjs = [];

            for (i = 0; i < abnormalArr.length; i++) {
                if (abnormalArr[i].changeStatus == "关" && abnormalArr[i].deviceSteadyState == 0) {
                    arrClose.push(abnormalArr[i].deviceLocationNo);
                } else if (abnormalArr[i].changeStatus == "开" && abnormalArr[i].deviceSteadyState == 1) {
                    arrOpen.push(abnormalArr[i].deviceLocationNo);
                }
                arr.push(abnormalArr[i].deviceLocationNo);
            };

            if (drawSvgObj.isHasData) {
                if (drawSvgObj.isLoaded) {
                    if (this.isWarning) {
                        drawSvgObj.collection.clearTwinkle();
                        this.isWarning = false;
                    } else {
                        drawSvgObj.collection.locateShapes(arr);

                        drawSvgObj.collection.setTwinkleByBitNumberList(arrClose, 'red', null, null, true);
                        drawSvgObj.collection.setTwinkleByBitNumberList(arrOpen, 'yellow', null, null, true);

                        this.isWarning = true;
                    }
                } else {
                    baseMsg("加载中，请稍后操作。。。");
                }
            } else {
                baseMsg("当前无PID图");
            }
        },
        createWorkList: function () { //发起工单
            var numLength = drawSvgObj.selectedShapeList.length;
            if (drawSvgObj.isHasData) {
                if (drawSvgObj.isLoaded) {
                    if (numLength != 0) {
                        var type = drawSvgObj.selectedShapeList[0].facilityType;
                        if (type == "FACILITY_CREATETEXT") {
                            baseMsg("请选择元件");
                        } else {
                            var arr = drawSvgObj.selectedShapeList;
                            var Oid = localStorage.getItem("stationOid");
                            var arrString = [];
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i].bitNumber) {
                                    arrString.push(arr[i].bitNumber);
                                }
                            }
                            var string = arrString.join(); //将位号转化为字符串
                            var url = 'system/workflow/workflow_done_add.html?stationId=' + Oid + "&deviceLocationNos=" + string;
                            baseDialog(uuid(8), "新增工单信息", url, 900, 500, ['发起', '取消'], ['saveData()']);
                        }

                    } else {
                        baseMsg("请选择元件");
                    }
                } else {
                    baseMsg("加载中，请稍后操作。。。");
                }
            } else {
                baseMsg("当前无PID图");
            }
        },
        changeSwitcher: function () { //阀门开关
            var numLength = drawSvgObj.selectedShapeList.length;
            if (drawSvgObj.isHasData) {
                if (drawSvgObj.isLoaded) {
                    if (numLength == 0) {
                        baseMsg("请选择元件");
                    } else if (numLength != 1) {
                        baseMsg("只能选择一个元件");
                    } else {
                        var type = drawSvgObj.selectedShapeList[0].facilityType;
                        var bitNumber = drawSvgObj.selectedShapeList[0].bitNumber;
                        var Oid = localStorage.getItem("stationOid")
                        var url = 'system/device/processchange/process_change_add_edit.html?stationId=' + Oid + "&bitNumber=" + bitNumber;
                        if (bitNumber != null && bitNumber != '' && bitNumber != 'undefined') {
                            baseDialog(uuid(8), "阀门开关", url, 900, 600, ['发起', '取消'], ['saveData()']);
                        } else if (type == "FACILITY_CREATETEXT") {
                            baseMsg("请选择元件");
                        } else {
                            baseMsg("该元件没有位号");
                        }
                    }
                } else {
                    baseMsg("加载中，请稍后操作。。。");
                }
            } else {
                baseMsg("当前无PID图");
            }
        },
        changeTechnic: function () { //工艺转换
            var numLength = drawSvgObj.selectedShapeList.length;
            if (drawSvgObj.isHasData) {
                if (drawSvgObj.isLoaded) {
                    if (numLength != 0) {
                        var type = drawSvgObj.selectedShapeList[0].facilityType;
                        if (type == "FACILITY_CREATETEXT") {
                            var bitNumber = drawSvgObj.selectedShapeList[0].bitNumber;
                            var Oid = localStorage.getItem("stationOid");
                            var groupName = drawSvgObj.selectedShapeList[0].main_realtext;
                            var url = 'system/technology/technology_record_edit.html?stationId=' + Oid + "&groupName=" + encodeURI(groupName);
                            baseDialog(uuid(8), "工艺转换", url, 900, 500, ['发起', '取消'], ['saveData()']);
                        } else {
                            baseMsg("请选择工艺系统");
                        }
                    } else {
                        baseMsg("请选择工艺系统");
                    }
                } else {
                    baseMsg("加载中，请稍后操作。。。");
                }
            } else {
                baseMsg("当前无PID图");
            }
        },
    }
})(window, $, drawSvgObj);
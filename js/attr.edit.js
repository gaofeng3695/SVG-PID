/**
 * 作者 ：Created by DX on 2017.12.06
 * 模块 ：attrObj 属性编辑模块
 *：attrObj.showAttrPanel(shape)进行属性框的显示    shape是选中的元器件对象
 *：attrObj.hiddenAttrPanel()  进行属性框的隐藏
 */

(function (window, $, facilityConfig, attributeConfig) {
    window.attrObj = {
        attributepanel: $("#attributepanel"), //控制整个表格是否显示
        attributeview: $("#attributeview"),
        attributemove: false, //用于属性框的移动
        attributeclick: false, //鼠标头部的点击事件
        selectShape: null, //选中的图形对象
        isShowAndHiddenAttr: true,
        objMouse: {}, //记录鼠标的坐标点
        isInit: true,
        init: function (editSvgObj) {
            this.bindEvent();
            this.editSvgObj = editSvgObj;
        },
        eventsMap: {
            'mousedown #attributeheader': 'attrTableMousedown',
            'mousemove body': 'attrTableMove',
            'mouseup body': 'attrTableMouseup',
        },
        bindEvent: function () {
            var that = this;
            var obj = {}; //记录当前坐标位置
            this.initializeOrdinaryEvent(this.eventsMap);
            //属性框适应页面大小
            $(window).bind("resize", function () {
                that.attributepanelStyle($(window).width() - 230, 70);
            });
            //按钮相关事件
            $("#attributeTable").on("click", '.submitShapeAttr', function () {
                that.setShapeAttr();
            });
            $("#attributeTable").on("click", '.toggleShowAndHidden', function (e) {
                that.toggleSAH(e);
            });
        },
        initializeOrdinaryEvent: function (maps) {
            this._scanEventsMap(maps, true);
        },
        _scanEventsMap: function (maps, isOn) {
            var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            var type = isOn ? 'on' : 'off';
            for (var keys in maps) {
                if (maps.hasOwnProperty(keys)) {
                    if (typeof maps[keys] === 'string') {
                        maps[keys] = this[maps[keys]].bind(this);
                    }
                    var matchs = keys.match(delegateEventSplitter);
                    $(document)[type](matchs[1], matchs[2], maps[keys]);
                }
            }
        },
        showAttrPanel: function (shape) {
            if (!facilityConfig[shape.facilityType]) return;
            var attributeList = facilityConfig[shape.facilityType].attribute;
            this.selectShape = shape;
            if (this.attributepanel.css('left') != "auto") {
                this.attributepanelStyle(this.attributepanel.css('left'), this.attributepanel.css('top'));
            } else {
                this.attributepanelStyle($(window).width() - 230, 70);
            }
            this.drawAttrPanel(attributeList);
        },
        drawAttrPanel: function (attributeList) {
            var that = this;
            var table = $('#attributeTable');
            table.html(""); //每次进行属性渲染之前 进行清空
            var html = "";
            for (var i = 0; i < attributeList.length; i++) {
                var shapeAttr = attributeConfig[attributeList[i]];
                html += '<tr>';
                html += '<td style="width: 60px;">' + shapeAttr.label + '</td>';
                html += '<td>';
                if (shapeAttr.inputtype == "input") {
                    if (shapeAttr.type == "int") {
                        html += '<input name="' + shapeAttr.name + '" type="number" min="1" max="10" style="width: 100%; height: 23px; font-size: 10px;">';
                    } else if (shapeAttr.type == "string" && shapeAttr.color == "color") {
                        html += '<input name="' + shapeAttr.name + '" class="select-color" type="text" value="#000000" style="width: 100%; height: 23px; font-size: 10px;" >';
                    } else if ((that.selectShape.facilityType != 'FACILITY_CREATETEXT') && (shapeAttr.label == "名称" || shapeAttr.label == "位号" || shapeAttr.label == "长度km" || shapeAttr.label == "线径mm")) {
                        html += '<input name="' + shapeAttr.name + '" type="text" style="width: 70%; height: 16px; font-size: 10px;"><input type="button" class="toggleShowAndHidden ' + shapeAttr.name + '" value="隐藏">';
                    } else {
                        html += '<input name="' + shapeAttr.name + '" type="text" style="width: 100%; height: 23px; font-size: 10px;">';
                    }
                }
                if (shapeAttr.inputtype == "select") {
                    html += '<select name="' + shapeAttr.name + '" type="select-one" style="width: 100%; height: 23px; font-size: 10px;">';
                    for (var b = 0; b < shapeAttr.item.length; b++) {
                        html += '<option value="' + shapeAttr.item[b].value + '">' + shapeAttr.item[b].label + '</option>';
                    }
                    html += '</select>';
                }
                html += '</td>';
                html += '</tr>';
            }
            html += '<tr><td colspan="2"><input type="button" value="确定" class="submitShapeAttr"></td></tr>';
            table.append(html);
            $(".select-color").simpleColor({
                displayColorCode: true
            });
            for (var j = 0; j < attributeList.length; j++) {
                var shapeAttr = attributeConfig[attributeList[j]];
                if (shapeAttr.name == "stroke-width" || shapeAttr.name == "edgeBorder") {
                    that.setValue(shapeAttr.name, 0, that.selectShape["border"]);
                } else {
                    that.setValue(shapeAttr.name, 0, that.selectShape[shapeAttr.name]);
                }
                if (shapeAttr.name == "textColor" || shapeAttr.name == "text2Color" || shapeAttr.name == "color" || shapeAttr.name == "linecolor" || shapeAttr.name == "fillColor") {
                    that.setValue(shapeAttr.name, 0, that.selectShape[shapeAttr.name]);
                    var a = $("input[name=" + shapeAttr.name + "]+.simpleColorContainer>.simpleColorDisplay");
                    a.html(that.selectShape[shapeAttr.name]).css("background-color", that.selectShape[shapeAttr.name]);
                }
                if (shapeAttr.name == "magnification") {
                    that.selectShape[shapeAttr.name] == undefined ? 1 : that.selectShape[shapeAttr.name];
                    that.setValue(shapeAttr.name, 0, Number(that.selectShape[shapeAttr.name]));
                }
                if (shapeAttr.name == "text" && that.selectShape.facilityType == 'FACILITY_CREATETEXT') {
                    that.setValue(shapeAttr.name, 0, that.selectShape["main_realtext"]);
                }
            }
            that.attributepanel.show();
            that.attributeview.show();
        },
        hiddenAttrPanel: function () { //隐藏
            $("#attributepanel").css("display", "none");
        },
        /**
         *  设置图形的属性
         */
        setShapeAttr: function () {
            var that = this;
            if (!that.selectShape || that.editSvgObj.collection.getSelectShape()[0] !== that.selectShape) {
                this.hiddenAttrPanel();
                return;
            }

            if (!facilityConfig[that.selectShape.facilityType]) return;
            var attributeList = facilityConfig[that.selectShape.facilityType].attribute;
            var realtext = ""; //图例真实显示的名称
            var realtext2 = "";

            for (var i = 0; i < attributeList.length; i++) {
                var shapeAttrObj = attributeConfig[attributeList[i]];
                if (shapeAttrObj.name == "magnification") { //针对元器件的放大功能
                    that.selectShape.width = that.selectShape.width / that.selectShape.magnification;
                    that.selectShape.height = that.selectShape.height / that.selectShape.magnification;
                }
                that.selectShape[shapeAttrObj.name] = $("input[name='" + shapeAttrObj.name + "']").val();
                //设置字体的大小
                if (shapeAttrObj.name == "textSize" || shapeAttrObj.name == "text2Size" || shapeAttrObj.name == "textFamily" || shapeAttrObj.name == "text2Family") {
                    that.selectShape.textSize = $("select[name='textSize']").find("option:selected").val();
                    that.selectShape.text2Size = $("select[name='text2Size']").find("option:selected").val();
                    that.selectShape.textFamily = $("select[name='textFamily']").find("option:selected").val();
                    that.selectShape.text2Family = $("select[name='text2Family']").find("option:selected").val();
                }
                //修改线宽的方法
                if (shapeAttrObj.name == "stroke-width") {
                    var swVal = Number($("select[name='" + shapeAttrObj.name + "']").val());
                    that.selectShape.shape.attr({
                        "stroke-width": $("select[name='" + shapeAttrObj.name + "']").val()
                    });
                    that.selectShape.border = swVal
                    that.selectShape.bShape.shape.attr("rx", swVal)
                    that.selectShape.bShape.shape.attr("ry", swVal)
                }
                //修改元器件的放大
                if (shapeAttrObj.name == "magnification") {
                    that.selectShape.magnification = that.selectShape.magnification > 10 ? 10 : that.selectShape.magnification;
                    that.selectShape.magnification = that.selectShape.magnification < 1 ? 1 : that.selectShape.magnification;
                    that.selectShape.width = that.selectShape.width * that.selectShape.magnification;
                    that.selectShape.height = that.selectShape.height * that.selectShape.magnification;
                }
                //颜色的修改
                if (shapeAttrObj.name == "color") {
                    var colorVal = $("input[name='" + shapeAttrObj.name + "']").val();
                    that.selectShape.color = colorVal;
                    that.selectShape.fillColor = colorVal;
                    that.selectShape.shape.attr("stroke", colorVal);
                    that.selectShape.bShape.shape.fill = colorVal;
                    that.selectShape.bShape.shape.stroke = colorVal;
                    that.selectShape.eShape.shape.fill = colorVal;
                    that.selectShape.eShape.shape.stroke = colorVal;
                    that.selectShape.bShape.shape.attr({
                        "fill": colorVal,
                        "stroke": colorVal
                    });
                    that.selectShape.eShape.shape.attr({
                        "fill": colorVal,
                        "stroke": colorVal
                    });
                }
            }
            //线条显示 长度*管径
            if (that.selectShape.geometryType == ShapeConfig.GEOMETRY_POLYLINE || that.selectShape.geometryType == ShapeConfig.GEOMETRY_CURVELINE) {

                //站内的管道不显示 长度和管径$("input[name='" + shapeAttrObj.name + "']").val()
                if (!isNull($("input[name='diameter']").val()) && !isNull($("input[name='length']").val())) {
                    realtext = $("input[name='length']").val() + "km";
                    realtext2 = $("input[name='diameter']").val() + "mm";
                } else if (isNull($("input[name='diameter']").val()) && isNull($("input[name='length']").val())) {
                    realtext = "";
                    realtext2 = "";
                } else if (isNull($("input[name='length']").val())) {
                    realtext = $("input[name='diameter']").val() + "mm";
                    realtext2 = "";
                } else {
                    realtext = "";
                    realtext2 = $("input[name='length']").val() + "km";
                }
                realLinetext = $("input[name='text']").val();
            } else if (that.selectShape.facilityType == 'FACILITY_CREATETEXT') { //如果元器件是字体的话
                that.selectShape["main_realtext"] = $("input[name='text']").val();
                that.selectShape["main_textFamily"] = $("select[name='textFamily']").find("option:selected").val();
                that.selectShape["main_textSize"] = $("select[name='textSize']").find("option:selected").val();
                that.selectShape["color"] = $("input[name='textColor']").val();
            } else if (that.selectShape.facilityType == 'FACILITY_SOLIDPOINT') { //如果元器件是连接点
                that.selectShape["color"] = $("input[name='linecolor']").val();
                that.selectShape["fillColor"] = $("input[name='fillColor']").val();
                that.selectShape["border"] = $("select[name='edgeBorder']").val();
            } else { //基本元件显示 名字和位号
                realtext = $("input[name='text']").val();
                realtext2 = $("input[name='bitNumber']").val();
            }
            that.selectShape['realtext'] = realtext;
            that.selectShape['realtext2'] = realtext2;
            that.selectShape.moveTo(); //调用moveTo  此时属性已经改变 只是去渲染页面

            that.editSvgObj.history && that.editSvgObj.history.save();

        },
        /**
         * 点击显隐 控制
         */
        toggleSAH: function (e) {
            var that = this;
            var th = e.target;
            var name = th.previousElementSibling.value;
            var text1 = $(that.selectShape.textShape[0]).text();
            var text2 = $(that.selectShape.textShape2[0]).text();
            if (that.selectShape.geometryType == "GEOMETRY_POLYLINE") {
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
                    that.selectShape.textShape.hide();
                    that.selectShape.realtextSandH = "hide";
                } else if (name == text2) {
                    that.selectShape.textShape2.hide();
                    that.selectShape.realtext2SandH = "hide";
                }
            } else {
                th.value = "隐藏"
                if (name == text1) {
                    that.selectShape.textShape.show();
                    that.selectShape.realtextSandH = "show";
                } else if (name == text2) {
                    that.selectShape.textShape2.show();
                    that.selectShape.realtext2SandH = "show";
                }
            }
            that.history.save();
        },
        attributepanelStyle: function (left, top) {
            $("#attributepanel").css({
                'left': left,
                'top': top
            });
        },
        /**
         * 初始化的时候，进行页面的渲染
         */
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
        /**
         * 属性表格的移动
         */
        attrTableMousedown: function (e) {
            var that = this;
            that.attributemove = true;
            that.attributeclick = true;
            that.objMouse.attr_start_x = parseInt(that.attributepanel.css('left').replace('px', ''));
            that.objMouse.attr_start_y = parseInt(that.attributepanel.css('top').replace('px', ''));
            that.objMouse.attr_mouse_x = e.pageX;
            that.objMouse.attr_mouse_y = e.pageY;
        },
        attrTableMove: function (e) {
            var that = this;
            if (that.attributemove) {
                // console.log("移动")
                that.attributeclick = false;
                var x = e.pageX - that.objMouse.attr_mouse_x + that.objMouse.attr_start_x;
                var y = e.pageY - that.objMouse.attr_mouse_y + that.objMouse.attr_start_y;
                if (y > 33) {
                    that.attributepanelStyle(x, y);
                } else {
                    that.attributepanelStyle(x, 33);
                }
            }
        },
        attrTableMouseup: function (e) {
            var that = this;
            // console.log(that.attributeclick);
            if (that.attributemove) {
                that.attributemove = false;
                if (that.attributeclick && that.isShowAndHiddenAttr) {
                    that.isShowAndHiddenAttr = false;
                    that.attributeview.hide();
                    // $("#attributeview").css("display", "none");
                } else {
                    that.isShowAndHiddenAttr = true;
                    that.attributeview.show();
                    // $("#attributeview").css("display", "block");
                }
            }
        }
    };
})(window, $, facilityConfig, attributeConfig);
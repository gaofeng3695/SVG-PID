$(document).ready(function () {
	//stationPid.init();
	editSvgObj.init();
	dragIocnObj.init(editSvgObj);
	topToolsObj.init(editSvgObj);
});

/*
 *   creeated by DX on 2017.12.12 针对业务相关对象
 */
(function (window) {
	window.stationPid = {
		init: function () {
			this.initStation();
			this.bindEvent();
		},
		bindEvent: function () {
			window.addEventListener("storage", function (value) {
				var str = localStorage.getItem("chosenStationNode");
				if (str) {
					var obj = JSON.parse(str);
					this.loadSelect(obj.stationOid);
				}
			});
		},
		initStation: function () {
			var str = localStorage.getItem("chosenStationNode");
			if (str) {
				var obj = JSON.parse(str);
				if (obj.stationOid && obj.stationName) {
					this.loadSelect(obj.stationOid);
				} else {
					baseMsg("请选择具体的场站");
				}
			} else {
				baseMsg("请选择具体的场站");
			}
		},
		loadSelect: function (stationOid) {
			var that = this;
			$.ajax({
				url: rootPath + "stationPidVersion/getVersions.do",
				type: "POST",
				data: JSON.stringify({
					"stationId": stationOid
				}),
				cache: false,
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				success: function (res) {
					if (res.code == "success") {
						if (res.data.length > 0) {
							that.renderSelect(res.data);
						}
					}
				}
			});
		},
		renderSelect: function (data) {
			var str = "";
			$("#selectStationPidVersion").html("");
			data.forEach(function (value, index) {
				str += "<option value='" + value.oid + "'>" + value.pidVersionName + "</option>"
			});
			$("#selectStationPidVersion").append(str);
			//根据选中的PID版本进行绘制
			this.renderPidChartByversionId($("#selectStationPidVersion").val());
		},
		renderPidChartByversionId: function (versionId) {
			$.ajax({
				url: rootPath + "stationPidVersion/getVersions.do",
				type: "POST",
				data: JSON.stringify({
					"stationId": stationOid
				}),
				cache: false,
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				success: function (res) {
					if (res.code == "success") {
						if (res.data.length > 0) {
							that.renderSelect(res.data);
						}
					}
				}
			});
		}
	}
}(window));
/*
 * * creeated by GF on 2017.12.04 * svg画布操作对象
 */
(function (window, Raphael, $, RaphaelScreen, attrObj) {
	// creeated by GF on 2017.11.28
	window.editSvgObj = {
		raphael: null, // svg的raphael实例
		raphaelScreen: null, // svg放大缩小相关操作的实例
		collection: null, // 元件相关操作的的实例

		selectedShapeList: [],

		init: function () {
			this.initRaphael();
		},
		initRaphael: function () {
			var that = this;
			this.raphaelScreen = new RaphaelScreen({
				'sId': 'holder',
				'width': 5000,
				'height': 5000,
				'collection': this.collection,
				'selectRectFn': this.selectShapeByRect.bind(this),
				'dragingRectFn': this.moveShapes.bind(this)
			});
			this.collection = new ShapeCollection(this.raphaelScreen);

			this.raphael = this.raphaelScreen.raphael;
			this.requestData();
			// this.raphaelScreen.setViewBox(0, 0, 2000, 2000);
			// this.raphaelScreen.setViewBox(400, 800, 800, 1400);
		},
		bindShapeEvent: function (shape) {
			var that = this;
			shape.setMovable(true);
			shape.clickFun = function (shape) {
				that.chooseGeometry(shape);
			};
			shape.overFun = function (shape) {
				if (shape.raphaelScreen.state !== 'addPoint')
					return;
				shape.showConnectPoints();
				shape.shape.attr({
					cursor: 'crosshair'
				});
			};
			shape.outFun = function (shape) {
				if (shape.raphaelScreen.state !== 'addPoint')
					return;
				shape.hideConnectPoints();
				shape.shape.attr({
					cursor: ''
				});
			};

		},
		chooseGeometry: function (shape) { // 点击选择元件
			if (this.raphaelScreen.downKeyName !== 'Control') {
				this.unselectAllShape(shape);
			}
			shape.reverseSelect(); // 选中或者不选中
			this.setSelectedShapeList();
		},
		unselectAllShape: function (shapeExcept) { // 取消选中所有元件
			// console.log(this.collection.getSelectShape())
			this.collection.getSelectShape().forEach(function (shape) {
				if (shapeExcept && shapeExcept.id === shape.id) {
					return;
				}
				shape.unSelect();
			});
		},
		setSelectedShapeList: function () { // 设置选中的元件
			// var arr = this.collection.getSelectShape().filter(function (item)
			// {
			// return item.bitNumber;
			// });
			this.selectedShapeList = this.collection.getSelectShape();
			if (this.selectedShapeList.length === 1) {
				attrObj.showAttrPanel(this.selectedShapeList[0]);
			} else {
				attrObj.hiddenAttrPanel();
			}
			// console.log(this.selectedShapeList)
		},
		selectShapeByRect: function (rect) { // 框选元件
			if (this.raphaelScreen.downKeyName !== 'Control') {
				this.unselectAllShape();
				this.selectedShapeList = [];
			}
			var obox = rect.getBBox();
			var ashape = this.collection.getGeometry(obox);
			ashape.forEach(function (item) {
				item.select();
			});
			this.setSelectedShapeList();
			// console.log('框选：',this.selectedShapeList)
			// rect.hide();
		},
		moveShapes: function (dx, dy) {
			// console.log('this.selectedShapeList', this.selectedShapeList)
			if (this.selectedShapeList.length > 0) {
				this.collection.moveShapes(this.selectedShapeList, dx, dy);
			}
		},
		requestData: function (fn) {
			var that = this;
			var station = "bbbb" || localStorage.getItem("stationFullName");
			/** ********************************** */
			$.ajax({
				url: "data/" + station + ".json",
				method: "get",
				async: true,
				success: function (res) {
					that.collection.setSvgSizeByShapes(res, true);

					// var res2 = res.filter(function(shape){
					// 	return shape.textSize > 22
					// });
					// console.log(JSON.stringify(res2))
					that.collection.createGeometrys(res, function (aShapeList) {
						console.log('开始绑定事件',new Date())
						aShapeList.forEach(function (shape) {
							that.bindShapeEvent(shape);
						});
						that.isLoaded = true;
						console.log('加载完成')
						fn && fn(aShapeList);
					});
				}
			});
		},
	}
})(window, Raphael, $, RaphaelScreen, attrObj);

/*
 * * 作者：creeated by GF on 2017.12.07 * 模块：生成图形模块，拖拽icon生成图形 * 依赖 ：ShapeConfig,
 * Accordion, facilityConfig * 入参 editSvgObj
 */
(function (window, $, ShapeConfig, Accordion, facilityConfig) {
	window.dragIocnObj = {
		init: function (editSvgObj) {
			this.renderImgIcons();
			this.bindEvent();
			this.collection = editSvgObj.collection;
			this.raphaelScreen = editSvgObj.raphaelScreen;
			this.editSvgObj = editSvgObj;

		},
		bindEvent: function () {
			this.bindEvent_Accordion();
			this.bindEvent_dragIcon();
		},
		bindEvent_Accordion: function () { // 使用手风琴插件
			var that = this;
			var accordion = new Accordion($('#accordion'), false);
			var setAccordionMenuHeight = function () { // 设置手风琴展开区域的高度
				var outHeight = $('.toolWrapp').height();
				var nlist = $(".accordion>li").length;
				var listHeight = $(".accordion>li>.link").outerHeight();
				var openHeight = outHeight - listHeight * nlist - 4; // 4为ul的border值
				$("#accordion .submenu").outerHeight(openHeight + "px");
			};
			setAccordionMenuHeight();
			$(".accordion>li>.link").first().trigger('click'); // 默认展开第一个菜单
			$(window).on('resize', function () {
				setAccordionMenuHeight();
			})
		},
		bindEvent_dragIcon: function () { // 绑定从工具栏中拖动icon,在svg上画图形
			var that = this;
			// var x_start = 0;
			// var y_start = 0;
			var oIcon = null;
			var isIconMoving = false;
			var iconImg = $('<img id="selectpanel" style="position: absolute; top: -100px; left: -100px; cursor: default; z-Index: 9999;">')

			$('.js_imgtool').on('mousedown', function (e) {
				isIconMoving = true;

				var ft = $(e.currentTarget).attr('data-id');
				oIcon = facilityConfig[ft];
				iconImg.css({
					width: oIcon.svgWidth,
					height: oIcon.svgHeight,
					top: e.pageY - oIcon.svgHeight / 2,
					left: e.pageX - oIcon.svgWidth / 2
				}).attr('src', oIcon.url);

				if ($('#selectpanel').length) {
					iconImg.show();
				} else {
					$('body').append(iconImg);
				}
			});
			$(document).on('mousemove', function (e) { // 移动img
				if (isIconMoving) {
					iconImg.css({
						top: e.pageY - oIcon.svgHeight / 2,
						left: e.pageX - oIcon.svgWidth / 2
					});
				}
				e.preventDefault();
			});
			$(document)
				.on(
					'mouseup',
					function (e) {
						if (!isIconMoving)
							return;
						isIconMoving = false;
						iconImg.hide();

						var oLoc = that.raphaelScreen.getSvgCoordinate(
							e.pageX, e.pageY);
						if (!oLoc)
							return;
						var x = oLoc.x;
						var y = oLoc.y;
						var shape = null;
						if (oIcon.geometryType === 'GEOMETRY_POLYGON') {
							shape = that.collection
								.createShape(oIcon.url, x, y,
									oIcon.svgWidth,
									oIcon.svgHeight,
									oIcon.facilityType,
									oIcon.shapeType);
						} else if (oIcon.geometryType === 'GEOMETRY_POLYLINE' ||
							oIcon.geometryType === 'GEOMETRY_LINE') {
							shape = that.collection.createLine(
								oIcon.lineType, oIcon.dasharray,
								x - 40, y, oIcon.facilityType,
								"#000", "#000", 3, 2);
						} else if (oIcon.facilityType == ShapeConfig.LINE_WIRE) {
							shape = that.collection.createWireLine(
								x - 40, y, oIcon.facilityType);
						} else if (oIcon.geometryType == ShapeConfig.GEOMETRY_TEXT) {
							shape = that.collection.createText('A', x,
								y, '#000', oIcon.facilityType);
						}
						that.editSvgObj.bindShapeEvent(shape);
					});
		},
		renderImgIcons: function () {
			var oIconsConfig = {
				icon_basic: ['FACILITY_BAV', 'FACILITY_GAV', 'FACILITY_GLV',
					'FACILITY_THV', 'FACILITY_FM', 'FACILITY_FA',
					'FACILITY_BUV', 'FACILITY_CHV', 'FACILITY_NV',
					'FACILITY_SV', 'FACILITY_PSV', 'FACILITY_FV',
					'FACILITY_FXC', 'FACILITY_ZS', 'FACILITY_FC',
					'FACILITY_E', 'FACILITY_EV', 'FACILITY_ELV',
					'FACILITY_SHAPE3', 'FACILITY_IJ', 'FACILITY_M',
					'FACILITY_PL', 'FACILITY_EU', 'FACILITY_F',
					'FACILITY_SHAPE1', 'FACILITY_SHAPE2', 'FACILITY_FEBO',
					'FACILITY_FEBC', 'FACILITY_SHAPE4', 'FACILITY_FST',
					'FACILITY_SHAPE54', 'FACILITY_SHAPE55',
					'FACILITY_SHAPE57', 'FACILITY_SHAPE58',
					'FACILITY_SHAPE59', 'FACILITY_SHAPE60',
					'FACILITY_SHAPE61', 'FACILITY_SHAPE62',
					'FACILITY_SHAPE53'
				],
				icon_line: ['LINE_BLACK_BOLD', 'LINE_CONNECTIONLINE',
					'LINE_ACTUALBROKENLINE', 'LINE_IMAGINARYFOLDLINE',
					'LINE_WIRE', 'FACILITY_SOLIDPOINT', 'FACILITY_FONTS'
				],
				icon_other: ['FACILITY_CYAN_MARK', 'FACILITY_RED_MARK',
					'FACILITY_MARK', 'FACILITY_TRIANGLE_MARK',
					'FACILITY_GROUND', 'FACILITY_TRIANGLE',
					'FACILITY_LEFT_MARK1', 'FACILITY_RIGHT_MARK1',
					'FACILITY_LEFT_MARK2', 'FACILITY_RIGHT_MARK2',
					'FACILITY_ARROW63', 'FACILITY_ARROW64',
					'FACILITY_ARROW65', 'FACILITY_ARROW66',
					'FACILITY_ARROW67', 'FACILITY_ARROW68',
					'FACILITY_ARROW69', 'FACILITY_ARROW70',
					'FACILITY_ARROW75'
				]

			};
			var createEachIconHtml = function (facilityType) {
				var oImg = facilityConfig[facilityType];
				if (!oImg) {
					console.log('未找到设备：', facilityType)
					return '';
				}
				var colspan = facilityType === 'FACILITY_SHAPE53' ? 2 : 1;
				return [
						'<td title="' + oImg.name + '"  colspan="' + colspan +
						'" class="js_imgtool" data-id="' +
						facilityType + '">',
						'<img style="width: ' + (oImg.iconWidth || 36) +
						'px; height: ' + (oImg.iconHeight || 18) +
						'px;" src="' + oImg.url + '">', '</td>',
					]
					.join('');
			};
			var createHtml = function (aIcons) {
				var sHtml = '';
				aIcons.forEach(function (item, index, arr) {
					if (index % 2 === 0) { // 偶数位，从0开始
						var td01 = createEachIconHtml(item);
						if (index + 1 !== arr.length) {
							var td02 = createEachIconHtml(arr[index + 1]);
						}
						sHtml += ['<tr>', td01, td02 || '', '</tr>', ]
							.join('');
					}
				});
				return sHtml;
			};
			for (var name in oIconsConfig) {
				if (oIconsConfig.hasOwnProperty(name)) {
					var sHtml = createHtml(oIconsConfig[[name]]);
					$('.' + name).html(sHtml);
				}
			}

		},
	}
})(window, $, ShapeConfig, Accordion, facilityConfig);

/**
 * 作者：creeated by GF on 2017.11.28 模块：顶部工具栏对象 依赖：window, $ 入参：editSvgObj
 */
(function (window, $) {
	window.topToolsObj = {
		elem: {
			stateIcon: '.stateIcon',
			dragIcon: '#DragBg',
			enlargeIcon: '#enlarge',
			viewallIcon: '#overallsituation',

			repairsearch: '#fixsearch',
			alignBtn: '.alignBtn',
			rotateBtn: '.rotateBtn',

			saveBtn: '.saveBtn',
			downloadBtn: '.downloadBtn',
			pasteBtn: '.pasteBtn',
			copyBtn: '.copyBtn',
			addPointBtn: '.addPointBtn',

		},
		init: function (editSvgObj) {
			this.editSvgObj = editSvgObj;
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
			this.bindEvent_copyPaste();
			this.bindEvent_addPoint();

			this.downloadBtn.on('click', function () { // 看全图
				that.saveAsImage();
			});
			this.saveBtn.on('click', function () { // 看全图
				that.saveToSever();
			});

			this.viewallIcon.on('click', function () { // 看全图
				var aShapes = that.editSvgObj.collection.shapeList;
				if (aShapes && aShapes.length > 0) {
					that.editSvgObj.collection.setSvgSizeByShapes(aShapes);
				}
			});
			this.alignBtn.on('click', function (e) { //
				var type = $(e.currentTarget).attr('data-type');
				var shapeInsts = that.editSvgObj.collection.getSelectShape();
				// console.log(shapeInsts, type)
				that.alignShape(shapeInsts, type);
			});
			this.rotateBtn.on('click', function (e) { //
				var angle = $(e.currentTarget).attr('data-angle');
				var shapeInsts = that.editSvgObj.collection.getSelectShape();
				console.log(shapeInsts, angle)

				that.rotateShape(shapeInsts, angle);
			});

			$(window).on('keydown', function (e) { // delete 删除图形
				if (e.key !== 'Delete')
					return;
				var shapeInsts = that.editSvgObj.collection.getSelectShape();
				var length = shapeInsts.length;
				if (length > 0 && confirm('确定删除所选的 ' + length + ' 个图形？')) {
					shapeInsts.forEach(function (shape) {
						shape.remove();
					});
				}
			});
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
				var state = that.editSvgObj.raphaelScreen.state;
				that._removeAllStateStyle();
				if (state === 'move') {
					that.editSvgObj.raphaelScreen.setState(); // 取消移动状态
				} else {
					that.editSvgObj.raphaelScreen.setState('move'); // 设置状态为移动
					image.src = image.src.replace('_02', '_03');
					image.src = image.src.replace('_01', '_03');

				}
			});
			this.enlargeIcon.on('click', function (e) {
				var image = e.currentTarget;
				var state = that.editSvgObj.raphaelScreen.state;
				that._removeAllStateStyle();
				if (state === 'enlarge') {
					that.editSvgObj.raphaelScreen.setState(); // 取消状态
				} else {
					that.editSvgObj.raphaelScreen.setState('enlarge'); // 设置状态
					image.src = image.src.replace('_02', '_03');
					image.src = image.src.replace('_01', '_03');
				}
			});
		},
		_removeAllStateStyle: function () {
			this.stateIcon.each(function (index, image) {
				image.src = image.src.replace('_03', '_01');
				image.src = image.src.replace('_02', '_01');
			});
		},
		bindEvent_addPoint: function () {
			var that = this;
			this.addPointBtn.on('click', function (e) {
				var image = e.currentTarget;

				that._removeAllStateStyle();
				if (that.editSvgObj.raphaelScreen.state === 'addPoint') {
					that.editSvgObj.raphaelScreen.setState(); // 取消状态
				} else {
					that.editSvgObj.raphaelScreen.setState('addPoint'); // 设置状态
					image.src = image.src.replace('_02', '_03');
					image.src = image.src.replace('_01', '_03');
				}
			});
			this.editSvgObj.raphaelScreen.$svgWrap.on('click', function (e) {
				if (that.editSvgObj.raphaelScreen.state !== 'addPoint' ||
					e.button !== 0)
					return;

				var oloc = that.editSvgObj.raphaelScreen.getSvgCoordinate(
					e.pageX, e.pageY);
				var x = oloc.x;
				var y = oloc.y;
				var shape = that.editSvgObj.collection.getShapeByLocat(x, y);
				if (!shape)
					return;
				shape.addConnectPoint(x, y);
				shape.hideConnectPoints();
				shape.showConnectPoints();
			});
		},
		bindEvent_copyPaste: function () {
			var that = this;
			var oCopy = null;
			var copyfn = function () { // 复制已选
				var shapeInsts = that.editSvgObj.collection.getSelectShape();
				if (shapeInsts.length === 0)
					return;
				oCopy = that.editSvgObj.collection
					.getCopyObjOfSelectedShapes(shapeInsts);
			};
			var changeToPasteState = function () {
				if (!oCopy)
					return;
				that._removeAllStateStyle();
				that.editSvgObj.raphaelScreen.setState('paste'); // 取消状态
			};
			this.copyBtn.on('click', copyfn);
			this.pasteBtn.on('click', changeToPasteState);
			$(window).on('keydown', function (e) { // control c 的快捷键复制
				// console.log(e)
				// console.log(!e.ctrlKey || e.key !== 'c')
				if (!(e.ctrlKey && e.key === 'c'))
					return;
				copyfn();
				changeToPasteState();
			});

			this.editSvgObj.raphaelScreen.$svgWrap.on('click', function (e) {
				if (that.editSvgObj.raphaelScreen.state !== 'paste' || !oCopy || e.button !== 0)return;
				var oloc = that.editSvgObj.raphaelScreen.getSvgCoordinate(e.pageX, e.pageY)
				var aShapeObjs = that.editSvgObj.collection.setNewPositionOfCopyObj(oCopy, oloc.x, oloc.y);
				that.editSvgObj.collection.createGeometrys(aShapeObjs, function (aShapeList) {
					aShapeList.forEach(function (shape) {
						that.editSvgObj.bindShapeEvent(shape);
					});
				});
				that.editSvgObj.raphaelScreen.setState();
				oCopy = null;
			});

		},
		alignShape: function (aShapeInst, sAlignSype) { // 对齐图形
			// 入参 aShapeInst
			// 入参 sAlignSype: left right center top middle bottom
			var list = aShapeInst;
			var type = sAlignSype;
			var topShape = null;
			var leftShape = null;
			var shapeNumber = 0;
			var minTop = 100000000;
			var minLeft = 100000000;
			for (var a = 0; a < list.length; a++) {
				var shape = list[a];

				if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON ||
					shape.geometryType == ShapeConfig.GEOMETRY_TEXT) {
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
					if (shape.geometryType == ShapeConfig.GEOMETRY_POLYGON ||
						shape.geometryType == ShapeConfig.GEOMETRY_TEXT) {
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
			}
		},
		rotateShape: function (aShapeInst, angle) {
			var list = aShapeInst;
			aShapeInst.forEach(function (shape, index) {
				if (shape.rotate)
					shape.rotate(angle);
			});
		},
		saveAsImage: function () { // facilityConfig
			var svgXml = $('#jas_raphael').html();

			var getBase64Image = function (src, width, height, ext) {
				var image = new Image();
				image.src = src;
				image.width = width;
				image.height = height;

				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				var context = canvas.getContext("2d");
				context.drawImage(image, 0, 0, image.width, image.height);
				var base64 = canvas.toDataURL("image/" + ext);
				return base64;
			}
			var replaceUrl = function (sHtml) {
				for (var a in facilityConfig) {
					var regexp = new RegExp(facilityConfig[a].url, 'gm');
					if (sHtml.match(regexp)) {
						var base64 = getBase64Image(facilityConfig[a].url,
							facilityConfig[a].svgWidth,
							facilityConfig[a].svgHeight, 'png');
						sHtml = sHtml.replace(regexp, base64);
					}
				}
				return sHtml;
			};

			var getNowDate = function () {
				// 获取当前时间字符串
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
				return dateTime = year + month + day;
			};

			var image = new Image();
			image.src = 'data:image/svg+xml;base64,' +
				window
				.btoa(unescape(encodeURIComponent(replaceUrl(svgXml)))); // 给图片对象写入base64编码的svg流
			image.onload = function () {
				var canvas = document.createElement('canvas'); // 准备空画布
				canvas.width = $('#jas_raphael svg').width();
				canvas.height = $('#jas_raphael svg').height();

				var context = canvas.getContext('2d'); // 取得画布的2d绘图上下文
				context.drawImage(image, 0, 0);

				// 将canvas的透明背景设置成白色
				var imageDataForColor = context.getImageData(0, 0,
					canvas.width, canvas.height);
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

				// 获取当前时间字符串
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

				var a = document.createElement('a');
				a.href = canvas.toDataURL('image/png'); // 将画布内的信息导出为png图片数据
				a.download = "工艺流程图_" + getNowDate() + '.png'; // 设定下载名称
				a.click(); // 点击触发下载
			};
		},
		saveToSever: function () {
			var aShapesInfo = JSON.stringify(this.editSvgObj.collection.getGeometryAttribute());
			console.log(aShapesInfo);
			var node = JSON.parse(localStorage.getItem("chosenStationNode"));
			var data = {
				"stationId": node.stationOid,
				"stationName": node.stationName,
				"stringChart": aShapesInfo
			};
			$.ajax({
				url: rootPath + "StationPidChart/add.do",
				type: "POST",
				cache: false,
				data: JSON.stringify(data),
				dataType: 'json',
				contentType: 'application/json;charset=utf-8',
				success: function (res) {
					if (res.code == "success") {
						baseMsg("保存成功");
					}
				}
			});

		}
	}
})(window, $);
/*
 ** creeated by GF on 2017.11.27
 ** 文件：pid组件属性配置
 **
 */

(function(window) {
    var textSizeList = [ // 0
        {
            label: '5px',
            value: 5
        }, {
            label: '6px',
            value: 6
        }, {
            label: '7px',
            value: 7
        }, {
            label: '8px',
            value: 8
        }, {
            label: '9px',
            value: 9
        }, {
            label: '10px',
            value: 10
        }, {
            label: '11px',
            value: 11
        }, {
            label: '12px',
            value: 12
        }, {
            label: '13px',
            value: 13
        }, {
            label: '14px',
            value: 14
        }, {
            label: '15px',
            value: 15
        }, {
            label: '16px',
            value: 16
        }, {
            label: '17px',
            value: 17
        }, {
            label: '18px',
            value: 18
        }, {
            label: '19px',
            value: 19
        }, {
            label: '20px',
            value: 20
        }, {
            label: '21px',
            value: 21
        }, {
            label: '22px',
            value: 22
        }, {
            label: '23px',
            value: 23
        }, {
            label: '24px',
            value: 24
        }, {
            label: '25px',
            value: 25
        }, {
            label: '26px',
            value: 26
        }, {
            label: '27px',
            value: 27
        }, {
            label: '28px',
            value: 28
        }, {
            label: '29px',
            value: 29
        }, {
            label: '30px',
            value: 30
        }
    ];


    window.attributeConfig = {

        'textSize': { // 0
            label: '字体大小',
            name: 'textSize',
            inputtype: 'select',
            type: 'int',
            item: textSizeList,
        },
        'textFamily': { // 1
            label: '字体类型',
            name: 'textFamily',
            inputtype: 'select',
            type: 'string',
            item: [ // 1
                {
                    label: '微软雅黑',
                    value: '微软雅黑'
                }, {
                    label: '宋体',
                    value: '宋体'
                }
            ]
        },
        'textColor': { // 2
            label: '字体颜色',
            name: 'textColor',
            inputtype: 'input',
            type: 'string', // 2
            color: "color"
        },
        'text': { // 3
            label: '名称',
            name: 'text',
            inputtype: 'input',
            type: 'string' // 3
        },
        'bitNumber': { // 4
            label: '位号',
            name: 'bitNumber',
            inputtype: 'input',
            type: 'string' // 4
        },
        'fillColor': {
            label: '填充色',
            name: 'fillColor',
            inputtype: 'input',
            type: 'string',
            color: "color" // 5
        },
        'linecolor': { //针对连接点属性
            label: '线色',
            name: 'linecolor',
            inputtype: 'input',
            type: 'string',
            color: "color" // 5
        },
        'color': { // 5
            label: '线色',
            name: 'color',
            inputtype: 'input',
            type: 'string',
            color: "color" // 5
        },
        'length': { // 6
            label: '长度km',
            name: 'length',
            inputtype: 'input',
            type: 'double' // 6
        },
        'diameter': { // 7
            label: '线径mm',
            name: 'diameter',
            inputtype: 'input',
            type: 'double' // 7
        },
        'ID': { // 8
            label: '设备ID',
            name: 'ID',
            inputtype: 'input',
            type: 'string' // 8
        },
        'width': {
            label: '宽度',
            name: 'width',
            inputtype: 'input',
            type: 'double',
        },
        'height': {
            label: '高度',
            name: 'height',
            inputtype: 'input',
            type: 'double',
        },
        'stroke-width': { // 9
            label: '管线大小',
            name: 'stroke-width',
            inputtype: 'select',
            type: 'int',
            item: [ // 9
                {
                    label: '1px',
                    value: 1
                }, {
                    label: '2px',
                    value: 2
                }, {
                    label: '3px',
                    value: 3
                }, {
                    label: '4px',
                    value: 4
                }, {
                    label: '5px',
                    value: 5
                }, {
                    label: '6px',
                    value: 6
                }, {
                    label: '7px',
                    value: 7
                }, {
                    label: '8px',
                    value: 8
                }, {
                    label: '9px',
                    value: 9
                }, {
                    label: '10px',
                    value: 10
                }
            ]
        },
        'edgeBorder': {
            label: '边径大小',
            name: 'edgeBorder',
            inputtype: 'select',
            type: 'int',
            item: [ // 9
                {
                    label: '1px',
                    value: 1
                }, {
                    label: '2px',
                    value: 2
                }, {
                    label: '3px',
                    value: 3
                }, {
                    label: '4px',
                    value: 4
                }, {
                    label: '5px',
                    value: 5
                }, {
                    label: '6px',
                    value: 6
                }, {
                    label: '7px',
                    value: 7
                }, {
                    label: '8px',
                    value: 8
                }, {
                    label: '9px',
                    value: 9
                }, {
                    label: '10px',
                    value: 10
                }
            ]
        },
        'magnification': { // 10
            label: '元件放大',
            name: 'magnification',
            inputtype: 'input',
            type: 'number' // 10
        },
        'text2Size': { // 11
            label: '字体大小',
            name: 'text2Size',
            inputtype: 'select',
            type: 'int',
            item: textSizeList
        },
        'text2Family': { // 12
            label: '字体类型',
            name: 'text2Family',
            inputtype: 'select',
            type: 'string',
            item: [ // 12
                {
                    label: '微软雅黑',
                    value: '微软雅黑'
                }, {
                    label: '宋体',
                    value: '宋体'
                }
            ]
        },
        'text2Color': { // 13
            label: '字体颜色',
            name: 'text2Color',
            inputtype: 'input',
            type: 'string', // 13
            color: "color"
        },
        'state': {
            label: "设备状态",
            name: "state",
            inputtype: 'select',
            type: 'string',
            item: [ // 1
                {
                    label: '001',
                    value: '开启'
                }, {
                    label: '002',
                    value: '关闭'
                }
            ]
        }

    }
})(window);
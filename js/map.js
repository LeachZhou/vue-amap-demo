var km_num;
/**
 * 地图初始化
 */
var datamap = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 14, //缩放
    center: [121.480237, 31.236305]
});
/**
 * 在中心点添加 marker
 */
var marker = new AMap.Marker({
    map: datamap,
    position: [121.480237, 31.236305]
});
/**
 * 获取浏览器地址
 */
/*
datamap.plugin('AMap.Geolocation', function () {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    datamap.addControl(geolocation);
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete', function (res) {
        console.log(res);
    });//返回定位信息
    AMap.event.addListener(geolocation, 'error', function (res) {
        console.log(res);
    });//返回定位出错信息
});
*/
/**
 * 自动提示地址插件
 */
AMap.plugin('AMap.Autocomplete', function () {
    var autoOptions = {
        pageIndex: 1,
        pageSize: 10,
        city: "021", //城市，默认全国
//            input: "autoMapInput"//使用联想输入的input的id
    };
    autocomplete = new AMap.Autocomplete(autoOptions);
});


/**
 * 为地图注册click事件获取鼠标点击出的经纬度坐标
 */
datamap.on('click', function (e) {
    //清除所有点标注
    datamap.remove(marker);
    //获取点击经纬度
    var clickarr = (e.lnglat.lng + ',' + e.lnglat.lat).split(',');
    //根据经纬度设置中心
    datamap.setCenter(clickarr);
    //根据经纬度设置点标注
    marker = new AMap.Marker({
        map: datamap,
        position: clickarr
    });
    AMap.service('AMap.Geocoder', function () {
        geocoder = new AMap.Geocoder({
            city: "021"
        });
        //逆地理编码
        geocoder.getAddress(clickarr, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                $("#autoMapTitleInput").prop('data-geo', e.lnglat.lng + ',' + e.lnglat.lat);
                $("#autoMapTitleInput").val(result.regeocode.formattedAddress);
                $("#autoMapDetailsInput").val(result.regeocode.addressComponent.province + result.regeocode.addressComponent.district + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber);
                if ($("#autoMapTitleInput").prop('data-geo')) {
                    $("#autoMapBtn").removeAttr('disabled');
                    $("#autoMapBtn").css({"background": "#0a0724", "border": "1px solid #0a0724"});
                } else {
                    $("#autoMapBtn").prop('disabled', 'true');
                    $("#autoMapBtn").css({"background": "#d6d6d6", "border": "1px solid #d6d6d6"});
                }
            } else {
                //获取地址失败
            }
        });
    })
});

/**
 * pop弹窗居中
 * @param obj DOM
 */
function centerPop(obj) {
    $(obj).parent().show();
    $("body,html").css({"overflow": "hidden"});
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var popupWidth = $(obj).width();
    var popupHeight = $(obj).height() + 100;//$(obj).height()是#pop里面的高度，但是还是有个padding:50px;所以加上100,宽度加不加无所谓
    var top;
    var left = (windowWidth - popupWidth) / 2;
    if (popupHeight > windowHeight) {
        top = '100px';
    } else {
        top = (windowHeight - popupHeight) / 2;
    }
    $(obj).css({
        "position": "absolute",
        "top": top,
        "left": left,
        "margin-left": 0
    });
}
function popCloseFun() {
    $("#popParent").hide();
    $("body,html").css({"overflow": "visible"});
}
/**
 * 点击查看地图
 */
$("#getonBtn,#getoffBtn").on("click", function () {
    centerPop('#pop');
    var clickarr;
    if ($(this).prop('id') == 'getonBtn') {
        var pre = 'autoMap';
        if ($("#getonTitleInput").prop('data-geo')) {//如果有经纬度，在地图里显示地点
            $("#autoMapTitleInput").prop('data-geo', $("#getonTitleInput").prop('data-geo'));
            $("#autoMapTitleInput").val($("#getonTitleInput").val());
            $("#autoMapDetailsInput").val($("#getonDetailsInput").val());
            //清除所有点标注
            datamap.remove(marker);
            //获取点击经纬度
            clickarr = $("#getonTitleInput").prop('data-geo').split(',');
            //根据经纬度设置中心
            datamap.setCenter(clickarr);
            //根据经纬度设置点标注
            marker = new AMap.Marker({
                map: datamap,
                position: clickarr
            });
            if ($("#" + pre + "TitleInput").prop('data-geo')) {
                $("#" + pre + "Btn").removeAttr('disabled');
                $("#" + pre + "Btn").css({"background": "#0a0724", "border": "1px solid #0a0724"});
            } else {
                $("#" + pre + "Btn").prop('disabled', 'true');
                $("#" + pre + "Btn").css({"background": "#d6d6d6", "border": "1px solid #d6d6d6"});
            }
        }
        $("#" + pre + "Btn").prop('data-parent', 'geton');
    } else if ($(this).prop('id') == 'getoffBtn') {
        var pre = 'autoMap';
        if ($("#getoffTitleInput").prop('data-geo')) {
            $("#autoMapTitleInput").prop('data-geo', $("#getoffTitleInput").prop('data-geo'));
            $("#autoMapTitleInput").val($("#getoffTitleInput").val());
            $("#autoMapDetailsInput").val($("#getoffDetailsInput").val());
            //清除所有点标注
            datamap.remove(marker);
            //获取点击经纬度
            clickarr = $("#getoffTitleInput").prop('data-geo').split(',');
            //根据经纬度设置中心
            datamap.setCenter(clickarr);
            //根据经纬度设置点标注
            marker = new AMap.Marker({
                map: datamap,
                position: clickarr
            });
            if ($("#" + pre + "TitleInput").prop('data-geo')) {
                $("#" + pre + "Btn").removeAttr('disabled');
                $("#" + pre + "Btn").css({"background": "#0a0724", "border": "1px solid #0a0724"});
            } else {
                $("#" + pre + "Btn").prop('disabled', 'true');
                $("#" + pre + "Btn").css({"background": "#d6d6d6", "border": "1px solid #d6d6d6"});
            }
        }
        $("#" + pre + "Btn").prop('data-parent', 'getoff');

    }
});



/**
 * 点击关闭地图
 */
$("#popClose").on("click", function () {
    popCloseFun();
    popClearFun();
});

function popCloseFun() {
    $("#popParent").hide();
    $("body,html").css({"overflow": "visible"});
}

/**
 * 输入框绑定自动提示
 */
autoCompleteFun('autoMap');//弹窗内首输入框绑定自动提示事件
autoCompleteFun('geton');//上车输入框绑定自动提示事件
autoCompleteFun('getoff');//下车输入框绑定自动提示事件
/**
 * 输入框绑定自动提示类
 */
function autoCompleteFun(pre) {
    $("#" + pre + "TitleInput").bind("input propertychange", function () {
        autocomplete.search($(this).val(), function (status, result) {
            if (result.info == "OK") {
                $("#" + pre + "List").html('');
                var tmp = "<ul>";
                for (var i = 0; i < result.count; i++) {
                    if (result.tips[i].id) {//去除掉没有具体经纬度的地址信息
                        tmp += '<li data-geo="' + result.tips[i].location.lng + ',' + result.tips[i].location.lat + '" data-title="' + result.tips[i].name + '" data-address="' + result.tips[i].district + result.tips[i].address + '">\n' +
                            '    <div class="online-address-list-title">' + result.tips[i].name + '</div>\n' +
                            '    <div class="online-address-list-details">' + result.tips[i].district + result.tips[i].address + '</div>\n' +
                            '  </li>\n';
                    }
                }
                tmp += "</ul>";
                $("#" + pre + "List").append(tmp);
                $("#" + pre + "List").show();
            }
        });

        if (pre == 'autoMap') {
            if ($(this).val()) {
                if ($(this).prop('data-geo')) {
                    $("#" + pre + "Btn").removeAttr('disabled');
                    $("#" + pre + "Btn").css({"background": "#0a0724", "border": "1px solid #0a0724"});
                }
            } else {
                $("#" + pre + "Btn").prop('disabled', 'true');
                $("#" + pre + "Btn").css({"background": "#d6d6d6", "border": "1px solid #d6d6d6"});
                popClearFun();
            }
        } else {
            if (!$(this).val()) {
                eval(pre + 'ClearFun')();
            }
        }
    });
    $("#" + pre + "DetailsInput").bind("input propertychange", function () {
        if (!$(this).val()) {
            eval(pre + 'ClearFun')();
        }
    });
}

/**
 * 输入框失去焦点(不能放开注释，经过反复试验，发现一旦放开点击提示列表无效)
 */
//    blurListFun('autoMap');
//    blurListFun('geton');
//    blurListFun('getoff');

/**
 * 输入框失去焦点类
 */
function blurListFun(pre) {
    $("#" + pre + "TitleInput").on('blur', function () {
        $("#" + pre + "List").hide();
    })
}

/**
 * 点击自动提示列表
 */
clickAutoList('autoMap');
clickAutoList('geton');
clickAutoList('getoff');

function clickAutoList(pre) {
    $("#" + pre + "List").on("click", "li", function () {
        //改变地图中心
        datamap.setZoomAndCenter(18, $(this).attr('data-geo').split(','));
        //清除所有点标注
        datamap.remove(marker);
        // 在新中心点添加 marker
        marker = new AMap.Marker({
            map: datamap,
            position: $(this).attr('data-geo').split(',')
        });
        $("#" + pre + "TitleInput").prop('data-geo', $(this).attr('data-geo'));
        $("#" + pre + "TitleInput").val($(this).attr('data-title'));
        $("#" + pre + "DetailsInput").val($(this).attr('data-address'));
        $("#" + pre + "List").hide();
        comprice();
        if (pre == "autoMap") {
            if ($("#" + pre + "TitleInput").prop('data-geo')) {
                $("#" + pre + "Btn").removeAttr('disabled');
                $("#" + pre + "Btn").css({"background": "#0a0724", "border": "1px solid #0a0724"});
            } else {
                $("#" + pre + "Btn").prop('disabled', 'true');
                $("#" + pre + "Btn").css({"background": "#d6d6d6", "border": "1px solid #d6d6d6"});
            }
        }
    });
}


/**
 * 点击弹窗内确认
 */
$("#autoMapBtn").on("click", function () {
    if ($("#autoMapTitleInput").prop('data-geo')) {
        var geton = 'geton';
        var getoff = 'getoff';
        if ($(this).prop('data-parent') == geton) {
            $("#" + geton + "TitleInput").prop('data-geo', $("#autoMapTitleInput").prop('data-geo'));
            $("#" + geton + "TitleInput").val($("#autoMapTitleInput").val());
            $("#" + geton + "DetailsInput").val($("#autoMapDetailsInput").val());
        } else if ($(this).prop('data-parent') == getoff) {
            $("#" + getoff + "TitleInput").prop('data-geo', $("#autoMapTitleInput").prop('data-geo'));
            $("#" + getoff + "TitleInput").val($("#autoMapTitleInput").val());
            $("#" + getoff + "DetailsInput").val($("#autoMapDetailsInput").val());
        }
    }
    popClearFun();
    popCloseFun();
    comprice();
});

/**
 * 清除弹窗内输入框及geo数据
 */
function popClearFun() {
    $("#autoMapTitleInput").prop('data-geo', '');
    $("#autoMapTitleInput").val('');
    $("#autoMapDetailsInput").val('');
    $("#autoMapList").html('');
    $("#autoMapBtn").prop('disabled', 'true');
    $("#autoMapBtn").css({"background": "#d6d6d6", "border": "1px solid #d6d6d6"});
}

/**
 * 清除上车输入框及geo数据
 */
function getonClearFun() {
    $("#getonTitleInput").prop('data-geo', '');
    $("#getonTitleInput").val('');
    $("#getonDetailsInput").val('');
    $("#getonList").html('');
}

/**
 * 清除下车输入框及geo数据
 */
function getoffClearFun() {
    $("#getoffTitleInput").prop('data-geo', '');
    $("#getoffTitleInput").val('');
    $("#getoffDetailsInput").val('');
    $("#getoffList").html('');
}

/**
 * 车型切换
 */
$("[id^='carType'] .online-check").on('click', function () {
    $(this).parent().find('.online-check').removeClass('online-checked');
    if (!$(this).hasClass('online-checked')) {
        $(this).addClass('online-checked');
        comprice();
    }
});
/**
 * 车类型切换
 */
$("input[name='carRadio']").on('change', function () {
    switch (parseInt($(this).val())) {
        case 1:
            $("[id^='carType']").hide();
            $("#carType1").show();
            break;
        case 2:
            $("[id^='carType']").hide();
            $("#carType2").show();
            break;
        case 3:
            $("[id^='carType']").hide();
            $("#carType3").show();
            break;
        default:
            break;
    }
    comprice();
})
/**
 * 乘车人切换
 */
$("input[name='userRadio']").on('change', function () {
    switch (parseInt($(this).val())) {
        case 1:
            $("#otherUser").hide();
            break;
        case 2:
            $("#otherUser").show();
            break;
        default:
            break;
    }
    comprice();
})

/**
 * 价格计算类
 */
function comprice() {
    if ($('#getonTitleInput').prop('data-geo') && $('#getoffTitleInput').prop('data-geo')) {
        var getongeo = $('#getonTitleInput').prop('data-geo').split(',');
        var getoffgeo = $('#getoffTitleInput').prop('data-geo').split(',');
        $.ajax({
            type: 'POST',
            url: purl + '/index.php/index/order/comprice',
            dataType: 'json',
            data: {
                "start_lat": getongeo[1],
                "start_lng": getongeo[0],
                "end_lat": getoffgeo[1],
                "end_lng": getoffgeo[0],
                "car_type": $("input[name='carRadio']:checked").val()
            },
            success: function (res) {
                if (res.code == 1000) {
                    var id = "#carType" + $("input[name='carRadio']:checked").val() + " .online-checked";
                    var num = $(id).attr('data-carid');
                    $("#onlinePrice").html(res.price[num]);
                    km_num = res.price.km_num;
                } else {
                    alert(res.code + res.msg);
                }
            },
            error: function () {

            }
        });
    }
}
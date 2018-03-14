
/**
 * 判断是否登录
 */
function isLogin() {
    if (localStorage.uid) {
        return 1;
    } else {
        return 0;
    }
}

/**
 * 未登录操作或者登录操作
 */
if (isLogin()) {
    $("#nologin").hide();
    $("#logined").show();
    $("#logined .logined-head").css('src', localStorage.header_img);
    $("#logined .logined-name").html(localStorage.nick_name);
} else {
    $("#nologin").show();
    $("#logined").hide();
}

if (localStorage.uid) {
    $.ajax({
        type: 'POST',
        url: purl + '/index.php/index/user/udata',
        data: {
            "uid": localStorage.uid
        },
        success: function (res) {
            if (res.code == 1000) {
                localStorage.uid = res.data.uid;
                if (!res.data.nick_name) {
                    localStorage.nick_name = res.data.mobile;
                } else {
                    localStorage.nick_name = res.data.nick_name;
                }
                localStorage.mobile = res.data.mobile;
                localStorage.sex = res.data.sex;
                localStorage.header_img = res.data.header_img;
                localStorage.balance = res.data.balance;
                localStorage.email = res.data.email;
            } else {
                alert(res.code + res.msg);
            }
        },
        error: function () {

        }
    });
}


/**
 * 登出
 */
$('.logout').on('click', function () {
    localStorage.removeItem('header_img');
    localStorage.removeItem('nick_name');
    localStorage.removeItem('uid');
    location.href = 'login.html';
})

/**
 * 登录检查填写
 */
function loginCheck(mobile, password) {
    if (isValue(mobile) && isValue(password)) {
        // if (isPhone(mobile)) {
        if (true) {
            return true;
        }
    }

}

/**
 * 注册检查填写
 */
function regCheck(mobile, password, verifycode) {
    if (isValue(mobile) && isValue(password) && isValue(verifycode)) {
        // if (isPhone(mobile)) {
        if (true) {
            return true;
        }
    }
}
/**
 * 忘记密码检查填写
 */
function forgetCheck(mobile, verifycode) {
    if (isValue(mobile) && isValue(verifycode)) {
        // if (isPhone(mobile)) {
        if (true) {
            return true;
        }
    }
}

/**
 * 验证手机号
 * @param mobile
 * @returns {boolean}
 */
function isPhone(mobile) {
    if (!(/^1[345678][0-9]{9}$/.test(mobile.val()))) {
        alert('手机号格式错误');
        return false;
    } else {
        return true;
    }
}

/**
 * 验证密码
 * @param password
 * @returns {boolean}
 */
function isPassword(password) {
    if (!(/^[A-Za-z0-9]{6,18}$/.test(password.val()))) {
        alert('密码长度为6-16个字节');
        return false;
    } else {
        return true;
    }
}

/**
 * 验证验证码
 * @param code
 * @returns {boolean}
 */
function isCode(code) {
    if (!(/^[0-9]{4}$/.test(code.val()))) {
        alert("验证码长度为4");
        return false;
    } else {
        return true;
    }
}

/**
 * 验证值是否为空
 * @param param
 * @returns {boolean}
 */
function isValue(param) {
    if (!param.val()) {
        setTimeout(function () {
            alert("请填写完整");
        },0);
        location.reload();
        return false;
    } else {
        return true;
    }
}


$(".pay_list_c1").click(function () {
    $(this).addClass("on").siblings().removeClass("on");
})


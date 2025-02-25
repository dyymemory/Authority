﻿var Login = {
    Init: function () {
        $("#login").on("click", function () {
            Login.Login();
        });

        //回车登录
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                Login.Login();
            }
        });

        layui.use(['form', 'layer'], function () {
            var form = layui.form,
                layer = layui.layer;

            form.render();

            if (location.hash == '#4001') {
                layer.msg("用户登录已过期，请重新登录");
            }
        });


    },
    Login: function () {
        if ($("#account").val() == "") {
            layer.msg('帐号不能为空');
            $("#account").focus();
            return;
        }
        if ($("#pwd").val() == "") {
            layer.msg('密码不能为空');
            $("#pwd").focus();
            return;
        }
        PublicComm.Ajax("POST", "/Authority/Login/Login", { "Mobile": $("#account").val(), "Pwd": $("#pwd").val() }, false, function (result) {
            if (result != undefined && result.Code == 2000) {
                CacheHelper.SetUser(result.Data);
                CacheHelper.ClearUID();
                CacheHelper.SetUID(result.Data.EmpCode);
                window.location.href = "/pages/index.html";
            } else {
                layer.msg(result.Message);
            }
        });
    },
}

$(function () {
    Login.Init();
});

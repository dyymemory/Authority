﻿var Index = {
    Init: function () {
        var user = CacheHelper.GetUser();
        if (!!user) {
            $('#cityName').text("员工所在城市：" + user.CityName);
            $('#empName').text(user.EmpName);
        }
        //var naviPirv = ['priv-xt', 'priv-xt-authority', 'priv-empauth', 'priv-deptauth', 'priv-posauth'];
        var naviHTML = '';
        if (PrivComm.CheckAuthority('priv-empauth') || PrivComm.CheckAuthority('priv-deptauth') || PrivComm.CheckAuthority('priv-posauth')) {
            naviHTML += '<li class="layui-nav-item layui-nav-itemed">';
            naviHTML += '<a class="" href="javascript:;">权限管理</a>';
            naviHTML += '<dl class="layui-nav-child">';
            if (PrivComm.CheckAuthority('priv-posauth')) {
                naviHTML += '<dd><a href="javascript:;" data-nav="position/position_index.html">职务权限</a></dd>';
            }
            if (PrivComm.CheckAuthority('priv-deptauth')) {
                naviHTML += '<dd><a href="javascript:;" data-nav="department/department_index.html">门店权限</a></dd>';
            }
            if (PrivComm.CheckAuthority('priv-empauth')) {
                naviHTML += '<dd><a href="javascript:;" data-nav="employee/employee_index.html">员工权限</a></dd>';
            }
            naviHTML += '</dl>';
            naviHTML += '</li>';
        }
        if (PrivComm.CheckAuthority('priv-xt')) {
            naviHTML += '<li class="layui-nav-item layui-nav-itemed">';
            naviHTML += '<a class="" href="javascript:;">系统设置</a>';
            naviHTML += ' <dl class="layui-nav-child">';
            if (PrivComm.CheckAuthority('priv-xt-authority')) {
                naviHTML += '<dd><a href="javascript:;" data-nav="system/system_index.html">系统权限</a></dd>';
            }
            naviHTML += '</dl>';
            naviHTML += '</li>';
        }
        $('#navi').html(naviHTML);

        layui.use(['element', 'layer'], function () {
            var element = layui.element, //导航的hover效果、二级菜单等功能，需要依赖element模块
                layer = layui.layer;

            //监听导航点击
            element.on('nav(demo)', function (elem) {
                $("#layui-body").load($(elem.context).attr("data-nav"));
            });

            $('#logout').on('click', function () {
                layer.confirm('确认退出？',
                    {
                        btn: ['确定', '取消']
                    },
                    function (index) {
                        Index.LoginOut();
                    },
                    function (index) {
                        layer.close(index);
                    });
            });
        });

    },
    LoginOut: function () {
        PublicComm.Ajax("POST", "/Authority/Login/Logout", null, false, function (result) {
            if (result != undefined && result.Code == 2000) {
                CacheHelper.ClearUser();
                CacheHelper.ClearUID();
                window.location.href = "/pages/login.html";
            } else {
                layer.msg(result.Message);
            }
        });
    }
}

$(function () {
    Index.Init();
});

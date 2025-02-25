﻿/*权限*/
var PrivComm = {
    User: CacheHelper.GetUser(),//当前登录员工信息
    SystemPriv: [],//登录员工权限管理系统权限
    //初始化权限
	Init: function () {
		PrivComm.User = CacheHelper.GetUser();
        var param = {};
        param.CityID = PrivComm.User.CityID;
        param.EmpCode = PrivComm.User.EmpCode;
        param.PlatForm = 3;
		PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivEmployeeByEmployee", param, false, function (result) {			
            if (result.Code == 2000 && !!result.Data && !!result.Data.ModulePrivList) {
                PrivComm.SystemPriv = result.Data.ModulePrivList.split(',');
            }
		});
		
    },
    //检查是否有权限
    CheckAuthority: function (priv) {
        if (PrivComm.User.IsAdmin) {
            return true;
        }
        return PrivComm.SystemPriv.indexOf(priv) >= 0;
    },
    //判断当前用户是否系统管理员
    IsAdmin: function () {
        return PrivComm.User.IsAdmin;
    },
    NoAuthorityHTML: '<blockquote class="layui-elem-quote layui-quote-nm">无权限访问</blockquote>',//无权限访问样式
}

$(function () {
    PrivComm.Init();
});
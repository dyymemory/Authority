﻿var CacheHelper = {
    //用户唯一标识，存储员工empcode，用于判断页面缓存用户信息中的empcode与浏览器缓存中的empcode是否一致，解决同一浏览器多个账号同时登录，导致cookie覆盖问题
    GetUID: function () {
        return layui.data('UID').UID;
    },
    SetUID: function (data) {
        layui.data('UID', { key: 'UID', value: data });
    },
    ClearUID: function () {
        layui.data('UID', null);
    },
	GetUser: function () {
        var user = layui.sessionData('user').user;
        if (!user || user.EmpCode != CacheHelper.GetUID()) {
			//         layui.use('layer', function() {
			//             var layer = layui.layer;
			//	layer.closeAll('iframe');
			//	var currentwindow = window;
			//	while (currentwindow.name != '') {
			//		var frameIndex = currentwindow.parent.layer.getFrameIndex(currentwindow.name); //先得到当前iframe层的索引 
			//		currentwindow.parent.layer.close(frameIndex);//再执行关闭
			//		currentwindow = currentwindow.parent.window; 
			//	}	
			//	currentwindow.location.href = "/pages/login.html#4001";				
			//});	
			top.location.href = "/pages/login.html#4001";	
        }
        return user;
    },
    SetUser: function (data) {
        layui.sessionData('user', { key: 'user', value: data });
    },
    ClearUser: function () {
        layui.sessionData('user', null);
    },
    GetCity: function () {
        return layui.sessionData('city').city;
    },
    SetCity: function (data) {
        layui.sessionData('city', { key: 'city', value: data });
    },
    ClearCity: function () {
        layui.sessionData('city', null);
    },
    GetDepartment: function (cityid) {
        return layui.sessionData('department')[cityid];
    },
    SetDepartment: function (cityid, data) {
        layui.sessionData('department', { key: cityid, value: data });
    },
    ClearDepartment: function () {
        layui.sessionData('department', null);
    },
    GetPosition: function (cityid) {
        return layui.sessionData('position')[cityid];
    },
    SetPosition: function (cityid, data) {
        layui.sessionData('position', { key: cityid, value: data });
    },
    ClearPosition: function () {
        layui.sessionData('position', null);
    },
    GetModule: function (platform) {
        return layui.sessionData('module')[platform];
    },
    SetModule: function (platform, data) {
        layui.sessionData('module', { key: platform, value: data });
    },
    ClearModule: function () {
        layui.sessionData('module', null);
    },
    GetArea: function (cityid) {
        return layui.sessionData('area')[cityid];
    },
    SetArea: function (cityid, data) {
        layui.sessionData('area', { key: cityid, value: data });
    },
    ClearArea: function () {
        layui.sessionData('area', null);
    },
}
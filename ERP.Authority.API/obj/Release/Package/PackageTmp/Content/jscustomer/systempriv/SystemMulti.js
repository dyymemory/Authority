﻿var SystemMulti = {
	SelectedData: window.parent.SystemForm.SelectedData,
	user: {},
	Init: function () {
		SystemMulti.user = CacheHelper.GetUser();
		layui.use(['form'], function () {
			var form = layui.form,
				table = layui.table;
			form.render();
			ControlComm.PositionBinding($('#Position'), form, SystemMulti.SelectedData.CityID, SystemMulti.SelectedData.PositionID);
		});
	},
	Cancel: function () {
		var Index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(Index);
	},
	Confirm: function () {
		//PrivComm.Init();
		CacheHelper.GetUser();
		var CodeJson = parent.SystemForm.codejson;
		JSON = SystemMulti.SelectedData;
		var positionID = $('#Position').val();
		var param = {};
		param.ModulePrivList = CodeJson.ModulePrivList;
		param.EmpCode = JSON.EmpCode;
		param.PlatForm = 3;
		param.PositionCode = JSON.PositionCode;
		PublicComm.Ajax("POST", "/Authority/Privilege/UpdatePrivToPosition", param, true, function (result) {
			if (result.Code == 2000) {
				SystemMulti.MultiSavePositionPrivToEmp(positionID, CodeJson);
			}
			else {
				layer.alert(result.Messege);
			}
		});
	},
	MultiSavePositionPrivToEmp: function (positionID, CodeJson) {
		var param = {};
		param.PositionID = positionID;
		param.CityID = SystemMulti.SelectedData.CityID;
		param.ModulePrivList = CodeJson.ModulePrivList;
		param.PlatForm = 3
		PublicComm.Ajax("POST", "/Authority/Privilege/MultiUpdatePrivToEmp", param, true, function (result) {
			if (result.Code == 2000) {
				layer.confirm('保存成功',
					{
						btn: ['确定'],
						closeBtn: 0
					},
					function (index) {
						layer.close(index);
						//当你在iframe页面关闭自身时
						var frameIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(frameIndex); //再执行关闭   
					});				
			}
			else {
				layer.alert(result.Messege);
			}
		});
	},	
}
$(function () {
	SystemMulti.Init();
});

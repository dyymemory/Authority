var PositionMulti = {
	PositionPrivParam: window.parent.PositionForm.PositionPrivParam,
	Init: function () {
        CacheHelper.GetUser();
		layui.use(['form'], function () {
			var form = layui.form,
				table = layui.table;
			form.render();
			ControlComm.PositionBinding($('#Position'), form, PositionMulti.PositionPrivParam.CityID, PositionMulti.PositionPrivParam.PositionID);
		});
	},
	Cancel: function () {
		var Index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(Index);
	},
	Confirm: function () {
		CacheHelper.GetUser();
		var CodeJson = PositionMulti.PositionPrivParam;
		var positionID = $('#Position').val();
		var param = {};
		param.DataPrivJson = CodeJson.DataPrivJson;
		param.ModulePrivList = CodeJson.ModulePrivList;
		param.PlatForm = $("input:radio[name='platform']:checked").val();
		param.PositionCode = $("#Position").find("option:selected").attr("PositionCode");
		PublicComm.Ajax("POST", "/Authority/Privilege/UpdateUplusPositionPrivilege", param, true, function (result) {
			if (result.Code == 2000) {
				PositionMulti.MultiSavePositionPrivToEmp(positionID, CodeJson);
			}
			else {
				layer.alert(result.Messege);
			}
		});
	},
	MultiSavePositionPrivToEmp: function (positionID, CodeJson) {
		var param = {};
		param.PositionID = positionID;
		param.CityID = CodeJson.CityID;
		param.PlatForm = $("input:radio[name='platform']:checked").val();
		param.ModulePrivList = CodeJson.ModulePrivList;
		param.DataPrivJson = CodeJson.DataPrivJson;
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
	PositionMulti.Init();
});

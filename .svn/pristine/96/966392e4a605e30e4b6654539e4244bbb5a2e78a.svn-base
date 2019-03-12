var EmployeeMulti = {
	Employee: window.parent.EmployeeEdit.Employee,
	PlatFormSelect: window.parent.EmployeeEdit.PlatFormSelect,
	Init: function () {
		user = CacheHelper.GetUser();
		layui.use(['form'], function () {
			var form = layui.form,
				table = layui.table;
			form.render();
			ControlComm.PositionBinding($('#Position'), form, EmployeeMulti.Employee.CityID, EmployeeMulti.Employee.PositionID);
		});
	},
	Cancel: function () {
		var Index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(Index);
	},
	Confirm: function () {
		var user = CacheHelper.GetUser();
		var CodeJson = parent.EmployeeEdit.PositionPrivParam;
		var JSON = EmployeeMulti.Employee;
		var positionID = $('#Position').val();
		var param = {};
		param.ModulePrivList = CodeJson.ModulePrivList;
		param.DataPrivJson = CodeJson.DataPrivJson;
		param.EmpCode = JSON.EmpCode;
		param.PlatForm = EmployeeMulti.PlatFormSelect;
		param.PositionCode = JSON.PositionCode;
		PublicComm.Ajax("POST", "/Authority/Privilege/UpdateUplusPositionPrivilege", param, true, function (result) {
			if (result.Code == 2000) {
				EmployeeMulti.MultiSavePositionPrivToEmp(positionID, CodeJson);
			}
			else {
				layer.alert(result.Messege);
			}
		});
	},
	MultiSavePositionPrivToEmp: function (positionID, CodeJson) {
		var user = CacheHelper.GetUser();
		var param = {};
		param.PositionID = positionID;
		param.CityID = EmployeeMulti.Employee.CityID;
		param.ModulePrivList = CodeJson.ModulePrivList;
		param.DataPrivJson = CodeJson.DataPrivJson;
		param.PlatForm = CodeJson.PlatForm;
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
	EmployeeMulti.Init();
});

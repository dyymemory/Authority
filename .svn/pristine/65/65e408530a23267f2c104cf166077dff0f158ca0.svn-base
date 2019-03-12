var EmployeeCopyToEmp = {
	Init: function () {
		CacheHelper.GetUser();
		layui.use(['form'], function () {
			var form = layui.form;
			form.render();
			ControlComm.CityBinding($('#City'), form);			
		});
	},
	Cancel: function () {
		var Index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(Index);
	},
	Confirm: function () {
		CacheHelper.GetUser();
		var CityID = $('#City').val();
		if (!!CityID) {

			var PlatForm = $("input:radio[name='platform']:checked").val();
			var param = {};
			param.CityID = CityID;
			param.PlatForm = PlatForm;
			PublicComm.Ajax("POST", "/Authority/City/CopyCityAuthToEmp", param, true, function (result) {
				if (result.Code == 2000) {
					var ShowMessage = "当前城市：" + result.Data[0].TotalCount + "人,本次更新" + result.Data[0].SuccessCount + "人";
					layer.alert(ShowMessage);
				}
				else {
					layer.alert(result.Messege);
				}
			})
		}
		else {
			layer.alert("请选择城市");
			return;
		}
	},
}
$(function () {
	EmployeeCopyToEmp.Init();
});
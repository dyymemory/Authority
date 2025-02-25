﻿var EmployeeEditCity = {
    Employee: window.parent.EmployeeIndex.SelectedData,
	Init: function () {
		PrivComm.Init();
		if (location.hash == '#cityprivset') {
			var str = "";
			if (PrivComm.CheckAuthority('priv-empauth-setcity-saveemp')) {
				str += '<a href="javascript:;" class="layui-btn" id="save">保存权限到员工</a>';
			}
			$('#saveemp').html(str);
		}
        layui.use('form', function () {
            var form = layui.form;

            EmployeeEditCity.InitCity(form);

            form.render();

            form.on('radio(platform)', function () {
                EmployeeEditCity.LoadCityData(form);
            });
        });
        $('#save').on('click', function () {
            EmployeeEditCity.SaveCityData();
        });
    },
    InitCity: function (form) {
        PublicComm.Ajax("POST", "/Authority/City/GetAllCityList", null, true, function (result) {
            var strHTML = '';
            for (var index in result.Data) {
				strHTML += '<div class=" layui-col-md3">';
                strHTML += '<input type="checkbox" value="' + result.Data[index].CityID + '" lay-skin="primary" title="' + result.Data[index].CityName + '">';
                strHTML += '</div>';
            }
            $('#cityList').html(strHTML);
            $('input:radio[name=platform][value="1"]').prop("checked", true);
            form.render();
            EmployeeEditCity.LoadCityData(form);
        });
    },
    LoadCityData: function (form) {
        PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivEmployeeCity", { 'EmpCode': EmployeeEditCity.Employee.EmpCode, 'PlatForm': $("input:radio[name='platform']:checked").val() }, true, function (result) {
            $("#cityList input:checkbox").prop("checked", false);
            if (!!result.Data) {
                var selectedCity = result.Data.CityList.split(',');
                for (var index in selectedCity) {
                    $("#cityList input:checkbox[value='" + selectedCity[index] + "']").prop("checked", true);
                }
            }
            form.render('checkbox');
        });
    },
	SaveCityData: function () {
		CacheHelper.GetUser();
        //var user = CacheHelper.GetUser();
        var param = {};
        param.EmpCode = EmployeeEditCity.Employee.EmpCode;
        param.PlatForm = $("input:radio[name='platform']:checked").val();
        //if (!!user) {
        //    param.Modifier = user.EmpCode;
        //}
        //param.ModDate = PublicComm.GetServeDate().Format("yyyy-MM-dd hh:mm:ss.S");
        var cityList = [];
        layui.each($("#cityList input:checkbox:checked"), function () {
            cityList.push($(this).val());
        });
        param.CityList = cityList.join(',');
        PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivEmployeeCity", param, true, function (result) {
            layui.use('layer', function () {
                var layer = layui.layer;
                if (!!result && result.Code == 2000) {
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
                } else {
                    layer.confirm(result.Message,
                        {
                            btn: ['确定']
                        },
                        function (index) {
                            layer.close(index);
                        });
                }
            });
        });
    },
}

$(function () {
    EmployeeEditCity.Init();
});
var PositionForm = {
    PlatFormSelect: 1,
    CityID: 1,
	Position: window.parent.PositionIndex.SelectedData,//获取页面选中数据的Data
	PositionPrivParam: {},//数据权限 模块权限
    //初始化
    Init: function () {
        layui.use(['element', 'form'], function () {
            var element = layui.element,
                form = layui.form;
            form.render();

            $('.site-demo-active').on('click', function () {
                var othis = $(this), type = othis.data('type');
                active[type] ? active[type].call(this, othis) : '';
            });
            ControlComm.DataPermissionsBinding($('#DataPermissions'), form);
            PositionForm.LoadPrivModule(form);
		});
        var CName = "";//当前城市赋值
        CName = PositionForm.Position.CityName;
        $("#CityName").html(CName)
        var PName = "";//当前职务赋值
        PName = PositionForm.Position.PositionName
		$("#PositName").html(PName)
		if (location.hash == '#set') {
			var str = "";
			if (PrivComm.CheckAuthority('priv-posauth-set-pos')) {
				str += '<input type="button" id="SavePrivToPosition" value="保存权限到职务" class="layui-btn layui-btn-sm" />';
			}
			document.getElementById("three").innerHTML = str;
		}
		if (location.hash == '#view') {
			var str = "";
			document.getElementById("three").innerHTML = str;
		}
		$('#SavePrivToPosition').on('click', function () {
			PositionForm.SavePrivToPosition();
		});
	},
	// 保存权限到职位
	SavePrivToPosition: function () {
		CacheHelper.GetUser();
		var DataPrivJson = PositionForm.BuildDataPriv();
		var Json = JSON.stringify(DataPrivJson); //数据权限
		var codes = "";
		var treeObj = $.fn.zTree.getZTreeObj("Modular"),
			nodes = treeObj.getCheckedNodes(true),//选中的节点
			v = "";
		if (!!nodes) {
			for (var i = 0; i < nodes.length; i++) {
				codes += nodes[i].ModuleCode + ",";
			}
		}
		var param = {};
		param.DataPrivJson = Json;//数据权限
		param.ModulePrivList = codes.substring(0, codes.length - 1);//模块权限
		param.CityID = PositionForm.Position.CityID;
		param.PositionID = PositionForm.Position.PositionID;
		PositionForm.PositionPrivParam = param;
		layui.use("layer", function () {
			var layer = layui.layer;
			layer.open({
				type: 2,
				title: '保存权限到职位',
				area: ['500px', '300px'], //宽高
				content: 'position_multi.html',
				scrollbar: false,//禁用滚动条
				btnAlign: 'd'
			})
		});		
	},
    LoadPrivModule: function (form) {
        $('#DataPermissions input:radio').prop('checked', false);
        var param = {};
        param.PositionCode = PositionForm.Position.PositionCode;
        param.PlatForm = 1;//默认平台为U+
        PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivModuleByPosition", param, true, function (result) {
            var modulePrivList = '';
            if (!!result.Data) {
                layui.each(ControlComm.DataPermissions, function () {
                    if (!!result.Data.DataPrivJson) {
                        var value = JSON.parse(result.Data.DataPrivJson)[this.name];
                        value = !!value ? value : 0;
                    }
                    else { value = 0; }
                    $('#DataPermissions input:radio[name=' + this.name + '][value=' + value + ']').prop('checked', true);
                });
                modulePrivList = result.Data.ModulePrivList;
            } else {
                layui.each(ControlComm.DataPermissions, function () {
                    $('#DataPermissions input:radio[name=' + this.name + '][value=0]').prop('checked', true);
                });
            }
            form.render('radio');
            var param = {};
            param.PlatForm = 1;//默认平台为U+
            ControlComm.GetPrivTree($('#Modular'), '/Authority/Privilege/GetAllModulePrivilegeList', param, modulePrivList);
        });          
	},
	BuildDataPriv: function () {
		var DataPrivJson = {};
		DataPrivJson["multy-divisitionSel"] = $("input[name='multy-divisitionSel']:checked").val();
		DataPrivJson["multy-publicSel"] = $("input[name='multy-publicSel']:checked").val();
		DataPrivJson["multy-privateSel"] = $("input[name='multy-privateSel']:checked").val();
		DataPrivJson["multy-specialSel"] = $("input[name='multy-specialSel']:checked").val();
		DataPrivJson["multy-finalSel"] = $("input[name='multy-finalSel']:checked").val();
		DataPrivJson["multy-publicSelDetail"] = $("input[name='multy-publicSelDetail']:checked").val();
		DataPrivJson["multy-privateSelDetail"] = $("input[name='multy-privateSelDetail']:checked").val();
		DataPrivJson["multy-specialSelDetail"] = $("input[name='multy-specialSelDetail']:checked").val();
		DataPrivJson["multy-finalSelDetail"] = $("input[name='multy-finalSelDetail']:checked").val();
		DataPrivJson["multy-publicModify"] = $("input[name='multy-publicModify']:checked").val();
		DataPrivJson["multy-privateModify"] = $("input[name='multy-privateModify']:checked").val();
		DataPrivJson["multy-specialModify"] = $("input[name='multy-specialModify']:checked").val();
		DataPrivJson["multy-finalModify"] = $("input[name='multy-finalModify']:checked").val();
		DataPrivJson["multy-publicCusSel"] = $("input[name='multy-publicCusSel']:checked").val();
		DataPrivJson["multy-privateCusSel"] = $("input[name='multy-privateCusSel']:checked").val();
		return DataPrivJson;
	},
};
$(function () {
    PositionForm.Init();
})
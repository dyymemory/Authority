var SystemForm = {
	codejson: {},
	SelectedData: window.parent.SystemIndex.json,
	Init: function () {
		PrivComm.Init();
	    user = CacheHelper.GetUser();		
		if (location.hash == '#set') {
			var str = "";
			str += '<div class="layui-row layui-input-inline">';
			str += '<a href="javascript:;" onclick="SystemForm.Cancel()" class="layui-btn layui-btn-sm" style="margin-left:10px">取消</a>';
			if (PrivComm.CheckAuthority('priv-xt-authority-set-initpos')) {
				str += '<a href="javascript:;" onclick="SystemForm.SaveClick()" class="layui-btn layui-btn-sm" style="margin-left:10px">职务授权</a>';
			}
			if (PrivComm.CheckAuthority('priv-xt-authority-set-saveemp')) {
				str += '<a href="javascript:;" onclick="SystemForm.SavePrivToEmp()" class="layui-btn layui-btn-sm">保存权限到员工</a>';
			}
			if (PrivComm.CheckAuthority('priv-xt-authority-set-pos')) {
				str += '<a href="javascript:;" onclick="SystemForm.SavePrivToPosition()" class="layui-btn layui-btn-sm">保存权限到职务</a>';
			}
			str += '</div >';
			document.getElementById("three").innerHTML = str;
		}
		if (location.hash == '#view') {
			var str = "";
			document.getElementById("three").innerHTML = str;
		}
		SystemForm.GetPrivByEmpCode(SystemForm.SelectedData.EmpCode, SystemForm.SelectedData.CityID);		
	},
	Cancel: function () {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	},
	//职务授权
	SaveClick: function () {
		var zTree = $.fn.zTree.getZTreeObj("systree");
		var param = {};
		param.PositionCode = SystemForm.SelectedData.PositionCode;
		param.PlatForm = 3;
		PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivModuleByPosition", param, true, function (result) {
			var initpriv = "";
			if (!!result.Data) {
				initpriv = result.Data.ModulePrivList;
			}
			else {
				return;
			}
			if (!!initpriv) {
				var menuIds = initpriv.split(',');
				for (var i = 0; i < menuIds.length; i++) {
					var node = zTree.getNodeByParam("ModuleCode", menuIds[i]);
					if (node != null) {
						zTree.checkNode(node, true);
					}
				};
			}
		});	
	},
	SavePrivToEmp: function () {
		var codes = "";
		var treeObj = $.fn.zTree.getZTreeObj("systree"),
			nodes = treeObj.getCheckedNodes(true),
			v = "";
		for (var i = 0; i < nodes.length; i++) {
			codes += nodes[i].ModuleCode + ",";
		}
		var param = {};
		param.ModulePrivList = codes.substring(0, codes.length - 1);
		param.EmpCode = SystemForm.SelectedData.EmpCode;
		param.PlatForm = 3;
		param.CityID = SystemForm.SelectedData.CityID;
		PublicComm.Ajax("POST", "/Authority/Privilege/UpdateEmpPrivilege", param, true, function (result) {
			layui.use('layer', function () {
				var layer = layui.layer;
				if (result.Code == 2000) {
					layer.alert('保存成功');
				}
				else {
					layer.alert(result.Messege);
				}
			});
		});
	},
	SavePrivToPosition: function () {
		var codes = "";
		var treeObj = $.fn.zTree.getZTreeObj("systree"),
			nodes = treeObj.getCheckedNodes(true),
			v = "";
		for (var i = 0; i < nodes.length; i++) {
			codes += nodes[i].ModuleCode + ",";
		}
		SystemForm.codejson = { 'ModulePrivList': codes.substring(0, codes.length - 1)};
		layui.use("layer", function () {
			var layer = layui.layer;
			layer.open({
				type: 2,
				title: '保存权限到职位',
				area: ['500px', '300px'], //宽高
				content: 'system_multi.html',
				scrollbar: false,//禁用滚动条
				btnAlign: 'd'
			});
		});				
	},
	GetPrivByEmpCode: function (empcode, cityid) {
		var Emp = { 'EmpCode': empcode, 'PlatForm': 3, 'CityID': cityid };
		PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivModuleByEmployee", Emp, true, function (result) {
			var param = {};
			param.PlatForm = SystemForm.SelectedData.PlatForm;
			if (!!result.Data) {				
				ControlComm.GetPrivTree($('#systree'), "/Authority/Privilege/GetPrivilegeTreeList", param, result.Data.ModulePrivList);
			}
			else
			{
				ControlComm.GetPrivTree($('#systree'), "/Authority/Privilege/GetPrivilegeTreeList", param);
			}
		});
	},
}
$(function () {
	SystemForm.Init();
});
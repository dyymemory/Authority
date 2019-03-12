﻿var EmployeeEdit = {
	PlatFormSelect: 1,
	CityID: 1,
	PositionPrivParam: {},
	DepartSelectedNodes: [],
	Employee: window.parent.EmployeeIndex.SelectedData,
	Init: function () {
		PrivComm.Init();
		if (location.hash == '#privset') {
			var str = "";
			if (PrivComm.CheckAuthority('priv-empauth-set-initpos')) {
				str += '<input type="button" id="InitPositioPriv" value="职务授权" class="layui-btn layui-btn-sm" />';
			}
			if (PrivComm.CheckAuthority('priv-empauth-set-saveemp')) {
				str += '<input type="button" id="SavePrivToEmp" value="保存权限到员工" class="layui-btn layui-btn-sm" />';
			}
			if (PrivComm.CheckAuthority('priv-empauth-set-pos')) {
				str += '<input type="button" id="SavePrivToPosition" value="保存权限到职务" class="layui-btn layui-btn-sm" />';
			}
			document.getElementById("three").innerHTML = str;
			//$('#three').html(str);
		}
		if (location.hash == '#view') {
			var str = "";
			document.getElementById("three").innerHTML = str;
		}
        layui.use(['element', 'form'], function () {
            var element = layui.element,
                form = layui.form;
            form.render();
            $('.site-demo-active').on('click', function () {
                var othis = $(this), type = othis.data('type');
                active[type] ? active[type].call(this, othis) : '';
			});
			if (PrivComm.IsAdmin()) {
				ControlComm.CityBinding($('#City'), form, EmployeeEdit.Employee.CityID);				
			}
			else {
				ControlComm.PrivCityBinding($('#City'), form, EmployeeEdit.Employee.CityID, { 'CityID': EmployeeEdit.Employee.CityID, 'PlatForm': $("input:radio[name='platform']:checked").val() });
			}
			ControlComm.DepartmentBinding($('#Department'), form, EmployeeEdit.Employee.CityID);
			//获取部门权限树			
			var param = {};
			param.PlatForm = 1;
			param.EmpCode = EmployeeEdit.Employee.EmpCode;
			param.CityID = EmployeeEdit.CityID;
			param.PlatForm = EmployeeEdit.PlatFormSelect;			
			EmployeeEdit.LoadPrivModule(form);
			if (PrivComm.CheckAuthority('priv-empauth-set-manage')) {
				EmployeeEdit.InitDepartPrivTree(param, form);
			}
			else {
				$('DepartmentPermissionsInit').html(PrivComm.NoAuthorityHTML);
			}
			if (PrivComm.CheckAuthority('priv-empauth-set-data')) {
				ControlComm.DataPermissionsBinding($('#DataPermissions'), form);
			}
			//城市选择事件
			form.on('select(City)', function () {
				var CityID = $("#City").find("option:selected").attr("value");
				if (!!CityID) {
					if (PrivComm.CheckAuthority('priv-empauth-set-manage')) {
						ControlComm.DepartmentBinding($('#Department'), form, CityID);
						EmployeeEdit.InitDepartPrivTree(param, form);
					}
					else {
						$('DepartmentPermissionsInit').html(PrivComm.NoAuthorityHTML);
					}
				}
			});			
			// 平台选择事件
			form.on('radio(platform)', function () {
				if (PrivComm.IsAdmin()) {
					ControlComm.CityBinding($('#City'), form, EmployeeEdit.Employee.CityID);
				}
				else {
					ControlComm.PrivCityBinding($('#City'), form, EmployeeEdit.Employee.CityID, { 'CityID': EmployeeEdit.Employee.CityID, 'PlatForm': $("input:radio[name='platform']:checked").val() });
				}
				param.PlatForm = $("input:radio[name='platform']:checked").val();
				EmployeeEdit.PlatFormSelect = param.PlatForm;
				var CityID = $("#City").val();
				if (CityID == null || CityID == "") {
					var strHTML = '<option value="">直接选择或搜索选择</option>';
					$('#Department').html(strHTML);
					form.render();
				}
				else {
					ControlComm.DepartmentBinding($('#Department'), form, CityID);
				}
				if (PrivComm.CheckAuthority('priv-empauth-set-manage')) {
					EmployeeEdit.InitDepartPrivTree(param, form);
				}
				else {
					$('DepartmentPermissionsInit').html(PrivComm.NoAuthorityHTML);
				}
				EmployeeEdit.LoadPrivModule(form);
			});
		});
		$('#InitPositioPriv').on('click', function () {			
			EmployeeEdit.InitPositioPriv();
		});
		$('#SavePrivToEmp').on('click', function () {
			EmployeeEdit.SavePrivToEmp();
		});
		$('#SavePrivToPosition').on('click', function () {
			EmployeeEdit.SavePrivToPosition();
		});
	},
	//初始化树节点  重新绑定部门树
	InitDepartPrivTree: function (param, form) {
		//获取当前员工的部门权限
		PublicComm.Ajax("POST", "/Authority/Privilege/GetDepartPrivByEmployee", param, true, function (result) {
			checkednodes = [];
			AllSelectNodes = [];
			for (var i = 0; i < result.Data.length; i++) {
				checkednodes.push(result.Data[i].DepartOnlyCode);
			}
			EmployeeEdit.DepartSelectedNodes = checkednodes;
			//初始化部门
			var CityID = $("#City").find("option:selected").attr("value");
			ControlComm.GetDeptTree($('#DepartmentPermissions'),CityID, checkednodes);
			//监听部门选择 重新绑定树
			form.on('select(Department)', function (result) {
				PublicComm.Ajax("POST", '/Authority/Department/GetDepartmentListByCity', param, true, function (result) {
					EmployeeEdit.RefreshSelectedNodes("DepartmentPermissions",EmployeeEdit.DepartSelectedNodes)
					var listSorted = [];
					var deptno = $("#Department").find("option:selected").attr("DeptNo");
					var parentdeptno = $("#Department").find("option:selected").attr("ParentDeptNo");
					if (!!deptno) {
						EmployeeEdit.GetChildNode(deptno, result.Data, listSorted);
						EmployeeEdit.GetParentNode(parentdeptno, result.Data, listSorted);
						ControlComm.GetDeptTree($('#DepartmentPermissions'), CityID, EmployeeEdit.DepartSelectedNodes, listSorted);
					}
					else {
						ControlComm.GetDeptTree($('#DepartmentPermissions'), CityID, EmployeeEdit.DepartSelectedNodes);
					}
				});
			});
		});	
	},
	GetCheckedNodes: function () {

	},
    SaveData: function () {
        var user = CacheHelper.GetUser();
        var param = {};
	},
	// 初始化加载 数据权限 模块权限
    LoadPrivModule: function (form) {
        $('#DataPermissions input:radio').prop('checked', false);
        var param = {};
		param.EmpCode = EmployeeEdit.Employee.EmpCode;
		param.CityID = $("#City").find("option:selected").attr("value");
		param.PlatForm = $("input:radio[name='platform']:checked").val();
		if (param.PlatForm == 1) { //选择U+平台
			ControlComm.DataPermissionsBinding($('#DataPermissions'), form);
		}
		else {
			ControlComm.DataPermissionsBindingNotUPlus($('#DataPermissions'), form);
		}
		if (PrivComm.CheckAuthority('priv-empauth-set-data') || PrivComm.CheckAuthority('priv-empauth-set-module')) {
			PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivModuleByEmployee", param, true, function (result) {
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
				}
				else {
					layui.each(ControlComm.DataPermissions, function () {
						$('#DataPermissions input:radio[name=' + this.name + '][value=0]').prop('checked', true);
					});
				}
				form.render('radio');
				var param = {};
				param.PlatForm = $("input:radio[name='platform']:checked").val();
				if (!PrivComm.CheckAuthority('priv-empauth-set-data')) {
					$('#DataPermissionsInit').html(PrivComm.NoAuthorityHTML);
				}
				if (PrivComm.CheckAuthority('priv-empauth-set-module')) {
					ControlComm.GetPrivTree($('#Modular'), '/Authority/Privilege/GetAllModulePrivilegeList', param, modulePrivList);
				}
				else {
					$('#ModularInit').html(PrivComm.NoAuthorityHTML);
				}
			});
		}
		else {
			$('#DataPermissionsInit').html(PrivComm.NoAuthorityHTML);
			$('#ModularInit').html(PrivComm.NoAuthorityHTML);
		}
	},
	//选中树的节点
	RefreshSelectedNodes: function (treeId, arr) {
		var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
		if (!!zTreeObj) {
			var unCheckedNodes = zTreeObj.getCheckedNodes(false);
			layui.each(unCheckedNodes, function () {
				if (arr.indexOf(this.DepartOnlyCode) >= 0) {
					arr.splice(arr.indexOf(this.DepartOnlyCode), 1);
				}
			});
			var checkedNodes = zTreeObj.getCheckedNodes(true);
			layui.each(checkedNodes, function () {
				if (arr.indexOf(this.DepartOnlyCode) == -1) {
					arr.push(this.DepartOnlyCode);
				}
			});
		}
	},
	//刷新部门树
	// eleme 树id
	// listSorted 节点集合
	FreshDepartmentTree: function (eleme, data, checkednodes) {
		var zTree;
		var setting = {
			view: {
				selectedMulti: true
			},
			check: {
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "s", "N": "s" }
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "DeptNo",
					pIdKey: "ParentDeptNo",
					rootPId: 0
				}
				,
				key: {
					checked: "checked",
					name: "DeptName",
					id: "DepartOnlyCode"
				}
			},
			edit: {
				enable: false
			}
		};
		zTree = $.fn.zTree.init(eleme, setting, data);
		if (!!checkednodes) {
			for (var i = 0; i < checkednodes.length; i++) {
				var node = zTree.getNodeByParam("DepartOnlyCode", checkednodes[i]);
				if (node != null) {
					zTree.checkNode(node, true);
				}
			};
		}
		//zTree.expandAll(true);
	},
	//获取所有父节点
	// deptno 当前节点的parentno
	// deptlist 树的所有节点
	// listSorted 子节点集合
	GetParentNode: function (deptno, deptlist, listSorted) {
		if (EmployeeEdit.IsContain(deptno, listSorted)) {
			return;
		}
		for (var i = 0; i < deptlist.length; i++) {
			if (deptno == deptlist[i].DeptNo) {
				listSorted.push(deptlist[i]);
				EmployeeEdit.GetParentNode(deptlist[i].ParentDeptNo, deptlist, listSorted);
			}
		}
	},
	//获取所有子节点
	// deptno 当前节点deptno
	// deptlist 树的所有节点
	// listSorted 节点集合
	GetChildNode: function (deptno, deptlist, listSorted) {
		//if (EmployeeEdit.IsContain(deptno, listSorted)) {
		//	return;
		//}
		for (var i = 0; i < deptlist.length; i++) {
			if (deptno == deptlist[i].DeptNo) {
				if (listSorted.indexOf(deptlist[i]) <= 0) {
					listSorted.push(deptlist[i]);
				}
			}
			if (deptno == deptlist[i].ParentDeptNo) {
				listSorted.push(deptlist[i]);
				EmployeeEdit.GetChildNode(deptlist[i].DeptNo, deptlist, listSorted);
			}
		}
	},
	IsContain: function (deptno, listSorted) {
		for (var i = 0; i < listSorted.length; i++) {
			if (deptno == listSorted[i].DeptNo) {
				return true;
			}
		}
		return false;
	},
	// 职务授权
	InitPositioPriv: function () {
		CacheHelper.GetUser();
		var param = {};
		param.PlatForm = $('input:radio[name=platform]').val();
		param.PositionCode = EmployeeEdit.Employee.PositionCode;
		PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivModuleByPosition", param, true, function (result) {
			var modulePrivList = '';
			if (!!result.Data) {
				layui.each(ControlComm.DataPermissions, function () {
					var value = JSON.parse(result.Data.DataPrivJson)[this.name];
					value = !!value ? value : 0;
					$('#DataPermissions input:radio[name=' + this.name + '][value=' + value + ']').prop('checked', true);
				});
				modulePrivList = result.Data.ModulePrivList;
			}
			else {
				layui.each(ControlComm.DataPermissions, function () {
					$('#DataPermissions input:radio[name=' + this.name + '][value=0]').prop('checked', true);
				});
			}
			var element = layui.element;
			form = layui.form;
			form.render('radio');
			var param = {};
			param.PlatForm = $("input:radio[name='platform']:checked").val();
			var initpriv = result.Data.ModulePrivList;
			if (!!initpriv) {
				var menuIds = privString.split(',');
				for (var i = 0; i < menuIds.length; i++) {
					var node = zTree.getNodeByParam("ModuleCode", menuIds[i]);
					if (node != null) {
						zTree.checkNode(node, true);
					}
				};
			}
			//ControlComm.GetPrivTree($('#Modular'), '/Authority/Privilege/GetAllModulePrivilegeList', param, modulePrivList);
		});
	},
	// 保存权限到员工
	SavePrivToEmp: function () {
		CacheHelper.GetUser();
		EmployeeEdit.RefreshSelectedNodes("DepartmentPermissions", EmployeeEdit.DepartSelectedNodes);
		var DataPrivJson = EmployeeEdit.BuildDataPriv();
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
		var mod = PublicComm.GetServeDate();
		var moddate = mod.Format("yyyy-MM-dd hh:mm:ss.S");
		var param = {};
		param.DataPrivJson = Json;//数据权限
		param.ModulePrivList = codes.substring(0, codes.length - 1);//模块权限
		param.DepartmentPriv = EmployeeEdit.DepartSelectedNodes;
		param.ModDate = moddate;
		param.CreateDate = moddate;
		param.CityID = EmployeeEdit.Employee.CityID;
		param.EmpCode = EmployeeEdit.Employee.EmpCode;
		param.PlatForm = EmployeeEdit.PlatFormSelect;
		var user = layui.sessionData('login').user;
		if (!!user) {
			param.Modifier = user.EmpCode;
			param.Creator = user.EmpCode;
		}
		PublicComm.Ajax("POST", "/Authority/Privilege/UpdateUplusEmpPrivilege", param, true, function (result) {
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
	//保存权限到职位
	SavePrivToPosition: function () {
		CacheHelper.GetUser();
		var DataPrivJson = EmployeeEdit.BuildDataPriv();
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
		var mod = PublicComm.GetServeDate();
		var moddate = mod.Format("yyyy-MM-dd hh:mm:ss.S");
		var param = {};
		param.DataPrivJson = Json;//数据权限
		param.ModulePrivList = codes.substring(0, codes.length - 1);//模块权限
		param.ModDate = moddate;
		param.CreateDate = moddate;
		param.PositionCode = EmployeeEdit.Employee.PositionCode;
		param.PlatForm = EmployeeEdit.PlatFormSelect;
		var user = layui.sessionData('login').user;
		if (!!user) {
			param.Modifier = user.EmpCode;
			param.Creator = user.EmpCode;
		}
		EmployeeEdit.PositionPrivParam = param;
		layui.use("layer", function () {
			var layer = layui.layer;
			layer.open({
				type: 2,
				title: '保存权限到职位',
				area: ['500px', '300px'], //宽高
				content: 'employee_multi.html',
				scrollbar: false,//禁用滚动条
				btnAlign: 'd'
			})
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
	GetUniq: function (array) {
		var temp = [];
		for (var i = 0; i < array.length; i++) {
			if (temp.indexOf(array[i]) == -1) {
				temp.push(array[i]);
			}
		}
		return temp;
	},
}

$(function () {
    EmployeeEdit.Init();
});

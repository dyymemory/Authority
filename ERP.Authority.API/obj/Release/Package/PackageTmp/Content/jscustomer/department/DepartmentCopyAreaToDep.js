﻿var DepartmentCopyAreaToDep = {
	DepartOnlyCodeSelected: window.parent.DepartmentIndex.AreaDepartOnlyCodeSelected,//主树选中的部门code
	TypeCodeSelected: window.parent.DepartmentIndex.AreaTypeCodeSelected,//radio 选中的按钮
	CopyedSelectedNodes: [],//要保存权限的门店集合
	Init: function () {
		CacheHelper.GetUser();
		var radios = document.getElementsByName('TypeCodeArea');
		// 初始化 radio 勾选状态 
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].value == DepartmentCopyAreaToDep.TypeCodeSelected) {
				radios[i].checked = true;
				break;
			}
		}
		var InitCityID = location.hash.substr(1);
		layui.use(['form'], function () {
			var form = layui.form;
			form.render();
			ControlComm.CityBinding($('#City'), form, InitCityID);
			form.on('select(City)', function () {
				ControlComm.DepartmentBinding($('#Department'), form, $('#City').val());
				ControlComm.GetDeptTree($('#copyToDataTree'), $('#City').val());
			});
			form.on('select(Department)', function () {
				var listSorted;
				$('#Department').val() == "" ? listSorted = null : listSorted = DepartmentCopyAreaToDep.GetTreeListSorted($('#Department').find('option:selected').eq(0), CacheHelper.GetDepartment($('#City').val()));
				DepartmentCopyAreaToDep.RefreshSelectedNodes("copyToDataTree", DepartmentCopyAreaToDep.CopyedSelectedNodes);
				ControlComm.GetDeptTree($('#copyToDataTree'), $('#City').val(), DepartmentCopyAreaToDep.CopyedSelectedNodes, listSorted);
			});
			var typeCode = $('input:radio[name=TypeCodeArea]:checked').val();
			// 加载左边树 禁用CheckBox
			PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': InitCityID, 'DepartOnlyCode': DepartmentCopyAreaToDep.DepartOnlyCodeSelected, 'TypeCodeList': [typeCode], 'ViewType': 1 }, true, function (result) {
				if (!!result) {					
					var node = [];
					for (var i = 0; i < result.Data.length; i++) {
						node.push(result.Data[i].DataCode);
					};
					ControlComm.GetAreaTreeNoCheck($('#deptDataTree'), InitCityID, node);
				}
			});
			ControlComm.DepartmentBinding($('#Department'), form, $('#City').val());
			ControlComm.GetDeptTree($('#copyToDataTree'), InitCityID);
			// radio  选择事件
			form.on('radio(TypeCodeArea)', function () {
				var typeCode = $('input:radio[name=TypeCodeArea]:checked').val();
				DepartmentCopyAreaToDep.TypeCodeSelected = typeCode;
				var deptDataTree = $.fn.zTree.getZTreeObj("deptDataTree");
				if (!!deptDataTree) {
					PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': InitCityID, 'DepartOnlyCode': DepartmentCopyAreaToDep.DepartOnlyCodeSelected, 'TypeCodeList': [typeCode], 'ViewType': 1 }, true, function (result) {
						deptDataTree.checkAllNodes(false);
						if (!!result.Data) {
							for (var i = 0; i < result.Data.length; i++) {
								var node = deptDataTree.getNodeByParam("DataCode", result.Data[i].DataCode);
								if (node != null) {
									deptDataTree.checkNode(node, true);
								}
							};
						};
					});
				};
			});
		});
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
	///<summary>
	///获取ztree所有父节点
	///</summary>
	///<param name="parentDeptNo">当前节点的parentDeptNo</param>
	///<param name="deptList">树的所有节点</param>
	///<param name="listSorted">返回节点集合</param>
	///<return></return>
	GetParentNode: function (parentDeptNo, deptList, listSorted) {
		if (DepartmentCopyAreaToDep.IsContain(parentDeptNo, listSorted)) {
			return;
		}
		for (var i = 0; i < deptList.length; i++) {
			if (parentDeptNo == deptList[i].DeptNo) {
				listSorted.push(deptList[i]);
				DepartmentCopyAreaToDep.GetParentNode(deptList[i].ParentDeptNo, deptList, listSorted);
			}
		}
	},
	///<summary>
	///获取ztree所有子节点
	///</summary>
	///<param name="deptno">当前节点的deptno</param>
	///<param name="deptList">树的所有节点</param>
	///<param name="listSorted">返回节点集合</param>
	///<return></return>
	GetChildNode: function (deptno, deptList, listSorted) {
		for (var i = 0; i < deptList.length; i++) {
			if (deptno == deptList[i].DeptNo) {
				if (listSorted.indexOf(deptList[i]) <= 0) {
					listSorted.push(deptList[i]);
				}
			}
			if (deptno == deptList[i].ParentDeptNo) {
				listSorted.push(deptList[i]);
				DepartmentCopyAreaToDep.GetChildNode(deptList[i].DeptNo, deptList, listSorted);
			}
		}
	},
	IsContain: function (deptNo, listSorted) {
		for (var i = 0; i < listSorted.length; i++) {
			if (deptNo == listSorted[i].DeptNo) {
				return true;
			}
		}
		return false;
	},
	///<summary>
	///获取ztree新节点
	///</summary>
	///<param name="dept">选择的部门</param>
	///<param name="deptList">树的所有节点</param>
	///<return>返回选择部门的节点集合</return>
	GetTreeListSorted: function (dept, deptList) {
		var listSorted = [];
		DepartmentCopyAreaToDep.GetParentNode($(dept).attr('ParentDeptNo'), deptList, listSorted);
		DepartmentCopyAreaToDep.GetChildNode($(dept).attr('DeptNo'), deptList, listSorted);
		return listSorted;
	},
	Cancel: function () {
		var Index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
		parent.layer.close(Index);
	},
	Confirm: function () {
		CacheHelper.GetUser();
		var DataCodeList = [];
		DepartmentCopyAreaToDep.RefreshSelectedNodes("copyToDataTree", DepartmentCopyAreaToDep.CopyedSelectedNodes);
		var zTreeObj = $.fn.zTree.getZTreeObj("deptDataTree");
		var DataCodeNodes = zTreeObj.getCheckedNodes(true);
		for (var i = 0; i < DataCodeNodes.length; i++) {
			DataCodeList.push(DataCodeNodes[i].DataCode);
		}
		var DepartOnlyCodeList = DepartmentCopyAreaToDep.CopyedSelectedNodes;
		if (DepartOnlyCodeList.length <= 0) {
			layui.use('layer', function () {
				var layer = layui.layer;
				layer.alert("请选择一个部门");
			});
			return;
		}
		var TypeCode = $('input:radio[name=TypeCodeArea]:checked').val();
		var param = {};
		param.DataCodeList = DataCodeList;
		param.DepartOnlyCodeList = DepartOnlyCodeList;
		param.CityID = $('#City').val();
		param.PlatForm = 1;
		param.TypeCode = TypeCode;
		param.ViewType = 1;
		PublicComm.Ajax("POST", "/Authority/Privilege/CopyPrivDepartmentToOthers", param, true, function (result) {
			if (!!result) {
				if (result.Code == 2000) {
					layer.alert("保存成功");
				} else {
					layer.alert("保存失败，原因：" + result.Message);
				}
			}
		});
	},
}
$(function () {
	DepartmentCopyAreaToDep.Init();
});
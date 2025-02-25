﻿/*JS 常用控件*/
var ControlComm = {
    ///<summary>
    ///城市下拉框绑定
    ///</summary>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<param name="cityid">城市ID，赋默认值</param>
    ///<param name="callBack">回调函数</param>
    ///<return></return>
    CityBinding: function (element, form, cityid, callBack) {
        if (!!CacheHelper.GetCity()) {
            ControlComm.CityOption(CacheHelper.GetCity(), element, form, cityid);
            typeof callBack === 'function' ? callBack() : '';

        } else {
			PublicComm.Ajax("POST", "/Authority/City/GetAllCityList", null, true, function (result) {
				CacheHelper.SetCity(result.Data);
                ControlComm.CityOption(CacheHelper.GetCity(), element, form, cityid);
                typeof callBack == 'function' ? callBack() : '';
            });
        }
	},
	PrivCityBinding: function (element, form, cityid, param) {
		PublicComm.Ajax("POST", "/Authority/City/GetAllCityList", param, false, function (result) {
			ControlComm.CityOption(result.Data, element, form, cityid);
		});
	},
    ///<summary>
    ///城市下拉框绑定
    ///</summary>
    ///<param name="arrJson">城市数组</param>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<param name="cityid">城市ID，赋默认值</param>
    ///<return></return>
	CityOption: function (arrJson, element, form, cityid) {
        var strHTML = '<option value="">直接选择或搜索选择</option>';
        for (var index in arrJson) {
            strHTML += '<option value="' + arrJson[index].CityID + '">' + arrJson[index].CityName + '</option>';
        }
        $(element).html(strHTML);
        if (!!cityid) {
            $(element).find("[value='" + cityid + "']").prop("selected", true);
        }
        form.render();
    },
    ///<summary>
    ///部门下拉框绑定
    ///</summary>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<param name="cityid">城市ID</param>
    ///<return></return>
    DepartmentBinding: function (element, form, cityid) {
        if (!!CacheHelper.GetDepartment(cityid)) {
            ControlComm.DepartmentOption(CacheHelper.GetDepartment(cityid), element, form);
        } else {
            PublicComm.Ajax("POST", "/Authority/Department/GetDepartmentListByCity", { CityID: cityid }, true, function (result) {
                CacheHelper.SetDepartment(cityid, result.Data);
                ControlComm.DepartmentOption(CacheHelper.GetDepartment(cityid), element, form);
            });
        }

    },
    ///<summary>
    ///部门下拉框绑定
    ///</summary>
    ///<param name="arrJson">部门数组</param>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<return></return>
    DepartmentOption: function (arrJson, element, form) {
        var strHTML = '<option value="">全部</option>';
        for (var index in arrJson) {
            strHTML += '<option value="' + arrJson[index].DeptID + '" DepartOnlyCode="' + arrJson[index].DepartOnlyCode + '" DeptNo="' + arrJson[index].DeptNo + '" ParentDeptNo="' + arrJson[index].ParentDeptNo + '">[' + arrJson[index].Header + ']' + arrJson[index].DeptName + '</option>';
        }
        $(element).html(strHTML);
        form.render();
    },
    ///<summary>
    ///员工下拉框绑定
    ///</summary>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<param name="param">url参数，格式：{ 'DeptID': '' }</param>
    ///<return></return>
    EmployeeBinding: function (element, form, param) {
        PublicComm.Ajax("POST", "/Authority/Employee/GetEmployeeListByDeptID", param, true, function (result) {
            var strHTML = '<option value="">直接选择或搜索选择</option>';
            for (var index in result.Data) {
                strHTML += '<option value="' + result.Data[index].EmpCode + '" EmpID="' + result.Data[index].EmpID + '">[' + result.Data[index].EmpNo + ']' + result.Data[index].EmpName + '</option>';
            }
            $(element).html(strHTML);
            form.render();
        });
    },
    ///<summary>
    ///职位下拉框绑定
    ///</summary>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<param name="cityid">城市ID</param>
    ///<param name="positionid">职位ID，赋默认值</param>
    ///<return></return>
    PositionBinding: function (element, form, cityid, positionid) {
        if (!!CacheHelper.GetPosition(cityid)) {
            ControlComm.PositionOption(CacheHelper.GetPosition(cityid), element, form, positionid);
        } else {
            PublicComm.Ajax("POST", "/Authority/Position/GetPositionListByCity", { CityID: cityid }, true, function (result) {
                CacheHelper.SetPosition(cityid, result.Data);
				ControlComm.PositionOption(CacheHelper.GetPosition(cityid), element, form, positionid);
            });
        }

    },
    ///<summary>
    ///职位下拉框绑定
    ///</summary>
    ///<param name="arrJson">职位数组</param>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<param name="positionid">职位ID，赋默认值</param>
    ///<return></return>
    PositionOption: function (arrJson, element, form, positionid) {
        var strHTML = '<option value="">直接选择或搜索选择</option>';
        for (var index in arrJson) {
            strHTML += '<option value="' + arrJson[index].PositionID + '" PositionCode="' + arrJson[index].PositionCode + '">' + arrJson[index].PositionName + '</option>';
        }
        $(element).html(strHTML);
        if (positionid != null) {
            $(element).find("[value='" + positionid + "']").attr("selected", true);
        }
        form.render();
    },
    ///<summary>
    ///片区下拉框绑定
    ///</summary>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<param name="cityid">城市ID</param>
    ///<return></return>
    AreaBinding: function (element, form, cityid) {
        if (!!CacheHelper.GetArea(cityid)) {
            ControlComm.AreaOption(CacheHelper.GetArea(cityid), element, form);
        } else {
            PublicComm.Ajax("POST", "/Authority/Area/GetTreeAreaDistrictByCity", { CityID: cityid }, true, function (result) {
                CacheHelper.SetArea(cityid, result.Data);
                ControlComm.AreaOption(CacheHelper.GetArea(cityid), element, form);
            });
        }

    },
    ///<summary>
    ///片区下拉框绑定
    ///</summary>
    ///<param name="arrJson">片区数组</param>
    ///<param name="element">需要绑定option的控件</param>
    ///<param name="form">layui.form，用于渲染</param>
    ///<return></return>
    AreaOption: function (arrJson, element, form) {
        var strHTML = '<option value="">全部</option>';
        for (var index in arrJson) {
            strHTML += '<option value="' + arrJson[index].DataCode + '" ID="' + arrJson[index].ID + '" ParentID="' + arrJson[index].ParentID + '">' + arrJson[index].Name + '</option>';
        }
        $(element).html(strHTML);
        form.render();
    },
    // 根据平台获取模块权限
    GetPrivTree: function (element, url, param, privString) {
        if (!!CacheHelper.GetModule(param.PlatForm)) {
            var zTree;
            var setting = {
                view: {
                    selectedMulti: true
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "ps", "N": "ps" }
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "ModuleCode",
                        pIdKey: "ParentCode",
                        rootPId: 0
                    }
					,
                    key: {
                        checked: "checked",
                        name: "ModuleName",
                        id: "ModuleCode"
                    }
                },
                edit: {
                    enable: false
                }
            };
            zTree = $.fn.zTree.init(element, setting, CacheHelper.GetModule(param.PlatForm));
            if (!!privString) {
                var menuIds = privString.split(',');
                for (var i = 0; i < menuIds.length; i++) {
                    var node = zTree.getNodeByParam("ModuleCode", menuIds[i]);
                    if (node != null) {
                        zTree.checkNode(node, true);
                    }
                };
			}
			var nodes = zTree.getNodes();
			if (nodes.length > 0) {
				for (var i = 0; i < nodes.length; i++) {
					zTree.expandNode(nodes[i], true, false, false);//默认展开第一级节点
				}
			}
            //zTree.expandAll(true);
        }
        else {
            var zTree;
            var setting = {
                view: {
                    selectedMulti: true
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "ps", "N": "ps" }
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "ModuleCode",
                        pIdKey: "ParentCode",
                        rootPId: 0
                    }
					,
                    key: {
                        checked: "checked",
                        name: "ModuleName",
                        id: "ModuleCode"
                    }
                },
                edit: {
                    enable: false
                }
            };
            PublicComm.Ajax("POST", url, param, true, function (result) {
                CacheHelper.SetModule(param.PlatForm, result.Data);
                zTree = $.fn.zTree.init(element, setting, result.Data);
                //undefined,null,0
                if (!!privString) {
                    var menuIds = privString.split(',');
                    for (var i = 0; i < menuIds.length; i++) {
                        var node = zTree.getNodeByParam("ModuleCode", menuIds[i]);
                        if (node != null) {
                            zTree.checkNode(node, true);
                        }
                    };
				}
				var nodes = zTree.getNodes();
				if (nodes.length > 0) {
					for (var i = 0; i < nodes.length; i++) {
						zTree.expandNode(nodes[i], true, false, false);//默认展开第一级节点
					}
				}
                //zTree.expandAll(true);
            });
        }
    },
    DataPermissions: [
		{ 'name': 'multy-divisitionSel', 'text': '管辖权限' },
		{ 'name': 'multy-publicSel', 'text': '公盘看' },
		{ 'name': 'multy-privateSel', 'text': '私盘看' },
		{ 'name': 'multy-specialSel', 'text': '特盘看' },
		{ 'name': 'multy-finalSel', 'text': '封盘看' },
		{ 'name': 'multy-publicSelDetail', 'text': '公盘看详情' },
		{ 'name': 'multy-privateSelDetail', 'text': '私盘看详情' },
		{ 'name': 'multy-specialSelDetail', 'text': '特盘看详情' },
		{ 'name': 'multy-finalSelDetail', 'text': '封盘看详情' },
		{ 'name': 'multy-publicModify', 'text': '公盘设' },
		{ 'name': 'multy-privateModify', 'text': '私盘设' },
		{ 'name': 'multy-specialModify', 'text': '特盘设' },
		{ 'name': 'multy-finalModify', 'text': '封盘设' },
		{ 'name': 'multy-publicCusSel', 'text': '公客' },
		{ 'name': 'multy-privateCusSel', 'text': '私客' },
    ],
    DataPermissionsBinding: function (element, form) {
        var strHTML = '';
        layui.each(ControlComm.DataPermissions, function () {
            strHTML += '<div class="layui-form-item" pane>';
            strHTML += '<label class="layui-form-label">' + this.text + '：</label>';
            strHTML += '<div class="layui-input-block">';
            strHTML += '<input type="radio" name="' + this.name + '" value="0" title="无">';
            strHTML += '<input type="radio" name="' + this.name + '" value="1" title="本人">';
            strHTML += '<input type="radio" name="' + this.name + '" value="2" title="本部">';
            strHTML += '<input type="radio" name="' + this.name + '" value="3" title="跨部">';
            strHTML += '</div>';
            strHTML += '</div>';
        });
        $(element).html(strHTML);
        form.render();
    },
    // 控件 城市id 默认选中值 树的数据源
    GetDeptTree: function (element, cityid, arrDept, listSorted) {
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
            },
        };
        var InitDeptTree = function (listDept) {
            zTree = $.fn.zTree.init(element, setting, listDept);
            if (!!arrDept) {
                for (var i = 0; i < arrDept.length; i++) {
                    var node = zTree.getNodeByParam("DepartOnlyCode", arrDept[i]);
                    if (node != null) {
                        zTree.checkNode(node, true);
                    }
                };
            }
            //zTree.expandAll(true);
        };
        if (!!listSorted) {
            InitDeptTree(listSorted);
        } else {
            if (!!CacheHelper.GetDepartment(cityid)) {
                InitDeptTree(CacheHelper.GetDepartment(cityid));
            } else {
                PublicComm.Ajax("POST", '/Authority/Department/GetDepartmentListByCity', { CityID: cityid }, true, function (result) {
                    CacheHelper.SetDepartment(cityid, result.Data);
                    InitDeptTree(CacheHelper.GetDepartment(cityid));
                });
            }
        }

    },
    GetDeptTreeNoCheck: function (element, cityid, arrDept, listSorted) {
        var zTree;
        function zTreeBeforeCheck(treeId, treeNode) {
            return false;
        };
        var setting = {
            callback: {
                beforeCheck: zTreeBeforeCheck
            },
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
            },
        };
        var InitDeptTree = function (listDept) {
            zTree = $.fn.zTree.init(element, setting, listDept);
            if (!!arrDept) {
                for (var i = 0; i < arrDept.length; i++) {
                    var node = zTree.getNodeByParam("DepartOnlyCode", arrDept[i]);
                    if (node != null) {
                        zTree.checkNode(node, true);
                    }
                };
            }
            //zTree.expandAll(true);
        };
        if (!!listSorted) {
            InitDeptTree(listSorted);
        } else {
            if (!!CacheHelper.GetDepartment(cityid)) {
                InitDeptTree(CacheHelper.GetDepartment(cityid));
            } else {
                PublicComm.Ajax("POST", '/Authority/Department/GetDepartmentListByCity', { CityID: cityid }, true, function (result) {
                    CacheHelper.SetDepartment(cityid, result.Data);
                    InitDeptTree(CacheHelper.GetDepartment(cityid));
                });
            }
        }

    },
    GetAreaTree: function (element, cityid, arrArea, listSorted) {
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
                    idKey: "ID",
                    pIdKey: "ParentID",
                    rootPId: 0
                }
				,
                key: {
                    checked: "checked",
                    name: "Name",
                    id: "ID"
                }
            },
            edit: {
                enable: false
            },
        };
        var InitAreaTree = function (listArea) {
            zTree = $.fn.zTree.init(element, setting, listArea);
            if (!!arrArea) {
                for (var i = 0; i < arrArea.length; i++) {
                    var node = zTree.getNodeByParam("DataCode", arrArea[i]);
                    if (node != null) {
                        zTree.checkNode(node, true);
                    }
                };
            }
            //zTree.expandAll(true);
        };
        if (!!listSorted) {
            InitAreaTree(listSorted);
        } else {
            if (!!CacheHelper.GetArea(cityid)) {
                InitAreaTree(CacheHelper.GetArea(cityid));
            } else {
                PublicComm.Ajax("POST", '/Authority/Area/GetTreeAreaDistrictByCity', { CityID: cityid }, true, function (result) {
                    CacheHelper.SetArea(cityid, result.Data);
                    InitAreaTree(CacheHelper.GetArea(cityid));
                });
            }
        }

	},
	GetAreaTreeNoCheck: function (element, cityid, arrArea, listSorted) {
		var zTree;
		function zTreeBeforeCheck(treeId, treeNode) {
			return false;
		};
		var setting = {
			callback: {
				beforeCheck: zTreeBeforeCheck
			},
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
					idKey: "ID",
					pIdKey: "ParentID",
					rootPId: 0
				}
				,
				key: {
					checked: "checked",
					name: "Name",
					id: "ID"
				}
			},
			edit: {
				enable: false
			},
		};
		var InitAreaTree = function (listArea) {
			zTree = $.fn.zTree.init(element, setting, listArea);
			if (!!arrArea) {
				for (var i = 0; i < arrArea.length; i++) {
					var node = zTree.getNodeByParam("DataCode", arrArea[i]);
					if (node != null) {
						zTree.checkNode(node, true);
					}
				};
			}
			//zTree.expandAll(true);
		};
		if (!!listSorted) {
			InitAreaTree(listSorted);
		} else {
			if (!!CacheHelper.GetArea(cityid)) {
				InitAreaTree(CacheHelper.GetArea(cityid));
			} else {
				PublicComm.Ajax("POST", '/Authority/Area/GetTreeAreaDistrictByCity', { CityID: cityid }, true, function (result) {
					CacheHelper.SetArea(cityid, result.Data);
					InitAreaTree(CacheHelper.GetArea(cityid));
				});
			}
		}

	},
}

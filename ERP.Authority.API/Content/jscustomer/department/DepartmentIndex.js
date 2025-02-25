﻿var DepartmentIndex = {
    TabUplusDept: true, //U+门前权限第一次加载
    TabUplusArea: true, //U+地理权限第一次加载
    TabDivisitionDivisitionBeSeen: true, //门店管辖-能看我的第一次加载
    TabDeptBeSeen: true, //U+门前权限-能看我的第一次加载
    TabAreaBeSeen: true, //U+地理权限-能看我的第一次加载
    TypeCodeSelected: "", //U+门店权限我能看的 radio 选中的
    DepartOnlyCodeSelected: "", // U+门店权限面板 主树选择的部门
    AreaTypeCodeSelected: "", //U+地理权限我能看的 radio 选中的
    AreaDepartOnlyCodeSelected: "", //U+地理权限面板 主树选择的部门
    DivisitionCanSeeSelectedNodes: [], //管辖权限我能看的部门树选中节点
    DivisitionBeSeenSelectedNodes: [], //管辖权限能看我的部门树选中节点
    UplusCanSeeSelectedNodes: { FySel: [], CustSel: [], PublicOwner: [], PrivateOwner: [], CommonOwner: [], FyFellow: [], CustFellow: [] }, //U+系统我能看的部门树选中节点
    UplusBeSeenSelectedNodes: { FySel: [], CustSel: [], PublicOwner: [], PrivateOwner: [], CommonOwner: [], FyFellow: [], CustFellow: [] }, //U+系统能看我的部门树选中节点
    UplusAreaCanSeeSelectedNodes: { FySel: [], FyModify: [], CustSel: [], FyInfo: [] }, //U+系统我能看的片区树选中节点
    UplusAreaBeSeenSelectedNodes: { FySel: [], FyModify: [], CustSel: [], FyInfo: [] }, //U+系统我能看的片区树选中节点
    CacheDepartment: [],//U+门店权限我能看的专用部门缓存
    CacheArea: [],//U+门店权限我能看的专用片区缓存
    DeptCitySelected: "", //获取主城市选择CityId
    CurrentTypeCode: 'all', //当前U+门店权限我能看的raido的选中值，默认all
    CurrentTypeCodeBeSeen: 'dep-fy-sel', //当前U+门店权限能看我的raido的选中值，默认dep-fy-sel
    CurrentTypeCodeArea: 'all-area', //当前U+片区权限我能看的raido的选中值，默认all-area
    ChkboxType: { "Y" : "p", "N" : "s" },
    Init: function () {
        PrivComm.Init();
        layui.use(['element', 'form', 'layer'], function () {
            var element = layui.element,
                form = layui.form,
                layer = layui.layer;

            var cityChange = function () {
                ControlComm.DepartmentBinding($('#Department'), form, $('#City').val());
                if (PrivComm.CheckAuthority('priv-deptauth-query')) {
                    DepartmentIndex.GetDeptTreeNoCheck($('#deptTree'), $('#City').val());
                }
            };

            form.on('select(City)', cityChange);
            form.on('select(Department)', function () {
                var listSorted = DepartmentIndex.GetTreeListSorted($('#Department').find('option:selected').eq(0), CacheHelper.GetDepartment($('#City').val()));
                DepartmentIndex.GetDeptTreeNoCheck($('#deptTree'), $('#City').val(), listSorted);
            });

            //$('#Search').on('click', function () {
            //    var param = {};
            //    if (!$('#City').val()) {
            //        layer.msg("请选择城市");
            //        return;
            //    } else {
            //        param.CityID = $('#City').val();
            //    }
            //    DepartmentIndex.GetDeptTreeNoCheck($('#deptTree'), param);
            //});

            //面板监听事件
            //$('.site-demo-active').on('click', function () {
            //    var othis = $(this), type = othis.data('type');
            //    active[type] ? active[type].call(this, othis) : '';
            //});

            //管辖权限-U+门店权限-U+地理权限面板监听事件
            element.on('tab(TabType)', function (data) {
                //U+门店权限-我能看的
                if (DepartmentIndex.TabUplusDept && this.getAttribute('lay-id') == 'uplusDept') {
                    DepartmentIndex.TabUplusDept = false;
                    if (PrivComm.CheckAuthority('priv-deptauth-setdata-isee-view')) {
                        DepartmentIndex.InitUplusDeptCanSee(form);
                    } else {
                        $('#uplusDeptCanSee').html(PrivComm.NoAuthorityHTML);
                    }
                }
                    //U+地理权限-我能看的
                else if (DepartmentIndex.TabUplusArea && this.getAttribute('lay-id') == 'uplusArea') {
                    DepartmentIndex.TabUplusArea = false;
                    if (PrivComm.CheckAuthority('priv-deptauth-setarea-view')) {
                        DepartmentIndex.InitUplusAreaCanSee(form);
                    } else {
                        $('#uplusAreaCanSee').html(PrivComm.NoAuthorityHTML);
                    }
                }
                //else {
                //    var treeNode = DepartmentIndex.GetDeptTreeSelectedNodes();
                //    if (!!treeNode) {
                //        DepartmentIndex.RefreshCurrentTab(treeNode);
                //    }
                //}
            });

            //管辖权限--能看我的面板事件
            element.on('tab(TabDivisition)', function (data) {
                if (DepartmentIndex.TabDivisitionDivisitionBeSeen && this.getAttribute('lay-id') == 'divisitionBeSeen') {
                    DepartmentIndex.TabDivisitionDivisitionBeSeen = false;
                    if (PrivComm.CheckAuthority('priv-deptauth-setmgr-seei-view')) {
                        DepartmentIndex.InitDivisitionBeSeen(form);
                    } else {
                        $('#divisitionBeSeen').html(PrivComm.NoAuthorityHTML);
                    }
                }
                //else {
                //    var treeNode = DepartmentIndex.GetDeptTreeSelectedNodes();
                //    if (!!treeNode) {
                //        DepartmentIndex.RefreshCurrentTab(treeNode);
                //    }
                //}
            });

            //U+门店权限--能看我的面板事件
            element.on('tab(TabDept)', function (data) {
                if (DepartmentIndex.TabDeptBeSeen && this.getAttribute('lay-id') == 'uplusDeptBeSeen') {
                    DepartmentIndex.TabDeptBeSeen = false;
                    if (PrivComm.CheckAuthority('priv-deptauth-setdata-seei-view')) {
                        DepartmentIndex.InitUplusDeptBeSeen(form);
                    } else {
                        $('#uplusDeptBeSeen').html(PrivComm.NoAuthorityHTML);
                    }
                }
                //else {
                //    var treeNode = DepartmentIndex.GetDeptTreeSelectedNodes();
                //    if (!!treeNode) {
                //        DepartmentIndex.RefreshCurrentTab(treeNode);
                //    }
                //}
            });

            //U+地理权限--能看我的面板事件
            //element.on('tab(TabArea)', function (data) {
            //    if (DepartmentIndex.TabAreaBeSeen && this.getAttribute('lay-id') == 'uplusAreaBeSeen') {
            //        DepartmentIndex.TabAreaBeSeen = false;
            //        DepartmentIndex.InitUplusAreaBeSeen(form);
            //    }
            //});

            ControlComm.CityBinding($('#City'), form, CacheHelper.GetUser().CityID, cityChange);

            if (PrivComm.CheckAuthority('priv-deptauth-setmgr-isee-view')) {
                DepartmentIndex.InitDivisitionCanSee(form);
            } else {
                $('#divisitionCanSee').html(PrivComm.NoAuthorityHTML);
            }

            form.render();
        });
    },
    //门店管辖我能看的事件监听
    InitDivisitionCanSee: function (form) {
        if (PrivComm.CheckAuthority('priv-deptauth-setmgr-isee-set')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CheckedAllDivisitionCanSee" class="layui-btn layui-btn-sm">全部选择</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="UnCheckedAllDivisitionCanSee" class="layui-btn layui-btn-sm">全部取消</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="SaveDivisitionCanSee" class="layui-btn layui-btn-sm">保存</a>';
            strHTML += '</div>';

            $('#btnDivisitionCanSee').append(strHTML);
        }
        if (PrivComm.CheckAuthority('priv-deptauth-setmgr-isee-copy')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CopyDivisitionCanSee" class="layui-btn layui-btn-sm">复制权限到员工</a>';
            strHTML += '</div>';

            $('#btnDivisitionCanSee').append(strHTML);
        }

        var cityDivisitionCanSeeChange = function () {
            ControlComm.DepartmentBinding($('#DepartmentDivisitionCanSee'), form, $('#CityDivisitionCanSee').val());
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!!dept && dept.DepartOnlyCode > 0) {
                PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDivisitionCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': ['dep-divisition-sel'], 'ViewType': 1 }, true, function (result) {
                    DepartmentIndex.DivisitionCanSeeSelectedNodes = [];
                    if (!!result) {
                        layui.each(result.Data, function () {
                            DepartmentIndex.DivisitionCanSeeSelectedNodes.push(this.DataCode);
                        });
                    }
                    ControlComm.GetDeptTree($('#TreeDivisitionCanSee'), $('#CityDivisitionCanSee').val(), DepartmentIndex.DivisitionCanSeeSelectedNodes);
                });
            } else {
                ControlComm.GetDeptTree($('#TreeDivisitionCanSee'), $('#CityDivisitionCanSee').val());
            }
        };
        form.on('select(CityDivisitionCanSee)', cityDivisitionCanSeeChange);
        form.on('select(DepartmentDivisitionCanSee)', function () {
            DepartmentIndex.RefreshSelectedNodes("TreeDivisitionCanSee", DepartmentIndex.DivisitionCanSeeSelectedNodes);
            var listSorted = $('#DepartmentDivisitionCanSee').val() == '' ? null : DepartmentIndex.GetTreeListSorted($('#DepartmentDivisitionCanSee').find('option:selected').eq(0), CacheHelper.GetDepartment($('#CityDivisitionCanSee').val()));
            ControlComm.GetDeptTree($('#TreeDivisitionCanSee'), $('#CityDivisitionCanSee').val(), DepartmentIndex.DivisitionCanSeeSelectedNodes, listSorted);
        });
        $('#SaveDivisitionCanSee').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }
            DepartmentIndex.RefreshSelectedNodes("TreeDivisitionCanSee", DepartmentIndex.DivisitionCanSeeSelectedNodes);
            var param = {};
            param.DepartOnlyCode = dept.DepartOnlyCode;
            param.CityID = $('#CityDivisitionCanSee').val();
            param.DepDivisitionSel = DepartmentIndex.DivisitionCanSeeSelectedNodes;
            param.TypeCodeList = ['dep-divisition-sel'];
            param.ViewType = 1;
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        //复制管辖权限到员工
        $('#CopyDivisitionCanSee').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }
            DepartmentIndex.DepartOnlyCodeSelected = dept.DepartOnlyCode;
            DepartmentIndex.DeptCitySelected = $('#City').val();
            layer.open({
                type: 2,
                title: '',
                area: ['785px', '535px'], //宽高				
                content: 'department/department_edit.html',
                scrollbar: false, //禁用滚动条
                btnAlign: 'd',
            });
        });
        $('#CheckedAllDivisitionCanSee').on('click', function () {
            DepartmentIndex.CheckAllNodes("TreeDivisitionCanSee", true);
        });
        $('#UnCheckedAllDivisitionCanSee').on('click', function () {
            DepartmentIndex.CheckAllNodes("TreeDivisitionCanSee", false);
        });

        ControlComm.CityBinding($('#CityDivisitionCanSee'), form, CacheHelper.GetUser().CityID, cityDivisitionCanSeeChange);

    },
    //门店管辖能看我的事件监听
    InitDivisitionBeSeen: function (form) {
        if (PrivComm.CheckAuthority('priv-deptauth-setmgr-seei-set')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CheckedAllDivisitionBeSeen" class="layui-btn layui-btn-sm">全部选择</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="UnCheckedAllDivisitionBeSeen" class="layui-btn layui-btn-sm">全部取消</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="SaveDivisitionBeSeen" class="layui-btn layui-btn-sm">保存</a>';
            strHTML += '</div>';

            $('#btnDivisitionBeSeen').append(strHTML);
        }

        var cityDivisitionBeSeenChange = function () {
            ControlComm.DepartmentBinding($('#DepartmentDivisitionBeSeen'), form, $('#CityDivisitionBeSeen').val());
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!!dept && dept.DepartOnlyCode > 0) {
                PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDivisitionBeSeen').val(), 'DataCode': dept.DepartOnlyCode, 'TypeCodeList': ['dep-divisition-sel'], 'ViewType': 2 }, true, function (result) {
                    DepartmentIndex.DivisitionBeSeenSelectedNodes = [];
                    if (!!result) {
                        layui.each(result.Data, function () {
                            DepartmentIndex.DivisitionBeSeenSelectedNodes.push(this.DepartOnlyCode);
                        });
                    }
                    ControlComm.GetDeptTree($('#TreeDivisitionBeSeen'), $('#CityDivisitionBeSeen').val(), DepartmentIndex.DivisitionBeSeenSelectedNodes, null, DepartmentIndex.ChkboxType);
                });
            } else {
                ControlComm.GetDeptTree($('#TreeDivisitionBeSeen'), $('#CityDivisitionBeSeen').val(), null, null, DepartmentIndex.ChkboxType);
            }
        };

        form.on('select(CityDivisitionBeSeen)', cityDivisitionBeSeenChange);
        form.on('select(DepartmentDivisitionBeSeen)', function () {
            DepartmentIndex.RefreshSelectedNodes("TreeDivisitionBeSeen", DepartmentIndex.DivisitionBeSeenSelectedNodes);
            var listSorted = $('#DepartmentDivisitionBeSeen').val() == '' ? null : DepartmentIndex.GetTreeListSorted($('#DepartmentDivisitionBeSeen').find('option:selected').eq(0), CacheHelper.GetDepartment($('#CityDivisitionBeSeen').val()));
            ControlComm.GetDeptTree($('#TreeDivisitionBeSeen'), $('#CityDivisitionBeSeen').val(), DepartmentIndex.DivisitionBeSeenSelectedNodes, listSorted, DepartmentIndex.ChkboxType);
        });
        $('#SaveDivisitionBeSeen').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }
            DepartmentIndex.RefreshSelectedNodes("TreeDivisitionBeSeen", DepartmentIndex.DivisitionBeSeenSelectedNodes);
            var param = {};
            param.DataCode = dept.DepartOnlyCode;
            param.CityID = $('#CityDivisitionBeSeen').val();
            param.DepDivisitionSel = DepartmentIndex.DivisitionBeSeenSelectedNodes;
            param.ViewType = 2;
            param.TypeCodeList = ['dep-divisition-sel'];
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        $('#CheckedAllDivisitionBeSeen').on('click', function () {
            DepartmentIndex.CheckAllNodes("TreeDivisitionBeSeen", true);
        });
        $('#UnCheckedAllDivisitionBeSeen').on('click', function () {
            DepartmentIndex.CheckAllNodes("TreeDivisitionBeSeen", false);
        });

        ControlComm.CityBinding($('#CityDivisitionBeSeen'), form, CacheHelper.GetUser().CityID, cityDivisitionBeSeenChange);

    },
    //U+门店权限设置我能看的
    InitUplusDeptCanSee: function (form) {
        if (PrivComm.CheckAuthority('priv-deptauth-setdata-isee-set')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CheckedAllTypeCode" class="layui-btn layui-btn-sm">全部选择</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="UnCheckedAllTypeCode" class="layui-btn layui-btn-sm">全部取消</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="SaveTypeCode" class="layui-btn layui-btn-sm">保存</a>';
            strHTML += '</div>';

            $('#btnUplusDeptCanSee').append(strHTML);
            $('#capUplusDeptCanSee').append('<a href="javascript:;" id="SaveTreeTable" class="layui-btn layui-btn-primary layui-btn-sm btn-style">保存</a>');
        }
        if (PrivComm.CheckAuthority('priv-deptauth-setdata-isee-copy')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CopyTypeCode" class="layui-btn layui-btn-sm">复制权限到门店</a>';
            strHTML += '</div>';

            $('#btnUplusDeptCanSee').append(strHTML);
        }

        $('input:radio[name=TypeCode][value="all"]').prop("checked", true);
        var cityDeptCanSeeChange = function () {
            ControlComm.DepartmentBinding($('#DepartmentDeptCanSee'), form, $('#CityDeptCanSee').val());

            var cityid = $('#CityDeptCanSee').val();
            if (!!CacheHelper.GetDepartment(cityid)) {
                DepartmentIndex.CacheDepartment = CacheHelper.GetDepartment(cityid);
            } else {
                PublicComm.Ajax("POST", '/Authority/Department/GetDepartmentListByCity', { CityID: cityid }, true, function (result) {
                    CacheHelper.SetDepartment(cityid, result.Data);
                    DepartmentIndex.CacheDepartment = CacheHelper.GetDepartment(cityid);
                });
            }
            layui.each(DepartmentIndex.CacheDepartment, function (index, item) {
                item.FySelTreeClass = 'checkbox_false_full';
                item.CustSelTreeClass = 'checkbox_false_full';
                item.PublicOwnerTreeClass = 'checkbox_false_full';
                item.PrivateOwnerTreeClass = 'checkbox_false_full';
                item.CommonOwnerTreeClass = 'checkbox_false_full';
                item.FyFellowTreeClass = 'checkbox_false_full';
                item.CustFellowTreeClass = 'checkbox_false_full';
            });

            $("#treeTable tbody").html();
            var typeCode = $('input:radio[name=TypeCode]:checked').val();
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            //选择城市不加载treetable，只获取数据
            if (!!dept && dept.DepartOnlyCode > 0) {
                PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': ['dep-fy-sel', 'dep-cust-sel', 'dep-public-owner', 'dep-private-owner', 'dep-common-owner', 'dep-fy-fellow', 'dep-cust-fellow'], 'ViewType': 1 }, true, function (result) {
                    var data = [];
                    if (!!result) {
                        data = result.Data;
                    }
                    DepartmentIndex.BatchRefreshUplusCanSeeSelectedNodes(data);

                    //DepartmentIndex.GetTreeTable($('#CityDeptCanSee').val(), DepartmentIndex.UplusCanSeeSelectedNodes);

                    if (typeCode != 'all') {
                        ControlComm.GetDeptTree($('#deptDataTree'), $('#CityDeptCanSee').val(), DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(typeCode));
                    } else {
                        ControlComm.GetDeptTree($('#deptDataTree'), $('#CityDeptCanSee').val());
                    }
                });
            } else {
                //DepartmentIndex.GetTreeTable($('#CityDeptCanSee').val());
                ControlComm.GetDeptTree($('#deptDataTree'), $('#CityDeptCanSee').val());
            }

            //if (!!dept && dept.DepartOnlyCode > 0 && typeCode != 'all') {
            //    PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 1 }, true, function (result) {
            //        var data = [];
            //        if (!!result) {
            //            data = result.Data;
            //        }
            //        DepartmentIndex.RefreshUplusCanSeeSelectedNodes(typeCode, data);
            //        ControlComm.GetDeptTree($('#deptDataTree'), $('#CityDeptCanSee').val(), DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(typeCode));
            //    });
            //} else {
            //    ControlComm.GetDeptTree($('#deptDataTree'), $('#CityDeptCanSee').val());
            //}
        };

        var departmentDeptCanSeeChange = function () {
            var listSorted = $('#DepartmentDeptCanSee').val() == '' ? null : DepartmentIndex.GetTreeListSorted($('#DepartmentDeptCanSee').find('option:selected').eq(0), DepartmentIndex.CacheDepartment);
            var typeCode = $('input:radio[name=TypeCode]:checked').val();

            DepartmentIndex.RefreshTreeTableSelectedNodes(DepartmentIndex.UplusCanSeeSelectedNodes);

            var arrDept = DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshSelectedNodes("deptDataTree", arrDept);

            //选择全部时，加载treetable并绑值，加载tree不绑值；选择其他时加载treetable不绑值，加载tree并绑值
            if (typeCode == 'all') {
                DepartmentIndex.GetTreeTable($('#CityDeptCanSee').val(), DepartmentIndex.UplusCanSeeSelectedNodes, listSorted);
                ControlComm.GetDeptTree($('#deptDataTree'), $('#CityDeptCanSee').val(), null, listSorted);
            } else {
                DepartmentIndex.GetTreeTable($('#CityDeptCanSee').val(), null, listSorted);
                ControlComm.GetDeptTree($('#deptDataTree'), $('#CityDeptCanSee').val(), arrDept, listSorted);
            }
        };

        form.on('select(CityDeptCanSee)', cityDeptCanSeeChange);
        form.on('select(DepartmentDeptCanSee)', departmentDeptCanSeeChange);
        $('#SaveTreeTable').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }

            if ($("#treeTable tbody").children().length == 0) {
                layer.alert("U+门店权限表格无数据");
                return;
            }

            DepartmentIndex.RefreshTreeTableSelectedNodes(DepartmentIndex.UplusCanSeeSelectedNodes);
            var param = {};
            param.DepartOnlyCode = dept.DepartOnlyCode;
            param.CityID = $('#CityDeptCanSee').val();
            param.DepFySel = DepartmentIndex.UplusCanSeeSelectedNodes.FySel;
            param.DepCustSel = DepartmentIndex.UplusCanSeeSelectedNodes.CustSel;
            param.DepPublicOwner = DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner;
            param.DepPrivateOwner = DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner;
            param.DepCommonOwner = DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner;
            param.DepFyFellow = DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow;
            param.DepCustFellow = DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow;
            param.TypeCodeList = ['dep-fy-sel', 'dep-cust-sel', 'dep-public-owner', 'dep-private-owner', 'dep-common-owner', 'dep-fy-fellow', 'dep-cust-fellow'];
            param.ViewType = 1;
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        $('#SaveTypeCode').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }

            var typeCode = $('input:radio[name=TypeCode]:checked').val();
            var paramName = DepartmentIndex.GetUplusParamNameByTypeCode(typeCode);
            var arrDept = DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshSelectedNodes("deptDataTree", arrDept);
            var param = {};
            param.DepartOnlyCode = dept.DepartOnlyCode;
            param.CityID = $('#CityDeptCanSee').val();
            param[paramName] = arrDept;
            param.TypeCodeList = [typeCode];
            param.ViewType = 1;
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        // U+门店权限 我能看的 复制权限到门店
        $('#CopyTypeCode').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }
            DepartmentIndex.DepartOnlyCodeSelected = dept.DepartOnlyCode;
            var treeObj = $.fn.zTree.getZTreeObj("deptDataTree");
            if (!!treeObj) {
                var CityID = $('#CityDeptCanSee').val();
                var DeptID = $("#DepartmentDeptCanSee").val();
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.open({
                        type: 2,
                        title: '',
                        area: ['975px', '700px'], //宽高
                        content: 'department/department_copyprivtodep.html#' + CityID + '',
                        scrollbar: false, //禁用滚动条
                        btnAlign: 'd'
                    });
                });
            };
        });
        $('#CheckedAllTypeCode').on('click', function () {
            DepartmentIndex.CheckAllNodes("deptDataTree", true);
        });
        $('#UnCheckedAllTypeCode').on('click', function () {
            DepartmentIndex.CheckAllNodes("deptDataTree", false);
        });

        $('#oneType').hide();
        //U+门店权限我能看的radio事件
        form.on('radio(TypeCode)', function () {
            //保存切换radio前已经操作的数据
            if (DepartmentIndex.CurrentTypeCode == 'all') {
                DepartmentIndex.RefreshTreeTableSelectedNodes(DepartmentIndex.UplusCanSeeSelectedNodes);
            } else {
                var arrDeptOld = DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(DepartmentIndex.CurrentTypeCode);
                DepartmentIndex.RefreshSelectedNodes("deptDataTree", arrDeptOld);
            }

            var typeCode = $('input:radio[name=TypeCode]:checked').val();
            DepartmentIndex.TypeCodeSelected = typeCode;
            if (typeCode == 'all') {
                $('#allType').show();
                $('#oneType').hide();

                var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
                if (!!dept && dept.DepartOnlyCode > 0) {
                    //if ($("#treeTable tbody").children().length > 0) {
                    //PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': ['dep-fy-sel', 'dep-cust-sel', 'dep-public-owner', 'dep-private-owner', 'dep-common-owner', 'dep-fy-fellow', 'dep-cust-fellow'], 'ViewType': 1 }, true, function (result) {
                    //    var data = [];
                    //    if (!!result) {
                    //        data = result.Data;
                    //    }
                    //    DepartmentIndex.BatchRefreshUplusCanSeeSelectedNodes(data);
                    //    DepartmentIndex.SetTreeTableStatus(DepartmentIndex.UplusCanSeeSelectedNodes);
                    //});
                    var listSorted = $('#DepartmentDeptCanSee').val() == '' ? null : DepartmentIndex.GetTreeListSorted($('#DepartmentDeptCanSee').find('option:selected').eq(0), DepartmentIndex.CacheDepartment);
                    DepartmentIndex.GetTreeTable($('#CityDeptCanSee').val(), DepartmentIndex.UplusCanSeeSelectedNodes, listSorted);
                    //DepartmentIndex.SetTreeTableStatus(DepartmentIndex.UplusCanSeeSelectedNodes);
                    //}
                }
            } else {
                $('#allType').hide();
                $('#oneType').show();

                var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
                if (!!dept && dept.DepartOnlyCode > 0) {
                    DepartmentIndex.RefreshTabUplusDeptCanSeeTree(dept, typeCode);
                    //var deptDataTree = $.fn.zTree.getZTreeObj("deptDataTree");
                    //if (!!deptDataTree) {
                    //    PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 1 }, true, function (result) {
                    //        deptDataTree.checkAllNodes(false);
                    //        var data = [];
                    //        if (!!result) {
                    //            for (var i = 0; i < result.Data.length; i++) {
                    //                var node = deptDataTree.getNodeByParam("DepartOnlyCode", result.Data[i].DataCode);
                    //                if (node != null) {
                    //                    deptDataTree.checkNode(node, true);
                    //                }
                    //            };
                    //            data = result.Data;
                    //        }
                    //        DepartmentIndex.RefreshUplusCanSeeSelectedNodes(typeCode, data);
                    //    });
                    //}
                }
            }
            DepartmentIndex.CurrentTypeCode = typeCode;
        });

        $("#treeTable thead tr :not(:first-child)").dblclick(function () {
            var typecode = $(this).attr('data-type');
            var arrObj = $('span.checkbox_false_full[TypeCode="' + typecode + '"],span.checkbox_false_part[TypeCode="' + typecode + '"]');
            if (arrObj.length > 0) {
                $('span[TypeCode="' + typecode + '"]').removeClass().addClass('button chk checkbox_true_full');
            } else {
                $('span[TypeCode="' + typecode + '"]').removeClass().addClass('button chk checkbox_false_full');
            }
        });

        ControlComm.CityBinding($('#CityDeptCanSee'), form, CacheHelper.GetUser().CityID, cityDeptCanSeeChange);

    },
    //U+门店权限能看我的
    InitUplusDeptBeSeen: function (form) {
        if (PrivComm.CheckAuthority('priv-deptauth-setdata-seei-set')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CheckedAllTypeCodeBeSeen" class="layui-btn layui-btn-sm">全部选择</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="UnCheckedAllTypeCodeBeSeen" class="layui-btn layui-btn-sm">全部取消</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="SaveTypeCodeBeSeen" class="layui-btn layui-btn-sm">保存</a>';
            strHTML += '</div>';

            $('#btnUplusDeptBeSeen').append(strHTML);
        }

        $('input:radio[name=TypeCodeBeSeen][value="dep-fy-sel"]').prop("checked", true);
        var cityDeptBeSeenChange = function () {
            ControlComm.DepartmentBinding($('#DepartmentDeptBeSeen'), form, $('#CityDeptBeSeen').val());

            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!!dept && dept.DepartOnlyCode > 0) {
                var typeCode = $('input:radio[name=TypeCodeBeSeen]:checked').val();
                PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptBeSeen').val(), 'DataCode': dept.DepartOnlyCode, 'TypeCodeList': ['dep-fy-sel', 'dep-cust-sel', 'dep-public-owner', 'dep-private-owner', 'dep-common-owner', 'dep-fy-fellow', 'dep-cust-fellow'], 'ViewType': 2 }, true, function (result) {
                    var data = [];
                    if (!!result) {
                        data = result.Data;
                    }
                    DepartmentIndex.BatchRefreshUplusBeSeenSelectedNodes(data);
                    ControlComm.GetDeptTree($('#deptDataTreeBeSeen'), $('#CityDeptBeSeen').val(), DepartmentIndex.GetUplusBeSeenSelectedNodesByTypeCode(typeCode), null, DepartmentIndex.ChkboxType);
                });
            } else {
                ControlComm.GetDeptTree($('#deptDataTreeBeSeen'), $('#CityDeptBeSeen').val(), null, null, DepartmentIndex.ChkboxType);
            }
        };

        form.on('select(CityDeptBeSeen)', cityDeptBeSeenChange);
        form.on('select(DepartmentDeptBeSeen)', function () {
            var listSorted = $('#DepartmentDeptBeSeen').val() == '' ? null : DepartmentIndex.GetTreeListSorted($('#DepartmentDeptBeSeen').find('option:selected').eq(0), CacheHelper.GetDepartment($('#CityDeptBeSeen').val()));

            var typeCode = $('input:radio[name=TypeCodeBeSeen]:checked').val();
            var arrDept = DepartmentIndex.GetUplusBeSeenSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshSelectedNodes("deptDataTreeBeSeen", arrDept);
            ControlComm.GetDeptTree($('#deptDataTreeBeSeen'), $('#CityDeptBeSeen').val(), arrDept, listSorted, DepartmentIndex.ChkboxType);
        });
        $('#SaveTypeCodeBeSeen').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }

            var typeCode = $('input:radio[name=TypeCodeBeSeen]:checked').val();
            var paramName = DepartmentIndex.GetUplusParamNameByTypeCode(typeCode);
            var arrDept = DepartmentIndex.GetUplusBeSeenSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshSelectedNodes("deptDataTreeBeSeen", arrDept);
            var param = {};
            param.DataCode = dept.DepartOnlyCode;
            param.CityID = $('#CityDeptBeSeen').val();
            param[paramName] = arrDept;
            param.TypeCodeList = [typeCode];
            param.ViewType = 2;
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        $('#CheckedAllTypeCodeBeSeen').on('click', function () {
            DepartmentIndex.CheckAllNodes("deptDataTreeBeSeen", true);
        });
        $('#UnCheckedAllTypeCodeBeSeen').on('click', function () {
            DepartmentIndex.CheckAllNodes("deptDataTreeBeSeen", false);
        });

        //U+门店权限能看我的radio事件
        form.on('radio(TypeCodeBeSeen)', function () {
            //保存切换radio前已经操作的数据
            var arrDeptOld = DepartmentIndex.GetUplusBeSeenSelectedNodesByTypeCode(DepartmentIndex.CurrentTypeCodeBeSeen);
            DepartmentIndex.RefreshSelectedNodes("deptDataTreeBeSeen", arrDeptOld);

            var typeCode = $('input:radio[name=TypeCodeBeSeen]:checked').val();
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!!dept && dept.DepartOnlyCode > 0) {
                var deptDataTreeBeSeen = $.fn.zTree.getZTreeObj("deptDataTreeBeSeen");
                if (!!deptDataTreeBeSeen) {
                    //PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptBeSeen').val(), 'DataCode': dept.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 2 }, true, function (result) {
                    //    deptDataTreeBeSeen.checkAllNodes(false);
                    //    var data = [];
                    //    if (!!result) {
                    //        for (var i = 0; i < result.Data.length; i++) {
                    //            var node = deptDataTreeBeSeen.getNodeByParam("DepartOnlyCode", result.Data[i].DepartOnlyCode);
                    //            if (node != null) {
                    //                deptDataTreeBeSeen.checkNode(node, true);
                    //            }
                    //        };
                    //        data = result.Data;
                    //    }
                    //    DepartmentIndex.RefreshUplusBeSeenSelectedNodes(typeCode, data);
                    //});

                    deptDataTreeBeSeen.checkAllNodes(false);
                    var arrDept = DepartmentIndex.GetUplusBeSeenSelectedNodesByTypeCode(typeCode);
                    for (var i = 0, j = arrDept.length; i < j; i++) {
                        var node = deptDataTreeBeSeen.getNodeByParam("DepartOnlyCode", arrDept[i]);
                        if (node != null) {
                            deptDataTreeBeSeen.checkNode(node, true);
                        }
                    };
                }
            }
            DepartmentIndex.CurrentTypeCodeBeSeen = typeCode;
        });

        ControlComm.CityBinding($('#CityDeptBeSeen'), form, CacheHelper.GetUser().CityID, cityDeptBeSeenChange);

    },
    //U+片区权限我能看的
    InitUplusAreaCanSee: function (form) {
        if (PrivComm.CheckAuthority('priv-deptauth-setarea-set')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CheckedAllTypeCodeArea" class="layui-btn layui-btn-sm">全部选择</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="UnCheckedAllTypeCodeArea" class="layui-btn layui-btn-sm">全部取消</a>';
            strHTML += '</div>';
            strHTML += '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="SaveTypeCodeArea" class="layui-btn layui-btn-sm">保存</a>';
            strHTML += '</div>';

            $('#btnUplusAreaCanSee').append(strHTML);
            $('#capUplusAreaCanSee').append('<a href="javascript:;" id="SaveTreeTableArea" class="layui-btn layui-btn-primary layui-btn-sm btn-style">保存</a>');
        }
        if (PrivComm.CheckAuthority('priv-deptauth-setarea-copy')) {
            var strHTML = '<div class="layui-form-item">';
            strHTML += '<a href="javascript:;" id="CopyTypeCodeArea" class="layui-btn layui-btn-sm">复制权限到门店</a>';
            strHTML += '</div>';

            $('#btnUplusAreaCanSee').append(strHTML);
        }

        $('input:radio[name=TypeCodeArea][value="all-area"]').prop("checked", true);
        var cityAreaCanSeeChange = function () {
            ControlComm.AreaBinding($('#DepartmentAreaCanSee'), form, $('#CityAreaCanSee').val());

            var cityid = $('#CityAreaCanSee').val();
            if (!!CacheHelper.GetArea(cityid)) {
                DepartmentIndex.CacheArea = CacheHelper.GetArea(cityid);
            } else {
                PublicComm.Ajax("POST", '/Authority/Area/GetTreeAreaDistrictByCity', { CityID: cityid }, true, function (result) {
                    CacheHelper.SetArea(cityid, result.Data);
                    DepartmentIndex.CacheArea = CacheHelper.GetArea(cityid);
                });
            }
            layui.each(DepartmentIndex.CacheArea, function (index, item) {
                item.FySelTreeClass = 'checkbox_false_full';
                item.FyModifyTreeClass = 'checkbox_false_full';
                item.CustSelTreeClass = 'checkbox_false_full';
                item.FyInfoTreeClass = 'checkbox_false_full';
            });

            $("#treeTableArea tbody").html();
            var typeCode = $('input:radio[name=TypeCodeArea]:checked').val();
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            //选择城市不加载treetable，只获取数据
            if (!!dept && dept.DepartOnlyCode > 0) {
                PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityAreaCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': ['area-fy-sel', 'area-fy-modify', 'area-cust-sel', 'area-fy-info'], 'ViewType': 1 }, true, function (result) {
                    var data = [];
                    if (!!result) {
                        data = result.Data;
                    }
                    DepartmentIndex.BatchRefreshUplusAreaCanSeeSelectedNodes(data);

                    //DepartmentIndex.GetTreeTableArea($('#CityAreaCanSee').val(), DepartmentIndex.UplusAreaCanSeeSelectedNodes);

                    if (typeCode != 'all-area') {
                        ControlComm.GetAreaTree($('#areaDataTree'), $('#CityAreaCanSee').val(), DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(typeCode));
                    } else {
                        ControlComm.GetAreaTree($('#areaDataTree'), $('#CityAreaCanSee').val());
                    }
                });
            }
            else {
                //DepartmentIndex.GetTreeTableArea($('#CityAreaCanSee').val());
                ControlComm.GetAreaTree($('#areaDataTree'), $('#CityAreaCanSee').val());
            }

            //if (!!dept && dept.DepartOnlyCode > 0 && typeCode != 'all-area') {
            //    PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 1 }, true, function (result) {
            //        var data = [];
            //        if (!!result) {
            //            data = result.Data;
            //        }
            //        DepartmentIndex.RefreshUplusAreaCanSeeSelectedNodes(typeCode, data);
            //        ControlComm.GetAreaTree($('#areaDataTree'), $('#CityAreaCanSee').val(), DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(typeCode));
            //    });
            //} else {
            //    ControlComm.GetAreaTree($('#areaDataTree'), $('#CityAreaCanSee').val());
            //}
        };

        var departmentAreaCanSeeChange = function () {
            var listSorted = $('#DepartmentAreaCanSee').val() == '' ? null : DepartmentIndex.GetAreaTreeListSorted($('#DepartmentAreaCanSee').find('option:selected').eq(0), DepartmentIndex.CacheArea);
            var typeCode = $('input:radio[name=TypeCodeArea]:checked').val();

            DepartmentIndex.RefreshTreeTableAreaSelectedNodes(DepartmentIndex.UplusAreaCanSeeSelectedNodes);

            var arrArea = DepartmentIndex.GetUplusAreaCanSeeSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshAreaSelectedNodes("areaDataTree", arrArea);

            //选择全部时，加载treetable并绑值，加载tree不绑值；选择其他时加载treetable不绑值，加载tree并绑值
            if (typeCode == 'all-area') {
                DepartmentIndex.GetTreeTableArea($('#CityAreaCanSee').val(), DepartmentIndex.UplusAreaCanSeeSelectedNodes, listSorted);
                ControlComm.GetAreaTree($('#areaDataTree'), $('#CityAreaCanSee').val(), null, listSorted);
            } else {
                DepartmentIndex.GetTreeTableArea($('#CityAreaCanSee').val(), null, listSorted);
                ControlComm.GetAreaTree($('#areaDataTree'), $('#CityAreaCanSee').val(), arrArea, listSorted);
            }
        };

        form.on('select(CityAreaCanSee)', cityAreaCanSeeChange);
        form.on('select(DepartmentAreaCanSee)', departmentAreaCanSeeChange);
        $('#SaveTreeTableArea').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }

            if ($("#treeTableArea tbody").children().length == 0) {
                layer.alert("U+地理权限表格无数据");
                return;
            }

            DepartmentIndex.RefreshTreeTableAreaSelectedNodes(DepartmentIndex.UplusAreaCanSeeSelectedNodes);
            var param = {};
            param.DepartOnlyCode = dept.DepartOnlyCode;
            param.CityID = $('#CityAreaCanSee').val();
            param.AreaFySel = DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel;
            param.AreaFyModify = DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify;
            param.AreaCustSel = DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel;
            param.AreaFyInfo = DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo;
            param.TypeCodeList = ['area-fy-sel', 'area-fy-modify', 'area-cust-sel', 'area-fy-info'];
            param.ViewType = 1;
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        $('#SaveTypeCodeArea').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }

            var typeCode = $('input:radio[name=TypeCodeArea]:checked').val();
            var paramName = DepartmentIndex.GetUplusAreaParamNameByTypeCode(typeCode);
            var arrArea = DepartmentIndex.GetUplusAreaCanSeeSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshAreaSelectedNodes("areaDataTree", arrArea);
            var param = {};
            param.DepartOnlyCode = dept.DepartOnlyCode;
            param.CityID = $('#CityAreaCanSee').val();
            param[paramName] = arrArea;
            param.TypeCodeList = [typeCode];
            param.ViewType = 1;
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        $('#CheckedAllTypeCodeArea').on('click', function () {
            DepartmentIndex.CheckAllNodes("areaDataTree", true);
        });
        $('#UnCheckedAllTypeCodeArea').on('click', function () {
            DepartmentIndex.CheckAllNodes("areaDataTree", false);
        });

        $('#oneTypeArea').hide();
        //U+片区权限我能看的radio事件
        form.on('radio(TypeCodeArea)', function () {
            //保存切换radio前已经操作的数据
            if (DepartmentIndex.CurrentTypeCodeArea == 'all-area') {
                DepartmentIndex.RefreshTreeTableAreaSelectedNodes(DepartmentIndex.UplusAreaCanSeeSelectedNodes);
            } else {
                var arrAreaOld = DepartmentIndex.GetUplusAreaCanSeeSelectedNodesByTypeCode(DepartmentIndex.CurrentTypeCodeArea);
                DepartmentIndex.RefreshAreaSelectedNodes("areaDataTree", arrAreaOld);
            }

            var typeCode = $('input:radio[name=TypeCodeArea]:checked').val();
            DepartmentIndex.AreaTypeCodeSelected = typeCode;
            if (typeCode == 'all-area') {
                $('#allTypeArea').show();
                $('#oneTypeArea').hide();

                var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
                if (!!dept && dept.DepartOnlyCode > 0) {
                    //if ($("#treeTableArea tbody").children().length > 0) {
                    //PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityAreaCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': ['area-fy-sel', 'area-fy-modify', 'area-cust-sel', 'area-fy-info'], 'ViewType': 1 }, true, function (result) {
                    //    var data = [];
                    //    if (!!result) {
                    //        data = result.Data;
                    //    }
                    //    DepartmentIndex.BatchRefreshUplusAreaCanSeeSelectedNodes(data);
                    //    DepartmentIndex.SetTreeTableAreaStatus(DepartmentIndex.UplusAreaCanSeeSelectedNodes);
                    //});
                    var listSorted = $('#DepartmentAreaCanSee').val() == '' ? null : DepartmentIndex.GetAreaTreeListSorted($('#DepartmentAreaCanSee').find('option:selected').eq(0), DepartmentIndex.CacheArea);
                    DepartmentIndex.GetTreeTableArea($('#CityAreaCanSee').val(), DepartmentIndex.UplusAreaCanSeeSelectedNodes, listSorted);
                    //DepartmentIndex.SetTreeTableAreaStatus(DepartmentIndex.UplusAreaCanSeeSelectedNodes);

                    //}
                }
            } else {
                $('#allTypeArea').hide();
                $('#oneTypeArea').show();
                var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
                if (!!dept && dept.DepartOnlyCode > 0) {
                    DepartmentIndex.RefreshTabUplusAreaCanSeeCanSeeTree(dept, typeCode);
                    //var areaDataTree = $.fn.zTree.getZTreeObj("areaDataTree");
                    //if (!!areaDataTree) {
                    //    PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityAreaCanSee').val(), 'DepartOnlyCode': dept.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 1 }, true, function (result) {
                    //        areaDataTree.checkAllNodes(false);
                    //        var data = [];
                    //        if (!!result) {
                    //            for (var i = 0; i < result.Data.length; i++) {
                    //                var node = areaDataTree.getNodeByParam("DataCode", result.Data[i].DataCode);
                    //                if (node != null) {
                    //                    areaDataTree.checkNode(node, true);
                    //                }
                    //            };
                    //            data = result.Data;
                    //        }
                    //        DepartmentIndex.RefreshUplusAreaCanSeeSelectedNodes(typeCode, data);
                    //    });
                    //}
                }
            }
            DepartmentIndex.CurrentTypeCodeArea = typeCode;
        });

        $("#treeTableArea thead tr :not(:first-child)").dblclick(function () {
            var typecode = $(this).attr('data-type');
            var arrObj = $('span.checkbox_false_full[TypeCodeArea="' + typecode + '"],span.checkbox_false_part[TypeCodeArea="' + typecode + '"]');
            if (arrObj.length > 0) {
                $('span[TypeCodeArea="' + typecode + '"]').removeClass().addClass('button chk checkbox_true_full');
            } else {
                $('span[TypeCodeArea="' + typecode + '"]').removeClass().addClass('button chk checkbox_false_full');
            }
        });

        ControlComm.CityBinding($('#CityAreaCanSee'), form, CacheHelper.GetUser().CityID, cityAreaCanSeeChange);
        DepartmentIndex.InitUplusDistrict(form);
    },
    //U+片区权限能看我的
    InitUplusAreaBeSeen: function (form) {
        $('input:radio[name=TypeCodeAreaBeSeen][value="area-fy-sel"]').prop("checked", true);
        var cityAreaBeSeenChange = function () {
            ControlComm.AreaBinding($('#DepartmentAreaBeSeen'), form, $('#CityAreaBeSeen').val());
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!!dept && dept.DepartOnlyCode > 0) {
                var typeCode = $('input:radio[name=TypeCodeAreaBeSeen]:checked').val();
                PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptBeSeen').val(), 'DataCode': dept.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 2 }, true, function (result) {
                    var data = [];
                    if (!!result) {
                        data = result.Data;
                    }
                    DepartmentIndex.RefreshUplusAreaBeSeenSelectedNodes(typeCode, data);
                    ControlComm.GetAreaTree($('#areaDataTreeBeSeen'), $('#CityAreaBeSeen').val(), DepartmentIndex.GetUplusAreaBeSeenSelectedNodesByTypeCode(typeCode));
                });
            } else {
                ControlComm.GetAreaTree($('#areaDataTreeBeSeen'), $('#CityAreaBeSeen').val());
            }
        };

        form.on('select(CityAreaBeSeen)', cityAreaBeSeenChange);
        form.on('select(DepartmentAreaBeSeen)', function () {
            var listSorted = $('#DepartmentAreaBeSeen').val() == '' ? null : DepartmentIndex.GetAreaTreeListSorted($('#DepartmentAreaBeSeen').find('option:selected').eq(0), CacheHelper.GetArea($('#CityAreaBeSeen').val()));

            var typeCode = $('input:radio[name=TypeCodeAreaBeSeen]:checked').val();
            var arrArea = DepartmentIndex.GetUplusAreaBeSeenSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshAreaSelectedNodes("areaDataTreeBeSeen", arrArea);
            ControlComm.GetAreaTree($('#areaDataTreeBeSeen'), $('#CityAreaBeSeen').val(), arrArea, listSorted);
        });
        $('#SaveTypeCodeAreaBeSeen').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }

            var typeCode = $('input:radio[name=TypeCodeAreaBeSeen]:checked').val();
            var paramName = DepartmentIndex.GetUplusAreaParamNameByTypeCode(typeCode);
            var arrArea = DepartmentIndex.GetUplusAreaBeSeenSelectedNodesByTypeCode(typeCode);
            DepartmentIndex.RefreshAreaSelectedNodes("areaDataTreeBeSeen", arrArea);
            var param = {};
            param.DataCode = dept.DepartOnlyCode;
            param.CityID = $('#CityDeptBeSeen').val();
            param[paramName] = arrArea;
            param.TypeCodeList = [typeCode];
            param.ViewType = 2;
            PublicComm.Ajax("POST", "/Authority/Privilege/SavePrivDepartment", param, true, function (result) {
                if (!!result) {
                    if (result.Code == 2000) {
                        layer.alert("保存成功");
                    } else {
                        layer.alert("保存失败，原因：" + result.Message);
                    }
                }
            });
        });
        $('#CheckedAllTypeCodeAreaBeSeen').on('click', function () {
            DepartmentIndex.CheckAllNodes("areaDataTreeBeSeen", true);
        });
        $('#UnCheckedAllTypeCodeAreaBeSeen').on('click', function () {
            DepartmentIndex.CheckAllNodes("areaDataTreeBeSeen", false);
        });

        //U+片区权限能看我的radio事件
        form.on('radio(TypeCodeAreaBeSeen)', function () {
            var typeCode = $('input:radio[name=TypeCodeAreaBeSeen]:checked').val();
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!!dept && dept.DepartOnlyCode > 0) {
                var areaDataTreeBeSeen = $.fn.zTree.getZTreeObj("areaDataTreeBeSeen");
                if (!!areaDataTreeBeSeen) {
                    PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityAreaBeSeen').val(), 'DataCode': dept.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 2 }, true, function (result) {
                        areaDataTreeBeSeen.checkAllNodes(false);
                        var data = [];
                        if (!!result) {
                            for (var i = 0; i < result.Data.length; i++) {
                                var node = areaDataTreeBeSeen.getNodeByParam("ID", result.Data[i].ID);
                                if (node != null) {
                                    areaDataTreeBeSeen.checkNode(node, true);
                                }
                            };
                            data = result.Data;
                        }
                        DepartmentIndex.RefreshUplusAreaBeSeenSelectedNodes(typeCode, data);
                    });
                }
            }
        });

        ControlComm.CityBinding($('#CityAreaBeSeen'), form, CacheHelper.GetUser().cityAreaBeSeenChange);
    },
    InitUplusDistrict: function (form) {
        $('#CopyTypeCodeArea').on('click', function () {
            var dept = DepartmentIndex.GetDeptTreeSelectedNodes();
            if (!DepartmentIndex.ValidateDeptTreeSelected(dept)) {
                return;
            }
            DepartmentIndex.AreaDepartOnlyCodeSelected = dept.DepartOnlyCode;
            var treeObj = $.fn.zTree.getZTreeObj("areaDataTree");
            var CityID = $('#CityAreaCanSee').val();
            layui.use("layer", function () {
                var layer = layui.layer;
                layer.open({
                    type: 2,
                    title: '',
                    area: ['975px', '700px'], //宽高
                    content: 'department/department_copyareaprivtodep.html#' + CityID + '',
                    scrollbar: false,//禁用滚动条
                    btnAlign: 'd'
                });
            });
            //if (!!treeObj) {
            //	var CityID = $('#CityDeptCanSee').val();
            //	var DeptID = $("#DepartmentDeptCanSee").val();
            //	layui.use("layer", function () {
            //		var layer = layui.layer;
            //		layer.open({
            //			type: 2,
            //			title: '',
            //			area: ['53%', '80%'], //宽高
            //			content: 'department/department_copyareaprivtodep.html#' + CityID + '',
            //			scrollbar: false,//禁用滚动条
            //			btnAlign: 'd'
            //		});
            //	});
            //};
        });
    },
    /// <summary>
    /// 根据当前树选择节点刷新完整树选择的节点
    ///<param name="treeId">树id</param>
    ///<param name="arr">当前树选择的节点数组</param>
    /// </summary>/
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
    /// <summary>
    /// 根据当前树选择节点刷新完整树选择的节点
    ///<param name="treeId">树id</param>
    ///<param name="arr">当前树选择的节点数组</param>
    /// </summary>/
    RefreshAreaSelectedNodes: function (treeId, arr) {
        var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
        if (!!zTreeObj) {
            var unCheckedNodes = zTreeObj.getCheckedNodes(false);
            layui.each(unCheckedNodes, function () {
                if (arr.indexOf(this.DataCode) >= 0) {
                    arr.splice(arr.indexOf(this.DataCode), 1);
                }
            });
            var checkedNodes = zTreeObj.getCheckedNodes(true);
            layui.each(checkedNodes, function () {
                if (arr.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                    arr.push(this.DataCode);
                }
            });
        }
    },
    /// <summary>
    /// 根据treetable勾选数据更新缓存数据
    ///<param name="jsonDeptData">部门json数据</param>
    /// </summary>/
    RefreshTreeTableSelectedNodes: function (jsonDeptData) {
        layui.each($('span.checkbox_false_full[TypeCode="dep-fy-sel"],span.checkbox_false_part[TypeCode="dep-fy-sel"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.FySel.indexOf(departOnlyCode) >= 0) {
                jsonDeptData.FySel.splice(jsonDeptData.FySel.indexOf(departOnlyCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCode="dep-fy-sel"],span.checkbox_true_part[TypeCode="dep-fy-sel"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.FySel.indexOf(departOnlyCode) == -1) {
                jsonDeptData.FySel.push(departOnlyCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCode="dep-cust-sel"],span.checkbox_false_part[TypeCode="dep-cust-sel"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.CustSel.indexOf(departOnlyCode) >= 0) {
                jsonDeptData.CustSel.splice(jsonDeptData.CustSel.indexOf(departOnlyCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCode="dep-cust-sel"],span.checkbox_true_part[TypeCode="dep-cust-sel"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.CustSel.indexOf(departOnlyCode) == -1) {
                jsonDeptData.CustSel.push(departOnlyCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCode="dep-public-owner"],span.checkbox_false_part[TypeCode="dep-public-owner"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.PublicOwner.indexOf(departOnlyCode) >= 0) {
                jsonDeptData.PublicOwner.splice(jsonDeptData.PublicOwner.indexOf(departOnlyCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCode="dep-public-owner"],span.checkbox_true_part[TypeCode="dep-public-owner"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.PublicOwner.indexOf(departOnlyCode) == -1) {
                jsonDeptData.PublicOwner.push(departOnlyCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCode="dep-private-owner"],span.checkbox_false_part[TypeCode="dep-private-owner"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.PrivateOwner.indexOf(departOnlyCode) >= 0) {
                jsonDeptData.PrivateOwner.splice(jsonDeptData.PrivateOwner.indexOf(departOnlyCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCode="dep-private-owner"],span.checkbox_true_part[TypeCode="dep-private-owner"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.PrivateOwner.indexOf(departOnlyCode) == -1) {
                jsonDeptData.PrivateOwner.push(departOnlyCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCode="dep-common-owner"],span.checkbox_false_part[TypeCode="dep-common-owner"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.CommonOwner.indexOf(departOnlyCode) >= 0) {
                jsonDeptData.CommonOwner.splice(jsonDeptData.CommonOwner.indexOf(departOnlyCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCode="dep-common-owner"],span.checkbox_true_part[TypeCode="dep-common-owner"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.CommonOwner.indexOf(departOnlyCode) == -1) {
                jsonDeptData.CommonOwner.push(departOnlyCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCode="dep-fy-fellow"],span.checkbox_false_part[TypeCode="dep-fy-fellow"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.FyFellow.indexOf(departOnlyCode) >= 0) {
                jsonDeptData.FyFellow.splice(jsonDeptData.FyFellow.indexOf(departOnlyCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCode="dep-fy-fellow"],span.checkbox_true_part[TypeCode="dep-fy-fellow"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.FyFellow.indexOf(departOnlyCode) == -1) {
                jsonDeptData.FyFellow.push(departOnlyCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCode="dep-cust-fellow"],span.checkbox_false_part[TypeCode="dep-cust-fellow"]'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.CustFellow.indexOf(departOnlyCode) >= 0) {
                jsonDeptData.CustFellow.splice(jsonDeptData.CustFellow.indexOf(departOnlyCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCode="dep-cust-fellow"],span.checkbox_true_part[TypeCode="dep-cust-fellow'), function () {
            var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
            if (jsonDeptData.CustFellow.indexOf(departOnlyCode) == -1) {
                jsonDeptData.CustFellow.push(departOnlyCode);
            }
        });

        //layui.each($('input:checkbox[TypeCode="dep-fy-sel"]:not(:checked)'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.FySel.indexOf(departOnlyCode) >= 0) {
        //        jsonDeptData.FySel.splice(jsonDeptData.FySel.indexOf(departOnlyCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-fy-sel"]:checked'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.FySel.indexOf(departOnlyCode) == -1) {
        //        jsonDeptData.FySel.push(departOnlyCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-cust-sel"]:not(:checked)'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.CustSel.indexOf(departOnlyCode) >= 0) {
        //        jsonDeptData.CustSel.splice(jsonDeptData.CustSel.indexOf(departOnlyCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-cust-sel"]:checked'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.CustSel.indexOf(departOnlyCode) == -1) {
        //        jsonDeptData.CustSel.push(departOnlyCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-public-owner"]:not(:checked)'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.PublicOwner.indexOf(departOnlyCode) >= 0) {
        //        jsonDeptData.PublicOwner.splice(jsonDeptData.PublicOwner.indexOf(departOnlyCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-public-owner"]:checked'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.PublicOwner.indexOf(departOnlyCode) == -1) {
        //        jsonDeptData.PublicOwner.push(departOnlyCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-private-owner"]:not(:checked)'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.PrivateOwner.indexOf(departOnlyCode) >= 0) {
        //        jsonDeptData.PrivateOwner.splice(jsonDeptData.PrivateOwner.indexOf(departOnlyCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-private-owner"]:checked'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.PrivateOwner.indexOf(departOnlyCode) == -1) {
        //        jsonDeptData.PrivateOwner.push(departOnlyCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-common-owner"]:not(:checked)'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.CommonOwner.indexOf(departOnlyCode) >= 0) {
        //        jsonDeptData.CommonOwner.splice(jsonDeptData.CommonOwner.indexOf(departOnlyCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-common-owner"]:checked'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.CommonOwner.indexOf(departOnlyCode) == -1) {
        //        jsonDeptData.CommonOwner.push(departOnlyCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-fy-fellow"]:not(:checked)'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.FyFellow.indexOf(departOnlyCode) >= 0) {
        //        jsonDeptData.FyFellow.splice(jsonDeptData.FyFellow.indexOf(departOnlyCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-fy-fellow"]:checked'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.FyFellow.indexOf(departOnlyCode) == -1) {
        //        jsonDeptData.FyFellow.push(departOnlyCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-cust-fellow"]:not(:checked)'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.CustFellow.indexOf(departOnlyCode) >= 0) {
        //        jsonDeptData.CustFellow.splice(jsonDeptData.CustFellow.indexOf(departOnlyCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCode="dep-cust-fellow"]:checked'), function () {
        //    var departOnlyCode = parseInt($(this).attr('DepartOnlyCode'));
        //    if (jsonDeptData.CustFellow.indexOf(departOnlyCode) == -1) {
        //        jsonDeptData.CustFellow.push(departOnlyCode);
        //    }
        //});
    },
    /// <summary>
    /// 根据treetable勾选片区数据更新缓存数据
    ///<param name="jsonDeptData">部门json数据</param>
    /// </summary>/
    RefreshTreeTableAreaSelectedNodes: function (jsonAreaData) {
        layui.each($('span.checkbox_false_full[TypeCodeArea="area-fy-sel"],span.checkbox_false_part[TypeCodeArea="area-fy-sel"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.FySel.indexOf(dataCode) >= 0) {
                jsonAreaData.FySel.splice(jsonAreaData.FySel.indexOf(dataCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCodeArea="area-fy-sel"],span.checkbox_true_part[TypeCodeArea="area-fy-sel"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.FySel.indexOf(dataCode) == -1 && dataCode != -1) {
                jsonAreaData.FySel.push(dataCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCodeArea="area-fy-modify"],span.checkbox_false_part[TypeCodeArea="area-fy-modify"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.FyModify.indexOf(dataCode) >= 0) {
                jsonAreaData.FyModify.splice(jsonAreaData.FyModify.indexOf(dataCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCodeArea="area-fy-modify"],span.checkbox_true_part[TypeCodeArea="area-fy-modify"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.FyModify.indexOf(dataCode) == -1 && dataCode != -1) {
                jsonAreaData.FyModify.push(dataCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCodeArea="area-cust-sel"],span.checkbox_false_part[TypeCodeArea="area-cust-sel"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.CustSel.indexOf(dataCode) >= 0) {
                jsonAreaData.CustSel.splice(jsonAreaData.CustSel.indexOf(dataCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCodeArea="area-cust-sel"],span.checkbox_true_part[TypeCodeArea="area-cust-sel"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.CustSel.indexOf(dataCode) == -1 && dataCode != -1) {
                jsonAreaData.CustSel.push(dataCode);
            }
        });
        layui.each($('span.checkbox_false_full[TypeCodeArea="area-fy-info"],span.checkbox_false_part[TypeCodeArea="area-fy-info"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.FyInfo.indexOf(dataCode) >= 0) {
                jsonAreaData.FyInfo.splice(jsonAreaData.FyInfo.indexOf(dataCode), 1);
            }
        });
        layui.each($('span.checkbox_true_full[TypeCodeArea="area-fy-info"],span.checkbox_true_part[TypeCodeArea="area-fy-info"]'), function () {
            var dataCode = parseInt($(this).attr('DataCode'));
            if (jsonAreaData.FyInfo.indexOf(dataCode) == -1 && dataCode != -1) {
                jsonAreaData.FyInfo.push(dataCode);
            }
        });

        //layui.each($('input:checkbox[TypeCodeArea="area-fy-sel"]:not(:checked)'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.FySel.indexOf(dataCode) >= 0) {
        //        jsonAreaData.FySel.splice(jsonAreaData.FySel.indexOf(dataCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCodeArea="area-fy-sel"]:checked'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.FySel.indexOf(dataCode) == -1 && dataCode != -1) {
        //        jsonAreaData.FySel.push(dataCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCodeArea="area-fy-modify"]:not(:checked)'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.FyModify.indexOf(dataCode) >= 0) {
        //        jsonAreaData.FyModify.splice(jsonAreaData.FyModify.indexOf(dataCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCodeArea="area-fy-modify"]:checked'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.FyModify.indexOf(dataCode) == -1 && dataCode != -1) {
        //        jsonAreaData.FyModify.push(dataCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCodeArea="area-cust-sel"]:not(:checked)'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.CustSel.indexOf(dataCode) >= 0) {
        //        jsonAreaData.CustSel.splice(jsonAreaData.CustSel.indexOf(dataCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCodeArea="area-cust-sel"]:checked'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.CustSel.indexOf(dataCode) == -1 && dataCode != -1) {
        //        jsonAreaData.CustSel.push(dataCode);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCodeArea="area-fy-info"]:not(:checked)'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.FyInfo.indexOf(dataCode) >= 0) {
        //        jsonAreaData.FyInfo.splice(jsonAreaData.FyInfo.indexOf(dataCode), 1);
        //    }
        //});
        //layui.each($('input:checkbox[TypeCodeArea="area-fy-info"]:checked'), function () {
        //    var dataCode = parseInt($(this).attr('DataCode'));
        //    if (jsonAreaData.FyInfo.indexOf(dataCode) == -1 && dataCode != -1) {
        //        jsonAreaData.FyInfo.push(dataCode);
        //    }
        //});
    },
    /// <summary>
    /// 调整ztree展开状态
    ///<param name="treeId">数id</param>
    ///<param name="bool">true全部展开，false全部关闭</param>
    /// </summary>/
    CheckAllNodes: function (treeId, bool) {
        var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
        if (!!zTreeObj) {
            zTreeObj.checkAllNodes(bool);
        }
    },
    //获取当前选中面板
    GetCurrentTab: function () {
        var showTabType = $('#TabType>ul>li.layui-this').eq(0).attr('lay-id');
        if (showTabType == 'divisition') {
            return $('#TabDivisition>ul>li.layui-this').eq(0).attr('lay-id');
        } else if (showTabType == 'uplusDept') {
            return $('#TabDept>ul>li.layui-this').eq(0).attr('lay-id');
        } else if (showTabType == 'uplusArea') {
            return $('#TabArea>ul>li.layui-this').eq(0).attr('lay-id');
        }
        return '';
    },
    AjaxCount: 0,//用户判断调用Ajax次数
    //刷新当前显示面板数据
    RefreshCurrentTab: function (treeNode) {
        //var currentTab = DepartmentIndex.GetCurrentTab();

        //PublicComm.AjaxCount = 0;
        //var index = PublicComm.LayerLoad();

        //U+门店权限我能看的
        //if (currentTab == 'uplusDeptCanSee') {
        var typeCode = $('input:radio[name=TypeCode]:checked').val();
        DepartmentIndex.RefreshTabUplusDeptCanSeeTable(treeNode, typeCode);
        //DepartmentIndex.RefreshTabUplusDeptCanSeeTree(treeNode, typeCode);
        //}

        //U+片区权限我能看的
        //if (currentTab == 'uplusAreaCanSee') {
        var typeCodeArea = $('input:radio[name=TypeCodeArea]:checked').val();
        DepartmentIndex.RefreshTabUplusAreaCanSeeCanSeeTable(treeNode, typeCodeArea);
        //DepartmentIndex.RefreshTabUplusAreaCanSeeCanSeeTree(treeNode, typeCodeArea);
        //}

        //U+门店权限能看我的
        //if (currentTab == 'uplusDeptBeSeen') {
        DepartmentIndex.RefreshTabUplusDeptBeSeen(treeNode);
        //}

        //U+片区权限能看我的
        //var typeCodeAreaBeSeen = $('input:radio[name=TypeCodeAreaBeSeen]:checked').val();
        //var areaDataTreeBeSeen = $.fn.zTree.getZTreeObj("areaDataTreeBeSeen");
        //if (!!areaDataTreeBeSeen) {
        //    PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityAreaCanSee').val(), 'DataCode': treeNode.DepartOnlyCode, 'TypeCodeList': [typeCodeAreaBeSeen], 'ViewType': 2 }, true, function (result) {
        //        areaDataTreeBeSeen.checkAllNodes(false);
        //        var data = [];
        //        if (!!result) {
        //            for (var i = 0; i < result.Data.length; i++) {
        //                var node = areaDataTreeBeSeen.getNodeByParam("ID", result.Data[i].ID);
        //                if (node != null) {
        //                    areaDataTreeBeSeen.checkNode(node, true);
        //                }
        //            };
        //            data = result.Data;
        //        }
        //        DepartmentIndex.RefreshUplusAreaBeSeenSelectedNodes(typeCodeAreaBeSeen, data);
        //    });
        //}

        //门限管辖权限我能看的
        //if (currentTab == 'divisitionCanSee') {
        DepartmentIndex.RefreshTabDivisitionCanSee(treeNode);
        //}


        //门限管辖权限能看我的
        //if (currentTab == 'divisitionBeSeen') {
        DepartmentIndex.RefreshTabDivisitionBeSeen(treeNode);
        //}

        //var interval = setInterval(function () {
        //    if (PublicComm.AjaxCount == 0) {
        //        PublicComm.LayerLoadClose(index);
        //        clearInterval(interval);
        //    }
        //}, 100);

    },
    //刷新管辖权限我能看的面板数据
    RefreshTabDivisitionCanSee: function (treeNode) {
        var TreeDivisitionCanSee = $.fn.zTree.getZTreeObj("TreeDivisitionCanSee");
        if (!!TreeDivisitionCanSee) {
            PublicComm.AjaxCount++;
            PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDivisitionCanSee').val(), 'DepartOnlyCode': treeNode.DepartOnlyCode, 'TypeCodeList': ['dep-divisition-sel'], 'ViewType': 1 }, true, function (result) {
                DepartmentIndex.DivisitionCanSeeSelectedNodes = [];
                TreeDivisitionCanSee.checkAllNodes(false);
                if (!!result) {
                    for (var i = 0; i < result.Data.length; i++) {
                        var node = TreeDivisitionCanSee.getNodeByParam("DepartOnlyCode", result.Data[i].DataCode);
                        if (node != null) {
                            TreeDivisitionCanSee.checkNode(node, true);
                        }
                    };
                    layui.each(result.Data, function () {
                        DepartmentIndex.DivisitionCanSeeSelectedNodes.push(this.DataCode);
                    });
                }
                PublicComm.AjaxCount--;
            });
        }
    },
    //刷新管辖权限能看我的面板数据
    RefreshTabDivisitionBeSeen: function (treeNode) {
        var TreeDivisitionBeSeen = $.fn.zTree.getZTreeObj("TreeDivisitionBeSeen");
        if (!!TreeDivisitionBeSeen) {
            PublicComm.AjaxCount++;
            PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDivisitionBeSeen').val(), 'DataCode': treeNode.DepartOnlyCode, 'TypeCodeList': ['dep-divisition-sel'], 'ViewType': 2 }, true, function (result) {
                DepartmentIndex.DivisitionBeSeenSelectedNodes = [];
                TreeDivisitionBeSeen.checkAllNodes(false);
                if (!!result) {
                    for (var i = 0; i < result.Data.length; i++) {
                        var node = TreeDivisitionBeSeen.getNodeByParam("DepartOnlyCode", result.Data[i].DepartOnlyCode);
                        if (node != null) {
                            TreeDivisitionBeSeen.checkNode(node, true);
                        }
                    };
                    layui.each(result.Data, function () {
                        DepartmentIndex.DivisitionBeSeenSelectedNodes.push(this.DataCode);
                    });
                }
                PublicComm.AjaxCount--;
            });
        }
    },
    //刷新U+门店权限我能看的面板tree数据
    RefreshTabUplusDeptCanSeeTree: function (treeNode, typeCode) {
        var deptDataTree = $.fn.zTree.getZTreeObj("deptDataTree");
        if (!!deptDataTree) {
            //PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityDeptCanSee').val(), 'DepartOnlyCode': treeNode.DepartOnlyCode, 'TypeCodeList': [typeCode], 'ViewType': 1 }, true, function (result) {
            //    deptDataTree.checkAllNodes(false);
            //    var data = [];
            //    if (!!result) {
            //        for (var i = 0; i < result.Data.length; i++) {
            //            var node = deptDataTree.getNodeByParam("DepartOnlyCode", result.Data[i].DataCode);
            //            if (node != null) {
            //                deptDataTree.checkNode(node, true);
            //            }
            //        };
            //        data = result.Data;
            //    }
            //    DepartmentIndex.RefreshUplusCanSeeSelectedNodes(typeCode, data);
            //});
            deptDataTree.checkAllNodes(false);
            var arrDept = DepartmentIndex.GetUplusCanSeeSelectedNodesByTypeCode(typeCode);
            for (var i = 0, j = arrDept.length; i < j; i++) {
                var node = deptDataTree.getNodeByParam("DepartOnlyCode", arrDept[i]);
                if (node != null) {
                    deptDataTree.checkNode(node, true);
                }
            };
        }
    },
    //刷新U+门店权限我能看的面板table数据
    RefreshTabUplusDeptCanSeeTable: function (treeNode, typeCode) {
        var cityid = $('#CityDeptCanSee').val();
        if (cityid > 0) {
            var index;
            //if ($("#treeTable tbody").children().length > 0 && typeCode == 'all') {
            //    var index = PublicComm.LayerLoad();
            //}
            PublicComm.AjaxCount++;
            PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': cityid, 'DepartOnlyCode': treeNode.DepartOnlyCode, 'TypeCodeList': ['dep-fy-sel', 'dep-cust-sel', 'dep-public-owner', 'dep-private-owner', 'dep-common-owner', 'dep-fy-fellow', 'dep-cust-fellow'], 'ViewType': 1 }, true, function (result) {
                var data = [];
                if (!!result) {
                    data = result.Data;
                }
                DepartmentIndex.BatchRefreshUplusCanSeeSelectedNodes(data);
                if ($("#treeTable tbody").children().length > 0 && typeCode == 'all') {
                    var listSorted = $('#DepartmentDeptCanSee').val() == '' ? null : DepartmentIndex.GetTreeListSorted($('#DepartmentDeptCanSee').find('option:selected').eq(0), DepartmentIndex.CacheDepartment);
                    DepartmentIndex.GetTreeTable($('#CityDeptCanSee').val(), DepartmentIndex.UplusCanSeeSelectedNodes, listSorted);
                    //DepartmentIndex.SetTreeTableStatus(DepartmentIndex.UplusCanSeeSelectedNodes, index);
                } else if (typeCode != 'all') {
                    DepartmentIndex.RefreshTabUplusDeptCanSeeTree(treeNode, typeCode);
                }
                PublicComm.AjaxCount--;
            });
        }
    },
    //刷新U+门店权限能看我的面板数据
    RefreshTabUplusDeptBeSeen: function (treeNode) {
        var cityid = $('#CityDeptCanSee').val();
        if (cityid > 0) {
            PublicComm.AjaxCount++;
            PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': cityid, 'DataCode': treeNode.DepartOnlyCode, 'TypeCodeList': ['dep-fy-sel', 'dep-cust-sel', 'dep-public-owner', 'dep-private-owner', 'dep-common-owner', 'dep-fy-fellow', 'dep-cust-fellow'], 'ViewType': 2 }, true, function (result) {
                var data = [];
                if (!!result) {
                    data = result.Data;
                }
                DepartmentIndex.BatchRefreshUplusBeSeenSelectedNodes(data);

                var deptDataTreeBeSeen = $.fn.zTree.getZTreeObj("deptDataTreeBeSeen");
                if (!!deptDataTreeBeSeen) {
                    deptDataTreeBeSeen.checkAllNodes(false);
                    var typeCodeBeSeen = $('input:radio[name=TypeCodeBeSeen]:checked').val();
                    var arrDept = DepartmentIndex.GetUplusBeSeenSelectedNodesByTypeCode(typeCodeBeSeen);
                    for (var i = 0, j = arrDept.length; i < j; i++) {
                        var node = deptDataTreeBeSeen.getNodeByParam("DepartOnlyCode", arrDept[i]);
                        if (node != null) {
                            deptDataTreeBeSeen.checkNode(node, true);
                        }
                    }
                }
                PublicComm.AjaxCount--;
            });
        }
    },
    //刷新U+片区权限我能看的面板table数据
    RefreshTabUplusAreaCanSeeCanSeeTable: function (treeNode, typeCodeArea) {
        var cityid = $('#CityAreaCanSee').val();
        if (cityid > 0) {
            PublicComm.AjaxCount++;
            PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': cityid, 'DepartOnlyCode': treeNode.DepartOnlyCode, 'TypeCodeList': ['area-fy-sel', 'area-fy-modify', 'area-cust-sel', 'area-fy-info'], 'ViewType': 1 }, true, function (result) {
                var data = [];
                if (!!result) {
                    data = result.Data;
                }
                DepartmentIndex.BatchRefreshUplusAreaCanSeeSelectedNodes(data);
                if ($("#treeTableArea tbody").children().length > 0 && typeCodeArea == 'all-area') {
                    var listSorted = $('#DepartmentAreaCanSee').val() == '' ? null : DepartmentIndex.GetAreaTreeListSorted($('#DepartmentAreaCanSee').find('option:selected').eq(0), DepartmentIndex.CacheArea);
                    DepartmentIndex.GetTreeTableArea($('#CityAreaCanSee').val(), DepartmentIndex.UplusAreaCanSeeSelectedNodes, listSorted);
                    //DepartmentIndex.SetTreeTableAreaStatus(DepartmentIndex.UplusAreaCanSeeSelectedNodes);
                } else if (typeCodeArea != 'all-area') {
                    DepartmentIndex.RefreshTabUplusAreaCanSeeCanSeeTree(treeNode, typeCodeArea);
                }
                PublicComm.AjaxCount--;
            });
        }
    },
    //刷新U+片区权限我能看的面板tree数据
    RefreshTabUplusAreaCanSeeCanSeeTree: function (treeNode, typeCodeArea) {
        var areaDataTree = $.fn.zTree.getZTreeObj("areaDataTree");
        if (!!areaDataTree) {
            //PublicComm.Ajax('POST', '/Authority/Privilege/GetPrivDepartmentList', { 'CityID': $('#CityAreaCanSee').val(), 'DepartOnlyCode': treeNode.DepartOnlyCode, 'TypeCodeList': [typeCodeArea], 'ViewType': 1 }, true, function (result) {
            //    areaDataTree.checkAllNodes(false);
            //    var data = [];
            //    if (!!result) {
            //        for (var i = 0; i < result.Data.length; i++) {
            //            var node = areaDataTree.getNodeByParam("DataCode", result.Data[i].DataCode);
            //            if (node != null) {
            //                areaDataTree.checkNode(node, true);
            //            }
            //        };
            //        data = result.Data;
            //    }
            //    DepartmentIndex.RefreshUplusAreaCanSeeSelectedNodes(typeCodeArea, data);
            //});
            areaDataTree.checkAllNodes(false);
            var arrArea = DepartmentIndex.GetUplusAreaCanSeeSelectedNodesByTypeCode(typeCodeArea);
            for (var i = 0, j = arrArea.length; i < j; i++) {
                var node = areaDataTree.getNodeByParam("DataCode", arrArea[i]);
                if (node != null) {
                    areaDataTree.checkNode(node, true);
                }
            };
        }
    },
    //初始化部门树，以及部门点击事件
    GetDeptTreeNoCheck: function (element, cityid, listSorted) {
        var zTree;
        //部门点击事件
        var zTreeOnClick = function (event, treeId, treeNode) {
            DepartmentIndex.RefreshCurrentTab(treeNode);
        };
        var setting = {
            view: {
                selectedMulti: false
            },
            check: {
                enable: false,
                chkStyle: "checkbox",
                chkboxType: { "Y": "ps", "N": "ps" }
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
            callback: {    //第一步
                onClick: zTreeOnClick
            }
        };
        if (!!listSorted) {
            zTree = $.fn.zTree.init(element, setting, listSorted);
            //zTree.expandAll(true);
        } else {
            if (!!CacheHelper.GetDepartment($('#City').val())) {
                zTree = $.fn.zTree.init(element, setting, CacheHelper.GetDepartment($('#City').val()));
                //zTree.expandAll(true);
            } else {
                PublicComm.Ajax("POST", '/Authority/Department/GetDepartmentListByCity', { CityID: $('#City').val() }, true, function (result) {
                    CacheHelper.SetDepartment($('#City').val(), result.Data);
                    zTree = $.fn.zTree.init(element, setting, CacheHelper.GetDepartment($('#City').val()));
                    //zTree.expandAll(true);
                });
            }
        }
    },
    //初始化部门treetable
    GetTreeTable: function (cityid, jsonDeptData, listSorted) {
        var InitTreeTable = function (listDept) {
            $("#treeTable tbody").html(DepartmentIndex.BuildDeptDataPermissionHTML(listDept));
            $("#treeTable").treetable({
                expandable: true,
                clickableNodeNames: true,
            }, true);
            $('#treeTable span.button.chk').on('click', function () {
                var typeId = 'TypeCode';
                var typeCode = $(this).attr('TypeCode');
                DepartmentIndex.SetCurrentNodeCheckBox($(this), typeId, typeCode);
            });
            //$("#treeTable").treetable("expandAll");//展开全部
            //form.render();
            //if (!!jsonDeptData) {
            //    DepartmentIndex.SetTreeTableStatus(jsonDeptData);
            //}
        };
        if (!!listSorted) {
            InitTreeTable(listSorted);
        } else {
            InitTreeTable(DepartmentIndex.CacheDepartment);
        }
    },
    /// <summary>
    /// 初始化部门treetable勾选状态
    ///<param name="jsonDeptData">部门json数据</param>
    ///<param name="index">layer.load层索引，如果 !index == true 则表示未加载layer.load层</param>
    ///<param name="isLayerLoad">是否不加载layer.load</param>
    /// </summary>/
    SetTreeTableStatus: function (jsonDeptData, index, noLayerLoad) {
        if (!noLayerLoad && !index) {
            index = PublicComm.LayerLoad();
        }
        setTimeout(function () {
            $('span[TypeCode="dep-fy-sel"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCode="dep-cust-sel"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCode="dep-public-owner"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCode="dep-private-owner"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCode="dep-common-owner"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCode="dep-fy-fellow"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCode="dep-cust-fellow"]').removeClass().addClass('button chk checkbox_false_full');
            layui.each(jsonDeptData.FySel, function (index, item) {
                $('span[DepartOnlyCode=' + item + '][TypeCode="dep-fy-sel"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonDeptData.CustSel, function (index, item) {
                $('span[DepartOnlyCode=' + item + '][TypeCode="dep-cust-sel"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonDeptData.PublicOwner, function (index, item) {
                $('span[DepartOnlyCode=' + item + '][TypeCode="dep-public-owner"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonDeptData.PrivateOwner, function (index, item) {
                $('span[DepartOnlyCode=' + item + '][TypeCode="dep-private-owner"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonDeptData.CommonOwner, function (index, item) {
                $('span[DepartOnlyCode=' + item + '][TypeCode="dep-common-owner"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonDeptData.FyFellow, function (index, item) {
                $('span[DepartOnlyCode=' + item + '][TypeCode="dep-fy-fellow"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonDeptData.CustFellow, function (index, item) {
                $('span[DepartOnlyCode=' + item + '][TypeCode="dep-cust-fellow"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            if (jsonDeptData.FySel.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCode="dep-fy-sel"]'), 'TypeCode', 'dep-fy-sel');
            }
            if (jsonDeptData.CustSel.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCode="dep-cust-sel"]'), 'TypeCode', 'dep-cust-sel');
            }
            if (jsonDeptData.PublicOwner.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCode="dep-public-owner"]'), 'TypeCode', 'dep-public-owner');
            }
            if (jsonDeptData.PrivateOwner.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCode="dep-private-owner"]'), 'TypeCode', 'dep-private-owner');
            }
            if (jsonDeptData.CommonOwner.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCode="dep-common-owner"]'), 'TypeCode', 'dep-common-owner');
            }
            if (jsonDeptData.FyFellow.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCode="dep-fy-fellow"]'), 'TypeCode', 'dep-fy-fellow');
            }
            if (jsonDeptData.CustFellow.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCode="dep-cust-fellow"]'), 'TypeCode', 'dep-cust-fellow');
            }

            //$('input:checkbox[TypeCode="dep-fy-sel"]').prop('checked', false);
            //$('input:checkbox[TypeCode="dep-cust-sel"]').prop('checked', false);
            //$('input:checkbox[TypeCode="dep-public-owner"]').prop('checked', false);
            //$('input:checkbox[TypeCode="dep-private-owner"]').prop('checked', false);
            //$('input:checkbox[TypeCode="dep-common-owner"]').prop('checked', false);
            //$('input:checkbox[TypeCode="dep-fy-fellow"]').prop('checked', false);
            //$('input:checkbox[TypeCode="dep-cust-fellow"]').prop('checked', false);
            //layui.each(jsonDeptData.FySel, function (index, item) {
            //    $('input:checkbox[DepartOnlyCode=' + item + '][TypeCode="dep-fy-sel"]').prop('checked', true);
            //});
            //layui.each(jsonDeptData.CustSel, function (index, item) {
            //    $('input:checkbox[DepartOnlyCode=' + item + '][TypeCode="dep-cust-sel"]').prop('checked', true);
            //});
            //layui.each(jsonDeptData.PublicOwner, function (index, item) {
            //    $('input:checkbox[DepartOnlyCode=' + item + '][TypeCode="dep-public-owner"]').prop('checked', true);
            //});
            //layui.each(jsonDeptData.PrivateOwner, function (index, item) {
            //    $('input:checkbox[DepartOnlyCode=' + item + '][TypeCode="dep-private-owner"]').prop('checked', true);
            //});
            //layui.each(jsonDeptData.CommonOwner, function (index, item) {
            //    $('input:checkbox[DepartOnlyCode=' + item + '][TypeCode="dep-common-owner"]').prop('checked', true);
            //});
            //layui.each(jsonDeptData.FyFellow, function (index, item) {
            //    $('input:checkbox[DepartOnlyCode=' + item + '][TypeCode="dep-fy-fellow"]').prop('checked', true);
            //});
            //layui.each(jsonDeptData.CustFellow, function (index, item) {
            //    $('input:checkbox[DepartOnlyCode=' + item + '][TypeCode="dep-cust-fellow"]').prop('checked', true);
            //});
            //layui.use('form', function () {
            //    layui.form.render('checkbox');
            //});
            if (!noLayerLoad) {
                PublicComm.LayerLoadClose(index);
            }
        }, 50);

    },
    //初始化片区treetable
    GetTreeTableArea: function (cityid, jsonAreaData, listSorted) {
        var InitTreeTable = function (listArea) {
            $("#treeTableArea tbody").html(DepartmentIndex.BuildAreaDataPermissionHTML(listArea));
            $("#treeTableArea").treetable({
                expandable: true,
                clickableNodeNames: true,
            }, true);
            //$("#treeTable").treetable("expandAll");//展开全部
            //$("#treeTableArea tbody tr td input:checkbox[DataCode=-1]").prop('disabled', true);
            $('#treeTableArea span.button.chk').on('click', function () {
                var typeId = 'TypeCodeArea';
                var typeCode = $(this).attr('TypeCodeArea');
                DepartmentIndex.SetCurrentNodeCheckBox($(this), typeId, typeCode);
            });
            //form.render();
            //if (!!jsonAreaData) {
            //    DepartmentIndex.SetTreeTableAreaStatus(jsonAreaData);
            //}
        };
        if (!!listSorted) {
            InitTreeTable(listSorted);
        } else {
            InitTreeTable(DepartmentIndex.CacheArea);
        }
    },
    //初始化片区treetable勾选状态
    SetTreeTableAreaStatus: function (jsonAreaData) {
        //var index = PublicComm.LayerLoad();
        setTimeout(function () {
            $('span[TypeCodeArea="area-fy-sel"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCodeArea="area-fy-modify"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCodeArea="area-cust-sel"]').removeClass().addClass('button chk checkbox_false_full');
            $('span[TypeCodeArea="area-fy-info"]').removeClass().addClass('button chk checkbox_false_full');
            layui.each(jsonAreaData.FySel, function (index, item) {
                $('span[DataCode=' + item + '][TypeCodeArea="area-fy-sel"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonAreaData.FyModify, function (index, item) {
                $('span[DataCode=' + item + '][TypeCodeArea="area-fy-modify"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonAreaData.CustSel, function (index, item) {
                $('span[DataCode=' + item + '][TypeCodeArea="area-cust-sel"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            layui.each(jsonAreaData.FyInfo, function (index, item) {
                $('span[DataCode=' + item + '][TypeCodeArea="area-fy-info"]').removeClass('checkbox_false_full').addClass('checkbox_true_full');
            });
            if (jsonAreaData.FySel.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCodeArea="area-fy-sel"]'), 'TypeCodeArea', 'area-fy-sel');
            }
            if (jsonAreaData.FyModify.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCodeArea="area-fy-modify"]'), 'TypeCodeArea', 'area-fy-modify');
            }
            if (jsonAreaData.CustSel.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCodeArea="area-cust-sel"]'), 'TypeCodeArea', 'area-cust-sel');
            }
            if (jsonAreaData.FyInfo.length > 0) {
                DepartmentIndex.InitTreeTalbeNodeCheckBox($('span[TypeCodeArea="area-fy-info"]'), 'TypeCodeArea', 'area-fy-info');
            }

            //$('input:checkbox[TypeCodeArea="area-fy-sel"]').prop('checked', false);
            //$('input:checkbox[TypeCodeArea="area-fy-modify"]').prop('checked', false);
            //$('input:checkbox[TypeCodeArea="area-cust-sel"]').prop('checked', false);
            //$('input:checkbox[TypeCodeArea="area-fy-info"]').prop('checked', false);
            //layui.each(jsonAreaData.FySel, function (index, item) {
            //    $('input:checkbox[DataCode=' + item + '][TypeCodeArea="area-fy-sel"]').prop('checked', true);
            //});
            //layui.each(jsonAreaData.FyModify, function (index, item) {
            //    $('input:checkbox[DataCode=' + item + '][TypeCodeArea="area-fy-modify"]').prop('checked', true);
            //});
            //layui.each(jsonAreaData.CustSel, function (index, item) {
            //    $('input:checkbox[DataCode=' + item + '][TypeCodeArea="area-cust-sel"]').prop('checked', true);
            //});
            //layui.each(jsonAreaData.FyInfo, function (index, item) {
            //    $('input:checkbox[DataCode=' + item + '][TypeCodeArea="area-fy-info"]').prop('checked', true);
            //});
            //layui.use('form', function () {
            //    layui.form.render('checkbox');
            //});
            //PublicComm.LayerLoadClose(index);
        }, 50);

    },
    /// <summary>
    /// 获取门店树所选择节点
    /// </summary>
    GetDeptTreeSelectedNodes: function () {
        var zTreeObj = $.fn.zTree.getZTreeObj("deptTree");
        if (!zTreeObj) {
            return null;
        }
        var selectedNodes = zTreeObj.getSelectedNodes();
        return (!!selectedNodes && selectedNodes.length > 0) ? selectedNodes[0] : null;
    },
    /// <summary>
    /// 判断门店树是否选择一个部门
    ///<param name="node">当前选择节点</param>
    /// </summary>
    ValidateDeptTreeSelected: function (node) {
        if (!node) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.alert("请选择一个部门");
            });
            return false;
        }
        return true;
    },
    //根据数据类型返回勾选的部门数组
    GetUplusCanSeeSelectedNodesByTypeCode: function (typeCode) {
        switch (typeCode) {
            case 'dep-fy-sel':
                return DepartmentIndex.UplusCanSeeSelectedNodes.FySel;
            case 'dep-cust-sel':
                return DepartmentIndex.UplusCanSeeSelectedNodes.CustSel;
            case 'dep-public-owner':
                return DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner;
            case 'dep-private-owner':
                return DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner;
            case 'dep-common-owner':
                return DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner;
            case 'dep-fy-fellow':
                return DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow;
            case 'dep-cust-fellow':
                return DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow;
        }
        return [];
    },
    //根据数据类型返回勾选的部门数组
    GetUplusBeSeenSelectedNodesByTypeCode: function (typeCode) {
        switch (typeCode) {
            case 'dep-fy-sel':
                return DepartmentIndex.UplusBeSeenSelectedNodes.FySel;
            case 'dep-cust-sel':
                return DepartmentIndex.UplusBeSeenSelectedNodes.CustSel;
            case 'dep-public-owner':
                return DepartmentIndex.UplusBeSeenSelectedNodes.PublicOwner;
            case 'dep-private-owner':
                return DepartmentIndex.UplusBeSeenSelectedNodes.PrivateOwner;
            case 'dep-common-owner':
                return DepartmentIndex.UplusBeSeenSelectedNodes.CommonOwner;
            case 'dep-fy-fellow':
                return DepartmentIndex.UplusBeSeenSelectedNodes.FyFellow;
            case 'dep-cust-fellow':
                return DepartmentIndex.UplusBeSeenSelectedNodes.CustFellow;
        }
        return [];
    },
    //根据数据类型返回数据类型名称
    GetUplusParamNameByTypeCode: function (typeCode) {
        switch (typeCode) {
            case 'dep-fy-sel':
                return 'DepFySel';
            case 'dep-cust-sel':
                return 'DepCustSel';
            case 'dep-public-owner':
                return 'DepPublicOwner';
            case 'dep-private-owner':
                return 'DepPrivateOwner';
            case 'dep-common-owner':
                return 'DepCommonOwner';
            case 'dep-fy-fellow':
                return 'DepFyFellow';
            case 'dep-cust-fellow':
                return 'DepCustFellow';
        }
        return '';
    },
    ///<summary>
    ///刷新U+门店权限选择我能看的
    ///</summary>
    ///<param name="typeCode">选择的数据类型</param>
    ///<param name="data">返回的数据</param>
    ///<return></return>
    RefreshUplusCanSeeSelectedNodes: function (typeCode, data) {
        switch (typeCode) {
            case 'dep-fy-sel':
                DepartmentIndex.UplusCanSeeSelectedNodes.FySel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.FySel.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.FySel.push(this.DataCode);
                    }
                });
                break;
            case 'dep-cust-sel':
                DepartmentIndex.UplusCanSeeSelectedNodes.CustSel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.CustSel.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.CustSel.push(this.DataCode);
                    }
                });
                break;
            case 'dep-public-owner':
                DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner.push(this.DataCode);
                    }
                });
                break;
            case 'dep-private-owner':
                DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner.push(this.DataCode);
                    }
                });
                break;
            case 'dep-common-owner':
                DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner.push(this.DataCode);
                    }
                });
                break;
            case 'dep-fy-fellow':
                DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow.push(this.DataCode);
                    }
                });
                break;
            case 'dep-cust-fellow':
                DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow.push(this.DataCode);
                    }
                });
                break;
        }
    },
    ///<summary>
    ///刷新U+门店权限选择能看我的
    ///</summary>
    ///<param name="typeCode">选择的数据类型</param>
    ///<param name="data">返回的数据</param>
    ///<return></return>
    RefreshUplusBeSeenSelectedNodes: function (typeCode, data) {
        switch (typeCode) {
            case 'dep-fy-sel':
                DepartmentIndex.UplusBeSeenSelectedNodes.FySel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.FySel.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.FySel.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'dep-cust-sel':
                DepartmentIndex.UplusBeSeenSelectedNodes.CustSel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.CustSel.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.CustSel.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'dep-public-owner':
                DepartmentIndex.UplusBeSeenSelectedNodes.PublicOwner = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.PublicOwner.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.PublicOwner.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'dep-private-owner':
                DepartmentIndex.UplusBeSeenSelectedNodes.PrivateOwner = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.PrivateOwner.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.PrivateOwner.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'dep-common-owner':
                DepartmentIndex.UplusBeSeenSelectedNodes.CommonOwner = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.CommonOwner.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.CommonOwner.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'dep-fy-fellow':
                DepartmentIndex.UplusBeSeenSelectedNodes.FyFellow = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.FyFellow.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.FyFellow.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'dep-cust-fellow':
                DepartmentIndex.UplusBeSeenSelectedNodes.CustFellow = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.CustFellow.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.CustFellow.push(this.DepartOnlyCode);
                    }
                });
                break;
        }
    },
    ///<summary>
    ///批量刷新U+门店权限选择我能看的
    ///</summary>
    ///<param name="data">返回的数据</param>
    ///<return></return>
    BatchRefreshUplusCanSeeSelectedNodes: function (data) {
        DepartmentIndex.UplusCanSeeSelectedNodes = { FySel: [], CustSel: [], PublicOwner: [], PrivateOwner: [], CommonOwner: [], FyFellow: [], CustFellow: [] };
        layui.each(data, function () {
            switch (this.TypeCode) {
                case 'dep-fy-sel':
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.FySel.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.FySel.push(this.DataCode);
                    }
                    break;
                case 'dep-cust-sel':
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.CustSel.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.CustSel.push(this.DataCode);
                    }
                    break;
                case 'dep-public-owner':
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner.push(this.DataCode);
                    }
                    break;
                case 'dep-private-owner':
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner.push(this.DataCode);
                    }
                    break;
                case 'dep-common-owner':
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner.push(this.DataCode);
                    }
                    break;
                case 'dep-fy-fellow':
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow.push(this.DataCode);
                    }
                    break;
                case 'dep-cust-fellow':
                    if (DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow.indexOf(this.DataCode) == -1) {
                        DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow.push(this.DataCode);
                    }
                    break;
            }
        });
    },
    ///<summary>
    ///批量刷新U+门店权限选择能看我的
    ///</summary>
    ///<param name="data">返回的数据</param>
    ///<return></return>
    BatchRefreshUplusBeSeenSelectedNodes: function (data) {
        DepartmentIndex.UplusBeSeenSelectedNodes = { FySel: [], CustSel: [], PublicOwner: [], PrivateOwner: [], CommonOwner: [], FyFellow: [], CustFellow: [] };
        layui.each(data, function () {
            switch (this.TypeCode) {
                case 'dep-fy-sel':
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.FySel.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.FySel.push(this.DepartOnlyCode);
                    }
                    break;
                case 'dep-cust-sel':
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.CustSel.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.CustSel.push(this.DepartOnlyCode);
                    }
                    break;
                case 'dep-public-owner':
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.PublicOwner.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.PublicOwner.push(this.DepartOnlyCode);
                    }
                    break;
                case 'dep-private-owner':
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.PrivateOwner.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.PrivateOwner.push(this.DepartOnlyCode);
                    }
                    break;
                case 'dep-common-owner':
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.CommonOwner.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.CommonOwner.push(this.DepartOnlyCode);
                    }
                    break;
                case 'dep-fy-fellow':
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.FyFellow.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.FyFellow.push(this.DepartOnlyCode);
                    }
                    break;
                case 'dep-cust-fellow':
                    if (DepartmentIndex.UplusBeSeenSelectedNodes.CustFellow.indexOf(this.DepartOnlyCode) == -1) {
                        DepartmentIndex.UplusBeSeenSelectedNodes.CustFellow.push(this.DepartOnlyCode);
                    }
                    break;
            }
        });
    },
    //根据数据类型返回勾选的部门数组
    GetUplusAreaCanSeeSelectedNodesByTypeCode: function (typeCode) {

        switch (typeCode) {
            case 'area-fy-sel':
                return DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel;
            case 'area-fy-modify':
                return DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify;
            case 'area-cust-sel':
                return DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel;
            case 'area-fy-info':
                return DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo;
        }
        return [];
    },
    //根据数据类型返回勾选的部门数组
    GetUplusAreaBeSeenSelectedNodesByTypeCode: function (typeCode) {
        switch (typeCode) {
            case 'area-fy-sel':
                return DepartmentIndex.UplusAreaBeSeenSelectedNodes.FySel;
            case 'area-fy-modify':
                return DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyModify;
            case 'area-cust-sel':
                return DepartmentIndex.UplusAreaBeSeenSelectedNodes.CustSel;
            case 'area-fy-info':
                return DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyInfo;
        }
        return [];
    },
    //根据数据类型返回数据类型名称
    GetUplusAreaParamNameByTypeCode: function (typeCode) {
        switch (typeCode) {
            case 'area-fy-sel':
                return 'AreaFySel';
            case 'area-fy-modify':
                return 'AreaFyModify';
            case 'area-cust-sel':
                return 'AreaCustSel';
            case 'area-fy-info':
                return 'AreaFyInfo';
        }
        return '';
    },
    ///<summary>
    ///刷新U+片区权限选择我能看的
    ///</summary>
    ///<param name="typeCode">选择的数据类型</param>
    ///<param name="data">返回的数据</param>
    ///<return></return>
    RefreshUplusAreaCanSeeSelectedNodes: function (typeCode, data) {
        switch (typeCode) {
            case 'area-fy-sel':
                DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel.push(this.DataCode);
                    }
                });
                break;
            case 'area-fy-modify':
                DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify.push(this.DataCode);
                    }
                });
                break;
            case 'area-cust-sel':
                DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel.push(this.DataCode);
                    }
                });
                break;
            case 'area-fy-info':
                DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo.push(this.DataCode);
                    }
                });
                break;
        }
    },
    ///<summary>
    ///刷新U+片区权限选择能看我的
    ///</summary>
    ///<param name="typeCode">选择的数据类型</param>
    ///<param name="data">返回的数据</param>
    ///<return></return>
    RefreshUplusAreaBeSeenSelectedNodes: function (typeCode, data) {
        switch (typeCode) {
            case 'area-fy-sel':
                DepartmentIndex.UplusAreaBeSeenSelectedNodes.FySel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaBeSeenSelectedNodes.FySel.indexOf(this.DepartOnlyCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaBeSeenSelectedNodes.FySel.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'area-fy-modify':
                DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyModify = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyModify.indexOf(this.DepartOnlyCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyModify.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'area-cust-sel':
                DepartmentIndex.UplusAreaBeSeenSelectedNodes.CustSel = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaBeSeenSelectedNodes.CustSel.indexOf(this.DepartOnlyCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaBeSeenSelectedNodes.CustSel.push(this.DepartOnlyCode);
                    }
                });
                break;
            case 'area-fy-info':
                DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyInfo = [];
                layui.each(data, function () {
                    if (DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyInfo.indexOf(this.DepartOnlyCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaBeSeenSelectedNodes.FyInfo.push(this.DepartOnlyCode);
                    }
                });
                break;
        }
    },
    ///<summary>
    ///批量刷新U+片区权限选择我能看的
    ///</summary>
    ///<param name="data">返回的数据</param>
    ///<return></return>
    BatchRefreshUplusAreaCanSeeSelectedNodes: function (data) {
        DepartmentIndex.UplusAreaCanSeeSelectedNodes = { FySel: [], FyModify: [], CustSel: [], FyInfo: [] };
        layui.each(data, function () {
            switch (this.TypeCode) {
                case 'area-fy-sel':
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel.push(this.DataCode);
                    }
                    break;
                case 'area-fy-modify':
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify.push(this.DataCode);
                    }
                    break;
                case 'area-cust-sel':
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel.push(this.DataCode);
                    }
                    break;
                case 'area-fy-info':
                    if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo.indexOf(this.DataCode) == -1 && this.DataCode != -1) {
                        DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo.push(this.DataCode);
                    }
                    break;
            }
        });
    },
    /// <summary>
    /// 根据treetable排序规则拼写HTML
    /// </summary>
    BuildDeptDataPermissionHTML: function (jsonArr) {
        var strHTML = '';//HTML字符串
        if (!jsonArr.length) {
            return strHTML;
        }
        //var listSorted = [];//根据reetable排序规则排序的json数组
        ////根据父节点升序排序，0为根节点
        //jsonArr = jsonArr.sort(function (a, b) {
        //    return a.ParentDeptNo - b.ParentDeptNo;
        //});
        ////递归查找子节点
        //jsonArr.forEach(function (item) {
        //    DepartmentIndex.DeptSortNodeInfo(item, jsonArr, listSorted);
        //});
        DepartmentIndex.SetTreeTableCheckboxStatus();
        jsonArr.forEach(function (item) {
            strHTML += '<tr data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '">';
            strHTML += '<td class="deptName-width" DepartOnlyCode="' + item.DepartOnlyCode + '">' + item.DeptName + '</td>';
            strHTML += '<td class="deptChb-width"><span class="button chk ' + item.FySelTreeClass + '" data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '" TypeCode="dep-fy-sel"></span></td>';
            strHTML += '<td class="deptChb-width"><span class="button chk ' + item.CustSelTreeClass + '" data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '" TypeCode="dep-cust-sel"></span></td>';
            strHTML += '<td class="deptChb-width"><span class="button chk ' + item.PublicOwnerTreeClass + '" data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '" TypeCode="dep-public-owner"></span></td>';
            strHTML += '<td class="deptChb-width"><span class="button chk ' + item.PrivateOwnerTreeClass + '" data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '" TypeCode="dep-private-owner"></span></td>';
            strHTML += '<td class="deptChb-width"><span class="button chk ' + item.CommonOwnerTreeClass + '" data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '" TypeCode="dep-common-owner"></span></td>';
            strHTML += '<td class="deptChb-width"><span class="button chk ' + item.FyFellowTreeClass + '" data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '" TypeCode="dep-fy-fellow"></span></td>';
            strHTML += '<td class="deptChb-width"><span class="button chk ' + item.CustFellowTreeClass + '" data-tt-id="' + item.DeptNo + '"  data-tt-parent-id="' + item.ParentDeptNo + '" DepartOnlyCode="' + item.DepartOnlyCode + '" TypeCode="dep-cust-fellow"></span></td>';
            strHTML += '</tr>';
        });
        return strHTML;
    },
    /// <summary>
    /// 根据treetable排序规则递归添加json数组
    /// </summary>
    DeptSortNodeInfo: function (obj, jsonArr, listSorted) {
        //去重，已经存在直接跳过
        if (listSorted.indexOf(obj) >= 0) {
            return;
        }
        listSorted.push(obj);
        delete jsonArr[jsonArr.indexOf(obj)];
        if (!obj.DeptNo) {
            return;
        }
        //递归查找子节点
        jsonArr.forEach(function (item) {
            if (obj.ID == item.ParentDeptNo) {
                DepartmentIndex.DeptSortNodeInfo(item, jsonArr, listSorted);
            }
        });
    },
    /// <summary>
    /// 根据treetable排序规则拼写HTML
    /// </summary>
    BuildAreaDataPermissionHTML: function (jsonArr) {
        var strHTML = '';//HTML字符串
        if (!jsonArr.length) {
            return strHTML;
        }
        DepartmentIndex.SetTreeTableAreaCheckboxStatus();
        jsonArr.forEach(function (item) {
            strHTML += '<tr data-tt-id="' + item.ID + '"  data-tt-parent-id="' + item.ParentID + '">';
            strHTML += '<td>' + item.Name + '</td>';
            strHTML += '<td><span class="button chk ' + item.FySelTreeClass + '" data-tt-id="' + item.ID + '"  data-tt-parent-id="' + item.ParentID + '" DataCode="' + item.DataCode + '" TypeCodeArea="area-fy-sel"></span></td>';
            strHTML += '<td><span class="button chk ' + item.FyModifyTreeClass + '" data-tt-id="' + item.ID + '"  data-tt-parent-id="' + item.ParentID + '" DataCode="' + item.DataCode + '" TypeCodeArea="area-fy-modify"></span></td>';
            strHTML += '<td><span class="button chk ' + item.CustSelTreeClass + '" data-tt-id="' + item.ID + '"  data-tt-parent-id="' + item.ParentID + '" DataCode="' + item.DataCode + '" TypeCodeArea="area-cust-sel"></span></td>';
            strHTML += '<td><span class="button chk ' + item.FyInfoTreeClass + '" data-tt-id="' + item.ID + '"  data-tt-parent-id="' + item.ParentID + '" DataCode="' + item.DataCode + '" TypeCodeArea="area-fy-info"></span></td>';
            strHTML += '</tr>';
        });
        return strHTML;
    },
    ///<summary>
    ///获取ztree所有父节点
    ///</summary>
    ///<param name="parentDeptNo">当前节点的parentDeptNo</param>
    ///<param name="deptList">树的所有节点</param>
    ///<param name="listSorted">返回节点集合</param>
    ///<return></return>
    GetParentNode: function (parentDeptNo, deptList, listSorted) {
        if (DepartmentIndex.IsContain(parentDeptNo, listSorted)) {
            return;
        }
        for (var i = 0; i < deptList.length; i++) {
            if (parentDeptNo == deptList[i].DeptNo) {
                listSorted.push(deptList[i]);
                DepartmentIndex.GetParentNode(deptList[i].ParentDeptNo, deptList, listSorted);
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
        //if (DepartmentIndex.IsContain(deptno, listSorted)) {
        //	return;
        //}
        for (var i = 0; i < deptList.length; i++) {
            if (deptno == deptList[i].DeptNo) {
                if (listSorted.indexOf(deptList[i]) <= 0) {
                    listSorted.push(deptList[i]);
                }
            }
            if (deptno == deptList[i].ParentDeptNo) {
                listSorted.push(deptList[i]);
                DepartmentIndex.GetChildNode(deptList[i].DeptNo, deptList, listSorted);
            }
        }
    },
    //是否包含部门树节点
    IsContain: function (deptNo, listSorted) {
        for (var i = 0; i < listSorted.length; i++) {
            if (deptNo == listSorted[i].DeptNo) {
                return true;
            }
        }
        return false;
    },
    ///<summary>
    ///获取ztree所有父节点
    ///</summary>
    ///<param name="parentID">当前节点的parentID</param>
    ///<param name="areaList">树的所有节点</param>
    ///<param name="listSorted">返回节点集合</param>
    ///<return></return>
    GetAreaParentNode: function (parentID, areaList, listSorted) {
        if (DepartmentIndex.IsContainAreaTree(parentID, listSorted)) {
            return;
        }
        for (var i = 0; i < areaList.length; i++) {
            if (parentID == areaList[i].ID) {
                listSorted.push(areaList[i]);
                DepartmentIndex.GetAreaParentNode(areaList[i].ParentID, areaList, listSorted);
            }
        }
    },
    ///<summary>
    ///获取ztree所有子节点
    ///</summary>
    ///<param name="id">当前节点的id</param>
    ///<param name="deptList">树的所有节点</param>
    ///<param name="listSorted">返回节点集合</param>
    ///<return></return>
    GetAreaChildNode: function (id, areaList, listSorted) {
        //if (DepartmentIndex.IsContain(deptno, listSorted)) {
        //	return;
        //}
        for (var i = 0; i < areaList.length; i++) {
            if (id == areaList[i].ID) {
                if (listSorted.indexOf(areaList[i]) <= 0) {
                    listSorted.push(areaList[i]);
                }
            }
            if (id == areaList[i].ParentID) {
                listSorted.push(areaList[i]);
                DepartmentIndex.GetChildNode(areaList[i].ID, areaList, listSorted);
            }
        }
    },
    //是否包含区域树节点
    IsContainAreaTree: function (id, listSorted) {
        for (var i = 0; i < listSorted.length; i++) {
            if (id == listSorted[i].ID) {
                return true;
            }
        }
        return false;
    },
    ///<summary>
    ///获取ztree所有子节点
    ///</summary>
    ///<param name="dept">选择的部门</param>
    ///<param name="deptList">树的所有节点</param>
    ///<return>返回选择部门的节点集合</return>
    GetTreeListSorted: function (dept, deptList) {
        var listSorted = [];
        DepartmentIndex.GetParentNode($(dept).attr('ParentDeptNo'), deptList, listSorted);
        DepartmentIndex.GetChildNode($(dept).attr('DeptNo'), deptList, listSorted);
        return listSorted;
    },
    ///<summary>
    ///获取ztree所有子节点
    ///</summary>
    ///<param name="area">选择的片区</param>
    ///<param name="deptList">树的所有节点</param>
    ///<return>返回选择部门的节点集合</return>
    GetAreaTreeListSorted: function (area, areaList) {
        var listSorted = [];
        DepartmentIndex.GetAreaParentNode($(area).attr('ParentID'), areaList, listSorted);
        DepartmentIndex.GetAreaChildNode($(area).attr('ID'), areaList, listSorted);
        return listSorted;
    },
    ///<summary>
    ///treetable控件点击事件
    ///</summary>
    ///<param name="element">当前对象</param>
    ///<param name="typeId">数据类型Id</param>
    ///<param name="typeCode">数据类型Code</param>
    ///<return></return>
    SetCurrentNodeCheckBox: function (element, typeId, typeCode) {
        var isChecked = false;
        //完全选中状态
        if ($(element).hasClass('checkbox_true_full')) {
            $(element).removeClass("checkbox_true_full");
            $(element).addClass("checkbox_false_full");
        }
            //部分选中状态
        else if ($(element).hasClass('checkbox_true_part')) {
            $(element).removeClass("checkbox_true_part");
            $(element).addClass("checkbox_false_full");
        }
            //完全未选中状态
        else if ($(element).hasClass('checkbox_false_full')) {
            $(element).removeClass("checkbox_false_full");
            $(element).addClass("checkbox_true_full");
            isChecked = true;
        }
            //部分未选中状态
        else if ($(element).hasClass('checkbox_false_part')) {
            $(element).removeClass("checkbox_false_part");
            $(element).addClass("checkbox_true_full");
            isChecked = true;
        }
        var id = $(element).attr('data-tt-id');
        var pid = $(element).attr('data-tt-parent-id');
        DepartmentIndex.SetParentNodeCheckBox(pid, typeId, typeCode, isChecked);
        DepartmentIndex.SetSonNodeCheckBox(id, typeId, typeCode, isChecked);
    },
    ///<summary>
    ///设置父类节点状态
    ///</summary>
    ///<param name="parentId">父类id</param>
    ///<param name="typeId">数据类型Id</param>
    ///<param name="typeCode">数据类型Code</param>
    ///<param name="isChecked">点击状态</param>
    ///<return></return>
    SetParentNodeCheckBox: function (parentId, typeId, typeCode, isChecked) {
        var parentObj = $('span.button.chk[data-tt-id="' + parentId + '"][' + typeId + '="' + typeCode + '"]');
        if (!!parentObj && parentObj.length > 0) {
            //完全未选中状态
            if (isChecked && parentObj.hasClass('checkbox_false_full')) {
                $(parentObj).removeClass("checkbox_false_full");
                $(parentObj).addClass("checkbox_false_part");
            }
                //部分选中状态
            else if (isChecked && parentObj.hasClass('checkbox_true_part')) {
                var sonCheckedType = DepartmentIndex.SonCheckedType(parentId, typeId, typeCode, isChecked);
                if (sonCheckedType) {
                    $(parentObj).removeClass("checkbox_true_part");
                    $(parentObj).addClass("checkbox_true_full");
                }
            }
                //部分未选中状态
            else if (!isChecked && parentObj.hasClass('checkbox_false_part')) {
                var sonCheckedType = DepartmentIndex.SonCheckedType(parentId, typeId, typeCode, isChecked);
                if (sonCheckedType) {
                    $(parentObj).removeClass("checkbox_false_part");
                    $(parentObj).addClass("checkbox_false_full");
                }
            }
                //完全选中状态
            else if (!isChecked && parentObj.hasClass('checkbox_true_full')) {
                $(parentObj).removeClass("checkbox_true_full");
                $(parentObj).addClass("checkbox_true_part");
            }
            var pid = parentObj.attr('data-tt-parent-id');
            DepartmentIndex.SetParentNodeCheckBox(pid, typeId, typeCode, isChecked);
        }
    },
    ///<summary>
    ///判断当前节点子节点状态
    ///</summary>
    ///<param name="currentId">当前节点id</param>
    ///<param name="typeId">数据类型Id</param>
    ///<param name="typeCode">数据类型Code</param>
    ///<param name="isChecked">点击状态</param>
    ///<return></return>
    SonCheckedType: function (currentId, typeId, typeCode, isChecked) {
        var result = true;
        var sonObj = $('span.button.chk[data-tt-parent-id="' + currentId + '"][' + typeId + '="' + typeCode + '"]');
        if (!!sonObj && sonObj.length > 0) {
            if (isChecked) {
                layui.each(sonObj, function () {
                    if (!$(this).hasClass('checkbox_true_full') && !$(this).hasClass('checkbox_true_part')) {
                        //存在被勾选的子节点
                        result = false;
                        return true;//跳出循环
                    } else if (result) {
                        result = DepartmentIndex.SonCheckedType($(this).attr('data-tt-id'), typeId, typeCode, isChecked);
                    }
                });
            } else {
                layui.each(sonObj, function () {
                    if (!$(this).hasClass('checkbox_false_full') && !$(this).hasClass('checkbox_false_part')) {
                        //存在未选中的子节点
                        result = false;
                        return true;//跳出循环
                    } else if (result) {
                        result = DepartmentIndex.SonCheckedType($(this).attr('data-tt-id'), typeId, typeCode, isChecked);
                    }
                });
            }
        }
        return result;
    },
    ///<summary>
    ///设置子类节点状态
    ///</summary>
    ///<param name="currentId">当前节点id</param>
    ///<param name="typeId">数据类型Id</param>
    ///<param name="typeCode">数据类型Code</param>
    ///<param name="isChecked">点击状态</param>
    ///<return></return>
    SetSonNodeCheckBox: function (currentId, typeId, typeCode, isChecked) {
        var sonObj = $('span.button.chk[data-tt-parent-id="' + currentId + '"][' + typeId + '="' + typeCode + '"]');
        if (!!sonObj && sonObj.length > 0) {
            layui.each(sonObj, function () {
                //完全选中状态
                if (!isChecked && $(this).hasClass('checkbox_true_full')) {
                    $(this).removeClass("checkbox_true_full");
                    $(this).addClass("checkbox_false_full");
                }
                    //部分选中状态
                else if (!isChecked && sonObj.hasClass('checkbox_true_part')) {
                    $(this).removeClass("checkbox_true_part");
                    $(this).addClass("checkbox_false_full");
                }
                    //完全未选中状态
                else if (isChecked && $(this).hasClass('checkbox_false_full')) {
                    $(this).removeClass("checkbox_false_full");
                    $(this).addClass("checkbox_true_full");
                }
                    //部分未选中状态
                else if (isChecked && sonObj.hasClass('checkbox_false_part')) {
                    $(this).removeClass("checkbox_false_part");
                    $(this).addClass("checkbox_true_full");
                }
                var id = $(this).attr('data-tt-id');
                DepartmentIndex.SetSonNodeCheckBox(id, typeId, typeCode, isChecked);
            });
        }
    },
    ///<summary>
    ///初始化treetable状态
    ///</summary>
    ///<param name="arrObj">span数组</param>
    ///<param name="typeId">数据类型Id</param>
    ///<param name="typeCode">数据类型Code</param>
    ///<return></return>
    InitTreeTalbeNodeCheckBox: function (arrObj, typeId, typeCode) {
        layui.each(arrObj, function () {
            var sonCheckedType = DepartmentIndex.InitSonCheckedType($(this), typeId, typeCode);
            //存在被勾选的子节点
            if (sonCheckedType && $(this).hasClass('checkbox_false_full')) {
                $(this).removeClass("checkbox_false_full");
                $(this).addClass("checkbox_false_part");
            }
                //存在未勾选的子节点
            else if (sonCheckedType && $(this).hasClass('checkbox_true_full')) {
                $(this).removeClass("checkbox_true_full");
                $(this).addClass("checkbox_true_part");
            }
        });
    },
    ///<summary>
    ///初始化treetable状态
    ///</summary>
    ///<param name="currentObj">当前节点对象</param>
    ///<param name="typeId">数据类型Id</param>
    ///<param name="typeCode">数据类型Code</param>
    ///<return></return>
    InitSonCheckedType: function (currentObj, typeId, typeCode) {
        var result = false;
        var currentId = $(currentObj).attr('data-tt-id');
        var sonObj = $('span.button.chk[data-tt-parent-id="' + currentId + '"][' + typeId + '="' + typeCode + '"]');
        if (!!sonObj && sonObj.length > 0) {
            if ($(currentObj).hasClass('checkbox_true_full')) {
                layui.each(sonObj, function () {
                    if (!$(this).hasClass('checkbox_true_full') && !$(this).hasClass('checkbox_true_part')) {
                        //存在被勾选的子节点
                        result = true;
                        return true;//跳出循环
                    } else if (!result) {
                        result = DepartmentIndex.InitSonCheckedType($(this), typeId, typeCode);
                    }
                });
            }
            else if ($(currentObj).hasClass('checkbox_false_full')) {
                layui.each(sonObj, function () {
                    if (!$(this).hasClass('checkbox_false_full') && !$(this).hasClass('checkbox_false_part')) {
                        //存在未勾选的子节点
                        result = true;
                        return true;//跳出循环
                    } else if (!result) {
                        result = DepartmentIndex.InitSonCheckedType($(this), typeId, typeCode);
                    }
                });
            }
        }
        return result;
    },
    SetTreeTableCheckboxStatus: function () {
        layui.each(DepartmentIndex.CacheDepartment, function (index, item) {
            if (DepartmentIndex.UplusCanSeeSelectedNodes.FySel.indexOf(item.DepartOnlyCode) >= 0) {
                item.FySelTreeClass = 'checkbox_true_full';
            } else {
                item.FySelTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusCanSeeSelectedNodes.CustSel.indexOf(item.DepartOnlyCode) >= 0) {
                item.CustSelTreeClass = 'checkbox_true_full';
            } else {
                item.CustSelTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusCanSeeSelectedNodes.PublicOwner.indexOf(item.DepartOnlyCode) >= 0) {
                item.PublicOwnerTreeClass = 'checkbox_true_full';
            } else {
                item.PublicOwnerTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusCanSeeSelectedNodes.PrivateOwner.indexOf(item.DepartOnlyCode) >= 0) {
                item.PrivateOwnerTreeClass = 'checkbox_true_full';
            } else {
                item.PrivateOwnerTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusCanSeeSelectedNodes.CommonOwner.indexOf(item.DepartOnlyCode) >= 0) {
                item.CommonOwnerTreeClass = 'checkbox_true_full';
            } else {
                item.CommonOwnerTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusCanSeeSelectedNodes.FyFellow.indexOf(item.DepartOnlyCode) >= 0) {
                item.FyFellowTreeClass = 'checkbox_true_full';
            } else {
                item.FyFellowTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusCanSeeSelectedNodes.CustFellow.indexOf(item.DepartOnlyCode) >= 0) {
                item.CustFellowTreeClass = 'checkbox_true_full';
            } else {
                item.CustFellowTreeClass = 'checkbox_false_full';
            }
        });
        layui.each(DepartmentIndex.CacheDepartment, function (index, item) {
            DepartmentIndex.SetTreeTableCheckboxStatusByType(item, 'FySelTreeClass');
            DepartmentIndex.SetTreeTableCheckboxStatusByType(item, 'CustSelTreeClass');
            DepartmentIndex.SetTreeTableCheckboxStatusByType(item, 'PublicOwnerTreeClass');
            DepartmentIndex.SetTreeTableCheckboxStatusByType(item, 'PrivateOwnerTreeClass');
            DepartmentIndex.SetTreeTableCheckboxStatusByType(item, 'CommonOwnerTreeClass');
            DepartmentIndex.SetTreeTableCheckboxStatusByType(item, 'FyFellowTreeClass');
            DepartmentIndex.SetTreeTableCheckboxStatusByType(item, 'CustFellowTreeClass');
        });
    },
    SetTreeTableCheckboxStatusByType: function (dept, type) {
        var result = false;
        var sonDept = [];
        layui.each(DepartmentIndex.CacheDepartment, function (index, item) {
            if (item.ParentDeptNo == dept.DeptNo) {
                sonDept.push(item);
            }
        });
        if (sonDept.length > 0) {
            if (dept[type] == 'checkbox_true_full') {
                layui.each(sonDept, function (index, item) {
                    if (item[type] == 'checkbox_false_full') {
                        dept[type] = 'checkbox_true_part';
                        result = true;
                        return true;
                    } else if (!result) {
                        result = DepartmentIndex.SetTreeTableCheckboxStatusByType(item, type);
                    } else if (result) {
                        dept[type] = 'checkbox_true_part';
                        return true;
                    }

                });
            } else if (dept[type] == 'checkbox_false_full') {
                layui.each(sonDept, function (index, item) {
                    if (item[type] == 'checkbox_true_full') {
                        dept[type] = 'checkbox_false_part';
                        result = true;
                        return true;
                    } else if (!result) {
                        result = DepartmentIndex.SetTreeTableCheckboxStatusByType(item, type);
                    } else if (result) {
                        dept[type] = 'checkbox_false_part';
                        return true;
                    }
                });
            }
        }
        return result;
    },
    SetTreeTableAreaCheckboxStatus: function () {
        layui.each(DepartmentIndex.CacheArea, function (index, item) {
            if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FySel.indexOf(item.DataCode) >= 0) {
                item.FySelTreeClass = 'checkbox_true_full';
            } else {
                item.FySelTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyModify.indexOf(item.DataCode) >= 0) {
                item.FyModifyTreeClass = 'checkbox_true_full';
            } else {
                item.FyModifyTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.CustSel.indexOf(item.DataCode) >= 0) {
                item.CustSelTreeClass = 'checkbox_true_full';
            } else {
                item.CustSelTreeClass = 'checkbox_false_full';
            }
            if (DepartmentIndex.UplusAreaCanSeeSelectedNodes.FyInfo.indexOf(item.DataCode) >= 0) {
                item.FyInfoTreeClass = 'checkbox_true_full';
            } else {
                item.FyInfoTreeClass = 'checkbox_false_full';
            }
        });
        layui.each(DepartmentIndex.CacheArea, function (index, item) {
            DepartmentIndex.SetTreeTableAreaCheckboxStatusByType(item, 'FySelTreeClass');
            DepartmentIndex.SetTreeTableAreaCheckboxStatusByType(item, 'FyModifyTreeClass');
            DepartmentIndex.SetTreeTableAreaCheckboxStatusByType(item, 'CustSelTreeClass');
            DepartmentIndex.SetTreeTableAreaCheckboxStatusByType(item, 'FyInfoTreeClass');
        });
    },
    SetTreeTableAreaCheckboxStatusByType: function (area, type) {
        var result = false;
        var sonArea = [];
        layui.each(DepartmentIndex.CacheArea, function (index, item) {
            if (item.ParentID == area.ID) {
                sonArea.push(item);
            }
        });
        if (sonArea.length > 0) {
            if (area[type] == 'checkbox_true_full') {
                layui.each(sonArea, function (index, item) {
                    if (item[type] == 'checkbox_false_full') {
                        area[type] = 'checkbox_true_part';
                        result = true;
                        return true;
                    } else if (!result) {
                        result = DepartmentIndex.SetTreeTableAreaCheckboxStatusByType(item, type);
                    } else if (result) {
                        area[type] = 'checkbox_true_part';
                        return true;
                    }

                });
            } else if (area[type] == 'checkbox_false_full') {
                layui.each(sonArea, function (index, item) {
                    if (item[type] == 'checkbox_true_full') {
                        area[type] = 'checkbox_false_part';
                        result = true;
                        return true;
                    } else if (!result) {
                        result = DepartmentIndex.SetTreeTableAreaCheckboxStatusByType(item, type);
                    } else if (result) {
                        area[type] = 'checkbox_false_part';
                        return true;
                    }
                });
            }
        }
        return result;
    },
    //FySelCanSeeSelectedNodes: [],//查看房源我能看的部门树选中节点
    //FySelBeSeenSelectedNodes: [],//查看房源能看我的部门树选中节点
    //CustSelCanSeeSelectedNodes: [],//查看客源我能看的部门树选中节点
    //CustSelBeSeenSelectedNodes: [],//查看客源能看我的部门树选中节点
    //PublicOwnerCanSeeSelectedNodes: [],//公盘看业主我能看的部门树选中节点
    //PublicOwnerBeSeenSelectedNodes: [],//公盘看业主能看我的部门树选中节点
    //PrivateOwnerCanSeeSelectedNodes: [],//私盘看业主我能看的部门树选中节点
    //PrivateOwnerBeSeenSelectedNodes: [],//私盘看业主能看我的部门树选中节点
    //CommonOwnerCanSeeSelectedNodes: [],//公共池房源看业主我能看的部门树选中节点
    //CommonOwnerBeSeenSelectedNodes: [],//公共池房源看业主能看我的部门树选中节点
    //FyFellowCanSeeSelectedNodes: [],//房源看跟进我能看的部门树选中节点
    //FyFellowBeSeenSelectedNodes: [],//房源看跟进能看我的部门树选中节点
    //CustFellowCanSeeSelectedNodes: [],//客源看跟进我能看的部门树选中节点
    //CustFellowBeSeenSelectedNodes: [],//客源看跟进能看我的部门树选中节点
    //AreaFySelCanSeeSelectedNodes: [],//片区查看房源我能看的部门树选中节点
    //AreaFySelBeSeenSelectedNodes: [],//片区查看房源能看我的部门树选中节点
    //AreaFyModifyCanSeeSelectedNodes: [],//片区维护房源我能看的部门树选中节点
    //AreaFyModifyBeSeenSelectedNodes: [],//片区维护房源能看我的部门树选中节点
    //AreaCustSelCanSeeSelectedNodes: [],//片区查看客源我能看的部门树选中节点
    //AreaCustSelBeSeenSelectedNodes: [],//片区查看客源能看我的部门树选中节点
    //AreaFyInfoCanSeeSelectedNodes: [],//片区资料房源我能看的部门树选中节点
    //AreaFyInfoBeSeenSelectedNodes: [],//片区资料房源能看我的部门树选中节点
}

$(function () {
    DepartmentIndex.Init();
});


var CopyDeptToEmp = {
    DepartOnlyCodeSelected: window.parent.DepartmentIndex.DepartOnlyCodeSelected,//主门店树获取选中部门DepartOnlyCode
    DeptCitySelected: window.parent.DepartmentIndex.DeptCitySelected,//获取主要门店选择的城市City
    Init: function () {//初始化
        $('table.layui-table thead tr th:eq(1)').addClass('layui-hide');
        layui.use(['table'], function () {
            table = layui.table;
            table.render();
            var param = {};
            param.DepartOnlyCode = CopyDeptToEmp.DepartOnlyCodeSelected;
            PublicComm.Ajax("POST", "/Authority/Employee/GetDeptEmpByDepartOnlyCode", param, true, function (result) {
                table.render({
                    id: 'Deptdemo',
                    elem: '#Deptdemo',
                    height: '400px',
                    cellMinWidth: 80,//全局定义常规单元格的最小宽度，layui 2.2.1 新增
                    cols: [
                        [//列表展示栏位
                            { type: 'checkbox', fixed: 'left' },
                            //{ field: 'EmpCode', title: '', width: 190, style: 'display:none;' },
                            { field: 'DeptName', title: '门店名称', width: '30%' },
                            { field: 'EmpName', title: '员工姓名', width: '25%' },
                            { field: 'EmpNo', title: '员工编号', width: '20%' },
                            { field: 'PositionName', title: '员工职务', width: '25%' },
                        ]
                    ],
                    data: result.Data,
                    limit: 10000, //显示的数量
                    page: false, //是否显示分页
                });
            });
        });
    },
    SaveEmpDeptTable: function () {
        var param = {};
        var EmpCodeList = [];
        var checkStatusList = layui.table.checkStatus('Deptdemo').data;
        for (var i = 0; i < checkStatusList.length; i++) {
            //console.log(checkStatusList[i].EmpCode);
            //empList = checkStatusList[i].EmpCode;
            //param.EmpCodeList = empList;
            EmpCodeList.push(checkStatusList[i].EmpCode);
        }
        param.EmpCodeList = EmpCodeList
        param.DepartOnlyCode = CopyDeptToEmp.DepartOnlyCodeSelected;
        param.CityID = CopyDeptToEmp.DeptCitySelected;
        PublicComm.Ajax("POST", "/Authority/Privilege/CopyDeptToEmp", param, true, function (result) {
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

    CopyDeptToEmp.Init();//加载初始化

})


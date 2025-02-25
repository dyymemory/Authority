﻿var SystemIndex = {
	json: {},
	Init: function () {
		PrivComm.Init();
		var user = CacheHelper.GetUser();
		layui.use(['form', 'table'], function () {
			var form = layui.form,
				table = layui.table;
			form.render();
			ControlComm.CityBinding($('#City'), form, user.CityID);
			ControlComm.DepartmentBinding($('#Department'), form, user.CityID);
			ControlComm.PositionBinding($('#Position'), form, user.CityID);
			form.on('select(City)', function (result) {
				var CityID = $("#City").find("option:selected").attr("value");
				if (!!CityID) {
					ControlComm.DepartmentBinding($('#Department'), form, CityID);
					ControlComm.PositionBinding($('#Position'), form, CityID);
				}
			})
			form.on('select(Department)', function (data) {
				ControlComm.EmployeeBinding($('#Employee'), form, { 'DeptID': $(data.elem).find("option:selected").val() });
			});
			$('#Search').on('click', function () {
				var limitSize = $("#page option:selected").val();
				SystemIndex.Search(PublicComm.PageIndex, !limitSize ? PublicComm.PageSize : limitSize);
			});

			//监听行工具事件
			table.on('tool(editTableData)', function (obj) {
				var data = obj.data;//当前选中数据
				SystemIndex.json = data;
				var index = $(".layui-table-hover").attr("data-index");//当前选中数据的numbers值
				var table = layui.table;//整个列表的值
				if (obj.event === 'editcity') {
					layer.open({
						type: 2,
						title: '',
						area: ['53%', '80%'], //宽高
						content: 'system/system_form.html',
						scrollbar: true,//禁用滚动条
						btnAlign: 'd'
					});
				}
				else if (obj.event === 'editemployee') {
					layer.open({
						type: 2,
						title: '',
						area: ['53%', '80%'], //宽高
						content: 'system/system_form.html#set',
						scrollbar: true,//禁用滚动条
						btnAlign: 'd'
					});
				}
				else if (obj.event === 'view') {
					layer.open({
						type: 2,
						title: '',
						area: ['53%', '80%'], //宽高
						content: 'system/system_form.html#view',
						scrollbar: true,//禁用滚动条
						btnAlign: 'd'
					});
				}
			});
		});
	},
	Search: function (pageIndex, pageSize) {
		var urlParam = '?PageIndex=' + pageIndex + '&PageSize=' + pageSize;
		var param = {};
		param.PlatForm = 3;
		var cityID = $('#City').val();
		if (!!cityID && cityID != "") {
			param.CityID = cityID;
		}
		var deptID = $('#Department').val();
		if (!!deptID && deptID != "") {
			param.DeptID = deptID;
		}
		var empCode = $('#Employee').val();
		if (!!empCode && empCode != "") {
			param.EmpCode = empCode;
		}
		var positionID = $('#Position').val();
		if (!!positionID && positionID != "") {
			param.PositionID = positionID;
		}
		var IsAnyAuthority = $('#IsAnyAuthority').val();
		if (!!IsAnyAuthority && IsAnyAuthority != "") {
			param.IsAnyAuthority = IsAnyAuthority;
		}
		layui.use(['table', 'laypage'], function () {
			var str = "";
			if (PrivComm.CheckAuthority('priv-xt-authority-set')) {
				str += '<a class="layui-btn layui-btn-xs" lay-event="editemployee">权限设置</a>';
			}
			if (PrivComm.CheckAuthority('priv-xt-authority-view')) {				
				str += '<a class="layui-btn layui-btn-xs" lay-event="view" > 查看</a >';
			}
			$('#barOperation').html(str);
			var table = layui.table,
				laypage = layui.laypage;
			PublicComm.Ajax("POST", "/Authority/Employee/GetEmployeeListForTalbe" + urlParam, param, true, function (result) {
				table.render({
					elem: '#gridTalbe',
					limit: pageSize,
					height: '429px',
					cols: [
						[//标题栏
							{ field: 'CityName', title: '城市', align: 'center', minWidth: 115 ,width:'10%'},
							{ field: 'EmpNo', title: '编号', align: 'center', minWidth: 170, width: '15%'},
							{ field: 'DeptName', title: '门店', align: 'center', minWidth: 170, width: '15%'},
							{ field: 'EmpName', title: '员工姓名', align: 'center', minWidth: 135, width: '10%'},
							{ field: 'PositionName', title: '职务名称', align: 'center', minWidth: 170, width: '13%'},
							{ field: 'Mobile', title: '手机', align: 'center', minWidth: 170, width: '15%'},
							{ title: '操作', toolbar: '#barOperation', align: 'center', minWidth: 245, width: '20%'},
						]
					],
					data: result.Data,
					page: false, //是否显示分页
					done: function (res) {
						//如果是异步请求数据方式，res即为你接口返回的信息。  
						//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度 

						laypage.render({
							elem: 'page',
							count: result.PM.TotalCount,
							curr: pageIndex,
							limit: pageSize,
							limits: [10, 20, 30, 40, 50],
							layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
							jump: function (obj, first) {
								if (!first) {
									SystemIndex.Search(obj.curr, obj.limit);
								}
							}
						});
					}
				});
			});
		});
	},
}
$(function () {
	SystemIndex.Init();
});
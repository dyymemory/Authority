﻿var PositionIndex = {
    SelectedData: {},
    //初始化
    Init: function () {
        PrivComm.Init();
        var user = CacheHelper.GetUser();
        layui.use(['form', 'table'], function () {
            var form = layui.form,
                table = layui.table;
            form.render();//执行此方法，下拉框才会出现（部分表单元素才会修饰成功）
            ControlComm.CityBinding($("#City"), form, user.CityID);//所在城市绑定  
            ControlComm.PositionBinding($('#Position'), form, user.CityID);
            form.on('select(City)', function (result) {
                var CityID = $("#City").find("option:selected").attr("value");
                if (!!CityID) {
                    ControlComm.PositionBinding($('#Position'), form, CityID);
                }
            });
            //通过权限控制按钮
            var strBtn1 = "";
            var strBtn2 = "";
            if (PrivComm.CheckAuthority('priv-posauth-query')) {
                strBtn1 += '<a href="javascript:;" id="Search" lay-filter="Search" class="layui-btn">查询</a>';
            }
            strBtn1 += '<button type = "reset" class="layui-btn layui-btn-primary" > 重置</button >';
            $('#PosiSerch').append(strBtn1);
            $('#Search').on('click', function () {//查询操作
                var limitSize = $("#page option:selected").val();
                PositionIndex.Search(PublicComm.PageIndex, !limitSize ? PublicComm.PageSize : limitSize);
            });
            if (PrivComm.CheckAuthority('priv-posauth-view')) {
                strBtn2 += '<a class="layui-btn layui-btn-xs" lay-event="view">查看</a>';
                //$('#Operationfield').append(strBtn2);
                document.getElementById('Operationfield').innerHTML = strBtn2;
            }

            //监听行工具事件
            table.on('tool(PositionTableDate)', function (obj) {
                var data = obj.data;//当前选中数据
                PositionIndex.SelectedData = data;
                var index = $(".layui-table-hover").attr("data-index");//当前选中数据的numbers值
                var table = layui.table;//整个列表的值
                if (obj.event === 'view') {
                    layer.open({
                        type: 2,
                        title: '',
                        //title: ["职务权限", "font-size:22px;color:black"],
                        area: ['53%', '80%'], //宽高
                        content: 'position/position_form.html',
                        scrollbar: false,//禁用滚动条
                        btnAlign: 'd',

                    });
                }
            });

        });
    },

    Search: function (pageIndex, pageSize) {//查询
        var urlParam = '?PageIndex=' + pageIndex + '&PageSize=' + pageSize;
        var param = {};
        var cityID = $('#City').val();//所在城市
        if (!!cityID && cityID != "") {
            param.CityID = cityID;
        }
        var positionID = $('#Position').val();//所任职务
        if (!!positionID && positionID != "") {
            param.PositionID = positionID;
        }
        layui.use(['table', 'laypage'], function () {
            var table = layui.table,
                laypage = layui.laypage;
            PublicComm.Ajax("POST", "/Authority/Position/GetAllPositionList" + urlParam, param, true, function (result) {
                table.render({
                    elem: '#GridTalbePosition',
                    limit: pageSize,
                    height: '429px',
                    cols: [
                        [//列表展示栏位
                            { field: 'CityName', title: '城市', align: 'center', minWidth: 135, width: '25%' },
                            { field: 'PositionName', title: '职务名称', align: 'center', minWidth: 145, width: '25%' },
                            { field: 'PositionRoleName', title: '职务角色', align: 'center', minWidth: 135, width: '25%' },
                            { title: '操作', toolbar: '#Operationfield', align: 'center', minWidth: 120, width: '23.5%' },
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
                                    PositionIndex.Search(obj.curr, obj.limit);
                                }
                            }
                        });
                    }
                });
            });
        });
    },
};

//加载
$(function () {
    PositionIndex.Init();
});
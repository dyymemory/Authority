﻿var PositionForm = {
    PlatFormSelect: 1,
    CityID: 1,
    Position: window.parent.PositionIndex.SelectedData,//获取页面选中数据的Data
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
    },

    LoadPrivModule: function (form) {
        $('#DataPermissions input:radio').prop('checked', false);
        var param = {};
        param.PositionCode = PositionForm.Position.PositionCode;
        param.PlatForm = 1;//默认平台为U+
        PublicComm.Ajax("POST", "/Authority/Privilege/GetPrivModuleByPosition", param, true, function (result) {
            console.log(result);
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
            // console.log(modulePrivList);
            console.log(modulePrivList);
        });
          
    },
};
$(function () {
    PositionForm.Init();
})
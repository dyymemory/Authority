﻿/*JS 公用方法*/
var PublicComm = {
    PageIndex: 1,//当前页
    PageSize: 10,//默认显示页数
    ForWord: "",//
    Ajax: function (Type, URL, Data, Async, CallBack, Args, ERPVersion) {
        ///<summary>
        ///Ajax请求
        ///</summary>
        ///<param name="Type">请求类型GET，POST</param>
        ///<param name="URL">路由地址</param>
        ///<param name="Data">请求参数;格式{'param':'value'}</param>
        ///<param name="Async">同步 异步请求 默认 True</param>
        ///<param name="CallBack">回调函数</param>
        ///<param name="Args">带参</param>
        ///<param name="ERPVersion">ERP版本信息 V1</param>
        ///<return></return>
        if (!ERPVersion) {
            ERPVersion = "V1";
        }
        $.ajax({
            type: Type,
            url: URL,
            data: Data,
            async: Async,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("ERPVersion", ERPVersion);
            },
            success: function (data) {
                if (CallBack != null) {
                    CallBack(data, Args);
                }
            }, error: function (data) {
                if (!!data.responseJSON && !!data.responseJSON.Code && data.responseJSON.Code == 4001) {
                    window.location.href = "/pages/login.html#4001";
                }
                else {
                    if (CallBack != null) {
                        CallBack(undefined, Args);
                    }
                    layer.alert(JSON.stringify(data));
                }
            }
        });
    },
    Page: function (pageIndex, pageType, PageInstance, CallBack) {
        ///<summary>
        ///JS分页功能
        ///</summary>
        ///<param name ="pageIndex">当前页索引</param>
        ///<param name ="pageType">页类型 上一页 ，下一页</param>
        ///<param name ="PageInstance">当前事件的实例对象[获取页面索引]</param>
        ///<param name ="CallBack">控件类型 区别Ajax请对象</param>
        ///<return></return>
        var pageForword = "";
        switch (pageType) {
            case "previous":
                pageIndex = parseInt($(PageInstance).parent().parent().find("a[class='am-active']").text());
                if (pageIndex >= 2) {
                    pageIndex -= 1;
                }
                break;
            case "nextPage":
                pageIndex = parseInt($(PageInstance).parent().parent().find("a[class='am-active']").text());
                var pageCount = parseInt($(PageInstance).parent().parent().find("li:last a").text());
                if (pageIndex < pageCount) {
                    pageIndex += 1;
                }
                break;
            case "first":
                break;
            case "end":
                break;
            default:
                if (parseInt($(PageInstance).parent().parent().find("a[class='am-active']").text()) >= pageIndex) {
                    pageForword = "forword";
                }
                break;
        }
        if (isNaN(pageIndex)) {
            pageIndex = 1;//当页索引为非数字 默认第一页数据
        }
        if (CallBack) {
            eval(CallBack)({ "pageIndex": pageIndex, "pageForword": pageForword, "query": true });
        }
    },
    Suceess: function (arg) {
        ///<summary>
        ///成功提示
        ///</summary>
        layer.msg(arg.Message, {
            icon: 1,
            time: 2000 //2s后自动关闭
        });
    },
    Failure: function (arg) {
        ///<summary>
        ///失败提示
        ///</summary>
        layer.msg(arg.Message, {
            icon: 2,
            time: 2000 //1s后自动关闭
        });
    },
    Confirm: function (param, callback, cancel_callback) {
        ///<summary>
        ///确认操作
        ///</summary>
        ///<param name="param">请求参数(格式:{"Message":"",...})</param>
        ///<param name="callback">回调函数</param>
        ///<param name="cancel_callback">取消回调函数</param>
        layer.confirm(param.Message, {
            skin: 'cancel-demo',
            title: false,
            closeBtn: 0,
            btn: ['确认', '取消'], //按钮
            yes: function (index) {
                if (callback) {
                    eval(callback)(param);
                }
                layer.close(index);
            }, btn2: function (index, layero) {
                layer.close(index);
                if (cancel_callback) {
                    eval(cancel_callback)(param);
                }
            }
        })
    },
    LoadEffects: function () {
        ///<summary>
        ///加载效果
        ///<summary>
        return layer.load(1, {
            shade: [0.1, '#666']//0.1透明度的白色背景
        });
    },
    CloseEffects: function (layerIndex) {
        ///<summary>
        ///关闭动画
        ///<summary>
        if (layerIndex)
            layer.close(layerIndex);
    },
    PartLoadEffects: function () {
        ///<summary>
        ///局部加载效果 
        ///使用方法 $(id).prepend(PublicComm.PartLoadEffects().effects)
        ///使用完成后：$(id).remove(PublicComm.PartLoadEffects().effects)
        ///<summary>
        return { 'effects': '<div class="lodingbox"><img src="/Content/assets/js/layer/skin/default/loading-2.gif" alt="等待"></div>' };
    },
    SetCookie: function (name, value, day, path) {
        ///<summary>
        ///设置Cookie信息 
        ///<summary>
        var expires = new Date();
        expires.setTime(expires.getTime() + day * 24 * 3600000);
        path = path == "" ? ";path=/" : ";path=" + path;
        _expires = (typeof day) == "string" ? "" : ";expires=" + expires.toUTCString();
        domain = ";domain=" + PublicComm.Domain;
        document.cookie = (name + "=" + value + _expires + path + domain);
    },
    GetCookie: function (name) {
        ///<summary>
        ///获取Cookie信息
        ///<summary>
        ///<param name="name">cookie参数名称</param>
        ///<return>返回cookie值</return>
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        var arr = document.cookie.match(reg);
        if (arr && arr.length >= 3) {
            return unescape(arr[2]);
        }
        else {
            return null;
        }
    },
    DelCookie: function (name, path) {
        ///<summary>
        ///删除Cookie信息
        ///<summary>
        ///<param name="name">cookie参数名称</param>
        ///<param name="path">cookie路径</param>
        ///<return>返回cookie值</return>
        var name = escape(name);
        var expires = new Date(0);
        path = path == "" ? ";path=/" : ";path=" + path;
        domain = ";domain=" + PublicComm.Domain;
        document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path + domain;
    },
    Navigation: function () {
        ///<summary>
        ///设置导航菜单
        ///<summary>
        ///<param name="url">路径</param>
        var nav = $("#menu li dl dd").find("a[href='" + window.location.pathname + "']");
        if (nav && nav.length >= 1) {
            nav = $(nav).attr("data-index");
            if (nav != "" && nav.split(",").length >= 2) {
                $("#menu li").eq(nav.split(",")[0]).addClass("layui-nav-itemed");
                $("#menu li").eq(nav.split(",")[0]).find("dl dd").eq(nav.split(",")[1]).addClass("layui-this");
            }
        }
    },
    ///<summary>
    ///关闭frame弹层
    ///<summary>
    Close: function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        if (index != undefined && index != null) {
            parent.layer.close(index); //再执行关闭  
        } else {
            layer.closeAll();
        }
    },
    ///<summary>
    ///弹出确认取消提示框
    ///<summary>
    ///<param name="CallBack">执行回调函数</param>
    ConfirmSureTip: function (obj, text, callBack) {
        layer.open({
            content: text,
            btn: ['确定', '取消'] //只是为了演示
              , yes: function () {
                  if (typeof (callBack) === "function" && callBack != undefined && callBack != null) {
                      callBack(obj);
                  }
              }
              , btn2: function () {
                  layer.closeAll();
              }

        });
    },
    Lenovo: function (option) {
        ///<summary>
        ///{"interval":500,"callback":"func","inputInstance":"#id"}
        ///interval:间隔时间 ,callback:数据请求回调函数 ,inputInstance:联想文本框对象 
        ///</summary>
        var timer = undefined;//
        $(option.inputInstance).on("input propertychange", function () {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = window.setTimeout(function () {
                if ($.trim($(option.inputInstance).val()) != '') {
                    if (option.callback) {
                        try {
                            eval(option.callback)();
                        } catch (e) {
                        }
                    }
                }
            }, option.interval);
        });
    },
    GetServeDate: function () {
        return new Date($.ajax({ async: false }).getResponseHeader("Date"));
    },
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    LayerLoad: function () {
        var index;
        layui.use('layer', function () {
            index = layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });

        });
        return index;
    },
    LayerLoadClose: function (index) {
        layui.use('layer', function () {
            if (!!index) {
                layer.close(index); //关闭加载层
            } else {
                layer.closeAll('loading');//关闭加载层
            }
        });
    },
}
/*Js系统函数扩展*/
String.prototype.Trim = function () {
    ///<summary>
    ///去除字符串前後空格
    ///</summary>
    return this.replace(/(^\s*)|(\s*$)/g, '');
}
//验证手机号
String.prototype.IsMobile = function () {
    return ((/^1[34578]\d{9}$/).test(this.Trim()));
}
Date.prototype.AddDays = function (days) {
    ///<summary>
    ///日期添加天数
    ///</summary>
    if (!days || days == "") {
        days = 0;
    }
    this.setDate(this.getDate() + parseInt(days));
    var month = this.getMonth() + 1;
    var day = this.getDate();
    return this.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
}
Date.prototype.getFormatDate = function (arg) {
    ///<summary>
    ///日期月份/天的显示，如果是1位数，则在前面加上'0'
    ///</summary>
    if (arg == undefined || arg == '') {
        return '';
    }
    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }
    return re;
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



using ERP.Authority.General;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP.Authority.API.Filter.Web
{
    public class LogAttribute : ActionFilterAttribute
    {
        G_LogOperation errorLog = new G_LogOperation();
        /// <summary>
        /// 开始请求
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            errorLog.BeginTime = DateTime.Now;
            base.OnActionExecuting(filterContext);
        }
        /// <summary>
        /// 请求结束
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            ActionLogInfo(filterContext);
            base.OnActionExecuted(filterContext);
        }
        /// <summary>
        /// 执行Action日志信息
        /// </summary>
        /// <param name="filterContext"></param>
        private void ActionLogInfo(ActionExecutedContext filterContext)
        {
            #region 日志记录
            try
            {
                //获取当前类型对象是否为JsonResult且请求失败 记录日志信息
                G_Comm.GetRouteInfo(filterContext, errorLog);
                if ((filterContext.Result).GetType() != typeof(System.Web.Mvc.EmptyResult))
                {
                    //请求参数
                    errorLog.ErrorInfo.RqUserAgent = G_Comm.RequestParam(filterContext.HttpContext.Request);
                    //错误信息
                    string errormsg = string.Empty;
                    #region JSON视图
                    if ((filterContext.Result).GetType() == typeof(System.Web.Mvc.JsonResult))
                    {
                        if (((System.Web.Mvc.JsonResult)filterContext.Result).Data != null)
                        {
                            //错误信息
                            errormsg = string.Format("{0},错误结果:{1},用户信息:{2}", G_Comm.GetLogInfo(), JsonConvert.SerializeObject(((System.Web.Mvc.JsonResult)(filterContext.Result)).Data), "");
                            if ((int)((System.Web.Mvc.JsonResult)filterContext.Result).Data.GetType().GetProperty("Code").GetValue(((System.Web.Mvc.JsonResult)filterContext.Result).Data, null) != 2000)
                            {
                                errorLog.WarnLog(new Exception(errormsg));
                            }
                            else
                            {
                                errorLog.InfoLog<string>(errormsg);
                            }
                        }
                    }
                    #endregion
                    #region 视图与部分视图
                    else if
                    ((filterContext.Result).GetType() == typeof(System.Web.Mvc.ViewResult)
                  || (filterContext.Result).GetType() == typeof(System.Web.Mvc.PartialViewResult)
                    )
                    {
                        //View 或 PartialView 错误结果
                        if (((System.Web.Mvc.ViewResultBase)filterContext.Result).Model != null)
                        {
                            System.Reflection.PropertyInfo propertyInfo = ((System.Web.Mvc.ViewResultBase)filterContext.Result).Model.GetType().GetProperty("Code");
                            if (propertyInfo != null)
                            {
                                object res = propertyInfo.GetValue(((System.Web.Mvc.ViewResultBase)filterContext.Result).Model, null);
                                if (res != null)
                                {
                                    errormsg = string.Format("{0},错误结果:{1},用户信息:{2}", G_Comm.GetLogInfo(), JsonConvert.SerializeObject(((System.Web.Mvc.ViewResultBase)filterContext.Result).Model), G_Comm.DecodeCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName));
                                    if (((int)res) != 2000)
                                    {
                                        errorLog.WarnLog(new Exception(errormsg));
                                    }
                                    else
                                    {
                                        errorLog.InfoLog<string>(errormsg);
                                    }
                                }
                            }
                        }
                    }
                    #endregion
                }
            }
            catch (Exception)
            {
            }
            #endregion
        }
    }
}
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace ERP.Authority.API.Filter.API
{
    /// <summary>
    /// 接口请求日志记录
    /// </summary>
    public class ApiLogAttribute : ActionFilterAttribute
    {
        G_LogOperation errorLog = new G_LogOperation();
        /// <summary>
        /// 开始请求
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            errorLog.BeginTime = DateTime.Now;
            base.OnActionExecuting(actionContext);
        }
        /// <summary>
        /// 请求结束
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            ActionLogInfo(actionExecutedContext);
            base.OnActionExecuted(actionExecutedContext);
        }
        /// <summary>
        /// 执行Action日志信息
        /// </summary>
        /// <param name="filterContext"></param>
        private void ActionLogInfo(HttpActionExecutedContext actionExecutedContext)
        {
            #region 日志记录
            try
            {
                //获取当前类型对象是否为JsonResult且请求失败 记录日志信息
                errorLog.ErrorInfo.PageUrl = HttpContext.Current.Request.Url.AbsolutePath;
                errorLog.ErrorInfo.RqUserAgent = G_Comm.RequestParam(actionExecutedContext.Request);
                if (actionExecutedContext.Response != null)
                {
                    var task = actionExecutedContext.Response.Content.ReadAsStringAsync();
                    if (actionExecutedContext.Response.StatusCode == System.Net.HttpStatusCode.OK &&
                      !string.IsNullOrEmpty(task.Result))
                    {
                        var result = JsonConvert.DeserializeObject<ResultModel<dynamic>>(task.Result);
                        if (result != null)
                        {
                            //错误信息
                            string errormsg = string.Format("{0},错误结果:{1},用户信息:{2}", G_Comm.GetLogInfo(), task.Result, G_Comm.DecodeCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName));
                            if (result.Code == 2000)
                            {
                                errorLog.WarnLog(new Exception(errormsg));
                            }
                            else
                            {
                                errorLog.WarnLog(new Exception(errormsg));
                            }
                        }
                    }
                }
            }
            catch (Exception)
            {
            }
            #endregion
        }
    }
}
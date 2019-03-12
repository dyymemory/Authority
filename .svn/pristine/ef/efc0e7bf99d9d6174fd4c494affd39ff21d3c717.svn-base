using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http.Filters;

namespace ERP.Authority.API.Filter.API
{
    /// <summary>
    /// WebAPI全局异常
    /// </summary>
    public class ApiExceptionAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            G_LogOperation errorLog = new G_LogOperation("", HttpContext.Current.Request.Url.AbsolutePath, G_Comm.RequestParam(actionExecutedContext.Request));
            #region 记录参数信息
            errorLog.FatalLog(string.Format("{0},错误信息:{1},Cookie信息:{2}", G_Comm.GetLogInfo(), actionExecutedContext.Exception.Message, G_Comm.DecodeCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName)));
            #endregion
            actionExecutedContext.Response = new HttpResponseMessage()
             {
                 Content = new ObjectContent<ResultModel<object>>(new ResultModel<object>()
                 {
                     Code = 5000,
                     Message = actionExecutedContext.Exception.Message
                 }, new JsonMediaTypeFormatter(), "application/json"),
                 StatusCode = System.Net.HttpStatusCode.InternalServerError
             };
            base.OnException(actionExecutedContext);
        }
    }
}
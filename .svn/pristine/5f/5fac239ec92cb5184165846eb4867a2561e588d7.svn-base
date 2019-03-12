using ERP.Authority.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Web;
using System.Web.Mvc;

namespace ERP.Authority.API.Filter.Web
{
    public class WebExceptionAttribute : HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            //如果异常未处理
            if (!filterContext.ExceptionHandled)
            {
                G_LogOperation errorLog = new G_LogOperation();
                G_Comm.GetRouteInfo(filterContext, errorLog);
                //参数信息
                errorLog.ErrorInfo.RqUserAgent = G_Comm.RequestParam(((ControllerContext)(filterContext)).HttpContext.Request);
                #region 记录参数信息
                errorLog.FatalLog(string.Format("{0},错误信息:{1},Cookie信息:{2}", G_Comm.GetLogInfo(), filterContext.Exception.Message, G_Comm.DecodeCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName)));
                #endregion
                filterContext.ExceptionHandled = true;
                return;
            }
            base.OnException(filterContext);
        }
    }
}
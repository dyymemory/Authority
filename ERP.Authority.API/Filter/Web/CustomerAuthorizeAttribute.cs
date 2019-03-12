
using ERP.Authority.Entity.Attributes;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP.Authority.API.Filter.Web
{
    /// <summary>
    /// 用户权限过滤器
    /// </summary>
    public class CustomerAuthorizeAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// 验证登录过期
        /// </summary>
        /// <param name="filterContext"></param>
        private bool ValidateLoginExpiration(ActionExecutingContext filterContext, UserInfoForCookie user)
        {
            if (filterContext.ActionDescriptor.GetCustomAttributes(typeof(AnonymousAttribute), true).FirstOrDefault() == null && filterContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(AnonymousAttribute), true).FirstOrDefault() == null)
            {
                //验证用户是否登录信息
                if (user == null)
                {
                    //日志信息
                    G_LogOperation errorLog = new G_LogOperation();
                    G_Comm.GetRouteInfo(filterContext, errorLog);
                    errorLog.ErrorInfo.RqUserAgent = G_Comm.RequestParam(filterContext.HttpContext.Request);
                    errorLog.WarnLog(new Exception(string.Format("{0},用户登录已过期", G_Comm.GetLogInfo())));
                    return true;
                }
            }
            return false;
        }
        /// <summary>
        /// 获取用户权限
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.ActionDescriptor.GetCustomAttributes(typeof(SkipValidateAttribute), true).FirstOrDefault() == null && filterContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(SkipValidateAttribute), true).FirstOrDefault() == null)
            {
                UserInfoForCookie user = G_Comm.DecodeCookieToObject<UserInfoForCookie>(G_Comm.DecodeCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName));
                #region 相关登录验证
                //登录过期 return true;
                if (ValidateLoginExpiration(filterContext, user))
                {
                    return;
                }
                #endregion
                #region 功能菜单验证
                //if (filterContext.ActionDescriptor.GetCustomAttributes(typeof(SkipMenuValidateAttribute), true).FirstOrDefault() == null)
                //{
                //    //判断是否有操作权限
                //    if (ValidateMenuAuthorize(filterContext, user))
                //    {
                //        return;
                //    }
                //}
                #endregion
            }
            base.OnActionExecuting(filterContext);
        }
    }
}
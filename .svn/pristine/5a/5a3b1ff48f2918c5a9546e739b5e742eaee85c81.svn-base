using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using ERP.Authority.Entity.Attributes;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;

namespace ERP.Authority.API.Filter.API
{
    public class ApiAuthorizeAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// 验证登录过期
        /// </summary>
        /// <param name="actionContext"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        private bool ValidateLoginExpiration(HttpActionContext actionContext, UserInfoForCookie user)
        {
            //验证用户是否登录信息
            if (actionContext.ActionDescriptor.GetCustomAttributes<AnonymousAttribute>().FirstOrDefault() == null && actionContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes<AnonymousAttribute>().FirstOrDefault() == null)
            {
                if (user == null)
                {
                    G_LogOperation errorLog = new G_LogOperation("", HttpContext.Current.Request.Url.AbsolutePath, G_Comm.RequestParam(actionContext.Request));
                    errorLog.WarnLog(new Exception(string.Format("{0},用户登录已过期", G_Comm.GetLogInfo())));
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            UserInfoForCookie user = G_Comm.DecodeCookieToObject<UserInfoForCookie>(G_Comm.DecodeCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName));
            if (ValidateLoginExpiration(actionContext, user))
            {
                actionContext.Response = new HttpResponseMessage()
                {
                    Content = new ObjectContent<ResultModel<object>>(new ResultModel<object>()
                    {
                        Code = 4001,
                        Message = "用户登录已过期"
                    }, new JsonMediaTypeFormatter(), "application/json"),
                    StatusCode = System.Net.HttpStatusCode.Unauthorized
                };
                return;
            }
            base.OnActionExecuting(actionContext);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Net.Http;
using System.Net.Http.Formatting;
using Newtonsoft.Json;
using ERP.Authority.Entity.Attributes;
using ERP.Authority.General;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.API.Filter.API
{
    /// <summary>
    /// 白名单验证
    /// </summary>
    public class WhiteListAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (WebConfigOperation.Config.AuthorityGlobal.SkipSign != 1)
            {
                if (actionContext.ActionDescriptor.GetCustomAttributes<SkipSignValidateAttribute>().FirstOrDefault() == null &&
                    actionContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes<SkipSignValidateAttribute>().FirstOrDefault() == null)
                {
                    string clientIP = G_Comm.GetIpaddress();//获取客户IP地址
                    if (!string.IsNullOrWhiteSpace(clientIP) && WebConfigOperation.Config.AuthorityGlobal.WhiteList != null)
                    {
                        //请求用户IP是否存在白名单中
                        if (WebConfigOperation.Config.AuthorityGlobal.WhiteList.Where(c => c.ToString().Equals(clientIP)).FirstOrDefault() == null)
                        {
                            G_LogOperation errorLog = new G_LogOperation("", HttpContext.Current.Request.Url.AbsolutePath, G_Comm.RequestParam(actionContext.Request));
                            var data = new ResultModel<object> { Code = 4007, Message = "服务器不在白名单中，请联系管理员" };
                            errorLog.WarnLog(new Exception(string.Format("{0},信息:{1}", G_Comm.GetLogInfo(), JsonConvert.SerializeObject(data))));
                            actionContext.Response = new HttpResponseMessage()
                            {
                                Content = new ObjectContent<ResultModel<object>>(data, new JsonMediaTypeFormatter(), "application/json"),
                                StatusCode = System.Net.HttpStatusCode.OK
                            };
                            return;
                        }
                    }
                }
            }
            base.OnActionExecuting(actionContext);
        }
    }
}
using ERP.Authority.API.Filter;
using ERP.Authority.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ERP.Authority.API
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        /// <summary>
        /// 运用程序错误
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Application_Error(Object sender, EventArgs e)
        {
            Exception lastError = Server.GetLastError();
            if (lastError != null)
            {
                G_LogOperation errorLog = new G_LogOperation();
                errorLog.ErrorInfo.Method = "Application_Error";
                //对HTTP 404做额外处理，其他错误全部当成500服务器错误
                HttpException httpError = lastError as HttpException;
                if (httpError != null)
                {
                    //获取错误代码
                    errorLog.FatalLog(string.Format("{0},状态码:{1},错误信息:{2}", G_Comm.GetLogInfo(), httpError.GetHttpCode(), httpError.Message));
                    return;
                }
                errorLog.FatalLog(string.Format("状态码:500,{0},错误信息:{1}", G_Comm.GetLogInfo(), lastError.Message));
            }
        }
    }
}
using ERP.Authority.API.Filter;
using ERP.Authority.Entity.Attributes;
using ERP.Authority.Entity.SDTMComm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP.Authority.API.Controllers.Web
{
    public class ReportController : BaseController
    {

        [AnonymousAttribute]
        public ActionResult Index()
        {
            //设置会话Cookie
            Response.Cookies.Set(G_Comm.EncryptCookie<UserInfoForCookie>(new UserInfoForCookie()));
            return View(new ResultModel<object>());
        }
    }
}

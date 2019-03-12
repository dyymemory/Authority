using ERP.Authority.API.Filter;
using ERP.Authority.API.Filter.Web;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace ERP.Authority.API.Controllers
{
    [Log(Order = 1)]
    [CustomerAuthorize]
    public class BaseController : Controller
    {
        /// <summary>
        /// 获取会话中的用户信息
        /// </summary>
        private UserInfoForCookie user;
        protected new UserInfoForCookie User
        {
            get
            {
                if (user == null)
                {
                    user = G_Comm.DecodeCookieToObject<UserInfoForCookie>(G_Comm.DecodeCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName));
                }
                return new UserInfoForCookie();
            }
            set { user = value; }
        }
    }
}

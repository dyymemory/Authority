﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using ERP.Authority.API.Filter;
using ERP.Authority.BLL;
using ERP.Authority.Entity.Attributes;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;

namespace ERP.Authority.API.Controllers.V1
{
    [Anonymous]
    public class LoginController : BaseApiController
    {
        /// <summary>
        /// 登录
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<U_User> Login([FromBody] U_User user)
        {
            UserInfoForCookie userInfoForCookie = null;
            ResultModel<U_User> msg = new U_UserBLL().UserLogin(user, ref userInfoForCookie);
            if (msg.Code == 2000)
            {
                HttpContext.Current.Response.Cookies.Set(G_Comm.EncryptCookie<UserInfoForCookie>(userInfoForCookie));
            }
            return msg;
        }

        /// <summary>
        /// 退出登录
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<U_User> Logout([FromBody] U_User user)
        {
            ResultModel<U_User> msg = new ResultModel<U_User>();
            HttpCookie authCookie = new HttpCookie(WebConfigOperation.Config.AuthorityGlobal.CookieName);
            if (authCookie != null)
            {
                authCookie.Expires = DateTime.Now.AddDays(-1);
                HttpContext.Current.Response.Cookies.Add(authCookie);
            }
            return msg;
        }
    }
}

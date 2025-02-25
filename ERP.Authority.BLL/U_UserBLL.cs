﻿using System.Linq;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;

namespace ERP.Authority.BLL
{
    public class U_UserBLL
    {
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userInfoForCookie"></param>
        /// <returns></returns>
        public ResultModel<U_User> UserLogin(U_User user, ref UserInfoForCookie userInfoForCookie)
        {
            ResultModel<U_User> msg = new ResultModel<U_User>();
            user.Pwd = EncryptOperation.MD5HashHex(user.Pwd);
            msg.Data = new U_UserDAL().UserLogin(user);
            if (msg.Data != null)
            {
                msg.Data.IsAdmin = WebConfigOperation.IsAdmin(msg.Data.Mobile);
                userInfoForCookie = new UserInfoForCookie()
                {
                    EmpCode = msg.Data.EmpCode,
                    EmpID = msg.Data.EmpID,
                    DeptID = msg.Data.DeptID,
                    PositionID = msg.Data.PositionID,
                    CityID = msg.Data.CityID,
                    Mobile = msg.Data.Mobile,
                    Name = msg.Data.EmpName
                };
            }
            else
            {
                msg.Code = 2001;
                msg.Message = "帐号或密码错误";
            }
            return msg;
        }
    }
}

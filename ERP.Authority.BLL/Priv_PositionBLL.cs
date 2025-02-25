﻿using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.BLL
{
    public class Priv_PositionBLL
    {
        public ResultModel<object> UpdatePrivToPosition(Priv_Position p_Position,UserInfoForCookie user)
        {
            p_Position.Modifier = user.EmpCode;
            p_Position.Creator = user.EmpCode;
            if (string.IsNullOrEmpty(p_Position.ModulePrivList))
            {
                p_Position.ModulePrivList = "";
            }
            var result = new Priv_PositionDAL().UpdatePrivToPosition(p_Position);
            if (result > 0)
            {
                return new ResultModel<object>() { };
            }
            else
            {
                return new ResultModel<object>() { Code = 2001, Message = "更新失败" };
            }
        }
        public ResultModel<dynamic> GetPrivModuleByPosition(Priv_Position p_Position)
        {
            return new ResultModel<dynamic>() { Data = new Priv_PositionDAL().GetPrivModuleByPosition(p_Position) };
        }
        public ResultModel<object> UpdateUplusPositionPrivilege(Priv_Position Priv,UserInfoForCookie user)
        {
            Priv.Modifier = user.EmpCode;
            Priv.Creator = user.EmpCode;
            if (string.IsNullOrEmpty(Priv.ModulePrivList))
            {
                Priv.ModulePrivList = "";
            }
            var result = new Priv_PositionDAL().UpdateUplusPositionPrivilege(Priv);
            if (result > 0)
            {
                return new ResultModel<object>() { };
            }
            else
            {
                return new ResultModel<object>() { Code = 2001, Message = "更新失败" };
            }
        }
    }
}

﻿using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.BLL
{
    public class DataDepartModulePriveBLL
    {
        public ResultModel<object> UpdateUplusEmpPrivilege(DataDepartModulePrive Priv, UserInfoForCookie user)
        {
            List<int> InsertList = new List<int>(); // 新增
            List<int> UpdateList = new List<int>(); // IsDel=0
            List<int> DeleteList = new List<int>(); // IsDel=1
            if (Priv.ModulePrivList==null)
            {
                Priv.ModulePrivList = "";
            }
            if (Priv.DataPrivJson == null)
            {
                Priv.DataPrivJson = "";
            }
            if (Priv.DepartmentPriv != null)
            {
                var AllDeptCodeList = new DataDepartModulePriveDAL().GetDeptCodeListByEmpCode(Priv);
                InsertList = Priv.DepartmentPriv.Except(AllDeptCodeList).ToList();
                UpdateList = Priv.DepartmentPriv.Intersect(AllDeptCodeList).ToList();
                DeleteList = AllDeptCodeList.Except(UpdateList).ToList();
            }
            var result = new DataDepartModulePriveDAL().UpdateUplusEmpPrivilege(Priv, ConvertToDataTable(Priv,InsertList, user),UpdateList,DeleteList,user);
            if (result > 0)
            {
                return new ResultModel<object>() { };
            }
            else
            {
                return new ResultModel<object>() { Code = 2001, Message = "更新失败" };
            }
        }
        public  DataTable ConvertToDataTable(DataDepartModulePrive Priv, List<int> InsertCodes,UserInfoForCookie user)
        {
            DataTable dt = CommonDAL.GetTableSchema();
            for (int i = 0; i < InsertCodes.Count; i++)
            {
                DataRow dr = dt.NewRow();
                dr["EmpCode"] = Priv.EmpCode;
                dr["PlatForm"] = 0;
                dr["CityID"] = Priv.CityID;
                dr["DepartOnlyCode"] = InsertCodes[i];
                dr["Creator"] = user.EmpCode;
                dr["CreateDate"] = Priv.CreateDate;
                dr["ModDate"] = Priv.ModDate;
                dr["IsDel"] = 0;
                dr["Modifier"] = user.EmpCode;
                dt.Rows.Add(dr);
            }
            return dt;
        }
    }    
}

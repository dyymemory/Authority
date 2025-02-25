﻿using Dapper;
using ERP.Authority.Entity.SDTM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.DAL
{
    public class Priv_Employee_DataDAL
    {
        /// <summary>
        /// 根据empcode cityid platform 获取部门权限
        /// </summary>
        /// <param name="priv_Employee_Data"></param>
        /// <returns></returns>
        public List<dynamic> GetDepartPrivByEmployee(Priv_Employee_Data priv_Employee_Data)
        {
            string sql = @"SELECT  DepartOnlyCode
        FROM    dbo.Priv_Employee_Data
        WHERE   EmpCode = @EmpCode
                AND CityID = @CityID
                AND PlatForm = 0
                AND IsDel = 0";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql, priv_Employee_Data).ToList();
            }
        }
    }
}

﻿using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.General;

namespace ERP.Authority.DAL
{
    public class E_DepartmentDAL
    {
        /// <summary>
        /// 获取所有部门列表并按照父子顺序排序
        /// </summary>
        /// <returns></returns>
        public List<dynamic> GetAllDepartmentList()
        {
            string sql = @"
SELECT  DeptName ,
        Header ,
        DeptNo ,
        CityID ,
        DeptID ,
        DepartOnlyCode ,
        ISNULL(Layer, 1) AS Layer ,
        CASE WHEN ISNULL(Layer, 1) > 1
             THEN SUBSTRING(DeptNo, 0, ISNULL(Layer, 1) * 2 - 1)
             ELSE ''
        END AS ParentDeptNo
FROM    dbo.E_Department D ( NOLOCK )
WHERE   D.FlagTrashed = 0
        AND D.FlagDeleted = 0
ORDER BY D.DeptNo ASC;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql).ToList();
            }
        }

        /// <summary>
        /// 根据城市获取部门列表并按照父子顺序排序
        /// </summary>
        /// <returns></returns>
        public List<dynamic> GetDepartmentListByCity(E_Department department)
        {
            string sql = @"
SELECT  DeptName ,
        Header ,
        DeptNo ,
        CityID ,
        DeptID ,
        DepartOnlyCode ,
        ISNULL(Layer, 1) AS Layer ,
        CASE WHEN ISNULL(Layer, 1) > 1
             THEN SUBSTRING(DeptNo, 0, ISNULL(Layer, 1) * 2 - 1)
             ELSE ''
        END AS ParentDeptNo
FROM    dbo.E_Department D ( NOLOCK )
WHERE   D.FlagTrashed = 0
        AND D.FlagDeleted = 0
        AND D.CityID = @CityID
ORDER BY D.DeptNo ASC;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql, new { CityID = department.CityID}).ToList();
            }
        }

        /// <summary>
        /// 根据城市、员工权限获取部门列表并按照父子顺序排序
        /// </summary>
        /// <returns></returns>
        public List<dynamic> GetDepartmentListByEmployee(E_Employee employee)
        {
            StringBuilder sql = new StringBuilder(@"
SELECT  DeptName ,
        Header ,
        DeptNo ,
        CityID ,
        DeptID ,
        DepartOnlyCode ,
        ISNULL(Layer, 1) AS Layer ,
        CASE WHEN ISNULL(Layer, 1) > 1
             THEN SUBSTRING(DeptNo, 0, ISNULL(Layer, 1) * 2 - 1)
             ELSE ''
        END AS ParentDeptNo
FROM    dbo.E_Department D ( NOLOCK )
WHERE   D.FlagTrashed = 0
        AND D.FlagDeleted = 0
        AND D.CityID = @CityID ");
            if (!WebConfigOperation.IsAdmin(employee.Mobile) && employee.PlatForm > 0)
            {
                sql.Append(@" AND EXISTS ( SELECT 1
                     FROM   dbo.Priv_Employee_Data ped ( NOLOCK )
                     WHERE  ped.DepartOnlyCode = D.DepartOnlyCode
                            AND ped.EmpCode = @EmpCode
                            AND ped.PlatForm = 0
                            AND ped.IsDel = 0 ) ");
            }
            sql.Append(" ORDER BY D.DeptNo ASC ");
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql.ToString(), employee).ToList();
            }
        }
    }
}
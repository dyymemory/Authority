﻿using Dapper;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ERP.Authority.General;

namespace ERP.Authority.DAL
{
    public class E_EmployeeDAL
    {
        /// <summary>
        /// 根据部门获取员工信息
        /// </summary>
        /// <param name="deptID"></param>
        /// <returns></returns>
        public List<E_Employee> GetEmployeeListByDeptID(string deptID)
        {
            string sql = @"
SELECT  EmpID ,
        EmpCode ,
        CityID ,
        EmpNo ,
        EmpName ,
        DeptID
FROM    dbo.E_Employee ( NOLOCK )
WHERE FlagDeleted = 0 AND FlagTrashed = 0 AND ZFStatus <> 2
AND DeptID = @DeptID;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<E_Employee>(sql, new { DeptID = deptID }).ToList();
            }
        }

        /// <summary>
        /// 根据条件查询员工相关信息
        /// </summary>
        /// <param name="emp"></param>
        /// <returns></returns>
        public List<dynamic> GetEmployeeListForTalbe(E_Employee emp, PageModel pm, UserInfoForCookie user)
        {
            StringBuilder sbSql = new StringBuilder(@"
SELECT  e.EmpID ,
        e.EmpCode ,
        e.EmpNo ,
        e.EmpName ,
        e.DeptID ,
        e.PositionID ,
        e.CityID ,
        e.Mobile ,
        d.DeptName ,
        p.PositionName ,
        p.PositionCode ,
        c.CityName
FROM    dbo.E_Employee e ( NOLOCK )
        INNER JOIN dbo.E_Department d ( NOLOCK ) ON e.DeptID = d.DeptID
        LEFT JOIN dbo.E_Position p ( NOLOCK ) ON e.PositionID = p.PositionID
        LEFT JOIN dbo.B_City c ( NOLOCK ) ON e.CityID = c.CityID
WHERE   e.FlagTrashed = 0
        AND e.FlagDeleted = 0 
        AND e.ZFStatus <> 2 ");

            var dyParamter = new DynamicParameters();
            dyParamter.Add("PageIndex", pm.PageIndex);
            dyParamter.Add("PageSize", pm.PageSize);
            if (emp != null)
            {
                if (emp.CityID > 0)
                {
                    sbSql.Append(" AND e.CityID = @CityID");
                    dyParamter.Add("CityID", emp.CityID);
                }
                if (!string.IsNullOrEmpty(emp.PositionID))
                {
                    sbSql.Append(" AND e.PositionID = @PositionID ");
                    dyParamter.Add("PositionID", emp.PositionID);
                }
                if (!string.IsNullOrEmpty(emp.DeptID))
                {
                    sbSql.Append(" AND e.DeptID = @DeptID ");
                    dyParamter.Add("DeptID", emp.DeptID);
                }
                if (emp.EmpCode > 0)
                {
                    sbSql.Append(" AND e.EmpCode = @EmpCode ");
                    dyParamter.Add("EmpCode", emp.EmpCode);
                }
                //判断该员工权限管理平台本身是否有权限
                if (emp.IsAnyAuthority == 1 && emp.PlatForm == 3)
                {
                    sbSql.Append(" AND EXISTS ( SELECT 1 FROM dbo.Priv_Employee pe ( NOLOCK ) WHERE pe.EmpCode = e.EmpCode AND pe.IsDel = 0 AND pe.PlatForm = 3 AND pe.ModulePrivList <> '' )");
                }
                //判断该员工非权限管理平台是否有权限
                else if (emp.IsAnyAuthority == 1)
                {
                    sbSql.Append(" AND EXISTS ( SELECT 1 FROM dbo.Priv_Employee pe ( NOLOCK ) WHERE pe.EmpCode = e.EmpCode AND pe.IsDel = 0 AND pe.PlatForm <> 3 AND pe.ModulePrivList <> '' )");
                }
                //判断该员工权限管理平台本身是否无权限
                else if (emp.IsAnyAuthority == 2 && emp.PlatForm == 3)
                {
                    sbSql.Append(" AND NOT EXISTS ( SELECT 1 FROM dbo.Priv_Employee pe ( NOLOCK ) WHERE pe.EmpCode = e.EmpCode AND pe.IsDel = 0 AND pe.PlatForm = 3 AND pe.ModulePrivList <> '' )");
                }
                //判断该员工非权限管理平台是否无权限
                else if (emp.IsAnyAuthority == 2)
                {
                    sbSql.Append(" AND NOT EXISTS ( SELECT 1 FROM dbo.Priv_Employee pe ( NOLOCK ) WHERE pe.EmpCode = e.EmpCode AND pe.IsDel = 0 AND pe.PlatForm <> 3 AND pe.ModulePrivList <> '' )");
                }
            }
            if (!WebConfigOperation.IsAdmin(user.Mobile))
            {
                sbSql.Append(@" AND EXISTS ( SELECT 1
                     FROM   dbo.Priv_Employee_Data ped ( NOLOCK )
                     WHERE  ped.DepartOnlyCode = d.DepartOnlyCode
                            AND ped.EmpCode = @UserCode
                            AND ped.PlatForm = 0
                            AND ped.IsDel = 0 ) ");
                dyParamter.Add("UserCode", user.EmpCode);
            }

            string querySql = string.Format("WITH query AS ({0}) ", sbSql);
            string countSql = querySql + " SELECT COUNT(*) FROM query";
            using (var conn = AdoConfig.GetDBConnection())
            {
                pm.TotalCount = conn.Query<int>(countSql, dyParamter).FirstOrDefault();
                if (pm.TotalCount > 0)
                {
                    string pageSql = querySql + " SELECT * FROM ( SELECT ROW_NUMBER() OVER(ORDER BY EmpNo ASC) AS RowNum, * FROM query ) t WHERE t.RowNum > (@PageIndex -1) * @PageSize AND t.RowNum <= @PageIndex * @PageSize";
                    return conn.Query<dynamic>(pageSql, dyParamter).ToList();
                }
                return new List<dynamic>();
            }
        }
        public List<E_Employee> GetAllEmpByPositionID(E_Employee e_Employee)
        {
            string sql = @"SELECT  e.*
        FROM    dbo.E_Employee AS e
                INNER JOIN dbo.E_Position AS p ON e.PositionID = p.PositionID
        WHERE   e.FlagTrashed = 0
                AND e.FlagDeleted = 0
                AND e.ZFStatus <> 2
                AND e.PositionID = @PositionID
                AND e.CityID=@CityID
        ORDER BY e.ZFStatus DESC";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<E_Employee>(sql, e_Employee).ToList();
            }
        }


        /// <summary>
        /// 根据DepartOnlyCode获取门店下的员工及其职位
        /// </summary>
        /// <param name="e_Department"></param>
        /// <returns></returns>
        public List<E_Employee> GetDeptEmpByDepartOnlyCode(E_Employee e_Employee)
        {
            string sql = @"SELECT  e.EmpID, e.EmpName,e.EmpNo,e.EmpCode,e.CityID,d.DeptName,p.PositionName,d.DepartOnlyCode,d.DeptID  FROM dbo.E_Employee e ( NOLOCK )
            LEFT JOIN dbo.E_Department d ( NOLOCK )
            ON d.DeptID = e.DeptID LEFT JOIN  dbo.E_Position p ( NOLOCK )
            ON p.PositionID = e.PositionID WHERE e.FlagTrashed=0 AND
            d.FlagDeleted=0 AND   e.AwayStatus<>1 AND d.DepartOnlyCode=@DepartOnlyCode";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<E_Employee>(sql, e_Employee).ToList();
            }


        }
        /// <summary>
        /// 获取当前城市下所有员工
        /// </summary>
        /// <param name="CityID"></param>
        /// <returns></returns>
        public List<int> GetAllEmpByCityID(int CityID)
        {
            string sql = @"SELECT EmpCode
                     FROM   dbo.E_Employee (NOLOCK)
                     WHERE  CityID =@CityID
                            AND FlagDeleted = 0
                            AND FlagTrashed = 0
                            AND ZFStatus <> 2";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<int>(sql, new { CityID = @CityID }).ToList();
            }
        }
        /// <summary>
        /// 获取城市权限表中有的数据
        /// </summary>
        /// <param name="CityID"></param>
        /// <param name="PlatForm"></param>
        /// <param name="Flag"></param>
        /// <returns></returns>
        public List<Priv_EmployeeCity> GetEmpCodeAndCityList(int CityID, int PlatForm, bool Flag)
        {
            StringBuilder sql = new StringBuilder(@"SELECT p.EmpCode ,
                            p.CityList,
                            p.PlatForm
                     FROM   dbo.E_Employee e
                            INNER JOIN dbo.Priv_EmployeeCity p ON e.EmpCode = p.EmpCode
                     WHERE  e.CityID = @CityID
                            AND p.PlatForm = @PlatForm");
            if (!Flag)
            {
                sql.Append(@" AND NOT EXISTS ( SELECT *
                     FROM   dbo.Func_SplitToTable(( SELECT  pec.CityList
                                                    FROM    Priv_EmployeeCity pec ( NOLOCK )
                                                    WHERE   pec.IsDel = 0
                                                            AND pec.PlatForm = @PlatForm
                                                            AND pec.EmpCode=e.EmpCode
                                                  ), ',') t
                     WHERE  e.CityID = t.value )");
            }
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<Priv_EmployeeCity>(sql.ToString(), new { CityID = @CityID, PlatForm = PlatForm }).ToList();
            }
        }
    }
}
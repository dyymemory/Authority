﻿using Dapper;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace ERP.Authority.DAL
{
    public class Priv_EmployeeDAL
    {
        public void MultiUpdatePrivToEmp(DataTable insertdataTable, List<int> updatelist, MultiList multiList, UserInfoForCookie user)
        {
            StringBuilder updateSql = new StringBuilder();
            DynamicParameters dyParameters = new DynamicParameters();
            dyParameters.Add("CityID", multiList.CityID);
            dyParameters.Add("PlatForm", multiList.PlatForm);
            dyParameters.Add("ModulePrivList", multiList.ModulePrivList);
            dyParameters.Add("DataPrivJson", multiList.DataPrivJson == null ? "{}" : multiList.DataPrivJson);
            dyParameters.Add("Modifier", user.EmpCode);
            if (updatelist.Count > 0)
            {
                updateSql.AppendFormat(
                        @"UPDATE  dbo.Priv_Employee
        SET     ModulePrivList = @ModulePrivList ,
                DataPrivJson=@DataPrivJson,
                ModDate = GETDATE()                               
        WHERE   CityID = @CityID AND PlatForm = @PlatForm AND  EXISTS ( SELECT 1
                                             FROM   Func_SplitToTable(@Updated,
                                                              ',') t
                                             WHERE  t.value = CAST(Priv_Employee.EmpCode AS NVARCHAR(20)) );");
                dyParameters.Add("Updated", string.Join(",", updatelist));
            }
            using (var conn = AdoConfig.GetDBConnection())
            {
                using (var tran = conn.BeginTransaction())
                {
                    try
                    {
                        if (updateSql.Length > 0)
                        {
                            conn.Execute(updateSql.ToString(), dyParameters, tran);
                        }
                        if (insertdataTable != null && insertdataTable.Rows.Count > 0)
                        {
                            CommonDAL.BulkCopy(conn, insertdataTable, tran);
                        }
                        tran.Commit();
                    }
#pragma warning disable CS0168 // 声明了变量“ex”，但从未使用过
                    catch (Exception ex)
#pragma warning restore CS0168 // 声明了变量“ex”，但从未使用过
                    {
                        tran.Rollback();
                    }
                }
            }
        }
        /// <summary>
        /// 通过城市、平台获取员工权限
        /// </summary>
        /// <param name="privEmployee"></param>
        /// <returns></returns>
        public Priv_Employee GetPrivEmployeeByEmployee(Priv_Employee privEmployee)
        {
            string sql = @" SELECT  *
        FROM    dbo.Priv_Employee
        WHERE   EmpCode = @EmpCode
                AND CityID = @CityID
                AND PlatForm = @PlatForm
                AND IsDel=0";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<Priv_Employee>(sql, privEmployee).FirstOrDefault();
            }
        }
        public List<int> GetDistinctEmpCode(int cityid, int platform)
        {
            string sql = @"SELECT DISTINCT
                ( EmpCode )
        FROM    dbo.Priv_Employee
        WHERE   CityID = @CityID
                AND PlatForm = @PlatForm
                AND IsDel = 0 ";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<int>(sql, new { CityID = cityid, PlatForm = platform }).ToList();
            }
        }

        /// <summary>
        /// 获取选中部门管辖权限
        /// </summary>
        /// <param name="privDepartmentData"></param>
        /// <returns></returns>
        public List<dynamic> PrivEmployeeDataDepCodeList(Priv_EmployeeDataNew priv_EmployeeDataNew)
        {
            StringBuilder sql = new StringBuilder(@"
SELECT  DepartOnlyCode ,
        CityID ,
        PlatForm ,
        PrivEmpDeptID ,
        EmpCode
FROM    dbo.Priv_Employee_data (NOLOCK)
WHERE   CityID = @CityID
        AND EXISTS ( SELECT 1
                     FROM   Func_SplitToTable(@EmpCodeList, ',') t
                     WHERE  t.value = EmpCode ) ");
            var dyParameters = new DynamicParameters();
            dyParameters.Add("CityID", priv_EmployeeDataNew.CityID);
#pragma warning disable CS0472 // 由于“int”类型的值永不等于“int?”类型的 "null"，该表达式的结果始终为“false”
            dyParameters.Add("EmpCodeList", priv_EmployeeDataNew.EmpCode == null ? "" : string.Join(",", priv_EmployeeDataNew.EmpCodeList));
#pragma warning restore CS0472 // 由于“int”类型的值永不等于“int?”类型的 "null"，该表达式的结果始终为“false”

            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql.ToString(), dyParameters).ToList();
            }
        }

        /// <summary>
        /// 复制管辖权限到员工
        /// </summary>
        /// <param name="privEmployeeData"></param>
        /// <param name="insertEmployeeData"></param>
        /// <param name="dicSelected"></param>
        /// <param name="dicCancel"></param>
        /// <param name="user"></param>
        public void CopyDeptToEmp(Priv_EmployeeDataNew priv_EmployeeDataNew, DataTable insertEmployeeData, Dictionary<int, List<int>> dicSelected, Dictionary<int, List<int>> dicCancel, UserInfoForCookie user)
        {
            StringBuilder updateSql = new StringBuilder();
            DynamicParameters dyParameters = new DynamicParameters();
            dyParameters.Add("CityID", priv_EmployeeDataNew.CityID);
            dyParameters.Add("PlatForm", 0);
            dyParameters.Add("EmpCode", priv_EmployeeDataNew.EmpCode);
            dyParameters.Add("Modifier", user.EmpCode);
            for (int i = 0; i < priv_EmployeeDataNew.EmpCodeList.Count; i++)
            {
                var item = priv_EmployeeDataNew.EmpCodeList[i];
                if (dicSelected[item].Count > 0)
                    {
                    updateSql.AppendFormat(@"UPDATE    Priv_Employee_Data
                      SET       IsDel = 0 ,
                                Modifier = @Modifier ,
                                ModDate = GETDATE()
                      WHERE     IsDel = 1
                                AND EmpCode = {0}
                                AND CityID = @CityID
                                AND PlatForm = @PlatForm
                                AND EXISTS ( SELECT 1
                                             FROM   Func_SplitToTable(@Selected{1},
                                                              ',') t
                                             WHERE  t.value = CAST(Priv_Employee_Data.DepartOnlyCode AS NVARCHAR(20)) );", item,i);
                    dyParameters.Add("Selected" + i, string.Join(",", dicSelected[item]));

                }
                    if (dicCancel[item].Count > 0)
                    {
                    updateSql.AppendFormat(
         @"UPDATE    Priv_Employee_Data
                      SET       IsDel = 1 ,
                                Modifier = @Modifier ,
                                ModDate = GETDATE()
                      WHERE     IsDel = 0
                                AND EmpCode = {0}
                                AND CityID = @CityID
                                AND PlatForm = @PlatForm
                                AND EXISTS ( SELECT 1
                                             FROM   Func_SplitToTable(@Cancel{1},
                                                              ',') t
                                             WHERE  t.value = CAST(Priv_Employee_Data.DepartOnlyCode AS NVARCHAR(20)) );", item, i);
                    dyParameters.Add("Cancel" + i, string.Join(",", dicCancel[item]));
                }
            }
            using (var conn = AdoConfig.GetDBConnection())
            {
                using (var tran = conn.BeginTransaction())
                {
                    try
                    {
                        if (updateSql.Length > 0)
                        {
                            conn.Execute(updateSql.ToString(), dyParameters, tran);
                        }
                        if (insertEmployeeData != null && insertEmployeeData.Rows.Count > 0)
                        {
                            CommonDAL.BulkCopy(conn, insertEmployeeData, tran);
                        }
                        tran.Commit();
                    }
#pragma warning disable CS0168 // 声明了变量“ex”，但从未使用过
                    catch (Exception ex)
#pragma warning restore CS0168 // 声明了变量“ex”，但从未使用过
                    {
                        tran.Rollback();
                    }
                }
            }

        }

    }
}

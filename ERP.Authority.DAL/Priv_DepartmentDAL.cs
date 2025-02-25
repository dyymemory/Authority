﻿using Dapper;
using ERP.Authority.Entity.SDTM;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.DAL
{
    public class Priv_DepartmentDAL
    {
        /// <summary>
        /// 获取门店权限
        /// </summary>
        /// <param name="privDepartmentData"></param>
        /// <param name="isContainDel"></param>
        /// <returns></returns>
        public List<dynamic> GetPrivDepartmentList(Priv_DepartmentData privDepartmentData, bool isContainDel = false)
        {
            StringBuilder sql = new StringBuilder(@"
SELECT  DepartOnlyCode ,
        CityID ,
        PlatForm ,
        TypeCode ,
        DataCode
FROM    dbo.Priv_Department (NOLOCK)
WHERE   CityID = @CityID
        AND EXISTS ( SELECT 1
                     FROM   Func_SplitToTable(@TypeCodeList, ',') t
                     WHERE  t.value = TypeCode ) ");
            var dyParameters = new DynamicParameters();
            dyParameters.Add("CityID", privDepartmentData.CityID);
            dyParameters.Add("TypeCodeList", privDepartmentData.TypeCodeList == null ? "" : string.Join(",", privDepartmentData.TypeCodeList));

            //能看我的
            if (privDepartmentData.ViewType == 2)
            {
                sql.Append(" AND DataCode = @DataCode ");
                dyParameters.Add("DataCode", privDepartmentData.DataCode);
            }
            //我能看的
            else
            {
                sql.Append(" AND DepartOnlyCode = @DepartOnlyCode ");
                dyParameters.Add("DepartOnlyCode", privDepartmentData.DepartOnlyCode);
            }
            //if (!string.IsNullOrEmpty(privDepartmentData.TypeCode))
            //{
            //    sql.Append(" AND TypeCode = @TypeCode ");
            //    dyParameters.Add("TypeCode", privDepartmentData.TypeCode);
            //}
            if (!isContainDel)
            {
                sql.Append(" AND IsDel = 0 ");
            }
            //去重
            sql.Append(" GROUP BY DepartOnlyCode ,CityID ,PlatForm ,TypeCode ,DataCode ");
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql.ToString(), dyParameters).ToList();
            }
        }
        /// <summary>
        /// 获取我能看的门店Code
        /// </summary>
        /// <param name="privDepartmentData"></param>
        /// <returns></returns>
        public List<dynamic> GetDataCodeList(Priv_DepartmentData privDepartmentData)
        {
            string sql = @"SELECT  DepartOnlyCode ,
                                        DataCode
                                FROM    dbo.Priv_Department
                                WHERE   EXISTS ( SELECT 1
                                                 FROM   Func_SplitToTable(@DepartOnlyCodeList,
                                                              ',') t
                                                 WHERE  t.value = CAST(Priv_Department.DepartOnlyCode AS NVARCHAR(10)) )
                                        AND CityID = @CityID
                                        AND PlatForm = @PlatForm
                                        AND TypeCode = @TypeCode";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql, new { CityID= privDepartmentData.CityID, PlatForm= privDepartmentData.PlatForm,TypeCode=privDepartmentData.TypeCode, DepartOnlyCodeList = string.Join(",", privDepartmentData.DepartOnlyCodeList) }).ToList();
            }
        }
        /// <summary>
        /// 保存门店权限
        /// </summary>
        /// <param name="privDepartmentData">相关参数信息</param>
        /// <param name="insertPrivDepartment"></param>
        /// <param name="dicSelected"></param>
        /// <param name="dicCancel"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public void SavePrivDepartment(Priv_DepartmentData privDepartmentData, DataTable insertPrivDepartment, Dictionary<string, List<int>> dicSelected, Dictionary<string, List<int>> dicCancel, UserInfoForCookie user)
        {
            StringBuilder updateSql = new StringBuilder();
            DynamicParameters dyParameters = new DynamicParameters();
            dyParameters.Add("CityID", privDepartmentData.CityID);
            dyParameters.Add("Modifier", user.EmpCode);
            string param1 = "";
            string param2 = "";
            //能看我的
            if (privDepartmentData.ViewType == 2)
            {
                param1 = "DataCode";
                param2 = "DepartOnlyCode";
                dyParameters.Add("DataCode", privDepartmentData.DataCode);

            }
            //我能看的
            else
            {
                param1 = "DepartOnlyCode";
                param2 = "DataCode";
                dyParameters.Add("DepartOnlyCode", privDepartmentData.DepartOnlyCode);
            }
            for (int i = 0, j = privDepartmentData.TypeCodeList.Count; i < j; i++)
            {
                var typeCode = privDepartmentData.TypeCodeList[i];
                if (dicSelected[typeCode].Count > 0)
                {
                    updateSql.AppendFormat(
                        @"UPDATE Priv_Department SET IsDel = 0 ,Modifier = @Modifier ,ModDate = GETDATE() WHERE IsDel = 1 AND CityID = @CityID AND {0} = @{0} AND EXISTS ( SELECT 1 FROM Func_SplitToTable(@Selected{2}, ',') t WHERE  t.value = CAST({1} AS NVARCHAR(20))) AND TypeCode = @TypeCode{2};", param1, param2, i);
                    dyParameters.Add("Selected" + i, string.Join(",", dicSelected[typeCode]));
                    dyParameters.Add("TypeCode" + i, typeCode);
                }
                if (dicCancel[typeCode].Count > 0)
                {
                    updateSql.AppendFormat(
                        @"UPDATE Priv_Department SET IsDel = 1 ,Modifier = @Modifier ,ModDate = GETDATE() WHERE IsDel = 0 AND CityID = @CityID AND {0} = @{0} AND EXISTS ( SELECT 1 FROM Func_SplitToTable(@Cancel{2}, ',') t WHERE  t.value = CAST({1} AS NVARCHAR(20))) AND TypeCode = @TypeCode{2};", param1, param2, i);
                    dyParameters.Add("Cancel" + i, string.Join(",", dicCancel[typeCode]));
                    dyParameters.Add("TypeCode" + i, typeCode);
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
                        if (insertPrivDepartment != null && insertPrivDepartment.Rows.Count > 0)
                        {
                            CommonDAL.BulkCopy(conn, insertPrivDepartment, tran);
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
        public void CopyPrivDepartmentToOthers(Priv_DepartmentData privDepartmentData, DataTable insertPrivDepartment, Dictionary<int, List<int>> UpdateListDic, Dictionary<int, List<int>> DeleteListDic, UserInfoForCookie user)
        {
            StringBuilder updateSql = new StringBuilder();
            DynamicParameters dyParameters = new DynamicParameters();
            dyParameters.Add("CityID", privDepartmentData.CityID);
            dyParameters.Add("PlatForm", 1);
            dyParameters.Add("TypeCode", privDepartmentData.TypeCode);
            dyParameters.Add("Modifier", user.EmpCode);
            for (int i=0;i< privDepartmentData.DepartOnlyCodeList.Count;i++ )
            {
                var item = privDepartmentData.DepartOnlyCodeList[i];
                if (UpdateListDic[item].Count > 0)
                {
                    updateSql.AppendFormat(
                        @"UPDATE    Priv_Department
                      SET       IsDel = 0 ,
                                Modifier = @Modifier ,                                
                                ModDate = GETDATE()
                      WHERE     IsDel = 1
                                AND TypeCode = @TypeCode 
                                AND DepartOnlyCode = @UpdateCode{0}
                                AND CityID = @CityID
                                AND PlatForm = @PlatForm
                                AND EXISTS ( SELECT 1
                                             FROM   Func_SplitToTable(@Updated{0},
                                                              ',') t
                                             WHERE  t.value = CAST(Priv_Department.DataCode AS NVARCHAR(20)) );", i);
                    dyParameters.Add("Updated" + i, string.Join(",", UpdateListDic[item]));
                    dyParameters.Add("UpdateCode" + i, item);
                }
                if (DeleteListDic[item].Count > 0)
                {
                    updateSql.AppendFormat(
                        @"UPDATE    Priv_Department
                      SET       IsDel = 1 ,
                                Modifier = @Modifier ,
                                ModDate = GETDATE()
                      WHERE     IsDel = 0
                                AND TypeCode = @TypeCode
                                AND DepartOnlyCode = @DeleteCode{0}
                                AND CityID = @CityID
                                AND PlatForm = @PlatForm
                                AND EXISTS ( SELECT 1
                                             FROM   Func_SplitToTable(@Deleted{0},
                                                              ',') t
                                             WHERE  t.value = CAST(Priv_Department.DataCode AS NVARCHAR(20)) );", i);
                    dyParameters.Add("Deleted" + i, string.Join(",", DeleteListDic[item]));
                    dyParameters.Add("DeleteCode" + i, item);
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
                        if (insertPrivDepartment != null && insertPrivDepartment.Rows.Count > 0)
                        {
                            CommonDAL.BulkCopy(conn, insertPrivDepartment, tran);
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

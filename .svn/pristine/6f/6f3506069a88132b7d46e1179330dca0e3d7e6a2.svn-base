using Dapper;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.DAL
{
    public class DataDepartModulePriveDAL
    {
        public List<int> GetDeptCodeListByEmpCode(DataDepartModulePrive Priv)
        {
            string sql = @" SELECT  
                        DepartOnlyCode
                 FROM   dbo.Priv_Employee_Data
                 WHERE  EmpCode = @EmpCode
                        AND [PlatForm] = 0
                        AND CityID = @CityID";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<int>(sql, Priv).ToList();
            }
        }
        public int UpdateUplusEmpPrivilege(DataDepartModulePrive Priv, DataTable insertDataTable,List<int> updateList,List<int> deleteList, UserInfoForCookie user)
        {
            Priv.Modifier = user.EmpCode;
            Priv.Creator = user.EmpCode;
            StringBuilder updateSql = new StringBuilder();
            DynamicParameters dyParameters = new DynamicParameters();
            dyParameters.Add("CityID", Priv.CityID);
            dyParameters.Add("PlatForm", 0);
            dyParameters.Add("EmpCode", Priv.EmpCode);
            dyParameters.Add("Modifier", user.EmpCode);
            int flag = 0;
            string sql = @"IF EXISTS ( SELECT  1
                            FROM    Priv_Employee
                            WHERE   EmpCode = @EmpCode
                                    AND [PlatForm] = @PlatForm
                                    AND CityID = @CityID
                                    AND IsDel = 0 )
                    BEGIN
                        UPDATE  dbo.Priv_Employee
                        SET     ModulePrivList = @ModulePrivList ,
                                DataPrivJson = @DataPrivJson ,
                                Modifier = @Modifier,
                                ModDate=GETDATE()
                        WHERE   EmpCode = @EmpCode
                                AND [PlatForm] = @PlatForm
                                AND CityID = @CityID
                                AND IsDel = 0;                        
                    END;
                ELSE
                    BEGIN
                        INSERT  INTO Priv_Employee
                                ( EmpCode ,
                                  Modifier ,
                                  CityID ,
                                  PlatForm ,
                                  ModulePrivList ,
                                  DataPrivJson,
                                  ModDate
                                )
                        VALUES  ( @EmpCode ,
                                  @Modifier ,
                                  @CityID ,
                                  @PlatForm ,
                                  @ModulePrivList ,
                                  @DataPrivJson,
                                  GETDATE()
                                );
                    END";
            using (var conn = AdoConfig.GetDBConnection())
            {
                flag = conn.Execute(sql, Priv);
                if (flag > 0)
                {
                    if (updateList.Count > 0)
                    {
                        updateSql.AppendFormat(
                            @"UPDATE  dbo.Priv_Employee_Data 
                        SET     IsDel = 0,
                                Modifier = @Modifier ,
                                ModDate = GETDATE()
                      WHERE     IsDel = 1
                                AND EmpCode = @EmpCode
                                AND CityID = @CityID
                                AND PlatForm = @PlatForm
                                AND EXISTS ( SELECT 1
                                             FROM   Func_SplitToTable(@Updated,
                                                              ',') t
                                             WHERE  t.value = CAST(Priv_Employee_Data.DepartOnlyCode AS NVARCHAR(20)) );");
                        dyParameters.Add("Updated", string.Join(",", updateList));
                    }
                    if (deleteList.Count > 0)
                    {
                        updateSql.AppendFormat(
                            @"UPDATE  dbo.Priv_Employee_Data 
                        SET     IsDel = 1,
                                Modifier = @Modifier ,
                                ModDate = GETDATE()
                      WHERE     IsDel = 0
                                AND EmpCode = @EmpCode
                                AND CityID = @CityID
                                AND PlatForm = @PlatForm
                                AND EXISTS ( SELECT 1
                                             FROM   Func_SplitToTable(@delete,
                                                              ',') t
                                             WHERE  t.value = CAST(Priv_Employee_Data.DepartOnlyCode AS NVARCHAR(20)) );");
                        dyParameters.Add("delete", string.Join(",", deleteList));
                    }
                    using (var tran = conn.BeginTransaction())
                    {
                        try
                        {
                            if (updateSql.Length > 0)
                            {
                                conn.Execute(updateSql.ToString(), dyParameters, tran);
                            }
                            if (insertDataTable != null && insertDataTable.Rows.Count > 0)
                            {
                                CommonDAL.BulkToDB(insertDataTable, conn,  tran);
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
            return flag;
        }        
        public class NewList
        {
            public long PrivEmpDeptID { get; set; }
            public int DepartOnlyCode { get; set; }
        }
    }
}


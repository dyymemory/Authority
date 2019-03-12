using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using Dapper;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;

namespace ERP.Authority.DAL
{
    public class B_CityDAL
    {
        /// <summary>
        /// 获取所有城市列表
        /// </summary>
        /// <returns></returns>
        public List<B_City> GetAllCityList(E_Employee employee)
        {
            string sql = @"
SELECT  CityID ,
        CityName ,
        PinYin ,
        ProvincesID
FROM    dbo.B_City ( NOLOCK ) c
WHERE   IsDel = 0 ORDER BY Sort ASC ";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<B_City>(sql, employee).ToList();
            }
        }
        /// <summary>
        /// 根据权限获取城市列表
        /// </summary>
        /// <param name="e_Employee"></param>
        /// <returns></returns>
        public List<B_City> GetCityListByAuthority(E_Employee e_Employee)
        {
            StringBuilder sql = new StringBuilder(@"
SELECT  CityID ,
        CityName ,
        PinYin ,
        ProvincesID
FROM    dbo.B_City ( NOLOCK ) c
WHERE   IsDel = 0 ");
            if (!WebConfigOperation.IsAdmin(e_Employee.Mobile) && e_Employee.PlatForm > 0)
            {
                sql.Append(@" AND EXISTS ( SELECT *
                     FROM   dbo.Func_SplitToTable(( SELECT  CityList
                                                    FROM    Priv_EmployeeCity pec ( NOLOCK )
                                                    WHERE   pec.IsDel = 0
                                                            AND pec.EmpCode = @EmpCode
                                                            AND pec.PlatForm = @PlatForm
                                                  ), ',') t
                     WHERE  c.CityID = t.value ) ");
            }
            sql.Append(" ORDER BY Sort ASC ");
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<B_City>(sql.ToString(), e_Employee).ToList();
            }
        }
        public void CopyCityAuthToEmp(int CityID,List<Priv_EmployeeCity> priv_Employees,DataTable insertdataTable, UserInfoForCookie user)
        {
            StringBuilder updateSql = new StringBuilder();
            DynamicParameters dyParameters = new DynamicParameters();
            if (priv_Employees.Count > 0)
            {                
                dyParameters.Add("PlatForm", priv_Employees[0].PlatForm);
                dyParameters.Add("Modifier", user.EmpCode);
                for (int i = 0; i < priv_Employees.Count; i++)
                {
                    updateSql.AppendFormat(
                            @"UPDATE    Priv_EmployeeCity
                      SET       IsDel = 0 ,
                                Modifier = @Modifier ,   
                                CityList=@CityList{0},
                                ModDate = GETDATE()
                      WHERE     EmpCode=@EmpCode{0}
                                AND PlatForm = @PlatForm
                                ", i);
                    dyParameters.Add("EmpCode" + i, priv_Employees[i].EmpCode);
                    dyParameters.Add("CityList" + i, priv_Employees[i].CityList + "," + CityID);
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
    }
}
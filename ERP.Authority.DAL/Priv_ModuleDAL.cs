﻿using Dapper;
using ERP.Authority.Entity.SDTM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.DAL
{
    public class Priv_ModuleDAL
    {
        public List<E_MarketMenu> GetTreeList()
        {
            string sql = @"SELECT  ID ,
        Name ,
        ParentID
FROM    dbo.E_MarketMenu
WHERE   IsDel = 0
ORDER BY ParentID ASC,Sort ASC
";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<E_MarketMenu>(sql).ToList();
            }
        }
        public List<Priv_Module> GetPrivilegeTreeList()
        {
            string sql = @"SELECT  ModuleCode ,
        ParentCode ,
        ModuleName
FROM    dbo.Priv_Module
WHERE   IsDel = 0
        AND PlatForm = 3
AND ModuleType = 1
ORDER BY ModuleCode ASC ";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<Priv_Module>(sql).ToList();
            }
        }
        public int UpdateEmpPrivilege(Priv_Employee modulePriv)
        {
            string sql = @"IF EXISTS ( SELECT  1
            FROM    Priv_Employee
            WHERE   EmpCode  = @EmpCode
                    AND PlatForm = @PlatForm
                    AND CityID=@CityID
                    AND IsDel = 0 )
    BEGIN
        UPDATE  Priv_Employee
        SET     Modifier = @Modifier ,
                ModulePrivList=@ModulePrivList,
                ModDate = GETDATE() 
        WHERE   EmpCode  = @EmpCode
                    AND PlatForm = @PlatForm
                    AND CityID=@CityID
                    AND IsDel = 0;
    END;
ELSE
    BEGIN
        INSERT  INTO Priv_Employee
                ( 
                EmpCode ,
                Creator,
                  PlatForm ,
                  CityID ,
                  ModulePrivList,
                  ModDate
                )
        VALUES  ( 
        @EmpCode ,
        @Creator,
                  3 ,
                  @CityID,
                  @ModulePrivList,
                  GETDATE()
                );
    END;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Execute(sql, modulePriv);
            }
        }
        /// <summary>
        /// 根据平台获取所有模块权限集合
        /// </summary>
        /// <returns></returns>
        public List<Priv_Module> GetAllModulePrivilegeList(Priv_Module priv_Module)
        {
            List<Priv_Module> list = null;
            try
            {
                string sql = @"SELECT  ModuleCode ,
        ParentCode ,
        ModuleName
FROM    dbo.Priv_Module
WHERE   IsDel = 0
        AND PlatForm = @PlatForm
        AND ModuleType = 1
ORDER BY ParentCode ASC ,
        Priv_ModuleID ASC";

                using (var conn = AdoConfig.GetDBConnection())
                {
                    list = conn.Query<Priv_Module>(sql, priv_Module).ToList();
                }
            }
#pragma warning disable CS0168 // 声明了变量“ex”，但从未使用过
            catch (Exception ex)
#pragma warning restore CS0168 // 声明了变量“ex”，但从未使用过
            {
                list = null;

            }
            return list;
        }
        /// <summary>
        /// 根据员工code与平台获取员工权限信息
        /// </summary>
        /// <param name="privEmp"></param>
        /// <returns></returns>
        public dynamic GetPrivModuleByEmployee(Priv_Employee privEmp)
        {
            string sql = @"
SELECT  EmpCode ,
        CityID ,
        [PlatForm] ,
        ModulePrivList ,
        DataPrivJson
FROM    dbo.Priv_Employee
WHERE   EmpCode = @EmpCode
        AND [PlatForm] = @PlatForm
        AND CityID=@CityID
        AND IsDel = 0;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql, privEmp).FirstOrDefault();
            }
        }
    }
}

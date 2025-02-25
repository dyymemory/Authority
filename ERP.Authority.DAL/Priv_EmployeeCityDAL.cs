﻿using System.Linq;
using System.Text;
using Dapper;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.DAL
{
    public class Priv_EmployeeCityDAL
    {
        /// <summary>
        /// 保存员工城市权限
        /// </summary>
        /// <param name="privEmployeeCity"></param>
        /// <returns></returns>
        public int SavePrivEmployeeCity(Priv_EmployeeCity privEmployeeCity)
        {
            string sql = @"
IF EXISTS ( SELECT  1
            FROM    Priv_EmployeeCity
            WHERE   EmpCode = @EmpCode
                    AND [PlatForm] = @PlatForm
                    AND IsDel = 0 )
    BEGIN
        UPDATE  Priv_EmployeeCity
        SET     Modifier = @Modifier ,
                ModDate = GETDATE() ,
                CityList = @CityList
        WHERE   EmpCode = @EmpCode
                AND [PlatForm] = @PlatForm
                AND IsDel = 0;
    END;
ELSE
    BEGIN
        INSERT  INTO Priv_EmployeeCity
                ( EmpCode ,
                  PlatForm ,
                  CityList ,
                  Creator
                )
        VALUES  ( @EmpCode ,
                  @PlatForm ,
                  @CityList ,
                  @Creator
                );
    END;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Execute(sql, privEmployeeCity);
            }
        }

        /// <summary>
        /// 获取员工城市权限
        /// </summary>
        /// <param name="privEmployeeCity"></param>
        /// <returns></returns>
        public Priv_EmployeeCity GetPrivEmployeeCity(Priv_EmployeeCity privEmployeeCity)
        {
            string sql = @"
SELECT  EmpCode ,
        PlatForm ,
        CityList
FROM    Priv_EmployeeCity
WHERE   EmpCode = @EmpCode
        AND [PlatForm] = @PlatForm
        AND IsDel = 0;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<Priv_EmployeeCity>(sql, privEmployeeCity).FirstOrDefault();
            }
        }
    }
}
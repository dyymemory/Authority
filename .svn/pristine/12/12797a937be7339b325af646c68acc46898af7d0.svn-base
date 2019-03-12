using System.Linq;
using Dapper;
using ERP.Authority.Entity.SDTM;

namespace ERP.Authority.DAL
{
    public class U_UserDAL
    {
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public U_User UserLogin(U_User user)
        {
            string sql = @"
SELECT  e.EmpID ,
        e.EmpCode ,
        e.Mobile ,
        e.EmpName ,
        e.StaffImage ,
        e.DeptID ,
        e.PositionID ,
        e.CityID ,
        c.CityName
FROM    E_Employee e ( NOLOCK )
        LEFT JOIN dbo.B_City c ( NOLOCK ) ON e.CityID = c.CityID
WHERE   e.FlagTrashed = 0
        AND e.FlagTrashed = 0
        AND e.ZFStatus <> 2
        AND e.Mobile = @Mobile
        AND e.[PassWord] = @Pwd";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<U_User>(sql, new { user.Mobile, user.Pwd }).FirstOrDefault();
            }
        }
    }
}

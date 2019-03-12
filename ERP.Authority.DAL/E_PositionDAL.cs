using Dapper;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ERP.Authority.DAL
{
    public class E_PositionDAL
    {
        /// <summary>
        /// 获取所有职位列表
        /// </summary>
        /// <returns></returns>
        public List<dynamic> GetAllPositionList(E_Position position, PageModel pm)
        {
            StringBuilder sbSql = new StringBuilder(@"
                SELECT  PositionID ,
        p.PositionCode ,
        b.CityID ,
        p.PositionNo ,
        p.PositionName ,
        p.FlagSale ,
        p.FlagShop ,
        p.FlagZone ,
        p.PositionRole,
        c.CityName,
        b.Name AS PositionRoleName 
       FROM    dbo.E_Position p ( NOLOCK ) 
       INNER JOIN  dbo.B_Parameter b ON b.Code=p.PositionRole AND B.CityID = P.CityID
       INNER JOIN dbo.B_City c ON b.CityID=c.CityID
       WHERE   p.FlagDeleted = 0
       AND p.FlagTrashed = 0 AND  b.Type = 'EmpRole' ");
            var dyParamter = new DynamicParameters();
            dyParamter.Add("PageIndex", pm.PageIndex);
            dyParamter.Add("PageSize", pm.PageSize);

            if (position != null)
            {
                if (position.CityID > 0)
                {
                    sbSql.Append(" AND b.CityID = @CityID");
                    dyParamter.Add("CityID", position.CityID);
                }

                if (!string.IsNullOrEmpty(position.PositionID))
                {
                    sbSql.Append(" AND p.PositionID = @PositionID ");
                    dyParamter.Add("PositionID", position.PositionID);
                }
            }

            string querySql = string.Format("WITH query AS ({0}) ", sbSql);
            string countSql = querySql + " SELECT COUNT(*) FROM query";

            using (var conn = AdoConfig.GetDBConnection())
            {
                pm.TotalCount = conn.Query<int>(countSql, dyParamter).FirstOrDefault();
                if (pm.TotalCount > 0)
                {
                    string pageSql = querySql + " SELECT * FROM ( SELECT ROW_NUMBER() OVER(ORDER BY PositionNo ASC) AS RowNum, * FROM query ) t WHERE t.RowNum > (@PageIndex -1) * @PageSize AND t.RowNum <= @PageIndex * @PageSize";
                    return conn.Query<dynamic>(pageSql, dyParamter).ToList();
                }
                return new List<dynamic>();
            }
        }

        /// <summary>
        /// 根据城市获取职位
        /// </summary>
        /// <returns></returns>
        public List<E_Position> GetPositionListByCity(E_Position position)
        {
            string sql = @"
SELECT  PositionID ,
        PositionCode ,
        CityID ,
        PositionNo ,
        PositionName ,
        FlagSale ,
        FlagShop ,
        FlagZone ,
        PositionRole
FROM    dbo.E_Position ( NOLOCK )
WHERE   FlagDeleted = 0
        AND FlagTrashed = 0
        AND CityID = @CityID
        ORDER BY PositionRole ASC,PositionCode DESC;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<E_Position>(sql, new { CityID = position.CityID }).ToList();
            }
        }
    }
}
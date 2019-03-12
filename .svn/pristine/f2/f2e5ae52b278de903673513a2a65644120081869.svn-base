using System.Collections.Generic;
using System.Linq;
using Dapper;
using ERP.Authority.Entity.SDTM;

namespace ERP.Authority.DAL
{
    public class B_DistrictDAL
    {
        /// <summary>
        /// 根据城市获取地理片区树形结构数据
        /// </summary>
        /// <param name="city"></param>
        /// <returns></returns>
        public List<dynamic> GetTreeAreaDistrictByCity(B_City city)
        {
            string sql = @"
SELECT  *
FROM    ( SELECT    'Area' + CONVERT(NVARCHAR(10), ID) AS ID ,
                    AreaName AS Name ,
                    '' AS ParentID ,
                    '-1' AS DataCode ,
                    'Area' + CONVERT(NVARCHAR(10), ID) AS Soft
          FROM      B_Area
          WHERE     IsDel = 0
                    AND CityID = @CityID
          UNION ALL
          SELECT    'District' + CONVERT(NVARCHAR(10), ID) AS ID ,
                    DistrictName AS Name ,
                    'Area' + CONVERT(NVARCHAR(10), AreaID) AS ParentID ,
                    ID AS DataCode ,
                    'Area' + CONVERT(NVARCHAR(10), AreaID) AS Soft
          FROM      B_District d
          WHERE     IsDel = 0
                    AND EXISTS ( SELECT 1
                                 FROM   B_Area a
                                 WHERE  a.ID = d.AreaID
                                        AND a.IsDel = 0
                                        AND a.CityID = @CityID )
        ) t
ORDER BY t.Soft ASC ,
        t.ParentID ASC;";
            using (var conn = AdoConfig.GetDBConnection())
            {
                return conn.Query<dynamic>(sql, city).ToList();
            }
        }
    }
}
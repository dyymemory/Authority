using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.Cache
{
    public class B_DistrictCache
    {
        private string districtKey = "B_DistrictCache:{0}";
        /// <summary>
        /// 获取片区缓存
        /// </summary>
        /// <param name="city"></param>
        /// <returns></returns>
        public List<dynamic> GetTreeAreaDistrictByCityCache(B_City city)
        {
            var key = string.Format(districtKey, city.CityID);
            var list = CacheOperation<List<dynamic>>.GetCache(key);
            if (list == null)
            {
                list = new B_DistrictDAL().GetTreeAreaDistrictByCity(city);
                if (list != null && list.Count > 0)
                {
                    //设置缓存
                    CacheOperation<List<dynamic>>.SetCache(key, list);
                }
            }
            return list;
        }
        public void RemoveDistrictCache(B_City city)
        {
            var key = string.Format(districtKey, city.CityID);
            CacheOperation<List<B_City>>.Remove(key);
        }
    }

}

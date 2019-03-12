using System.Collections.Generic;
using System.Linq;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.General;

namespace ERP.Authority.Cache
{
    public class B_CityCache
    {
        /// <summary>
        /// 城市缓存key
        /// </summary>
        private string cityKey = "B_City";

        /// <summary>
        /// 获取城市缓存
        /// </summary>
        /// <param name="employee"></param>
        /// <returns></returns>
        public List<B_City> GetAllCityListCache(E_Employee employee)
        {
            var list = CacheOperation<List<B_City>>.GetCache(cityKey);
            if (list == null)
            {
                list = new B_CityDAL().GetAllCityList(employee);
                if (list != null && list.Count > 0)
                {
                    //设置缓存
                    CacheOperation<List<B_City>>.SetCache(cityKey, list);
                }                
            }
            return list;
        }

        /// <summary>
        /// 清空城市缓存
        /// </summary>
        public void RemoveCityCache()
        {
            CacheOperation<List<B_City>>.Remove(cityKey);
        }
    }
}

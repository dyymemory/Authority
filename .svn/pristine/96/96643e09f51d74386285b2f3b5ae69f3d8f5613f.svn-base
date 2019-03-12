using System.Collections.Generic;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.General;

namespace ERP.Authority.Cache
{
    public class E_PositionCache
    {
        /// <summary>
        /// 职位缓存key
        /// </summary>
        private string positionKey = "E_PositionCache:{0}";

        /// <summary>
        /// 获取职位缓存
        /// </summary>
        /// <param name="position"></param>
        /// <returns></returns>
        public List<E_Position> GetPositionListByCityCache(E_Position position)
        {
            var key = string.Format(positionKey, position.CityID);
            var list = CacheOperation<List<E_Position>>.GetCache(key);
            if (list == null)
            {
                list = new E_PositionDAL().GetPositionListByCity(position);
                if (list != null && list.Count > 0)
                {
                    //设置缓存
                    CacheOperation<List<E_Position>>.SetCache(key, list);
                }
            }
            return list;
        }

        /// <summary>
        /// 清空职位缓存
        /// </summary>
        public void RemovePositionCache(E_Department department)
        {
            var key = string.Format(positionKey, department.CityID);
            CacheOperation<List<B_City>>.Remove(key);
        }
    }
}

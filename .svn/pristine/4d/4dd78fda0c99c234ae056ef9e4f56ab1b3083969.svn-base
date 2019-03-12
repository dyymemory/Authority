using System.Collections.Generic;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.General;

namespace ERP.Authority.Cache
{
    public class E_DepartmentCache
    {
        /// <summary>
        /// 部门缓存key
        /// </summary>
        private string departmentKey = "E_DepartmentCache:{0}";

        /// <summary>
        /// 获取部门缓存
        /// </summary>
        /// <param name="department"></param>
        /// <returns></returns>
        public List<dynamic> GetDepartmentListByCityCache(E_Department department)
        {
            var key = string.Format(departmentKey, department.CityID);
            var list = CacheOperation<List<dynamic>>.GetCache(key);
            if (list == null)
            {
                list = new E_DepartmentDAL().GetDepartmentListByCity(department);
                if (list != null && list.Count > 0)
                {
                    //设置缓存
                    CacheOperation<List<dynamic>>.SetCache(key, list);
                }
            }
            return list;
        }

        /// <summary>
        /// 清空部门缓存
        /// </summary>
        public void RemoveDepartmentCache(E_Department department)
        {
            var key = string.Format(departmentKey, department.CityID);
            CacheOperation<List<B_City>>.Remove(key);
        }
    }
}

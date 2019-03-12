using System.Collections.Generic;
using Dapper;

namespace ERP.Authority.DAL
{
    public class DapperExtend
    {
        /// <summary>
        /// 根据Dictionary赋值数据库参数
        /// </summary>
        /// <param name="dictionary"></param>
        /// <returns></returns>
        public static DynamicParameters GetDyParametersByDictionary(IDictionary<string, object> dictionary)
        {
            var dyParameters = new DynamicParameters();
            foreach (var key in dictionary.Keys)
            {
                dyParameters.Add(key, dictionary[key]);
            }
            return dyParameters;
        } 
    }
}
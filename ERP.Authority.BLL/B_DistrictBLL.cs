﻿using System.Collections.Generic;
using ERP.Authority.Cache;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.BLL
{
    public class B_DistrictBLL
    {
        /// <summary>
        /// 根据城市获取地理片区树形结构数据
        /// </summary>
        /// <param name="city"></param>
        /// <returns></returns>
        public ResultModel<List<dynamic>> GetTreeAreaDistrictByCity(B_City city)
        {
            return new ResultModel<List<dynamic>>() { Data = new B_DistrictCache().GetTreeAreaDistrictByCityCache(city) };
        }
    }
}
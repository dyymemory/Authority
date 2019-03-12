using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ERP.Authority.BLL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.API.Controllers.V1
{
    public class AreaController : BaseApiController
    {
        /// <summary>
        /// 根据城市获取地理片区树形结构数据
        /// </summary>
        /// <param name="city"></param>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<dynamic>> GetTreeAreaDistrictByCity([FromBody]B_City city)
        {
            return new B_DistrictBLL().GetTreeAreaDistrictByCity(city);
        }
    }
}

﻿using System;
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
    public class PositionController : BaseApiController
    {
        /// <summary>
        /// 获取所有职位列表
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<dynamic>> GetAllPositionList([FromBody] E_Position position, [FromUri] PageModel pm)
        {
            return new E_PositionBLL().GetAllPositionList(position,pm);
        }


        /// <summary>
        /// 根据城市获取职位
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<E_Position>> GetPositionListByCity([FromBody] E_Position position)
        {
            return new E_PositionBLL().GetPositionListByCity(position);
        }
    }
}

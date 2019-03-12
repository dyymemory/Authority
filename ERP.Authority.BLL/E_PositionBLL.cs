using System.Collections.Generic;
using ERP.Authority.Cache;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.Entity.SDTM;

namespace ERP.Authority.BLL
{
    public class E_PositionBLL
    {
        /// <summary>
        /// 获取所有职位列表
        /// </summary>
        /// <returns></returns>
        public ResultModel<List<dynamic>> GetAllPositionList( E_Position position, PageModel pm)
        {
            return new ResultModel<List<dynamic>>() { Data = new E_PositionDAL().GetAllPositionList(position,pm),PM=pm };
        }

        /// <summary>
        /// 根据城市获取职位
        /// </summary>
        /// <returns></returns>
        public ResultModel<List<E_Position>> GetPositionListByCity(E_Position position)
        {
            return new ResultModel<List<E_Position>>() { Data = new E_PositionCache().GetPositionListByCityCache(position) };
        }
    }
}   
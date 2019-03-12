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
    public class CityController : BaseApiController
    {
        /// <summary>
        /// 获取所有城市列表
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<B_City>> GetAllCityList([FromBody] E_Employee employee)
        {
            if (employee == null)
            {
                employee = new E_Employee();
            }
            employee.EmpCode = User.EmpCode;
            employee.Mobile = User.Mobile;
            return new B_CityBLL().GetAllCityList(employee);
        }
        [HttpPost]
        public ResultModel<List<SuccessList>> CopyCityAuthToEmp([FromBody] Priv_Employee priv_)
        {
            var CityID = Convert.ToInt32(priv_.CityID);
            var PlatForm = Convert.ToInt32(priv_.PlatForm);
            return new B_CityBLL().CopyCityAuthToEmp(CityID, PlatForm, User);
        }
    }
}

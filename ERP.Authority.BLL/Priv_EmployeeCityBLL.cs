using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.BLL
{
    public class Priv_EmployeeCityBLL
    {
        /// <summary>
        /// 保存员工城市权限
        /// </summary>
        /// <param name="privEmployeeCity"></param>
        /// <param name="User"></param>
        /// <returns></returns>
        public ResultModel<object> SavePrivEmployeeCity(Priv_EmployeeCity privEmployeeCity, UserInfoForCookie User)
        {
            var msg = new ResultModel<object>();
            privEmployeeCity.Modifier = User.EmpCode;
            privEmployeeCity.Creator = User.EmpCode;
            if (privEmployeeCity.CityList == null)
            {
                privEmployeeCity.CityList = "";
            }
            if (new Priv_EmployeeCityDAL().SavePrivEmployeeCity(privEmployeeCity) == 0)
            {
                msg.Code = 2001;
                msg.Message = "保存失败";
            }
            return msg;
        }
        /// <summary>
        /// 获取员工城市权限
        /// </summary>
        /// <param name="privEmployeeCity"></param>
        /// <returns></returns>
        public ResultModel<Priv_EmployeeCity> GetPrivEmployeeCity(Priv_EmployeeCity privEmployeeCity)
        {
            return new ResultModel<Priv_EmployeeCity>() { Data = new Priv_EmployeeCityDAL().GetPrivEmployeeCity(privEmployeeCity) };
        }
    }
}
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.BLL
{
    public class Priv_Employee_DataBLL
    {
        /// <summary>
        /// 根据empcode cityid platform 获取部门权限
        /// </summary>
        /// <param name="priv_Employee_Data"></param>
        /// <returns></returns>
        public ResultModel<List<dynamic>> GetDepartPrivByEmployee(Priv_Employee_Data priv_Employee_Data)
        {
            return new ResultModel<List<dynamic>>() { Data = new Priv_Employee_DataDAL().GetDepartPrivByEmployee(priv_Employee_Data) };
        }
    }
}

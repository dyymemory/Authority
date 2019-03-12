using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.Entity.SDTMComm
{
    /// <summary>
    /// 保存Cookie的用户信息
    /// </summary>
    public class UserInfoForCookie
    {
        /// <summary>
        /// 员工Code
        /// </summary>
        public int EmpCode { get; set; }
        /// <summary>
        /// 员工编号
        /// </summary>
        public string EmpID { get; set; }
        /// <summary>
        /// 手机号
        /// </summary>
        public string Mobile { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 部门ID
        /// </summary>
        public string DeptID { get; set; }
        /// <summary>
        /// 职位ID
        /// </summary>
        public string PositionID { get; set; }
        /// <summary>
        /// 城市ID
        /// </summary>
        public int CityID { get; set; }
    }
}

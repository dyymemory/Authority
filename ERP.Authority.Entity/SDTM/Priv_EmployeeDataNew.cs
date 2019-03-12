using System.Collections.Generic;

namespace ERP.Authority.Entity.SDTM
{
    public class Priv_EmployeeDataNew : Priv_Employee_Data
    {

        /// <summary>
        /// 复制的部门Code
        /// </summary>
        public List<int> DepartOnlyCodeList { get; set; }
        /// <summary>
        /// EmpCodeCode集合
        /// </summary>
        public List<int> EmpCodeList { get; set; }

    }
}

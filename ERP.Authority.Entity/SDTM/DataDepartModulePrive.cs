using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.Entity.SDTM
{
    public class DataDepartModulePrive
    {
        public string DataPrivJson { get; set; }
        public string ModulePrivList { get; set; }
        public int EmpCode { get; set; }
        public int PlatForm { get; set; }
        public int CityID { get; set; }
        public int Modifier { get; set; }
        public int Creator { get; set; }
        public List<int> DepartmentPriv { get; set; }
        public System.DateTime ModDate { get; set; }
        public System.DateTime CreateDate { get; set; }
    }
}

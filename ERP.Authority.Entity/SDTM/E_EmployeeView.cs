﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.Entity.SDTM
{
    public class E_EmployeeView : E_Employee
    {
        private string _modulePrivList;
        //员工模块权限
        public string ModulePrivList
        {
            get { return _modulePrivList; }
            set { _modulePrivList = value; }
        }
    }
}

﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using ERP.Authority.BLL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using Microsoft.Ajax.Utilities;

namespace ERP.Authority.API.Controllers.V1
{
    public class EmployeeController : BaseApiController
    {
        /// <summary>
        /// 根据部门获取员工信息
        /// </summary>
        /// <param name="emp"></param>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<E_Employee>> GetEmployeeListByDeptID([FromBody] E_Employee emp)
        {
            return new E_EmployeeBLL().GetEmployeeListByDeptID(emp.DeptID);
        }

        /// <summary>
        /// 根据条件查询员工相关信息
        /// </summary>
        /// <param name="emp"></param>
        /// <param name="pm"></param>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<dynamic>> GetEmployeeListForTalbe([FromBody] E_Employee emp, [FromUri] PageModel pm)
        {
            return new E_EmployeeBLL().GetEmployeeListForTalbe(emp, pm, User);
        }
        /// <summary>
        /// 根据DepartOnlyCode获取门店下的员工及其职位
        /// </summary>
        /// <param name="e_Department"></param>
        /// <returns></returns>
        /// 
        [HttpPost]
        public ResultModel<List<E_Employee>> GetDeptEmpByDepartOnlyCode([FromBody] E_Employee e_Employee)
        {
            return new E_EmployeeBLL().GetDeptEmpByDepartOnlyCode(e_Employee);
        }

    }
}

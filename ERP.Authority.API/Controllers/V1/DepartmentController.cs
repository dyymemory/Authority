﻿using System.Collections.Generic;
using System.Web.Http;
using ERP.Authority.BLL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.API.Controllers.V1
{
    public class DepartmentController : BaseApiController
    {
        /// <summary>
        /// 获取所有部门列表并按照父子顺序排序
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<dynamic>> GetAllDepartmentList()
        {
            return new E_DepartmentBLL().GetAllDepartmentList();
        }

        /// <summary>
        /// 根据城市获取部门列表并按照父子顺序排序
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<dynamic>> GetDepartmentListByCity([FromBody] E_Department department)
        {
            return new E_DepartmentBLL().GetDepartmentListByCity(department);
        }

        /// <summary>
        /// 根据城市、员工权限获取部门列表并按照父子顺序排序
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public ResultModel<List<dynamic>> GetDepartmentListByEmployee([FromBody] E_Employee employee)
        {
            return new E_DepartmentBLL().GetDepartmentListByEmployee(employee);
        }
    }
}

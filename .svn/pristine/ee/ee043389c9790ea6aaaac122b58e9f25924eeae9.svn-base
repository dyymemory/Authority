using System.Collections.Generic;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;

namespace ERP.Authority.BLL
{
    public class E_EmployeeBLL
    {
        /// <summary>
        /// 根据部门获取员工信息
        /// </summary>
        /// <param name="deptID"></param>
        /// <returns></returns>
        public ResultModel<List<E_Employee>> GetEmployeeListByDeptID(string deptID)
        {
            return new ResultModel<List<E_Employee>>() { Data = new E_EmployeeDAL().GetEmployeeListByDeptID(deptID) };
        }

        /// <summary>
        /// 根据条件查询员工相关信息
        /// </summary>
        /// <param name="emp"></param>
        /// <returns></returns>
        public ResultModel<List<dynamic>> GetEmployeeListForTalbe(E_Employee emp, PageModel pm ,UserInfoForCookie user)
        {
            return new ResultModel<List<dynamic>>() { Data = new E_EmployeeDAL().GetEmployeeListForTalbe(emp, pm, user), PM = pm };
        }
        public List<E_Employee> GetAllEmpByPositionID(E_Employee e_Employee)
        {
            return  new E_EmployeeDAL().GetAllEmpByPositionID(e_Employee);
        }

        /// <summary>
        /// 根据DepartOnlyCode获取门店下的员工及其职位
        /// </summary>
        /// <param name="e_Department"></param>
        /// <returns></returns>
        public ResultModel< List<E_Employee>> GetDeptEmpByDepartOnlyCode(E_Employee e_Employee)
        {
            return new ResultModel<List<E_Employee>>() { Data = new E_EmployeeDAL().GetDeptEmpByDepartOnlyCode(e_Employee)};
        }
        /// <summary>
        /// 获取当前城市下所有员工
        /// </summary>
        /// <param name="CityID"></param>
        /// <returns></returns>
        public List<int> GetAllEmpByCityID(int CityID)
        {
            return new E_EmployeeDAL().GetAllEmpByCityID(CityID);
        }
        /// <summary>
        /// 获取城市权限表中有的数据
        /// </summary>
        /// <param name="CityID"></param>
        /// <param name="PlatForm"></param>
        /// <param name="Flag"></param>
        /// <returns></returns>
        public List<Priv_EmployeeCity> GetEmpCodeAndCityList(int CityID,int PlatForm,bool Flag)
        {
            return new E_EmployeeDAL().GetEmpCodeAndCityList(CityID,PlatForm,Flag);
        }
    }
}
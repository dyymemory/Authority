using System;
using System.Collections.Generic;
using System.Linq;
using ERP.Authority.Cache;
using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using ERP.Authority.General;

namespace ERP.Authority.BLL
{
    public class B_CityBLL
    {
        /// <summary>
        /// 获取所有城市列表
        /// </summary>
        /// <returns></returns>
        public ResultModel<List<B_City>> GetAllCityList(E_Employee employee)
        {
            var msg = new ResultModel<List<B_City>>();
            var authlist = new B_CityDAL().GetCityListByAuthority(employee).Select(item => item.CityID).ToList();// 权限内的城市列表
            var list = new B_CityCache().GetAllCityListCache(employee); // 全部城市列表            
            msg.Data = GetCombineCityList(list, authlist);
            return msg;
        }
        // 获取权限内城市列表
        public List<B_City> GetCombineCityList(List<B_City> AllList, List<int> AuthList)
        {
            return AllList.Where(t => AuthList.Contains(t.CityID)).ToList();
        }
        public ResultModel<List<SuccessList>> CopyCityAuthToEmp(int cityid,int platform, UserInfoForCookie user)
        {
            var listInsertPrivDepartment = new List<Priv_EmployeeCity>();
            var AllEmpList = new E_EmployeeBLL().GetAllEmpByCityID(cityid);// 当前城市下的所有员工
            int TotalCount = AllEmpList.Count;
            var ExisEmpAndCityList = new E_EmployeeBLL().GetEmpCodeAndCityList(cityid, platform, true);// 有数据
            var updateCityList= new E_EmployeeBLL().GetEmpCodeAndCityList(cityid, platform, false);//有数据 没有当前城市id
            var InsertList = GetSubtraction(AllEmpList, ExisEmpAndCityList);
            listInsertPrivDepartment = listInsertPrivDepartment.Union(InsertList.Select(empcode => new Priv_EmployeeCity()
            {
                EmpCode = empcode,
                PlatForm = Convert.ToByte(platform),
                CityList=cityid.ToString(),
                IsDel=0,
                Creator = user.EmpCode
            })).ToList();
            new B_CityDAL().CopyCityAuthToEmp(cityid,updateCityList, listInsertPrivDepartment.ToDataTable(), user);
            var successList = new SuccessList();
            successList.TotalCount = TotalCount;
            successList.SuccessCount = updateCityList.Count + listInsertPrivDepartment.Count;            
            return new ResultModel<List<SuccessList>>(){ Data = GetResult(successList) };
        }
        public List<SuccessList> GetResult(SuccessList successList)
        {
            var resultmodel = new List<SuccessList>();
            resultmodel.Add(successList);
            return resultmodel;
        }
        public List<int> GetSubtraction(List<int> allemplist, List<Priv_EmployeeCity> exisEmpAndCityList)
        {
            foreach (var item in exisEmpAndCityList)
            {
                if (allemplist.Contains(item.EmpCode))
                {
                    allemplist.Remove(item.EmpCode);
                }
            }
            return allemplist;
        }        
    }
}
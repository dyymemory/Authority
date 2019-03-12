using ERP.Authority.DAL;
using ERP.Authority.Entity.SDTM;
using ERP.Authority.Entity.SDTMComm;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ERP.Authority.General;

namespace ERP.Authority.BLL
{
    public class Priv_DepartmentBLL
    {
        /// <summary>
        /// 获取门店权限
        /// </summary>
        /// <param name="privDepartmentData"></param>
        /// <returns></returns>
        public ResultModel<List<dynamic>> GetPrivDepartmentList(Priv_DepartmentData privDepartmentData)
        {
            var msg = new ResultModel<List<dynamic>>();
            //1.我能看的 2.能看我的
            if (!new[] { 1, 2 }.Contains(privDepartmentData.ViewType))
            {
                msg.Code = 2001;
                msg.Message = "查看类型不正确";
                return msg;
            }
            if (privDepartmentData.TypeCodeList == null || privDepartmentData.TypeCodeList.Count == 0)
            {
                msg.Code = 2001;
                msg.Message = "数据类型不允许为空";
                return msg;
            }
            msg.Data = new Priv_DepartmentDAL().GetPrivDepartmentList(privDepartmentData);
            return msg;
        }

        /// <summary>
        /// 保存门店权限
        /// </summary>
        /// <param name="privDepartmentData"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public ResultModel<object> SavePrivDepartment(Priv_DepartmentData privDepartmentData, UserInfoForCookie user)
        {
            var msg = new ResultModel<object>();
            #region 验证
            //1.我能看的 2.能看我的
            if (!new[] { 1, 2 }.Contains(privDepartmentData.ViewType))
            {
                msg.Code = 2001;
                msg.Message = "权限查看类型不正确";
                return msg;
            }
            if (privDepartmentData.TypeCodeList == null || privDepartmentData.TypeCodeList.Count == 0)
            {
                msg.Code = 2001;
                msg.Message = "权限数据类型不允许为空";
                return msg;
            }
            foreach (var typeCode in privDepartmentData.TypeCodeList)
            {
                switch (typeCode)
                {
                    case "dep-divisition-sel":
                        if (privDepartmentData.DepDivisitionSel == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "管辖权限选择的数据异常";
                            return msg;
                        }
                        break;
                    case "dep-fy-sel":
                        if (privDepartmentData.DepFySel == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "查看房源（行政跨部）选择的数据异常";
                            return msg;
                        }
                        break;
                    case "dep-cust-sel":
                        if (privDepartmentData.DepCustSel == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "查看客源（行政跨部）选择的数据异常";
                            return msg;
                        }
                        break;

                    case "dep-public-owner":
                        if (privDepartmentData.DepPublicOwner == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "公盘看业主选择的数据异常";
                            return msg;
                        }
                        break;
                    case "dep-private-owner":
                        if (privDepartmentData.DepPrivateOwner == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "私盘看业主选择的数据异常";
                            return msg;
                        }
                        break;
                    case "dep-common-owner":
                        if (privDepartmentData.DepCommonOwner == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "公共池房源看业主选择的数据异常";
                            return msg;
                        }
                        break;
                    case "dep-fy-fellow":
                        if (privDepartmentData.DepFyFellow == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "房源看跟进选择的数据异常";
                            return msg;
                        }
                        break;
                    case "dep-cust-fellow":
                        if (privDepartmentData.DepCustFellow == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "客源跟进选择的数据异常";
                            return msg;
                        }
                        break;
                    case "area-fy-sel":
                        if (privDepartmentData.AreaFySel == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "查看房源(地理跨区)选择的数据异常";
                            return msg;
                        }
                        break;
                    case "area-fy-modify":
                        if (privDepartmentData.AreaFyModify == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "维护房源(地理跨区)选择的数据异常";
                            return msg;
                        }
                        break;
                    case "area-cust-sel":
                        if (privDepartmentData.AreaCustSel == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "查看客源(地理跨区)选择的数据异常";
                            return msg;
                        }
                        break;
                    case "area-fy-info":
                        if (privDepartmentData.AreaFyInfo == null)
                        {
                            msg.Code = 2001;
                            msg.Message = "资料房源选择的数据异常";
                            return msg;
                        }
                        break;
                    default:
                        msg.Code = 2001;
                        msg.Message = "权限数据类型错误";
                        return msg;
                }
            }
            #endregion
            Priv_DepartmentDAL privDepartmentDal = new Priv_DepartmentDAL();
            var listPrivDepartment = privDepartmentDal.GetPrivDepartmentList(privDepartmentData, true);
            var listInsertPrivDepartment = new List<Priv_Department>();
            var dicSelected = new Dictionary<string, List<int>>();
            var dicCancel = new Dictionary<string, List<int>>();
            foreach (var typeCode in privDepartmentData.TypeCodeList)
            {
                List<int> paramList;
                switch (typeCode)
                {
                    case "dep-divisition-sel":
                        paramList = privDepartmentData.DepDivisitionSel;
                        break;
                    case "dep-fy-sel":
                        paramList = privDepartmentData.DepFySel;
                        break;
                    case "dep-cust-sel":
                        paramList = privDepartmentData.DepCustSel;
                        break;
                    case "dep-public-owner":
                        paramList = privDepartmentData.DepPublicOwner;
                        break;
                    case "dep-private-owner":
                        paramList = privDepartmentData.DepPrivateOwner;
                        break;
                    case "dep-common-owner":
                        paramList = privDepartmentData.DepCommonOwner;
                        break;
                    case "dep-fy-fellow":
                        paramList = privDepartmentData.DepFyFellow;
                        break;
                    case "dep-cust-fellow":
                        paramList = privDepartmentData.DepCustFellow;
                        break;
                    case "area-fy-sel":
                        paramList = privDepartmentData.AreaFySel.FindAll(item => item > 0);
                        break;
                    case "area-fy-modify":
                        paramList = privDepartmentData.AreaFyModify.FindAll(item => item > 0);
                        break;
                    case "area-cust-sel":
                        paramList = privDepartmentData.AreaCustSel.FindAll(item => item > 0);
                        break;
                    case "area-fy-info":
                        paramList = privDepartmentData.AreaFyInfo.FindAll(item => item > 0);
                        break;
                    default:
                        paramList = new List<int>();
                        break;
                }
                //数据库所有数据
                List<int> allPrivDepartment = new List<int>();
                //能看我的
                if (privDepartmentData.ViewType == 2)
                {
                    listPrivDepartment.FindAll(item => item.TypeCode == typeCode).ForEach(item => allPrivDepartment.Add(item.DepartOnlyCode));
                }
                //我能看的
                else
                {
                    listPrivDepartment.FindAll(item => item.TypeCode == typeCode).ForEach(item => allPrivDepartment.Add(item.DataCode));
                }

                //需要新增的数据，勾选的数据与数据库所有数据的差集
                List<int> listInsert = paramList.Except(allPrivDepartment).ToList();
                //能看我的
                if (privDepartmentData.ViewType == 2)
                {
                    listInsertPrivDepartment = listInsertPrivDepartment.Union(listInsert.Select(departOnlyCode => new Priv_Department()
                    {
                        DepartOnlyCode = departOnlyCode,
                        CityID = privDepartmentData.CityID,
                        PlatForm = 1,
                        TypeCode = typeCode,
                        DataCode = privDepartmentData.DataCode,
                        Creator = user.EmpCode
                    })).ToList();
                }
                //我能看的
                else
                {
                    listInsertPrivDepartment = listInsertPrivDepartment.Union(listInsert.Select(dataCode => new Priv_Department()
                    {
                        DepartOnlyCode = privDepartmentData.DepartOnlyCode,
                        CityID = privDepartmentData.CityID,
                        PlatForm = 1,
                        TypeCode = typeCode,
                        DataCode = dataCode,
                        Creator = user.EmpCode
                    })).ToList();
                }
                //需要修改为已选择的数据，勾选的数据与数据库所有数据的交集
                List<int> listSelected = paramList.Intersect(allPrivDepartment).ToList();
                //需要修改为未选择的数据，数据库所有数据与已选择数据的差集
                List<int> listCancel = allPrivDepartment.Except(listSelected).ToList();
                dicSelected.Add(typeCode, listSelected);
                dicCancel.Add(typeCode, listCancel);
            }
            privDepartmentDal.SavePrivDepartment(privDepartmentData, listInsertPrivDepartment.ToDataTable(), dicSelected, dicCancel, user);
            return msg;
        }
        /// <summary>
        /// 复制权限到门店
        /// </summary>
        /// <param name="privDepartmentData"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public ResultModel<object> CopyPrivDepartmentToOthers(Priv_DepartmentData privDepartmentData, UserInfoForCookie user)
        {
            var msg = new ResultModel<object>();
            List<int> InsertList = new List<int>(); // 新增
            List<int> UpdateList = new List<int>(); // IsDel=0
            List<int> DeleteList = new List<int>(); // IsDel=1
            Dictionary<int, List<int>> InsertListDic = new Dictionary<int, List<int>>();
            Dictionary<int, List<int>> UpdateListDic = new Dictionary<int, List<int>>();
            Dictionary<int, List<int>> DeleteListDic = new Dictionary<int, List<int>>();
            Priv_DepartmentDAL privDepartmentDal = new Priv_DepartmentDAL();
            var listInsertPrivDepartment = new List<Priv_Department>();
            var listPrivDepartment = privDepartmentDal.GetDataCodeList(privDepartmentData);
            foreach (var item in privDepartmentData.DepartOnlyCodeList)
            {
                List<int> allPrivDepartment = new List<int>();// 一个部门的 DataCode
                listPrivDepartment.FindAll(p => p.DepartOnlyCode == item).ForEach(p => allPrivDepartment.Add(p.DataCode));
                if (privDepartmentData.DataCodeList != null)
                {
                    InsertList = privDepartmentData.DataCodeList.Except(allPrivDepartment).ToList();
                    UpdateList = privDepartmentData.DataCodeList.Intersect(allPrivDepartment).ToList();
                    DeleteList = allPrivDepartment.Except(UpdateList).ToList();
                }
                UpdateListDic.Add(item, UpdateList);
                DeleteListDic.Add(item, DeleteList);
                listInsertPrivDepartment = listInsertPrivDepartment.Union(InsertList.Select(dataCode => new Priv_Department()
                {
                    DepartOnlyCode = item,
                    CityID = privDepartmentData.CityID,
                    PlatForm = 1,
                    TypeCode = privDepartmentData.TypeCode,
                    DataCode = dataCode,
                    Creator = user.EmpCode
                })).ToList();
            }
            privDepartmentDal.CopyPrivDepartmentToOthers(privDepartmentData, listInsertPrivDepartment.ToDataTable(), UpdateListDic, DeleteListDic, user);
            return msg;
        }
    }
}

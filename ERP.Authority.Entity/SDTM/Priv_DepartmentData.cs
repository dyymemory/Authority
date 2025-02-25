﻿using System.Collections.Generic;

namespace ERP.Authority.Entity.SDTM
{
    public class Priv_DepartmentData : Priv_Department
    {
        /// <summary>
        /// 查看客源(地理跨区)
        /// </summary>
        public List<int> AreaCustSel { get; set; }
        /// <summary>
        /// 资料房源
        /// </summary>
        public List<int> AreaFyInfo { get; set; }
        /// <summary>
        /// 录入房源(地理跨区)
        /// </summary>
        public List<int> AreaFyModify { get; set; }
        /// <summary>
        /// 查看房源(地理跨区)
        /// </summary>
        public List<int> AreaFySel { get; set; }
        /// <summary>
        /// 公共池房源看业主
        /// </summary>
        public List<int> DepCommonOwner { get; set; }
        /// <summary>
        /// 客源看跟进
        /// </summary>
        public List<int> DepCustFellow { get; set; }
        /// <summary>
        /// 查看客源(行政跨部)
        /// </summary>
        public List<int> DepCustSel { get; set; }
        /// <summary>
        /// 行政管辖
        /// </summary>
        public List<int> DepDivisitionSel { get; set; }
        /// <summary>
        /// 房源看跟进
        /// </summary>
        public List<int> DepFyFellow { get; set; }
        /// <summary>
        /// 查看房源（行政跨部）
        /// </summary>
        public List<int> DepFySel { get; set; }
        /// <summary>
        /// 私盘看业主
        /// </summary>
        public List<int> DepPrivateOwner { get; set; }
        /// <summary>
        /// 公盘看业主
        /// </summary>
        public List<int> DepPublicOwner { get; set; }

        /// <summary>
        /// 数据类型
        /// </summary>
        public List<string> TypeCodeList { get; set; }

        /// <summary>
        /// 查看类型 1.我能看的 2.能看我的
        /// </summary>
        public int ViewType { get; set; }
        /// <summary>
        /// 要复制的部门code
        /// </summary>
        public List<int> DataCodeList { get; set; }
        /// <summary>
        /// DepartOnlyCode集合
        /// </summary>
        public List<int> DepartOnlyCodeList { get; set; }
    }
}
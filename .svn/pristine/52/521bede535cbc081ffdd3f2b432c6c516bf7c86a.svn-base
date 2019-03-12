using System;
using System.Reflection;
using ERP.Authority.Entity.Attributes;

namespace ERP.Authority.Entity.SDTM
{
    public class Priv_Department
    {
        /// <summary>
        /// 对应的数据权限code，门店权限对应门店表的dept
        /// </summary>
        public long PrivDeptID { get; set; }

        /// <summary>
        /// 门店code
        /// </summary>
        public int DepartOnlyCode { get; set; }

        /// <summary>
        /// 城市ID
        /// </summary>
        public short CityID { get; set; }

        /// <summary>
        /// 平台
        /// </summary>
        public byte PlatForm { get; set; }

        /// <summary>
        /// 数据权限类型
        /// area-cust-sel:查看客源(地理跨区)
        /// area-fy-info:资料房源
        /// area-fy-modify:录入房源(地理跨区)
        /// area-fy-sel:查看房源(地理跨区)
        /// dep-common-owner:公共池房源看业主
        /// dep-cust-fellow:客源看跟进
        /// dep-cust-sel:查看客源(行政跨部)
        /// dep-divisition-sel:行政管辖
        /// dep-fy-fellow:房源看跟进
        /// dep-fy-sel:查看房源（行政跨部）
        /// dep-private-owner:私盘看业主
        /// dep-public-owner:公盘看业主
        /// </summary>
        public string TypeCode { get; set; }

        /// <summary>
        /// 数据权限，根据数据权限类型不同，code是门店code或者地理权限code
        /// </summary>
        public int DataCode { get; set; }

        /// <summary>
        /// 是否删除 0否 1是
        /// </summary>
        public byte IsDel { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public int Creator { get; set; }

        /// <summary>
        /// 修改人
        /// </summary>
        public int Modifier { get; set; }

    }
}
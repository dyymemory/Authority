namespace ERP.Authority.Entity.SDTM
{
    public class Priv_Employee
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public int PrivEmployeeID { get; set; }

        /// <summary>
        /// 员工Code
        /// </summary>
        public int EmpCode { get; set; }

        /// <summary>
        /// 城市
        /// </summary>
        public short CityID { get; set; }

        /// <summary>
        /// 平台
        /// </summary>
        public byte PlatForm { get; set; }

        /// <summary>
        /// 模块code使用逗号分隔
        /// </summary>
        public string ModulePrivList { get; set; }

        /// <summary>
        /// 数据权限
        /// </summary>
        public string DataPrivJson { get; set; }

        /// <summary>
        /// 是否删除 0否 1是
        /// </summary>
        public byte IsDel { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public int Creator { get; set; }

        ///// <summary>
        ///// 创建时间
        ///// </summary>
        //public System.DateTime CreateDate { get; set; }

        /// <summary>
        /// 修改人
        /// </summary>
        public int Modifier { get; set; }

        ///// <summary>
        ///// 修改时间
        ///// </summary>
        //public System.DateTime ModDate { get; set; }

    }
}
namespace ERP.Authority.Entity.SDTM
{
    public class E_MarketMenu
    {
        /// <summary>
        /// 
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// 菜单名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 菜单路径
        /// </summary>
        public string PathUrl { get; set; }

        /// <summary>
        /// 菜单类型[0导航 1功能按钮]
        /// </summary>
        public byte Type { get; set; }

        /// <summary>
        /// 父级菜单
        /// </summary>
        public int ParentID { get; set; }

        /// <summary>
        /// 菜单排序
        /// </summary>
        public byte Sort { get; set; }

        /// <summary>
        /// 是否删除[0否 1是]
        /// </summary>
        public byte IsDel { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public int Creator { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        public System.DateTime CreateDate { get; set; }

    }
}
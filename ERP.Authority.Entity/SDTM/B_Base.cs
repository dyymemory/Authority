namespace ERP.Authority.Entity.SDTM
{
    public class B_Base
    {
        /// <summary>
        /// 主键
        /// </summary>
        public int ID { get; set; }
        /// <summary>
        /// 分页编号
        /// </summary>
        public int Rows { get; set; }
        /// <summary>
        /// 是否删除 0否 1是
        /// </summary>
        public int IsDel { get; set; }
        /// <summary>
        /// 城市ID
        /// </summary>
        public int CityID { get; set; }
       
    }
}

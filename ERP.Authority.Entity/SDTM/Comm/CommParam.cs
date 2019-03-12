namespace ERP.Authority.Entity.SDTM.Comm
{
    public class CommParam : B_Base
    {
        private int _sort = 0;
        /// <summary>
        /// 排序
        /// </summary>
        public int Sort
        {
            set { _sort = value; }
            get { return _sort; }
        }
    }
}

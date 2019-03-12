namespace ERP.Authority.Entity.SDTM
{
    /// <summary>
    /// 城市表
    /// </summary>
    public partial class B_City
    {
        public B_City()
        { }
        #region Model
        private int _id;
        private int _cityid;
        private string _cityname;
        private string _pinyin = "";
        private decimal _longitude = 0;
        private decimal _latitude = 0;
        private string _erpdatabase = "";
        private int _sort = 0;
        private int _isdel = 0;
        private string _createdate = "";
        /// <summary>
        /// 主键ID
        /// </summary>
        public int ID
        {
            set { _id = value; }
            get { return _id; }
        }
        /// <summary>
        /// 城市ID
        /// </summary>
        public int CityID
        {
            set { _cityid = value; }
            get { return _cityid; }
        }
        /// <summary>
        /// 城市名称
        /// </summary>
        public string CityName
        {
            set { _cityname = value; }
            get
            {
                if (string.IsNullOrEmpty(_cityname))
                {
                    _cityname = "";
                } return _cityname;
            }
        }
        /// <summary>
        /// 全拼
        /// </summary>
        public string PinYin
        {
            set { _pinyin = value; }
            get
            {
                if (string.IsNullOrEmpty(_pinyin))
                {
                    _pinyin = "";
                } return _pinyin;
            }
        }
        /// <summary>
        /// 经度
        /// </summary>
        public decimal Longitude
        {
            set { _longitude = value; }
            get { return _longitude; }
        }
        /// <summary>
        /// 纬度
        /// </summary>
        public decimal Latitude
        {
            set { _latitude = value; }
            get { return _latitude; }
        }
        /// <summary>
        /// ERP数据库连接
        /// </summary>
        public string ERPDataBase
        {
            set { _erpdatabase = value; }
            get
            {
                if (string.IsNullOrEmpty(_erpdatabase))
                {
                    _erpdatabase = "";
                } return _erpdatabase;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        public int Sort
        {
            set { _sort = value; }
            get { return _sort; }
        }
        /// <summary>
        /// 0未删除 1删除
        /// </summary>
        public int IsDel
        {
            set { _isdel = value; }
            get { return _isdel; }
        }
        /// <summary>
        /// 
        /// </summary>
        public string CreateDate
        {
            set { _createdate = value; }
            get
            {
                if (string.IsNullOrEmpty(_createdate))
                {
                    _createdate = "";
                } return _createdate;
            }
        }
        #endregion Model

    }
}

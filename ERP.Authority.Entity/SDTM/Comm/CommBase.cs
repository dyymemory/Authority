namespace ERP.Authority.Entity.SDTM.Comm
{
    public class CommBase
    {
        private string _modifyDate = "";
        /// <summary>
        /// 修改时间
        /// </summary>
        public string ModifyDate
        {
            set { _modifyDate = value; }
            get
            {
                if (string.IsNullOrEmpty(_modifyDate))
                {
                    _modifyDate = "";
                }
                return _modifyDate;
            }
        }

        private string _createDate = "";
        /// <summary>
        /// 创建时间
        /// </summary>
        public string CreateDate
        {
            set { _createDate = value; }
            get
            {
                if (string.IsNullOrEmpty(_createDate))
                {
                    _createDate = "";
                }
                return _createDate;
            }
        }

        private int _modifier = 0;
        /// <summary>
        /// 修改人
        /// </summary>
        public int Modifier
        {
            set { _modifier = value; }
            get { return _modifier; }
        }

        private int _creator = 0;
        /// <summary>
        /// 创建人
        /// </summary>
        public int Creator
        {
            set { _creator = value; }
            get { return _creator; }
        }
    }
}

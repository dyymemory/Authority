namespace ERP.Authority.Entity.SDTM
{
    public class U_User : B_Base
    {
        public int EmpCode { get; set; }

        public string EmpID { get; set; }

        public string DeptID { get; set; }

        public string PositionID { get; set; }

#pragma warning disable CS0108 // “U_User.CityID”隐藏继承的成员“B_Base.CityID”。如果是有意隐藏，请使用关键字 new。
        public int CityID { get; set; }
#pragma warning restore CS0108 // “U_User.CityID”隐藏继承的成员“B_Base.CityID”。如果是有意隐藏，请使用关键字 new。

        private string cityName = "";
        /// <summary>
        /// 城市名称
        /// </summary>
        public string CityName
        {
            get
            {
                if (string.IsNullOrEmpty(cityName))
                {
                    cityName = "";
                }
                return cityName;
            }
            set { cityName = value; }
        }

        private string empName = "";
        /// <summary>
        /// 用户名称
        /// </summary>
        public string EmpName
        {
            get
            {
                if (string.IsNullOrEmpty(empName))
                {
                    empName = "";
                }
                return empName;
            }
            set { empName = value; }
        }

        private string pwd = "";
        /// <summary>
        /// 密码
        /// </summary>
        public string Pwd
        {
            get
            {
                if (string.IsNullOrEmpty(pwd))
                {
                    pwd = "";
                }
                return pwd;
            }
            set { pwd = value; }
        }

        private string mobile = "";
        /// <summary>
        /// 用户手机号
        /// </summary>
        public string Mobile
        {
            get
            {
                if (string.IsNullOrEmpty(mobile))
                {
                    mobile = "";
                }
                return mobile;
            }
            set { mobile = value; }
        }

        private string staffImage = "";
        /// <summary>
        /// 头像
        /// </summary>
        public string StaffImage
        {
            get
            {
                if (string.IsNullOrEmpty(staffImage))
                {
                    staffImage = "";
                }
                return staffImage;
            }
            set { staffImage = value; }
        }
        /// <summary>
        /// 是否系统管理员
        /// </summary>
        public bool IsAdmin { get; set; }
    }
}

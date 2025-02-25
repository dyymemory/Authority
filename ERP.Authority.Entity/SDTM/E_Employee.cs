﻿namespace ERP.Authority.Entity.SDTM
{
    public class E_Employee
    {
        public E_Employee() { }

        private int _cityID = 0;
        /// <summary>
        /// 城市ID
        /// </summary>
        public int CityID
        {
            get { return _cityID; }
            set { _cityID = value; }
        }

        /// <summary>
        /// 部门Code 自增长
        /// </summary>
        public int DepartOnlyCode { get; set; }

        private string _deptID;
        /// <summary>
        /// 部门ID
        /// </summary>
        public string DeptID
        {
            get { return _deptID; }
            set { _deptID = value; }
        }

        private string _deptName;
        /// <summary>
        /// 部门名称
        /// </summary>
        public string DeptName
        {
            get
            {
                if (string.IsNullOrEmpty(_deptName))
                {
                    _deptName = "";
                }
                return _deptName;
            }
            set { _deptName = value; }
        }
        /// <summary>
        /// 员工自增长ID
        /// </summary>
        public int EmpCode { get; set; }
        private string _empID;
        /// <summary>
        /// 员工ID主键ID
        /// </summary>
        public string EmpID
        {
            get { if (string.IsNullOrEmpty(_empID)) { _empID = ""; } return _empID; }
            set { _empID = value; }
        }

        private string _empNo;
        /// <summary>
        /// 员工编号
        /// </summary>
        public string EmpNo
        {
            get { if (string.IsNullOrEmpty(_empNo)) { _empNo = ""; } return _empNo; }
            set { _empNo = value; }
        }
        private string _empName;
        /// <summary>
        /// 员工姓名
        /// </summary>
        public string EmpName
        {
            get { if (string.IsNullOrEmpty(_empName)) { _empName = ""; } return _empName; }
            set { _empName = value; }
        }

        private string _password;
        /// <summary>
        /// 密码
        /// </summary>
        public string PassWord
        {
            get { if (string.IsNullOrEmpty(_password)) { _password = ""; } return _password; }
            set { _password = value; }
        }
        private string _mobile;
        /// <summary>
        /// 手机号
        /// </summary>
        public string Mobile
        {
            get { if (string.IsNullOrEmpty(_mobile)) { _mobile = ""; } return _mobile; }
            set { _mobile = value; }
        }

        private string _positionID;
        /// <summary>
        /// 职位ID
        /// </summary>
        public string PositionID
        {
            get { return _positionID; }
            set { _positionID = value; }
        }
        /// <summary>
        /// 职位Code 自增长
        /// </summary>
        public int PositionCode { get; set; }
        /// <summary>
        /// 职务名称
        /// </summary>
        public string PositionName { get; set; }
        /// <summary>
        /// ERP职务角色
        /// </summary>
        public int PositionRole { get; set; }
        /// <summary>
        /// 角色名称	string	
        /// </summary>
        public string PositionRoleName { get; set; }
        /// <summary>
        /// ERP 人员角色
        /// </summary>
        public int EmpRole { get; set; }

        /// <summary>
        /// 序号
        /// </summary>
        public int RowNum { get; set; }

        /// <summary>
        /// 操作人（部门-名称）
        /// </summary>
        public string CreatorName { get; set; }

        /// <summary>
        /// 操作人ID
        /// </summary>
        public int CreatorID { get; set; }

        /// <summary>
        /// 是否有权限 1.是 2.否
        /// </summary>
        public int IsAnyAuthority { get; set; }

        /// <summary>
        /// 平台 1.U+ 2.签约中心 3.权限系统
        /// </summary>
        public int PlatForm { get; set; }
    }
}

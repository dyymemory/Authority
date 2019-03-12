using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.Entity.Attributes
{
    /// <summary>
    /// 跳过所有验证
    /// </summary>
    [AttributeUsage(AttributeTargets.All)]
    public class SkipValidateAttribute : Attribute
    {

    }
    /// <summary>
    /// 跳过用户是否有效验证
    /// </summary>
    public class AnonymousAttribute : Attribute
    {

    }
    /// <summary>
    /// 跳过签名认证
    /// </summary>
    public class SkipSignValidateAttribute : Attribute
    { 
    
    }
    /// <summary>
    /// 设置功能菜单权限所属对象
    /// </summary>
    public class MenuBelongedAttribute : Attribute
    {
        /// <summary>
        /// 所属对象
        /// </summary>
        public string BeLonged { get; set; }
    }
}
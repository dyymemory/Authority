using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.Entity.Attributes
{
    /// <summary>
    /// 枚举
    /// </summary>
    public class EnumDescribeAttribute : Attribute
    {
        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }
    }
}

using ERP.Authority.Entity.Attributes;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.Entity.Enums
{
    /// <summary>
    /// 获取枚举描述信息
    /// </summary>
    public class EnumDescription
    {
        /// <summary>
        /// 枚举类型转成字典类型
        /// </summary>
        /// <param name="type">枚举类型</param>
        /// <param name="ValueOrName">取值或名称[0值 1名称]</param>
        /// <returns></returns>
        public static IDictionary<object, object> GetEnumsDic(Type type, int ValueOrName = 0)
        {
            IDictionary<object, object> dic = new Dictionary<object, object>();
            if (type != null)
            {
                foreach (var item in Enum.GetValues(type))
                {
                    EnumDescribeAttribute[] customAttributes = (EnumDescribeAttribute[])item.GetType().GetField(item.ToString()).GetCustomAttributes(typeof(EnumDescribeAttribute), true);
                    if (customAttributes != null && customAttributes.Any())
                    {
                        switch (ValueOrName)
                        {
                            case 0:
                                dic.Add((int)item, customAttributes.First().Description);
                                break;
                            case 1:
                                dic.Add(item.ToString(), customAttributes.First().Description);
                                break;
                        }
                    }
                }
            }
            return dic;
        }
        /// <summary>
        /// 获取枚举描述信息
        /// 通过枚举名称
        /// </summary>
        /// <param name="type">枚举类型</param>
        /// <param name="enumName">枚举名称</param>
        /// <returns>返回描述信息</returns>
        public static string GetDescriptionForEnumsName(Type type, string enumName)
        {
            try
            {
                EnumDescribeAttribute[] customAttributes = (EnumDescribeAttribute[])type.GetField(enumName).GetCustomAttributes(typeof(EnumDescribeAttribute), true);
                if (customAttributes != null && customAttributes.Any())
                {
                    return customAttributes.First().Description;
                }
            }
            catch
            {
            }
            return "";
        }
        /// <summary>
        /// 获取枚举描述信息
        /// 通过枚举值
        /// </summary>
        /// <param name="type">枚举类型</param>
        /// <param name="enumName">枚举值</param>
        /// <returns>返回描述信息</returns>
        public static string GetDescriptionForEnumsValue(Type type, int enumValue)
        {
            try
            {
                EnumDescribeAttribute[] customAttributes = (EnumDescribeAttribute[])type.GetField(type.GetEnumName(enumValue)).GetCustomAttributes(typeof(EnumDescribeAttribute), true);
                if ((customAttributes != null) && (customAttributes.Length >= 1))
                {
                    return customAttributes[0].Description;
                }
            }
            catch
            {
            }
            return "";
        }
        /// <summary>
        /// 获取枚举对应的值
        /// </summary>
        /// <param name="type">枚举类型</param>
        /// <param name="enumName">枚举值</param>
        /// <returns>返回描述信息</returns>
        public static int GetValueForEnumsDescription(Type type, string enumDescription)
        {
            try
            {
                if (type != null)
                {
                    foreach (var item in Enum.GetValues(type))
                    {
                        EnumDescribeAttribute[] customAttributes = (EnumDescribeAttribute[])item.GetType().GetField(item.ToString()).GetCustomAttributes(typeof(EnumDescribeAttribute), true);
                        if (customAttributes != null && customAttributes.Any())
                        {
                            if (customAttributes.First().Description == enumDescription)
                            {
                                return (int)item;
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            return 0;
        }
        /// <summary>
        /// 获取枚举值 获取枚举名称
        /// </summary>
        /// <param name="type"></param>
        /// <param name="enumValue"></param>
        /// <returns></returns>
        public static string GetNameForEnumsValue(Type type, int enumValue)
        {
            string name = string.Empty;
            try
            {
                name = Enum.GetName(type, enumValue);
            }
            catch (Exception)
            {
            }
            return name;
        }
        /// <summary>
        /// 获取枚举对应的值 通过枚举名称
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="tyep"></param>
        /// <param name="name"></param>
        /// <param name="defaultvalue">若匹配不到默认返回值</param>
        /// <returns></returns>
        public static int GetValueForEnumsName<T>(string name, int defaultvalue = 0) where T : struct
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                T reuslt;
                if (Enum.TryParse(name, out reuslt))
                {
                    return int.Parse(Enum.Format(typeof(T), Enum.Parse(typeof(T), name), "D"));
                }
            }
            return defaultvalue;
        }
        /// <summary>
        /// 由枚举值得到此枚举特性对象
        /// </summary>
        /// <typeparam name="T">特性对象</typeparam>
        /// <param name="t">当前枚举</param>
        /// <param name="value">枚举值</param>
        /// <returns>特性对象</returns>
        public static T GetEnumsAttribute<T>(Type type, int value)
        {
            if (type.GetEnumName(value) == null)
                return default(T);
            return (T)type.GetField(type.GetEnumName(value)).GetCustomAttributes(typeof(T), true).FirstOrDefault();
        }

    }
}

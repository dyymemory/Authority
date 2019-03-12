using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using ERP.Authority.Entity.Attributes;

namespace ERP.Authority.General
{
    public static class DataTableExtension
    {
        public static DataTable ToDataTable<T>(this IEnumerable<T> list, string tableName = null) where T : new()
        {
            DataTable dt = new DataTable();
            if (list == null || !list.Any())
            {
                return dt;
            }
            //创建属性的集合    
            List<PropertyInfo> pList = new List<PropertyInfo>();
            //获得反射的入口    
            Type type = typeof(T);

            dt.TableName = string.IsNullOrEmpty(tableName) ? type.Name : tableName;

            //把所有的public属性加入到集合 并添加DataTable的列    
            Array.ForEach<PropertyInfo>(type.GetProperties(), p =>
            {
                pList.Add(p);
                var propertyTypeAttrbute = (PropertyTypeAttribute[])p.GetCustomAttributes(typeof(PropertyTypeAttribute), false);
                if (propertyTypeAttrbute.Length > 0 && propertyTypeAttrbute[0].PropertyType == typeof(DateTime))
                {
                    dt.Columns.Add(p.Name, propertyTypeAttrbute[0].PropertyType);
                }
                else
                {
                    dt.Columns.Add(p.Name, p.PropertyType);
                }

            });
            foreach (var item in list)
            {
                //创建一个DataRow实例    
                DataRow row = dt.NewRow();
                //给row 赋值    
                pList.ForEach(p =>
                {
                    var obj = item.GetType().GetProperty(p.Name).GetValue(item, null);
                    if (obj != null && !string.IsNullOrEmpty(obj.ToString()))
                    {
                        row[p.Name] = obj;
                    }
                    else
                    {
                        var propertyTypeAttrbute = (PropertyTypeAttribute[])p.GetCustomAttributes(typeof(PropertyTypeAttribute), false);
                        if (propertyTypeAttrbute.Length > 0 && propertyTypeAttrbute[0].PropertyType == typeof(DateTime))
                        {
                            row[p.Name] = DateTime.Now;
                        }
                        else
                        {
                            row[p.Name] = "";
                        }
                    }
                });
                //加入到DataTable    
                dt.Rows.Add(row);
            }
            return dt;
        }
    }
}
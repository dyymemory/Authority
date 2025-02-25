﻿using ERP.Authority.Entity.GlobalVariable;
using ERP.Authority.Entity.SDTMComm;
using Jijia.Infrastructure.BasicOperations;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Authority.General
{
    public class WebConfigOperation
    {
        #region 错误日志相关配置
        /// <summary>
        /// 项目编号
        /// </summary>
        public static int ProjectID
        {
            get
            {
                return int.Parse(ConfigurationManager.AppSettings["ProjectID"].ToString());
            }
        }
        /// <summary>
        /// 用户编号
        /// </summary>
        public static int UserID
        {
            get
            {
                return int.Parse(ConfigurationManager.AppSettings["UserID"].ToString());
            }
        }

        /// <summary>
        /// 系统管理员手机号
        /// </summary>
        public static bool IsAdmin(string mobile)
        {
            return ConfigurationManager.AppSettings["AdminMobile"].Split(',').Contains(mobile);
        }
        #endregion
        #region 获取JOSN配置信息
        /// <summary>
        /// 配置项路经
        /// </summary>
        private static string ConfigPath
        {
            get
            {
                return Path.Combine(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath, ConfigurationManager.AppSettings["ConfigPath"].ToString());
            }
        }
        /// <summary>
        /// 获取配置信息
        /// </summary>
        public static ConfigModel Config
        {
            get
            {
                return GetUplusConfig();
            }
        }

        public static double CacheTime
        {
            get
            {
                return Convert.ToDouble(ConfigurationManager.AppSettings["CacheTime"]);
            }
        }

        /// <summary>
        /// 权限配置信息
        /// </summary>
        private static ConfigModel GetUplusConfig(double minutes = 1440)
        {
            return BasicOperationJsonObject.GetJsonObject<ConfigModel>(ConstCacheKey.ERPAUTHORITYCACHEKEY, ConfigPath, minutes);
        }
        #endregion

    }
}

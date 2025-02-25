﻿using ERP.Authority.Entity.Attributes;
using System;

namespace ERP.Authority.Entity.SDTM
{
    public class Priv_Module
    {
        /// <summary>
        /// 主键ID
        /// </summary>
        public int Priv_ModuleID { get; set; }

        /// <summary>
        /// 模块权限code
        /// </summary>
        public string ModuleCode { get; set; }

        /// <summary>
        /// 模块权限名称
        /// </summary>
        public string ModuleName { get; set; }

        /// <summary>
        /// 平台
        /// </summary>
        public byte PlatForm { get; set; }

        /// <summary>
        /// 1.PC  2.APP  3.APP/PC共享
        /// </summary>
        public byte TypeInt { get; set; }

        /// <summary>
        /// 1 模块权限 2数据模块权限（公客看、私客看等） 3数据权限（查看房源、查看客源）
        /// </summary>
        public byte ModuleType { get; set; }

        /// <summary>
        /// 上级权限code
        /// </summary>
        public string ParentCode { get; set; }

        /// <summary>
        /// 接口路由地址(/Controller/Action)
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// 是否删除 0否 1是
        /// </summary>
        public byte IsDel { get; set; }

        /// <summary>
        /// 创建人
        /// </summary>
        public int Creator { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        //[PropertyType(PropertyType = typeof(DateTime))]
        public System.DateTime CreateDate { get; set; }

        /// <summary>
        /// 修改人
        /// </summary>
        public int Modifier { get; set; }

        /// <summary>
        /// 修改时间
        /// </summary>
        public System.DateTime ModDate { get; set; }

    }
}
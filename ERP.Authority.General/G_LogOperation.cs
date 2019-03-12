using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zfkr_Log4Net;
using Jijia.Infrastructure.Extensions;

namespace ERP.Authority.General
{
    public class G_LogOperation
    {
        /// <summary>
        /// 接口开始执行时间
        /// </summary>
        public DateTime BeginTime { get; set; }
        /// <summary>
        /// 错误内容
        /// </summary>
        public LogContent ErrorInfo { get; set; }
        public G_LogOperation()
        {
            ErrorInfo = new LogContent()
            {
                ProjectID = WebConfigOperation.ProjectID,
                UserID = WebConfigOperation.UserID
            };
        }
        /// <summary>
        /// 错误内容构造函数
        /// </summary>
        /// <param name="method">方法</param>
        /// <param name="pageUrl">地址</param>
        /// <param name="rqUserAgent">参数信息</param>
        public G_LogOperation(string method, string pageUrl, string rqUserAgent)
        {
            ErrorInfo = new LogContent()
            {
                ProjectID = WebConfigOperation.ProjectID,
                UserID = WebConfigOperation.UserID,
                Method = method,
                PageUrl = pageUrl,
                RqUserAgent = rqUserAgent
            };
        }
        /// <summary>
        /// 致命的错误
        /// </summary>
        /// <param name="ex"></param>
        public void FatalLog(Exception ex)
        {
            LogHelper.FatalLog(ErrorInfo, ex);
        }
        /// <summary>
        /// 致命的错误-详细信息
        /// </summary>
        /// <param name="ex"></param>
        public void FatalLog(string ex)
        {
            LogHelper.FatalLog(ErrorInfo, new Exception(ex.ToString()));
        }
        /// <summary>
        /// 错误信息
        /// </summary>
        /// <param name="ex"></param>
        public void ErrorLog(Exception ex)
        {
            LogHelper.ErrorLog(ErrorInfo, ex);
        }
        /// <summary>
        /// 禁告
        /// </summary>
        /// <param name="ex"></param>
        public void WarnLog(Exception ex)
        {
            LogHelper.WarnLog(ErrorInfo, ex);
        }
        /// <summary>
        /// 一般日志信息
        /// </summary>
        /// <param name="msg">参数信息</param>
        /// <param name="ex"></param>
        public void InfoLog<T>(T msg)
        {
            #region 记录执行时间
            string apiexceTime = string.Empty;
            if (BeginTime.IsDefaultValue() != null)
            {
                TimeSpan ts = DateTime.Now - BeginTime;
                apiexceTime = string.Format("耗时{0}分,{1}秒,{2}毫秒", ts.Minutes, ts.Seconds, ts.Milliseconds);
            }
            #endregion
            if (msg.GetType() != typeof(string))
            {
                LogHelper.InfoLog(ErrorInfo, new Exception(apiexceTime + JsonConvert.SerializeObject(msg)));
            }
            else
            {
                LogHelper.InfoLog(ErrorInfo, new Exception(apiexceTime + msg.ToString()));
            }
        }
        /// <summary>
        /// Debug
        /// </summary>
        /// <param name="ex"></param>
        public void DebugLog(Exception ex)
        {
            LogHelper.DebugLog(ErrorInfo, ex);
        }
    }
}

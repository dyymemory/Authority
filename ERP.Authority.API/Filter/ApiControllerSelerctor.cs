using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Dispatcher;
using System.Web.Http.Routing;

namespace ERP.Authority.API.Filter
{
    /// <summary>
    /// controller 
    /// 选择器
    /// </summary>
    public class ApiControllerSelerctor : IHttpControllerSelector
    {
        /// <summary>
        /// 版本信息
        /// </summary>
        private const string Version = "ERPVersion";
        private readonly HttpConfiguration _configuration;
        /// <summary>
        /// 延迟加载
        /// </summary>
        private readonly Lazy<Dictionary<string, HttpControllerDescriptor>> _controllers;
        private readonly HashSet<string> _duplicates;

        public ApiControllerSelerctor(HttpConfiguration config)
        {
            _configuration = config;
            _duplicates = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            _controllers = new Lazy<Dictionary<string, HttpControllerDescriptor>>(InitializeController);
        }
        /// <summary>
        /// 通过返回基于命名空间的控制器描述符来实现查找
        /// </summary>
        /// <returns></returns>
        private Dictionary<string, HttpControllerDescriptor> InitializeController()
        {
            var dictionary = new Dictionary<string, HttpControllerDescriptor>(StringComparer.OrdinalIgnoreCase);
            IAssembliesResolver assembliesResolver = _configuration.Services.GetAssembliesResolver();
            IHttpControllerTypeResolver controllersResolver = _configuration.Services.GetHttpControllerTypeResolver();
            ICollection<Type> controllerTypes = controllersResolver.GetControllerTypes(assembliesResolver);
            if (controllerTypes != null)
            {
                foreach (Type t in controllerTypes)
                {
                    var segments = t.Namespace.Split(Type.Delimiter);
                    var controllerName = t.Name.Remove(t.Name.Length - DefaultHttpControllerSelector.ControllerSuffix.Length);
                    string version = segments[segments.Length - 1];
                    var key = version.Equals("Controllers") ? string.Format(CultureInfo.InvariantCulture, "{0}", controllerName) : string.Format(CultureInfo.InvariantCulture, "{0}.{1}", version, controllerName);
                    if (dictionary.Keys.Contains(key))
                    {
                        _duplicates.Add(key);
                    }
                    else
                    {
                        dictionary[key] = new HttpControllerDescriptor(_configuration, t.Name, t);
                    }
                }
            }
            if (_duplicates != null)
            {
                foreach (string s in _duplicates)
                {
                    dictionary.Remove(s);
                }
            }
            return dictionary;
        }

        /// <summary>
        /// 从路由数据,获取一个值
        /// 默认路由版本高于Controller
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="routeData"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        private static T GetRouteVariable<T>(IHttpRouteData routeData, string name)
        {
            object result = null;
            if (routeData.Values.TryGetValue(name, out result))
            {
                return (T)result;
            }
            return default(T);
        }

        /// <summary>
        /// 对应于自定义控制选择器的命名空间,
        /// 将从HTTP请求消息中获取命名空间和控制器
        /// 然后在字典中查找匹配的控制器
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public HttpControllerDescriptor SelectController(HttpRequestMessage request)
        {
            IHttpRouteData routeData = request.GetRouteData();
            if (routeData == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            //获取版本号
            string version = GetRouteVariable<string>(routeData, Version);
            if (string.IsNullOrEmpty(version))
            {
                version = GetRequestVersion(request);
            }
            //从Route中读取命名空间名称和控制器名称
            string controllerName = GetRouteVariable<string>(routeData, "controller");
            if (controllerName == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            // 找到一个匹配的控制器
            string controller = string.IsNullOrEmpty(version) ? string.Format(CultureInfo.InvariantCulture, "{0}", controllerName) : string.Format(CultureInfo.InvariantCulture, "{0}.{1}", version, controllerName);

            HttpControllerDescriptor controllerDescriptor;
            if (_controllers.Value.TryGetValue(controller, out controllerDescriptor))
            {
                return controllerDescriptor;
            }
            else if (_duplicates.Contains(controller))
            {
                throw new HttpResponseException(
                    request.CreateErrorResponse(HttpStatusCode.InternalServerError,"请检查路由配置"));
            }
            else
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }

        public IDictionary<string, HttpControllerDescriptor> GetControllerMapping()
        {
            return _controllers.Value;
        }
        /// <summary>
        /// 获取请求版本信息
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        private string GetRequestVersion(HttpRequestMessage request)
        {
            if (request.Headers.Contains(Version))
            {
                var versionHeader = request.Headers.GetValues(Version).FirstOrDefault();
                if (versionHeader != null)
                {
                    return versionHeader;
                }
            }
            return string.Empty;
        }
    }
}
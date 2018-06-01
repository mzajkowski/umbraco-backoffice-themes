using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Http;
using Our.Umbraco.BackofficeThemes.Models;
using Umbraco.Core.IO;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;

namespace Our.Umbraco.InnerContent.Web.Controllers
{
    [PluginController("BackofficeThemes")]
    public class BackofficeThemesApiController : UmbracoAuthorizedJsonController
    {
        [HttpGet]
        public IEnumerable<object> GetThemes()
        {
            var basePath = "~/App_Plugins/BackofficeThemes/css/";
            var path = IOHelper.MapPath(basePath);

            if (Directory.Exists(path) == false)
                return null;

            var files = Directory.GetFiles(path, "*.css");
            if (files == null || files.Length == 0)
                return null;

            var baseUrl = IOHelper.ResolveUrl(basePath);

            return files
                .Select(x => ThemeInfo.Parse(x, baseUrl));
        }
    }
}
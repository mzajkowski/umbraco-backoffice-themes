using System.IO;
using Umbraco.Core;

namespace Our.Umbraco.BackofficeThemes.Models
{
    internal class ThemeInfo
    {
        public string alias { get; set; }
        public string title { get; set; }
        public string path { get; set; }
        public string thumbnail { get; set; }
        public string description { get; set; }
        public string version { get; set; }

        public static ThemeInfo Parse(string file, string baseUrl)
        {
            if (File.Exists(file) == false)
                return null;

            var alias = Path.GetFileNameWithoutExtension(file);
            var title = alias.ToFirstUpperInvariant();
            var path = baseUrl + Path.GetFileName(file);
            var thumbnail = baseUrl.Replace("/css/", "/img/") + alias + ".png";
            string description = null, version = null;

            var lines = File.ReadAllLines(file);
            for (int i = 0; i < lines.Length; i++)
            {
                var line = lines[i];

                // the first line must been an opening comment
                if (i == 0 && line.StartsWith("/*") == false)
                    return null;

                // as soon as we reach a closing comment, exit
                if (line.StartsWith("*/"))
                    break;

                if (line.InvariantStartsWith("Theme Name:"))
                    title = line.Substring("Theme Name:".Length).Trim();

                if (line.InvariantStartsWith("Description:"))
                    description = line.Substring("Description:".Length).Trim();

                if (line.InvariantStartsWith("Version:"))
                    version = line.Substring("Version:".Length).Trim();
            }

            return new ThemeInfo
            {
                alias = alias,
                title = title,
                path = path,
                thumbnail = thumbnail,
                description = description,
                version = version
            };
        }
    }
}

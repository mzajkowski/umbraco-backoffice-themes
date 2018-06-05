using System.IO;
using Newtonsoft.Json;
using Umbraco.Core;

namespace Our.Umbraco.BackofficeThemes.Models
{
    internal class ThemeInfo
    {
        [JsonProperty("alias")]
        public string Alias { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("path")]
        public string Path { get; set; }

        [JsonProperty("thumbnail")]
        public string Thumbnail { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("version")]
        public string Version { get; set; }

        public static ThemeInfo Parse(string file, string baseUrl)
        {
            if (File.Exists(file) == false)
                return null;

            var alias = System.IO.Path.GetFileNameWithoutExtension(file);
            var title = alias.ToFirstUpperInvariant();
            var path = baseUrl + System.IO.Path.GetFileName(file);
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
                Alias = alias,
                Title = title,
                Path = path,
                Thumbnail = thumbnail,
                Description = description,
                Version = version
            };
        }
    }
}

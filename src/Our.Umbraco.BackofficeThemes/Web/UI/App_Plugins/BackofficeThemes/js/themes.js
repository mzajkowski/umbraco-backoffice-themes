angular.module("umbraco").controller("Our.Umbraco.BackofficeThemes.Controllers.DashboardController", [
    "$scope",
    "Our.Umbraco.BackofficeThemes.Services",
    function ($scope, backofficeThemesService) {

        var vm = this;

        vm.version = "0.1.0";

        vm.themes = [
            {
                alias: "default",
                title: "Default (7.6+)",
                path: "",
                thumbnail: "/App_Plugins/BackofficeThemes/img/default.png",
                description: ""
            },
            {
                alias: "vintage",
                title: "Vintage (7.x)",
                path: "",
                thumbnail: "/App_Plugins/BackofficeThemes/img/vintage.png",
                description: ""
            },
            {
                alias: "hacker",
                title: "Hacker",
                path: "/App_Plugins/BackofficeThemes/css/hacker.css",
                thumbnail: "/App_Plugins/BackofficeThemes/img/hacker.png",
                description: "Hack The Planet!"
            },
            {
                alias: "dark",
                title: "Dark",
                path: "",
                thumbnail: "//placehold.it/144x66?text=!",
                description: ""
            }
        ];

        vm.setTheme = function (theme) {
            backofficeThemesService.setTheme(theme);
        };

    }
]);

angular.module("umbraco.services").factory("Our.Umbraco.BackofficeThemes.Services", [
    "assetsService",
    "notificationsService",
    "localStorageService",
    function (assetsService, notificationsService, localStorageService) {

        var service = {

            getTheme: function () {
                return localStorageService.get("backofficeTheme");
            },

            loadCss: function (id, path) {
                // check that the stylesheet tag exists, if not create it.
                var $css = $("#" + id);
                if ($css.length === 0) {
                    $("head").append("<link id=\"" + id + "\" rel=\"stylesheet\" type=\"text/css\" class=\"lazyload\" href=\"" + path + "\" />");
                } else {
                    $css.attr("href", path);
                }
            },

            loadTheme: function (theme) {
                if (!!theme.path) {
                    service.loadCss("backoffice-theme-css", theme.path);
                } else {
                    notificationsService.error("loadTheme", theme.alias);
                }
            },

            setTheme: function (theme) {
                if (!!theme.path) {
                    localStorageService.set("backofficeTheme", theme);
                    service.loadTheme(theme);
                    notificationsService.success("setTheme", theme.alias);
                } else {
                    notificationsService.error("setTheme", theme.alias);
                }
            },

        };

        return service;
    }
]);

// TODO: Find out if there's a better way of loading up the theme CSS
angular.module("umbraco").run([
    "$rootScope",
    "Our.Umbraco.BackofficeThemes.Services",
    function ($rootScope, service) {
        $rootScope.$on("$viewContentLoaded", function (event) {
            var theme = service.getTheme();
            service.loadTheme(theme);
        });
    }
]);

angular.module("umbraco").controller("Our.Umbraco.BackofficeThemes.Controllers.DashboardController", [
    "$scope",
    "Our.Umbraco.BackofficeThemes.Resources",
    "Our.Umbraco.BackofficeThemes.Services",
    function ($scope, backofficeThemesResources, backofficeThemesService) {

        var vm = this;

        vm.version = "0.2.1";

        backofficeThemesResources.getThemes().then(function (themes) {
            vm.themes = themes;
        });

        vm.currentTheme = backofficeThemesService.getTheme();

        vm.clearCurrentTheme = function () {
            backofficeThemesService.unloadTheme();
            vm.currentTheme = null;
        };

        vm.setTheme = function (theme) {
            backofficeThemesService.setTheme(theme);
            vm.currentTheme = theme;
        };

    }
]);

angular.module("umbraco.resources").factory("Our.Umbraco.BackofficeThemes.Resources",
    function ($q, $http, umbRequestHelper) {
        return {
            getThemes: function (data, pageId) {
                return umbRequestHelper.resourcePromise(
                    $http({
                        url: "/umbraco/backoffice/BackofficeThemes/BackofficeThemesApi/GetThemes",
                        method: "GET"
                    }),
                    "Failed to retrieve themes"
                );
            }
        };
    });

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
                if (!!theme) {
                    if (!!theme.path) {
                        service.loadCss("backoffice-theme-css", theme.path);
                    } else {
                        notificationsService.error("loadTheme", theme.alias);
                    }
                }
            },

            setTheme: function (theme) {
                if (!!theme) {
                    if (!!theme.path) {
                        localStorageService.set("backofficeTheme", theme);
                        service.loadTheme(theme);
                        notificationsService.success("setTheme", theme.alias);
                    } else {
                        notificationsService.error("setTheme", theme.alias);
                    }
                }
            },

            unloadCss: function (id) {
                $("#" + id).remove();
            },

            unloadTheme: function () {
                localStorageService.remove("backofficeTheme");
                service.unloadCss("backoffice-theme-css");
                notificationsService.success("unloadTheme");
            },

        };

        return service;
    }
]);

angular.module("umbraco").run([
    "$rootScope",
    "Our.Umbraco.BackofficeThemes.Services",
    function ($rootScope, backofficeThemesService) {
        $rootScope.$on("$viewContentLoaded", function (event) {
            var theme = backofficeThemesService.getTheme();
            backofficeThemesService.loadTheme(theme);
        });
    }
]);

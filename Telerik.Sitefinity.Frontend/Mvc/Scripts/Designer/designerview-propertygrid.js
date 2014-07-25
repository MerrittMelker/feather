﻿(function () {
    var propertyGridModule = angular.module('PropertyGridModule', ['designer', 'breadcrumb']);
    angular.module('designer').requires.push('PropertyGridModule');

    //basic controller for the advanced designer view
    propertyGridModule.controller('PropertyGridCtrl', ['$scope', 'propertyService', 'dialogFeedbackService',
        function ($scope, propertyService, dialogFeedbackService) {

            var onGetPropertiesSuccess = function (data) {
                if (data.Items)
                    $scope.items = data.Items;
            };

            var onGetError = function (data) {
                $scope.feedback.showError = true;
                if (data)
                    $scope.feedback.errorMessage = data.Detail;
            };

            propertyService.get().then(onGetPropertiesSuccess, onGetError)
                .finally(function () {
                    $scope.feedback.showLoadingIndicator = false;
                });

            $scope.feedback = dialogFeedbackService;
            $scope.feedback.showLoadingIndicator = true;

            $scope.drillDownPropertyHierarchy = function (propertyPath, propertyName) {
                $scope.propertyPath = propertyPath;
                $scope.propertyName = propertyName;
            };
        }]);

    //filters property hierarchy
    propertyGridModule.filter('propertyHierarchy', function () {

        return function (inputArray, propertyName, propertyPath) {
            var currentLevel;
            if (propertyPath)
                currentLevel = propertyPath.split('/').length - 1;

            var levelFilter = function (property) {
                var level = property.PropertyPath.split('/').length - 2;
                if (propertyName === null || propertyName.length === 0 || propertyName == 'Home') {
                    return level <= 0;
                } else {
                    if (property.PropertyPath.indexOf(propertyPath) >= 0) {
                        return currentLevel == level;
                    } else {
                        return false;
                    }
                }
            };

            var proxyFilter = function (property) {
                return !property.IsProxy;
            };

            var result = inputArray;
            if (inputArray && inputArray[0].IsProxy)
                result = inputArray.filter(proxyFilter);
            else if (inputArray)
                result = inputArray.filter(levelFilter);

            return result;
        };
    });
})();
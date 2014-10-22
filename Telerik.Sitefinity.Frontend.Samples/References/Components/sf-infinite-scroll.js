﻿/*
 * sfInfiniteScroll is a directive which provides functionality for
 * infinte scrolling through the items, as an alternative to paging.
 * The implementation is very simple and solves only the core problem,
 * which is to invoke a delegate when more data is needed. The idea of
 * this directive is not to provide eye-candy features, such as loaders
 * etc.
 */
; (function () {

    var infiniteScroll = angular.module('sfInfiniteScroll', []);

    infiniteScroll.directive('sfInfiniteScroll', [function () {

        /*
         * Returns true if user has scrolled to the bottom of the element,
         * otherwise returns false.
         */
        var atBottom = function (element) {
            return ($(element).scrollTop() + $(element).innerHeight()) >= $(element).get(0).scrollHeight;
        };

        /*
         * Provides the link for the directive implementation.
         */
        var link = function ($scope, element, attributes) {

            // set overflow of the element to scroll
            $(element).css('overflow-y', 'scroll');

            // make sure "needsData" delegate is present
            if (!$scope.needsData) {
                throw new Error('The value of sf-infinite-scroll attribute must be set. It is the function to be called when more data is needed.');
            }

            element.off('scroll');
            element.on('scroll', function () {
                // if element is at the bottom, call the delegated needsData function
                if (atBottom(element)) {
                    $scope.$apply(function () {
                        $scope.needsData();
                    });
                }
            });
        };

        return {
            restrict: 'A',
            scope: {
                needsData: '&sfInfiniteScroll'
            },
            link: link
        };

    }]);

}());
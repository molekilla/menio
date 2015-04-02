module.exports = {
    // Selector
    context: 'table > tr',
    // Properties
    props: {
        // property receives scope, cheerio and underscore
        render: function ($scope, $, _) {
            var numeros = $($scope[4]).find('tr');

            // return scope and next = true if this only selects for another template, only available in callback mode
            return {
                $scope: numeros,
                next: true
            };
        }
    }
};

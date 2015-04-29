module.exports = {
    // Selector
    context: {
        selector: 'table > tr',
        index: 4
    },
    // Properties
    props: {
        // property receives scope, cheerio and underscore
        render: function ($scope) {
            var numeros = $scope.$find('tr');

            // return scope and next = true if this only selects for another template, only available in callback mode
            return {
                $scope: numeros,
                next: true
            };
        }
    }
};

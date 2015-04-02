module.exports = {
    context: 'td',
    props: {
        tipo: function ($scope) {
            // either return or assign to this.model
            return $scope.eq(0).text();
        },
        fecha: function ($scope) {
            return $scope.eq(1).text();
        },
        primero: function ($scope) {
            return {
                numero: $scope.eq(2).text(),
                serie: $scope.eq(4).text(),
                folio: $scope.eq(5).text(),
                verificacion: $scope.eq(6).text(),
                letras: $scope.eq(3).text()
            };
        },
        segundo: function ($scope) {
            return {
                numero: $scope.eq(7).text()
            };
        },
        tercero: function ($scope) {
            return {
                numero: $scope.eq(8).text()
            };
        },
        dateFormatISO: function () {
            return 'es-pa';
        },
        id: function($scope) {
          return this.tipo($scope) + this.fecha($scope);
        }
    }
};

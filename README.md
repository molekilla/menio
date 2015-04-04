menio
=====

production-quality template convention to scrap web sites based on cheerio

## Installation

```bash
$ npm install menio
```

## A Menio template
```javascript
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
```

## Another Menio template

```javascript
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
```
### Menio Docs

#### new Menio(templateDirectory)

#### menio.parse(htmlOrDOM, templateName, callback)

#### Callback(err, scope, model)

### Menio Template Docs

#### Property(scope, cheerio, underscore)

#### Property(scope, cheerio, underscore)

#### Response(either value or options)

#### Response Options($scope, next), only available in callback mode

### Example

```javascript
        // add template directory
        var menio = new Menio(__dirname + '/templates');
        
        // async callback
        // 1st argument - either a $ element or HTML
        // 2nd argument - name of the template
        // 3rd and optional - callback
        menio.parse(html, 'loteria', function (err, $scope) {
            // callback returns error, scope and model
            var data = _.map(_.rest($scope, 3), function (row) {
                // sync returns results right away
                return menio.parse(row, 'row');
            });



            var matchWith = {
                tipo: 'Dominical',
                fecha: '01-09-2013',
                primero: {
                    numero: '0677',
                    serie: '4',
                    folio: '13',
                    verificacion: '',
                    letras: 'DDBC'
                },
                segundo: {
                    numero: '7260'
                },
                tercero: {
                    numero: '8783'
                },
                dateFormatISO: 'es-pa',
                id : 'Dominical01-09-2013'
            };
            expect(data[0]).toEqual(matchWith);
        });

    });
```
### License

Copyright 2015 Rogelio Morrell C. MIT License

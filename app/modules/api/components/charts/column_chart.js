define(function (require) {
    // load external dependencies
    var _ = require("underscore");

    var ColumnChart = function ($element, dataProvider, options, globalOptions) {
        this.$element = $element;
        this.options = _.extend({}, globalOptions, this.constructor.defaultOptions, options);
        this.setDataProvider(dataProvider);
    };

    ColumnChart.defaultOptions = {
        chart: {
            type: 'column',
            borderWidth: 1,
            borderColor: '#d1d1d1'
        },
        yAxis: {
            min: 0
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        }
    };

    ColumnChart.prototype.setDataProvider = function (dataProvider) {
        this._dataProvider = dataProvider;
        _.each(this.options.series, function (series) {
            series.data = _.map(dataProvider, function (data) {
                return data[series.dataField];
            });
        }, this);

        return this;
    };

    ColumnChart.prototype.getDataProvider = function () {
        return this._dataProvider;
    };

    ColumnChart.prototype.render = function () {
        this.$element.highcharts(this.options);
        return this;
    };

    return ColumnChart;
});
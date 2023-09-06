import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-list-of-equipment',
  templateUrl: './list-of-equipment.component.html',
  styleUrls: ['./list-of-equipment.component.scss']
})
export class ListOfEquipmentComponent implements OnInit {

  constructor() { }

  public piechartoptions: any = {

    colors: ['#00bf00', '#f7a400', '#2e305f', '#06bf8d', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],

    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '<b>{point.percentage:.1f} %</b>'
    },
    accessibility: {
        point: {
            valueSuffix: ''
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.y}'
            }
        }
    },
    series: [{
        //name: 'Brands',
        colorByPoint: true,
        data: [{
            name: ' Trial Unit ',
            y: 8,
            sliced: true,
            selected: true
        }, {
            name: ' Satellite Unit ',
            y: 3
        }, {
            name: 'Ship',
            y: 2
        }, {
            name: ' Trial Type ',
            y: 2
        }]
    }]
  }

  public barchartoptions: any = {

    colors: ['#165ba9', '#56508c', '#bb5191', '#fe6464', '#fea702', '#165ba9', '#FF9655', '#FFF263', '#6AF9C4'],
    
    chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
      categories: [
        'Master Module'
      ],        
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Trial Unit',
        data: [80]

    }, {
        name: 'Satellite Unit',
        data: [50]

    }, {
        name: 'Ships',
        data: [30]

    }, {
        name: 'Sections',
        data: [10]

    }]
  }

  // Time Series
  public linechartoptions: any = {
    chart: {
      zoomType: 'xy'
  },
  title: {
      text: ''
  },
  subtitle: {
      text: ''
  },
  xAxis: [{
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      crosshair: true
  }],
  yAxis: [{ // Primary yAxis
      labels: {
          
          style: {
              color: Highcharts.getOptions().colors[1]
          }
      },
      title: {
          text: 'Overall Trials',
          style: {
              color: Highcharts.getOptions().colors[1]
          }
      }
  }, ],
  tooltip: {
      shared: true
  },
  legend: {
      layout: 'vertical',
      align: 'left',
      x: 120,
      verticalAlign: 'top',
      y: 100,
      floating: true,
      backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || // theme
          'rgba(255,255,255,0.25)'
  },
  series: [ {
      name: 'Overall Trials',
      type: 'spline',
      data: [0, 10, 40, 20, 40, 50, 80, 60, 40, 55],
      tooltip: {
          valueSuffix: ''
      }
  }]
  } 

  public areachartoptions: any = { 
    chart: {
      type: 'area'
  },
  accessibility: {
      description: ''
  },
  title: {
      text: ''
  },
  subtitle: {
      text: ''
  },
  xAxis: {
      allowDecimals: false,
      labels: {
          formatter: function () {
              return this.value; // clean, unformatted number for year
          }
      },
      accessibility: {
          rangeDescription: 'Range: 1940 to 2017.'
      }
  },
  yAxis: {
      title: {
          text: 'Overall Trials'
      },
      labels: {
          formatter: function () {
              return this.value / 1000 + '';
          }
      }
  },
  tooltip: {
      pointFormat: '{series.name} <b>{point.y:,0f}'
  },
  plotOptions: {
      area: {
          pointStart: 2018,
          marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                  hover: {
                      enabled: true
                  }
              }
          }
      }
  },
  series: [{
      name: 'Lookup Type',
      data: [
          null, null, null, null, null, 6, 11, 32, 110, 235,
          369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
          20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
          26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
          24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
          21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
          10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
          5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
      ]
  }, {
      name: 'Lookup Value',
      data: [null, null, null, null, null, null, null, null, null, null,
          5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
          1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
          11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
          30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
          37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
          21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
          12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
      ]
  }]
  }

  ngOnInit(): void {
    Highcharts.chart('barchartcontainer', this.barchartoptions);
    Highcharts.chart('piechartcontainer', this.piechartoptions);
    Highcharts.chart('linechartoptions', this.linechartoptions);
    Highcharts.chart('areachartoptions', this.areachartoptions);
  }

}

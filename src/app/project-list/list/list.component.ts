import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router,ActivatedRoute } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { formatDate } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { of } from 'rxjs';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as d3 from 'd3';
declare function inArray(needle, haystack);
declare var moment:any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {


  custom_dashboard:any;
  moment=moment;
  public projectList = [];
  public all_psr_active_count = 0;
  public all_gls_active_count = 0;
  public all_bls_active_count = 0;
  public allPSR:any;
  public allGLS:any;
  public allBS:any;

  selectedWidgets=['psr-count', 'gls-count', 'bls-count', 'sotr-count', 'dfr-count', 'pnd-count', 'd787-count', 'gd-count'];


  onChangeWidget()
  {
    localStorage.setItem('custom_dashboard',this.api.encryptData(this.custom_dashboard));
  }

  constructor(public api: ApiService, private notification : NotificationService, private dialog:MatDialog,private logger:ConsoleService, aroute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.custom_dashboard=localStorage.getItem('custom_dashboard')?this.api.decryptData(localStorage.getItem('custom_dashboard')):this.selectedWidgets;

    this.getListing();
    //this.getModuleListing();
    this.getProjectLog;
  }

  checkWidgetExists(widgetName='')
  {
    return inArray(widgetName,this.custom_dashboard);
  }

  // getModuleListing() {
  //   this.api
  //     .getAPI(environment.API_URL + "transaction/dashboard/module")
  //     .subscribe((res) => {
  //       this.dashboard_graph = res.data
  //       //this.logger.log('Module list',res.data)
  //       console.log(this.dashboard_graph,"LLLLL")
  //       console.log(this.dashboard_graph.length,"LLLLL")
  //       console.log(typeof(this.dashboard_graph),"LLLLL")
  //     });
  //  }

  getListing() {
    this.api
      .getAPI(environment.API_URL + "transaction/dashboard/project_list")
      .subscribe((res) => {
        this.projectList = res.data['all_project_list'];
        this.all_psr_active_count = res.data['all_psr_active_count'];
        this.all_gls_active_count = res.data['all_gls_active_count'];
        this.all_bls_active_count = res.data['all_bls_active_count'];        
        this.logger.log('Project list',res.data)
      });
   }

   ngAfterViewInit() {

    //let colorArray = [0x6f42c1, 0x6f42c1, 0xca52eb, 0xf0eb6e, 0x7cfca4]
    //let colorArray = [0xca52eb, 0xf0eb6e, 0x7cfca4]
    this.api
      .getAPI(environment.API_URL + "transaction/dashboard/module")
      .subscribe((res) => {
        this.allPSR = res.data.psr
        this.allGLS = res.data.gls
        this.allBS = res.data.bs
        //this.logger.log('Module list',res.data)
        //console.log(this.dashboard_graph,"LLLLL")
        //console.log(this.dashboard_graph.length,"LLLLL")
        //console.log(typeof(this.dashboard_graph),"LLLLL")

          // Chart code goes in here
         

          let root = am5.Root.new("chartdivModule");
          root.dateFormatter.setAll({
            dateFormat: "yyyy-MM-dd",
            dateFields: ["valueX", "openValueX"]
          });


          // Set themes
          // https://www.amcharts.com/docs/v5/concepts/themes/
          root.setThemes([
            am5themes_Animated.new(root)
          ]);


          // Create chart
          // https://www.amcharts.com/docs/v5/charts/xy-chart/
          let chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
          }));


          // Add legend
          // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
          let legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.p50,
            x: am5.p50
          }))

          let colors = chart.get("colors");


          var jsonPSR = [];
          let j = 0
          for (var i = 0; i < this.allPSR.length; i++) {
            //console.log(j)
              jsonPSR.push({
                  category: "PSR",
                  start: new Date(this.allPSR[i].start_year, this.allPSR[i].start_month-1, this.allPSR[i].start_day).getTime(),
                  end: new Date(this.allPSR[i].end_year, this.allPSR[i].end_month-1, this.allPSR[i].end_day).getTime(),
                  columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), j)
                    //fill: am5.color(colorArray[i]),
                  },
                  task: this.allPSR[i].project
              });
              j+=0.4
            //console.log(j)
          }

          let psr = jsonPSR;


          var jsonGLS = [];
          let k = 0
          for (var i = 0; i < this.allGLS.length; i++) {
            //console.log(j)
              jsonGLS.push({
                  category: "GLS",
                  start: new Date(this.allGLS[i].start_year, this.allGLS[i].start_month-1, this.allGLS[i].start_day).getTime(),
                  end: new Date(this.allGLS[i].end_year, this.allGLS[i].end_month-1, this.allGLS[i].end_day).getTime(),
                  columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), k)
                    //fill: am5.color(colorArray[i]),
                  },
                  task: this.allGLS[i].project
              });
              k+=0.4
            //console.log(j)
          }

          let gls = jsonGLS;


          var jsonBS = [];
          let l = 0
          for (var i = 0; i < this.allBS.length; i++) {
            //console.log(j)
              jsonBS.push({
                  category: "BS",
                  start: new Date(this.allBS[i].start_year, this.allBS[i].start_month-1, this.allBS[i].start_day).getTime(),
                  end: new Date(this.allBS[i].end_year, this.allBS[i].end_month-1, this.allBS[i].end_day).getTime(),
                  columnSettings: {
                    fill: am5.Color.brighten(colors.getIndex(0), l)
                    //fill: am5.color(colorArray[i]),
                  },
                  task: this.allBS[i].project
              });
              l+=0.4
            //console.log(j)
          }

          let bs = jsonBS;

          // let psr = [{
          //   category: "PSR",
          //   start: new Date(2023, 0, 1).getTime(),
          //   end: new Date(2023, 0, 14).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(0), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "PSR",
          //   start: new Date(2023, 0, 16).getTime(),
          //   end: new Date(2023, 0, 27).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(0), 0.4)
          //   },
          //   task: "project2"
          // }, {
          //   category: "PSR",
          //   start: new Date(2023, 1, 5).getTime(),
          //   end: new Date(2023, 3, 18).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(0), 0.8)
          //   },
          //   task: "project3"
          // }, {
          //   category: "PSR",
          //   start: new Date(2023, 3, 18).getTime(),
          //   end: new Date(2023, 3, 30).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(0), 1.2)
          //   },
          //   task: "project4 "
          // }

          // ]


          // let gls = [{
          //   category: "GLS",
          //   start: new Date(2023, 0, 8).getTime(),
          //   end: new Date(2023, 0, 10).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(2), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "GLS",
          //   start: new Date(2023, 0, 12).getTime(),
          //   end: new Date(2023, 0, 15).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(2), 0.4)
          //   },
          //   task: "project2"
          // }, {
          //   category: "GLS",
          //   start: new Date(2023, 0, 16).getTime(),
          //   end: new Date(2023, 1, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(2), 0.8)
          //   },
          //   task: "project3"
          // }, {
          //   category: "GLS",
          //   start: new Date(2023, 1, 10).getTime(),
          //   end: new Date(2023, 1, 18).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(2), 1.2)
          //   },
          //   task: "project4"
          // }]

          // let bs = [{
          //   category: "BS",
          //   start: new Date(2023, 0, 2).getTime(),
          //   end: new Date(2023, 0, 8).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "BS",
          //   start: new Date(2023, 0, 8).getTime(),
          //   end: new Date(2023, 0, 16).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0.4)
          //   },
          //   task: "project2"
          // }, {
          //   category: "BS",
          //   start: new Date(2023, 0, 19).getTime(),
          //   end: new Date(2023, 2, 1).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0.8)
          //   },
          //   task: "project3"
          // }, {
          //   category: "BS",
          //   start: new Date(2023, 2, 12).getTime(),
          //   end: new Date(2023, 3, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 1.2)
          //   },
          //   task: "project4"
          // }, 
          //   ];


          let data = psr.concat(gls,bs);


          // Create axes
          // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

          let yRenderer = am5xy.AxisRendererY.new(root, {});
          yRenderer.grid.template.set("location", 1);

          let yAxis = chart.yAxes.push(
            am5xy.CategoryAxis.new(root, {
              categoryField: "category",
              renderer: yRenderer,
              tooltip: am5.Tooltip.new(root, {})
            })
          );

          yAxis.data.setAll([
            { category: "BS" },
            { category: "GLS" },
            { category: "PSR" },
            
          ]);

          let xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
              baseInterval: { timeUnit: "minute", count: 1 },
              renderer: am5xy.AxisRendererX.new(root, { strokeOpacity: 0.1 })
            })
          );


          // Add series
          // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
          let series = chart.series.push(am5xy.ColumnSeries.new(root, {
            xAxis: xAxis,
            yAxis: yAxis,
            openValueXField: "start",
            valueXField: "end",
            categoryYField: "category",
            sequencedInterpolation: true
          }));

          series.columns.template.setAll({
            templateField: "columnSettings",
            strokeOpacity: 0, 
            tooltipText: "{task}:\n[bold]{openValueX}[/] - [bold]{valueX}[/]"
          });

          series.data.setAll(data);

          // Add scrollbars
          chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

          // Make stuff animate on load
          // https://www.amcharts.com/docs/v5/concepts/animations/
          series.appear();
          chart.appear(1000, 100);





      });





}   




projectlog:any;
  getProjectLog(data) {

    //console.log(param)
    this.api
      .getAPI(environment.API_URL + "transaction/projectlog?project_id="+data)
      .subscribe((res) => {

        this.projectlog = res.data;
        console.log(this.projectlog,'888')
      });
    }

}

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
declare var moment:any;

declare function inArray(needle, haystack);
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  moment=moment;
  psr_custom_dashboard:any;
  public projectList = [];
  public psr_ini_active_count = 0
  public psr_formulation_active_count = 0
  public psr_presentation_active_count = 0
  public psr_input_active_count = 0
  public psr_concept_active_count = 0
  public psr_incorporation_active_count = 0
  public psr_receipt_active_count = 0
  public dashboard_graph:any;
  public initiation:any
  public formulation:any
  public presentation:any
  public input_sr:any
  public concept:any
  public incorporation:any
  public rfi:any

  selectedWidgets=['initiation-count', 'formulation-count', 'presentation-count', 'input-count', 'concept-count', 'incorporation-count', 'receipt-count'];

  onChangeWidget()
  {
    localStorage.setItem('psr_custom_dashboard',this.api.encryptData(this.psr_custom_dashboard));
  }

  constructor(public api: ApiService, private notification : NotificationService, private dialog:MatDialog,private logger:ConsoleService, aroute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.psr_custom_dashboard=localStorage.getItem('psr_custom_dashboard')?this.api.decryptData(localStorage.getItem('psr_custom_dashboard')):this.selectedWidgets;
    this.getProjectLog;
    this.getListing();

  }

  checkWidgetExists(widgetName='')
  {
    return inArray(widgetName,this.psr_custom_dashboard);
  }

  getListing() {
    this.api
      .getAPI(environment.API_URL + "transaction/dashboard/project_list")
      .subscribe((res) => {
        this.projectList = res.data['all_project_list'];
        this.psr_ini_active_count = res.data['psr_ini_active_count'];
        this.psr_formulation_active_count = res.data['psr_formulation_active_count'];
        this.psr_presentation_active_count = res.data['psr_presentation_active_count'];
        this.psr_input_active_count = res.data['psr_input_active_count'];
        this.psr_concept_active_count = res.data['psr_concept_active_count'];
        this.psr_incorporation_active_count = res.data['psr_incorporation_active_count'];
        this.psr_receipt_active_count = res.data['psr_receipt_active_count'];
        
        this.logger.log('Project list',this.projectList)
      });
   }

   ngAfterViewInit() {

    let colorArray = [0x6f42c1, 0x6f42c1, 0xca52eb, 0xf0eb6e, 0x7cfca4]

    //console.log(colorArray[0], "GGGGGGGGGGg")

    this.api
      .getAPI(environment.API_URL + "transaction/dashboard/module_psr")
      .subscribe((res) => {
        this.initiation = res.data.initiation
        this.formulation = res.data.formulation
        this.presentation = res.data.presentation
        this.input_sr = res.data.input_sr
        this.concept = res.data.concept
        this.incorporation = res.data.incorporation
        this.rfi = res.data.rfi

        //this.logger.log('Module list',res.data)
        //console.log(this.initiation,"LLLLL")
        //console.log(this.initiation.length,"LLLLL")
        //console.log(typeof(this.initiation),"LLLLL")

        // Chart code goes in here
       
          let root = am5.Root.new("chartdivSubModule");
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

          var jsonForm1 = [];
          let j = 0
          for (var i = 0; i < this.initiation.length; i++) {
              jsonForm1.push({
                  category: "Initiation Notes",
                  start: new Date(this.initiation[i].start_year, this.initiation[i].start_month-1, this.initiation[i].start_day).getTime(),
                  end: new Date(this.initiation[i].end_year, this.initiation[i].end_month-1, this.initiation[i].end_day).getTime(),
                  columnSettings: {
                    //fill: i==0 ? am5.Color.brighten(colors.getIndex(0), j): am5.color(0xca52eb),
                    //fill: am5.Color.brighten(colors.getIndex(0), j)
                    fill: am5.color(colorArray[i]),
                  },
                  task: this.initiation[i].project
              });
              j+=0.4
          }

          //console.log(jsonForm1, 'jsonForm1')
          let form_1 = jsonForm1;

          var jsonForm2 = [];
          let k = 0
          for (var i = 0; i < this.formulation.length; i++) {
              jsonForm2.push({
                  category: "Formulation Of Approach Paper",
                  start: new Date(this.formulation[i].start_year, this.formulation[i].start_month-1, this.formulation[i].start_day).getTime(),
                  end: new Date(this.formulation[i].end_year, this.formulation[i].end_month-1, this.formulation[i].end_day).getTime(),
                  columnSettings: {
                    //fill: i==0 ? am5.Color.brighten(colors.getIndex(0), j): am5.color(0xca52eb)
                    //fill: am5.Color.brighten(colors.getIndex(0), k)
                    //fill: am5.color(0xf0eb6e),
                    fill: am5.color(colorArray[i]),
                  },
                  task: this.formulation[i].project
              });
              k+=0.4
          }
          //console.log(jsonForm2, 'jsonForm2')
          let form_2 = jsonForm2;

          var jsonForm3 = [];
          let l = 0
          for (var i = 0; i < this.presentation.length; i++) {
              jsonForm3.push({
                  category: "Presentation of Paper Approach",
                  start: new Date(this.presentation[i].start_year, this.presentation[i].start_month-1, this.presentation[i].start_day).getTime(),
                  end: new Date(this.presentation[i].end_year, this.presentation[i].end_month-1, this.presentation[i].end_day).getTime(),
                  columnSettings: {
                    //fill: i==0 ? am5.Color.brighten(colors.getIndex(0), j): am5.color(0xca52eb)
                    //fill: am5.Color.brighten(colors.getIndex(0), l)
                    fill: am5.color(colorArray[i]),
                  },
                  task: this.presentation[i].project
              });
              l+=0.4
          }
          //console.log(jsonForm3, 'jsonForm3')
          let form_3 = jsonForm3;

          var jsonForm4 = [];
          let m = 0
          for (var i = 0; i < this.input_sr.length; i++) {
              jsonForm4.push({
                  category: "Input of Staff Requirements",
                  start: new Date(this.input_sr[i].start_year, this.input_sr[i].start_month-1, this.input_sr[i].start_day).getTime(),
                  end: new Date(this.input_sr[i].end_year, this.input_sr[i].end_month-1, this.input_sr[i].end_day).getTime(),
                  columnSettings: {
                    //fill: i==0 ? am5.Color.brighten(colors.getIndex(0), j): am5.color(0xca52eb)
                    //fill: am5.Color.brighten(colors.getIndex(0), m)
                    fill: am5.color(colorArray[i]),
                  },
                  task: this.input_sr[i].project
              });
              m+=0.4
          }
          //console.log(jsonForm4, 'jsonForm4')
          let form_4 = jsonForm4;

          var jsonForm5 = [];
          let n = 0
          for (var i = 0; i < this.concept.length; i++) {
              jsonForm5.push({
                  category: "Concept Design",
                  start: new Date(this.concept[i].start_year, this.concept[i].start_month-1, this.concept[i].start_day).getTime(),
                  end: new Date(this.concept[i].end_year, this.concept[i].end_month-1, this.concept[i].end_day).getTime(),
                  columnSettings: {
                    //fill: i==0 ? am5.Color.brighten(colors.getIndex(0), j): am5.color(0xca52eb)
                    //fill: am5.Color.brighten(colors.getIndex(0), m)
                    fill: am5.color(colorArray[i]),
                  },
                  task: this.concept[i].project
              });
              n+=0.4
          }
          //console.log(jsonForm5, 'jsonForm5')
          let form_5 = jsonForm5;

          var jsonForm6 = [];
          let o = 0
          for (var i = 0; i < this.incorporation.length; i++) {
              jsonForm6.push({
                  category: "Incorporation of Design Inputs",
                  start: new Date(this.incorporation[i].start_year, this.incorporation[i].start_month-1, this.incorporation[i].start_day).getTime(),
                  end: new Date(this.incorporation[i].end_year, this.incorporation[i].end_month-1, this.incorporation[i].end_day).getTime(),
                  columnSettings: {
                    //fill: i==0 ? am5.Color.brighten(colors.getIndex(0), j): am5.color(0xca52eb)
                    //fill: am5.Color.brighten(colors.getIndex(0), o)
                    fill: am5.color(colorArray[i]),
                  },
                  task: this.incorporation[i].project
              });
              o+=0.4
          }
          //console.log(jsonForm6, 'jsonForm6')
          let form_6 = jsonForm6;


          var jsonForm7 = [];
          let p = 0
          for (var i = 0; i < this.rfi.length; i++) {
              jsonForm7.push({
                  category: "Receipt of RFI Responses",
                  start: new Date(this.rfi[i].start_year, this.rfi[i].start_month-1, this.rfi[i].start_day).getTime(),
                  end: new Date(this.rfi[i].end_year, this.rfi[i].end_month-1, this.rfi[i].end_day).getTime(),
                  columnSettings: {
                    //fill: i==0 ? am5.Color.brighten(colors.getIndex(0), j): am5.color(0xca52eb)
                    //fill: am5.Color.brighten(colors.getIndex(0), p)
                    fill: am5.color(colorArray[i]),
                  },
                  task: this.rfi[i].project
              });
              p+=0.4
          }
          //console.log(jsonForm7, 'jsonForm7')
          let form_7 = jsonForm7;

          // Data
          // let form_1 = [{
          //   category: "Initiation Notes",
          //   start: new Date(2023, 0, 1).getTime(),
          //   end: new Date(2023, 0, 14).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "Initiation Notes",
          //   start: new Date(2023, 0, 16).getTime(),
          //   end: new Date(2023, 0, 27).getTime(),
          //   columnSettings: {
          //     // fill: am5.Color.brighten(colors.getIndex(0), 0.4)
          //     fill: am5.color(0xca52eb),
          //   },
          //   task: "project2"
          // }, {
          //   category: "Initiation Notes",
          //   start: new Date(2023, 1, 5).getTime(),
          //   end: new Date(2023, 2, 10).getTime(),
          //   columnSettings: {
          //     // fill: am5.Color.brighten(colors.getIndex(0), 0.8)
          //     fill: am5.color(0xf0eb6e),
          //   },
          //   task: "project3"
          // }, {
          //   category: "Initiation Notes",
          //   start: new Date(2023, 2, 15).getTime(),
          //   end: new Date(2023, 3, 5).getTime(),
          //   columnSettings: {
          //     // fill: am5.Color.brighten(colors.getIndex(0), 1.2)
          //     fill: am5.color(0x7cfca4),
          //   },
          //   task: "project4 "
          // }, {
          //   category: "Formulation Of Approach Paper",
          //   start: new Date(2023, 0, 8).getTime(),
          //   end: new Date(2023, 0, 10).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }]

          // let form_2 = [{
          //   category: "Formulation Of Approach Paper",
          //   start: new Date(2023, 0, 12).getTime(),
          //   end: new Date(2023, 0, 15).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xca52eb),
          //   },
          //   task: "project2"
          // }, {
          //   category: "Formulation Of Approach Paper",
          //   start: new Date(2023, 0, 16).getTime(),
          //   end: new Date(2023, 1, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xf0eb6e),
          //   },
          //   task: "project3"
          // }, {
          //   category: "Formulation Of Approach Paper",
          //   start: new Date(2023, 1, 10).getTime(),
          //   end: new Date(2023, 1, 18).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0x7cfca4),
          //   },
          //   task: "project4"
          // }]

          // let form_3 = [{
          //   category: "Presentation of Paper Approach",
          //   start: new Date(2023, 0, 2).getTime(),
          //   end: new Date(2023, 0, 8).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "Presentation of Paper Approach",
          //   start: new Date(2023, 0, 15).getTime(),
          //   end: new Date(2023, 0, 30).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xca52eb),
          //   },
          //   task: "project2"
          // }, {
          //   category: "Presentation of Paper Approach",
          //   start: new Date(2023, 1, 19).getTime(),
          //   end: new Date(2023, 2, 1).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xf0eb6e),
          //   },
          //   task: "project3"
          // }, {
          //   category: "Presentation of Paper Approach",
          //   start: new Date(2023, 2, 12).getTime(),
          //   end: new Date(2023, 3, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0x7cfca4),
          //   },
          //   task: "project4"
          // }]


          // let form_4 = [{
          //   category: "Input of Staff Requirements",
          //   start: new Date(2023, 1, 10).getTime(),
          //   end: new Date(2023, 1, 18).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "Input of Staff Requirements",
          //   start: new Date(2023, 2, 8).getTime(),
          //   end: new Date(2023, 2, 16).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xca52eb),
          //   },
          //   task: "project2"
          // }, {
          //   category: "Input of Staff Requirements",
          //   start: new Date(2023, 3, 10).getTime(),
          //   end: new Date(2023, 3, 18).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xf0eb6e),
          //   },
          //   task: "project3"
          // }, {
          //   category: "Input of Staff Requirements",
          //   start: new Date(2023, 3, 12).getTime(),
          //   end: new Date(2023, 3, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0x7cfca4),
          //   },
          //   task: "project4"
          // }]


          // let form_5 = [{
          //   category: "Concept Design",
          //   start: new Date(2023, 0, 2).getTime(),
          //   end: new Date(2023, 0, 8).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "Concept Design",
          //   start: new Date(2023, 0, 8).getTime(),
          //   end: new Date(2023, 0, 16).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xca52eb),
          //   },
          //   task: "project2"
          // }, {
          //   category: "Concept Design",
          //   start: new Date(2023, 0, 19).getTime(),
          //   end: new Date(2023, 2, 1).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xf0eb6e),
          //   },
          //   task: "project3"
          // }, {
          //   category: "Concept Design",
          //   start: new Date(2023, 2, 12).getTime(),
          //   end: new Date(2023, 3, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0x7cfca4),
          //   },
          //   task: "project4"
          // }]

          // let form_6 = [{
          //   category: "Incorporation of Design Inputs",
          //   start: new Date(2023, 0, 2).getTime(),
          //   end: new Date(2023, 0, 8).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "Incorporation of Design Inputs",
          //   start: new Date(2023, 0, 8).getTime(),
          //   end: new Date(2023, 0, 16).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xca52eb),
          //   },
          //   task: "project2"
          // }, {
          //   category: "Incorporation of Design Inputs",
          //   start: new Date(2023, 0, 19).getTime(),
          //   end: new Date(2023, 2, 1).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xf0eb6e),
          //   },
          //   task: "project3"
          // }, {
          //   category: "Incorporation of Design Inputs",
          //   start: new Date(2023, 2, 12).getTime(),
          //   end: new Date(2023, 3, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0x7cfca4),
          //   },
          //   task: "project4"
          // }]


          // let form_7 = [{
          //   category: "Receipt of RFI Responses",
          //   start: new Date(2023, 0, 2).getTime(),
          //   end: new Date(2023, 0, 8).getTime(),
          //   columnSettings: {
          //     fill: am5.Color.brighten(colors.getIndex(4), 0)
          //   },
          //   task: "project1"
          // }, {
          //   category: "Receipt of RFI Responses",
          //   start: new Date(2023, 0, 8).getTime(),
          //   end: new Date(2023, 0, 16).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xca52eb),
          //   },
          //   task: "project2"
          // }, {
          //   category: "Receipt of RFI Responses",
          //   start: new Date(2023, 0, 20).getTime(),
          //   end: new Date(2023, 2, 1).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0xf0eb6e),
          //   },
          //   task: "project3"
          // }, {
          //   category: "Receipt of RFI Responses",
          //   start: new Date(2023, 2, 25).getTime(),
          //   end: new Date(2023, 3, 5).getTime(),
          //   columnSettings: {
          //     fill: am5.color(0x7cfca4),
          //   },
          //   task: "project4"
          // }, 
          //   ];



          let data = form_1.concat(form_2, form_3, form_4, form_5, form_6, form_7);

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
           
            
            
           
            
           
            { category: "Receipt of RFI Responses" },
            { category: "Incorporation of Design Inputs" },
            { category: "Concept Design" },
            { category: "Input of Staff Requirements" },
            { category: "Presentation of Paper Approach" },
            { category: "Formulation Of Approach Paper" },
            { category: "Initiation Notes" },
            
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
      .getAPI(environment.API_URL + "transaction/projectlog?project_id="+data+"&module_id=1")
      .subscribe((res) => {

        this.projectlog = res.data;
        console.log(this.projectlog,'888')
      });
    }  
}

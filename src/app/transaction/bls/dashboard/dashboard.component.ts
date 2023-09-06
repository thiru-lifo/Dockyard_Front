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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
moment=moment;
bls_custom_dashboard:any;
selectedWidgets=[];

  onChangeWidget()
  {
    localStorage.setItem('bls_custom_dashboard',this.api.encryptData(this.bls_custom_dashboard));
  }
  constructor(public api: ApiService, private notification : NotificationService, private dialog:MatDialog,private logger:ConsoleService, aroute: ActivatedRoute) {
  }
public projectList = [];
  public all_psr_active_count = 0;
  public all_gls_active_count = 0;
  public all_bls_active_count = 0;
  ngOnInit(): void {
    this.bls_custom_dashboard=localStorage.getItem('bls_custom_dashboard')?this.api.decryptData(localStorage.getItem('bls_custom_dashboard')):this.selectedWidgets;
     this.getListing();
     this.getProjectLog;
  }

  checkWidgetExists(widgetName='')
  {
    return inArray(widgetName,this.bls_custom_dashboard);
  }

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

// Data 
let data = [{ 
  category: "BS",
  start: new Date(2023, 0, 1).getTime(),
  end: new Date(2023, 0, 14).getTime(),
  columnSettings: {
    fill: am5.Color.brighten(colors.getIndex(0), 0)
  },
  task: "project1"
}, {
  category: "BS",
  start: new Date(2023, 0, 16).getTime(),
  end: new Date(2023, 0, 27).getTime(),
  columnSettings: {
    fill: am5.Color.brighten(colors.getIndex(0), 0.4)
  },
  task: "project2"
}, {
  category: "BS",
  start: new Date(2023, 1, 5).getTime(),
  end: new Date(2023, 3, 18).getTime(),
  columnSettings: {
    fill: am5.Color.brighten(colors.getIndex(0), 0.8)
  },
  task: "project3"
}, {
  category: "BS",
  start: new Date(2023, 3, 18).getTime(),
  end: new Date(2023, 3, 30).getTime(),
  columnSettings: {
    fill: am5.Color.brighten(colors.getIndex(0), 1.2)
  },
  task: "project4 "
} 
  ];


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

}
projectlog:any;
  getProjectLog(data) {

    //console.log(param)
    this.api
      .getAPI(environment.API_URL + "transaction/projectlog?project_id="+data+"&module_id=3")
      .subscribe((res) => {

        this.projectlog = res.data;
        console.log(this.projectlog,'888')
      });
    }  


}

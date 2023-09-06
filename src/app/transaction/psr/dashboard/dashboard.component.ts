import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { language } from "src/environments/language";
import { NotificationService } from "src/app/service/notification.service";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ConsoleService } from 'src/app/service/console.service';
declare var moment:any;
declare function openModal(selector):any;
declare function closeModal(selector):any;
declare function formSubmit(selector):any;
declare function triggerClick(selector):any;
declare function inArray(needle, haystack);
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  trial_unit_length:any;
  satellite_units_length:any;
  ship_length:any;
  sections_length:any;
  equipments_length:any;
  transaction_length:any;
  dataProjectDetail = [];

  displayedColumns: string[] = [
    "trial_number",
    "trial_unit",
    //  "satellite_unit",
    //  "ship",
    //  "section",
    // "equipment",
    "trial_type",
    // "requested_by",
    // "requested_on",
    // "approval",
    "view",
    // "download",
  ];

displayedReports: string[] = [
    "trial_number",
    "trial_unit",
    "satellite_unit",
    "ship",
    // "section",
    // "equipment",
    "trial_type",
    "requested_by",
    "requested_on",
    "view",
    "download",
  ];

  custom_dashboard:any;
  dataSource: MatTableDataSource<any>;
  public countryList=[];
  @ViewChild(MatPaginator) pagination: MatPaginator;
  moment=moment;
  filterValue:any;
  interval:any;
  moduleAccess:any;

  public permission={
    view:true,
    download:true,
  };
  crudName: string;
  isReadonly: boolean;
  editForm: any;

  // selectedWidgets=['trial-units-count', 'satellite-units-count', 'ships-count', 'equipment-count', 'trials-count', 'recent-notifications', 'recent-trials', 'recent-reports'];
  selectedWidgets=['etma-trial', 'etma-returns', 'etma-cbpm','cbiu-trial', 'cbiu-returns', 'cbiu-cbpm','gttt-trial', 'gttt-returns', 'gttt-cbpm','mtu-trial', 'mtu-returns', 'mtu-cbpm'];
  dataSource_recent: MatTableDataSource<unknown>;

  onChangeWidget()
  {
    console.log('this.custom_dashboard',this.custom_dashboard);
    localStorage.setItem('custom_dashboard',this.api.encryptData(this.custom_dashboard));
  }

    constructor(private api:ApiService, private notification : NotificationService,private router:Router,private logger:ConsoleService, public aroute: ActivatedRoute) { }

  public piechartoptions: any = {

    colors: ['#7adf48', '#eeb34c', '#f16b67', '#4f4399'],

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
            name: 'Completed',
            y: 8,
            sliced: true,
            selected: true
        }, 
        {
            name: 'In Progress',
            y: 3
        }, 
        {
            name: 'Pending',
            y: 2
        },
        {
          name: 'Total Projects',
          y: 10
        }
      ]
    }]
  }

  ngOnInit(): void {
    // Highcharts.chart('piechartcontainer1', this.piechartoptions);
    // Highcharts.chart('piechartcontainer2', this.piechartoptions);
    // Highcharts.chart('piechartcontainer3', this.piechartoptions);
    // Highcharts.chart('piechartcontainer4', this.piechartoptions);
    this.getNotifications();
    const param = this.aroute.snapshot.queryParamMap.get('project_id')
    if(param){
        var qString = '?project_id='+param
    }
    
    this.getProjectDetail(qString);
    this.getTimelineReport();

  }

  checkWidgetExists(widgetName='')
  {
    return inArray(widgetName,this.custom_dashboard);
  }

getProjectDetail(param='') {
    
    console.log(param)
    this.api
      .getAPI(environment.API_URL + "transaction/dashboard/project_detail"+param)
      .subscribe((res) => {

        this.dataProjectDetail = res.data;
        console.log('country',this.dataProjectDetail)
        //console.log(this.dataProjectDetail['psr_list'][0]['status'],"HHHhhhh")
      });
  }
   notificationsList=[];
  getNotifications() {
      this.api.postAPI(environment.API_URL + "notification/get-notifications",{}).subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
         console.log('getNotifications',res);
         this.notificationsList=res.data;
        } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }
      });
  }
  timelineDet=[]
  getTimelineReport() {
        let  project_id = this.aroute.snapshot.queryParamMap.get('project_id');
      this.api.postAPI(environment.API_URL + "transaction/modulewise-timeline",{project_id:project_id,module_id:1}).subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
         // console.log('getTimelineReport',res);
         this.timelineDet=res.endResponse;
        } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }
      });
  }

}

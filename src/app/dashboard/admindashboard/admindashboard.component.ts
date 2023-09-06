import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { language } from "src/environments/language";
import { Router,ActivatedRoute } from '@angular/router';
import { NotificationService } from "src/app/service/notification.service";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { ConsoleService } from 'src/app/service/console.service';
declare var moment:any;
declare function openModal(selector):any;
declare function closeModal(selector):any;
declare function formSubmit(selector):any;
declare function triggerClick(selector):any;
declare function inArray(needle, haystack);



import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss']
})
export class AdmindashboardComponent implements OnInit {
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


  public psr: any = {

    colors: ['#7adf48', '#eeb34c', '#f16b67', '#4f4399'],    

    chart: {
        plotBackgroundColor: 'transparent',
        backgroundColor:'transparent',
        plotBorderWidth: null,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        type: 'pie',
        style: {
          fontSize: '2em',
      },
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
    }
  }

  public gls: any = {

    colors: ['#7adf48', '#eeb34c', '#f16b67', '#4f4399'],    

    chart: {
        plotBackgroundColor: 'transparent',
        backgroundColor:'transparent',
        plotBorderWidth: null,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        type: 'pie',
        style: {
          fontSize: '2em',
      },
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
    }
  }


  public bls: any = {

    colors: ['#7adf48', '#eeb34c', '#f16b67', '#4f4399'],    

    chart: {
        plotBackgroundColor: 'transparent',
        backgroundColor:'transparent',
        plotBorderWidth: null,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        type: 'pie',
        style: {
          fontSize: '2em',
      },
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
    }
  }

/*public piechartoptions: any = {

    colors: ['#7adf48', '#eeb34c', '#f16b67', '#4f4399'],    

    chart: {
        plotBackgroundColor: 'transparent',
        backgroundColor:'transparent',
        plotBorderWidth: null,
        plotShadow: false,
        margin: [0, 0, 0, 0],
        type: 'pie',
        style: {
          fontSize: '2em',
      },
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
            name: 'Approved',
            y: 3,
            sliced: true,
            selected: true
        }, 
        {
            name: 'Recommended',
            y: 2
        }, 
        {
            name: 'Pending',
            y: 1
        }
      ]
    }]
  }*/

  ngOnInit(): void {

    const param = this.aroute.snapshot.queryParamMap.get('project_id')
    if(param){
        var qString = '?project_id='+param
    }
    this.getNotifications();
    this.getProjectDetail(qString);
     this.getProjectLog(qString);
    // Highcharts.chart('piechartcontainer2', this.piechartoptions);
    // Highcharts.chart('piechartcontainer3', this.piechartoptions);
    // Highcharts.chart('piechartcontainer4', this.piechartoptions);
    // Highcharts.chart('piechartcontainer5', this.piechartoptions);
    // Highcharts.chart('piechartcontainer6', this.piechartoptions);
    // Highcharts.chart('piechartcontainer7', this.piechartoptions);
    // Highcharts.chart('piechartcontainer8', this.piechartoptions);
    // Highcharts.chart('piechartcontainer9', this.piechartoptions);
  }

  checkWidgetExists(widgetName='')
  {
    return inArray(widgetName,this.custom_dashboard);
  }

  
  getProjectDetail(param='') {

    //console.log(param)
    this.api
      .getAPI(environment.API_URL + "transaction/dashboard/project_detail"+param)
      .subscribe((res) => {

        this.dataProjectDetail = res.data;
        this.logger.log('country',this.dataProjectDetail)

        //this.dataProjectDetail['psr_approved_count'].psr_approved_count
        //console.log(this.dataProjectDetail['psr_approved_count'].psr_approved_count,"WWWWWWWWWWWWWWWWWWw")
        //console.log(this.dataProjectDetail[0].project,"#######")

        // PSR
        this.psr.series = [{
        colorByPoint: true,
        data: [{
                name: 'Approved',
                y: this.dataProjectDetail['psr_approved_count'].psr_approved_count,
                sliced: true,
                selected: true
            }, 
            {
                name: 'Recommended',
                y: this.dataProjectDetail['psr_recommended_count'].psr_recommended_count
            }, 
            {
                name: 'Pending',
                y: this.dataProjectDetail['psr_pending_count'].psr_pending_count
            }]
        }]
        
        // GLS
        this.gls.series = [{
        colorByPoint: true,
        data: [{
                name: 'Approved',
                y: this.dataProjectDetail['gls_approved_count'].gls_approved_count,
                sliced: true,
                selected: true
            }, 
            {
                name: 'Recommended',
                y: this.dataProjectDetail['gls_recommended_count'].gls_recommended_count
            }, 
            {
                name: 'Pending',
                y: this.dataProjectDetail['gls_pending_count'].gls_pending_count
            }]
        }]


        // BLS
        this.bls.series = [{
        colorByPoint: true,
        data: [{
                name: 'Approved',
                y: this.dataProjectDetail['bls_approved_count'].bls_approved_count,
                sliced: true,
                selected: true
            }, 
            {
                name: 'Recommended',
                y: this.dataProjectDetail['bls_recommended_count'].bls_recommended_count
            }, 
            {
                name: 'Pending',
                y: this.dataProjectDetail['bls_pending_count'].bls_pending_count
            }]
        }]

        Highcharts.chart('psr', this.psr);
        Highcharts.chart('gls', this.gls);
        Highcharts.chart('bls', this.bls);
      });
  }
projectlog:any;
  getProjectLog(param='') {

    //console.log(param)
    this.api
      .getAPI(environment.API_URL + "transaction/projectlog"+param)
      .subscribe((res) => {

        this.projectlog = res.data;
        console.log(this.projectlog,'888')
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
   
}


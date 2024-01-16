import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output("logout") logout: EventEmitter<any> = new EventEmitter();
  @Input() user : any

  constructor() { }
  @ViewChild(DashboardComponent, {static: true}) dashboardComponent : DashboardComponent

  doLogout(event) {
    this.logout.emit()
  }
  toggle : boolean = true 
  ngOnInit() {
  }

  toggleSideBar(){
    if(this.toggle){
      document.getElementById("sideBar").style.left = "0";
      this.toggle = false
    }
    else{
      document.getElementById("sideBar").style.left = "-200px";
      this.toggle = true
    }
  }

}

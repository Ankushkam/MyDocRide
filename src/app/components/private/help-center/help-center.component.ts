import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css']
})
export class HelpCenterComponent implements OnInit {

  @Input() public dataLoaded : any
  constructor() { }

  ngOnInit() {
  }

}

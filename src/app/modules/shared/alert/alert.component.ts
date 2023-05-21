import { Component, Input, OnInit } from '@angular/core';
import { Alert } from 'src/app/model/Alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() alert!: Alert | null;

  constructor() {}

  ngOnInit(): void {
    
  }

  public close() {
    this.alert = null;
  }
}

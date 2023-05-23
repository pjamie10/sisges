import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public salesData = [
    {
      name: 'Enero',
      value: 65
    },
    {
      name: 'Febrero',
      value: 59
    },
    {
      name: 'Marzo',
      value: 80
    },
    {
      name: 'Abril',
      value: 81
    },
    {
      name: 'Mayo',
      value: 56
    },
    {
      name: 'Junio',
      value: 55
    }
  ];

  colorScheme = 'cool';

  constructor(
  ) { }

  ngOnInit(): void {

  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  componentTitle="hello world from component.ts!"; 
  clickHandler(){
    alert("you clicked the buttton");
  }
}

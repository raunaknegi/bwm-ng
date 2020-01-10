import { Input, Output,EventEmitter, OnChanges } from '@angular/core';

export class EditableComponent implements OnChanges {

  @Input() entity:any;
  @Input() style:any;
  @Input() set field(fieldName:string){
    this.entityField=fieldName;
    this.originalEntityValue=this.entity[this.entityField];
  };
  @Input() classname:any;
  @Output() updatedEntity = new EventEmitter();



  entityField:any;
  originalEntityValue:any;

  isActiveInput:boolean=false;  

  constructor() { }

  ngOnChanges() {
    this.originalEntityValue=this.entity[this.entityField];
    this.isActiveInput=false;
  }

  cancelUpdate(){
    this.isActiveInput=false;
    this.entity[this.entityField]=this.originalEntityValue;

  }

  updateTitle(){
    const entityValue=this.entity[this.entityField];
    if(entityValue !== this.originalEntityValue){
      this.updatedEntity.emit({[this.entityField]: this.entity[this.entityField]});
      this.originalEntityValue=this.entity[this.entityField];
    }   
    this.isActiveInput=false; 
  }
}

import { Component } from '@angular/core';
import { EditableComponent } from '../editable.component';

@Component({
  selector: 'bwm-editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss']
})
export class EditableImageComponent extends EditableComponent {
  handleImage(imageUrl){
    this.entity[this.entityField]=imageUrl;

    this.updateTitle();
  }
  handleImageLoad(){
    this.isActiveInput=true;
  }
  handleCancel(){
    this.cancelUpdate();
  }
}

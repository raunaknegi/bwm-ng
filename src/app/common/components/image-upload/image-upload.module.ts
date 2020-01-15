import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import {ImageUploadService} from './image-upload.service';
import { HttpModule} from '@angular/http';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ImageCropperModule  
  ],
  declarations: [
    ImageUploadComponent
  ],
  exports:[
    ImageUploadComponent
  ],
  providers:[
    ImageUploadService
  ]
})
export class ImageUploadModule { }

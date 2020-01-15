import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ImageUploadService } from './image-upload.service';

class FileSnippet{
  static readonly IMAGE_SIZE={width:750,height:422};
  pending:boolean=false;
  status:string="INIT";

  constructor(public src:string,public file:File){}
}

@Component({
  selector: 'bwm-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
 
  selectedFile:FileSnippet;
  imageChangedEvent:any;
  @Output() imageUploaded=new EventEmitter();

  constructor(private imageService:ImageUploadService) { }

  ngOnInit() {
  }

  imageCropped(file:File){
    if(this.selectedFile){
      return this.selectedFile.file=file
    }

    return this.selectedFile= new FileSnippet('',file);
  }

  processFile(event:any){
    debugger;
    this.selectedFile=undefined;

    const URL=window.URL;
    let file,img;
    
    if((file=event.target.files[0]) && (file.type==='image/png' || file.type==='image/jpeg')){
      img=new Image();

      const self=this;
      img.onload=function(){

        if(this.width>FileSnippet.IMAGE_SIZE.width && this.height>FileSnippet.IMAGE_SIZE.height){
          self.imageChangedEvent=event;
        }else{
          //error
        }
      }

      img.src=URL.createObjectURL(file);
    }else{
      //error
    }
  }


  uploadImage() {
    if (this.selectedFile) {
      debugger;
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.selectedFile.pending = true;
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.selectedFile.pending=false;
            this.imageChangedEvent = null;
            this.selectedFile.status='OK';
            this.imageUploaded.emit(imageUrl);
          },
          (errorResponse) => {
            this.selectedFile.pending=false;
            this.selectedFile.status='FAIL';
            this.imageUploaded.emit('FAIL');
            this.imageChangedEvent = null;
            console.log(errorResponse.error.errors[0].detail);
          })
      });
    reader.readAsDataURL(this.selectedFile.file);
    }
  }
}



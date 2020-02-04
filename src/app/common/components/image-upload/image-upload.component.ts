import { Component, Output,EventEmitter,ViewContainerRef } from '@angular/core';
import { ImageUploadService } from './image-upload.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

class FileSnippet{
  static readonly IMAGE_SIZE={width:950,height:422}
  pending:boolean=false;
  status:string='INIT';
  constructor(public src:string,public file:File){}
}

@Component({
  selector: 'bwm-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
 
  @Output() imageUploaded=new EventEmitter();
  @Output() imageLoadedToContainer=new EventEmitter();
  @Output() uploadCancel=new EventEmitter();

  imageChangedEvent:any;
  selectedFile:any;

  constructor(private imageService:ImageUploadService,
              private toastr:ToastsManager,
              private vcr: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  imageCropped(file:File){
    if(this.selectedFile){
      return this.selectedFile.file=file;
    }

    return this.selectedFile= new FileSnippet('',file);
  }

  imageLoaded(){
    this.imageLoadedToContainer.emit();
  }

  cancelImage(){
    this.uploadCancel.emit();
    this.imageChangedEvent=null;
  }

  processFile(event:any){
    this.selectedFile=undefined;
    const URL=window.URL;
    let file,img;
    if((file=event.target.files[0]) && (file.type==='image/jpeg' || file.type==='image/png')){
      img=new Image();
      const self=this;
      img.onload=function(){
        if(this.width>FileSnippet.IMAGE_SIZE.width && this.height>FileSnippet.IMAGE_SIZE.height){
          self.imageChangedEvent=event; 
        }else{
          self.toastr.error(`Minimum width is ${FileSnippet.IMAGE_SIZE.width} and minimum height is ${FileSnippet.IMAGE_SIZE.height} `, 'Error!');
        }
      }
      img.src=URL.createObjectURL(file);
    }else{
      this.toastr.error('Invalid File Format! Only JPEG and PNG are allowed!', 'Error!');
    }
  }

  uploadImage(){
    if(this.selectedFile){
      const reader=new FileReader();
      reader.addEventListener('load',(event:any)=>{
        this.selectedFile.src=event.target.result;
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl)=>{
            
            this.selectedFile.pending=false;
            this.selectedFile.status="OK";
            this.imageChangedEvent=null;
            this.imageUploaded.emit(imageUrl);
          },
        (errorResponse)=>{
          this.toastr.error(errorResponse.error.errors[0].detail, 'Error!');
          
          this.selectedFile.pending=false;
          this.selectedFile.status="FAIL";
          this.imageChangedEvent=null;
          this.imageUploaded.emit('FAIL');
        }
        )
      });
      reader.readAsDataURL(this.selectedFile.file);    
    }
  }
}



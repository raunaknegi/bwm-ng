import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators} from '@angular/forms'
import {AuthService} from '../shared/auth.service';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'bwm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  errors:any[]=[];
  notifyMessage:string='';

  constructor(private formBuider:FormBuilder,
              private authService:AuthService,
              private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.initForm();
    this.activatedRoute.params.subscribe(
      (params)=> {
        if(params['registered']==='success'){
          this.notifyMessage="You have been successfully registered";
        }          
      });
  }

  initForm(){
    this.loginForm=this.formBuider.group({
      email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password:['',[Validators.required]]
    })
  }

  isInvalidForm(fieldName):boolean{
 
   return this.loginForm.controls[fieldName].invalid && (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched)
              
  }

 isRequired(fieldName){
   return this.loginForm.controls[fieldName].errors.required
     
 }

 login(){
   
   this.authService.loginService(this.loginForm.value).subscribe(
     (token)=>{
      this.router.navigate(['/rentals']);
     },
     (errorResponse)=>{
      this.errors=errorResponse.error.errors;
     });
 }
}

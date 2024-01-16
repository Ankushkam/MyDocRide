declare let require : any
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service'
import { HomeService } from '../home/home.service'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { FlashMessagesService } from 'angular2-flash-messages'; 
import { NgxSpinnerService } from "ngx-spinner";
import { nameRegex, emailRegex } from '../../../shared/regex-helpers'
import States from '../../../shared/states.json'
import { StateCheckValidator } from '../../../shared/state-validator'
import { LoginComponent } from '../login/login.component'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare let $: any;

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  @ViewChild(LoginComponent, {static :true}) loginComponent : LoginComponent
  @ViewChild('myVideo', {static :true}) myVideo: ElementRef;
  @ViewChild("mymodal", { static: false }) child: any;


  states = States
  hidePlay: boolean = false;
  public closeResult: string
  public emailForm: FormGroup;
  pop_up_close_btn = false

  constructor(
    private _fb : FormBuilder, 
    private _loginService : LoginService,
    private _route : ActivatedRoute,
    private _router : Router,
    private _spinner : NgxSpinnerService,
    private _homeService : HomeService,
    private _flashMessagesService: FlashMessagesService,
    private modalService: NgbModal
  ) { this.createForm();  }

  private createForm() {
    this.emailForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      page_type : 2   
    });
  }

  //Pop up Email Form
  public submitForm() {    
    this._spinner.show()
    this._homeService.pagePopupEmail(this.emailForm.value).subscribe(
      response => {        
        this._spinner.hide()
        this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 5000 });       
        this.emailForm.get('email').reset() 
        this.pop_up_close_btn = true      

      },
      error => {
        if (error.status===422) {          
          Object.keys(error.error).forEach(key => {
            const formControl = this.emailForm.get(key)
            if (formControl) {
              formControl.setErrors({
                serverError : error.error[key][0]
              })
            }
          })

        }        
        else if (error.status===0 || error.status===500) {
          this._flashMessagesService.show('Server is not responding', { cssClass: 'alert-danger', timeout: 5000 });
        }
        this._spinner.hide()        
      }
    )
  }

  getInTouchForm = this._fb.group({
    fname : ['', [Validators.required, Validators.maxLength(25) , Validators.pattern(nameRegex)]],
    lname : ['', [Validators.required, Validators.maxLength(25), Validators.pattern(nameRegex)]],
    email : ['', [Validators.required, Validators.email]],
    phone_number : ['', [Validators.required, Validators.minLength(10)]],
    state : ['', [Validators.required]],
    city : ['', [Validators.required, Validators.pattern(nameRegex), Validators.minLength(3), Validators.maxLength(25)]],
    message : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  }, { validator : StateCheckValidator.MatchState })

  getInTouch(event) {
    this._spinner.show()
    this._homeService.getInTouch(this.getInTouchForm.value).subscribe(
      response => {
        this.getInTouchForm.reset()
        this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 5000 });
        this._spinner.hide()
      }
    ),
    error => {
      this._flashMessagesService.show(error['message'], { cssClass: 'alert-danger', timeout: 5000 });
      this._spinner.hide()
    }
  }

  showModal(event, type) {
    this.loginComponent.showModal(event, type)
  }

  ngOnInit() {
    if (localStorage.getItem('mdrt')) {
      this._router.navigate(['/dashboard/staff-list'])
    }
    
    //Show login modal when someone clicks on login button from signup page
    this._route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.get('type')==='login') {
        $('#login_forgotpasswordModal').modal('show')
      }
    })

    //To redirect to the login page 
    this._route.paramMap.subscribe((paramMap:ParamMap) => {
      if (paramMap.get('token') !== null) {
        this._loginService.verifyAccount(paramMap.get('token')).subscribe(
          response => {
            localStorage.removeItem('number')
            this._router.navigate(['/welcome/login'])
          },
          error => {
            this._router.navigate(['/'])
          }
        )
      }
    })
  }

  
  playPause() {
    if(!this.myVideo.nativeElement.paused){
      this.hidePlay = false;
      this.myVideo.nativeElement.pause()
    }
    else{
      this.myVideo.nativeElement.play();
      this.hidePlay = true;
    }
  }

   //Checking the timer for 10 sec after init.
  ngAfterViewInit(){    
    setTimeout( ()=>{
      //this.timer_experied = true ;
     //<button class="btn btn-primary" id="email_pop_up" (click)="open(mymodal)" style="display: none;">Pop up</button>
      //let element:HTMLElement = document.getElementById('email_pop_up') as HTMLElement;
      //element.click();
      if(localStorage.getItem('mdrt')){
      }
      else {
       this.open(this.child) 
      } 
    }, 10000)
  }

 //Pop Up Modal
 open(content) {
  this.modalService.open(content, {backdrop:'static', ariaLabelledBy: 'modal-basic-title',centered:true}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  } 
}


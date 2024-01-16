import { Component, OnInit, Input } from '@angular/core';
import { StaffserviceService } from '../stafflist/staffservice.service'
import { FormBuilder,  Validators } from '@angular/forms'
import { nameRegex, phoneRegex } from '../../../shared/regex-helpers'
import States from '../../../shared/states.json'
import { StateCheckValidator } from '../../../shared/state-validator'
import { FlashMessagesService } from 'angular2-flash-messages'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {

  @Input() user : any
  states = States
  selectedImage : File = null
  previewImage : any
  isImagePreviewd : boolean = false

  constructor( 
    private _staffList : StaffserviceService,
    private _fb : FormBuilder,
    private _spinner : NgxSpinnerService,
    private _flashMessagesService: FlashMessagesService,
    private _router : Router
  ) { }

  uploadImage(event) {
    this.selectedImage = <File>event.target.files[0]
    const types = ['image/jpeg', 'image/JPEG', 'image/jpg', 'image/JPG', 'image/png', 'image/PNG']
    if (this.selectedImage.size > 2097152) {
      this._flashMessagesService.show('Max allowed size is 2mb.', { cssClass: 'alert-danger', timeout: 5000 });
    } 
    else if (!types.includes(this.selectedImage.type)) {
      this._flashMessagesService.show('Only jpeg, jpg and png extensions are allowed.', { cssClass: 'alert-danger', timeout: 5000 });
    }
    else {
      this.isImagePreviewd = true
      let reader = new FileReader()
      reader.readAsDataURL(this.selectedImage)
      reader.onload = (event:any) => {
        this.previewImage = event.target.result   
        this.staffForm.get('image').setValue(this.selectedImage)
      }
    }
  }

  staffForm = this._fb.group({
    image : [null],
    first_name : ['', [Validators.required, Validators.maxLength(25) , Validators.pattern(nameRegex)]],
    last_name : ['', [Validators.required, Validators.maxLength(25), Validators.pattern(nameRegex)]],
    email : ['', [Validators.required, Validators.email]],
    mobile_number : ['', [Validators.required, Validators.pattern(phoneRegex)]],
    street : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    state : ['', [Validators.required]],
    zipcode : ['', [Validators.required, Validators.maxLength(15)]],
    city : ['', [Validators.required, Validators.pattern(nameRegex), Validators.minLength(3), Validators.maxLength(25)]],
  }, { validator : StateCheckValidator.MatchState })

  submitStaffForm() {
    this._spinner.show()
    if (
      this.staffForm.get('first_name').value==='' ||
      this.staffForm.get('last_name').value==='' ||
      this.staffForm.get('email').value==='' ||
      this.staffForm.get('mobile_number').value==='' ||
      this.staffForm.get('state').value==='' ||
      this.staffForm.get('city').value==='' ||
      this.staffForm.get('street').value==='' ||
      this.staffForm.get('zipcode').value===''
    ) {
      this._spinner.hide()
    } 
    else {
      const formData = new FormData();
      formData.append('first_name', this.staffForm.get('first_name').value)
      formData.append('last_name', this.staffForm.get('last_name').value)
      formData.append('email', this.staffForm.get('email').value)
      formData.append('mobile_number', this.staffForm.get('mobile_number').value)
      formData.append('street', this.staffForm.get('street').value)
      formData.append('city', this.staffForm.get('city').value)
      formData.append('state', this.staffForm.get('state').value)
      formData.append('zipcode', this.staffForm.get('zipcode').value)
      formData.append('image', this.staffForm.get('image').value)
      this._staffList.addStaff(formData, this.user['id'], localStorage.getItem('mdrt'))
      .subscribe(
        response => {
          this._spinner.hide()
          this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 3000 });
          setTimeout(() => {
            this._router.navigate(['/dashboard/staff-list'])
          }, 3500)
        },
        error => {
          if (error.status===422) {
            Object.keys(error.error.errors).forEach(key => {
              const formControl = this.staffForm.get(key)
              if (formControl) {
                formControl.setErrors({
                  serverError : error.error.errors[key][0]
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
  }

  ngOnInit() {
  }

}

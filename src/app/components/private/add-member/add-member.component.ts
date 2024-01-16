import { Component, OnInit, Input } from '@angular/core';
import { MemberService } from '../memberlist/member.service'
import { FormBuilder,  Validators } from '@angular/forms'
import { nameRegex, phoneRegex } from '../../../shared/regex-helpers'
import States from '../../../shared/states.json'
import { StateCheckValidator } from '../../../shared/state-validator'
import { FlashMessagesService } from 'angular2-flash-messages'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  @Input() user : any
  states = States
  selectedImage : File = null
  previewImage : any
  isImagePreviewd : boolean = false

  constructor( private _memberService : MemberService,
    private _fb : FormBuilder,
    private _spinner : NgxSpinnerService,
    private _flashMessagesService: FlashMessagesService,
    private _router : Router
  ) { }

  memberForm = this._fb.group({
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
        this.memberForm.get('image').setValue(this.selectedImage)
      }
    }
  }

  submitMemberForm() {
    this._spinner.show()
    if (
      this.memberForm.get('first_name').value==='' ||
      this.memberForm.get('last_name').value==='' ||
      this.memberForm.get('email').value==='' ||
      this.memberForm.get('mobile_number').value==='' ||
      this.memberForm.get('state').value==='' ||
      this.memberForm.get('city').value==='' ||
      this.memberForm.get('street').value==='' ||
      this.memberForm.get('zipcode').value===''
    ) {
      this._spinner.hide()
    } 
    else {
      const formData = new FormData();
      formData.append('first_name', this.memberForm.get('first_name').value)
      formData.append('last_name', this.memberForm.get('last_name').value)
      formData.append('email', this.memberForm.get('email').value)
      formData.append('mobile_number', this.memberForm.get('mobile_number').value)
      formData.append('street', this.memberForm.get('street').value)
      formData.append('city', this.memberForm.get('city').value)
      formData.append('state', this.memberForm.get('state').value)
      formData.append('zipcode', this.memberForm.get('zipcode').value)
      formData.append('image', this.memberForm.get('image').value)
      this._memberService.addNewMember(formData, localStorage.getItem('mdrt'))
      .subscribe(
        response => {
          this._spinner.hide()
          this._flashMessagesService.show(response['message'], { cssClass: 'alert-success', timeout: 3000 });
          setTimeout(() => {
            this._router.navigate(['/dashboard/member-list'])
          }, 3500)
        },
        error => {
          if (error.status===422) {
            Object.keys(error.error.errors).forEach(key => {
              const formControl = this.memberForm.get(key)
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


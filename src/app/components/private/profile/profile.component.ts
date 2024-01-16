import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages'
import { imageUrl } from '../../../shared/url-helpers'
import { StaffserviceService } from '../stafflist/staffservice.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Output() imageEvent = new EventEmitter()
  @Input() user : any
  @Input() dataLoaded : any
  selectedImage : File = null
  image = 'assets/images/doctorlogo.png'
  isImageChanged = false

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private _staffList : StaffserviceService) 
  { }

  uploadImage(event) {
    this.selectedImage = <File>event.target.files[0]
    const types = ['image/jpeg', 'image/JPEG', 'image/jpg', 'image/JPG', 'image/png', 'image/PNG']
    if (this.selectedImage.size > 2097152) {
      this._flashMessagesService.show('Max allowed size is 2mb.', { cssClass: 'alert-danger', timeout: 5000 });
    } 
    if (!types.includes(this.selectedImage.type)) {
      this._flashMessagesService.show('Only jpeg, jpg and png extensions are allowed.', { cssClass: 'alert-danger', timeout: 5000 });
    }
    const fd = new FormData()
    fd.append('image', this.selectedImage, this.selectedImage.name)
    this._staffList.imageUpload(fd, localStorage.getItem('mdrt'))
    .subscribe(
      response => { 
        this.isImageChanged = true
        this.image = `${imageUrl}/${response['image']}`
        this.imageEvent.emit(this.image)
      },
      error => {
        this._flashMessagesService.show(error['error']['message'], { cssClass: 'alert-danger', timeout: 5000 });
      }
    )
  }

  ngOnInit() {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { filter, take } from 'rxjs/operators';
import { Member, Photo } from 'src/app/models/member.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']

})
export class PhotoEditorComponent implements OnInit {
  @Input() member!: Member;
  public uploader!: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public baseUrl: string = environment.apiUrl;

  private currentUser: User;
  constructor(
    private memberService: MembersService,
    private accountService: AccountService) {
    this.currentUser = {
      username: "",
      token: ""
    }

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.currentUser = user
      }
    });
  }

  ngOnInit(): void {
    this.initUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.currentUser.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.currentUser);
      this.member.photoUrl = photo.url
      this.member.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      })
    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id != photoId);
    })
  }
  initUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + "users/add-photo",
      authToken: "Bearer " + this.currentUser.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    })

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);
        if (photo.isMain) {
          this.currentUser.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.currentUser);
        }
      }
    }
  }

}

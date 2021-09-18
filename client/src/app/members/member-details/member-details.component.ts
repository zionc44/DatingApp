import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/models/member.model';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {
  public member!: Member;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[]=[];
  constructor(
    private membersService: MembersService,
    private route: ActivatedRoute
  ) { 

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
      }
    ]
  }

  ngOnInit(): void {
    this.loadMember();
  }

  getIamges() :NgxGalleryImage[] {
     const imageUrls = [];

     for(const photo of this.member.photos) {
       imageUrls.push({
         small: photo?.url,
         medium: photo?.url,
         big: photo?.url  
       })
     }
     return imageUrls;
  }

  loadMember() {
    let username = this.route.snapshot.paramMap.get("username");
    this.membersService.getMember(username? username: "").subscribe(member=> {
      this.member = member;
      this.galleryImages = this.getIamges();
    })
  }
}

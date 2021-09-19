import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl: string = environment.apiUrl;
  private members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers() : Observable <Member[]> {
    if (this.members.length >0) return of(this.members);

    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username:string) : Observable<Member> {
    const member = this.members.find(x=> x.userName === username);
    if(member!== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + "users/"+ username);
  }

  updateMember(member:Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId:number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId:number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}


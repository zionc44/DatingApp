import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';
import { PaginatedResult, Pagination } from '../models/pagination.model';
import { UserParams } from '../models/user-params.model';
import { getPaginatedResult, getPaginationHeraders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl: string = environment.apiUrl;
  private members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    let params = getPaginationHeraders(userParams);
    params = params.append('orderBy', userParams.orderBy.toString());
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender.toString());
    return getPaginatedResult<Member[]>(this.baseUrl + 'users',params, this.http);
  }

  getMember(username: string): Observable<Member> {
    const member = this.members.find(x => x.userName === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username:string) {
    return this.http.post(this.baseUrl + 'likes/'+ username, {})
  }

  getLikes(userParams: UserParams) {
    let params = getPaginationHeraders(userParams);
    params = params.append('predicate', userParams.predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes',params,this.http);
  }
}


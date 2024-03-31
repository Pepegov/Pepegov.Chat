import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/chat/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllMembers(pageNumber: number, pageSize: number){

    return this.http.get<Member[]>(this.baseUrl+'member', { observe: 'response' })
  }

  //tim chinh xac username
  getMember(username: string){
    return this.http.get<Member>(this.baseUrl+'member/'+username);
  }

  updateLocekd(username: string){
    return this.http.put(this.baseUrl+'member/'+username, {});
  }
}

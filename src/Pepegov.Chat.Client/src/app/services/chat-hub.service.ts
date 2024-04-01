import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../models/chat/member';
import { Message } from '../models/chat/message';
import { MessageCountStreamService } from './message-count-stream.service';
import { MuteCamMicService } from './mute-cam-mic.service';
import {UserInfo} from "./openid.service";

@Injectable({
  providedIn: 'root'
})
export class ChatHubService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;

  //private onlineUsersSource = new BehaviorSubject<Member[]>([]);
  //onlineUsers$ = this.onlineUsersSource.asObservable();

  private oneOnlineUserSource = new Subject<Member>();
  oneOnlineUser$ = this.oneOnlineUserSource.asObservable();

  private oneOfflineUserSource = new Subject<Member>();
  oneOfflineUser$ = this.oneOfflineUserSource.asObservable();

  private messagesThreadSource = new BehaviorSubject<Message[]>([]);
  messagesThread$ = this.messagesThreadSource.asObservable();

  constructor(private toastr: ToastrService,
    private messageCount: MessageCountStreamService,
    private muteCamMicro: MuteCamMicService) { }

  createHubConnection(user: UserInfo, roomId: string, token : string){

    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+ 'chathub?roomId=' + roomId, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      accessTokenFactory: ()=> token
    })
    .configureLogging(LogLevel.Debug)
    .withAutomaticReconnect()
    .build()

    console.log("hub connection start")
    this.hubConnection.start()
      .then(() => console.log("Connection started"))
      .catch(err => console.log("fack " + err));

    // this.hubConnection.on('ReceiveMessageThread', messages => {
    //   this.messageThreadSource.next(messages);
    // })

    console.log("subs to NewMessage")
    this.hubConnection.on('NewMessage', message => {
      if(this.messageCount.activeTabChat){
        this.messageCount.MessageCount = 0;
      }else{
        this.messageCount.MessageCount += 1
      }
      this.messagesThread$.pipe(take(1)).subscribe(messages => {
        this.messagesThreadSource.next([...messages, message])
      })
    })

    console.log("subs to UserOnlineInGroup")
    this.hubConnection.on('UserOnlineInGroup', (user: Member) => {
      //this.onlineUsersSource.next(users);
      this.oneOnlineUserSource.next(user);
      this.toastr.success(user.displayName + ' has join room!')
    })

    console.log("subs to UserOfflineInGroup")
    this.hubConnection.on('UserOfflineInGroup', (user: Member) => {
      // this.onlineUsers$.pipe(take(1)).subscribe(users => {
      //   this.onlineUsersSource.next([...users.filter(x => x.userName !== user.userName)])
      // })
      this.oneOfflineUserSource.next(user);
      this.toastr.warning(user.displayName + ' has left room!')
    })

    console.log("subs to OnMuteMicro")
    this.hubConnection.on('OnMuteMicro', ({username, mute}) => {
      this.muteCamMicro.Microphone = {username, mute}
    })

    console.log("subs to OnMuteCamera")
    this.hubConnection.on('OnMuteCamera', ({username, mute}) => {
      this.muteCamMicro.Camera = {username, mute}
    })

    console.log("subs to OnShareScreen")
    this.hubConnection.on('OnShareScreen', (isShareScreen) => {
      this.muteCamMicro.ShareScreen = isShareScreen
    })

    console.log("subs to OnShareScreenLastUser")
    this.hubConnection.on('OnShareScreenLastUser', ({usernameTo, isShare}) => {
      this.muteCamMicro.LastShareScreen = {username: usernameTo, isShare}
    })

    console.log("subs to OnUserIsSharing")
    this.hubConnection.on('OnUserIsSharing', currentUsername => {
      this.muteCamMicro.UserIsSharing = currentUsername
    })
  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop().catch(error => console.log("stopHubConnection " + error));
    }
  }

  async sendMessage(content: string){
    return this.hubConnection.invoke('SendMessage', {content})
      .catch(error => console.log("SendMessage error " + error));
  }

  async muteMicroPhone(mute: boolean){
    return this.hubConnection.invoke('MuteMicro', mute)
      .catch(error => console.log("MuteMicro error " + error));
  }

  async muteCamera(mute: boolean){
    return this.hubConnection.invoke('MuteCamera', mute)
      .catch(error => console.log("MuteCamera error " + error));
  }

  async shareScreen(roomId: string, isShareScreen: boolean){
    return this.hubConnection.invoke('ShareScreen', roomId, isShareScreen)
      .catch(error => console.log("ShareScreen error " + error));
  }

  async shareScreenToUser(roomId: string, username: string, isShareScreen: boolean){
    return this.hubConnection.invoke('ShareScreenToUser', roomId, username, isShareScreen)
      .catch(error => console.log("ShareScreenToUser error " + error));
  }
}

import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Message } from '../models/chat/message';
import { MessageCountStreamService } from './message-count-stream.service';
import { MuteCamMicService } from './mute-cam-mic.service';
import {UserInfo} from "../models/auth/user-info";

export class ChatHubService {
  hubUrl = process.env.hubUrl;
  private hubConnection: HubConnection;

  //private onlineUsersSource = new BehaviorSubject<Member[]>([]);
  //onlineUsers$ = this.onlineUsersSource.asObservable();

  private oneOnlineUserSource = new Subject<UserInfo>();
  oneOnlineUser$ = this.oneOnlineUserSource.asObservable();

  private oneOfflineUserSource = new Subject<UserInfo>();
  oneOfflineUser$ = this.oneOfflineUserSource.asObservable();

  private messagesThreadSource = new BehaviorSubject<Message[]>([]);
  messagesThread$ = this.messagesThreadSource.asObservable();

  constructor(private messageCount: MessageCountStreamService,
    private muteCamMicro: MuteCamMicService) { }

  createHubConnection(user: UserInfo, roomId: string, token : string){
    console.log(`try connect to hub ${this.hubUrl+ 'chathub?roomId=' + roomId} | access token = ${token}`)

    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+ 'chathub?roomId=' + roomId, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
      accessTokenFactory: () => token
    })
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build()

    console.log("hub connection start")
    this.hubConnection.start()
      .then(() => console.log("Connection started"))
      .catch(err => console.log("fuck " + err));

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
    this.hubConnection.on('UserOnlineInGroup', (user: UserInfo) => {
      //this.onlineUsersSource.next(users);
      this.oneOnlineUserSource.next(user);
      console.log(user.nickname + ' has join room!');
      console.log(user)
    })

    console.log("subs to UserOfflineInGroup")
    this.hubConnection.on('UserOfflineInGroup', (user: UserInfo) => {
      // this.onlineUsers$.pipe(take(1)).subscribe(users => {
      //   this.onlineUsersSource.next([...users.filter(x => x.userName !== user.userName)])
      // })
      this.oneOfflineUserSource.next(user);
      console.log(user.name + ' has left room!')
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

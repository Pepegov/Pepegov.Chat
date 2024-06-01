import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Subscription } from 'rxjs';
import { eMeet } from '../../../models/chat/eMeeting';
import { VideoElement } from '../../../models/chat/video-element';
import { ChatHubService } from '../../../services/chat-hub.service';
import { MessageCountStreamService } from '../../../services/message-count-stream.service';
import { MuteCamMicService } from '../../../services/mute-cam-mic.service';
import { RecordFileService } from '../../../services/record-file.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../../services/ConfigService';
import { UtilityStreamService } from '../../../services/utility-stream.service';
import {ChatComponent} from "../chat/chat.component";
import {OpenIdService, UserInfo} from "../../../services/openid.service";
import Peer from "peerjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') localVideoPlayer: ElementRef;
  isMeeting: boolean;
  currentUser: UserInfo | null;
  subscriptions = new Subscription();
  shareScreenPeer: any;
  shareScreenStream: any;
  enableShareScreen = true;// enable or disable button sharescreen
  isStopRecord = false;
  textStopRecord = 'Start Record';
  videos: VideoElement[] = [];
  isRecorded: boolean;
  userIsSharing: string;

  constructor(private chatHub: ChatHubService,
    private shareScreenService: MuteCamMicService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private utility: UtilityStreamService,
    private recordFileService: RecordFileService,
    private messageCountService: MessageCountStreamService,
    private accountService: OpenIdService,
    private chatComponent : ChatComponent) {
  }

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.isMeeting) {
      $event.returnValue = true;
    }
  }

  roomId: string;
  myPeer: Peer;
  ngOnInit(): void {
    this.getCurrentUser()

    this.isMeeting = true
    this.isRecorded = this.configService.isRecorded;//enable or disable recorded

    const shareScreen = localStorage.getItem('share-screen')
    if(shareScreen){
      const enableShareScreen = JSON.parse(shareScreen)
      if (enableShareScreen) {// != null
        this.enableShareScreen = enableShareScreen
      }
    }

    const id = this.route.snapshot.paramMap.get('id')
    if(id)
    {
      this.roomId = id
      console.log("roomId: ", this.roomId)
    }

    this.createLocalStream()

    this.chatHub.createHubConnection(this.currentUser, this.roomId, this.accountService.getAccessToken())

    this.configureUserPeer()

    this.configureShareScreenPeer()

    this.callGroup()

    this.subscribeUsers()

    this.subscribeShareScreens()
  }

  subscribeShareScreens(){
    this.subscriptions.add(
      this.shareScreenService.shareScreen$.subscribe(val => {
        if (val) {//true = share screen
          this.enableShareScreen = false;
          localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
        } else {// false = stop share
          this.enableShareScreen = true;
          localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
        }
      })
    )

    this.subscriptions.add(this.shareScreenService.lastShareScreen$.subscribe(val => {
      if (val.isShare) {//true = share screen
        this.chatHub.shareScreenToUser(this.roomId, val.username, true)
        setTimeout(() => {
          const call = this.shareScreenPeer.call('share_' + val.username, this.shareScreenStream);
        }, 1000)
      }
    }))

    this.subscriptions.add(this.utility.kickedOutUser$.subscribe(val => {
      this.isMeeting = false
      this.accountService.logout()
      this.toastr.info('You have been locked by admin')
      this.router.navigateByUrl('/login')
    }))

    this.subscriptions.add(this.shareScreenService.userIsSharing$.subscribe(val => {
      this.userIsSharing = val
    }))
  }

  subscribeUsers(){
    this.subscriptions.add(
      this.chatHub.oneOnlineUser$.subscribe(member => {
        if (this.currentUser.nickname !== member.nickname) {
          // Let some time for new peers to be able to answer
          setTimeout(() => {
            const call = this.myPeer.call(member.nickname, this.stream, {
              metadata: { user: this.currentUser },
            });
            call.on('stream', (otherUserVideoStream: MediaStream) => {
              this.addOtherUserVideo(member, otherUserVideoStream);
            });

            call.on('close', () => {
              this.videos = this.videos.filter((video) => video.user.nickname !== member.nickname);
              this.tempvideos = this.tempvideos.filter(video => video.user.nickname !== member.nickname);
            });
          }, 1000);
        }
      })
    );

    this.subscriptions.add(this.chatHub.oneOfflineUser$.subscribe(member => {
      this.videos = this.videos.filter(video => video.user.nickname !== member.nickname);
      this.tempvideos = this.tempvideos.filter(video => video.user.nickname !== member.nickname);
    }));
  }

  callGroup() {
    this.myPeer.on('call', (call : any) => {
      call.answer(this.stream);
      call.on('stream', (otherUserVideoStream: MediaStream) => {
        this.addOtherUserVideo(call.metadata.user, otherUserVideoStream);
      });
      call.on('error', (err : any) => {
        console.error("call group error" + err);
      })
    });
  }

  configureShareScreenPeer(){
    this.shareScreenPeer = new Peer('share_' + this.currentUser.nickname, {
      config: {
        'iceServers': [
          { urls: 'stun:freeturn.net:5349' },
          { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' }
        ]
      }
    })

    this.shareScreenPeer.on('call', (call : any) => {
      call.answer(this.shareScreenStream);
      call.on('stream', (otherUserVideoStream: MediaStream) => {
        console.log("share screen peer")
        this.shareScreenStream = otherUserVideoStream;
      });

      call.on('error', (err : any) => {
        console.error("open new share screen peer error" + err);
      })
    });
  }

  configureUserPeer(){
    this.myPeer = new Peer(this.currentUser.nickname, {
      config: {
        'iceServers': [
          { urls: 'stun:freeturn.net:5349' },
          { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' }
        ]
      }
    });

    //open new user peer
    this.myPeer.on('open', (userId:any) => {
      console.log("open new user peer " + userId)
    });
  }

  addOtherUserVideo(user: UserInfo, stream: MediaStream) {
    const alreadyExisting = this.videos.some(video => video.user.nickname === user.nickname);
    console.log("add addOtherUserVideo. alreadyExisting:" + alreadyExisting)
    console.log(user)
    if (alreadyExisting) {
      console.log(this.videos, user);
      return;
    }

    this.videos.push({
      muted: false,
      srcObject: stream,
      user: user
    });


    this.tempvideos.push({
      muted: false,
      srcObject: stream,
      user: user
    })
  }

  tempvideos: VideoElement[] = [];

  stream: any;
  enableVideo = true;
  enableAudio = true;

  async createLocalStream() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: this.enableVideo, audio: this.enableAudio });
      this.localVideoPlayer.nativeElement.srcObject = this.stream;
      this.localVideoPlayer.nativeElement.load();
      this.localVideoPlayer.nativeElement.play();
    } catch (error) {
      console.error(error);
      alert(`Can't join room, error ${error}`);
    }
  }

  enableOrDisableVideo() {
    this.enableVideo = !this.enableVideo
    if (this.stream.getVideoTracks()[0]) {
      this.stream.getVideoTracks()[0].enabled = this.enableVideo;
      this.chatHub.muteCamera(this.enableVideo)
    }
  }

  enableOrDisableAudio() {
    this.enableAudio = !this.enableAudio;
    if (this.stream.getAudioTracks()[0]) {
      this.stream.getAudioTracks()[0].enabled = this.enableAudio;
      this.chatHub.muteMicroPhone(this.enableAudio)
    }
  }

  onSelect(data: TabDirective): void {
    if (data.heading == "Chat") {
      this.messageCountService.ActiveTabChat = true;
      this.messageCountService.MessageCount = 0;
      this.chatComponent.messageCount = 0;
    } else {
      this.messageCountService.ActiveTabChat = false;
    }
  }

  getCurrentUser() {
    const userInStorage = localStorage.getItem('user')
    if(userInStorage){
      const user = JSON.parse(userInStorage)
      this.currentUser = user as UserInfo;
      console.log("user in storage: ")
      console.log(this.currentUser)
    }
    else{
      this.accountService.userProfileSubject.subscribe((userInfo) => {
        this.currentUser = userInfo;
      })
    }

  }

  async shareScreen() {
    try {
      // @ts-ignore
      let mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.chatHub.shareScreen(this.roomId, true);
      this.shareScreenStream = mediaStream;
      this.enableShareScreen = false;

      this.videos.forEach(v => {
        const call = this.shareScreenPeer.call('share_' + v.user.nickname, mediaStream);
        //call.on('stream', (otherUserVideoStream: MediaStream) => { });
      })

      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        this.chatHub.shareScreen(this.roomId, false);
        this.enableShareScreen = true;
        localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
      });
    } catch (e) {
      console.log(e);
      alert(e)
    }
  }

  StartRecord() {
    this.isStopRecord = !this.isStopRecord;
    if (this.isStopRecord) {
      this.textStopRecord = 'Stop record';
      this.recordFileService.startRecording(this.stream);
    } else {
      this.textStopRecord = 'Start record';
      this.recordFileService.stopRecording();
      setTimeout(() => {
        this.recordFileService.upLoadOnServer().subscribe(() => {
          this.toastr.success('Upload file on server success');
        })
      }, 1000)
    }
  }


  getGridCols(): number {
    const userCount = this.tempvideos.length;
    if(userCount === 0){
      return 1;
    }
    else if (userCount <= 3) {
      return 2;
    } else if (userCount <= 4) {
      return 3;
    } else {
      return 4;
    }
  }

  ngOnDestroy() {
    this.isMeeting = false;
    this.myPeer.disconnect();
    this.shareScreenPeer.destroy();
    this.chatHub.stopHubConnection();
    this.subscriptions.unsubscribe();
    localStorage.removeItem('share-screen');
  }

  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }
}

import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Subscription } from 'rxjs';
import { eMeet } from '../../../models/chat/eMeeting';
import { Member } from '../../../models/chat/member';
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
  isMeeting: boolean;
  currentUser: UserInfo | null;
  currentMember: Member;
  subscriptions = new Subscription();
  statusScreen: eMeet;
  shareScreenPeer: any;
  @ViewChild('videoPlayer') localVideoPlayer: ElementRef;
  shareScreenStream: any;
  enableShareScreen = true;// enable or disable button sharescreen
  isStopRecord = false;
  textStopRecord = 'Start Record';
  videos: VideoElement[] = [];
  isRecorded: boolean;
  userIsSharing: string;
  testVideos: [
    "123",
    "355",
    "qwe",
    "asd"
  ];

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

    this.accountService.userProfileSubject.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.currentMember = { userName: user.nickname, displayName: user.name + ' ' + user.family_name} as Member
        console.log("Current member")
        console.log(this.currentMember)
      }
    })
  }

  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.isMeeting) {
      $event.returnValue = true;
    }
  }

  roomId: string;
  myPeer: any;
  ngOnInit(): void {
    const userInStorage = localStorage.getItem('user')
    if(userInStorage){
      this.currentUser = JSON.parse(userInStorage);
      this.currentMember = { userName: this.currentUser.nickname, displayName: this.currentUser.name + ' ' + this.currentUser.family_name} as Member;
    }
    this.accountService.userProfileSubject.subscribe((userInfo) => {
      this.currentUser = userInfo;
      this.currentMember = { userName: this.currentUser.nickname, displayName: this.currentUser.name + ' ' + this.currentUser.family_name} as Member;
    })

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

    console.log("creating local stream...")
    this.createLocalStream()
    console.log("creating hub connection...")

    this.chatHub.createHubConnection(this.currentUser, this.roomId, this.accountService.getAccessToken())

    console.log(`currentUser ${this.currentUser}`);
    console.log(`currentMember ${this.currentMember}`)
    console.log("Current user login: "+ this.currentUser.nickname)
    this.myPeer = new Peer(this.currentUser.nickname, {
      config: {
        'iceServers': [{
          urls: "stun:stun.l.google.com:19302",
        },{
          urls:"turn:numb.viagenie.ca",
          username:"webrtc@live.com",
          credential:"muazkh"
        }]
      }
    });

    //open new user peer
    this.myPeer.on('open', (userId:any) => {
      console.log("open new user peer " + userId)
    });

    this.shareScreenPeer = new Peer('share_' + this.currentUser.nickname, {
      config: {
        'iceServers': [{
          urls: "stun:stun.l.google.com:19302",
        },{
          urls:"turn:numb.viagenie.ca",
          username:"webrtc@live.com",
          credential:"muazkh"
        }]
      }
    })

    console.log("open new share screen peer")
    this.shareScreenPeer.on('call', (call : any) => {
      call.answer(this.shareScreenStream);
      call.on('stream', (otherUserVideoStream: MediaStream) => {
        console.log("chare screen peer")
        this.shareScreenStream = otherUserVideoStream;
      });

      call.on('error', (err : any) => {
        console.error("open new share screen peer error" + err);
      })
    });

    //call group
    console.log("call group start")
    this.myPeer.on('call', (call : any) => {
      console.log("this.myPeer.on(call)")
      call.answer(this.stream);

      call.on('stream', (otherUserVideoStream: MediaStream) => {
        //this.addMyVideo(this.stream)
        console.log("call.on('stream', (otherUserVideoStream: MediaStream) in this.myPeer.on('call'")
        console.log(call)
        this.addOtherUserVideo(call.metadata.user, otherUserVideoStream);
      });

      call.on('error', (err : any) => {
        console.error("call group error" + err);
      })
    });
    console.log("call group end")

    this.subscriptions.add(
      this.chatHub.oneOnlineUser$.subscribe(member => {
        if (this.currentUser.nickname !== member.userName) {
          // Let some time for new peers to be able to answer
          setTimeout(() => {
            const call = this.myPeer.call(member.userName, this.stream, {
              metadata: { user: this.currentMember },
            });
            call.on('stream', (otherUserVideoStream: MediaStream) => {
              console.log("call.on('stream', (otherUserVideoStream: MediaStream) in this.subscriptions.add(")
              console.log(member)
              this.addOtherUserVideo(member, otherUserVideoStream);
            });

            call.on('close', () => {
              this.videos = this.videos.filter((video) => video.user.userName !== member.userName);
              this.tempvideos = this.tempvideos.filter(video => video.user.userName !== member.userName);
            });
          }, 1000);
        }
      })
    );

    console.log("Leght of videos " + this.videos.length)

    this.subscriptions.add(this.chatHub.oneOfflineUser$.subscribe(member => {
      this.videos = this.videos.filter(video => video.user.userName !== member.userName);
      this.tempvideos = this.tempvideos.filter(video => video.user.userName !== member.userName);
    }));

    console.log("Leght of videos " + this.videos.length)

    this.subscriptions.add(
      this.shareScreenService.shareScreen$.subscribe(val => {
        if (val) {//true = share screen
          this.statusScreen = eMeet.SHARESCREEN
          this.enableShareScreen = false;
          localStorage.setItem('share-screen', JSON.stringify(this.enableShareScreen));
        } else {// false = stop share
          this.statusScreen = eMeet.NONE
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

   addMyVideo(stream: MediaStream) {
    const myMember = { userName: this.currentUser.nickname, displayName: this.currentUser.name } as Member
    console.log("my member username " + myMember.userName + " dispalyName " + myMember.displayName)
    this.videos.push({
      muted: true,
      srcObject: stream,
      user: { userName: this.currentUser.nickname, displayName: this.currentUser.name } as Member,
    });
  }

  addOtherUserVideo(user: Member, stream: MediaStream) {
    const alreadyExisting = this.videos.some(video => video.user.userName === user.userName);
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


    if(this.videos.length <= this.maxUserDisplay){
      this.tempvideos.push({
        muted: false,
        srcObject: stream,
        user: user
      })
    }
  }

  maxUserDisplay = 8; // chi hien toi da la 8 user
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

  async shareScreen() {
    try {
      // @ts-ignore
      let mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.chatHub.shareScreen(this.roomId, true);
      this.shareScreenStream = mediaStream;
      this.enableShareScreen = false;

      this.videos.forEach(v => {
        const call = this.shareScreenPeer.call('share_' + v.user.userName, mediaStream);
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

  /*   getTURNServer(): any{
      return { 'iceServers': [
        { url:'stun:stun.12voip.com:3478'}
     ] };
    } */

  ngOnDestroy() {
    this.isMeeting = false;
    this.myPeer.disconnect();//dong ket noi nhung van giu nguyen cac ket noi khac
    this.shareScreenPeer.destroy();//dong tat ca cac ket noi
    this.chatHub.stopHubConnection();
    this.subscriptions.unsubscribe();
    localStorage.removeItem('share-screen');
  }

  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }
}

import { Subject } from 'rxjs';
import { LastUserJoinRoom } from '../models/chat/lastUserJoinRoom';
import { MuteObject } from '../models/chat/mute-object';

export class MuteCamMicService {

  muteMicro: MuteObject;
  muteCamera: MuteObject;

  muteMicroSource = new Subject<MuteObject>();
  muteMicro$ = this.muteMicroSource.asObservable();

  muteCameraSource = new Subject<MuteObject>();
  muteCamera$ = this.muteCameraSource.asObservable();

  shareScreenSource = new Subject<boolean>();
  shareScreen$ = this.shareScreenSource.asObservable();

  lastShareScreenSource = new Subject<LastUserJoinRoom>();
  lastShareScreen$ = this.lastShareScreenSource.asObservable();

  shareScreenToLastUserSource = new Subject<boolean>();
  shareScreenToLastUser$ = this.shareScreenToLastUserSource.asObservable();

  userIsSharingSource = new Subject<string>();
  userIsSharing$ = this.userIsSharingSource.asObservable();

  constructor() { }

  set Microphone(value: MuteObject) {
    this.muteMicro = value;
    this.muteMicroSource.next(value);
  }

  get Microphone(): MuteObject {
    return this.muteMicro;
  }

  set Camera(value: MuteObject) {
    this.muteCamera = value;
    this.muteCameraSource.next(value);
  }

  get Camera(): MuteObject {
    return this.muteCamera;
  }

  set ShareScreen(value: boolean) {
    this.shareScreenSource.next(value);
  }

  set LastShareScreen(value: LastUserJoinRoom) {
    this.lastShareScreenSource.next(value);
  }

  set ShareScreenToLastUser(value: boolean) {
    this.shareScreenToLastUserSource.next(value);
  }

  set UserIsSharing(value: string){
    this.userIsSharingSource.next(value);
  }
}

import { ReplaySubject } from 'rxjs';

export class MessageCountStreamService {
  activeTabChat = false;
  messageCount = 0;

  messageCountSource = new ReplaySubject<number>(1);
  messageCount$ = this.messageCountSource.asObservable();

  activeTabChatSource = new ReplaySubject<boolean>(1);
  activeTabChat$ = this.activeTabChatSource.asObservable();

  constructor() { }

  set MessageCount(value: number) {
    this.messageCount = value;
    this.messageCountSource.next(value);
  }

  get MessageCount(){
    return this.messageCount;
  }

  set ActiveTabChat(value: boolean) {
    this.activeTabChat = value;
    this.activeTabChatSource.next(value);
  }
}

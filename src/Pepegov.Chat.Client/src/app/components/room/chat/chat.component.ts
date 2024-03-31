import {Component, Injectable, OnInit} from '@angular/core';
import {Message} from "../../../models/chat/message";
import {ChatHubService} from "../../../services/chat-hub.service";
import { Subscription } from 'rxjs';
import {sendMessage} from "@microsoft/signalr/dist/esm/Utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MessageCountStreamService} from "../../../services/message-count-stream.service";

@Component({
  selector: 'text-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class ChatComponent implements OnInit{
  messageInGroup: Message[] = [];
  chatForm: UntypedFormGroup;
  subscriptions = new Subscription();
  messageCount = 0;

  constructor(
    private chatHub: ChatHubService,
    private messageCountService: MessageCountStreamService) {
  }

  ngOnInit(): void {
    this.subscribe();
    this.chatForm = new UntypedFormGroup({
      content: new UntypedFormControl('', Validators.required)
    })
  }

  subscribe(){
    this.subscriptions.add(
      this.chatHub.messagesThread$.subscribe(messages => {
        this.messageInGroup = messages;
      })
    );

    this.subscriptions.add(
      this.messageCountService.messageCount$.subscribe(value => {
        this.messageCount = value;
      })
    );
  }

  sendMessage() {
    this.chatHub.sendMessage(this.chatForm.value.content).then(() => {
      this.chatForm.reset();
    })
  }
}

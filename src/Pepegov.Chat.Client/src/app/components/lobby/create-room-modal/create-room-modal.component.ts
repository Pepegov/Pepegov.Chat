import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/models/chat/room';
import { RoomService } from 'src/app/services/room.service';
import { UtilityStreamService } from 'src/app/services/utility-stream.service';

@Component({
  selector: 'create-room-modal',
  templateUrl: './create-room-modal.component.html',
  styleUrls: ['./create-room-modal.component.css']
})
export class AddRoomModalComponent implements OnInit {
  addRoomForm: UntypedFormGroup;
  title?: string;
  list: any[] = [];

  constructor(private roomService: RoomService, private utility: UtilityStreamService) {}

  ngOnInit(): void {
    this.addRoomForm = new UntypedFormGroup({
      roomName: new UntypedFormControl('', [Validators.required, Validators.maxLength(100)])
    })
  }

  save(){
    this.roomService.addRoom(this.addRoomForm.value.roomName).subscribe((res: Room)=>{
      this.utility.Room = res;//add data in room-meeting component
    })
  }
}

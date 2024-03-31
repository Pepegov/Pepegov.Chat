import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Room } from 'src/app/models/chat/room';
import { User } from 'src/app/models/authorization/user';
import { AccountService } from 'src/app/services/account.service';
import { ConfigService } from 'src/app/services/ConfigService';
import { RoomService } from 'src/app/services/room.service';
import { UtilityStreamService } from 'src/app/services/utility-stream.service';
import { AddRoomModalComponent } from '../create-room-modal/create-room-modal.component';
import { EditRoomModalComponent } from '../edit-room-modal/edit-room-modal.component';
import { PagedList } from 'src/app/models/api-result/paged-list';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.css']
})
export class LobbyListComponent implements OnInit {
  bsModalRef?: BsModalRef;
  displayedColumns = [ "Id", "Name", "MemberCount", "Owner", "Buttons" ]
  listRoom: Room[] = [];
  pageNumber = 0;
  pageSize = 5;
  maxSize = 5;
  pagedList: PagedList<Room>
  data: any;//ngModel select html
  roomGroupBy: any[] = [];
  currentUser: User | null;
  dataGroupByUser: Map<any, any>;

  constructor(private modalService: BsModalService,
    private roomService: RoomService,
    private accountService: AccountService,
    private utility: UtilityStreamService,
    private router: Router,
    private config: ConfigService,
    private toastr: ToastrService,
    private dialogRef : MatDialog) {
      //this.pageSize = this.config.pageSize
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user)
  }

  ngOnInit(): void {
    this.loadRooms();
    //add new room
    this.utility.room$.subscribe(room => {
      if (this.listRoom) {
        this.listRoom.push(room)
      }
    })

    //edit room
    this.utility.roomEdit$.subscribe(data => {
      if (this.listRoom) {
        let room = this.listRoom.find(x => x.id === data.id);
        if(room)
          room.name = data.name;
      }
    })

    this.utility.roomCount$.subscribe(data=>{
      if(this.listRoom){
        let room = this.listRoom.find(r=>r.id === data.id)
        if(room)
          room.memberCount = data.memberCount
      }
    })

    //call from signalR
    this.utility.kickedOutUser$.subscribe(val=>{
      this.accountService.Logout()
      this.toastr.info('You have been locked by admin')
      this.router.navigateByUrl('/login')
    })
  }

  loadRooms() {
    this.roomGroupBy = [];
    this.roomService.getRooms(this.pageNumber, this.pageSize).subscribe(res => {
      this.listRoom = res.message.items;

      this.pagedList = res.message;
      //group by de hien thi len select html
      const grouped = this.groupBy(this.listRoom, (room: Room) => room.name);
      this.dataGroupByUser = grouped;
      //load data into select html
      grouped.forEach((value: Room[], key: string) => {
        //console.log(key, value);
        //cac phan tu sau khi group by la giong nhau chung 1 nhom
        let obj = {userName: key, displayName: value[0].name}
        this.roomGroupBy.push(obj)
      });
    })
  }

  openAddRoomModalWithComponent() {
    this.dialogRef.open(AddRoomModalComponent);
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadRooms();
  }

  //event select html
  ngChanged(e) {
    //console.log(e)
    this.listRoom = this.dataGroupByUser.get(e.userName)//userName la key
  }

  joinRoom(Id: string){
    console.log("Route to room " + Id)
    this.router.navigate(['/room', Id])
  }

  private groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}

import "./lobby.component.css"
import {Component} from "../../component.decoration";
import {OnLoadComponent} from "../../component.app";
import {Room} from "../../models/chat/room";
import {LobbyService} from "../../services/lobby.service";

@Component({
    selector: 'app',
    templateUrl: './lobby.component.html',
})
export class LobbyPageComponent implements OnLoadComponent{
    lobbyService: LobbyService;

    constructor() {
        this.lobbyService  = new LobbyService();
    }

    OnLoad(): void {
        this.lobbyService.GetRooms(0, 20).then(response => {
            if(!response.isSuccessful){
                const messages = response.exceptions?.map((value, index) => {
                    return "ERROR" + index + ": source " + value.source + " message " + value.message;
                })
                console.log(messages?.join('\n'))
            }

            if(response.message?.items){
                this.addToTable(response.message?.items)
            }
        })
    }

    addToTable(tableData: Room[]){
        const tbody = document.querySelector('#lobby-table-body');
        tableData.forEach(rowData => {
            const tr = this.createTableRow(rowData);
            tbody?.appendChild(tr);
        });
    }


    createTableRow(rowData: Room) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                <td>${rowData.id}</td>
                <td>${rowData.memberCount}</td>
                <td>${rowData.name}</td>
                <td>${rowData.owner}</td>
                <td><a href="/room?id=${rowData.id}" class="join">Login</a></td>
            `;
        return tr;
    }
}
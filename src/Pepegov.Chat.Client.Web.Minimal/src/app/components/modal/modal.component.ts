import {OnLoadComponent} from "../../component.app";
import './modal.component.css'

export class ModalComponent implements OnLoadComponent{
    modalElement:HTMLElement;

    constructor() {
    }

    OnLoad(){
        const element = document.getElementById("modal") as HTMLElement;
        this.modalElement = element;

        // Close the modal if the user clicks outside of it
        window.onclick = function(event) {
            if (event.target === element) {
                element.style.display = "none";
            }
        }
    }

    Shop(){

    }
}
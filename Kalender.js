class Kalender extends HTMLElement {
    constructor() {
        super();
        console.log("Kalender Component registered!");
        this.innerHTML = "<p> Aus diesem Custom Element wird die Kalender Component </p>";
    }
}
window.customElements.define('event-calendar', Kalender);
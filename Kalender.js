function getMonthName(number){
    let month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    return month[number];
}

function getWeekdayName(number){
    let weekdays = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
    return weekdays[number];
}

let tmpl = document.createElement('template');
tmpl.innerHTML = `
<link rel="stylesheet" type="text/css" href="./Components/Kalender/Kalender.css" />
<div class="calendar">
      <header>
        <button class="before">
          <svg height="25" width="15">
            <polygon points="15,25 0,12 15,0" style="fill: #fff" />
            Before
          </svg>
        </button>
        <p id="month">Monat Jahr</p>
        <button class="next">
          <svg height="25" width="15">
            <polygon points="0,25 15,12 0,0" style="fill: #fff" />
            Next
          </svg>
        </button>
      </header>
    </div>`;

class Calendar extends HTMLElement {
    constructor() {
        super();
        console.log("Kalender Component registered!");

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));

    }
    connectedCallback(){
        this.startDate = new Date();

        this.calendar= this.shadowRoot.querySelector(".calendar");
        this.calendar.setAttribute("class", "calendar " + this.mode.toString() + " firstDay-" + this.firstWeekDay);
        this.shadowRoot.getElementById("month").innerText=getMonthName(this.startDate.getMonth()) + " " + this.startDate.getFullYear();


        this.shadowRoot.querySelector(".next").onclick= this.onCalendarChange.bind(this,true);
        this.shadowRoot.querySelector(".before").onclick= this.onCalendarChange.bind(this,false);

        this.events = [];
        if(this.getAttribute("eventLink")){
            fetch(this.getAttribute("eventLink"))
                .then(response => response.json())
                .then(data => {
                    this.events = data.events;
                    this.deleteDays();
                    this.createDays();
                });
        }

        this.createDays();
    }

    onCalendarChange(next){
        let tmp = new Date(this.startDate.getTime());
        let factor = (next ? 1 : -1);
        switch(this.mode){
            case "day":
                this.startDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + 1*factor);
                break;
            case "week":
                this.startDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + 7*factor);
                break;
            case "month":
                this.startDate = new Date(tmp.getFullYear(), tmp.getMonth()+1*factor);
                break;
            default:
                this.startDate = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + 1*factor);
                break;
        }
        this.changeHeader();
        this.deleteDays();
        this.createDays();
    }

    get mode() {
        return this.getAttribute('mode') || "month";
    }

    get firstWeekDay() {
        return (this.getAttribute('first')?parseInt(this.getAttribute('first')):1);
    }

    changeHeader(){
        this.shadowRoot.getElementById("month").innerText=getMonthName(this.startDate.getMonth()) + " " + this.startDate.getFullYear();
    }
    deleteDays(){
        let oldDays = this.shadowRoot.querySelectorAll('.date, calendar-event');
        for(let i=0; i< oldDays.length; i++){
            oldDays[i].remove();
        }
    }
    createDays(){
        let firstWeekDay = this.firstWeekDay;
        const days = [];
        switch(this.mode){
            case "day":
                days.push(this.startDate);
                break;
            case "week":
                let firstDay = new Date(this.startDate.getTime());
                while(firstDay.getDay()!== firstWeekDay){
                    firstDay.setDate(firstDay.getDate() - 1);
                }
                while(days.length < 7){
                    days.push(new Date(firstDay.getTime()));
                    firstDay.setDate(firstDay.getDate()+1);
                }
                break;
            case "month":
                let first = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 1);
                while(first.getDay()!== firstWeekDay){
                    first.setDate(first.getDate() - 1);
                }
                while(first.getMonth()===this.startDate.getMonth() || first.getMonth()===(this.startDate.getMonth()>0?this.startDate.getMonth()-1:11)){
                    days.push(new Date(first.getTime()));
                    first.setDate(first.getDate()+1);
                }
                break;
            default:
                days.push(this.startDate);
                break;
        }

        for(let i=0; i < (this.mode==="day"?1:7); i++){
            let weekday = document.createElement('div');
            weekday.setAttribute("class", "date week-day");
            weekday.textContent=getWeekdayName(days[i].getDay());
            this.calendar.appendChild(weekday);
        }
        let today = new Date();
        for(let i =0; i < days.length; i ++){
            let dayClass = "date ";
            if(days[i].getDate() === today.getDate() && days[i].getMonth() === today.getMonth()){
                dayClass += " today";
            }
            if(days[i].getMonth() < this.startDate.getMonth() || (this.startDate.getMonth()===0 && days[i].getMonth()===11)){
                dayClass +=" oldMonth"
            }
            let ev = undefined;
            for(let j = 0; j< this.events.length; j++){
                if(days[i].getDate()=== parseInt(this.events[j].day) && (days[i].getMonth()+1)=== parseInt(this.events[j].month) && days[i].getFullYear()=== parseInt(this.events[j].year)){
                    ev = this.events[j];
                }
            }
            if(ev){
                dayClass += " " + this.mode + " firstDay-" + this.firstWeekDay;
                let event = document.createElement('calendar-event');
                event.event = ev;
                event.weekday = days[i].getDay();
                event.classes = dayClass;
                this.calendar.appendChild(event);
            }else{
                let day = document.createElement('div');
                day.setAttribute("class", dayClass);
                day.textContent = days[i].getDate();
                this.calendar.appendChild(day);
            }
        }
    }
}
window.customElements.define('event-calendar', Calendar);

let evTempl = document.createElement('template');
evTempl.innerHTML= `
<link rel="stylesheet" type="text/css" href="./Components/Kalender/Kalender.css" />
 <span id="date">0</span>
      <p class="name">Kein Titel</p>
      <div class="info">
        <p class="title">Kein Titel</p>
        <p class="description">
              <span id="description">Keine Beschreibung</span>
              <a class="btn btn-dark" href="" target="_blank" rel="noopener noreferrer">Mehr erfahren</a>
            </p>
      </div>`;

class Event extends HTMLElement{
    constructor(props){
        super(props);
        const shadowRoot = this.attachShadow({mode:'open'});
        shadowRoot.appendChild(evTempl.content.cloneNode(true));
    }
    connectedCallback(){
        this.setAttribute('class', this.classes + " event weekday-"+ this.weekday);
        this.onclick=this.toggleInfo;
        this.shadowRoot.getElementById("date").innerText= this.event.day;
        if(this.event.description){
            this.shadowRoot.getElementById("description").innerHTML=this.event.description + " <br><br>";
        }else{
            this.shadowRoot.getElementById("description").remove();
        }
        if(this.event.link){
            this.shadowRoot.querySelector(".btn").setAttribute("href", this.event.link || " ");
        }else{
            this.shadowRoot.querySelector(".btn").remove();
        }
        let name = this.shadowRoot.querySelectorAll(".name, .title");
        for(let i = 0; i < name.length; i++){
            name[i].innerText= this.event.name || " ";
        }
    }
    toggleInfo(){
        if(this.shadowRoot.querySelector('.info').getAttribute('class').includes("show",0)){
            this.shadowRoot.querySelector('.info').setAttribute('class','info');
        }else{
            this.shadowRoot.querySelector('.info').setAttribute('class','info show');
        }
    }
}

window.customElements.define('calendar-event', Event);
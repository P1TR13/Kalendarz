console.log(localStorage)

let miesiace = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
]

let liczbaDni = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
let liczbaDni2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

let dniTygodnia = [
    "Poniedzialek", "Wtorek", "Sroda", "Czwartek", "Piatek", "Sobota", "Niedziela"
]


let dni = 0


let rok = 0
let miesiac = 0
let pierwszyDzien = 0
let dzienTygodnia = dniTygodnia[0]

let roznica = 0
let Start = roznica

let pom = 0

/*tworzy opcje dla godzin*/
function makeOptions(){
    /*godzina*/
    let hours = document.querySelector("#hour")
    for(i=0; i<24; i++){
        if(i<10){
            i.toString()
            i = "0"+i
        }
        let option = document.createElement("option")
        option.innerText = i
        hours.appendChild(option)
    }
    /*minuta*/
    let minute = document.querySelector("#minute")
    for(i=0; i<60; i++){
        if(i<10){
            i.toString()
            i = "0"+i
        }
        let option = document.createElement("option")
        option.innerText = i
        minute.appendChild(option)
    }
}

/*przycisk dodawający wydarzenie do localStorage*/
let dodaj = document.querySelector(".dodaj")
dodaj.addEventListener("click", function (){
    pom.classList.add("event")

    let wydarzenie = document.querySelector("#input").value
    let godzina = document.querySelector("#hour").value
    let minuta = document.querySelector("#minute").value
    let dane = wydarzenie + " " + godzina + ":" + minuta
        
    localStorage.setItem(pom.id + "." + miesiac + "." + rok, dane);
})

/*przycisk usuwający wydarzenie*/
let remove = document.querySelector(".usun")
    remove.addEventListener("click", function(){
    localStorage.removeItem(pom.id + "." + miesiac + "." + rok)
    pom.classList.remove('event')
})

/*pokazywanie w <dialog> wydarzenia*/
function done(k){
    document.querySelector("#events").innerText = k  
}

/*po kliknięciu na dany dzień, otwiera <dialog>*/
function clicked(){
    /*Źródło: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog*/

    let karty = document.querySelectorAll(".day");
    karty = [...karty];

    karty.forEach(karta => karta.addEventListener('click', function onOpen() {
        k = localStorage.getItem(karta.id + "." + miesiac + "." + rok)
        pom = karta
        if(k){
            if (typeof gotowe.showModal === "function") {
                gotowe.showModal();
                done(k)
            } else {
                alert("The <dialog> API is not supported by this browser");
            }
        }else{
            if (typeof time.showModal === "function") {
                time.showModal();
            } else {
            alert("The <dialog> API is not supported by this browser");
            }
        }
    }));
}

/*usuwa wszystkie dni z kalendarza i miesiąc oraz rok*/
function reset(){
    for(i=0; i<dni+pierwszyDzien; i++){
        let x = document.querySelector(".x")
        x.remove()
    }
    let y = document.querySelector(".y")
    y.remove()
}

/*pobiera datę, rok, miesiąc, pierwszy dzień miesiąca użytkownika, włącznie z aktualnymi zmianami 
(po wykorzystaniu przycisków do poruszania się po kalendarzu) */
function getDate(n, zmianaRoku){
    let dataU = new Date()
    let rokU = new Date().getFullYear()+zmianaRoku
    let miesiacU = new Date().getMonth()+n
    let dzienU = new Date(rokU, miesiacU, 0).getDay()


    rok = rokU
    miesiac = miesiacU
    pierwszyDzien = dzienU
    dzienTygodnia = dniTygodnia[pierwszyDzien]

    /*sprawdza, czy rok jest przestępny*/
    if(rok%4==0 && rok%100!=0){
        dni = liczbaDni2[miesiac]
    }else{
        dni = liczbaDni[miesiac]
    }
}

/*ustawia miesiąc i rok, w którym aktualnie znajduje się użytkownik*/
function createNavigation(){
    let date = document.createElement("div")

    let month = miesiace[miesiac]
    let year = rok
    year.toString()

    date.innerText = month + " " + year
    date.setAttribute("class", "y")
    
    document.querySelector("#monthAndYear").appendChild(date)
}

/*tworzy odpowiednią ilość kafelków (równą ilości dni)*/
function createDays(){
    /*najpierw tworzy się kilka pustych divów, w celu wyeliminowania błędu początku miesiąca*/
    for(j=0; j<pierwszyDzien; j++){
        let pusty = document.createElement("div")
        pusty.setAttribute("class", "x")
        document.querySelector("#siatka").appendChild(pusty)
    }
    
    /*dni rzeczywiste*/
    for(i=0; i<dni; i++){
        let blok = document.createElement("div")
        /*let numer = document.createElement("div")*/
        blok.innerText = i+1
        /*blok.appendChild(numer)*/
        j = i+1

        cale = j + "." + miesiac + "." + rok
        /* sprawdza, czy dzień jest w weekend*/

        
        if(dzienTygodnia==dniTygodnia[5] || dzienTygodnia==dniTygodnia[6]){
            blok.setAttribute("class", "day weekendDay x i" + j)
            blok.setAttribute("id", j)
        }else{
            blok.setAttribute("class", "day x i" + j)
            blok.setAttribute("id", j)
        }
        if(localStorage.getItem(cale)){
            blok.classList.add('event')
        }
        
        document.querySelector("#siatka").appendChild(blok)
        dzienTygodnia = dniTygodnia[(i+pierwszyDzien+1)%7]
    }

    clicked()
}

/*uruchamia wszystkie funkcje, potrzebne do stworzenia początkowego wyglądu kalendarza*/
getDate(0, 0)
createNavigation()
createDays()
makeOptions()
clicked()

zmianaR = 0

/*lewy przycisk (cofanie się)*/
document.querySelector("#left").addEventListener("click", function(){
    reset()

    roznica--
    miesiac--
    if(miesiac<0){
        roznica = 11 - new Date().getMonth()
        zmianaR--
    }

    getDate(roznica, zmianaR)
    createNavigation()
    createDays()
});


/*prawy przycisk (przesuwanie się do przodu)*/
document.querySelector("#right").addEventListener("click", function(){
    reset()

    roznica++
    miesiac++

    if(miesiac>11){
        roznica = 0 - new Date().getMonth()
        zmianaR++
    }

    getDate(roznica, zmianaR)
    createNavigation()
    createDays()
});
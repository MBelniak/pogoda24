//Arrays section
window.universalIconNames = [
    "Wybierz ikonę",
    "Burze",
    "Deszcz",
    "Deszcz_Śnieg",
    "Śnieg",
    "Chmury",
];
window.universalIconFiles = [
    "null",
    "chmury_burze",
    "chmury_deszcz",
    "deszcz_snieg",
    "snieg",
    "zachmurzenie",
];
window.dayIconNames = [
    "Mało słońca_Chmury",
    "Mało słońca_Deszcz",
    "Mało słońca_Śnieg",
    "Mało słońca_Śnieg_Deszcz",
    "Słońce_Burza_Deszcz",
    "Słońce_Burza_Chmury",
    "Słońce_Śnieg_Deszcz",
    "Słońce_Chmury_Deszcz",
    "Słońce_Mały deszcz",
    "Słońce_Mały śnieg",
    "Słońce_Mało śniegu i deszcz",
    "Słońce_Chmury_Śnieg",
    "Słońce",
    "Słońce_Chmury",
    "Słońce_Mało chmur",
];
window.dayIconFiles = [
    "zachmurzenie_przejasnienia",
    "malo-slonca_deszcz",
    "malo-slonca_snieg",
    "malo-slonca_snieg_deszcz",
    "slonce_burza_deszcz",
    "slonce_chmury_burze",
    "slonce_snieg_deszcz",
    "slonce_chmury_deszcz",
    "slonce_maly-deszcz",
    "slonce_maly-snieg",
    "slonce_maly-snieg-deszcz",
    "slonce_snieg",
    "slonecznie",
    "zachmurzenie_czesciowe",
    "zachmurzenie_male",
];
window.nightIconNames = [
    "Księżyc",
    "Księżyc_Chmury",
    "Księżyc_Chmury_Deszcz",
    "Księżyc_Mało chmur",
    "Księżyc_Mało śnieg i deszcz",
    "Księżyc_Przelotny deszcz",
    "Księżyc_Przelotny śnieg",
    "Księżyc_Śnieg",
    "Księżyc_Chmury_Śnieg i deszcz",
];
window.nightIconFiles = [
    "ksiezyc",
    "ksiezyc_chmury",
    "ksiezyc_deszcz_duzo-chmur",
    "ksiezyc_duzo-chmur",
    "ksiezyc_malo-chmur",
    "ksiezyc_maly-snieg_deszcz",
    "ksiezyc_przelotny-deszcz",
    "ksiezyc_przelotny-snieg",
    "ksiezyc_snieg",
    "ksiezyc_snieg_deszcz_duzo-chmur",
];

window.cities = [ // Wyświetlane nazwy miast
    {'displayName': "Gdańsk",
        'displayCommon': "Gdansk",
        'x': 400,
        'y': 0},
    {'displayName': "Szczecin",
        'displayCommon': "Szczecin",
        'x': 250,
        'y': 75},
    {'displayName': "Olsztyn",
        'displayCommon': "Olsztyn",
        'x': 540,
        'y': 35},
    {'displayName': "Bydgoszcz",
        'displayCommon': "Bydgoszcz",
        'x': 410,
        'y': 100},
    {'displayName': "Poznań",
        'displayCommon': "Poznan",
        'x': 310,
        'y': 135},
    {'displayName': "Białystok",
        'displayCommon': "Bialystok",
        'x': 650,
        'y': 95},
    {'displayName': "Siedlce",
        'displayCommon': "Siedlce",
        'x': 640,
        'y': 190},
    {'displayName': "Warszawa",
        'displayCommon': "Warszawa",
        'x': 540,
        'y': 155},
    {'displayName': "Zielona Góra",
        'displayCommon': "Zielona Gora",
        'x': 240,
        'y': 195},
    {'displayName': "Kalisz",
        'displayCommon': "Kalisz",
        'x': 380,
        'y': 230},
    {'displayName': "Łódź",
        'displayCommon': "Lodz",
        'x': 470,
        'y': 235},
    {'displayName': "Radom",
        'displayCommon': "Radom",
        'x': 580,
        'y': 250},
    {'displayName': "Wrocław",
        'displayCommon': "Wroclaw",
        'x': 310,
        'y': 280},
    {'displayName': "Lublin",
        'displayCommon': "Lublin",
        'x': 670,
        'y': 280},
    {'displayName': "Opole",
        'displayCommon': "Opole",
        'x': 380,
        'y': 330},
    {'displayName': "Kielce",
        'displayCommon': "Kielce",
        'x': 550,
        'y': 310},
    {'displayName': "Katowice",
        'displayCommon': "Katowice",
        'x': 450,
        'y': 350},
    {'displayName': "Kraków",
        'displayCommon': "Krakow",
        'x': 530,
        'y': 375},
    {'displayName': "Rzeszów",
        'displayCommon': "Rzeszow",
        'x': 630,
        'y': 375},
    {'displayName': "Sudety",
        'displayCommon': "Sudety",
        'x': 300,
        'y': 350},
    {'displayName': "Tatry",
        'displayCommon': "Tatry",
        'x': 515,
        'y': 460},
    {'displayName': "Bieszczady",
        'displayCommon': "Bieszczady",
        'x': 640,
        'y': 470}
];

//End of arrays section
var date = new Date();
var dt = document.getElementById("date");
var day = date.getDate().toString();
if(day.length==1)
{
    day = "0"+day;
}
var month = date.getMonth().toString();
if(month.length==1)
{
    month = "0"+month;
}
var year = date.getFullYear().toString();
dt.value = day+"-"+month+"-"+year;


window.canvas = document.getElementById("canvas");
window.context = canvas.getContext("2d");
var context = window.context;
var canvas = window.canvas;
var img = new Image();
img.src = "generator/gen_img/map.png";
img.onload = function()
{
    context.drawImage(img,0,0);
}
var y;
for(y=0;y<window.cities.length;y++)
{
    createPanel(window.cities[y].displayName,window.cities[y].displayCommon); // Tworzenie interfejsu
    createEvent(window.cities[y].displayName,window.cities[y].displayCommon);
}
document.getElementById("done").addEventListener("click",function(e)
{
    window.scrollTo(0,0);
    var jImg = new Image();
    if(document.getElementById("dayC").checked)
    {
        jImg.src = "generator/gen_img/map.png";
    }
    else
    {
        jImg.src = "generator/gen_img/map_night.png";
    }
    jImg.onload = function(){
        window.context.clearRect(0,0,1000,1000);
        window.context.drawImage(jImg,0,0);
        var u;
        var noContinue = false;
        for(u=0;u<window.cities.length;u++)
        {
            var cityname_typetmp = document.getElementById(window.cities[u].displayCommon+"_type");
            if(cityname_typetmp.value=="null") // Sprawdzanie czy wszystkie ikonki są uzupełnione
            {
                alert("Uzupełnij wszystkie ikonki");
                noContinue = true;
                break;
            }
        }
        if(!noContinue) //Jeżeli wszystkie ikonki są uzupełnione
        {
            u = 0;
            for(u=0;u<window.cities.length;u++)  // Rysowanie ikonek na mapie
            {
                var cityname_type = document.getElementById(window.cities[u].displayCommon+"_type");
                var cX = window.cities[u].x;
                var cY = window.cities[u].y;
                if(cityname_type.value!="null")
                {
                    var icon = new Image();
                    icon.src="generator/gen_img/"+cityname_type.value+".png"; // Ładowanie odpowiedniej ikonki
                    icon.setAttribute("cordX",cX);
                    icon.setAttribute("cordY",cY);
                    icon.onload = function(e)
                    {
                        var cX = e.target.getAttribute("cordX");
                        var cY = e.target.getAttribute("cordY");
                        window.context.drawImage(e.target,cX,cY); // Rysowanie załadowanej ikonki na mapie
                    };
                }
                var temperature = document.getElementById(window.cities[u].displayCommon+"_temp").value; // Odczytywanie temperatury
                if(temperature<0)
                {
                    window.context.fillStyle = "blue";
                    window.context.strokeStyle = "lightblue";
                }
                else
                {
                    window.context.fillStyle = "red";
                    window.context.strokeStyle = "orange";
                }
                window.context.font = "bold 23px Arial"; // Czcionka Arial o rozmiarze 23px (Pogrubiona)
                if(window.cities[u].displayCommon=="Poznan" || window.cities[u].displayCommon=="Gdansk"
                    || window.cities[u].displayCommon=="Olsztyn") // Sprawdź wyjątki
                {
                    window.context.fillText(temperature+"°C",cX+55,cY+45); // Rysowanie temperatury na mapie
                    window.context.strokeText(temperature+"°C",cX+55,cY+45);
                }
                else if (window.cities[u].displayCommon=="Tatry")
                {
                    window.context.fillText(temperature+"°C",cX+55,cY+15);
                    window.context.strokeText(temperature+"°C",cX+55,cY+15);
                }
                else
                {
                    window.context.fillText(temperature+"°C",cX+55,cY+30);
                    window.context.strokeText(temperature+"°C",cX+55,cY+30);
                }
                var date = document.getElementById("date").value;
                window.context.fillStyle = "red";
                window.context.strokeStyle = "orange";
                window.context.strokeText(date,200,520); // Rysowanie daty
                window.context.fillText(date,200,520);
            }
        }
    }
});

document.getElementById("dayC").addEventListener("click",function(e)
{
    if(e.target.checked)
    {
        e.target.disabled = true;
        document.getElementById("nightC").disabled = false;
        document.cookie = "generator_time=day; expires=Thu, 18 Dec 2025 12:00:00 UTC";
        var t;
        for(t=0;t<window.cities.length;t++)
        {
            clearIcons(window.cities[t].displayCommon);
        }
        window.context.clearRect(0,0,800,600);
        var cImg = new Image();
        cImg.src = "generator/gen_img/map.png";
        cImg.onload = function()
        {
            window.context.drawImage(cImg,0,0);
            for(t=0;t<window.cities.length;t++)
            {
                makeDayIcons(window.cities[t].displayCommon);
            }
        }
    }
});
document.getElementById("nightC").addEventListener("click",function(e)
{
    if(e.target.checked)
    {
        e.target.disabled = true;
        document.getElementById("dayC").disabled = false;
        document.cookie = "generator_time=night; expires=Thu, 18 Dec 2025 12:00:00 UTC";
        var t;
        for(t=0;t<window.cities.length;t++)
        {
            clearIcons(window.cities[t].displayCommon);
        }
        window.context.clearRect(0,0,800,600);
        var cImg = new Image();
        cImg.src = "generator/gen_img/map_night.png";
        cImg.onload = function()
        {
            window.context.drawImage(cImg,0,0);
            for(t=0;t<window.cities.length;t++)
            {
                makeNightIcons(window.cities[t].displayCommon);
            }
        }
    }
});

var savedTime = getCookie("generator_time");
if(savedTime!=null)
{
    if(savedTime=="night")
    {
        document.getElementById("nightC").click();
    }
}


function makeDayIcons(cityname)
{
    var cityname_type = document.getElementById(cityname+"_type");
    cityname_type.innerHTML = "";
    var x;
    var selected = "";
    for(x=0;x<window.universalIconNames.length;x++)
    {
        var gc = getCookie("generator_"+cityname+"_type");
        if(gc!=null)
        {
            if(gc==window.universalIconFiles[x])
            {
                console.log(gc);
                console.log(window.universalIconFiles[x]);
                selected = "selected";
            }
            else
            {
                selected = "";
            }
        }
        cityname_type.innerHTML = cityname_type.innerHTML+"<option value='"+window.universalIconFiles[x]+"' "+selected+">"+window.universalIconNames[x]+"</option>";
    }
    cityname_type.innerHTML = cityname_type.innerHTML+"<option disabled>---------------</option>";
    for(x=0;x<window.dayIconNames.length;x++)
    {
        var gc = getCookie("generator_"+cityname+"_type");
        if(gc!=null)
        {
            if(gc==window.dayIconFiles[x])
            {
                console.log(gc);
                console.log(window.dayIconFiles[x]);
                selected = "selected";
            }
            else
            {
                selected = "";
            }
        }
        cityname_type.innerHTML = cityname_type.innerHTML+"<option value='"+window.dayIconFiles[x]+"' "+selected+">"+window.dayIconNames[x]+"</option>";
    }
}
function clearIcons(cityname)
{
    var cityname_type = document.getElementById(cityname+"_type");
    cityname_type.innerHTML = "";
    var x;
    cityname_type.innerHTML = "<option disabled>---------------</option>";
}
function makeNightIcons(cityname)
{
    var cityname_type = document.getElementById(cityname+"_type");
    cityname_type.innerHTML = "";
    var x;
    var selected = "";
    for(x=0;x<window.universalIconNames.length;x++)
    {
        var gc = getCookie("generator_"+cityname+"_type");
        if(gc!=null)
        {
            if(gc==window.universalIconFiles[x])
            {
                console.log(gc);
                console.log(window.universalIconFiles[x]);
                selected = "selected";
            }
            else
            {
                selected = "";
            }
        }
        cityname_type.innerHTML = cityname_type.innerHTML+"<option value='"+window.universalIconFiles[x]+"' "+selected+">"+window.universalIconNames[x]+"</option>";
    }
    cityname_type.innerHTML = cityname_type.innerHTML+"<option disabled>---------------</option>";
    for(x=0;x<window.nightIconNames.length;x++)
    {
        var gc = getCookie("generator_"+cityname+"_type");
        if(gc!=null)
        {
            if(gc==window.nightIconFiles[x])
            {
                console.log(gc);
                console.log(window.nightIconNames[x]);
                selected = "selected";
            }
            else
            {
                selected = "";
            }
        }
        cityname_type.innerHTML = cityname_type.innerHTML+"<option value='"+window.nightIconFiles[x]+"' "+selected+">"+window.nightIconNames[x]+"</option>";
    }
}
function createPanel(displayname,cityname)
{
    var controls_v1 = document.getElementById("controls_v1");
    controls_v1.innerHTML = controls_v1.innerHTML+"<div style='display:inline-block; margin-right:25px;padding: 5px; border: 1px solid black; ' ><div style='display:inline-block;' style='font-weight:bold;'>"+displayname+"</div><br><input type='number' style='width:100px;' placeholder='temperatura' min='-100' value='0' max='100' id='"+cityname+"_temp' /><br><select style='width: 200px;' id='"+cityname+"_type'></select>";
    makeDayIcons(cityname);
}
function createEvent(displayname,cityname)
{
    document.getElementById(cityname+"_type").onchange=function(e)
    {
        var cc = document.getElementById(cityname+"_type");
        document.cookie = "generator_"+cityname+"_type="+cc.value+"; expires=Thu, 18 Dec 2025 12:00:00 UTC";
    };
    document.getElementById(cityname+"_temp").onchange=function(e)
    {
        var cc = document.getElementById(cityname+"_temp");
        document.cookie = "generator_"+cityname+"_temp="+cc.value+"; expires=Thu, 18 Dec 2025 12:00:00 UTC";
    };
    document.getElementById(cityname+"_temp").oninput=function(e)
    {
        var cc = document.getElementById(cityname+"_temp");
        document.cookie = "generator_"+cityname+"_temp="+cc.value+"; expires=Thu, 18 Dec 2025 12:00:00 UTC";
    };
    var tempC = getCookie("generator_"+cityname+"_temp");
    if(tempC!=null)
    {
        document.getElementById(cityname+"_temp").value = tempC;
    }
}
function getCookie(name)
{
    var cks = document.cookie.split("; ");
    for(x=0;x<cks.length;x++)
    {
        var index = cks[x].indexOf("=");
        var nm = cks[x].substring(0,index);
        if(nm==name)
        {
            var val = cks[x].substring(index+1);
            return val;
        }
    }
    return null;
}
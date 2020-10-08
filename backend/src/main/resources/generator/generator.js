window.canvas = document.getElementById("canvas");
window.context = canvas.getContext("2d");
var context = window.context;
var canvas = window.canvas;
var img = new Image();
img.src = "generator/gen_img/map.png";
img.onload = function () {
  context.drawImage(img, 0, 0);
};
var y;
for (y = 0; y < window.cities.length; y++) {
  createPanel(window.cities[y].displayName, window.cities[y].displayCommon); // Tworzenie interfejsu
}
for (y = 0; y < window.cities.length; y++) {
  createEvent(window.cities[y].displayName, window.cities[y].displayCommon); // Tworzenie interfejsu
}
document.getElementById("done").addEventListener("click", function (e) {
  window.scrollTo(0, 0);
  var jImg = new Image();
  if (document.getElementById("dayC").checked) {
    jImg.src = "generator/gen_img/map.png";
  } else {
    jImg.src = "generator/gen_img/map_night.png";
  }
  jImg.onload = function () {
    window.context.clearRect(0, 0, 1000, 1000);
    window.context.drawImage(jImg, 0, 0);
    var u;
    var noContinue = false;
    for (u = 0; u < window.cities.length; u++) {
      var cityname_typetmp = document.getElementById(
        window.cities[u].displayCommon + "_type"
      );
      if (cityname_typetmp.value == "null") {
        // Sprawdzanie czy wszystkie ikonki są uzupełnione
        alert("Uzupełnij wszystkie ikonki");
        noContinue = true;
        break;
      }
    }
    if (!noContinue) {
      //Jeżeli wszystkie ikonki są uzupełnione
      u = 0;
      for (
        u = 0;
        u < window.cities.length;
        u++ // Rysowanie ikonek na mapie
      ) {
        var cityname_type = document.getElementById(
          window.cities[u].displayCommon + "_type"
        );
        var cX = window.cities[u].x;
        var cY = window.cities[u].y;
        if (cityname_type.value != "null") {
          var icon = new Image();
          icon.src = "generator/gen_img/" + cityname_type.value + ".png"; // Ładowanie odpowiedniej ikonki
          icon.setAttribute("cordX", cX);
          icon.setAttribute("cordY", cY);
          icon.onload = function (e) {
            var cX = e.target.getAttribute("cordX");
            var cY = e.target.getAttribute("cordY");
            window.context.drawImage(e.target, cX, cY); // Rysowanie załadowanej ikonki na mapie
          };
        }
        var temperature = document.getElementById(
          window.cities[u].displayCommon + "_temp"
        ).value; // Odczytywanie temperatury
        if (temperature < 0) {
          window.context.fillStyle = "blue";
          window.context.strokeStyle = "lightblue";
        } else {
          window.context.fillStyle = "red";
          window.context.strokeStyle = "orange";
        }
        window.context.font = "bold 23px Arial"; // Czcionka Arial o rozmiarze 23px (Pogrubiona)
        if (
          window.cities[u].displayCommon == "Poznan" ||
          window.cities[u].displayCommon == "Gdansk" ||
          window.cities[u].displayCommon == "Olsztyn"
        ) {
          // Sprawdź wyjątki
          window.context.fillText(temperature + "°C", cX + 55, cY + 45); // Rysowanie temperatury na mapie
          window.context.strokeText(temperature + "°C", cX + 55, cY + 45);
        } else if (window.cities[u].displayCommon == "Tatry") {
          window.context.fillText(temperature + "°C", cX + 55, cY + 15);
          window.context.strokeText(temperature + "°C", cX + 55, cY + 15);
        } else {
          window.context.fillText(temperature + "°C", cX + 55, cY + 30);
          window.context.strokeText(temperature + "°C", cX + 55, cY + 30);
        }
        var date = document.getElementById("date").value;
        window.context.fillStyle = "red";
        window.context.strokeStyle = "orange";
        window.context.strokeText(date, 200, 520); // Rysowanie daty
        window.context.fillText(date, 200, 520);
      }
    }
  };
});

document.getElementById("dayC").addEventListener("click", function (e) {
  if (e.target.checked) {
    e.target.disabled = true;
    document.getElementById("nightC").disabled = false;
    document.cookie =
      "generator_time=day; expires=Thu, 18 Dec 2025 12:00:00 UTC";
    var t;
    for (t = 0; t < window.cities.length; t++) {
      clearIcons(window.cities[t].displayCommon);
    }
    window.context.clearRect(0, 0, 800, 600);
    var cImg = new Image();
    cImg.src = "generator/gen_img/map.png";
    cImg.onload = function () {
      window.context.drawImage(cImg, 0, 0);
      for (t = 0; t < window.cities.length; t++) {
        makeDayIcons(window.cities[t].displayCommon);
      }
    };
  }
});
document.getElementById("nightC").addEventListener("click", function (e) {
  if (e.target.checked) {
    e.target.disabled = true;
    document.getElementById("dayC").disabled = false;
    document.cookie =
      "generator_time=night; expires=Thu, 18 Dec 2025 12:00:00 UTC";
    var t;
    for (t = 0; t < window.cities.length; t++) {
      clearIcons(window.cities[t].displayCommon);
    }
    window.context.clearRect(0, 0, 800, 600);
    var cImg = new Image();
    cImg.src = "generator/gen_img/map_night.png";
    cImg.onload = function () {
      window.context.drawImage(cImg, 0, 0);
      for (t = 0; t < window.cities.length; t++) {
        makeNightIcons(window.cities[t].displayCommon);
      }
    };
  }
});

function clearIcons(cityname) {
  var cityname_type = document.getElementById(cityname + "_type");
  cityname_type.innerHTML = "";
  var x;
  cityname_type.innerHTML = "<option disabled>---------------</option>";
}
function makeNightIcons(cityname) {
  var cityname_type = document.getElementById(cityname + "_type");
  cityname_type.innerHTML = "";
  var x;
  var selected = "";
  for (x = 0; x < window.universalIconNames.length; x++) {
    var gc = getCookie("generator_" + cityname + "_type");
    if (gc != null) {
      if (gc == window.universalIconFiles[x]) {
        console.log(gc);
        console.log(window.universalIconFiles[x]);
        selected = "selected";
      } else {
        selected = "";
      }
    }
    cityname_type.innerHTML =
      cityname_type.innerHTML +
      "<option value='" +
      window.universalIconFiles[x] +
      "' " +
      selected +
      ">" +
      window.universalIconNames[x] +
      "</option>";
  }
  cityname_type.innerHTML =
    cityname_type.innerHTML + "<option disabled>---------------</option>";
  for (x = 0; x < window.nightIconNames.length; x++) {
    var gc = getCookie("generator_" + cityname + "_type");
    if (gc != null) {
      if (gc == window.nightIconFiles[x]) {
        console.log(gc);
        console.log(window.nightIconNames[x]);
        selected = "selected";
      } else {
        selected = "";
      }
    }
    cityname_type.innerHTML =
      cityname_type.innerHTML +
      "<option value='" +
      window.nightIconFiles[x] +
      "' " +
      selected +
      ">" +
      window.nightIconNames[x] +
      "</option>";
  }
}

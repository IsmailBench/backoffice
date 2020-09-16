var hbs = require("hbs");
var atob = require("atob");
let debug = require("debug")("debug");
const JOUR = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Venderdi",
  "Samedi"
];
const DAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MOIS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre"
];
const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov"
];
hbs.registerHelper("convertDate", function(datetime) {
  if (datetime !== undefined) {
    return datetime.toLocaleString("fr-FR", { timeZone: "UTC" });
  }
});

hbs.registerHelper("formatDate", function(datetime, format) {
  // can use other formats like 'lll' too
  switch (format) {
    case "DATE": {
      format = "DD:MM:YYYY";
      break;
    }
    case "DAY": {
      return DAYS[datetime]; //nom du jour
    }
    case "MONTH": {
      let m = moment(datetime).month(); //"dddd DD.MM.YYYY HH:mm");
      return moment.monthsShort(m);
    }
    case "HOUR": {
      return (
        (+datetime).toLocaleString("fr-FR", { minimumIntegerDigits: 2 }) + "H"
      );
    }
    default:
      break;
  }
  return moment(datetime).format(format); //"dddd DD.MM.YYYY HH:mm");
});

hbs.registerHelper("formatNumber", function(num, options) {
  return (+num).toLocaleString("fr-FR", {
    minimumIntegerDigits: 1,
    maximumFractionDigits: 2
  });
});

hbs.registerHelper("base64ToString", str => {
  if (str !== undefined) {
    let firstBytes = [];
    let secondBytes = [];
    let voiesAlerte = [];
    let bits = [];
    decodeData = new Buffer(str, "base64");
    let i = 0,
      f = 0;
    // Split le buffer pour obtenir les 4 premiers bits et les places dans un tableau firstBytes
    for (x of decodeData.values()) {
      firstBytes[i++] = (x >> 4) & 15;
    }
    // Split le buffer pour obtenir les 4 derniers bits et les places dans un tableau secondeBytes
    for (x of decodeData.values()) {
      secondBytes[f++] = x & 15;
    }
    let voies = " Nombre Voies : " + firstBytes[1];
    let batterie = " Batterie : " + secondBytes[1] + "0%";
    let protocole = " protocole : V" + firstBytes[2];
    let config = " configuration : V" + secondBytes[2];
    let payloadDecrypt = voies + batterie + protocole + config;
    return payloadDecrypt;
  }
});

hbs.registerHelper("bufferToBits", str => {
  if (str !== undefined) {
    buffer = new Buffer(str, "base64");
    let firstBytes = [];
    let a = 0;
    // Cree le tableau firstBytes pour stocker les premiers
    for (x of buffer.values()) {
      firstBytes[a++] = (x >> 4) & 15;
    }
    // Split le buffer[j] en bit et les places dans le tableau bits
    let arr = [];
    let bits = [];
    let limite = 7 + firstBytes[1];
    for (let j = 7; j < limite; j++) {
      let octet = buffer[j];
      for (var k = 7; k >= 0; k--) {
        let bit = octet & (1 << k) ? 1 : 0;
        bits.push(bit);
      }
    }
    // Crée un tableau a 2D
    while (bits.length) {
      arr.push(bits.splice(0, 8));
    }
    // Permet de retirer les 3 derniers elements d'arr[b] car aucune utilité
    for (let b = 0; b < arr.length; b++) {
      for (let c = 0; c < 3; c++) {
        arr[b].pop();
      }
    }
    //Crée le Table a affiché
    var result =
      "<table id='voiesTable'><thead class='thead-dark bg-dark'><tr>";
    for (let d = 0; d < firstBytes[1]; d++) {
      result += '<th scope="col">mesure n°' + (d + 1) + "</th>";
    }
    result += "</thead>";
    for (var i = 0; i < arr.length; i++) {
      result += "<tr>";
      for (var j = 0; j < firstBytes[1]; j++) {
        if (arr[i][j] === 0) {
          result += "<td>OK</td>";
        } else {
          result += "<td bgcolor='#FF0000'></td>";
        }
      }
      result += "</tr>";
    }
    result += "</table>";
    return result;
  }
});

hbs.registerHelper("timestampToDate", buffer => {
  /* Inutile deja exécuté sur la base de donné avec meta.packet_time
  let t = buffer.readInt32BE(3);
  let t2 = new Date("2017-01-01T00:00:00.000Z").getTime() / 1000;
  let t3 = t + t2;
  let date = new Date(t2);
  */
});

hbs.registerHelper("ifEq", function(v1, v2, options) {
  if (v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper("ifNotEq", function(v1, v2, options) {
  if (v1 !== v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper("ifSupp", function(v1, v2, options) {
  if (+v1 >= +v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
hbs.registerHelper("add", function(current, numb, options) {
  return options.fn(+current + +numb);
});

hbs.registerHelper("ifEmptyList", function(list, options) {
  return list == undefined || list.length === undefined || list.length == 0
    ? options.fn(this)
    : options.inverse(this);
});
hbs.registerHelper("ifIn", function(elem, list, options) {
  if (list) {
    for (var l of list) {
      if ("" + l.id == "" + elem) {
        return options.fn(this);
      }
    }
  }

  return options.inverse(this);
});

hbs.registerHelper("replace", function(str) {
  str = str.replace(/[,{}"]/g, " ");
  str = str.slice(20,str.length)
  return str;
});
hbs.registerHelper("dateToString", date => {
  if (date !== undefined) {
    date = date.replace(/[TZ]/g, " ");
    return date;
  }
});
hbs.registerHelper("idToRef", str => {
  if (str !== undefined) {
    let reference = str.slice(0, 10);
    let nSerie = str.slice(10,str.length)
    let string = "Référence produit : " + reference +" N\° de série : " + nSerie;
    return string;
  }
});
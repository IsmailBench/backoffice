<template>
<div>
    <nav class="navbar fixed-top">
        <span class="fas fa-home" id="homeBtn" role="button" @click="showIndex = !showIndex"></span>
        <div id="index">
            <transition name="bounce">
                <router-link to="/gateways"><h5 class="title" v-if="showIndex">Gateways</h5></router-link>
            </transition>
            <transition name="bounce">
                <router-link to="/devices"><h5 class="title" v-if="showIndex">Devices</h5></router-link>
            </transition>
        </div>
        <span class="fas fa-search" id="searchBtn" data-toggle="modal" data-target="#modalSearch"></span>
        <span class="fas fa-trash-alt" id="deleteBtn"></span>
    </nav>
    <div class="table-responsive">
        <div class="alert alert-danger" v-if="logs.error" >
            <strong>{{logs.error.message}}{{logs.error.statut}}</strong>
        </div>
        <div class="alert alert-success" role="alert"  v-if="this.succes">
            <strong>{{this.succes}}</strong>
        </div>
        <table class="table">
            <thead class="thead">
                <tr>
                    <th scope="col">DevEUI</th>
                    <th scope="col">Date de réception</th>
                    <th scope="col">Date d'émission</th>
                    <th scope="col">Payload</th>
                    <th scope="col">Action / Rx</th>
                    <th scope="col">Type</th>
                    <th scope="col">Sélectionné</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="log in logs.logs" :key="log._id" v-if="log">
                    <td>
                        <h5 class="title">
                            <a v-if=log.meta.slave href='#'  v-on:click=queryLogId(log.meta.slave)>{{log.meta.slave}}</a><p v-else> No Data</p>
                        </h5>
                    </td>
                    <td>
                        <p v-if=log.timestamp class="text">{{dateFormat(log.timestamp)}}</p><p v-else >No Data </p>
                    </td>
                    <td>
                        <p v-if=log.meta.packet_time class="text">{{dateFormat(log.meta.packet_time)}}</p><p v-else>No Data</p>
                    </td>
                    <td>
                        <div class="table-responsive " v-if="decodePayload(log.meta.payload)">
                            <table class="table table-bordered" id='voiesTable'>
                                <tbody>
                                    <tr v-for="voie in decodePayload(log.meta.payload)" :key="voie.id" >
                                        <td v-for="mesure in voie" :key="mesure.id">
                                            <p v-if="mesure == 0" class="text-primary">
                                                <i class="fas fa-check"></i>
                                            </p>
                                            <p v-else class="text-danger">
                                                <i class="fas fa-exclamation-triangle"></i>
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <ul v-if="log.meta.payload">
                                Nombre Voies utilisé : {{ payloadToString(log.meta.payload).voies }}                                      
                                Batterie : {{ payloadToString(log.meta.payload).batterie }}0%
                                Protocole : V.{{ payloadToString(log.meta.payload).protocole }}
                                Configuration : V.{{ payloadToString(log.meta.payload).config }}
                            </ul>
                        </div>
                        <p v-else>No Data</p>
                    </td>
                    <td>
                        <p v-if=log.meta.action class="text">{{log.meta.action}} / {{log.meta.rx}}</p><p v-else>No Data</p>
                    </td>
                    <td>
                        <a :v-if=log.meta.type class="text">{{log.meta.type}}</a>
                    </td>
                    <td>
                        <div class="radio">
                            <label>
                                <input type="radio" :value=log._id name="logSelected" id="logSelected">
                            </label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    <div class="modal fade" id="modalSearch" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">Recherche</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group row">
                    <label for="devEUI" class="col-2 col-form-label">DevEUI</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="devEUI" v-model="devEUI">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="type" class="col-2 col-form-label">Type</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="type" v-model="type" v-bind="$attrs">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="limit" class="col-2 col-form-label">Nombre log</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="limit" v-model="limit">
                    </div>  
                </div>
                <div class="form-group row">
                    <label for="dateStart" class="col-2 col-form-label">Date début</label>
                    <div class="col-10">
                        <input class="form-control" type="datetime-local" id="dateStart" v-model="dateStart">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="dateEnd" class="col-2 col-form-label">Date fin</label>
                    <div class="col-10">
                        <input class="form-control" type="datetime-local" id="dateEnd"  v-model="dateEnd">
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                     <button type="button" class="btn btn-primary" id="valider" v-on:click="queryLogs" data-dismiss="modal">Rechercher</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
let Buffer = require('buffer/').Buffer
module.exports = {
  name: "tableLogsComponent",
  data() {
    return {
      logs: [],
      devEUI :"",
      type:"",
      limit:"",
      dateEnd:"",
      dateStart:"",
      showIndex : true,
    };
  },
  methods: {
    // Fonction qui demande les 10 derniers logs a l'API
    loadLogs: function() {
      fetch("http://localhost:9090/api/v1/logs")
        .then(function(response) {
          return response.json();
        })
        .then(dt => {
          this.logs = dt;
        })
        .catch(function(err) {
          console.log("Fetch Error :", err);
        });
    },
    // Fonction qui demande a L'api les logs en lien avec les saisis utilisateur
    queryLogs : function(){
        let p = new URLSearchParams()
        if(this.devEUI != undefined && this.devEUI != ""){
            p.append("devEUI", this.devEUI)
        }
        if(this.type != undefined && this.type != ""){
            p.append("type", this.type)
        }
        if(this.limit != undefined && this.limit != ""){
            p.append("limit", this.limit)
        }
        if(this.dateStart != undefined && this.dateStart != ""){
            p.append("timeStart", this.dateStart)
        }
        if(this.dateEnd != undefined && this.dateEnd != "" ){
            p.append("timeEnd", this.dateEnd)
        }
        fetch("http://localhost:9090/api/v1/logs?"+p,{
            method : "GET",
        })
        .then(function(response){
            return response.json();
        })
        .then(dt => {
            this.logs = dt
        })
        .catch(function(err) {
          this.error = ("Fetch Error :", err);
        });
    },
    queryLogId : function(id){
        let p = new URLSearchParams();
        p.append("devEUI", id);
        fetch("http://localhost:9090/api/v1/logs?"+p,{
            method : "GET",
        }).then(function(response){
            return response.json();
        })
        .then(dt=>{
            this.logs = dt
        })
        .catch(function (err){
             this.error =("Fetch Error :", err)
        })
    },
    // Fonction qui décode le tableau de bits 
    payloadToString : function(str){
        if (str !== undefined){
            let obj = {}
            let firstBytes = [];
            let secondBytes = [];
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
            obj.voies =firstBytes[1];
            obj.batterie =secondBytes[1];
            obj.protocole =firstBytes[2];
            obj.config = secondBytes[2];
            return obj;
        }
    },
    // Fonction qui décode le payload hexadecimal en base 64 en tableau de bits.
    decodePayload : function(str){
        if(str !== undefined){
            let obj = {};
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
                for (let k = 7; k >= 0; k--) {
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
            obj.arr = arr;
            return obj.arr
        }
    },
    // Fonction qui enleve les caracteres indésirable de la date
    dateFormat : function(date){
        if (date !== undefined) {
            date = date.replace(/[TZ]/g, " ");
            return date;
        }
    },
  },
  mounted() {
    this.loadLogs();
  },
};
</script>

<style>
</style>

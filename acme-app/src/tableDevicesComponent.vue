<template>
<div>
    <nav class="navbar fixed-top">
        <span class="fas fa-home" id="homeBtn" role="button" @click="showIndex = !showIndex"></span>
        <div id="index">
            <transition name="bounce">
                <router-link to="/"><h5 v-if="showIndex">Logs</h5></router-link>
            </transition>
            <transition name="bounce">
            <router-link to="/gateways"><h5 v-if="showIndex">Gateways</h5></router-link>
            </transition>
        </div>
        <span class="fas fa-search" id="searchBtn" data-toggle="modal" data-target="#modalSearch"></span>
        <span class="fas fa-plus" id="addBtn" data-toggle="modal" data-target="#modalAdd"></span>
        <span class="fas fa-trash-alt" id="deleteBtn" data-toggle="modal" data-target="#modalDelete"></span>
    </nav>
    <div class="alert alert-danger" v-if="devices.error" >
        <strong>{{devices.error.message}}{{devices.error.statut}}</strong>
    </div>
    <div class="table">
        <table class="table" id="table">
            <thead class="thead">
                <tr>
                    <th scope="col">DevEUI</th>
                    <th scope="col">ID</th>
                    <th scope="col">Dernière fois vue</th>
                    <th scope="col">Description</th>
                    <th scope="col">Sélectionné</th>
                </tr>
            </thead>
            <tbody :v-if=result>
            <tr v-for="(result,index) in devices.devices.result" :key="index">
                <td>
                    <h5 class="title">
                        <a href='#'>{{result.devEUI}}</a>
                    </h5>
                    <p> 
                        <button class="btn btn-primary" type="button"  v-on:click="activeItem == index ? activeItem = null : activeItem = index ">
                        Détails
                        </button>
                    </p>
                    <div class="card card-body" id="cardForm" v-show="activeItem === index">
                        <p for="devEUI">DevEUI</p>
                        <input  type="text" id="devEUI" name="devEUi" readonly :value=result.devEUI>
                        <br>
                        <p for="id">ID</p>
                        <input type="text" name="id" id="id" :value=result.name>
                        <br>
                        <button class="btn btn-outline-primary btnDetails" type="update" id="update" name="update">Mettre à jour</button>
                    </div>
                </td>
                <td>
                    <ul class="list-group list-group-flush">   
                        <li class="list-group-item">{{result.name}}<br> </li>                                      
                        <li class="list-group-item">{{idFormat(result.name)}}<br></li>
                    </ul>
                    <h6></h6>
                    <p id="deviceRefId"></p>
                </td>
                <td>
                    <p class="text" v-if=result.lastSeenAt>{{dateFormat(result.lastSeenAt)}}</p> <p v-else>No Data</p>
                </td>
                <td>
                <p class="text" id="descriptionText" v-if=result.description>{{descriptionFormat(result.description)}}</p><p v-else>No Data</p>
                </td>
                <td>
                    <div class="radio">
                        <label>
                            <input type="radio" name="deviceSelected" id="deviceSelected" v-model="deviceSelected" :value=result.devEUI>
                        </label>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="modal fade" id="modalDelete" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">CONFIRMATION SUPPRESION</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p v-if="macSelected">
                        Voulez vous vraiment supprimer le device suivant ?<br>
                        DevEUI : {{deviceSelected}}
                    </p>
                    <p v-else>
                        Aucun device selectionné
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Retour</button>
                    <button type="button" class="btn btn-primary"  data-dismiss="modal">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modalSearch" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">RECHERCHE</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group row">
                    <label for="id" class="col-2 col-form-label">ID ou DevEUI</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="id" v-model="id">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="limit" class="col-2 col-form-label">Nombre de device</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="limit" v-model="limit">
                    </div>  
                </div>
                <div class="form-group row">
                    <label for="offset" class="col-2 col-form-label">offset</label>
                    <div class="col-10">
                        <input class="form-control" type="text" id="offset" v-model="offset">
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="valider" v-on:click=queryDevices data-dismiss="modal">Rechercher</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modalAdd" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">AJOUT</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                                        <div class="form-group row">
                    <label for="devEUI" class="col-2 col-form-label">DevEUI</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="devEUI">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="id" class="col-2 col-form-label">ID</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="id">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="appKey" class="col-2 col-form-label">AppKey</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="appKey">
                    </div>  
                </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="ajouter" data-dismiss="modal">Ajouter</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
module.exports = {
  name: "tableDevicesComponent",
  data() {
    return {
        devices : [],
      error : [],
      showIndex : false,
      limit : "",
      offset : "",
      id : "",
      activeItem: null,
      deviceSelected : "",
    };
  },
  methods: {
    // Fonction qui demande les 10 derniers devices de l'API
    loadDevices: function() {
      fetch("http://localhost:9090/api/v1/devices?offset=0&limit=10")
        .then(function(response) {
          return response.json();
        })
        .then(dt => {
          this.devices = dt;
        })
        .catch(function(err) {
           this.devices =  {};
           this.devices.error = err;//("Fetch Error :", err);
        });
    },
    // Fonction qui recherche les devices en lien avec les inputs de l'utilisateur si ils sont valides
    queryDevices : function(){
        let p = new URLSearchParams()
        if(this.offset != undefined && this.offset != ""){
            p.append("offset", this.offset)
        }
        if(this.id != undefined && this.id != ""){
            p.append("search", this.id)
        }
        if(this.limit != undefined && this.limit != ""){
            p.append("limit", this.limit)
        }
        fetch("http://localhost:9090/api/v1/devices?"+p)
        .then(function(response) {
          return response.json();
        })
        .then(dt => {
          this.devices = dt;
        })
        .catch((err) => {
            console.log(err)
           this.devices =  {};
           this.devices.error = err;
        });
    }
    , // Permet de rechercher un device uniquement avec son Id ( non actif sur cette page)
    queryDeviceId : function(id){
        let p = new URLSearchParams();
        p.append("search", id);
        fetch("http://localhost:9090/api/v1/devices/"+p,{
            method : "GET",
        }).then(function(response){
            return response.json();
        })
        .then(dt=>{
            this.devices = dt
        })
        .catch(function (err){
             this.error = ("Fetch Error :", err)
        })
    },
    // Fonction qui enleve les caracteres indésirable de la date
    dateFormat : function(date){
        if (date !== undefined) {
            date = date.replace(/[TZ]/g, " ");
            return date;
        }
    },// Fonction qui permet un affichage particulier de l'id des devices
    idFormat : function(str){
        if (str !== undefined) {
            let reference = str.slice(0, 10);
            let nSerie = str.slice(10,str.length)
            let string = "Référence produit : " + reference +" N\° de série : " + nSerie;
            return string;
        }
    },
    descriptionFormat : function(str){
        if(str !== undefined){
            str = str.replace(/[,{}"]/g, " ");
            str = str.slice(20,str.length)
            return str;
        }
    }
  },
  mounted() {
    this.loadDevices();
  }
};
</script>

<style>
</style>

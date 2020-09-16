<template>
<div>
    <nav class="navbar fixed-top">
        <span class="fas fa-home" id="homeBtn" role="button" @click="showIndex = !showIndex"></span>
        <div id="index">
            <transition name="bounce">
                <router-link to="/"><h5 v-if="showIndex">Logs</h5></router-link>
            </transition>
            <transition name="bounce">
                <router-link to="/devices"><h5 v-if="showIndex">Devices</h5></router-link>
            </transition>
        </div>
        <span class="fas fa-search" id="searchBtn" data-toggle="modal" data-target="#modalSearch"></span>
        <span class="fas fa-plus" id="addBtn" data-toggle="modal" data-target="#modalAdd"></span>
        <span class="fas fa-trash-alt" id="deleteBtn" data-toggle="modal" data-target="#modalDelete"></span>
    </nav>
    <div class="table-responsive">
        <div class="alert alert-success" role="alert"  v-if="succes">
            <strong>{{succes}}</strong>
        </div>
        <table class="table">
            <thead class="thead">
                <tr>
                    <th scope="col">MAC</th>
                    <th scope="col">Crée le</th>
                    <th scope="col">Mise à jour le</th>
                    <th scope="col">Sélectionné</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="result in gateways.gateways.result" :key="result.id">
                    <td>
                        <h5 class="title">
                            <a href='#'> {{result.mac}} </a>
                        </h5>
                    </td>
                    <td>
                        <p v-if=result.createdAt>{{dateFormat(result.createdAt)}}</p><p v-else>No Data</p>
                    </td>
                    <td>
                        <p  class="text" v-if=result.updatedAt >{{dateFormat(result.updatedAt)}}</p><p v-else>No Data</p>
                    </td>
                    <td>
                        <div class="radio">
                            <label>
                                <input type="radio" name="radio" id="radio" :value=result.mac v-model ='macSelected'>
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
                    <h5 class="modal-title" id="modalLabel">CONFIRMATION</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p v-if="macSelected">
                        Voulez vous vraiment supprimer le gateway suivant ?<br>
                        MAC : {{macSelected}}
                    </p>
                    <p v-else>
                        Aucun gateway selectionné
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Retour</button>
                    <button type="button" class="btn btn-primary" v-on:click=deleteGateway data-dismiss="modal">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modalSearch" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">CONFIRMATION</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group row">
                        <label for="mac" class="col-2 col-form-label">MAC</label>
                        <div class="col-10">
                                <input class="form-control" type="text" id="mac" v-model="mac">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="limit" class="col-2 col-form-label">Nombre de gateways</label>
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
                    <button type="button" class="btn btn-primary" id="valider" v-on:click=queryGateway data-dismiss="modal">Rechercher</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="modalAdd" tabindex="-1" role="dialog" aria-labelledby="modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">CONFIRMATION</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group row">
                    <label for="macAdd" class="col-2 col-form-label">MAC</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="macAdd" name="macAdd" v-model="macAdd" required>
                    </div>
                    <label for="nameAdd" class="col-2 col-form-label">Nom du gateway</label>
                    <div class="col-10">
                            <input class="form-control" type="text" id="nameAdd" name="nameAdd" v-model="nameAdd" required>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="ajouter" v-on:click=addGateway data-dismiss="modal">Ajouter</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
module.exports = {
  name: "tableGatewaysComponent",
  data() {
    return {
      gateways: [],
      showIndex : true,
      mac : "",
      offset :"",
      limit : "",
      error : [],
      sucess : "",
      nameAdd : "",
      macAdd : "",
      macSelected : "",
    };
  },
  methods: {
    // Fonction qui demande les 10 derniers gateways a L'API
    loadGateways: function() {
        fetch("http://localhost:9090/api/v1/gateways?limit=10&offset=0")
          .then(function(response) {
            return response.json();
          })
          .then(dt => {
            this.gateways = dt;
          })
          .catch(function(err) {
            console.log("Fetch Error :", err);
          });
    },
    // Fonction qui effectue une recherche sur l'API a l'aide des inputs saisi par l'utilisateur   
    queryGateway : function(){
        let p = new URLSearchParams()
        if(this.offset != undefined && this.offset != ""){
            p.append("offset", this.offset)
        }
        if(this.mac != undefined && this.mac != ""){
            p.append("mac", this.mac)
        }
        if(this.limit != undefined && this.limit != ""){
            p.append("limit", this.limit)
        }
        fetch("http://localhost:9090/api/v1/gateways?"+p)
        .then(function(response) {
          return response.json();
        })
        .then(dt => {
          this.gateways = dt;
        })
        .catch(function(err) {
          this.error = ("Fetch Error :", err);
        });
    },
    queryGatewayId : function(id){
        let p = new URLSearchParams();
        p.append("mac", id);
        fetch("http://localhost:9090/api/v1/gateways/"+p,{
            method : "GET",
        }).then(function(response){
            return response.json();
        })
        .then(dt=>{
            this.gateways = dt
        })
        .catch(function (err){
            console.log("Fetch Error :", err)
        })
    },
    // Permet d'enlever des caracteres indésirable a l'affichage
    dateFormat : function(date){
        if (date !== undefined) {
            date = date.replace(/[TZ]/g, " ");
            return date;
        }
    },
    // Permet l'ajout d'un gateway
    addGateway : function(){
        fetch("http://localhost:9090/api/v1/gateways",{
            method : "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                name : this.nameAdd,
                mac : this.macAdd
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            alert("Gateways ajouté");
        })
        .catch (function(err){
            console.log("Fetch Error :", err);
        });
    },
    // Permet la suppression d'un gateway
    deleteGateway : function(){
        fetch("http://localhost:9090/api/v1/gateways/"+this.macSelected,{
            headers : {
                "Content-Type": "application/json"
            },
            method : "delete",
        })
        .then((response)=>{
            return response.json();
        })
        .then (function(dt){
            this.succes = dt
        })
        .catch (function (err){
            console.log("Fetch Error : ",err)
        })
    }
    //Charge les gateways lorsque le composant est crée
  },created (){
      this.loadGateways();
    },
};
</script>

<style>
</style>

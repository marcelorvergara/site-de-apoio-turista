<template>
  <div>
    <router-view></router-view>
    <!--    menu navbar-->
    <b-navbar toggleable="xl" type="dark" variant="info" class="navbar-expand-md mb-3" role="navigation">
      <b-navbar-brand @click="$store.commit('mostrar',true)">Z-Games: Site de Apoio</b-navbar-brand>
      <b-navbar-toggle target="navbar-toggle-collapse" >
        <template #default="{ expanded }">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon>
        </template>
      </b-navbar-toggle>
      <b-navbar-nav class="ml-5">
        <b-nav-item-dropdown toggle-class="text-light" right>
          <template v-slot:button-content>
            <b-icon-lightning scale="2" class="mr-2"></b-icon-lightning>
            Eventos
          </template>
          <b-dropdown-item @click="menuEventos('competicao')">Competições</b-dropdown-item>
          <b-dropdown-item @click="menuEventos('show')">Shows</b-dropdown-item>
          <b-dropdown-item @click="menuEventos('pales')">Palestras</b-dropdown-item>
          <b-dropdown-item @click="menuEventos('work')">Workshops</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown toggle-class="text-light" right>
          <template v-slot:button-content>
            <b-icon-geo scale="2" class="mr-2"></b-icon-geo>
            Serviços
          </template>
          <b-dropdown-item @click="menuServicos('hospital')">Hospitais</b-dropdown-item>
          <b-dropdown-item @click="menuServicos('police')">Delegacias</b-dropdown-item>
          <b-dropdown-item @click="menuServicos('tourist_attraction')">Atrações Turísticas</b-dropdown-item>
          <b-dropdown-item @click="menuServicos('amusement_park')">Parques de Diversão</b-dropdown-item>
          <b-dropdown-item @click="menuServicos('restaurant')">Onde Comer</b-dropdown-item>
          <b-dropdown-item @click="menuServicos('lodging')">Onde Dormir</b-dropdown-item>
          <b-dropdown-item @click="menuServicos('convenience_store')">Banheiros</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-collapse id="navbar-toggle-collapse" is-nav>
          <b-nav-form class="mt-2 mr-5 ml-2">
            <b-button pill variant="outline-light" @click="mostrarNoMapaPA"> Posição Atual <b-icon icon="geo-alt"/></b-button>
          </b-nav-form>
          <b-nav-form class="mt-2 mr-5">
            <b-input-group prepend="Outro Local" class="btn-info">
              <b-form-input autocomplete="off" id="autocomplete" v-model="autocomplete" placeholder="Digite o local desejado" role="searchbox"></b-form-input>
              <b-input-group-append>
                <b-button size="sm" variant="dark" @click="mostrarNoMapa" ><span>Buscar</span> <b-icon icon="search"/></b-button>
              </b-input-group-append>
            </b-input-group>
          </b-nav-form>
          <b-nav-item class="mt-2 mr-5" to="/AcessoRestrito" @click="$store.commit('mostrar',false)">Acesso Restrito</b-nav-item>
        </b-collapse>
        <span class="version">v4</span>
      </b-navbar-nav>
    </b-navbar>

    <!--    container "main"-->
    <div id="app" class="container" role="form">
      <div >
        <!--   selects dos serviços tipo e distância para o ponto inicial-->
        <b-row sm="auto" v-show="$store.state.mostraServicos">
          <b-col>
            <b-form-select v-model="lugares" :options="lug" size="md" class="mt-1"></b-form-select>
          </b-col>
          <b-col>
            <b-form-select v-model="distancia" :options="dist" size="md" class="mt-1"></b-form-select>
          </b-col>

          <!--        botão de o que há por perto-->
          <b-col>
            <b-button id="oQueHaPorPerto" variant="info" @click="porPerto" class="mt-1">O que há por perto <b-icon icon="question-octagon"/></b-button>
          </b-col>
        </b-row>

        <!--      alert informando a posição atual-->
        <b-row sm="auto" class="mt-3">
          <b-col>
            <b-alert show v-if="endereco" variant="info">Sua posição atual aproximada é: {{endereco}}</b-alert>
          </b-col>
        </b-row>
      </div>

      <!--    Mapa -->
      <div v-if="$store.getters.mostrarMapa" id="map" ref="map" class="mt-3" role="application">
        <MapMarker v-for="(local,index) in loc" :key="index" :loc="loc"></MapMarker>
      </div>
      <div v-else id="map" ref="map" style="margin: auto" role="application">
        <b-img src="./img/zgames.png" alt="logo z-games" fluid-grow></b-img>
      </div>
    </div>

    <!--    modal para quando não tiver o ponto de partida definido-->
    <b-modal ref="my-modal" hide-footer title="Escolha um ponto de partida" role="dialog">
      <div class="d-block text-center">
        <h3>Onde gostaria que sua pesquisa localizasse o serviço?</h3>
      </div>
      <b-button class="mt-3" variant="outline-primary" @click="mostrarModalNoMapaPa" block aria-label="my location">Utilizar minha localização</b-button>

      <b-input-group prepend="Outro Local" class="btn-info mt-2">
        <b-form-input id="autocomplete" v-model="autocomplete" placeholder="Digite o local desejado"></b-form-input>
        <b-input-group-append>
          <b-button size="sm" variant="dark" @click="mostrarModalNoMapa" aria-label="search"><span>Buscar</span> <b-icon icon="search"/></b-button>
        </b-input-group-append>
      </b-input-group>
    </b-modal>
  </div>
</template>

<script>

import MapMarker from "@/components/MapMarker";
import firebase from "firebase";

export default {
  name: 'Home',
  watch:{
    loc:function (value){
      this.loc = value
    }
  },
  data(){
    return{
      endereco:'',
      distancia: null,
      dist: [
        { value: null, text: 'Selecione a Distância Máxima' },
        { value: 500, text: '500 metros' },
        { value: 1000, text: '1 Km' },
        { value: 2000, text: '2 Km' },
        { value: 3500, text: '3,5 Km' },
        { value: 6000, text: '6 Km' }
      ],
      lugares: null,
      lug: [
        { value: null, text: 'Serviços' },
        { value: 'hospital', text: 'Hospital' },
        { value: 'police', text: 'Polícia' },
        { value: 'tourist_attraction', text: 'Atrações Turísticas' },
        { value: 'amusement_park', text: 'Parques de Diversão' },
        { value: 'restaurant', text: 'Restaurantes' },
        { value: 'lodging', text: 'Onde Dormir' },
        { value: 'convenience_store', text: 'Banheiros' },
      ],
      mapTag:null,
      map:null,
      message:'',
      mostra: false,
      autocomplete: '',
      loc:[],
      zoom: 14
    }
  },
  components:{
    MapMarker
  },
  methods:{
    menuEventos(evento){
      this.$store.commit('mostrar',true)
      var infowindow = new window.google.maps.InfoWindow();
      var map = new window.google.maps.Map(this.$refs['map'], {
        center: {lat:-22.88812156536003, lng:-43.4527405701575},
        zoom: 10
      });
      const db = firebase.firestore().collection("eventos");
      db.where("tipo", "==", evento)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              criarMark(doc.data())

              function criarMark(place) {
                const marker = new window.google.maps.Marker({
                  map,
                  position: place.coordenadas,
                  title: place.nome,
                  animation: window.google.maps.Animation.BOUNCE,
                  icon:'./img/lighting.png'
                  //label: place.business_status
                });
                window.google.maps.event.addListener(marker, "click", () => {
                  infowindow.setContent(
                      `<div><strong><span>${place.nome}</span></strong></div>
                        <div class="mt-1">Localização: ${place.endereco} </div>
                        <div class="mt-1 bullet">&#8226; Data: ${place.data} &#8226;</div>
                        <div class="mt-1 bullet">&#8226; Hora: ${place.hora} &#8226;</div>`)
                  infowindow.open(map,marker)
                })
              }
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
    },
    mostrarModalNoMapa(){
      this.mostrarNoMapa()
      this.$refs['my-modal'].toggle('#oQueHaPorPerto')
    },
    mostrarModalNoMapaPa(){
      this.mostrarNoMapaPA()
      this.$refs['my-modal'].toggle('#oQueHaPorPerto')
    },
    menuServicos(item){
      this.$store.commit('setServicos',true)
      this.lugares = item;
      this.distancia = 3500;
      this.porPerto();
    },
    async getNomeDaRua(lat,long){
      const geocoder = new window.google.maps.Geocoder()
      const latlng = {
        lat: lat,
        lng: long
      }
      geocoder.geocode({ location: latlng}, (results, status) =>{
        if (status === 'OK'){
          if (results[0]){
            this.endereco = results[0].formatted_address;
          }else{
            window.alert('não foi possível encontrar a localização')
          }
        }
      })
    },
    porPerto(){
      console.log(this.endereco)
      const pois = this.$store.getters.getPoi
      this.$store.commit('mostrar',true)
      if (this.loc.length === 0){
        this.$refs['my-modal'].show()
      }else {
        var infowindow = new window.google.maps.InfoWindow();
        var map = new window.google.maps.Map(this.$refs['map'], {
          center: this.loc[this.loc.length -1],
          zoom: this.zoom
        });
        var request = {
          location: this.loc[this.loc.length -1],
          radius: this.distancia,
          type: [this.lugares]
        };
        //essa função é para a posição atual
        posicaoAtual(this.loc[0],this.endereco);
        //abaixo as marcações
        var service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
      }

      function callback(results,status){
        if (status === window.google.maps.places.PlacesServiceStatus.OK){
          for (var i=0; i < results.length; i++){
            criarMark(results[i])
          }
        }
      }
      function criarMark(place){
        //parcerias
        const found = pois.find(element => element.poi === place.place_id);
        //se encontrou, colocar a observação de ling estrangeira e descontos de parceria
        if (found){
          const marker = new window.google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
            animation: window.google.maps.Animation.DROP,
            icon:'./img/servicos.png'
            //label: place.business_status
          });
          window.google.maps.event.addListener(marker, "click", () => {
            let aval = place.rating || 'não possui';
            let lingEst = found.linguas || 'only portuguese';
            let parceria = found.parceria || 'não possui';
            infowindow.setContent(
                `<div><strong><span>${place.name}</span></strong></div>
                <div class="mt-1"><img alt="ícone serviço" src="${place.icon}"</img></div>
                <div class="mt-1">Avaliação: ${aval} </div>
                <div class="mt-1">Localização: ${place.vicinity} </div>
                <div class="mt-1 bullet">&#8226; Foreing language: ${lingEst} &#8226;</div>
                <div class="mt-1 bullet">&#8226; Parceria: ${parceria} &#8226;</div>`)
            infowindow.open(map,marker)
          })
        } else{
          //abaixo os places de acordo com o serviço pesquisado sem parcerias ou ling. estrangeiras
          // if (place.place_id === "ChIJ1f7wNzd4mQARhS9pkyTxBLA"){}
          const marker = new window.google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
            animation: window.google.maps.Animation.DROP,
            icon:'./img/geo-icon.png'
            //label: place.business_status
          });
          window.google.maps.event.addListener(marker, "click", () => {
            let aval = place.rating || 'não possui'
            infowindow.setContent(
                `<div><strong><span>${place.name}</span></strong></div>
                <div class="mt-1"><img src="${place.icon}"</img></div>
                <div class="mt-1">Avaliação: ${aval} </div>
                <div class="mt-1">Localização: ${place.vicinity} </div>`)
            infowindow.open(map,marker)
          })
        }
      }
      function posicaoAtual(posicaoAtual,ednerecoAtual){
        const marker = new window.google.maps.Marker({
          map,
          position: posicaoAtual,
          title: "Você está aqui!",
          icon:'https://maps.gstatic.com/mapfiles/ms2/micons/POI.png'
          //label: place.business_status
        });
        window.google.maps.event.addListener(marker, "click", () => {
          infowindow.setContent(
              `<div><strong><span>Vocẽ está aqui: ${ednerecoAtual}</span></strong></div>`)
          infowindow.open(map,marker)
        })
      }
    },
    mostraMapa(){
      this.mapTag = this.$refs['map'];
      this.map = new window.google.maps.Map(this.mapTag,{
        center:this.loc[this.loc.length -1],
        zoom:this.zoom
      })
      new window.google.maps.Marker({
        positon:this.loc[this.loc.length -1],
        map: this.map
      })
    },
    async mostrarNoMapa(){
      this.$store.commit('mostrar',true)
      var geocoder = new window.google.maps.Geocoder();
      try {
        await geocoder.geocode({'address': this.autocomplete}, (results,status) => {
          if (status === 'OK'){
            this.loc.push(results[0].geometry.location);
            this.mostraMapa()
          } else if (status === 'ZERO_RESULTS')
            this.error = 'Nenhum local encontrado'
          else{
            this.error = status
          }
        })
      }catch (e)
      {
        this.error = e
      }
    },
    getMap(callback){
      let vm = this
      function checkForMap() {
        if (vm.map) callback(vm.map)
        else setTimeout(checkForMap, 200)
      }
      checkForMap()
    },
    mostrarNoMapaPA(){
      this.$store.commit('mostrar',true)
      this.$store.commit('setServicos',true)
      navigator.geolocation.getCurrentPosition(
          position => {
            //para colocar o marker
            this.lat = position.coords.latitude
            this.lng = position.coords.longitude
            //para enviar a posição ao mapa
            this.loc.push({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
            this.mostraMapa()
            this.getNomeDaRua(this.lat,this.lng)
          },
          error => {
            console.error("Error getting location", error);
          }
      );
    }
  },
  created() {
    const db = firebase.firestore().collection('PoI')
    db.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            this.$store.commit('setPoi',doc.data())
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@500&display=swap');
.version{
  color: lightgray;
  font-family: 'monospace';
  font-size: 0.7em;
  font-weight: bolder;
}
span{
  font-family: 'Raleway', sans-serif;
  font-size: 1.2em;
  font-weight: bolder;
  padding: 3px;
}
#map{
  height: 600px;
  background: grey;
}
.bullet{
  color: #866108;
}
</style>

<template>
  <b-container class="container-fluid">
    <b-row v-if="user.data" class="mt-2">
      <b-col>
      <b-card
          align="right"
          border-variant="info"
          header-bg-variant="info"
          header-text-variant="white"
          v-bind:header="user.data.email">
          <b-button variant="outline-danger" @click="signOut" class="mb-4">Logout</b-button>
        <b-card-text align="left">&#8227; Administração dos Eventos - funcionalidade para cadastro, atualização e exclusão
        dos EVENTOS que serão visíveis aos usuários do site.</b-card-text>
        <b-card-text align="left">&#8227; Administração dos Serviços - local para cadastro e edição das
        parcerias oferecidas aos participantes dos eventos e para informação referente ao atendimento em outras
        línguas estrangeiras.</b-card-text>
      </b-card>
      </b-col>
    </b-row>
    <!--    administração dos eventos-->
    <b-row class="mt-2">
      <b-col>
          <b-card no-body
                  border-variant="info"
                  header="Administração dos Eventos"
                  header-bg-variant="info"
                  header-text-variant="white">

            <div class="card-body">
              <b-alert v-if="errorEventos" show="5" variant="danger" dismissible>{{errorEventos}}</b-alert>
              <b-alert v-if="sucessoEventos" show="5" variant="success" dismissible>{{sucessoEventos}}</b-alert>
              <b-card bg-variant="light">
                <b-form-group
                    label=""
                    label-size="lg"
                    label-class="font-weight-bold pt-0"
                    class="mb-0"
                >
                  <b-form-group
                      label-cols-sm="3"
                      label="Nome do Evento:"
                      label-align-sm="left"
                      label-for="eventoNome"
                  >
                    <vue-bootstrap-typeahead
                        id="nome"
                        :data=eventoList
                        v-model="eventoNome"
                        @hit="preencheVal"
                    />
                  </b-form-group>

                  <b-form-group
                      label-cols-sm="3"
                      label="Endereço:"
                      label-align-sm="left"
                      label-for="eventoEndereco"
                  >
                    <b-form-input id="eventoEndereco" v-model="eventoEndereco"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      label-cols-sm="3"
                      label="Data do Evento:"
                      label-align-sm="left"
                      label-for="eventoData"
                  >
                    <b-form-input type="date" id="eventoData" v-model="eventoData"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      label-cols-sm="3"
                      label="Hora do Evento:"
                      label-align-sm="left"
                      label-for="eventoHora"
                  >
                    <b-form-input type="time" id="eventoHora" v-model="eventoHora"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      label-cols-sm="3"
                      label="Tipo do Evento:"
                      label-align-sm="left" class="mb-0"
                  >
                    <b-form-radio-group
                        class="pt-2"
                        :options="options"
                        v-model="eventoTipo"
                    ></b-form-radio-group>
                  </b-form-group>
                  <b-button @click="cadastraEvento" block variant="outline-dark" class="mt-4"><span>
                    Cadastrar
                    <b-spinner v-show="loadingCad" small label="Carregando..."></b-spinner>
                  </span> <b-icon icon="file-check"/></b-button>
                  <b-button @click="atualizaEvento" block variant="outline-primary" class="mt-4"><span>
                    Atualizar
                    <b-spinner v-show="loadingAtu" small label="Carregando..."></b-spinner>
                  </span> <b-icon icon="file-arrow-up"/></b-button>
                  <b-button @click="deleteEventoDel" block variant="outline-danger" class="mt-4"><span>
                    Deletar
                    <b-spinner v-show="loadingDel" small label="Carregando..."></b-spinner>
                  </span> <b-icon icon="file-x"/></b-button>
                </b-form-group>
              </b-card>

            </div>
          </b-card>
      </b-col>
<!--    administração de serviços-->
      <b-col>
          <b-card no-body
                  border-variant="info"
                  header="Administração dos Serviços"
                  header-bg-variant="info"
                  header-text-variant="white">

            <div class="card-body">
            <b-card bg-variant="light">
              <b-form-group
                  label=""
                  label-size="lg"
                  label-class="font-weight-bold pt-0"
                  class="mb-2">
<!--              alertas de retorno-->
              <b-alert v-if="error" show="5" variant="danger" dismissible>{{error}}</b-alert>
              <b-alert v-if="sucesso" show="5" variant="success">{{sucesso}}</b-alert>
<!--              input de busca de estabelecimentos-->
                <div>
                  <b-form-group label="Cadastro de Estabelecimento" label-for="cadEstab" label-align="left"></b-form-group>
                  <b-input-group id="cadEstab"  label-for="cadEstab" label-align="left" class="mb-2">
                    <b-form-input placeholder="Estabelecimento" aria-label="Estabelecimento" v-model="estabelecimento">
                    </b-form-input>
                    <b-form-input placeholder="Endereço" aria-label="Endereço" v-model="endBusca">
                    </b-form-input>
                  </b-input-group>
                  <b-button block size="sm" variant="outline-dark" @click="mostrarNoMapa"><span>Buscar</span> <b-icon icon="search"/></b-button>
                </div>
<!--              inputs de cadastro de lingua e descontos-->
              <div class="card-body mt-3" v-if="place_id">
                <hr>
                <b-card-sub-title>{{ endereco }}</b-card-sub-title>
                <b-input-group size="md" class="btn-info mt-3">
                  <b-form-input placeholder="Qual língua estrangeira o local oferece" v-model="lingua">
                  </b-form-input>
                  <b-input-group-append>
                    <b-button @click="inserirLingua"  variant="dark" ><span>Inserir</span> <b-icon icon="spellcheck"/>
                    </b-button>
                    <b-button @click="deletarLingua" variant="danger" ><span>Deletar</span> <b-icon icon="shield-exclamation"/>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>

                <b-input-group size="md"  class="btn-info mt-2">
                  <b-form-input placeholder="Qual parceria o local oferece" v-model="parceria">
                  </b-form-input>
                  <b-input-group-append>
                    <b-button @click="inserirParceria" variant="dark" ><span>Inserir</span> <b-icon icon="cash-stack"/>
                    </b-button>
                    <b-button @click="deletarParceria" variant="danger" ><span>Deletar</span> <b-icon icon="shield-exclamation"/>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>

              </div>
              </b-form-group>
            </b-card>
            </div>
          </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {mapGetters} from "vuex";
import firebase from "firebase";
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

export default {
  name: "AdministracaoPOI",
  components:{
    VueBootstrapTypeahead
  },
  data(){
    return{
      estabelecimento:'',
      endBusca:'',
      options:[
        {text: 'Competição',value:'competicao'},
        {text: 'Show',value:'show'},
        {text: 'Palestras',value:'pales'},
        {text: 'Workshops',value:'work'}
      ],
      eventoList:[],
      eventoListArray:[],
      loadingCad: false,
      loadingAtu: false,
      loadingDel: false,
      eventoEndereco:'',
      eventoNome:'',
      eventoData:'',
      eventoHora:'',
      eventoTipo:'',
      error:'',
      sucesso:'',
      place_id:'',
      endereco:'',
      lingua:'',
      parceria:'',
      errorEventos:'',
      sucessoEventos:''
    }
  },
  computed:{
    ...mapGetters({
      user: "user"
    })
  },
  methods:{
    deleteEventoDel(){
      this.loadingDel = true;
      const db = firebase.firestore()
      db.collection("eventos").doc(this.eventoNome).delete().then(() => {
        this.sucessoEventos = `Evento ${this.eventoNome} removido com sucesso!`
        this.loadingDel = false;
      }).catch(function(error) {
        this.errorEventos = `${error} na deleção do evento!`
        this.loadingDel = false;
      });
    },
    atualizaEvento(){
      this.loadingAtu = true;
      this.errorEventos = '';
      this.sucessoEventos = '';
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: this.eventoEndereco }, (results, status) => {
        if (status === "OK") {
          const endEv = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          }

          const db = firebase.firestore()
          var eventoRef = db.collection('eventos').doc(this.eventoNome);
          // eslint-disable-next-line no-unused-vars
          var setWithMerge = eventoRef
              .set({
                nome: this.eventoNome,
                endereco: this.eventoEndereco,
                coordenadas: endEv,
                data: this.eventoData,
                hora: this.eventoHora,
                tipo: this.eventoTipo
              }, {merge: true})
              .then(() => {
                this.loadingAtu = false
                this.sucessoEventos = `Evento ${this.eventoNome} atualizado com sucesso!`
              })
              .catch((error) => {
                this.loadingAtu = false
                this.errorEventos = error
              });
        } else {
          this.errorEventos = `Endereço ${this.eventoEndereco} não encontrado!`
        }
      })
    },
    preencheVal(){
      const found = this.eventoListArray.find(evento => evento.nome === this.eventoNome)
      if (found){
        this.eventoEndereco = found.endereco;
        this.eventoData = found.data
        this.eventoHora = found.hora
        for (var val in this.options) {
          if (this.options[val].value === found.tipo){
            this.eventoTipo = this.options[val].value
          }
        }
      }
    },
    cadastraEvento(){
      this.loadingCad = true;
      this.errorEventos = '';
      this.sucessoEventos = '';
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: this.eventoEndereco }, (results, status) => {
        if (status === "OK") {
          const endEv = {
            lat:results[0].geometry.location.lat(),
            lng:results[0].geometry.location.lng()
          }
          const db = firebase.firestore().collection("eventos");
          db.doc(this.eventoNome)
              .set({
                nome: this.eventoNome,
                endereco: this.eventoEndereco,
                coordenadas: endEv,
                data: this.eventoData,
                hora: this.eventoHora,
                tipo: this.eventoTipo
              })
              .then(()=> {
                this.loadingCad = false
                this.sucessoEventos = "Evento cadastrado com sucesso!"
              })
              .catch((error)=> {
                this.errorEventos = error
              });
        }else {
          this.errorEventos = `Endereço ${this.eventoEndereco} não encontrado!`
        }
      });
    },
    deletarLingua(){
      const db = firebase.firestore().collection('PoI').doc(this.place_id)
      // eslint-disable-next-line no-unused-vars
      var removeLinguas = db.update({
        linguas: firebase.firestore.FieldValue.delete()
      }).then(()=> {
            this.sucesso = "Língua(s) deletada(s) com sucesso!";
            this.lingua = '';
          })
    },
    deletarParceria(){
      const db = firebase.firestore().collection('PoI').doc(this.place_id)
      // eslint-disable-next-line no-unused-vars
      var removeParceria = db.update({
        parceria: firebase.firestore.FieldValue.delete()
      }).then(()=> {
        this.sucesso = "Parceria deletada com sucesso!";
        this.parceria ='';
      })

    },
    inserirParceria(){
      const db = firebase.firestore().collection('PoI')
          db.doc(this.place_id).set({
            estabelecimento: this.estabelecimento,
            endereco: this.endBusca,
            poi: this.place_id,
            parceria: this.parceria
          }, { merge: true })
          .then(()=> {
            this.sucesso = "Parceria inserida com sucesso!"
          })
          .catch((error)=> {
            this.error = error
          });
    },
    inserirLingua(){
      const db = firebase.firestore().collection('PoI')
          db.doc(this.place_id).set({
            estabelecimento: this.estabelecimento,
            endereco: this.endBusca,
            poi: this.place_id,
            linguas: this.lingua
          }, { merge: true })
          .then(() =>{
            this.sucesso = "Língua estrangeira inserida com sucesso!"
          })
          .catch((error) => {
            this.error = error
          });
    },
    async mostrarNoMapa(){
      this.$store.commit('mostrar',true)
      const pois = this.$store.getters.getPoi
      const busca = `${this.estabelecimento}` + ` ` + `${this.endBusca}`

      var geocoder = new window.google.maps.Geocoder();
      try {
        await geocoder.geocode({'address': busca}, (results,status) => {
          if (status === 'OK'){
            this.place_id = results[0].place_id
            this.endereco = results[0].formatted_address
            const found = pois.find(element => element.poi === this.place_id);
            if (found){
              this.lingua = found.linguas
              this.parceria = found.parceria
            }
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
    signOut() {
      firebase
          .auth()
          .signOut()
          .then(() => {
            this.$router.replace({
              name: "Home"
            });
          });
    }
  },
  created() {
    if (this.user.data == null){
      this.$router.replace({
        name: "Home"
      });
    }
    // eslint-disable-next-line no-unused-vars
    const db = firebase.firestore().collection("eventos")
        .get()
        .then((querySnapshot) =>{
          querySnapshot.forEach((doc) => {
            this.eventoList.push(doc.data().nome)
            this.eventoListArray.push(doc.data())
          });
        })
        .catch(function(error) {
          console.error("Error getting documents: ", error);
        });
  }
}
</script>

<style scoped>

</style>
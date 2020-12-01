<template>
  <b-container class="container-fluid mt-2">
    <b-row v-if="user.data" class="mt-2">
      <b-col>
        <b-card
            align="right"
            border-variant="info"
            header-bg-variant="info"
            header-text-variant="white"
            v-bind:header="user.data.email">
          <b-button variant="outline-danger" @click="signOut" class="mb-4">Logout</b-button>
          <b-card-text align="left">&#8227; Administração dos Logins Administrativos - aqui são criados os logins
          para os usuários de acesso restrito que irão administrar os Eventos e Serviços exibidos na página principal.
          </b-card-text>
          <b-card-text align="left">&#8227; Para habilitar/desabilitar logins de usuários administrativos, digite as
            duas primeiras letras do nome do usuário no campo NOME e selecione o nome que aparece. Após a seleção do
            nome, clique em habilitar e desabilitar.
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col></b-col>
      <b-col cols="8">
          <b-card no-body
                  border-variant="info"
                  header="Administração dos Logins Administrativos"
                  header-bg-variant="info"
                  header-text-variant="white">

          <div class="card-body">
            <b-alert v-if="error" show="5" variant="danger" dismissible>{{error}}</b-alert>
            <b-alert v-if="sucesso" show="5" variant="success" dismissible>{{sucesso}}</b-alert>
                <b-form-group
                    label-cols-sm="3"
                    label="Nome:"
                    label-align-sm="left"
                    label-for="nome"
                >
                  <vue-bootstrap-typeahead
                      id="nome"
                      :data=userList
                      v-model="name"
                      @hit="name = $event"
                  />
              </b-form-group>

            <b-form-group
                label-cols-sm="3"
                label="Email:"
                label-align-sm="left"
                label-for="email"
            >
                  <b-form-input
                      id="emailUser"
                      type="email"
                      class="form-control"
                      name="email"
                      value
                      required
                      autofocus
                      title="Preencha apenas para criação de novos logins"
                      v-model="form.emailUser"
                  />
            </b-form-group>

            <b-form-group
                label-cols-sm="3"
                label="Senha:"
                label-align-sm="left"
                label-for="passowrd"
            >
                <b-form-input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    v-model="form.password"
                />
            </b-form-group>

            <b-form-group
                label-cols-sm="3"
                label="Repetir Senha:"
                label-align-sm="left"
                label-for="passowrd2"
            >
              <b-form-input
                  id="password2"
                  type="password"
                  class="form-control"
                  name="password"
                  v-model="form.password2"
              />
            </b-form-group>

              <b-form-group class="mb-0 text-right" >
                  <b-button size="sm" @click="$router.go(-1)" variant="outline-info" class="ml-1">Voltar</b-button>
                  <b-button size="sm" @click="desabilitarLogin" variant="outline-info" class="ml-1">Desabilitar</b-button>
                  <b-button size="sm" @click="habilitarLogin" variant="outline-info" class="ml-1">Habilitar</b-button>
                  <b-button size="sm" @click="criar" type="submit" variant="outline-info" class="ml-1">
                    <b-spinner v-show="loading" small label="Carregando..."></b-spinner>
                    Criar</b-button>
              </b-form-group>
          </div>
          <b-modal ref="modal" title="Novo Usuário">
            <p>Usuário Registrado com Sucesso!</p>
          </b-modal>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
import firebase from "firebase";
import {mapGetters} from 'vuex';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

export default {
  components:{
    VueBootstrapTypeahead
  },
  data() {
    return {
      loading: false,
      form: {
        emailUser: "",
        password: "",
        password2:""
      },
      name:"",
      error: null,
      sucesso: null,
      userList: [],
      userListArray: [],
    };
  },
  methods: {
    habilitarLogin(){
      this.sucesso = '';
      this.error =''
      const found = this.userListArray.find(mail => mail.nome === this.name)
      if (found){
        const db = firebase.firestore().collection("administradores")
        db.doc(found.email)
            .set({
              status:'habilitado'
            }, { merge: true })
            .then(()=> {
              this.sucesso = "Login habilitado com sucesso!"
            })
            .catch((error)=> {
              this.error = error
            });
      }else{
        this.error = 'Nome não encontrado!'
      }
    },
    desabilitarLogin(){
      this.sucesso = '';
      this.error =''
      const found = this.userListArray.find(mail => mail.nome === this.name)
      if (found){
        const db = firebase.firestore().collection("administradores")
        db.doc(found.email)
            .set({
              status:'desabilitado'
            }, { merge: true })
            .then(()=> {
              this.sucesso = "Login desabilitado com sucesso!"
            })
            .catch((error)=> {
              this.error = error
            });
      }else{
        this.error = 'Nome não encontrado!'
      }
    },
    criar() {
      this.sucesso = '';
      this.error = '';
      if (this.form.password !== this.form.password2){
        this.error = "As senhas digitadas são diferentes!"
      }else{
        this.loading = true;
        const db = firebase.firestore().collection("administradores");
        const data = new Date();
        const createUser = firebase.functions().httpsCallable('createUser');
        createUser({email:this.form.emailUser, password:this.form.password})
            .then(( {data: user }) => {
              this.sucesso = `${user.email}` + ` ` + ` criado com sucesso`
              this.loading = false;
              this.getUsers();
              return db
                  .doc(user.email)
                  .set({
                    nome: this.name,
                    email: this.form.emailUser,
                    criado: data,
                    role:'admin'
                  });

            })
            .catch( error => {
              this.error = error
              this.loading = false;
            });
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
    },
    getUsers(){
      // eslint-disable-next-line no-unused-vars
      const db = firebase.firestore().collection("administradores")
          .where("role", "==", 'admin')
          .get()
          .then((querySnapshot) =>{
            querySnapshot.forEach((doc) => {
              this.userList.push(doc.data().nome)
              this.userListArray.push(doc.data())
            });
          })
          .catch(function(error) {
            console.error("Error getting documents: ", error);
          });
    }
  },
  computed:{
    ...mapGetters({
      user: "user"
    })
  },
  created() {
    if (this.user.data == null){
      this.$router.replace({
        name: "Home"
      });
    }
    this.getUsers()
  }
};
</script>

<style scoped>

</style>
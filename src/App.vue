<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components:{
  }

}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@500&display=swap');
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

</style>

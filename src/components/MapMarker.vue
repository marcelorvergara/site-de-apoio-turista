
<script>
export default {
  name: "MapMarker",
  created() {

  },
  props:{
    loc:Array
  },
  data:()=>({
    marker:null
  }),
  mounted() {
    for (let local of this.loc){
      this.$parent.getMap(map => {
        this.marker = new window.google.maps.Marker({
          position:local,
          map: map
        })
      })
    }

  },
  beforeDestroy() {
    this.marker.setMap(null)
    window.google.maps.event.clearInstanceListeners(this.marker)
  },
  render() {
    return null
  }
}
</script>

<style scoped>

</style>
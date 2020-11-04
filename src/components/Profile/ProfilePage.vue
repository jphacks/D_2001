<template>
  <div>
    <CustomHeader/>
    <b-container id="contents-container">
      <div v-text="userName" class="h1"></div>
    </b-container>
  </div>
</template>

<script>
import CustomHeader from '../CustomHeader'

export default {
  name: 'ProfilePage',
  components: {
    CustomHeader,
  },
  data: function(){
    return{
      userName: "",
    }
  },
  computed:{
    getUserID(){
      return this.$store.getters.userID
    }
  },
  mounted: async function(){
    var currentUser = await CustomHeader.data().currentuser
    this.getUserName(currentUser)
  },
  methods: {
    getUserName: function(currentUser){
      if(currentUser != null){
        if(currentUser.displayName != ""){
          this.userName = currentUser.displayName
        } else {
          this.userName = "Guest"
        }
      } else {
        console.log("user not found")
      }
    }
  },
}
</script>
<template>
  <div id="app">
    <router-view/>

  </div>
</template>

<script>
export default {
  name: 'App',

  // created() {
  //   //api server route + api path(andrew) > 'https://vue-course-api.hexschool.io/api/andrew/products'
  //   console.log(process.env.API_PATH, process.env.CUSTOM_PATH);
  //   const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`;
  //   this.$http.get(api).then((response) => {
  //     //console.log(response.data);
  //   });
  // }
}
</script>

<style lang="scss">
  @import "./assets/all.scss";

</style>

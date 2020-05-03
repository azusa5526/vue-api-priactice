<template>
  <div>
    <!-- vue-loading-overlay -->
    <loading :active.sync="isLoading"></loading>

    <table class="table mt-4">
      <thead>
        <tr>
          <th width="150">購買時間</th>
          <th>Email</th>
          <th>購買物品</th>
          <th width="130">應付金額</th>
          <th width="130">是否付款</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in orders" :key="item.id">
          <td>{{item.create_at | timestampToDate}}</td>
          <td>{{item.user.email}}</td>
          <td>
            <!-- https://stackoverflow.com/questions/1027354/i-need-an-unordered-list-without-any-bullets -->
            <ul class="list-unstyled">
              <li v-for="(product, id) in item.products" :key="id">
                {{product.product.title}} / {{product.qty}} {{product.product.unit}}
              </li>
            </ul>
          </td>
          <!-- to be fix -->
          <td class="text-right">{{item.total}}</td>
          <td>
            <span class="text-success" v-if="item.is_paid">已付款</span>
            <span class="text-danger" v-else>未付款</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- BS pagination -->
    <Pagination :pagination="pagination" @changePage="getOrders"></Pagination>

  </div>
</template>

<script>
import $ from "jquery";
import Pagination from "../Pagination";

export default {
  components: {
    Pagination
  },

  data() {
    return {
      orders: [],
      tempProduct: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false
      },
      pagination: {}
    };
  },

  methods: {
    getOrders(page = 1) {
      //default page 1
      //console.log(process.env.API_PATH, process.env.CUSTOM_PATH);
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true;

      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
      });
    },

  },

  created() {
    this.getOrders();
  }
};
</script>
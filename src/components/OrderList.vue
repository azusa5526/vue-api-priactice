<template>
  <div>
    <!-- vue-loading-overlay -->
    <loading :active.sync="isLoading"></loading>

    <table class="table mt-4">
      <thead>
        <tr>
          <th width="130">購買時間</th>
          <th>Email</th>
          <th>購買物品</th>
          <th width="80">數量</th>
          <th width="130">應付金額</th>
          <th width="130">是否付款</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in orderList" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price | currency}}</td>
          <td class="text-right">{{item.price | currency}}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span class="text-danger" v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
            <button
              class="btn btn btn-outline-danger btn-sm"
              @click="openDeleteProductModal(item)"
            >刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- BS pagination -->
    <Pagination :pagination="pagination" @changePage="getOrderLsit"></Pagination>

  </div>
</template>

<script>
import $ from "jquery";
import Pagination from "./Pagination";

export default {
  components: {
    Pagination
  },

  data() {
    return {
      orderList: [],
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
    getOrderLsit(page = 1) {
      //default page 1
      //console.log(process.env.API_PATH, process.env.CUSTOM_PATH);
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/orders?page=:page`;
      const vm = this;
      vm.isLoading = true;

      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.orderList = response.data.orders;
        vm.pagination = response.data.pagination;
      });
    },

  },

  created() {
    this.getOrderLsit();
  }
};
</script>
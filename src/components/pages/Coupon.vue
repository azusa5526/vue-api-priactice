<template>
  <div>
    <!-- vue-loading-overlay -->
    <loading :active.sync="isLoading"></loading>

    <div class="text-right">
      <button class="btn btn-primary mt-4" @click="openModal(true)">建立新的優惠券</button>
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th width="130" class="text-center">折扣百分比</th>
          <th width="130">到期日</th>
          <th width="130">是否啟用</th>
          <th width="130">編輯</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td class="text-center">{{item.percent}}%</td>
          <td>{{item.due_date}}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span class="text-danger" v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
            <button
              class="btn btn btn-outline-danger btn-sm"
              @click="openDeleteCouponModal(item)"
            >刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- BS pagination -->
    <Pagination :pagination="pagination" @changePage="getCoupons"></Pagination>

    <!-- BS update coupon modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model="tempCoupon.title"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="category">優惠碼</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸優惠碼"
                      v-model="tempCoupon.code"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="origin_price">到期日</label>
                    <input
                      type="date"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸到期日"
                      v-model="tempCoupon.due_date"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="origin_price">折扣百分比</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入折扣百分比"
                      v-model="tempCoupon.percent"
                    />
                  </div>
                </div>

                <hr />

                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempCoupon.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- BS delete product modal -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
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
      coupons: [],
      tempCoupon: {},
      isNew: false,
      isLoading: false,
      status: {
        fileUploading: false
      },
      pagination: {}
    };
  },

  methods: {
    getCoupons(page = 1) {
      //default page 1
      //console.log(process.env.API_PATH, process.env.CUSTOM_PATH);
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;

      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
      });
    },

    openModal(isNew, item) {
      if (isNew) {
        //this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item); //避免傳參考
        this.isNew = false;
      }
      $("#couponModal").modal("show");
    },

    openDeleteCouponModal(item) {
      //console.log("delete mode");
      this.tempCoupon = Object.assign({}, item);
      $("#delCouponModal").modal("show");
    },

    updateCoupon() {
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon`;
      let httpMethod = "post";
      const vm = this;

      if (!vm.isNew) {
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }

      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        //console.log(response.data);
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons(vm.pagination.current_page); //停留頁面在修改項目的頁籤下(default page = 1)
        } else {
          $("#couponModal").modal("hide");
          vm.getCoupons(vm.pagination.current_page);
          console.log("新增優惠券失敗");
        }
      });
    },

    deleteCoupon() {
      const vm = this;
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon/${vm.tempCoupon.id}`;
      this.$http.delete(api).then(response => {
        if (response.data.success) {
          console.log(response.data);
          $("#delCouponModal").modal("hide");
          vm.getCoupons(vm.pagination.current_page);
        } else {
          $("#delCouponModal").modal("hide");
          vm.getCoupons(vm.pagination.current_page);
          console.log("刪除產品失敗");
        }
      });
    },

    uploadFile() {
      console.log(this);
      const uploadedFile = this.$refs.files.files[0];
      const vm = this;
      const formData = new FormData(); //https://developer.mozilla.org/zh-TW/docs/Web/API/FormData

      formData.append("file-to-upload", uploadedFile);
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/upload`;
      vm.status.fileUploading = true;
      this.$http
        .post(url, formData, {
          //第三個參數為物件，用來將(表單)格式改成formData的格式
          headers: {
            "Content-type": "multipart/form-data"
          }
        })
        .then(response => {
          console.log(response.data);
          vm.status.fileUploading = false;
          if (response.data.success) {
            //vm.tempCoupon.imageUrl = response.data.imageUrl;   //缺少getter, setter
            vm.$set(vm.tempCoupon, "imageUrl", response.data.imageUrl); //改用$set強制寫入綁定
          } else {
            this.$bus.$emit("message:push", response.data.message, "danger");
          }
        });
    }
  },

  created() {
    this.getCoupons();
  }
};
</script>
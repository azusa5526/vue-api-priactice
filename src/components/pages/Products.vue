<template>
  <div>
    <!-- vue-loading-overlay -->
    <loading :active.sync="isLoading"></loading>

    <div class="text-right">
      <button class="btn btn-primary mt-4" @click="openModal(true)">建立新的產品</button>
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th width="150">分類</th>
          <th>產品名稱</th>
          <th width="130">原價</th>
          <th width="130">售價</th>
          <th width="130">是否啟用</th>
          <th width="130">編輯</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in products" :key="item.id">
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
    <Pagination :pagination="pagination" @changePage="getProducts"></Pagination>

    <!-- BS update product modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    id="image"
                    placeholder="請輸入圖片連結"
                    v-model="tempProduct.imageUrl"
                  />
                </div>
                <div class="form-group">
                  <label for="customFile">
                    或 上傳圖片
                    <i class="fas fa-circle-notch fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input
                    type="file"
                    id="customFile"
                    class="form-control"
                    ref="files"
                    @change="uploadFile"
                  />
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl" alt />
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model="tempProduct.title"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      placeholder="請輸入分類"
                      v-model="tempProduct.category"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="unit"
                      placeholder="請輸入單位"
                      v-model="tempProduct.unit"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="origin_price"
                      placeholder="請輸入原價"
                      v-model="tempProduct.origin_price"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="請輸入售價"
                      v-model="tempProduct.price"
                    />
                  </div>
                </div>
                <hr />

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="description"
                    placeholder="請輸入產品描述"
                    v-model="tempProduct.description"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="請輸入產品說明內容"
                    v-model="tempProduct.content"
                  ></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempProduct.is_enabled"
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
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- BS delete product modal -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">確認刪除</button>
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
      products: [],
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
    getProducts(page = 1) {
      //default page 1
      //console.log(process.env.API_PATH, process.env.CUSTOM_PATH);
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products?page=${page}`;
      const vm = this;
      vm.isLoading = true;

      this.$http.get(api).then(response => {
        //console.log(response.data);
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
      });
    },

    openModal(isNew, item) {
      if (isNew) {
        // this.tempProduct = {};
        this.isNew = true;
      } else {
        this.tempProduct = Object.assign({}, item); //避免傳參考
        this.isNew = false;
      }
      $("#productModal").modal("show");
    },

    openDeleteProductModal(item) {
      //console.log("delete mode");
      this.tempProduct = Object.assign({}, item);
      $("#delProductModal").modal("show");
    },

    updateProduct() {
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product`;
      let httpMethod = "post";
      const vm = this;

      if (!vm.isNew) {
        api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = "put";
      }

      this.$http[httpMethod](api, { data: vm.tempProduct }).then(response => {
        //console.log(response.data);
        if (response.data.success) {
          $("#productModal").modal("hide");
          vm.getProducts(vm.pagination.current_page); //停留頁面在修改項目的頁籤下(default page = 1)
        } else {
          $("#productModal").modal("hide");
          vm.getProducts(vm.pagination.current_page);
          console.log("新增產品失敗");
        }
      });
    },

    deleteProduct() {
      const vm = this;
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product/${vm.tempProduct.id}`;
      this.$http.delete(api).then(response => {
        if (response.data.success) {
          console.log(response.data);
          $("#delProductModal").modal("hide");
          vm.getProducts(vm.pagination.current_page);
        } else {
          $("#delProductModal").modal("hide");
          vm.getProducts(vm.pagination.current_page);
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
            //vm.tempProduct.imageUrl = response.data.imageUrl;   //缺少getter, setter
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl); //改用$set強制寫入綁定
          } else {
            this.$bus.$emit("message:push", response.data.message, "danger");
          }
        });
    }
  },

  created() {
    this.getProducts();
  }
};
</script>
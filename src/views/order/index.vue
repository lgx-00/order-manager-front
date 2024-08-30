<script lang="ts" setup>
import { reactive, ref, watch, watchEffect } from "vue";
import {
  ElMessage,
  ElMessageBox,
  ElMessageBoxOptions,
  type FormInstance,
  type FormRules,
  InputInstance
} from "element-plus";
import { CirclePlus, Delete, Download, Edit, Refresh, RefreshRight, Search } from "@element-plus/icons-vue";
import { usePagination } from "@/hooks/usePagination";
import { cloneDeep } from "lodash-es";
import { BaseData, CreateOrUpdateOrderRequestData, OrderData } from "@/api/order/types/order";
import { createOrderDataApi, deleteOrderDataApi, getOrderDataApi, updateOrderDataApi } from "@/api/order";
import { formatDateTime } from "@/utils";
import { getPlatformDataApi } from "@/api/third-platform";
import { getTagDataApi } from "@/api/tech-tag";

defineOptions({
  // 命名当前组件
  name: "Order"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

const temp = reactive({
  queryOrderDeadline: [void 0, void 0],
  queryOrderBudget: [void 0, void 0],
  queryOrderComplete: [void 0, void 0],
  orderBudget: 1
})

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateOrderRequestData = {
  customerId: 1,
  orderAppendixPath: "",
  orderBudget: 100,
  orderComplete: "",
  orderContent: "",
  orderDeadline: "",
  orderCreatedAt: "",
  orderId: 0,
  orderPayment: void 0,
  orderSource: "",
  orderSum: "",
  orderTitle: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateOrderRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateOrderRequestData> = {
  customerId: [{ required: false, trigger: "blur", message: "请输入客户编号" }],
  orderBudget: [{ required: true, trigger: "change", message: "请输入订单预算" }],
  orderComplete: [{ required: false, trigger: "blur", message: "请输入完成时间" }],
  orderContent: [{ required: true, trigger: "change", message: "请输入订单详情" }],
  orderDeadline: [{ required: false, trigger: "blur", message: "请输入截止时间" }],
  orderPayment: [{ required: false, trigger: "blur", message: "请选择支付方式" }],
  orderSource: [{ required: false, trigger: "blur", message: "请选择订单来源" }],
  orderSum: [{ required: false, trigger: "blur", message: "请输入订单交易额" }],
  orderTitle: [{ required: true, trigger: "change", message: "请输入订单标题" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.orderId === 0 ? createOrderDataApi : updateOrderDataApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getOrderData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetForm = () => {
  setTimeout(() => formRef.value?.clearValidate())
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
const dialogRef = ref<InputInstance | null>(null)
watchEffect(() => (formData.value.orderBudget = (temp.orderBudget ?? 1) * 100))
//#endregion

//#region 删
const handleDelete = (row: OrderData) => {
  ElMessageBox.confirm(`确认删除订单 ${row.orderTitle}？`, "删除订单", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  } as ElMessageBoxOptions).then(() => {
    deleteOrderDataApi(row.orderId as number).then(() => {
      ElMessage.success("删除成功")
      getOrderData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: OrderData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
  temp.orderBudget = row.orderBudget / 100
}
//#endregion

//#region 查
const baseData = reactive<BaseData>({
  tags: [],
  platforms: []
})
const tableData = ref<OrderData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  orderId: void 0,
  customerId: void 0,
  orderTitle: void 0,
  orderContent: void 0,
  orderDeadlineMin: void 0,
  orderDeadlineMax: void 0,
  orderBudgetMin: void 0,
  orderBudgetMax: void 0,
  orderPayment: void 0,
  orderSumMin: void 0,
  orderSumMax: void 0,
  orderCompleteMin: void 0,
  orderCompleteMax: void 0,
  orderStatus: void 0,
  orderSourceList: [],
  orderTag: []
})
watchEffect(() => {
  searchData.orderDeadlineMin = temp.queryOrderDeadline[0]
  searchData.orderDeadlineMax = temp.queryOrderDeadline[1]
})
watchEffect(() => {
  searchData.orderCompleteMin = temp.queryOrderComplete[0]
  searchData.orderCompleteMax = temp.queryOrderComplete[1]
})
const getOrderData = () => {
  loading.value = true
  getOrderDataApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    ...searchData
  })
    .then((data) => {
      paginationData.total = data.data.total
      tableData.value = data.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getOrderData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

getPlatformDataApi()
  .then((data) => {
    baseData.platforms = data.data
  })
  .catch(() => {
    baseData.platforms = []
  })
getTagDataApi()
  .then((data) => {
    baseData.tags = data.data
  })
  .catch(() => {
    baseData.tags = []
  })
//#endregion

const nowDatetime = ref(formatDateTime(new Date()))
setInterval(() => (nowDatetime.value = formatDateTime(new Date())), 1000)
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getOrderData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="orderId">
          <el-input v-model="searchData.orderId" placeholder="订单编号" clearable />
        </el-form-item>
        <el-form-item prop="customerId">
          <el-input v-model="searchData.customerId" placeholder="客户编号" clearable />
        </el-form-item>
        <el-form-item prop="orderTitle">
          <el-input v-model="searchData.orderTitle" placeholder="订单标题" clearable />
        </el-form-item>
        <el-form-item prop="orderContent">
          <el-input v-model="searchData.orderContent" placeholder="订单详情" clearable />
        </el-form-item>
        <el-form-item prop="orderDeadline">
          <el-date-picker
            type="daterange"
            range-separator="到"
            end-placeholder="截止日期止"
            start-placeholder="截止日期起"
            v-model="temp.queryOrderDeadline"
          />
        </el-form-item>
        <el-form-item prop="orderBudget">
          <div class="custom el-input">
            <div class="el-input__wrapper">
              <el-input v-model.number.trim="searchData.orderBudgetMin" placeholder="订单预算起" clearable />
              到
              <el-input v-model.trim.number="searchData.orderBudgetMax" placeholder="订单预算止" clearable />
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="orderComplete">
          <el-date-picker
            type="daterange"
            range-separator="到"
            end-placeholder="完成日期止"
            start-placeholder="完成日期起"
            v-model="temp.queryOrderComplete"
          />
        </el-form-item>
        <el-form-item prop="orderSum">
          <div class="custom el-input">
            <div class="el-input__wrapper">
              <el-input v-model.number.trim="searchData.orderSumMin" placeholder="订单交易额起" clearable />
              到
              <el-input v-model.trim.number="searchData.orderSumMax" placeholder="订单交易额止" clearable />
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="orderTag">
          <el-select v-model="searchData.orderTag" placeholder="订单标签" multiple clearable>
            <el-option :key="tag" :value="tag.tagId" :label="tag.tagName" v-for="tag in baseData.tags">
              {{ tag.tagName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="orderSource">
          <el-select v-model="searchData.orderSourceList" placeholder="订单来源" multiple clearable>
            <el-option
              :key="platform"
              :value="platform.platformId"
              :label="platform.platformName"
              v-for="platform in baseData.platforms"
            >
              {{ platform.platformName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增订单</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getOrderData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="orderId" label="订单编号" align="center" />
          <el-table-column prop="customerId" label="客户编号" align="center" />
          <el-table-column prop="orderTitle" label="订单标题" align="center" />
          <el-table-column prop="orderContent" label="订单详情" align="center" />
          <el-table-column prop="orderTag" label="技术标签" align="center">
            <template #default="scope">
              <el-tag class="tag" v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderBudget" label="订单预算" align="center">
            <template #default="scope">
              {{ (scope.row.orderBudget / 100).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="orderDeadline" label="订单截止日期" align="center" />
          <el-table-column prop="orderCreatedAt" label="订单创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template #default="scope">
              <el-button-group>
                <el-button type="primary" bg size="small" :icon="Edit" @click="handleUpdate(scope.row)" />
                <el-button type="danger" bg size="small" :icon="Delete" @click="handleDelete(scope.row)" />
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.orderId === 0 ? '新增订单' : '修改订单'"
      @opened="(dialogRef as InputInstance).focus()"
      @closed="resetForm"
      width="800px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="orderTitle" label="订单标题">
          <el-input ref="dialogRef" v-model="formData.orderTitle" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="orderContent" label="订单详情">
          <el-input type="textarea" :rows="5" v-model="formData.orderContent" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="orderDeadline" label="订单截止日期">
          <el-date-picker placeholder="请输入" value-format="YYYY-MM-DD" v-model="formData.orderDeadline" />
        </el-form-item>
        <el-form-item prop="orderCreatedAt" label="订单创建时间">
          <el-date-picker
            type="datetime"
            :placeholder="nowDatetime"
            v-model="formData.orderCreatedAt"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item prop="orderBudget" label="订单预算">
          <el-input-number :min="1" v-model="temp.orderBudget" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="orderTag" label="订单技术标签">
          <el-select v-model="formData.orderTag" placeholder="请选择" multiple clearable>
            <el-option v-for="tag in baseData.tags" :value="tag.tagId" :label="tag.tagName" :key="tag" />
          </el-select>
        </el-form-item>
        <el-form-item prop="orderSource" label="订单来源">
          <el-select v-model="formData.orderSource" placeholder="请选择" clearable>
            <el-option
              :key="platform"
              :value="platform.platformId"
              :label="platform.platformName"
              v-for="platform in baseData.platforms"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
  .el-input:not(.custom) {
    width: 180px;
  }
  .custom.el-input .el-input__wrapper {
    padding-left: 3px;
    padding-right: 3px;
    .el-input {
      padding-left: 10px;
      width: 130px;
    }
    :deep(.el-input__wrapper) {
      box-shadow: none !important;
    }
  }
  .el-select {
    width: 240px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
  .tag:not(:last-of-type) {
    margin-right: 5px;
  }
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>

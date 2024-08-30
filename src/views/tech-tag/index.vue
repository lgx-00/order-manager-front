<script lang="ts" setup>
import { ref } from "vue"
import {
  ElMessage,
  ElMessageBox,
  ElMessageBoxOptions,
  type FormInstance,
  type FormRules,
  InputInstance
} from "element-plus"
import { CirclePlus, Delete, Edit, RefreshRight } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"
import { CreateOrUpdateTagRequestData, TagData } from "@/api/tech-tag/types/tag"
import { createTagDataApi, deleteTagDataApi, getTagDataApi, updateTagDataApi } from "@/api/tech-tag"

defineOptions({
  // 命名当前组件
  name: "TechTag"
})

const loading = ref<boolean>(false)

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateTagRequestData = {
  tagId: 0,
  tagName: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateTagRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateTagRequestData> = {
  tagName: [{ required: true, trigger: "change", message: "请输入标签名称" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.tagId === 0 ? createTagDataApi : updateTagDataApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTagData()
      })
      .finally(() => {
        loading.value = false
      })
  })
  return false
}
const resetForm = () => {
  setTimeout(() => formRef.value?.clearValidate())
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
const dialogRef = ref<InputInstance | null>(null)
//#endregion

//#region 删
const handleDelete = (row: TagData) => {
  ElMessageBox.confirm(`确认删除技术标签 ${row.tagName}？`, "删除标签", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  } as ElMessageBoxOptions).then(() => {
    deleteTagDataApi(row.tagId as number).then(() => {
      ElMessage.success("删除成功")
      getTagData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: TagData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<TagData[]>([])
const getTagData = () => {
  loading.value = true
  getTagDataApi()
    .then((data) => {
      tableData.value = data.data
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion

setTimeout(() => getTagData())
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增标签</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTagData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="tagId" label="标签编号" width="300" align="center" />
          <el-table-column prop="tagName" label="标签名称" align="center">
            <template #default="scope">
              <el-tag>{{ scope.row.tagName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">
              <el-button-group>
                <el-button type="primary" bg size="small" :icon="Edit" @click="handleUpdate(scope.row)"></el-button>
                <el-button type="danger" bg size="small" :icon="Delete" @click="handleDelete(scope.row)"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.tagId === 0 ? '新增技术标签' : '修改技术标签'"
      @opened="(dialogRef as InputInstance).focus()"
      @closed="resetForm"
      width="500px"
    >
      <el-form ref="formRef" @submit.prevent="handleCreateOrUpdate" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="orderTitle" label="标签名称">
          <el-input ref="dialogRef" maxlength="32" v-model.trim="formData.tagName" placeholder="请输入" />
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
  .el-input {
    width: 200px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <el-card style="margin-top: 10px;">
    <!-- 面包屑 -->
    <div style="margin-bottom: 20px;font-size: large;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>账号管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="table-wrapper">
      <el-card>
        <el-row>
          <el-col :span="12">
            <el-button v-if="hasAction('新增子账号')" size="large" @click="AddAccount()">新增子账号</el-button>
            <!-- 新增对话框 -->
            <el-dialog v-model="dialogVisible" :title="title" width="500">
              <span>
                <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="ruleForm.mobile" />
                  </el-form-item>
                  <el-form-item label="账户名" prop="userName">
                    <el-input v-model="ruleForm.userName" />
                  </el-form-item>
                  <el-form-item label="姓名" prop="nickName">
                    <el-input v-model="ruleForm.nickName" />
                  </el-form-item>
                  <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="ruleForm.gender">
                      <el-radio :value="0">男</el-radio>
                      <el-radio :value="1">女</el-radio>
                      <el-radio :value="2">保密</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" />
                  </el-form-item>
                  <el-form-item label="是否启用" prop="status">
                    <el-radio-group v-model="ruleForm.status">
                      <el-radio :value="0">启用</el-radio>
                      <el-radio :value="1">禁用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="自定义角色" required>
                    <span v-if="selectedRoles.length">{{selectedRoles.map(r => r.roleName).join('，')}}</span>
                    <span style="color: #409EFF; cursor: pointer;" @click="openRoleDialog">
                      选择角色
                    </span>
                  </el-form-item>
                </el-form>
              </span>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="resetForm(ruleFormRef)">取消</el-button>
                  <el-button type="primary" @click="submitForm(ruleFormRef)">
                    确定
                  </el-button>
                </div>
              </template>
            </el-dialog>
            <!-- 选择角色弹框 -->
            <el-dialog v-model="roleDialogVisible" title="选择角色" width="500">
              <span>
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-input v-model="formInline.roleName" placeholder="请输入角色名" clearable />
                  <el-form-item>
                    <el-button type="primary" @click="getRoleList">查询</el-button>
                  </el-form-item>
                </el-form>
                <el-table :data="RoleData" class="role-table" @selection-change="handleRoleSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="roleName" label="角色名称" align="center" />
                  <el-table-column label="操作" align="center">
                  </el-table-column>
                </el-table>
              </span>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="confirmRole">
                    确定
                  </el-button>
                </div>
              </template>
            </el-dialog>
            <!-- 全部角色 -->
            <el-dropdown style="margin-left: 20px;" @command="handleRoleFilterChange">
              <span class="el-dropdown-link">
                {{ selectedRoleName || '全部角色' }}
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="0">全部角色</el-dropdown-item>
                  <el-dropdown-item v-for="role in RoleData" :key="role.id" :command="role.id">
                    {{ role.roleName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-dropdown @command="handleSearchTypeChange">
              <span class="el-dropdown-link">
                {{ searchType === 'mobile' ? '手机号' : '姓名' }}
                <el-icon class="el-icon--right">
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="mobile">手机号</el-dropdown-item>
                  <el-dropdown-item command="nickName">姓名</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-input 
            v-model="searchInput" :placeholder="searchType === 'mobile' ? '请输入手机号' : '请输入姓名'"
              style="width: 200px; margin-left: 10px;" clearable />
            <el-button type="primary" style="margin-left: 10px;" @click="handleSearch">查询</el-button>
          </el-col>
        </el-row>
        <!-- 显示用户表格 -->
        <el-card style="margin-top: 20px;">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="mobile" label="手机号" align="center" />
            <el-table-column prop="nickName" label="姓名" align="center" />
            <el-table-column prop="roleName" label="角色名称" align="center" />
            <el-table-column prop="creationTime" label="创建时间" align="center">
              <template #default="scope">
                <div>{{ moment(scope.row.creationTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="核销通知权限" align="center">
              <template #default="scope">
                <span>
                  {{ getWriteoffDisplay(scope.row.writeoffConfig) }}
                </span>
                <span 
                v-if="hasAction('编辑核销通知权限')" style="color: #409EFF; cursor: pointer; margin-left: 8px;"
                  @click="Writeoff(scope.row)">编辑核销通知权限</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <span 
                v-if="hasAction('编辑')" style="color: #409EFF; cursor: pointer;"
                  @click="handleEdit(scope.row)">编辑</span>&nbsp;&nbsp;
                <span 
                v-if="hasAction('权限明细')" style="color: #409EFF; cursor: pointer;"
                  @click="handlePermission(scope.row)">权限明细</span>&nbsp;&nbsp;
                <span 
                v-if="hasAction('删除')" style="color: #409EFF; cursor: pointer;"
                  @click="handleDelete(scope.row.id)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 权限明细 -->
        <el-dialog v-model="permissionDialogVisible" title="权限明细" width="800">
          <div v-if="permissionDetail && permissionDetail.length">
            <PermissionNode v-for="(item, index) in permissionDetail" :key="index" :node="item" />
          </div>
          <template #footer>
            <el-button @click="permissionDialogVisible = false">关闭</el-button>
          </template>
        </el-dialog>
        <!--核销通知权限-->
        <el-dialog v-model="writeoffDialogVisible" title="核销通知权限" width="800">
          <el-form ref="writeoffFormRef" :model="writeoffForm" label-width="80px">
            <el-form-item label="商品：" prop="productType">
              <el-radio-group v-model="writeoffForm.productType">
                <el-radio :label="0">全部商品分类</el-radio>
                <el-radio :label="1">部分商品分类</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="writeoffForm.productType === 1" required>
              <el-checkbox-group v-model="writeoffForm.productCategories">
                <el-checkbox v-for="item in productCategoryOptions" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
              <div v-if="productCategoryError" style="color: red; font-size: 12px;">请选择至少一个商品分类</div>
            </el-form-item>
            <el-form-item label="优惠券：" prop="couponType">
              <el-radio-group v-model="writeoffForm.couponType">
                <el-radio :label="0">全部优惠券</el-radio>
                <el-radio :label="1">部分优惠券</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="writeoffForm.couponType === 1" required>
              <el-checkbox-group v-model="writeoffForm.couponCategories">
                <el-checkbox v-for="item in couponCategoryOptions" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
              <div v-if="couponCategoryError" style="color: red; font-size: 12px;">请选择至少一种优惠券类型</div>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="writeoffDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleWriteoffConfirm">确定</el-button>
          </template>
        </el-dialog>
        <!-- 分页 -->
        <el-card>
          <table>
            <tbody>
              <tr>
                <td><el-pagination 
                  v-model:current-page="page.PageIndex" v-model:page-size="page.PageSize"
                    :page-sizes="[10, 20, 30, 40]" :background="true" layout="total,slot, sizes"
                    :total="page.totleCount" prev-text="上一页" next-text="下一页">
                    ,每页{{ page.PageSize }}条,当前{{ page.PageIndex }}/{{ page.totlePage }}页
                  </el-pagination></td>
                <td><el-pagination 
                  v-model:current-page="page.PageIndex" v-model:page-size="page.PageSize"
                    :page-sizes="[10, 20, 30, 40]" :background="true" layout="slot, prev, pager, next"
                    :total="page.totleCount" prev-text="上一页" next-text="下一页">
                    <el-button :disabled="page.PageIndex == 1" @click="page.PageIndex = 1">首页</el-button>
                  </el-pagination></td>
                <td><el-pagination 
                  v-model:current-page="page.PageIndex" v-model:page-size="page.PageSize"
                    :page-sizes="[10, 20, 30, 40]" :background="true" layout="slot, jumper" :total="page.totleCount"
                    prev-text="上一页" next-text="下一页">
                    <el-button 
                    :disabled="page.PageIndex == page.totlePage"
                      @click="page.PageIndex = page.totlePage">尾页</el-button>
                  </el-pagination></td>
              </tr>
            </tbody>
          </table>
        </el-card>
      </el-card>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import PermissionNode from './PermissionNode.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import RoleAPI from '@/api/Setting/role.api'
import AccountAPI from '@/api/Setting/account.api'
import moment from 'moment'
const writeoffDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const permissionDetail = ref<any>([])
const dialogVisible = ref(false)
const roleDialogVisible = ref(false)
const selectedRoles = ref<{ id: number; roleName: string }[]>([]); // 存储多选结果
//const roleSearch = ref('')

//#region 操作权限
import { useMenuStore } from '@/store';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const menuStore = useMenuStore();
const route = useRoute();
const actions = computed(() => menuStore.getActionsByPath(route.path));
console.log("actions", actions.value)
function hasAction(actionName: string) {
  return actions.value.some(a => a.name === actionName);
}
//#endregion

const tableData = ref([{
  "nickName": "王五",
  "mobile": "15874512023",
  "roleId": "8c320aab-f890-5d58-0905-3a1ab80e512e",
  "roleName": "员工",
  "isDeleted": false,
  "deleterId": null,
  "deletionTime": null,
  "lastModificationTime": null,
  "lastModifierId": null,
  "creationTime": "2025-06-25T21:29:19.297345",
  "creatorId": null,
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}])
const formInline = ref({
  roleName: '',
  id: ''
})
//文档就绪函数
onMounted(() => {
  getRoleList()
  getAccountList()
  selectedRoleName.value = '全部角色'
  console.log('当前路由path:', route.path)
  console.log('actions:', actions.value)
  console.log('菜单:', menuStore.menuList)
})
//#region 角色列表
const RoleData = ref([{
  id: 0,
  roleName: ''
}])
const page = reactive({
  PageIndex: 1,
  PageSize: 10,
  totleCount: 0,
  totlePage: 0
})
function getRoleList() {
  const params = reactive({
    PageIndex: page.PageIndex,
    PageSize: page.PageSize,
    RoleName: formInline.value.roleName
  })
  RoleAPI.getRole(params).then(res => {
    console.log(res)
    RoleData.value = res.data
    console.log("角色", RoleData.value)
  })
}
//#endregion

//#region 添加修改子账号
interface RuleForm {
  mobile: string
  nickName: string
  userName: string
  email: string
  gender: number
  status: number
  roleIds: any[] // Modified from [] to any[] to resolve type error
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  mobile: '',
  nickName: '',
  userName: '',
  email: '',
  gender: 0,
  status: 0,
  roleIds: [],
})
//表单验证
const rules = reactive<FormRules<RuleForm>>({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式',
      trigger: 'blur'
    }
  ],
  nickName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
  userName: [
    { required: true, message: '请输入账号名', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change',
    },
  ],
  roleIds: [
    {
      type: 'array',
      required: true,
      message: '此项必填',
      trigger: 'change',
    },
  ],
})

//#region 编辑
const currentrow = ref()
function handleEdit(row: any) {
  console.log("编辑", row)
  currentrow.value = row.id
  dialogVisible.value = true
  title.value = "编辑账号"
  ruleForm.email = row.email
  ruleForm.userName = row.userName
  ruleForm.nickName = row.nickName
  ruleForm.mobile = row.mobile
  ruleForm.status = row.status
  ruleForm.gender = row.gender
  const setRole = () => {
    if (Array.isArray(row.roleIds) && row.roleIds.length > 0) {
      ruleForm.roleIds = row.roleIds
      selectedRoles.value = RoleData.value.filter(role =>
        row.roleIds.map(String).includes(String(role.id))
      )
    } else if (row.roleId) {
      ruleForm.roleIds = [row.roleId]
      selectedRoles.value = RoleData.value.filter(role =>
        String(role.id) === String(row.roleId)
      )
    } else {
      ruleForm.roleIds = []
      selectedRoles.value = []
    }
  }

  if (RoleData.value && RoleData.value.length > 0) {
    setRole()
  } else {
    getRoleList()
    setTimeout(setRole, 300)
  }
}
//#endregion

//添加弹框
const title = ref('添加子账号')
function AddAccount() {
  dialogVisible.value = true
  title.value = '添加子账号'
  // 自动重置表单内容
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields()
  }
  // 手动重置表单数据（防止ref未挂载时）
  ruleForm.mobile = ''
  ruleForm.nickName = ''
  ruleForm.userName = ''
  ruleForm.email = ''
  ruleForm.gender = 0
  ruleForm.status = 0
  ruleForm.roleIds = []
  selectedRoles.value = []
}
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', valid)
      if (title.value === '添加子账号') {
        AccountAPI.addAccount(ruleForm).then(res => {
          console.log("添加", res)
          ElMessage.success('添加成功')
          dialogVisible.value = false
        })
      }
      else {
        AccountAPI.updateAccount(currentrow.value, ruleForm).then(res => {
          console.log("修改", res)
          ElMessage.success('修改成功')
          dialogVisible.value = false
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 表单重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

//选择角色弹框按钮
function openRoleDialog() {
  roleDialogVisible.value = true
  selectedRoles.value = []
}
// 监听多选
function handleRoleSelectionChange(val: any) {
  console.log("val", val)
  selectedRoles.value = val
}
// 确认选择
function confirmRole() {
  // 这里可以把选中的角色id赋值到 ruleForm.roleIds
  ruleForm.roleIds = selectedRoles.value.map(item => item.id)
  roleDialogVisible.value = false
}

//#endregion

//#region 显示用户列表及角色选择框及手机姓名查询
//查询角色
const selectedRoleName = ref('') // 当前选中的角色名
function handleRoleFilterChange(roleId: null) {
  if (roleId === 0) {
    SearchData.value.RoleId = null
    selectedRoleName.value = '全部角色'
  } else {
    SearchData.value.RoleId = roleId
    // 找到选中的角色名
    const role = tableData.value.find((r: any) => r.id === roleId)
    selectedRoleName.value = role ? role.roleName : ''
  }
  getAccountList()
}
//下拉框数据
const searchType = ref<'mobile' | 'nickName'>('mobile') // 默认手机号
const searchInput = ref('') // 输入框内容
//下拉切换和查询方法
function handleSearchTypeChange(type: 'mobile' | 'nickName') {
  searchType.value = type
  searchInput.value = ''
}
function handleSearch() {
  if (searchType.value === 'mobile') {
    SearchData.value.Mobile = searchInput.value
    SearchData.value.NickName = ''
  } else {
    SearchData.value.Mobile = ''
    SearchData.value.NickName = searchInput.value
  }
  getAccountList()
}
//显示用户表格
const SearchData = ref({
  Mobile: '',
  RoleId: null,
  NickName: ''
})

//获取用户列表
async function getAccountList() {
  const params = reactive({
    PageIndex: page.PageIndex,
    PageSize: page.PageSize,
    Mobile: SearchData.value.Mobile,
    NickName: SearchData.value.NickName,
    RoleId: SearchData.value.RoleId
  })
  const res:any=await AccountAPI.getAccountList(params)
    tableData.value = res.data
    page.totleCount = res.totleCount
    page.totlePage = res.totlePage
    console.log("user", res.data)
  
}

watch(page, () => {
  getAccountList()
})

//#endregion

//#region 删除
function handleDelete(id: any) {
  ElMessageBox.confirm(
    '删除子账号后，该账号将无法登录该酒店后台并隐藏酒店后台入口?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      AccountAPI.deleteAccount(id).then(res => {
        console.log("删除", res)
        ElMessage.success("删除成功")
        getAccountList()
      })
    })
}
//#endregion

//#region 权限明细
function handlePermission(row: any) {
  console.log("权限明细", row)
  const params = reactive({
    roleid: row.roleId
  })
  RoleAPI.getPermissionByRoleId(params).then(res => {
    console.log("权限明细", res)
    permissionDetail.value = res
    console.log("aa", permissionDetail.value)
    permissionDialogVisible.value = true
  })
}

//#endregion

//#region 核销通知权限

// 商品和优惠券选项
const productCategoryOptions = [
  { label: '默认分类', value: '默认分类' }
]
const couponCategoryOptions = [
  { label: '代金券', value: '代金券' },
  { label: '折扣券', value: '折扣券' },
  { label: '兑换券', value: '兑换券' }
]
const writeoffForm = reactive({
  productType: 0,
  productCategories: [] as string[],
  couponType: 0,
  couponCategories: [] as string[]
})
const productCategoryError = ref(false)
const couponCategoryError = ref(false)
const currentWriteoffRow = ref<any>(null)

// 打开弹框，带入当前行数据
function Writeoff(row: any) {
  currentWriteoffRow.value = row
  Object.assign(writeoffForm, row.writeoffConfig || {
    productType: 0,
    productCategories: [],
    couponType: 0,
    couponCategories: []
  })
  productCategoryError.value = false
  couponCategoryError.value = false
  writeoffDialogVisible.value = true
}

// 确认保存
function handleWriteoffConfirm() {
  productCategoryError.value = writeoffForm.productType === 1 && writeoffForm.productCategories.length === 0
  couponCategoryError.value = writeoffForm.couponType === 1 && writeoffForm.couponCategories.length === 0
  if (productCategoryError.value || couponCategoryError.value) return

  // 保存到当前行
  if (currentWriteoffRow.value) {
    currentWriteoffRow.value.writeoffConfig = JSON.parse(JSON.stringify(writeoffForm))
  }
  writeoffDialogVisible.value = false
}

// 显示内容
function getWriteoffDisplay(config: any) {
  if (!config) return '全部商品分类；全部优惠券；'
  const productStr = config.productType === 0
    ? '全部商品分类'
    : (config.productCategories || []).join('，')
  const couponStr = config.couponType === 0
    ? '全部优惠券'
    : (config.couponCategories || []).join('，')
  return `${productStr}；${couponStr}；`
}
//#endregion
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.role-input {
  width: 200px;
  padding: 6px 8px;
}

.role-table {
  width: 400px;
  border-collapse: collapse;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
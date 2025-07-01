<template>
  <el-card style="margin-top: 10px;">
    <!-- 面包屑 -->
    <div style="margin-bottom: 20px;font-size: large;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-button @click="handleAddRole">添加角色</el-button>
          <el-button :disabled="disabled" @click="delRange()"  >批量删除</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-form :inline="true" :model="SearchData" class="demo-form-inline">
            <el-form-item label=" ">
              <el-input v-model="SearchData.RoleName" placeholder="请输入角色名称" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getRole()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加角色弹框 -->
    <el-dialog v-model="dialogVisible" :title="title">
      <el-form ref="ruleFormRef" style="max-width: 600px" :rules="rules" :model="ruleForm" label-width="auto">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色权限" prop="permissionIds">
          <el-tree 
          ref="treeRef" :data="treeData" show-checkbox node-key="id" :props="treeProps"
            :default-checked-keys="ruleForm.permissionIds" :check-strictly="true" @check="onTreeCheck" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 显示角色 -->
    <el-card style="margin-top: 10px;">
      <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleRoleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="roleName" label="角色" align="center" />
        <el-table-column prop="creationTime" label="创建时间" align="center">
          <template #default="scope">
            <div>{{ moment(scope.row.creationTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template #default="scope">
            <span style="color: #409EFF; cursor: pointer;" @click="handleUpdRole(scope.row)">编辑</span>&nbsp;&nbsp;
            <span style="color: #409EFF; cursor: pointer;" @click="handleDeleteRole(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页控件 -->
      <div style="margin: 20px 0; text-align: right;">
        <el-pagination v-model:current-page="page.PageIndex" v-model:page-size="page.PageSize"
          :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
          :total="page.totleCount" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
      </div>
    </el-card>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import moment from 'moment'
import type { FormInstance, FormRules } from 'element-plus'
import RoleAPI from '@/api/Setting/role.api'
const dialogVisible = ref(false)
const disabled = ref(true)
const title = ref('添加角色')
const SearchData = reactive({
  RoleName: ''
})
onMounted(() => {
  getTree()
  getRole()
})
//#region 角色权限
function getTree() {
  RoleAPI.getPermissionTree().then((res) => {
    console.log(res)
    treeData.value = res
    console.log("树", treeData.value)
  })
}
const treeData = ref<any>([])
const treeProps = {
  label: 'permissionName',
  children: 'children'
}
const treeRef = ref();
// el-tree 勾选事件，确保选中子节点时父节点 id 也会被加入
function onTreeCheck() {
  // 1. 获取所有被勾选的节点 id（只包括你实际勾选的节点）
  const checkedKeys = treeRef.value.getCheckedKeys();

  // 2. 用 Set 去重，初始只包含所有被勾选的节点 id
  const allIds = new Set(checkedKeys);

  // 3. 遍历每个被勾选的节点，递归查找并加入所有父节点 id
  checkedKeys.forEach((id: any) => {
    // 查找当前节点的所有父节点 id
    const parentIds = findParentIds(treeData.value, id);
    // 把所有父节点 id 加入 Set，自动去重
    parentIds.forEach((pid: any) => allIds.add(pid));
  });

  // 4. 最终赋值给表单，包含所有被勾选节点及其所有父节点 id
  ruleForm.permissionIds = Array.from(allIds);
}

/**
 * 递归查找某个 id 的所有父节点 id
 * @param tree 整个权限树（数组）
 * @param id   当前要查找父节点的子节点 id
 * @param parentIds 递归用，存放所有父节点 id
 * @returns 包含所有父节点 id 的数组
 */
function findParentIds(tree: any[], id: any, parentIds: any[] = []) {
  for (const node of tree) {
    // 如果当前节点有子节点
    if (node.children && node.children.length > 0) {
      // 如果当前节点的子节点中有目标 id
      if (node.children.some((child: any) => child.id === id)) {
        // 当前节点就是目标 id 的父节点，加入 parentIds
        parentIds.push(node.id);
        // 递归查找当前节点的父节点
        findParentIds(tree, node.id, parentIds);
      } else {
        // 递归查找子节点
        findParentIds(node.children, id, parentIds);
      }
    }
  }
  return parentIds;
}
//#endregion

//#region 添加角色
//添加角色弹框
function handleAddRole() {
  dialogVisible.value = true
  title.value = '添加角色'
  // 自动重置表单内容
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields()
  }
}
interface RuleForm {
  roleName: string
  permissionIds: any[]
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  roleName: '',
  permissionIds: []
})
// 表单验证规则
const rules = reactive<FormRules<RuleForm>>({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
  ],
  // permissionIds: [
  //   { type: 'array', required: true, message: '至少要选择一项权限', trigger: 'change' }
  // ]
})
//添加修改
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (title.value === '添加角色') {
        console.log("权限", ruleForm.permissionIds);
        RoleAPI.addRole(ruleForm)
          .then(res => {
            console.log(res)
            ElMessage.success('添加成功')
            dialogVisible.value = false
          })
      }
      else {
        RoleAPI.updateRole(currentrow.value, ruleForm).then(res => {
          console.log(res)
          ElMessage.success('修改成功')
          getRole()
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

//重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
//#endregion

//#region 显示角色
const tableData = ref<any>([])
const page = reactive({
  PageIndex: 1,
  PageSize: 10,
  totleCount: 0,
  totlePage: 0
})
const params = reactive({
  PageIndex: page.PageIndex,
  PageSize: page.PageSize,
  RoleName: SearchData.RoleName
})
function getRole() {
  // 保证每次请求参数都是最新的
  params.PageIndex = page.PageIndex
  params.PageSize = page.PageSize
  params.RoleName = SearchData.RoleName
  RoleAPI.getRole(params).then(res => {
    // 适配后端返回结构
    tableData.value = res.data
    page.totleCount = res.totleCount
    page.totlePage = res.totlePage
  })
}
function handleCurrentChange(val: number) {
  page.PageIndex = val
  getRole()
}
function handleSizeChange(val: number) {
  page.PageSize = val
  page.PageIndex = 1
  getRole()
}
//#endregion

//#region 删除角色
function handleDeleteRole(row: any) {
  ElMessageBox.confirm(
    '确认删除吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      RoleAPI.deleteRole(row.id).then(res => {
        console.log(res)
        ElMessage.success('删除成功')
        getRole()
      })
    })

}
//#endregion

//#region 编辑角色

const currentrow = ref()
function handleUpdRole(row: any) {
  console.log("row", row)
  currentrow.value = row.id
  title.value = '编辑角色'
  dialogVisible.value = true
  ruleForm.roleName = row.roleName
  getTree()
  // 1. 获取该角色的权限ID
  const params = reactive({
    roleid: row.id
  })
  RoleAPI.getPermissionByRoleId(params).then(res => {
    console.log("权限", res)
    // res 是树形结构
    const checkedIds = collectSelectedIds(res);
    ruleForm.permissionIds = checkedIds;
    nextTick(() => {
      if (treeRef.value) {
        treeRef.value.setCheckedKeys(checkedIds);
      }
    });
  })
}
// 递归收集所有 isSelected: true 的 id
function collectSelectedIds(tree: any) {
  let ids: any = [];
  tree.forEach(node => {
    if (node.isSelected) {
      ids.push(node.id);
    }
    if (node.children && node.children.length > 0) {
      ids = ids.concat(collectSelectedIds(node.children));
    }
  });
  return ids;
}
//#endregion

//#region 批量删除角色

const selectedRoles = ref<{ id: number; roleName: string }[]>([]); // 存储多选结果
// 监听多选
function handleRoleSelectionChange(val: any) {
  console.log("val", val)
  selectedRoles.value = val
  if(selectedRoles.value.length==0)
  {
    disabled.value=true
  }
  else
  {
    disabled.value=false
  }
}

function delRange (){
  const param = reactive({
  guids: selectedRoles.value.map(item => item.id)
})
ElMessageBox.confirm(
  '确认批量删除吗?',
  '警告',
  {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }
)
  .then(() => {
    RoleAPI.deleteRange(param).then(res => {
      console.log(res)
      ElMessage.success('批量删除成功')
      getRole()
    })
  })
}



//#endregion

</script>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
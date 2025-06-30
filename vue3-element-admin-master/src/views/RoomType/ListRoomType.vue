<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="12">
          <div style="margin-bottom: 16px; align-items: center">
            <!-- 新增房号按钮 -->
            <el-button @click="openAddRoomNumDialog">新增房号</el-button>
            <el-button :disabled="multipleSelection.length === 0" @click="BatchDelete">
              删除房号
            </el-button>
            <el-button :disabled="multipleSelection.length === 0" @click="BatchUpState">
              批量上架
            </el-button>
            <el-button :disabled="multipleSelection.length === 0" @click="BatchDownState">
              批量下架
            </el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <!-- 查询条件 -->
          <div style="align-items: center; text-align: right">
            <el-input
              v-model="query.RoomNum"
              placeholder="房号"
              style="width: 180px; margin-right: 8px"
              @keyup.enter="getList"
            />
            <el-select
              v-model="query.State"
              placeholder="状态"
              style="width: 120px; margin-right: 8px"
            >
              <el-option label="全部" value="" />
              <el-option label="上架" value="true" />
              <el-option label="下架" value="false" />
            </el-select>
            <el-select
              v-model="query.RoomTypeId"
              placeholder="房型"
              style="width: 120px; margin-right: 8px"
            >
              <el-option label="全部" value="" />
              <el-option v-for="getType in getType" :label="getType.name" :value="getType.id" />
            </el-select>
            <el-button type="primary" @click="getList">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 16px">
      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="typeName" label="房型" />
        <el-table-column prop="roomNum" label="房号" />
        <el-table-column prop="order" label="排序" />
        <el-table-column prop="description" label="备注" />
        <el-table-column prop="state" label="状态">
          <template #default="scope">
            <span>{{ scope.row.state ? "上架" : "下架" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-link type="primary" @click="UpdataRoomNum(scope.row)">修改</el-link>
            <el-link type="danger" style="margin-left: 8px" @click="DeleteRoomNum(scope.row.id)">
              删除
            </el-link>
            <el-link type="primary" style="margin-left: 8px" @click="UpdataStateRoomNum(scope.row)">
              {{ scope.row.state ? "下架" : "上架" }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="query.PageIndex"
      v-model:page-size="query.PageSize"
      :total="query.totleCount"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 16px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/修改房号弹窗 -->
    <el-dialog v-model="addRoomNumDialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="addRoomNumForm" label-width="80px">
        <el-form-item label="房型" required>
          <el-select
            v-model="addRoomNumForm.roomTypeId"
            :disabled="isRoomTypeSelectDisabled"
            placeholder="房型"
            style="width: 120px; margin-right: 8px"
          >
            <el-option label="全部" value="" />
            <el-option v-for="getType in getType" :label="getType.name" :value="getType.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="房号" required>
          <el-input v-model="addRoomNumForm.roomNum" maxlength="10" />
        </el-form-item>
        <el-form-item label="排序" required>
          <el-input v-model.number="addRoomNumForm.order" type="number" min="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addRoomNumForm.description"
            maxlength="9"
            placeholder="备注不超过9个字符"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addRoomNumDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddRoomNum">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import RoomTypeAPI from "@/api/system/roomtype";
import { ElMessageBox, ElMessage } from "element-plus";

//修改状态上架下架
async function UpdataStateRoomNum(row: any) {
  const action = row.state ? "下架" : "上架";
  ElMessageBox.confirm(`确认要${action}该房号吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await RoomTypeAPI.UpdataRoomNumStateAxios(row.id, { state: !row.state }).then((res: any) => {
      if (res) {
        ElMessage.success(`${action}成功`);
        getList();
      }
    });
  });
}

//新增/修改房号表单
let numid = "";
const addRoomNumDialogVisible = ref(false);
const addRoomNumForm = reactive({
  roomTypeId: "",
  roomNum: 0,
  state: true,
  order: 0,
  description: "",
});
const isRoomTypeSelectDisabled = ref(false);
const dialogTitle = ref("新增房号");
//新增房号按钮
function openAddRoomNumDialog() {
  addRoomNumForm.roomNum = 0;
  addRoomNumForm.order = 0;
  addRoomNumForm.description = "";
  addRoomNumForm.state = true;
  addRoomNumForm.roomTypeId = "";
  addRoomNumDialogVisible.value = true;
  isRoomTypeSelectDisabled.value = false;
  dialogTitle.value = "新增房号";
}
//修改房号按钮
function UpdataRoomNum(row: any) {
  Object.assign(addRoomNumForm, row);
  if (typeof addRoomNumForm.state !== "boolean") {
    addRoomNumForm.state = true;
  }
  numid = row.id;
  addRoomNumDialogVisible.value = true;
  isRoomTypeSelectDisabled.value = true;
  dialogTitle.value = "修改房号";
}
//新增/修改房号
async function submitAddRoomNum() {
  if (!addRoomNumForm.roomNum) {
    ElMessage.error("房号不能为空");
    return;
  }
  const payload = {
    RoomTypeId: addRoomNumForm.roomTypeId,
    roomNum: addRoomNumForm.roomNum,
    state: addRoomNumForm.state,
    order: addRoomNumForm.order,
    description: addRoomNumForm.description,
  };

  if (numid != "") {
    console.log("numid", numid);
    console.log("payload", payload);

    await RoomTypeAPI.UpdataRoomNumAxios(numid, payload);

    numid = "";
  } else {
    console.log("addRoomNumForm", addRoomNumForm);
    await RoomTypeAPI.AddRoomNumAxios(payload);
  }

  addRoomNumDialogVisible.value = false;
  getList();
  ElMessage.success(numid !== "" ? "修改房号成功" : "新增房号成功");
  addRoomNumForm.roomNum = 0;
  addRoomNumForm.order = 0;
  addRoomNumForm.description = "";
  addRoomNumForm.state = true;
}
//删除房号
function DeleteRoomNum(Row: any) {
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    // 删除逻辑
    await RoomTypeAPI.DeleteRoomNumAxios(Row).then((res: any) => {
      if (res != null) {
        ElMessage.success("删除成功");
        getList();
      }
    });
  });
}

// 查询条件和分页
const query = reactive({
  PageIndex: 1,
  PageSize: 10,
  RoomTypeId: "", // 可根据实际需求加下拉选择
  State: "", // ''/true/false
  RoomNum: null,
  totleCount: 0,
  totlePage: 0,
});
const tableData = ref([]);
// 获取房号列表
async function getList() {
  await RoomTypeAPI.GetRoomNumAxios(query).then((res: any) => {
    console.log("query", res);
    if (res) {
      tableData.value = res.data;
      query.totleCount = res.totleCount;
      query.totlePage = res.totlePage;
    }
  });
}

// 分页事件
function handleSizeChange(val: number) {
  query.PageSize = val;
  query.PageIndex = 1;
  getList();
}
function handleCurrentChange(val: number) {
  query.PageIndex = val;
  getList();
}

//获取房型列表
const getType = ref([{ name: "", id: "" }]);
function getTypeList() {
  RoomTypeAPI.GetRoomTypeListAxios(query).then((res: any) => {
    console.log("typeres", res);
    getType.value = res;
  });
}

// 页面加载时自动查询
onMounted(() => {
  getList();
  getTypeList(); //房型下拉绑定
});

const multipleSelection = ref<any[]>([]);
function handleSelectionChange(val: any[]) {
  multipleSelection.value = val;
}
// 批量删除
async function BatchDelete() {
  if (multipleSelection.value.length === 0) return;
  ElMessageBox.confirm("确认批量删除选中的房号吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const ids = multipleSelection.value.map((item) => item.id);

    await RoomTypeAPI.BatchDeleteRoomNumAxios(ids).then((res: any) => {
      if (res) {
        ElMessage.success("批量删除成功");
        getList();
      }
    });
  });
}
// 批量上架
async function BatchUpState() {
  if (multipleSelection.value.length === 0) return;
  ElMessageBox.confirm("确认批量上架选中的房号吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const ids = multipleSelection.value.map((item) => item.id);
    await RoomTypeAPI.BatchUpdateRoomNumStateAxios(ids, true).then((res: any) => {
      if (res) {
        ElMessage.success("批量上架成功");
        getList();
      }
    });
  });
}
// 批量下架
async function BatchDownState() {
  if (multipleSelection.value.length === 0) return;
  ElMessageBox.confirm("确认批量下架选中的房号吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const ids = multipleSelection.value.map((item) => item.id);
    await RoomTypeAPI.BatchUpdateRoomNumStateAxios(ids, false).then((res: any) => {
      if (res) {
        ElMessage.success("批量下架成功");
        getList();
      }
    });
  });
}
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>

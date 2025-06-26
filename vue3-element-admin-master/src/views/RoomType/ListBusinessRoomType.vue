<template>
  <div style="height: 100vh; background: #f7f7fa; padding: 32px 24px">
    <div style="background: #fff; border-radius: 10px; padding: 24px">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        "
      >
        <div>
          <el-button type="primary" @click="drawerVisible = true">新增房型</el-button>
          <el-button :disabled="multipleSelection.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
        <el-input placeholder="房型名称" style="width: 200px">
          <template #append>
            <el-button icon="el-icon-search" />
          </template>
        </el-input>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="房型名称" />
        <el-table-column prop="price" label="门市价（元）" />
        <el-table-column prop="depositAmount" label="押金（元）" />
        <el-table-column prop="roomTypeCount" label="房间数量" />
        <el-table-column prop="order" label="排序">
          <template #default="scope">
            <el-input
              v-model="scope.row.order"
              size="small"
              style="width: 60px"
              @blur="saveOrder(scope.row)"
              @keyup.enter="saveOrder(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-link type="primary" @click="onEdit(scope.row)">编辑</el-link>
            <el-link type="primary" style="margin-left: 8px">设置房号</el-link>
            <el-link type="primary" style="margin-left: 8px">投放</el-link>
            <el-link type="danger" style="margin-left: 8px" @click="handleDelete(scope.row.id)">
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="Query.PageIndex"
        v-model:page-size="Query.PageSize"
        :page-sizes="[1, 3, 5, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Query.totleCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 只保留一个右侧弹出抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="房型管理-新增房型"
      direction="rtl"
      size="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="120px" style="padding: 0 24px">
        <!-- 基本信息 -->
        <div
          style="
            background: #f7f7fa;
            padding: 24px 16px 8px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
          "
        >
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 16px">基本信息</div>
          <el-form-item label="房间名称" required>
            <el-input
              v-model="form.name"
              maxlength="20"
              show-word-limit
              placeholder="房间名称"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="门市价" required>
            <el-input v-model="form.price" placeholder="￥0.00" style="width: 180px">
              <template #append>元</template>
            </el-input>
            <span style="color: #999; margin-left: 8px">前台默认销售价格</span>
          </el-form-item>
          <el-form-item label="押金">
            <el-radio-group v-model="form.depositRequired">
              <el-radio :label="false">不需要</el-radio>
              <el-radio :label="true">需要</el-radio>
            </el-radio-group>
            <el-input
              v-if="form.depositRequired"
              v-model="form.depositAmount"
              placeholder="0"
              style="width: 100px; margin-left: 8px"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="房间面积">
            <el-input v-model="form.area" placeholder="0" style="width: 100px" />
            <template #append>㎡</template>
          </el-form-item>
          <el-form-item label="可住人数">
            <el-input v-model="form.maxOccupancy" placeholder="0" style="width: 100px" />
            <template #append>人</template>
          </el-form-item>
          <el-form-item label="房型数量">
            <el-input v-model="form.roomTypeCount" placeholder="0" style="width: 100px" />
            <template #append>人</template>
          </el-form-item>
          <el-form-item label="房型排序">
            <el-input v-model="form.order" placeholder="0" style="width: 100px" />
            <template #append>人</template>
          </el-form-item>

          <el-form-item label="房型状态">
            <el-radio-group v-model="form.state">
              <el-radio :value="0" size="large">净房</el-radio>
              <el-radio :value="2" size="large">脏房</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="同住人预留数量">
            <el-switch v-model="form.obligate" />
            <span style="color: #999; margin-left: 8px">
              启用后，用户提交订单时可填写同住人，1-10之间
            </span>
          </el-form-item>
          <el-form-item label="可加床方式">
            <el-radio-group v-model="form.extraBedPolicy">
              <el-radio label="不可加床">不可加床</el-radio>
              <el-radio label="免费加床">免费加床</el-radio>
              <el-radio label="收费加床">收费加床</el-radio>
              <el-radio label="自定义">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 展示信息 -->
        <div
          style="
            background: #f7f7fa;
            padding: 24px 16px 8px 16px;
            border-radius: 8px;
            margin-bottom: 24px;
          "
        >
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 16px">展示信息</div>
          <el-form-item label="房型图片">
            <el-upload
              class="avatar-uploader"
              action="https://localhost:44384/api/FileImg"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              name="file"
            >
              <img v-if="form.imageUrl" :src="getImageUrl(form.imageUrl)" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="el-form-item__tip">
              支持jpg、jpeg、bmp、png格式，大小不超过2M，建议尺寸：750px*448px
            </div>
          </el-form-item>
          <el-form-item label="房型视频">
            <el-upload action="#" :limit="1" :auto-upload="false" list-type="picture">
              <el-button>上传视频</el-button>
            </el-upload>
            <div class="el-form-item__tip">
              最多上传一个视频，上传视频封面图片尺寸建议和房型图片保持一致：750PX*448PX
            </div>
          </el-form-item>
          <el-form-item label="房型介绍" required>
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              maxlength="1000"
              show-word-limit
              placeholder="房型介绍"
            />
          </el-form-item>
          <el-form-item label="房型标签">
            <el-tag
              v-for="tag in form.displayChannelses"
              :key="tag"
              closable
              style="margin-right: 8px"
              @close="removeTag(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-link type="primary" style="margin-left: 8px" @click="addTag()">添加</el-link>
          </el-form-item>
        </div>
        <!-- 配套服务 -->
        <div style="background: #f7f7fa; padding: 24px 16px 24px 16px; border-radius: 8px">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 16px">配套服务</div>
          <el-button type="primary" plain>添加配套服务</el-button>
        </div>
        <div style="text-align: right; margin-top: 24px">
          <el-button @click="handleDrawerClose">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </div>
      </el-form>
    </el-drawer>
    <!--  设置房型标签 -->
    <el-dialog v-model="showTagDialog" title="新增房型标签" width="400px" @close="resetTagDialog">
      <el-form :model="tagForm" label-width="100px">
        <el-form-item label="房型标签" required>
          <el-input v-model="tagForm.value" maxlength="4" placeholder="房型标签" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTagDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddTag">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import RoomTypeAPI from "@/api/system/roomtype";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
onMounted(() => {
  GetListRoomType();
});
const tableData = ref([]);
const drawerVisible = ref(false);

// 条件列表
const Query: any = reactive({
  PageIndex: 1,
  PageSize: 10,
  Name: "",
  totleCount: 0,
  totlePage: 0,
});
// 获取列表
const GetListRoomType = async () => {
  await RoomTypeAPI.GetRoomTypeAxios(Query).then((res: any) => {
    tableData.value = res.data;
    Query.totleCount = res.totleCount;
    Query.totlePage = res.totlePage;
  });
};
//分页获取页容量
const handleSizeChange = (val: number) => {
  Query.PageSize = val;
  GetListRoomType();
};
// 分页获取当前页
const handleCurrentChange = (val: number) => {
  Query.PageIndex = val;
  GetListRoomType();
};
//删除
async function handleDelete(id: any) {
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    async () => {
      // 删除逻辑
      await RoomTypeAPI.DeleteRoomTypeAxios(id).then((res: any) => {
        if (res != null) {
          ElMessage.success("删除成功");
          GetListRoomType();
        }
      });
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

let editId = "";

function onEdit(row: any) {
  // 反填当前行数据到form
  Object.assign(form, row);
  // 处理 displayChannels 字段
  if (typeof row.displayChannels === "string") {
    form.displayChannels = row.displayChannels ? row.displayChannels.split(",") : [];
  }
  editId = row.id;
  drawerVisible.value = true;
}

const form = reactive({
  name: "",
  state: 0,
  price: 0,
  depositRequired: true,
  depositAmount: 0,
  area: 0,
  maxOccupancy: 0,
  obligate: true,
  extraBedPolicy: "",
  imageUrl: "",
  videoUrl: "",
  roomTypeCount: 0,
  order: 0,
  description: "",
  displayChannelses: ["官方直营", "今日特惠", "微信优享"],
  displayChannels: "",
  facilities: "",
});
const inputTag = ref("");
// 添加标签
function addTag() {
  showTagDialog.value = true;
  if (inputTag.value && !form.displayChannelses.includes(inputTag.value)) {
    form.displayChannelses.push(inputTag.value);
    inputTag.value = "";
  }
}
// 删除标签
function removeTag(tag: string) {
  form.displayChannelses = form.displayChannelses.filter((t: string) => t !== tag);
}

async function submitForm() {
  let res: any;
  form.displayChannels = form.displayChannels.toString();
  if (editId == "") {
    console.log("form", form);

    res = await RoomTypeAPI.AddRoomTypeAxios(form);
  } else {
    res = await RoomTypeAPI.UpdataRoomTypeAxios(editId, form);
  }

  if (res != null) {
    ElMessage.success(editId ? "修改成功" : "新增成功");
    drawerVisible.value = false;
    form.name = "";
    form.state = 0;
    form.price = 0;
    form.depositRequired = true;
    form.depositAmount = 0;
    form.area = 0;
    form.maxOccupancy = 0;
    form.obligate = true;
    form.extraBedPolicy = "";
    form.imageUrl = "";
    form.videoUrl = "";
    form.roomTypeCount = 0;
    form.order = 0;
    form.description = "";
    form.displayChannelses = ["官方直营", "今日特惠", "微信优享"];
    form.facilities = "";
    GetListRoomType();
    editId = "";
  } else {
    ElMessage.error(editId ? "修改失败" : "新增失败");
  }
}
//关闭新增的弹窗
function handleDrawerClose() {
  drawerVisible.value = false;
  editId = "";
}
//新增房型标签
const showTagDialog = ref(false);
const tagForm = reactive({ value: "" });
function confirmAddTag() {
  if (tagForm.value && !form.displayChannels.includes(tagForm.value)) {
    form.displayChannels.push(tagForm.value);
  }
  showTagDialog.value = false;
  tagForm.value = "";
}
function resetTagDialog() {
  tagForm.value = "";
}

const handleAvatarSuccess = (response: any) => {
  console.log(response);
  if (response && response.filePath) {
    form.imageUrl = response.filePath;
  }
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const isImage = ["image/jpeg", "image/png", "image/bmp"].includes(rawFile.type);
  if (!isImage) {
    ElMessage.error("图片格式仅支持 JPG/PNG/BMP!");
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2MB!");
    return false;
  }
  return true;
};
//显示预览图片
function getImageUrl(path: string) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return "https://localhost:44384" + path;
}

//存批量删除的id
const multipleSelection = ref<any[]>([]);
//批量删除的多选框
function handleSelectionChange(val: any[]) {
  multipleSelection.value = val;
}
//批量删除
async function handleBatchDelete() {
  if (multipleSelection.value.length === 0) return;
  const ids = multipleSelection.value.map((item) => item.id);
  ElMessageBox.confirm("确认删除选中的房型吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    async () => {
      const res = await RoomTypeAPI.BatchDeleteRoomTypeAxios(ids);
      if (res != null) {
        ElMessage.success("批量删除成功");
        GetListRoomType();
        multipleSelection.value = [];
      } else {
        ElMessage.error("批量删除失败");
      }
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

async function saveOrder(row: any) {
  await RoomTypeAPI.UpdataRoomTypeOrder(row);
  ElMessage.success("排序修改成功");
  GetListRoomType();
}
</script>

<style scoped>
.el-table th,
.el-table td {
  text-align: center;
}
.el-form-item__tip {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
  border-radius: 8px;
}
.avatar-uploader-icon {
  font-size: 32px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
}
</style>

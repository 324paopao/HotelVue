<template>
    <div>
  <div class="tag-list-page">
    <el-card>
      <div class="header-bar">
        <el-input
          v-model="searchQuery"
          placeholder="标签名称"
          clearable
          style="width: 220px"
          @keyup.enter="fetchTagList"
        />
        <el-select
          v-model="tagTypeFilter"
          placeholder="标签类型"
          clearable
          style="width: 140px; margin-left: 12px"
        >
          <el-option label="全部" :value="''" />
          <el-option label="手动标签" :value="0" />
          <el-option label="条件标签" :value="1" />
        </el-select>
        <el-button type="primary" style="margin-left: 12px" @click="fetchTagList">搜索</el-button>
        <el-button style="margin-left: 12px" @click="handleAddTag">新增标签</el-button>
      </div>

      <!-- 手动标签分区 -->
      <div style="margin-bottom: 32px">
        <h3>手动标签</h3>
        <template v-if="manualTags.length > 0">
          <el-table :data="manualTags" border>
            <el-table-column prop="labelName" label="标签名称" min-width="120" />
            <el-table-column prop="customerCount" label="客户数" width="100" />
            <el-table-column prop="description" label="描述" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.createTime) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-empty v-else description="暂无手动标签">
          <el-button type="primary" @click="handleAddTag">新增手动标签</el-button>
        </el-empty>
      </div>

      <!-- 条件标签分区 -->
      <div>
        <h3>条件标签</h3>
        <template v-if="conditionTags.length > 0">
          <el-table :data="conditionTags" border>
            <el-table-column prop="labelName" label="标签名称" min-width="120" />
            <el-table-column prop="mustMeetAllConditions" label="条件关系" width="120">
              <template #default="scope">
                {{ scope.row.mustMeetAllConditions ? "满足所有条件" : "满足任一条件" }}
              </template>
            </el-table-column>
            <el-table-column prop="customerCount" label="客户数" width="100" />
            <el-table-column prop="description" label="描述" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.createTime) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-empty v-else description="暂无条件标签">
          <el-button type="primary" @click="handleAddTag">新增条件标签</el-button>
        </el-empty>
      </div>

      <el-pagination
        v-model:current-page="pagination.pageIndex"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 18px; text-align: right"
        @size-change="fetchTagList"
        @current-change="fetchTagList"
      />
    </el-card>
  </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { getTagList } from "@/api/system/customer.api";

const router = useRouter();
const searchQuery = ref("");
const tagTypeFilter = ref<string | number>("");

const tagList = ref<any[]>([]);
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
});

const manualTags = computed(() => tagList.value.filter((tag) => tag.tagType === 0));
const conditionTags = computed(() => tagList.value.filter((tag) => tag.tagType === 1));

const fetchTagList = async () => {
  try {
    const params: any = {
      PageIndex: pagination.pageIndex,
      PageSize: pagination.pageSize,
      LabelName: searchQuery.value.trim() || undefined,
    };
    if (tagTypeFilter.value !== "") {
      params.TagType = tagTypeFilter.value;
    }
    const response = await getTagList(params);
    if (response && response.data) {
      tagList.value = response.data|| [];
      pagination.total = response.data.totalCount || 0;
    }
  } catch {
    ElMessage.error("获取标签列表失败");
  }
};

const handleAddTag = () => {
  router.push("/customers/tag-edit");
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

// 删除标签
const handleDeleteTag = (tag: any) => {
  ElMessageBox.confirm(
    `确定要删除标签"${tag.labelName}"吗？`,
    '删除标签',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const params = { guid: tag.id };
      await deleteTag(params);
      ElMessage.success('删除成功');
      fetchTagList();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  }).catch(() => {});
};

// 查看标签详情
const viewTagDetail = (tag: any) => {
  router.push(`/customers/tag-detail?id=${tag.id}`);
};

onMounted(() => {
  fetchTagList();
});
onMounted(fetchTagList);
</script>

<style scoped>
.tag-list-page {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}
.header-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>

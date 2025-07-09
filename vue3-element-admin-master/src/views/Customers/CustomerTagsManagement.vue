<template>
  <div class="tag-management-page">
    <div class="page-header">
      <div class="breadcrumb">客户管理 - 标签管理</div>
    </div>

    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="标签名称"
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch"></el-button>
        </template>
      </el-input>

      <el-button class="add-tag-btn" @click="handleAddTag">新增标签</el-button>
    </div>

    <!-- 手动标签区域 -->
    <div class="tag-section">
      <div class="section-title">手动标签</div>

      <div class="tag-list">
        <div
          v-for="tag in manualTags"
          :key="tag.id"
          class="tag-card"
          :class="{ 'tag-active': tag.labelName === '活跃客户' }"
        >
          <div class="tag-header">
            <span class="tag-name">{{ tag.labelName }}</span>
            <div class="tag-actions">
              <el-button type="text" :icon="Edit" @click="handleEditTag(tag)"></el-button>
              <el-button type="text" :icon="Delete" @click="handleDeleteTag(tag)"></el-button>
            </div>
          </div>

          <div class="tag-footer">
            <div class="tag-count">人数：{{ tag.customerCount || 0 }}</div>
            <el-button type="text" class="tag-detail-btn" @click="viewTagDetail(tag)">
              详情
            </el-button>
          </div>
        </div>

        <!-- 如果没有手动标签，显示空状态 -->
        <div v-if="manualTags.length === 0" class="empty-tags">暂无手动标签</div>
      </div>
    </div>

    <!-- 条件标签区域 -->
    <div class="tag-section">
      <div class="section-title">条件标签</div>

      <div class="tag-list">
        <div v-for="tag in conditionTags" :key="tag.id" class="tag-card condition-tag">
          <div class="tag-header">
            <span class="tag-name">{{ tag.labelName }}</span>
            <div class="tag-actions">
              <el-button type="text" :icon="Edit" @click="handleEditTag(tag)"></el-button>
              <el-button type="text" :icon="Delete" @click="handleDeleteTag(tag)"></el-button>
            </div>
          </div>

          <div class="tag-footer">
            <div class="tag-count">人数：{{ tag.customerCount || 0 }}</div>
            <el-button type="text" class="tag-detail-btn" @click="viewTagDetail(tag)">
              详情
            </el-button>
          </div>
        </div>

        <!-- 如果没有条件标签，显示空状态 -->
        <div v-if="conditionTags.length === 0" class="empty-tags">暂无条件标签</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTagList, deleteTag } from "@/api/system/customer.api";
import { Search, Edit, Delete } from "@element-plus/icons-vue";

const router = useRouter();
const searchQuery = ref("");
const tagList = ref<any[]>([]);

// 分类标签
const manualTags = computed(() =>
  tagList.value.filter((tag) => tag.tagType === 0 || tag.tagType === "0")
);

const conditionTags = computed(() =>
  tagList.value.filter((tag) => tag.tagType === 1 || tag.tagType === "1")
);

// 获取标签列表
const fetchTagList = async () => {
  try {
    const params = {
      PageIndex: 1,
      PageSize: 100, // 获取足够多的标签
      LabelName: searchQuery.value.trim() || undefined,
    };

    const response = await getTagList(params);
    if (response && response.data) {
      tagList.value = response.data || [];
    }
  } catch (error) {
    console.error("获取标签列表失败", error);
    ElMessage.error("获取标签列表失败");
  }
};

// 搜索标签
const handleSearch = () => {
  fetchTagList();
};

// 新增标签
const handleAddTag = () => {
  router.push("/customers/tag-edit");
};

// 编辑标签
const handleEditTag = (tag: any) => {
  router.push(`/customers/tag-edit?id=${tag.id}`);
};

// 删除标签
const handleDeleteTag = (tag: any) => {
  ElMessageBox.confirm(`确定要删除标签"${tag.labelName}"吗？`, "删除标签", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const params = { guid: tag.id };
        await deleteTag(params);
        ElMessage.success("删除成功");
        fetchTagList();
      } catch (error: any) {
        console.error("删除失败", error);
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

// 查看标签详情
const viewTagDetail = (tag: any) => {
  router.push(`/customers/tag-detail?id=${tag.id}`);
};

onMounted(() => {
  fetchTagList();
});
</script>

<style scoped>
.tag-management-page {
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  padding: 16px 0;
  background-color: #fff;
}

.breadcrumb {
  font-size: 14px;
  color: #606266;
  padding: 0 20px;
}

.search-bar {
  padding: 20px;
  display: flex;
  align-items: center;
}

.search-input {
  width: 240px;
}

.add-tag-btn {
  margin-left: 16px;
}

.tag-section {
  margin: 0 0 20px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
  padding: 0 20px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 20px;
}

.tag-card {
  width: 200px;
  height: 100px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  position: relative;
  border: 1px solid #e4e7ed;
}

.tag-active {
  background-color: #409eff;
  color: white;
}

.condition-tag {
  background-color: #67c23a;
  color: white;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-name {
  font-size: 16px;
  font-weight: 500;
}

.tag-actions {
  display: flex;
  gap: 4px;
}

.tag-actions .el-button {
  color: inherit;
  padding: 2px;
}

.tag-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.tag-count {
  font-size: 12px;
}

.tag-detail-btn {
  font-size: 12px;
  color: inherit;
  text-decoration: underline;
}

.empty-tags {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>

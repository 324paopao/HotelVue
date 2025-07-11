<template>
  <div class="tag-management-page">
    <div class="page-header">
      <div class="breadcrumb">客户管理 - 标签管理</div>
    </div>

    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="请输入标签名称搜索"
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" class="add-tag-btn" @click="handleAddTag">新增标签</el-button>
    </div>

    <el-card v-loading="loading">
      <!-- 手动标签区域 -->
      <div class="tag-section">
        <div class="section-title">
          <span class="title-text">手动标签</span>
          <span class="tag-count-info">共 {{ manualTags.length }} 个</span>
        </div>

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
                <el-tooltip content="编辑标签" placement="top">
                  <el-button type="text" :icon="Edit" @click="handleEditTag(tag)" />
                </el-tooltip>
                <el-tooltip content="删除标签" placement="top">
                  <el-button type="text" :icon="Delete" @click="handleDeleteTag(tag)" />
                </el-tooltip>
              </div>
            </div>

            <div class="tag-footer">
              <div class="tag-count">使用人数：{{ tag.peopleNumber || 0 }}</div>
              <el-button type="text" class="tag-detail-btn" @click="viewTagDetail(tag)">
                查看详情
              </el-button>
            </div>
          </div>

          <div v-if="manualTags.length === 0" class="empty-tags">
            <el-empty description="暂无手动标签" />
          </div>
        </div>
      </div>

      <!-- 条件标签区域 -->
      <div class="tag-section">
        <div class="section-title">
          <span class="title-text">条件标签</span>
          <span class="tag-count-info">共 {{ conditionTags.length }} 个</span>
        </div>

        <div class="tag-list">
          <div v-for="tag in conditionTags" :key="tag.id" class="tag-card condition-tag">
            <div class="tag-header">
              <span class="tag-name">{{ tag.labelName }}</span>
              <div class="tag-actions">
                <el-tooltip content="编辑标签" placement="top">
                  <el-button type="text" :icon="Edit" @click="handleEditTag(tag)" />
                </el-tooltip>
                <el-tooltip content="删除标签" placement="top">
                  <el-button type="text" :icon="Delete" @click="handleDeleteTag(tag)" />
                </el-tooltip>
              </div>
            </div>

            <div class="tag-footer">
              <div class="tag-count">使用人数：{{ tag.peopleNumber || 0 }}</div>
              <el-button type="text" class="tag-detail-btn" @click="viewTagDetail(tag)">
                查看详情
              </el-button>
            </div>
          </div>

          <div v-if="conditionTags.length === 0" class="empty-tags">
            <el-empty description="暂无条件标签" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { deleteTag, getLabelList } from "@/api/system/customer.api";
import { Search, Edit, Delete } from "@element-plus/icons-vue";

// 定义标签接口
interface Tag {
  id: string;
  labelName: string;
  tagType: number | string;
  peopleNumber?: number;
  customerCount?: number;
  description?: string;
  createTime?: string;
  updateTime?: string;
}

const router = useRouter();
const searchQuery = ref("");
const tagList = ref<Tag[]>([]);
const loading = ref(false);

// 分类标签
const manualTags = computed(() =>
  tagList.value.filter((tag) => tag.tagType === 0 || tag.tagType === "0")
);

const conditionTags = computed(() =>
  tagList.value.filter((tag) => tag.tagType === 1 || tag.tagType === "1")
);

// 获取标签列表
const fetchTagList = async () => {
  loading.value = true;
  try {
    const response = await getLabelList();
    if (response) {
      // 过滤搜索关键词
      let filteredTags = response as unknown as Tag[];
      if (searchQuery.value.trim()) {
        const keyword = searchQuery.value.trim().toLowerCase();
        filteredTags = filteredTags.filter((tag) => tag.labelName.toLowerCase().includes(keyword));
      }
      tagList.value = filteredTags;
    }
  } catch (error) {
    console.error("获取标签列表失败", error);
    ElMessage.error("获取标签列表失败");
  } finally {
    loading.value = false;
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
const handleEditTag = (tag: Tag) => {
  router.push(`/customers/tag-edit?id=${tag.id}`);
};

// 删除标签
const handleDeleteTag = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm(`确定要删除标签"${tag.labelName}"吗？\n删除后无法恢复`, "删除标签", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const params = { guid: tag.id };
    await deleteTag(params);
    ElMessage.success("删除成功");
    fetchTagList();
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败", error);
      ElMessage.error("删除失败");
    }
  }
};

// 查看标签详情
const viewTagDetail = (tag: Tag) => {
  router.push(`/customers/tag-detail?id=${tag.id}`);
};

onMounted(() => {
  fetchTagList();
});
</script>

<style scoped>
.tag-management-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 40px);
}

.page-header {
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 300px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.title-text {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.tag-count-info {
  margin-left: 12px;
  font-size: 14px;
  color: #909399;
}

.tag-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.tag-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.tag-card:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.tag-active {
  background-color: #ecf5ff;
  border-color: #409eff;
}

.condition-tag {
  background-color: #f0f9eb;
  border-color: #67c23a;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tag-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.tag-actions {
  display: flex;
  gap: 8px;
}

.tag-actions .el-button {
  padding: 4px;
}

.tag-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-count {
  font-size: 14px;
  color: #606266;
}

.tag-detail-btn {
  font-size: 14px;
  padding: 0;
}

.empty-tags {
  grid-column: 1 / -1;
  padding: 32px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px dashed #e4e7ed;
}

.tag-section:last-child {
  margin-bottom: 0;
}
</style>

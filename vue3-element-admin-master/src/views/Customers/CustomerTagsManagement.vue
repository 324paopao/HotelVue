<template>
  <div class="tag-management-container">
    <div class="breadcrumb">
      <span>客户管理</span>
      <span class="separator">·</span>
      <span>标签管理</span>
    </div>

    <div class="search-header">
      <div class="search-controls">
        <el-input
          v-model="searchQuery"
          placeholder="标签名称"
          class="search-input"
          :prefix-icon="Search"
          clearable
          @keyup.enter="handleSearch"
          @clear="resetSearch"
        >
          <template #append>
            <el-button :icon="Search" :loading="searchLoading" @click="handleSearch" />
          </template>
        </el-input>

        <el-select
          v-model="tagTypeFilter"
          placeholder="标签类型"
          class="tag-type-filter"
          clearable
          @change="handleTagTypeChange"
        >
          <el-option label="全部标签" :value="-1" />
          <el-option label="手动标签" :value="0" />
          <el-option label="条件标签" :value="1" />
        </el-select>
      </div>

      <div class="action-controls">
        <el-select
          v-model="sortOption"
          placeholder="排序方式"
          class="sort-select"
          @change="handleSortChange"
        >
          <el-option label="默认排序" value="default" />
          <el-option label="按名称排序" value="name" />
          <el-option label="按人数排序" value="count" />
          <el-option label="按创建时间排序" value="time" />
        </el-select>
        <el-button type="primary" @click="handleAddTag">新增标签</el-button>
      </div>
    </div>

    <!-- 快速过滤器 -->
    <div v-if="!loading" class="filter-chips">
      <div class="filter-label">快速筛选:</div>
      <el-radio-group v-model="activeFilter" size="small" @change="handleFilterChange">
        <el-radio-button label="all">全部标签 ({{ state.tagList.length }})</el-radio-button>
        <el-radio-button label="manual">手动标签 ({{ manualTagsCount }})</el-radio-button>
        <el-radio-button label="condition">条件标签 ({{ conditionTagsCount }})</el-radio-button>
        <el-radio-button v-if="popularTags.length > 0" label="popular">
          热门标签 ({{ popularTags.length }})
        </el-radio-button>
        <el-radio-button v-if="recentTags.length > 0" label="recent">
          最近创建 ({{ recentTags.length }})
        </el-radio-button>
      </el-radio-group>
    </div>

    <div class="tag-sections">
      <!-- 手动标签 -->
      <div v-if="showManualSection" class="tag-section">
        <div class="section-title">手动标签</div>
        <div v-if="loading" class="section-loading">
          <el-skeleton :rows="1" animated />
        </div>
        <div v-else-if="manualTags.length === 0 && !searchQuery" class="empty-section">
          <el-empty description="暂无手动标签" :image-size="60">
            <el-button type="primary" @click="handleAddManualTag">新增手动标签</el-button>
          </el-empty>
        </div>
        <div v-else class="tag-cards">
          <div v-for="tag in manualTags" :key="tag.id" class="tag-card blue-card">
            <div class="tag-card-header">
              <div class="tag-badge">手动</div>
              <div class="tag-name">{{ tag.labelName }}</div>
              <div class="tag-actions">
                <el-tooltip content="编辑标签" placement="top">
                  <span class="edit-icon" @click="handleEditTag(tag)">
                    <el-icon><Edit /></el-icon>
                  </span>
                </el-tooltip>
                <el-tooltip content="删除标签" placement="top">
                  <span class="delete-icon" @click="handleDeleteTag(tag)">
                    <el-icon><Delete /></el-icon>
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div class="tag-card-content">
              <div class="tag-description" :title="tag.description || '无描述'">
                {{ tag.description || "无描述" }}
              </div>
              <div v-if="tag.createTime" class="tag-date">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(tag.createTime) }}
              </div>
            </div>
            <div class="tag-card-footer">
              <span class="tag-count">
                <el-icon><User /></el-icon>
                {{ tag.customerCount || 0 }}人
              </span>
              <div class="tag-actions-footer">
                <el-tooltip content="预览客户" placement="top">
                  <span class="preview-icon" @click="previewTagCustomers(tag)">
                    <el-icon><View /></el-icon>
                  </span>
                </el-tooltip>
                <el-link type="primary" class="detail-link" @click="viewTagDetails(tag)">
                  详情
                  <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-link>
              </div>
            </div>
          </div>

          <!-- 新增标签卡片 -->
          <div class="tag-card add-card" @click="handleAddManualTag">
            <div class="add-icon">
              <el-icon><Plus /></el-icon>
            </div>
            <div class="add-text">新增手动标签</div>
          </div>
        </div>
      </div>

      <!-- 条件标签 -->
      <div v-if="showConditionSection" class="tag-section">
        <div class="section-title">条件标签</div>
        <div v-if="loading" class="section-loading">
          <el-skeleton :rows="1" animated />
        </div>
        <div v-else-if="conditionTags.length === 0 && !searchQuery" class="empty-section">
          <el-empty description="暂无条件标签" :image-size="60">
            <el-button type="primary" @click="handleAddConditionTag">新增条件标签</el-button>
          </el-empty>
        </div>
        <div v-else class="tag-cards">
          <div v-for="tag in conditionTags" :key="tag.id" class="tag-card green-card">
            <div class="tag-card-header">
              <div class="tag-badge condition-badge">条件</div>
              <div class="tag-name">{{ tag.labelName }}</div>
              <div class="tag-actions">
                <el-tooltip content="编辑标签" placement="top">
                  <span class="edit-icon" @click="handleEditTag(tag)">
                    <el-icon><Edit /></el-icon>
                  </span>
                </el-tooltip>
                <el-tooltip content="删除标签" placement="top">
                  <span class="delete-icon" @click="handleDeleteTag(tag)">
                    <el-icon><Delete /></el-icon>
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div class="tag-card-content">
              <div class="tag-description" :title="tag.description || '无描述'">
                {{ tag.description || "无描述" }}
              </div>
              <div v-if="tag.createTime" class="tag-date">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(tag.createTime) }}
              </div>
              <div v-if="tag.mustMeetAllConditions !== undefined" class="tag-condition">
                <el-tag size="small" type="info">
                  {{ tag.mustMeetAllConditions ? "满足所有条件" : "满足任一条件" }}
                </el-tag>
              </div>
            </div>
            <div class="tag-card-footer">
              <span class="tag-count">
                <el-icon><User /></el-icon>
                {{ tag.customerCount || 0 }}人
              </span>
              <div class="tag-actions-footer">
                <el-tooltip content="预览客户" placement="top">
                  <span class="preview-icon" @click="previewTagCustomers(tag)">
                    <el-icon><View /></el-icon>
                  </span>
                </el-tooltip>
                <el-link type="primary" class="detail-link" @click="viewTagDetails(tag)">
                  详情
                  <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-link>
              </div>
            </div>
          </div>

          <!-- 新增标签卡片 -->
          <div class="tag-card add-card" @click="handleAddConditionTag">
            <div class="add-icon">
              <el-icon><Plus /></el-icon>
            </div>
            <div class="add-text">新增条件标签</div>
          </div>
        </div>
      </div>

      <!-- 热门标签 -->
      <div v-if="activeFilter === 'popular' && popularTags.length > 0" class="tag-section">
        <div class="section-title">热门标签</div>
        <div class="tag-cards">
          <div
            v-for="tag in popularTags"
            :key="tag.id"
            :class="['tag-card', tag.tagType === 0 ? 'blue-card' : 'green-card']"
          >
            <div class="tag-card-header">
              <div class="tag-badge" :class="{ 'condition-badge': tag.tagType === 1 }">
                {{ tag.tagType === 0 ? "手动" : "条件" }}
              </div>
              <div class="tag-name">{{ tag.labelName }}</div>
              <div class="tag-actions">
                <el-tooltip content="编辑标签" placement="top">
                  <span class="edit-icon" @click="handleEditTag(tag)">
                    <el-icon><Edit /></el-icon>
                  </span>
                </el-tooltip>
                <el-tooltip content="删除标签" placement="top">
                  <span class="delete-icon" @click="handleDeleteTag(tag)">
                    <el-icon><Delete /></el-icon>
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div class="tag-card-content">
              <div class="tag-description" :title="tag.description || '无描述'">
                {{ tag.description || "无描述" }}
              </div>
              <div v-if="tag.createTime" class="tag-date">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(tag.createTime) }}
              </div>
              <div
                v-if="tag.tagType === 1 && tag.mustMeetAllConditions !== undefined"
                class="tag-condition"
              >
                <el-tag size="small" type="info">
                  {{ tag.mustMeetAllConditions ? "满足所有条件" : "满足任一条件" }}
                </el-tag>
              </div>
            </div>
            <div class="tag-card-footer">
              <span class="tag-count">
                <el-icon><User /></el-icon>
                {{ tag.customerCount || 0 }}人
              </span>
              <div class="tag-actions-footer">
                <el-tooltip content="预览客户" placement="top">
                  <span class="preview-icon" @click="previewTagCustomers(tag)">
                    <el-icon><View /></el-icon>
                  </span>
                </el-tooltip>
                <el-link type="primary" class="detail-link" @click="viewTagDetails(tag)">
                  详情
                  <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近创建标签 -->
      <div v-if="activeFilter === 'recent' && recentTags.length > 0" class="tag-section">
        <div class="section-title">最近创建标签</div>
        <div class="tag-cards">
          <div
            v-for="tag in recentTags"
            :key="tag.id"
            :class="['tag-card', tag.tagType === 0 ? 'blue-card' : 'green-card']"
          >
            <div class="tag-card-header">
              <div class="tag-badge" :class="{ 'condition-badge': tag.tagType === 1 }">
                {{ tag.tagType === 0 ? "手动" : "条件" }}
              </div>
              <div class="tag-name">{{ tag.labelName }}</div>
              <div class="tag-actions">
                <el-tooltip content="编辑标签" placement="top">
                  <span class="edit-icon" @click="handleEditTag(tag)">
                    <el-icon><Edit /></el-icon>
                  </span>
                </el-tooltip>
                <el-tooltip content="删除标签" placement="top">
                  <span class="delete-icon" @click="handleDeleteTag(tag)">
                    <el-icon><Delete /></el-icon>
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div class="tag-card-content">
              <div class="tag-description" :title="tag.description || '无描述'">
                {{ tag.description || "无描述" }}
              </div>
              <div v-if="tag.createTime" class="tag-date">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(tag.createTime) }}
              </div>
              <div
                v-if="tag.tagType === 1 && tag.mustMeetAllConditions !== undefined"
                class="tag-condition"
              >
                <el-tag size="small" type="info">
                  {{ tag.mustMeetAllConditions ? "满足所有条件" : "满足任一条件" }}
                </el-tag>
              </div>
            </div>
            <div class="tag-card-footer">
              <span class="tag-count">
                <el-icon><User /></el-icon>
                {{ tag.customerCount || 0 }}人
              </span>
              <div class="tag-actions-footer">
                <el-tooltip content="预览客户" placement="top">
                  <span class="preview-icon" @click="previewTagCustomers(tag)">
                    <el-icon><View /></el-icon>
                  </span>
                </el-tooltip>
                <el-link type="primary" class="detail-link" @click="viewTagDetails(tag)">
                  详情
                  <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签统计 -->
    <div v-if="!loading && state.tagList.length > 0" class="tags-statistics">
      <div class="statistics-item">
        <div class="statistics-title">标签总数</div>
        <div class="statistics-value">{{ state.tagList.length }}</div>
      </div>
      <div class="statistics-item">
        <div class="statistics-title">手动标签</div>
        <div class="statistics-value">{{ manualTags.length }}</div>
      </div>
      <div class="statistics-item">
        <div class="statistics-title">条件标签</div>
        <div class="statistics-value">{{ conditionTags.length }}</div>
      </div>
      <div class="statistics-item">
        <div class="statistics-title">客户总数</div>
        <div class="statistics-value">{{ totalCustomers }}</div>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-if="loading && !manualTags.length && !conditionTags.length" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 无数据状态 - 仅在搜索时显示 -->
    <el-empty
      v-if="!loading && manualTags.length === 0 && conditionTags.length === 0 && searchQuery"
      description="未找到匹配的标签"
    >
      <el-button @click="resetSearch">清除搜索</el-button>
    </el-empty>

    <!-- 搜索结果反馈 -->
    <div v-if="searchQuery && !loading && state.tagList.length > 0" class="search-results-info">
      找到 {{ state.pagination.total }} 个匹配标签
    </div>

    <!-- 分页控件 -->
    <div v-if="state.pagination.total > 0" class="pagination-container">
      <el-pagination
        v-model:current-page="state.pagination.pageIndex"
        v-model:page-size="state.pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 标签客户预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="`${currentTag?.labelName || ''} - 客户预览`"
      width="70%"
      destroy-on-close
    >
      <div v-if="previewLoading" class="preview-loading">
        <el-skeleton :rows="5" animated />
      </div>
      <div v-else-if="tagCustomers.length === 0" class="preview-empty">
        <el-empty description="暂无客户数据" />
      </div>
      <div v-else class="preview-content">
        <el-table :data="tagCustomers" style="width: 100%" border>
          <el-table-column prop="customerName" label="客户姓名" width="120" />
          <el-table-column prop="phone" label="联系电话" width="150" />
          <el-table-column prop="email" label="电子邮箱" width="180" />
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="scope">
              {{ scope.row.gender === 1 ? "男" : scope.row.gender === 2 ? "女" : "未知" }}
            </template>
          </el-table-column>
          <el-table-column prop="lastVisitTime" label="最近访问时间" width="180">
            <template #default="scope">
              {{ scope.row.lastVisitTime ? formatDateTime(scope.row.lastVisitTime) : "无记录" }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                {{ scope.row.status === 1 ? "活跃" : "非活跃" }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="preview-pagination">
          <el-pagination
            small
            layout="prev, pager, next"
            :total="previewTotal"
            :page-size="5"
            @current-change="handlePreviewPageChange"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="currentTag && viewTagDetails(currentTag)">
            查看完整列表
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Edit,
  Delete,
  Plus,
  User,
  ArrowRight,
  Calendar,
  View,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { getTagList, deleteTag, getLabelCustomerList } from "@/api/system/customer.api";

// 定义标签数据类型接口
interface TagType {
  id: string;
  labelName: string;
  tagType: number;
  customerCount: number;
  description?: string;
  createTime?: string;
  mustMeetAllConditions?: boolean;
}

// 定义客户数据类型接口
interface CustomerType {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  gender: number;
  lastVisitTime?: string;
  status: number;
}

const router = useRouter();
const searchQuery = ref("");
const tagTypeFilter = ref<number>(-1);
const sortOption = ref("default");
const activeFilter = ref("all");
const loading = ref(false);
const searchLoading = ref(false);

// 标签列表数据
const state = reactive({
  tagList: [] as TagType[],
  pagination: {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  },
});

// 按标签类型分类
const manualTags = computed(() => {
  const tags = state.tagList.filter((tag) => tag.tagType === 0);
  return sortTags(tags);
});

const conditionTags = computed(() => {
  const tags = state.tagList.filter((tag) => tag.tagType === 1);
  return sortTags(tags);
});

// 排序标签
const sortTags = (tags: TagType[]) => {
  const tagsCopy = [...tags];

  switch (sortOption.value) {
    case "name":
      return tagsCopy.sort((a, b) => a.labelName.localeCompare(b.labelName));
    case "count":
      return tagsCopy.sort((a, b) => (b.customerCount || 0) - (a.customerCount || 0));
    case "time":
      return tagsCopy.sort((a, b) => {
        if (!a.createTime) return 1;
        if (!b.createTime) return -1;
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      });
    default:
      return tagsCopy;
  }
};

// 排序方式变更
const handleSortChange = () => {
  // 不需要重新获取数据，只需要重新排序
};

// 获取标签列表
const fetchTagList = async () => {
  loading.value = true;
  if (searchQuery.value) {
    searchLoading.value = true;
  }

  try {
    const params: any = {
      PageIndex: state.pagination.pageIndex,
      PageSize: state.pagination.pageSize,
      LabelName: searchQuery.value.trim() || undefined,
    };

    // 添加标签类型过滤
    if (tagTypeFilter.value !== -1) {
      params.TagType = tagTypeFilter.value;
    }

    const response = await getTagList(params);
    if (response && response.data) {
      state.tagList = response.data.data || [];
      state.pagination.total = response.data.totalCount || 0;
    }
  } catch (error) {
    console.error("获取标签列表失败", error);
    ElMessage.error("获取标签列表失败");
  } finally {
    loading.value = false;
    searchLoading.value = false;
  }
};

// 搜索标签
const handleSearch = () => {
  if (!searchQuery.value.trim() && searchQuery.value !== "") {
    return;
  }
  state.pagination.pageIndex = 1; // 重置到第一页
  fetchTagList();
};

// 标签类型过滤变更
const handleTagTypeChange = () => {
  state.pagination.pageIndex = 1; // 重置到第一页
  fetchTagList();
};

// 重置搜索
const resetSearch = () => {
  searchQuery.value = "";
  tagTypeFilter.value = -1;
  state.pagination.pageIndex = 1;
  fetchTagList();
};

// 新增标签
const handleAddTag = () => {
  router.push("/customers/tag-edit");
};

// 新增手动标签
const handleAddManualTag = () => {
  router.push("/customers/tag-edit?type=0");
};

// 新增条件标签
const handleAddConditionTag = () => {
  router.push("/customers/tag-edit?type=1");
};

// 编辑标签
const handleEditTag = (tag: TagType) => {
  router.push(`/customers/tag-edit?id=${tag.id}`);
};

// 删除标签
const handleDeleteTag = (tag: TagType) => {
  ElMessageBox.confirm(`确定要删除标签"${tag.labelName}"吗？`, "删除标签", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteTag(tag.id);
        ElMessage.success("标签删除成功");
        fetchTagList(); // 重新加载标签列表
      } catch (error) {
        console.error("删除标签失败", error);
        ElMessage.error("删除标签失败");
      }
    })
    .catch(() => {});
};

// 查看标签详情
const viewTagDetails = (tag: TagType) => {
  router.push(`/customers/tag-detail?id=${tag.id}`);
};

// 分页处理
const handleSizeChange = (size: number) => {
  state.pagination.pageSize = size;
  fetchTagList();
};

const handleCurrentChange = (page: number) => {
  state.pagination.pageIndex = page;
  fetchTagList();
};

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

// 计算客户总数
const totalCustomers = computed(() => {
  return state.tagList.reduce((total, tag) => total + (tag.customerCount || 0), 0);
});

// 预览对话框状态
const previewDialogVisible = ref(false);
const previewLoading = ref(false);
const currentTag = ref<TagType | null>(null);
const tagCustomers = ref<CustomerType[]>([]);
const previewTotal = ref(0);
const previewPage = ref(1);

// 预览标签客户
const previewTagCustomers = async (tag: TagType) => {
  currentTag.value = tag;
  previewDialogVisible.value = true;
  previewLoading.value = true;
  previewPage.value = 1;

  try {
    const params = {
      PageIndex: 1,
      PageSize: 5,
      LabelId: tag.id,
    };

    const response = await getLabelCustomerList(params);
    if (response && response.data) {
      tagCustomers.value = response.data.data || [];
      previewTotal.value = response.data.totalCount || 0;
    }
  } catch (error) {
    console.error("获取标签客户失败", error);
    ElMessage.error("获取标签客户失败");
    tagCustomers.value = [];
    previewTotal.value = 0;
  } finally {
    previewLoading.value = false;
  }
};

// 预览分页变更
const handlePreviewPageChange = async (page: number) => {
  if (!currentTag.value) return;
  previewPage.value = page;
  previewLoading.value = true;

  try {
    const params = {
      PageIndex: page,
      PageSize: 5,
      LabelId: currentTag.value.id,
    };

    const response = await getLabelCustomerList(params);
    if (response && response.data) {
      tagCustomers.value = response.data.data || [];
    }
  } catch (error) {
    console.error("获取标签客户失败", error);
    ElMessage.error("获取标签客户失败");
  } finally {
    previewLoading.value = false;
  }
};

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

// 计算属性
const manualTagsCount = computed(() => {
  return state.tagList.filter((tag) => tag.tagType === 0).length;
});

const conditionTagsCount = computed(() => {
  return state.tagList.filter((tag) => tag.tagType === 1).length;
});

// 热门标签（按客户数量排序）
const popularTags = computed(() => {
  return [...state.tagList]
    .sort((a, b) => (b.customerCount || 0) - (a.customerCount || 0))
    .slice(0, 10); // 取前10个
});

// 最近创建标签
const recentTags = computed(() => {
  return [...state.tagList]
    .filter((tag) => tag.createTime)
    .sort((a, b) => {
      if (!a.createTime) return 1;
      if (!b.createTime) return -1;
      return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
    })
    .slice(0, 10); // 取前10个
});

// 是否显示手动标签区域
const showManualSection = computed(() => {
  return activeFilter.value === "all" || activeFilter.value === "manual";
});

// 是否显示条件标签区域
const showConditionSection = computed(() => {
  return activeFilter.value === "all" || activeFilter.value === "condition";
});

// 过滤器变更
const handleFilterChange = () => {
  // 不需要重新获取数据，只需要更新显示
};

// 初始化
onMounted(() => {
  fetchTagList();
});
</script>

<style scoped>
.tag-management-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.breadcrumb {
  font-size: 14px;
  margin-bottom: 20px;
  color: #606266;
}

.separator {
  margin: 0 8px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-controls {
  display: flex;
  gap: 10px;
  width: 460px;
}

.action-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sort-select {
  width: 140px;
}

.search-input {
  width: 260px;
}

.tag-type-filter {
  width: 190px;
}

.tag-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tag-section {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.tag-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.tag-card {
  width: 200px;
  height: 140px;
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tag-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-bottom-left-radius: 4px;
}

.condition-badge {
  background-color: rgba(0, 0, 0, 0.15);
}

.tag-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.blue-card {
  background-color: #409eff;
  color: white;
  background-image: linear-gradient(135deg, #409eff, #2e84db);
}

.green-card {
  background-color: #67c23a;
  color: white;
  background-image: linear-gradient(135deg, #67c23a, #529b2e);
}

.add-card {
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  color: #606266;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 140px;
}

.add-card:hover {
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-3px);
}

.add-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.add-text {
  font-size: 14px;
}

.tag-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tag-name {
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

.tag-actions {
  display: flex;
  gap: 8px;
}

.edit-icon,
.delete-icon {
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.edit-icon:hover,
.delete-icon:hover {
  opacity: 1;
}

.tag-card-content {
  margin: 8px 0;
  flex: 1;
}

.tag-description {
  font-size: 12px;
  opacity: 0.9;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tag-date {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-condition {
  margin-top: 6px;
}

.tag-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 8px;
}

.tag-count {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-actions-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-icon {
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.preview-icon:hover {
  opacity: 1;
}

.detail-link {
  font-size: 14px;
  color: white !important;
  display: flex;
  align-items: center;
}

.loading-container {
  padding: 40px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-results-info {
  margin: 10px 0;
  font-size: 14px;
  color: #606266;
}

.pagination-container {
  margin-top: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: flex-end;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.section-loading {
  padding: 20px 0;
}

.empty-section {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.tags-statistics {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.statistics-item {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.statistics-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.statistics-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

/* 预览对话框样式 */
.preview-loading {
  padding: 20px;
}

.preview-content {
  max-height: 60vh;
  overflow-y: auto;
}

.preview-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.filter-chips {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: white;
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.filter-label {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
}
</style>

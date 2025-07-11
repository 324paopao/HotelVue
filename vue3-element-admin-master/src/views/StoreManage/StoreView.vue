<template>
  <div>
    <el-card>
      <!-- 面包屑 -->
      <div style="margin-bottom: 20px;font-size: large;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>门店管理</el-breadcrumb-item>
          <el-breadcrumb-item>门店列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 查询框 -->
      <el-card>
        <div class="filter-container">
          <!-- 省市区选择器 -->
          <div class="area-selector">
            <el-popover
              v-model:visible="areaPopoverVisible"
              placement="bottom-start"
              :width="600"
              trigger="click"
            >
              <template #reference>
                <el-input
                  v-model="selectedAreaText"
                  placeholder="请选择省市区"
                  readonly
                  class="area-input"
                >
                  <template #append>
                    <el-icon><ArrowDown /></el-icon>
                  </template>
                </el-input>
              </template>
              
              <div class="area-content">
                <el-tabs v-model="activeTab">
                  <el-tab-pane label="省" name="province">
                    <div class="province-list">
                      <div
                        v-for="province in provinceList"
                        :key="province.code"
                        class="province-item"
                        :class="{ 'active': selectedProvince === province.code }"
                        @click="handleProvinceSelect(province)"
                      >
                        {{ province.name }}
                      </div>
                    </div>
                  </el-tab-pane>
                  
                  <el-tab-pane label="市" name="city" :disabled="!selectedProvince">
                    <div v-if="cityList.length > 0" class="city-list" >
                      <div
                        v-for="city in cityList"
                        :key="city.code"
                        class="city-item"
                        @click="handleCitySelect(city)"
                      >
                        {{ city.name }}
                      </div>
                    </div>
                    <div v-else class="empty-tip">请先选择省份</div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-popover>
          </div>
          <!-- 清空城市筛选 -->
          <el-button type="primary" plain @click="clearAreaFilter">清空城市筛选</el-button>
          <!-- 门店状态筛选 -->
          <el-select v-model="storeStatus" placeholder="门店状态" clearable class="filter-item" @change="handleStatusChange">
            <el-option
              v-for="item in storeStatusOptions"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" plain @click="addStore()">新增门店</el-button>
          <el-button type="success" plain @click="fetchAllStores">测试获取数据</el-button>
          <!-- 搜索框 -->
          <el-input
            v-model="searchKeyword"
            placeholder="请输入门店名称"
            class="search-input"
            clearable
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>
          <!-- 新增门店弹窗 -->
          <el-dialog v-model="addStoreDialogVisible" :title="title" width="90%">
            <el-form
              ref="addStoreFormRef"
              style="max-width: 1200px; width: 100%;"
              :model="addStoreForm"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="门店名称" prop="storeName" required>
                <el-input v-model="addStoreForm.storeName" placeholder="欧莱雅">
                  <template #append>{{ addStoreForm.storeName.length }} / 15</template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="分店名称" prop="branchName">
                <el-input v-model="addStoreForm.branchName" placeholder="泡泡">
                  <template #append>{{ addStoreForm.branchName.length }} / 15</template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="商户地址" prop="address" required>
                <el-popover
                  v-model:visible="storeAddressVisible"
                  placement="bottom"
                  :width="600"
                  trigger="click"
                >
                  <template #reference>
                    <el-input v-model="addStoreForm.address"  readonly @click="showMapSelect">
                      <template #append>
                        <el-icon><Location /></el-icon>
                      </template>
                    </el-input>
                  </template>
                  
                  <div class="area-tabs">
                    <el-tabs v-model="storeAddressTab">
                      <el-tab-pane label="省" name="province">
                        <div class="area-grid">
                          <div
                            v-for="province in provinceList"
                            :key="province.code"
                            class="area-item"
                            :class="{'active': storeProvince === province.code}"
                            @click="selectStoreProvince(province)"
                          >
                            {{ province.name }}
                          </div>
                        </div>
                      </el-tab-pane>
                      
                      <el-tab-pane label="市" name="city" :disabled="!storeProvince">
                        <div class="area-grid">
                          <div
                            v-for="city in storeCityList"
                            :key="city.code"
                            class="area-item"
                            :class="{'active': storeCity === city.code}"
                            @click="selectStoreCity(city)"
                          >
                            {{ city.name }}
                          </div>
                        </div>
                      </el-tab-pane>
                      
                      <el-tab-pane label="区" name="district" :disabled="!storeCity">
                        <div class="area-grid">
                          <div
                            v-for="district in storeDistrictList"
                            :key="district.code"
                            class="area-item"
                            :class="{'active': storeDistrict === district.code}"
                            @click="selectStoreDistrict(district)"
                          >
                            {{ district.name }}
                          </div>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-popover>
                
                <!-- 地图选择区 -->
                <div v-if="showMap" class="map-container">
                  <div class="map-search">
                    <el-input v-model="mapSearchText" placeholder="北京工商管理专修学院">
                      <template #append>
                        <el-button :icon="Search" @click="handleSearchComplete" />
                      </template>
                    </el-input>
                  </div>
                  
                  <div class="map-tip">注意：这只是模拟定位，准确位置请调用上标注</div>
                  
                  <div class="map-content full-width">
                    <div class="mock-map">
                      <div class="map-marker">
                        <span>{{ storeFullAddress }}</span>
                        <div>注目标位置，你也可以选择地图上方位置系统自动定位！</div>
                        <div class="close-btn" @click="showMap = false">✕</div>
                      </div>
                      <!-- 高德地图容器 -->
                      <div id="amap-container" class="amap-container"></div>
                      <div class="map-controls">
                        <el-button size="small" @click.stop="locateCurrentPosition">定位当前位置</el-button>
                        <div class="coordinates-display">
                          <span>经度: {{ location.longitude }}</span>
                          <span>纬度: {{ location.latitude }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- <div class="coordinates">
                      <div>经度: {{ location.longitude }}</div>
                      <div>纬度: {{ location.latitude }}</div>
                    </div> -->
                  </div>
                </div>
              </el-form-item>
              
              <el-form-item label="门店图片" prop="storeImg" required>
                <div class="upload-container">
                  <div v-if="addStoreForm.storeImg" class="preview-image">
                    <img :src="storeImgDisplay" alt="门店图片" />
                    <div class="image-actions">
                      <el-button type="danger" size="small" @click="removeImage">删除</el-button>
                    </div>
                  </div>
                  <div v-else-if="uploadLoading" class="upload-trigger loading">
                    <el-icon class="loading-icon"><Loading /></el-icon>
                    <div>上传中...</div>
                  </div>
                  <div v-else class="upload-trigger" @click="triggerUpload">
                    <el-icon class="upload-icon"><Plus /></el-icon>
                    <div>上传图片</div>
                  </div>
                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/bmp"
                    style="display: none"
                    @change="handleFileChange"
                  />
                </div>
                <div class="upload-tip">
                  <el-icon><InfoFilled /></el-icon>
                  像素要求必须为750*375像素，支持jpg .jpeg .bmp .png格式，大小不超过5M
                </div>
              </el-form-item>
              
              <el-form-item label="客服电话" prop="mobile" required>
                <el-input v-model="addStoreForm.mobile" placeholder="15642158745">
                  <template #append>手机号或者固话</template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="门店状态">
                <el-radio-group v-model="addStoreForm.status">
                  <el-radio :label="true">启用</el-radio>
                  <el-radio :label="false">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="门店介绍" prop="introduction">
                <el-input
                  v-model="addStoreForm.introduction"
                  type="textarea"
                  placeholder="规则法规内容文字"
                  :rows="5"
                />
                <div class="character-count">{{ addStoreForm.introduction.length }} / 300</div>
              </el-form-item>
              
              <el-form-item label="入住须知" prop="note">
                <el-input
                  v-model="addStoreForm.note"
                  type="textarea"
                  placeholder="如推荐等，推荐商品等"
                  :rows="5"
                />
                <div class="character-count">{{ addStoreForm.note.length }} / 300</div>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="submitForm(addStoreFormRef)">提交</el-button>
                <el-button @click="resetForm(addStoreFormRef)">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </el-card>
      <!-- 门店列表 -->
      <el-card>
        <el-table v-loading="loading" :data="storeList" style="width: 100%" >
          <el-table-column prop="storeName" label="门店名称" />
          <el-table-column label="门店图片">
            <template #default="scope">
              <el-image 
                v-if="scope.row.storeImg"
                style="width: 100px; height: 50px" 
                :src="getImageUrl(scope.row.storeImg)" 
                fit="cover"
                :preview-src-list="[getImageUrl(scope.row.storeImg)]"
              />
              <span v-else>无图片</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="门店地址" />
          <el-table-column label="门店状态">
            <template #default="scope">
              <el-tag :type="scope.row.status ? 'success' : 'danger'">
                {{ scope.row.status ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <span style="color: #409EFF; cursor: pointer; margin-left: 8px;"
              @click="editStore(scope.row)">编辑</span>&nbsp;
              <span style="color: #409EFF; cursor: pointer; margin-left: 8px;"
              @click="toggleStoreStatus(scope.row)">
                {{ scope.row.status ? '禁用' : '启用' }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="page.totleCount > 0" class="pagination-container" >
          <span class="pagination-info">共{{ page.totleCount }}条数据 当前为第{{ queryParams.PageIndex }}页</span>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="page.totleCount"
            :current-page="queryParams.PageIndex"
            :page-size="queryParams.PageSize"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { Search, ArrowDown, Location, Plus, InfoFilled, Loading } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { provinceAndCityData } from 'element-china-area-data';
import type { FormInstance, FormRules } from 'element-plus'
import StoreManageAPI from '@/api/Store/storemanage.api'
import axios from 'axios';
import { useStore } from "@/store/Usertinfo";
const store = useStore();

// 声明AMap类型
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

// 生命周期钩子
onMounted(() => {
  // 加载初始数据
  loadAMap();
  getStoreList();
});

//#region 区域选择
interface AreaItem {
  code: string;
  name: string;
}

// 筛选区域相关变量
const areaPopoverVisible = ref(false);
const activeTab = ref('province');
const selectedProvince = ref('');
const selectedCity = ref('');
const selectedProvinceText = ref('');
const selectedCityText = ref('');

// 获取省份列表
const provinceList = ref(provinceAndCityData.map(item => ({
  code: item.value,
  name: item.label
})));

// 计算城市列表 - 用于筛选区域
const cityList = computed(() => {
  if (!selectedProvince.value) return [];
  
  const province = provinceAndCityData.find(p => p.value === selectedProvince.value);
  if (province && province.children) {
    return province.children.map(item => ({
      code: item.value,
      name: item.label
    }));
  }
  return [];
});

// 计算城市列表 - 用于商户地址
const storeCityList = computed(() => {
  if (!storeProvince.value) return [];
  
  const province = provinceAndCityData.find(p => p.value === storeProvince.value);
  if (province && province.children) {
    return province.children.map(item => ({
      code: item.value,
      name: item.label
    }));
  }
  return [];
});

// 选择省份
const handleProvinceSelect = (province: AreaItem) => {
  selectedProvince.value = province.code;
  selectedProvinceText.value = province.name;
  selectedCity.value = '';
  selectedCityText.value = '';
  activeTab.value = 'city';
};

// 选择城市
const handleCitySelect = (city: AreaItem) => {
  selectedCity.value = city.code;
  selectedCityText.value = city.name;
  updateSelectedAreaText();
  areaPopoverVisible.value = false;
};

// 选择文本
const selectedAreaText = computed(() => {
  if (selectedProvince.value && selectedCity.value) {
    return `${selectedProvinceText.value} ${selectedCityText.value}`;
  } else if (selectedProvince.value) {
    return selectedProvinceText.value;
  }
  return '';
});

// 清空区域筛选
const clearAreaFilter = () => {
  selectedProvince.value = '';
  selectedCity.value = '';
  selectedProvinceText.value = '';
  selectedCityText.value = '';
  activeTab.value = 'province';
  getStoreList();
};

// 更新选择文本
const updateSelectedAreaText = () => {
  if (selectedCity.value) {
    ElMessage.success(`已选择: ${selectedProvinceText.value} ${selectedCityText.value}`);
    getStoreList();
  }
};
//#endregion

//#region 门店列表和搜索
// 搜索功能
const searchKeyword = ref('');
const storeStatus = ref();
const storeStatusOptions = [
  { value: true, label: '启用' },
  { value: false, label: '禁用' }
];

const handleSearch = () => {
  queryParams.PageIndex = 1; // 重置页码
  getStoreList();
};

// 状态筛选变化
const handleStatusChange = () => {
  queryParams.PageIndex = 1; // 重置页码
  getStoreList();
};

// 显示门店列表
const storeList = ref([]);
const loading = ref(false);
const page = reactive({
  PageIndex: 1,
  PageSize: 3,
  totlePage: 0,
  totleCount: 0
});

// 查询参数对象
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 3,
  StoreName: '',
  Status: undefined as boolean | undefined,
  Address: ''
});

// 获取门店列表
const getStoreList = () => {
  try {
    // 更新查询参数
    queryParams.StoreName = searchKeyword.value;
    queryParams.Status = storeStatus.value;
    
    if (selectedProvince.value && selectedCity.value) {
      queryParams.Address = `${selectedProvinceText.value}${selectedCityText.value}`;
    } else if (selectedProvince.value) {
      queryParams.Address = selectedProvinceText.value;
    } else {
      queryParams.Address = '';
    }
    
    console.log('前端查询参数:', JSON.stringify(queryParams));
    
    loading.value = true;
    StoreManageAPI.getStoreList(queryParams).then((res: any) => {
      console.log('门店列表返回数据:', res);
      if (res && res.data && Array.isArray(res.data)) {
        storeList.value = res.data;
        page.totlePage = res.totlePage || 0;
        page.totleCount = res.totleCount || 0;
      } else if (res && res.items && Array.isArray(res.items)) {
        storeList.value = res.items;
        page.totlePage = res.totalPages || 0;
        page.totleCount = res.totalCount || 0;
      } else {
        storeList.value = [];
        ElMessage.warning('未获取到门店数据');
      }
    }).catch(error => {
      console.error('获取门店列表失败:', error);
      ElMessage.error(`获取门店列表失败: ${error.message || '未知错误'}`);
      storeList.value = [];
    }).finally(() => {
      loading.value = false;
    });
  } catch (e) {
    console.error('获取门店列表异常:', e);
    ElMessage.error('获取门店列表出现异常');
    loading.value = false;
  }
};

// 处理图片URL
const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) {
    return url;
  } else {
    return 'https://localhost:44384' + url;
  }
};

// 处理分页变化
const handlePageChange = (newPage: number) => {
  queryParams.PageIndex = newPage;
  getStoreList();
};

// 添加一个测试功能，获取所有门店数据
const fetchAllStores = () => {
  loading.value = true;
  StoreManageAPI.getStoreList({
    PageIndex: 1,
    PageSize: 10
  }).then((res: any) => {
    console.log('测试获取所有门店数据:', res);
    if (res && res.data && Array.isArray(res.data)) {
      storeList.value = res.data;
      ElMessage.success('成功获取门店数据');
    } else if (res && res.items && Array.isArray(res.items)) {
      storeList.value = res.items;
      ElMessage.success('成功获取门店数据');
    } else {
      ElMessage.warning('未获取到门店数据');
    }
  }).catch(error => {
    console.error('测试获取数据失败:', error);
    ElMessage.error(`测试失败: ${error.message || '未知错误'}`);
  }).finally(() => {
    loading.value = false;
  });
};

const title = ref('新增门店');

// 编辑门店
const editStore = (row: any) => {
  console.log('编辑门店:', row);
  addStoreDialogVisible.value = true;
  title.value = '编辑门店';
  addStoreForm.value.storeName = row.storeName;
  addStoreForm.value.mobile = row.mobile;
  addStoreForm.value.status = row.status;
  addStoreForm.value.introduction = row.introduction;
  addStoreForm.value.note = row.note;
  addStoreForm.value.branchName = row.branchName;
  addStoreForm.value.address = row.address;
  addStoreForm.value.storeImg = row.storeImg;
};

// 切换门店状态
const toggleStoreStatus = (row: any) => {
  console.log('切换门店状态:', row);
  StoreManageAPI.updateStoreStatus(row.id).then(() => {
    ElMessage.success(`门店"${row.storeName}"状态已更新`);
    getStoreList(); // 刷新列表
  }).catch(error => {
    console.error('更新状态失败:', error);
    ElMessage.error(`更新状态失败: ${error.message || '未知错误'}`);
  });
};
//#endregion

// 新增门店
const addStoreDialogVisible = ref(false);
const addStore = () => {
  addStoreDialogVisible.value = true;
  title.value = '新增门店';
};

// 表单相关
interface AddStoreForm {
  "UserId": string,
  "storeName": string,
  "branchName": string,
  "address": string,
  "storeImg": string,
  "mobile": string,
  "status": boolean,
  "introduction": string,
  "note": string
}

const addStoreForm = ref<AddStoreForm>({
  UserId: '',
  storeName: '',
  branchName: '',
  address: '',
  storeImg: '',
  mobile: '',
  status: true,
  introduction: '',
  note: ''
});

// 计算属性：处理图片URL确保正确显示
const storeImgDisplay = computed(() => {
  const imgUrl = addStoreForm.value.storeImg;
  if (!imgUrl) return '';
  
  if (imgUrl.startsWith('data:image')) {
    return imgUrl;
  } else if (imgUrl.startsWith('http')) {
    return imgUrl;
  } else {
    return 'https://localhost:44384' + imgUrl;
  }
});

//#region 高德地图
// 地址选择相关
const storeAddressVisible = ref(false);
const storeAddressTab = ref('province');
const storeProvince = ref('');
const storeCity = ref('');
const storeDistrict = ref('');
const storeProvinceText = ref('');
const storeCityText = ref('');
const storeDistrictText = ref('');
const showMap = ref(false);
const mapSearchText = ref('');
const location = ref({
  longitude: '116.416336',
  latitude: '39.92836'
});

// 计算区县列表
const storeDistrictList = computed(() => {
  if (!storeCity.value) return [];
  
  const province = provinceAndCityData.find(p => p.value === storeProvince.value);
  if (province) {
    const city = province.children?.find(c => c.value === storeCity.value);
    if (city && city.children) {
      return city.children.map(item => ({
        code: item.value,
        name: item.label
      }));
    }
  }
  return [];
});

// 计算完整地址
const storeFullAddress = computed(() => {
  const parts = [];
  if (storeProvinceText.value) parts.push(storeProvinceText.value);
  if (storeCityText.value) parts.push(storeCityText.value);
  if (storeDistrictText.value) parts.push(storeDistrictText.value);
  
  if (mapSearchText.value) {
    parts.push(mapSearchText.value);
  }
  
  return parts.join('');
});

// 选择省份
const selectStoreProvince = (province: AreaItem) => {
  storeProvince.value = province.code;
  storeProvinceText.value = province.name;
  storeCity.value = '';
  storeCityText.value = '';
  storeDistrict.value = '';
  storeDistrictText.value = '';
  storeAddressTab.value = 'city';
  updateStoreAddress();
};

// 选择城市
const selectStoreCity = (city: AreaItem) => {
  storeCity.value = city.code;
  storeCityText.value = city.name;
  storeDistrict.value = '';
  storeDistrictText.value = '';
  storeAddressTab.value = 'district';
  updateStoreAddress();
};

// 选择区县
const selectStoreDistrict = (district: AreaItem) => {
  storeDistrict.value = district.code;
  storeDistrictText.value = district.name;
  storeAddressVisible.value = false;
  updateStoreAddress();
  
  // 选择完区县后，自动展示地图
  addStoreForm.value.address = storeFullAddress.value;
  showMap.value = true;
  
  // 延迟初始化地图，确保DOM已经渲染
  setTimeout(() => {
    initMap();
    
    // 使用高德地图地理编码服务，根据区域名称定位到地图位置
    if (window.AMap && mapInstance) {
      // 创建地理编码实例
      const geocoder = new window.AMap.Geocoder({
        city: storeCityText.value, // 设置城市，提高查询精度
      });
      
      // 拼接完整地址用于地理编码
      const addressToSearch = `${storeProvinceText.value}${storeCityText.value}${storeDistrictText.value}`;
      
      // 通过地理编码获取位置坐标
      geocoder.getLocation(addressToSearch, (status: string, result: any) => {
        if (status === 'complete' && result.info === 'OK') {
          // 获取第一个地理编码结果
          const location = result.geocodes[0].location;
          
          // 更新坐标
          location.value.longitude = location.lng;
          location.value.latitude = location.lat;
          
          // 更新地图中心点
          mapInstance.setCenter([location.lng, location.lat]);
          
          // 更新标记点位置
          if (marker) {
            marker.setPosition([location.lng, location.lat]);
          }
          
          ElMessage.success(`已定位到${storeDistrictText.value}`);
        } else {
          ElMessage.warning('无法精确定位到选择的区域');
        }
      });
    }
  }, 100);
};

// 更新地址输入框
const updateStoreAddress = () => {
  const parts = [];
  if (storeProvinceText.value) parts.push(storeProvinceText.value);
  if (storeCityText.value) parts.push(storeCityText.value);
  if (storeDistrictText.value) parts.push(storeDistrictText.value);
  
  const address = parts.join('/');
  
  // 同时更新表单的地址字段
  if (parts.length > 0) {
    addStoreForm.value.address = address;
  }
};

// 地图选择方法
const showMapSelect = () => {
  if (addStoreForm.value.address) {
    showMap.value = true;
    // 延迟初始化地图，确保DOM已经渲染
    setTimeout(() => {
      initMap();
    }, 100);
  } else {
    // 如果未选择地址，打开地址选择弹窗
    storeAddressVisible.value = true;
  }
};

// 高德地图相关
let mapInstance: any = null;
let marker: any = null;
let geocoder: any = null;
let placeSearch: any = null;

// 加载高德地图
const loadAMap = () => {
  // 如果已经加载过高德地图API，则不再重复加载
  if (window.AMap) {
    initMap();
    return;
  }

  // 设置安全密钥
  window._AMapSecurityConfig = {
    securityJsCode: 'b2ca6887ac24fb337ea41629ebd61f8c',
  };

  // 动态加载高德地图API (使用一个有效的测试Key)
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://webapi.amap.com/maps?v=2.0&key=36a1f565cb56ee2ad4d905c21827e56d&plugin=AMap.Geocoder,AMap.PlaceSearch';
  
  script.onload = () => {
    console.log('高德地图API加载成功');
    initMap();
  };
  
  script.onerror = () => {
    console.error('高德地图API加载失败');
  };
  
  document.head.appendChild(script);
};



// 初始化地图
const initMap = () => {
  // 确保地图容器存在
  const mapContainer = document.getElementById('amap-container');
  if (!mapContainer) {
    //console.error('地图容器不存在');
    return;
  }

  // 如果地图实例已存在，则不再重复初始化
  if (mapInstance) {
    return;
  }

  try {
    // 创建地图实例
    mapInstance = new window.AMap.Map('amap-container', {
      zoom: 13,
      center: [location.value.longitude, location.value.latitude],
      resizeEnable: true
    });

    // 创建标记点
    marker = new window.AMap.Marker({
      position: [location.value.longitude, location.value.latitude],
      draggable: true,
      cursor: 'move',
      title: storeFullAddress.value
    });

    // 将标记点添加到地图
    mapInstance.add(marker);

    // 标记点拖拽结束事件
    marker.on('dragend', (e: any) => {
      const position = e.target.getPosition();
      location.value.longitude = position.lng.toFixed(6);
      location.value.latitude = position.lat.toFixed(6);
      updateAddressFromCoordinates(position.lng, position.lat);
    });

    // 地图点击事件
    mapInstance.on('click', (e: any) => {
      const position = e.lnglat;
      location.value.longitude = position.lng.toFixed(6);
      location.value.latitude = position.lat.toFixed(6);
      
      // 更新标记点位置
      marker.setPosition([position.lng, position.lat]);
      
      // 更新地址
      updateAddressFromCoordinates(position.lng, position.lat);
    });

    // 初始化地理编码服务
    geocoder = new window.AMap.Geocoder({
      city: "全国", // 城市，默认："全国"
      radius: 500 // 范围，默认：500
    });

    // 初始化POI搜索服务
    placeSearch = new window.AMap.PlaceSearch({
      city: '全国',
      pageSize: 1,
      pageIndex: 1
    });

  } catch (error) {
    console.error('初始化地图失败', error);
  }
};

// 更新地址从坐标
const updateAddressFromCoordinates = (lng: number, lat: number) => {
  if (!geocoder) return;
  
  geocoder.getAddress([lng, lat], (status: string, result: any) => {
    if (status === 'complete' && result.info === 'OK') {
      const address = result.regeocode.formattedAddress;
      // 保留选择的省市区，只追加详细位置
      const baseAddress = `${storeProvinceText.value}${storeCityText.value}${storeDistrictText.value}`;
      
      // 从完整地址中提取不包含省市区的部分
      // 由于高德返回的地址可能包含省市区，尝试移除这些部分以避免重复
      let detailAddress = address;
      
      if (address.startsWith(storeProvinceText.value)) {
        detailAddress = address.substring(storeProvinceText.value.length);
      }
      if (detailAddress.startsWith(storeCityText.value)) {
        detailAddress = detailAddress.substring(storeCityText.value.length);
      }
      if (detailAddress.startsWith(storeDistrictText.value)) {
        detailAddress = detailAddress.substring(storeDistrictText.value.length);
      }
      
      // 更新地址
      addStoreForm.value.address = `${baseAddress} ${detailAddress}`;
    } else {
      // 如果逆地理编码失败，则使用坐标
      addStoreForm.value.address = `${storeProvinceText.value}${storeCityText.value}${storeDistrictText.value} (${lng.toFixed(6)},${lat.toFixed(6)})`;
    }
  });
};

// 搜索地址
const handleSearchComplete = () => {
  if (!mapSearchText.value || !placeSearch) {
    ElMessage.warning('请输入搜索关键词');
    return;
  }
  
  placeSearch.search(mapSearchText.value, (status: string, result: any) => {
    if (status === 'complete' && result.info === 'OK') {
      if (result.poiList.pois.length > 0) {
        const poi = result.poiList.pois[0];
        const position = poi.location;
        
        // 更新坐标
        location.value.longitude = position.lng.toFixed(6);
        location.value.latitude = position.lat.toFixed(6);
        
        // 更新标记点位置
        marker.setPosition([position.lng, position.lat]);
        
        // 设置地图中心点
        mapInstance.setCenter([position.lng, position.lat]);
        
        // 更新地址 - 使用省市区加上详细地址
        const baseAddress = `${storeProvinceText.value}${storeCityText.value}${storeDistrictText.value}`;
        const detailAddress = poi.name; // 可以使用poi.name或poi.address，根据实际需求选择
        
        // 更新商户地址字段
        addStoreForm.value.address = `${baseAddress} ${detailAddress}`;
        
        ElMessage.success('搜索位置成功');
      } else {
        ElMessage.warning('未找到匹配的位置');
      }
    } else {
      ElMessage.error('搜索位置失败');
    }
  });
};

// 定位当前位置
const locateCurrentPosition = () => {
  if (!mapInstance) return;
  
  mapInstance.plugin('AMap.Geolocation', () => {
    const geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      buttonPosition: 'RB',
      buttonOffset: new window.AMap.Pixel(10, 20),
      zoomToAccuracy: true,
    });
    
    mapInstance.addControl(geolocation);
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        const position = result.position;
        location.value.longitude = position.lng.toFixed(6);
        location.value.latitude = position.lat.toFixed(6);
        
        // 更新标记点位置
        marker.setPosition([position.lng, position.lat]);
        
        // 更新地址
        updateAddressFromCoordinates(position.lng, position.lat);
        
        ElMessage.success('已定位到当前位置');
      } else {
        ElMessage.error('获取位置失败: ' + result.message);
      }
    });
  });
};
//#endregion

//#region 图片上传相关
const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadLoading = ref(false);

const triggerUpload = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // 检查文件类型
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'].includes(file.type)) {
      ElMessage.error('只支持jpg、jpeg、png和bmp格式的图片');
      return;
    }
    
    // 检查文件大小
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过5M');
      return;
    }
    
    // 上传图片到服务器
    uploadLoading.value = true;
    
    try {
      const formData = new FormData();
      formData.append('files', file); // 注意字段名是 files
      
      try {
        const res = await axios.post('https://localhost:44384/api/FileImg', formData);
        console.log('上传成功', res.data);
        
        if (res.data && res.data.filePaths && res.data.filePaths.length > 0) {
          // 拼接完整图片地址确保显示正确
          const imgUrl = res.data.filePaths[0].startsWith('http') 
            ? res.data.filePaths[0] 
            : 'https://localhost:44384' + res.data.filePaths[0];
          
          addStoreForm.value.storeImg = imgUrl;
          ElMessage.success('图片上传成功');
          
          // 调试信息
          console.log('设置的图片路径:', imgUrl);
        } else {
          ElMessage.error('上传成功但未返回有效的图片路径');
          console.error('返回数据不包含有效的filePaths:', res.data);
        }
      } catch (error) {
        console.error('上传失败', error);
        ElMessage.error(`上传失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    } finally {
      uploadLoading.value = false;
    }
  }
};

const removeImage = () => {
  addStoreForm.value.storeImg = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};
//#endregion
const addStoreFormRef = ref<FormInstance>();
const rules = reactive<FormRules<AddStoreForm>>({
  storeName: [
    { required: true, message: '请输入门店名称', trigger: 'blur' },
    { min: 3, max: 15, message: '长度应该在3到15之间', trigger: 'blur' },
  ],
  branchName: [
  { required: true, message: '请输入分店名称', trigger: 'blur' },
    { min: 2, max: 15, message: '长度应该在2到15之间', trigger: 'blur' },
  ],
  address: [  
    { required: true, message: '请输入地址', trigger: 'blur' },
  ],
  storeImg: [
    { required: true, message: '请上传门店图片', trigger: 'change' },
  ],
  mobile: [
    { required: true, message: '请输入客服电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的电话格式', trigger: 'blur' }
  ],
  introduction: [
    { max: 300, message: '最多输入300个字符', trigger: 'blur' },
  ],
  note: [
    { max: 300, message: '最多输入300个字符', trigger: 'blur' },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', addStoreForm.value)
      // 检查图片是否为Base64格式，如果是则提示用户
      if (addStoreForm.value.storeImg.startsWith('data:image')) {
        ElMessage.warning('您正在使用本地预览的图片，可能无法正常保存。建议先上传图片到服务器。')
        return;
      }
      // 准备提交表单数据
      const formData = { ...addStoreForm.value };
      // 如果图片URL是完整路径，转换为相对路径再提交给后端
      if (formData.storeImg && formData.storeImg.includes('https://localhost:44384')) {
        formData.storeImg = formData.storeImg.replace('https://localhost:44384', '');
      }
      // 设置用户ID
      formData.UserId = store.id;
      console.log('提交数据:', formData);
      StoreManageAPI.addStore(formData).then((res: any) => {
        console.log('提交结果:', res)
        ElMessage.success('新增门店成功')
        addStoreDialogVisible.value = false
        resetForm(formEl)
      }).catch(error => {
        console.error('提交失败:', error)
        ElMessage.error(`提交失败: ${error.message || '未知错误'}`)
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
//#endregion
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.area-selector {
  width: 180px;
}

.area-input {
  cursor: pointer;
}

.filter-item {
  width: 180px;
}

.search-input {
  width: 280px;
  margin-left: auto;
}

.area-content {
  padding: 10px;
}

.province-list,
.city-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.province-item,
.city-item {
  padding: 5px 15px;
  cursor: pointer;
  transition: all 0.3s;
  color: #606266;
}

.province-item:hover,
.city-item:hover {
  color: #409eff;
}

.province-item.active {
  color: #409eff;
  font-weight: bold;
}

.empty-tip {
  color: #909399;
  text-align: center;
  padding: 20px 0;
}

/* 地图相关样式 */
.map-container {
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.map-search {
  padding: 10px;
  background-color: #f5f7fa;
}

.map-tip {
  padding: 5px 10px;
  color: #909399;
  font-size: 12px;
  border-bottom: 1px solid #dcdfe6;
}

.map-content {
  position: relative;
}

.full-width {
  width: 100%;
}

.mock-map {
  position: relative;
  height: 400px;
  background-color: #f0f0f0;
  width: 100%;
}

.map-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.map-marker {
  position: absolute;
  top: 50px;
  left: 50px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-width: 300px;
}

.map-marker span {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.map-marker div {
  font-size: 12px;
  color: #606266;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 50%;
  cursor: pointer;
}

.coordinates {
  display: flex;
  padding: 10px;
  background-color: #f5f7fa;
  justify-content: space-around;
  font-size: 14px;
}

/* 上传图片相关样式 */
.upload-container {
  display: flex;
  margin-bottom: 10px;
}

.preview-image {
  position: relative;
  width: 200px;
  height: 100px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 5px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.preview-image:hover .image-actions {
  opacity: 1;
}

.upload-trigger {
  width: 200px;
  height: 100px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #909399;
}

.upload-trigger:hover {
  border-color: #409eff;
  color: #409eff;
}

.upload-trigger.loading {
  border-color: #409eff;
  color: #409eff;
}

.loading-icon {
  animation: rotating 2s linear infinite;
  font-size: 28px;
  margin-bottom: 8px;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.upload-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.upload-tip .el-icon {
  margin-right: 5px;
  color: #e6a23c;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.el-form :deep(.el-form-item__label-wrap) {
  margin-left: 0;
}

.el-form :deep(.el-form-item__label.is-required)::before {
  margin-right: 4px;
  color: #f56c6c;
  content: '*';
}

.area-tabs {
  padding: 10px;
}

.area-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
}

.area-item {
  padding: 5px 15px;
  cursor: pointer;
  transition: all 0.3s;
  color: #606266;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.area-item:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.area-item.active {
  color: #409eff;
  background-color: #ecf5ff;
  font-weight: bold;
}

.bm-view {
  width: 100%;
  height: 300px;
}

.map-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.coordinates-display {
  margin-top: 8px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
}

.coordinates-display span {
  margin: 2px 0;
}

.amap-container {
  width: 100%;
  height: 400px;
  z-index: 5;
}

/* 分页容器样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
}

.pagination-info {
  margin-right: 15px;
  font-size: 14px;
  color: #606266;
}
</style>
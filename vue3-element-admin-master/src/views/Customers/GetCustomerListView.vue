<template>
  <div>
    <div>
      <el-card
        class="query-card sticky-header"
        shadow="never"
        style="margin-bottom: 24px; width: 100%"
      >
        <div class="filter-card">
          <el-form :inline="true" class="filter-form" label-width="100px">
            <template v-if="isExpand">
              <!-- 第一行label -->
              <div class="filter-row label-row">
                <div class="filter-row label-row">客户信息(姓名、会员卡号、手机号)</div>
                <div class="filter-label"></div>
                <div class="filter-label">客户类型</div>
              </div>
              <!-- 第一行输入框 -->
              <div class="filter-row input-row">
                <el-select v-model="filters.infoType" style="width: 110px; height: 45px">
                  <el-option label="会员卡号" value="cardNo" />
                  <el-option label="手机号" value="phone" />
                  <el-option label="微信昵称" value="nickname" />
                  <el-option label="姓名" value="name" />
                </el-select>
                <el-input
                  v-model="filters.infoValue"
                  placeholder="请输入"
                  style="width: 140px; margin-left: 22px; height: 45px"
                />

                <el-select
                  v-model="filters.CustomerType"
                  placeholder="请选择客户类型"
                  style="width: 180px; margin-left: 16px; height: 45px"
                >
                  <el-option label="不限" value="" />
                  <el-option
                    v-for="item in customerTypeOptions"
                    :key="item.id"
                    :label="item.customerTypeName"
                    :value="item.id"
                  />
                </el-select>
              </div>
              <!-- 第二行label -->
              <div class="filter-row label-row">
                <div class="filter-label">性别</div>
                <div class="filter-label">&nbsp;开卡时间</div>
              </div>
              <!-- 第二行输入框 -->
              <div class="filter-row input-row">
                <el-select
                  v-model="filters.Gender"
                  placeholder="不限"
                  style="width: 120px; height: 32px"
                >
                  <el-option label="不限" value="" />
                  <el-option label="男" :value="0" />
                  <el-option label="女" :value="1" />
                </el-select>
                <el-date-picker
                  v-model="filters.openCardTime"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  class="open-card-date"
                  style="width: 220px; margin-left: 20px; height: 32px"
                  :clearable="true"
                  :editable="false"
                  range-separator="~"
                  size="small"
                />
              </div>
              <!-- 按钮区 -->
              <div class="filter-row flex-row" style="margin-top: 8px">
                <div>
                  <el-button @click="handleExportCustomers">导出客户数据</el-button>
                  <el-button @click="handleBatchAddTags">打标签</el-button>
                  <el-button @click="openEditLevelDialog">修改等级</el-button>
                  <el-button @click="handleBatchFreeze">冻结</el-button>
                  <el-button @click="handleBatchUnfreeze">解冻</el-button>
                  <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
                  <el-button @click="showImportDialog = true">导入客户</el-button>
                </div>
                <div class="flex-row-right">
                  <el-button v-if="hasAction('标签管理')" @click="goToTagManagement">
                    标签管理
                  </el-button>
                  <!-- <el-button v-if="hasAction('同步粉丝')">同步粉丝</el-button> -->
                  <el-button @click="toggleExpand">收起</el-button>
                  <el-button @click="onSearch">搜索</el-button>
                  <el-button @click="resetFilters">清空</el-button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="filter-row flex-row">
                <div class="flex-row-left">
                  <el-select v-model="filters.infoType">
                    <el-option label="会员卡号" value="cardNo" />
                    <el-option label="手机号" value="phone" />
                    <el-option label="微信昵称" value="nickname" />
                    <el-option label="姓名" value="name" />
                  </el-select>
                  <el-input v-model="filters.infoValue" placeholder="请输入关键词" />
                  <el-button
                    icon="el-icon-search"
                    circle
                    class="search-btn"
                    @click="onSearch"
                  ></el-button>
                  <el-button class="expand-btn" @click="toggleExpand">展开</el-button>
                </div>
                <div class="flex-row-right">
                  <el-button v-if="hasAction('标签管理')" @click="goToTagManagement">
                    标签管理
                  </el-button>
                  <!--  <el-button v-if="hasAction('同步粉丝')">同步粉丝</el-button> -->
                </div>
              </div>
              <div class="filter-row ops-row">
                <el-button @click="handleExportCustomers">导出客户数据</el-button>
                <el-button @click="handleBatchAddTags">打标签</el-button>
                <el-button @click="openEditLevelDialog">修改等级</el-button>
                <el-button @click="handleBatchFreeze">冻结</el-button>
                <el-button @click="handleBatchUnfreeze">解冻</el-button>
                <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
                <el-button @click="showImportDialog = true">导入客户</el-button>
              </div>
            </template>
          </el-form>
        </div>
      </el-card>

      <el-card class="table-card" shadow="never">
        <!-- 客户信息表格 -->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column label="客户信息" width="180">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-avatar :size="40" :src="scope.row.avatar" />
                <div style="margin-left: 8px">
                  <div>昵称：{{ scope.row.customerNickName || "--" }}</div>
                  <div>
                    姓名：
                    <b>{{ scope.row.customerName }}</b>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="身份等级" width="120">
            <template #default="scope">
              <div>
                <div>
                  <template v-if="scope.row.status === false">
                    <span class="frozen-tag">已冻结</span>
                  </template>
                  <template v-else>
                    {{ scope.row.customerTypeName }}
                  </template>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标签" min-width="150">
            <template #default="scope">
              <div class="tag-container">
                <div v-if="scope.row.labels && scope.row.labels.length > 0" class="tag-list">
                  <el-tag
                    v-for="tag in scope.row.labels"
                    :key="tag.labelId"
                    size="small"
                    :type="getTagType(tag.tagType)"
                    class="tag-item"
                  >
                    {{ tag.labelName }}
                  </el-tag>
                </div>
                <el-link type="primary" class="add-tag-link" @click="openAddTagDialog(scope.row)">
                  <el-icon class="add-icon"><Plus /></el-icon>
                  添加标签
                </el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="卡号" prop="id" min-width="130" show-overflow-tooltip>
            <template #default="scope">
              <div class="card-number-container">
                <div class="card-number-text">{{ scope.row.id.slice(0, 18) }}</div>
                <div class="card-number-text">{{ scope.row.id.slice(18) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手机" prop="phoneNumber" width="120" align="center" />
          <el-table-column label="可用余额" prop="availableBalance" align="center" width="100">
            <template #default="scope">
              <span>￥{{ Math.floor(scope.row.availableBalance || 0) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="可用积分" prop="availablePoints" align="center" width="100">
            <template #default="scope">{{ Math.floor(scope.row.availablePoints || 0) }}</template>
          </el-table-column>
          <el-table-column
            label="累计消费金额"
            prop="accumulativeconsumption"
            align="center"
            width="120"
          >
            <template #default="scope">
              ￥{{ Number(scope.row.accumulativeconsumption || 0).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="累计消费次数" prop="comsumerNumber" align="center" width="120" />
          <el-table-column label="操作" width="260" fixed="right">
            <template #default="scope">
              <el-link type="primary" @click="goToDetail(scope.row)">详情</el-link>

              <el-divider direction="vertical" />
              <el-link
                v-if="scope.row.status !== false"
                type="danger"
                @click="handleFreeze(scope.row)"
              >
                冻结
              </el-link>
              <el-link
                v-if="scope.row.status === false"
                type="success"
                @click="handleUnfreeze(scope.row)"
              >
                解冻
              </el-link>
              <el-divider direction="vertical" />
              <el-link
                :type="scope.row.status === false ? 'info' : 'primary'"
                :disabled="scope.row.status === false"
                @click="
                  scope.row.status === false ? showFrozenMessage() : handleSetLevel(scope.row)
                "
              >
                设置等级
              </el-link>
              <el-divider direction="vertical" />
              <el-link
                :type="scope.row.status === false ? 'info' : 'primary'"
                :disabled="scope.row.status === false"
                @click="
                  scope.row.status === false ? showFrozenMessage() : openGivePointsDialog(scope.row)
                "
              >
                送积分
              </el-link>
              <el-divider direction="vertical" />
              <el-link v-if="scope.row.status !== false" @click="openRechargeDialog(scope.row)">
                充值
              </el-link>
              <el-link
                v-if="scope.row.status === false"
                type="info"
                disabled
                @click="showFrozenMessage()"
              >
                充值
              </el-link>
              <el-divider direction="vertical" />
              <el-link v-if="scope.row.status !== false" @click="openConsumeDialog(scope.row)">
                消费
              </el-link>
              <el-link
                v-if="scope.row.status === false"
                type="info"
                disabled
                @click="showFrozenMessage()"
              >
                消费
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页控件 -->
        <div style="margin: 20px 0; text-align: right">
          <el-pagination
            v-model:current-page="page.PageIndex"
            v-model:page-size="page.PageSize"
            :page-sizes="[5, 10, 20, 50]"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.totleCount"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-card>

      <!-- 添加客户弹窗 -->
      <el-dialog
        v-model="showAddDialog"
        title="添加客户"
        width="620px"
        :close-on-click-modal="false"
        align-center
      >
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addRules"
          label-width="120px"
          class="add-customer-form"
        >
          <el-form-item label="客户类型" prop="customerType" required>
            <el-radio-group v-model="addForm.customerType">
              <el-radio :label="customerKindGuid.member">会员</el-radio>
              <el-radio :label="customerKindGuid.normal">普通客户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户姓名" prop="customerName" required>
            <el-input v-model="addForm.customerName" maxlength="16" placeholder="不超过16个字符" />
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNumber" required>
            <el-input v-model="addForm.phoneNumber" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item
            v-if="addForm.customerType === customerKindGuid.member"
            label="成长值"
            prop="growthValue"
          >
            <el-input
              v-model="addForm.growthValue"
              placeholder="不填为零，上限10亿"
              maxlength="10"
            />
          </el-form-item>
          <el-form-item
            v-if="addForm.customerType === customerKindGuid.member"
            label="可用实充余额"
            prop="availableBalance"
          >
            <el-input
              v-model="addForm.availableBalance"
              placeholder="不填为零，上限95万"
              maxlength="8"
            />
          </el-form-item>
          <el-form-item
            v-if="addForm.customerType === customerKindGuid.member"
            label="可用赠送余额"
            prop="availableGiftBalance"
          >
            <el-input
              v-model="addForm.availableGiftBalance"
              placeholder="不填为零，上限95万"
              maxlength="8"
            />
          </el-form-item>
          <el-form-item
            v-if="addForm.customerType === customerKindGuid.member"
            label="可用积分"
            prop="availablePoints"
          >
            <el-input
              v-model="addForm.availablePoints"
              placeholder="不填为零，上限10亿"
              maxlength="10"
            />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="addForm.gender" placeholder="请选择">
              <el-option label="男" :value="0" />
              <el-option label="女" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="addForm.birthday"
              type="date"
              placeholder="请选择日期"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="地址" prop="region">
            <el-cascader
              v-model="addForm.region"
              :options="regionOptions"
              :props="{ value: 'label', label: 'label', children: 'children' }"
              placeholder="请选择省市区"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label=" " prop="address">
            <el-input
              v-model="addForm.address"
              type="textarea"
              :maxlength="20"
              show-word-limit
              placeholder="请输入详细地址"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAddForm">确定</el-button>
        </template>
      </el-dialog>

      <!-- 会员等级弹窗 -->
      <el-dialog
        v-model="showEditLevelDialog"
        title="会员等级"
        width="600px"
        :close-on-click-modal="false"
        :show-close="true"
        align-center
      >
        <el-form
          ref="editLevelFormRef"
          :model="editLevelForm"
          :rules="editLevelRules"
          label-width="160px"
          style="margin: 40px 0 20px 0; display: flex; flex-direction: column; align-items: center"
        >
          <el-form-item
            label="请选择会员等级："
            prop="customerType"
            required
            style="width: 100%; justify-content: center"
          >
            <el-select
              v-model="editLevelForm.customerType"
              placeholder="请选择"
              style="width: 300px"
              filterable
              clearable
            >
              <el-option
                v-for="item in customerTypeOptions"
                :key="item.id"
                :label="item.customerTypeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer center-footer">
            <el-button @click="showEditLevelDialog = false">取消</el-button>
            <el-button type="primary" @click="submitEditLevel()">确定</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 会员充值弹窗 -->
      <el-dialog
        v-model="showRechargeDialog"
        title="充值"
        width="750px"
        :close-on-click-modal="false"
        align-center
      >
        <div class="simple-form-item">
          <div class="simple-form-label">客户信息：</div>
          <div class="simple-form-content customer-info">{{ rechargeForm.customerName }}</div>
        </div>

        <div class="simple-form-item">
          <div class="simple-form-label required">充值金额：</div>
          <div class="simple-form-content">
            <div class="input-wrapper">
              <el-input v-model="rechargeForm.amount" placeholder="0" class="amount-input">
                <template #suffix>元</template>
              </el-input>
              <div v-show="invalidRechargeAmount" class="validation-message">
                请输入0.01-950000之间的数，最多两位小数
              </div>
            </div>
          </div>
        </div>

        <div class="simple-form-item">
          <div class="simple-form-label">备注：</div>
          <div class="simple-form-content">
            <el-input
              v-model="rechargeForm.remark"
              type="textarea"
              :maxlength="30"
              show-word-limit
              placeholder="最多30个字"
              class="remark-textarea"
            />
          </div>
        </div>

        <div class="simple-form-item">
          <div class="simple-form-label">操作员：</div>
          <div class="simple-form-content operator-info">{{ rechargeForm.operatorId }}</div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showRechargeDialog = false">取 消</el-button>
            <el-button type="primary" @click="submitRecharge">确 定</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 客户消费弹窗 -->
      <el-dialog
        v-model="showConsumeDialog"
        title="客户消费"
        width="750px"
        :close-on-click-modal="false"
        align-center
      >
        <div class="simple-form-item">
          <div class="simple-form-label">客户信息：</div>
          <div class="simple-form-content customer-info">
            {{ consumeForm.customerName }}
            <span class="balance-info">
              （可用实充金额{{ Math.floor(consumeForm.availableBalance ?? 0) }} 元，可用赠送余额{{
                Math.floor(consumeForm.giftBalance ?? 0)
              }}
              元）
            </span>
          </div>
        </div>
        <div class="simple-form-item">
          <div class="simple-form-label required">消费金额：</div>
          <div class="simple-form-content">
            <div class="input-wrapper">
              <el-input v-model="consumeForm.sumofconsume" placeholder="0" class="amount-input">
                <template #suffix>元</template>
              </el-input>
              <div v-show="invalidAmount" class="validation-message">
                请输入0.01-950000之间的数，最多两位小数
              </div>
              <div v-show="insufficientBalance" class="insufficient-balance">会员余额不足</div>
            </div>
          </div>
        </div>
        <div class="simple-form-item">
          <div class="simple-form-label">备注：</div>
          <div class="simple-form-content">
            <el-input
              v-model="consumeForm.consumerDesc"
              type="textarea"
              :maxlength="30"
              show-word-limit
              placeholder="最多30个字"
              class="remark-textarea"
            />
          </div>
        </div>
        <div class="simple-form-item">
          <div class="simple-form-label">操作员：</div>
          <div class="simple-form-content operator-info">
            {{ consumeForm.operatorId || "17376144917" }}
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showConsumeDialog = false">取消</el-button>
            <el-button type="primary" @click="submitConsume">确定</el-button>
          </div>
        </template>

      </el-table-column>
      <el-table-column label="标签" width="120">
        <template #default="">
          <el-link type="primary">添加标签</el-link>
        </template>
      </el-table-column>
      <el-table-column label="卡号" prop="id" width="170" />
      <el-table-column label="手机" prop="phoneNumber" align="center" />
      <el-table-column label="可用余额" prop="availableBalance" align="center">
        <template #default="scope">
          <span>￥{{ scope.row.availableBalance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用积分" prop="availablePoints" align="center">
        <template #default="scope">￥{{ scope.row.availablePoints }}</template>
      </el-table-column>
      <el-table-column label="累计消费金额" prop="accumulativeconsumption" align="center" />
      <el-table-column label="累计消费次数" prop="comsumerNumber" align="center" />
      <el-table-column label="操作" width="260">
        <template #default="scope">
          <el-link type="primary">详情</el-link>
          <el-divider direction="vertical" />
          <el-link v-if="scope.row.status !== false" type="danger" @click="handleFreeze(scope.row)">
            冻结
          </el-link>
          <el-link
            v-if="scope.row.status === false"
            type="success"
            @click="handleUnfreeze(scope.row)"

      </el-dialog>

      <!-- 送积分弹窗 -->
      <el-dialog
        v-model="showGivePointsDialog"
        title="手动修改积分"
        width="650px"
        :close-on-click-modal="false"
        align-center
      >
        <div style="margin-bottom: 16px">
          <div style="padding-left: 65px; font-size: 14px; color: #606266; margin-bottom: 8px">
            客户信息： 客户：{{ givePointsForm.customerName }}，等级：{{ givePointsForm.level }}
          </div>

          <div
            style="
              padding-left: 140px;
              font-size: 12px;
              color: #606266;
              line-height: 22px;
              margin-top: 4px;
            "

          >
            余额：{{ Math.floor(givePointsForm.balance || 0) }}，积分：{{
              Math.floor(givePointsForm.availablePoints || 0)
            }}
          </div>
        </div>
        <el-form :model="givePointsForm" label-width="140px">
          <!-- 调整 label-width -->
          <el-form-item label="修改积分(增减)" required>
            <!-- 确保 required 存在以显示红星 -->
            <el-input
              v-model="givePointsForm.accumulativeintegral"
              type="number"
              style="width: 200px"
            />
          </el-form-item>
          <div style="color: #909399; margin-bottom: 12px; padding-left: 160px">
            <!-- 调整 margin-left -->
            可用积分{{
              Math.floor(givePointsForm.availablePoints || 0)
            }},输入500，表示增加500，表示减少500
          </div>
          <el-form-item label="操作员">
            <span>{{ givePointsForm.operator }}</span>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              v-model="givePointsForm.pointsmodifydesc"
              type="textarea"
              maxlength="100"
              show-word-limit
              style="width: 200px"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showGivePointsDialog = false">取消</el-button>
          <el-button type="primary" :loading="givePointsLoading" @click="handleGivePoints">
            确定
          </el-button>
        </template>
      </el-dialog>
    </div>
    <!-- 导入客户弹窗 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入客户"
      width="400px"
      :close-on-click-modal="false"
      align-center
    >
      <el-upload
        class="upload-demo"
        :action="importCustomersUrl"
        :headers="uploadHeaders"
        :show-file-list="false"
        :on-success="handleImportSuccess"
        :on-error="handleImportError"
        accept=".xlsx,.xls"
        :before-upload="beforeUpload"
      >
        <el-button type="primary">选择Excel文件上传</el-button>
      </el-upload>
      <template #footer>
        <el-button @click="showImportDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 添加标签弹窗 -->
    <el-dialog
      v-model="showAddTagDialog"
      title="添加标签"
      width="500px"
      :close-on-click-modal="false"
      align-center
    >
      <div class="tag-dialog-content">
        <!-- 搜索框 -->
        <el-input
          v-model="tagSearchKeyword"
          placeholder="标签名称"
          class="tag-search-input"
          :prefix-icon="Search"
          clearable
        />

        <!-- 标签列表 -->
        <el-table
          :loading="tagLoading"
          :data="tagList"
          style="width: 100%"
          @selection-change="handleTagSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="labelName" label="标签名称" />
          <el-table-column prop="tagType" label="标签类型" width="100" align="center">
            <template #default="scope">
              {{ scope.row.tagType === 0 ? "手动标签" : "条件标签" }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <span class="total-text">共 {{ tagPage.total }} 条</span>
          <el-pagination
            v-model:current-page="tagPage.current"
            v-model:page-size="tagPage.pageSize"
            :page-sizes="[10, 20, 50]"
            :total="tagPage.total"
            layout="prev, pager, next"
            @size-change="handleTagSizeChange"
            @current-change="handleTagPageChange"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddTagDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddTags">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// ===================== 客户列表页面 =====================

// 引入相关依赖
import { ref, onMounted, watch, reactive, onActivated, onDeactivated } from "vue";
import {
  addCustomer,
  getCustomerList,
  getCustomerTypeList,
  updateCustomerLevel,
  exportCustomerData,
  rechargeCustomerBalance,
  customerConsume,
  updateCustomerStatus,
  giveCustomerPoints,
  getLabelList,
  getCustomerLabels,
  addCustomerLabels,
} from "@/api/system/customer.api";
import { regionData } from "element-china-area-data";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Search, Plus } from "@element-plus/icons-vue";

const router = useRouter();
// #region 操作权限相关
import { useMenuStore } from "@/store";
import { useRoute } from "vue-router";
import { computed } from "vue";
const menuStore = useMenuStore();
const route = useRoute();
const actions = computed(() => menuStore.getActionsByPath(route.path));
console.log("actions", actions.value);

function hasAction(actionName: string) {
  return actions.value.some((a) => a.name === actionName);
}
// #endregion

// 客户类型常量
const customerKindGuid = {
  member: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  normal: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
};

// 添加一个标志来跟踪页面是否需要刷新
const needRefresh = ref(false);

// 控制筛选条件展开/收起
const isExpand = ref(false);
const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};

// ===================== 分页与筛选 =====================
// 当前页码
const pageIndex = ref(1); // 当前页码
// 查询条件对象
const filters = ref({
  CustomerNickName: "",
  CustomerType: "",
  CustomerName: "",
  PhoneNumber: "",
  Gender: "",
  openCardTime: [],
  infoType: "cardNo", // 默认改为卡号查询
  infoValue: "",
  Id: "", // 添加ID字段
});

// ===================== 分页参数对象 =====================
const page = reactive({
  PageIndex: 1,
  PageSize: 5,
  totleCount: 0,
  totlePage: 0,
});

// ===================== 客户数据 =====================
// 定义客户类型接口
interface Customer {
  id: string;
  customerName: string;
  customerNickName: string;
  [key: string]: any;
}

// 客户表格数据
const tableData = ref<Customer[]>([]);

// 完全替换函数
// 获取客户列表数据（带分页）
const fetchCustomerList = async () => {
  try {
    const params = buildQueryParams();
    const response = await getCustomerList(params);
    console.log("客户列表API返回数据结构:", response);

    const apiResponse = response as any;

    if (apiResponse) {
      const customerList = apiResponse.data || [];

      // 获取每个客户的标签
      for (const customer of customerList) {
        try {
          const labelsResponse = await getCustomerLabels(customer.id);
          customer.labels = labelsResponse.data || [];
        } catch (error) {
          console.error(`获取客户${customer.id}的标签失败:`, error);
          customer.labels = [];
        }
      }

      tableData.value = customerList;

      if (typeof apiResponse.totleCount === "number") {
        page.totleCount = apiResponse.totleCount;
      }

      if (typeof apiResponse.totlePage === "number") {
        page.totlePage = apiResponse.totlePage;
      }
    }
  } catch (error) {
    console.error("获取客户列表失败", error);
    ElMessage.error("获取客户列表失败");
  }
};
const goToDetail = (row: any) => {
  console.log("Going to customer detail:", row.id);
  // Use replace instead of push for better navigation
  router.push(`/customers/detail/${row.id}`);
};
// 构建查询参数（只传递有值的参数，分页参数必传）
function buildQueryParams() {
  const params: Record<string, any> = {};
  // 处理 infoType
  if (filters.value.infoType && filters.value.infoValue) {
    if (filters.value.infoType === "phone") params.PhoneNumber = filters.value.infoValue;
    if (filters.value.infoType === "nickname") params.CustomerNickName = filters.value.infoValue;
    if (filters.value.infoType === "name") params.CustomerName = filters.value.infoValue;
    if (filters.value.infoType === "cardNo") params.Id = filters.value.infoValue;
  }
  if (filters.value.CustomerType) params.CustomerType = filters.value.CustomerType;
  if (filters.value.Gender !== "" && filters.value.Gender !== undefined)
    params.Gender = filters.value.Gender;
  if (filters.value.openCardTime && filters.value.openCardTime.length === 2) {
    params.StartTime = filters.value.openCardTime[0];
    params.EndTime = filters.value.openCardTime[1];
  }
  // 分页参数必传
  params.PageIndex = page.PageIndex;
  params.PageSize = page.PageSize;
  return params;
}

// 页码变化
function handleCurrentChange(val: number) {
  page.PageIndex = val;
  fetchCustomerList();
}
// 每页条数变化
function handleSizeChange(val: number) {
  page.PageSize = val;
  page.PageIndex = 1;
  fetchCustomerList();
}

// 搜索按钮点击事件，自动跳转到第一页
const onSearch = () => {
  page.PageIndex = 1;
  fetchCustomerList();
};

// 移除未用的 handlePagination 方法
// function handlePagination(payload: { page: number; limit: number }) {
//   pageIndex.value = payload.page;
//   pageSize.value = payload.limit;
//   fetchCustomerList();
// }

// ===================== 客户类型选项 =====================
const customerTypeOptions = ref();

const fetchCustomerTypeOptions = async () => {
  const res = await getCustomerTypeList();
  if (res) {
    customerTypeOptions.value = res;
  }
};

// ===================== 多选相关 =====================
const selectedCustomerIds = ref<string[]>([]); // 选中的客户ID集合

// 页面挂载时初始化数据
onMounted(() => {
  fetchCustomerList();
  fetchCustomerTypeOptions();
  console.log("当前路由path:", route.path);
  console.log("actions:", actions.value);
  console.log("菜单:", menuStore.menuList);
});

// ===================== 添加客户弹窗相关 =====================
// 控制添加客户弹窗显示
const showAddDialog = ref(false);
// 添加客户表单ref
const addFormRef = ref();
// 添加客户表单数据
const addForm = ref({
  customerNickName: "",
  customerType: customerKindGuid.member,
  customerName: "",
  phoneNumber: "",
  growthValue: null,
  availableBalance: null,
  availableGiftBalance: null,
  availablePoints: null,
  gender: 0,
  birthday: "",
  region: [],
  address: "",
});
// 地区选项
const regionOptions = ref(regionData);
// 添加客户表单校验规则
const addRules = {
  customerType: [{ required: true, message: "请选择客户类型", trigger: "change" }],
  customerName: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
  phoneNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
};
// 提交添加客户表单
const submitAddForm = () => {
  addFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    // 组装省市区为city字段，格式化birthday为日期
    const { region, birthday, ...rest } = addForm.value;
    let birthdayStr = "";
    if (birthday) {
      if (typeof birthday === "string") {
        birthdayStr = birthday.slice(0, 10);
      } else if (Object.prototype.toString.call(birthday) === "[object Date]") {
        birthdayStr = (birthday as Date).toISOString().slice(0, 10);
      }
    }
    // customerNickName 必须有值，若为空则用 customerName 代替
    let customerNickName = rest.customerNickName;
    if (!customerNickName || customerNickName.trim() === "") {
      customerNickName = rest.customerName || "客户";
    }
    const params: Record<string, any> = {
      ...rest,
      customerNickName,
      city: (region || []).join(" "),
      birthday: birthdayStr,
      address: addForm.value.address,
    };
    // 移除值为null、undefined、空字符串的字段
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined || params[key] === "") {
        delete params[key];
      }
    });
    await addCustomer(params);
    showAddDialog.value = false;
    ElMessage.success("添加客户成功！");
    fetchCustomerList();
  });
};

// ===================== 等级修改弹窗相关 =====================
const showEditLevelDialog = ref(false); // 控制等级弹窗显示
const editLevelForm = ref({ customerType: "" }); // 等级表单数据
const editLevelFormRef = ref(); // 等级表单ref
const editLevelRules = {
  customerType: [{ required: true, message: "请选择会员等级", trigger: "change" }],
};
// 选中项变化
function handleSelectionChange(selection: any[]) {
  selectedCustomerIds.value = selection.map((item) => item.id);
  console.log("handleSelectionChange", selection, selectedCustomerIds.value);
}
// 打开等级弹窗
function openEditLevelDialog(row?: any) {
  if (row && selectedCustomerIds.value.length === 0) {
    selectedCustomerIds.value = [row.id];
  } else if (selectedCustomerIds.value.length === 0) {
    ElMessage.warning("请先选择要修改的客户！");
    return;
  }
  editLevelForm.value.customerType = "";
  showEditLevelDialog.value = true;
}
// 提交等级修改
async function submitEditLevel() {
  if (selectedCustomerIds.value.length === 0) {
    ElMessage.warning("请先选择要修改的客户！");
    return;
  }
  editLevelFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning("请完整选择等级后再提交！");
      return;
    }
    await updateCustomerLevel(selectedCustomerIds.value, editLevelForm.value.customerType);
    showEditLevelDialog.value = false;
    ElMessage.success("修改成功！");
    fetchCustomerList();
  });
}

// ===================== 其它操作 =====================
// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    CustomerNickName: "",
    CustomerType: "",
    CustomerName: "",
    PhoneNumber: "",
    Gender: "",
    openCardTime: [],
    infoType: "cardNo", // 默认改为卡号查询
    infoValue: "",
    Id: "", // 添加ID字段
  };
  pageIndex.value = 1;
  fetchCustomerList();
};

/**
 * 导出客户数据功能
 * 根据当前筛选条件导出客户数据到Excel文件
 */
const handleExportCustomers = async () => {
  try {
    // 构建与当前列表查询相同的筛选参数
    const params = buildQueryParams();
    // 调用API获取文件数据流
    const response = await exportCustomerData(params);
    // 验证响应数据
    if (!response.data) {
      ElMessage.error("导出失败：未获取到数据");
      return;
    }
    // 生成包含日期的文件名
    const date = new Date();
    const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    const timeString = `${date.getHours().toString().padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}`;
    const filename = `客户数据_${dateString}_${timeString}.xlsx`;
    // 将响应数据转换为Excel文件blob对象
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // 下载文件
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    // 显示成功消息，添加文件名提示
    ElMessage.success(`导出成功，文件名：${filename}`);
  } catch (error: any) {
    // 错误处理与反馈
    console.error("导出客户数据失败", error);
    if (error.response) {
      ElMessage.error(`导出失败：服务器返回 ${error.response.status} 错误`);
    } else if (error.request) {
      ElMessage.error("导出失败：服务器无响应，请检查网络连接");
    } else {
      ElMessage.error(`导出失败：${error.message || "未知错误"}`);
    }
  }
};

/**
 * 跳转到标签管理页面
 */
const goToTagManagement = () => {
  router.push("/customers/tags-management");
};

// ===================== 充值弹窗相关 =====================
// 控制充值弹窗显示
const showRechargeDialog = ref(false);
// 充值表单数据
const rechargeForm = ref({
  customerId: "",
  customerName: "",
  amount: "",
  remark: "",
  operatorId: "17376144917", // 这里应该从登录用户信息中获取
});
// 充值金额校验
const invalidRechargeAmount = ref(false);
// 监听充值金额变化，检查金额是否有效
watch(
  () => rechargeForm.value.amount,
  (newValue) => {
    if (showRechargeDialog.value) {
      const amount = parseFloat(newValue || "0");
      invalidRechargeAmount.value = !!(
        newValue &&
        (isNaN(amount) || amount < 0.01 || amount > 950000 || !/^\d+(\.\d{1,2})?$/.test(newValue))
      );
    }
  }
);
// 打开充值弹窗
const openRechargeDialog = (row: any) => {
  rechargeForm.value = {
    customerId: row.id,
    customerName: row.customerName || row.customerNickName || "未知客户",
    amount: "",
    remark: "",
    operatorId: row.phoneNumber,
  };
  invalidRechargeAmount.value = false;
  showRechargeDialog.value = true;
};
// 提交充值
const submitRecharge = async () => {
  if (!rechargeForm.value.amount) {
    ElMessage.warning("请输入充值金额");
    return;
  }
  const amount = parseFloat(rechargeForm.value.amount);
  if (isNaN(amount) || amount < 0.01 || amount > 950000) {
    ElMessage.warning("请输入0.01-950000之间的数");
    return;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(rechargeForm.value.amount)) {
    ElMessage.warning("金额最多支持两位小数");
    return;
  }
  try {
    await rechargeCustomerBalance({
      id: rechargeForm.value.customerId,
      availableBalance: amount,
      rechargeamount: amount,
      customerDesc: rechargeForm.value.remark || "",
    });
    ElMessage.success("充值成功");
    showRechargeDialog.value = false;
    fetchCustomerList();
  } catch (error) {
    console.error("充值失败", error);
    ElMessage.error("充值失败，请重试");
  }
};

// ===================== 消费弹窗相关 =====================
const showConsumeDialog = ref(false); // 控制消费弹窗显示
const consumeForm = ref({
  customerId: "",
  customerName: "",
  sumofconsume: "",
  consumerDesc: "",
  availableBalance: undefined,
  giftBalance: undefined,
  operatorId: "17376144917",
});
const insufficientBalance = ref(false); // 余额不足标志
const invalidAmount = ref(false); // 金额无效标志
// 监听消费金额变化，检查余额是否足够和金额是否有效
watch(
  () => consumeForm.value.sumofconsume,
  (newValue) => {
    if (showConsumeDialog.value) {
      const amount = parseFloat(newValue || "0");
      const availableBalance = parseFloat(consumeForm.value.availableBalance || "0");
      const giftBalance = parseFloat(consumeForm.value.giftBalance || "0");
      invalidAmount.value = !!(
        newValue &&
        (isNaN(amount) || amount < 0.01 || amount > 950000 || !/^\d+(\.\d{1,2})?$/.test(newValue))
      );
      if (!invalidAmount.value) {
        insufficientBalance.value =
          !isNaN(amount) && amount > 0 && amount > availableBalance + giftBalance;
      } else {
        insufficientBalance.value = false;
      }
    }
  }
);
// 打开消费弹窗
const openConsumeDialog = (row: any) => {
  consumeForm.value = {
    customerId: row.id,
    customerName: row.customerName || row.customerNickName || "未知客户",
    sumofconsume: "",
    consumerDesc: "",
    availableBalance: row.availableBalance,
    giftBalance: row.availableGiftBalance,
    operatorId: row.phoneNumber,
  };
  insufficientBalance.value = false;
  invalidAmount.value = false;
  showConsumeDialog.value = true;
};
// 提交消费
const submitConsume = async () => {
  if (!consumeForm.value.sumofconsume) {
    ElMessage.warning("请输入消费金额");
    return;
  }
  const amount = parseFloat(consumeForm.value.sumofconsume);
  if (isNaN(amount) || amount < 0.01 || amount > 950000) {
    ElMessage.warning("请输入0.01-950000之间的数");
    return;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(consumeForm.value.sumofconsume)) {
    ElMessage.warning("金额最多支持两位小数");
    return;
  }
  const availableBalance = parseFloat(consumeForm.value.availableBalance || "0");
  const giftBalance = parseFloat(consumeForm.value.giftBalance || "0");
  if (amount > availableBalance + giftBalance) {
    ElMessage.warning("会员余额不足");
    return;
  }
  try {
    await customerConsume({
      id: consumeForm.value.customerId,
      availableBalance,
      availableGiftBalance: giftBalance,
      sumofconsumption: amount,
      consumerNumber: 0,
      consumerDesc: consumeForm.value.consumerDesc || "",
      accumulativeconsumption: 0, // 或实际累计金额
    });
    ElMessage.success("消费成功");
    showConsumeDialog.value = false;
    fetchCustomerList();
  } catch (error) {
    console.error("消费失败", error);
    ElMessage.error("消费失败，请重试");
  }
};

// ===================== 冻结/解冻相关 =====================
// 冻结客户
const handleFreeze = async (row: any) => {
  try {
    await updateCustomerStatus([row.id], false);
    ElMessage.success("冻结成功");
    fetchCustomerList();
  } catch {
    ElMessage.error("冻结失败");
  }
};
// 解冻客户
const handleUnfreeze = async (row: any) => {
  try {
    await updateCustomerStatus([row.id], true);
    ElMessage.success("解冻成功");
    fetchCustomerList();
  } catch {
    ElMessage.error("解冻失败");
  }
};
// 批量冻结
const handleBatchFreeze = async () => {
  if (!selectedCustomerIds.value.length) {
    ElMessage.warning("请先选择客户");
    return;
  }
  await updateCustomerStatus(selectedCustomerIds.value, false);
  ElMessage.success("批量冻结成功");
  fetchCustomerList();
};
// 批量解冻
const handleBatchUnfreeze = async () => {
  if (!selectedCustomerIds.value.length) {
    ElMessage.warning("请先选择客户");
    return;
  }
  await updateCustomerStatus(selectedCustomerIds.value, true);
  ElMessage.success("批量解冻成功");
  fetchCustomerList();
};
// 设置等级
const handleSetLevel = (row: any) => {
  openEditLevelDialog(row);
};

// ===================== 送积分弹窗相关 =====================
// 控制送积分弹窗显示
const showGivePointsDialog = ref(false);
// 送积分表单数据
const givePointsForm = ref({
  id: "",
  customerName: "",
  level: "",
  balance: 0,
  availablePoints: 0,
  accumulativeintegral: 0,
  operator: "",
  pointsmodifydesc: "",
});
const givePointsLoading = ref(false); // 送积分loading
// 打开送积分弹窗
const openGivePointsDialog = (row: any) => {
  givePointsForm.value = {
    id: row.id,
    customerName: row.customerName || row.customerNickName || "",
    level: row.customerTypeName || "",
    balance: row.availableBalance || 0,
    availablePoints: row.availablePoints || 0,
    accumulativeintegral: 0,
    operator: row.phoneNumber || "",
    pointsmodifydesc: "",
  };
  showGivePointsDialog.value = true;
};
// 提交送积分
const handleGivePoints = async () => {
  givePointsLoading.value = true;
  try {
    const pointsToAccumulate = Number(givePointsForm.value.accumulativeintegral);
    if (isNaN(pointsToAccumulate)) {
      ElMessage.warning("请输入有效的积分增减数量");
      givePointsLoading.value = false;
      return;
    }
    const paramsToSend = {
      id: String(givePointsForm.value.id),
      availablePoints: Number(givePointsForm.value.availablePoints) + pointsToAccumulate,
      accumulativeintegral: pointsToAccumulate,
      pointsmodifydesc: String(givePointsForm.value.pointsmodifydesc),
    };
    console.log("发送给 giveCustomerPoints 的参数:", paramsToSend);
    await giveCustomerPoints(paramsToSend);
    if (pointsToAccumulate < 0) {
      ElMessage.success("积分消费成功");
    } else {
      ElMessage.success("送积分成功");
    }
    showGivePointsDialog.value = false;
    fetchCustomerList();
  } catch (error) {
    console.error("送积分失败", error);
    ElMessage.error("送积分失败");
  } finally {
    givePointsLoading.value = false;
  }
};

// ===================== 导入客户弹窗相关 =====================
const showImportDialog = ref(false);
const importCustomersUrl = "https://8.152.98.56/api/Import/customers";
const uploadHeaders = {}; // 如需token可在此加上
const handleImportSuccess = () => {
  ElMessage.success("导入成功！");
  showImportDialog.value = false;
  fetchCustomerList();
};
const handleImportError = () => {
  ElMessage.error("导入失败，请检查文件格式或稍后重试");
};
const beforeUpload = (file: File) => {
  const isExcel =
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel";
  if (!isExcel) {
    ElMessage.error("只能上传 Excel 文件！");
  }
  return isExcel;
};

// 冻结提示弹窗
const showFrozenMessage = () => {
  ElMessage.warning("客户已冻结，无法进行此操作");
};

// 添加标签相关
const showAddTagDialog = ref(false);
const selectedCustomer = ref({
  id: "",
  customerName: "",
});

// 定义标签类型接口
interface Tag {
  id: string;
  labelName: string;
  tagType: number;
  checked?: boolean;
  peopleNumber?: number;
}

// 标签相关数据和方法
const tagList = ref<Tag[]>([]);
const tagLoading = ref(false);
const tagSearchKeyword = ref("");
const tagPage = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 获取标签列表
const fetchTagList = async () => {
  try {
    tagLoading.value = true;
    const res: any = await getLabelList();
    if (res && Array.isArray(res)) {
      // 过滤搜索关键词
      const filteredTags = tagSearchKeyword.value
        ? res.filter((tag) =>
            tag.labelName.toLowerCase().includes(tagSearchKeyword.value.toLowerCase())
          )
        : res;

      // 分页处理
      const start = (tagPage.current - 1) * tagPage.pageSize;
      const end = start + tagPage.pageSize;

      tagList.value = filteredTags.slice(start, end).map((tag: any) => ({
        id: tag.id,
        labelName: tag.labelName,
        tagType: tag.tagType,
        peopleNumber: tag.peopleNumber,
        checked: false,
      }));

      tagPage.total = filteredTags.length;
    }
  } catch (error) {
    console.error("获取标签列表失败:", error);
    ElMessage.error("获取标签列表失败");
  } finally {
    tagLoading.value = false;
  }
};

// 添加批量打标签的方法
const handleBatchAddTags = () => {
  if (selectedCustomerIds.value.length === 0) {
    ElMessage.warning("请先选择要打标签的客户！");
    return;
  }
  // 设置选中的客户信息
  selectedCustomer.value = {
    id: selectedCustomerIds.value[0],
    customerName: "已选择" + selectedCustomerIds.value.length + "个客户",
  };
  showAddTagDialog.value = true;
};

// 修改handleAddTags方法
const handleAddTags = async () => {
  const selectedLabelIds = tagList.value
    .filter((tag: Tag) => tag.checked)
    .map((tag: Tag) => tag.id);

  if (selectedLabelIds.length === 0) {
    ElMessage.warning("请至少选择一个标签");
    return;
  }

  try {
    let customerIds;
    if (selectedCustomerIds.value.length > 0) {
      // 批量打标签模式
      customerIds = selectedCustomerIds.value;
    } else {
      // 单个客户打标签模式
      customerIds = [selectedCustomer.value.id];
    }

    console.log("发送的请求数据:", { customerIds, labelIds: selectedLabelIds });
    await addCustomerLabels(customerIds, selectedLabelIds);

    ElMessage.success("添加标签成功");
    showAddTagDialog.value = false;
    // 重新获取客户列表数据
    fetchCustomerList();
  } catch (err: any) {
    console.error("添加标签失败:", err);
    if (err.response) {
      console.error("错误响应:", err.response);
      ElMessage.error(`添加标签失败: ${err.response.data?.message || "服务器错误"}`);
    } else {
      ElMessage.error("添加标签失败，请重试");
    }
  }
};

// 修改openAddTagDialog方法
const openAddTagDialog = async (row?: any) => {
  if (row) {
    // 单个客户打标签模式
    selectedCustomer.value = {
      id: row.id,
      customerName: row.customerName || row.customerNickName || "未知客户",
    };
    selectedCustomerIds.value = []; // 清空批量选择
  }
  tagSearchKeyword.value = "";
  tagPage.current = 1;
  showAddTagDialog.value = true;
  await fetchTagList();

  // 获取客户现有标签并标记选中状态
  try {
    if (row) {
      const res = await getCustomerLabels(row.id);
      if (res && Array.isArray(res.data)) {
        const customerTagIds = res.data.map((tag: any) => tag.labelId);
        // 标记客户已有的标签
        tagList.value.forEach((tag) => {
          tag.checked = customerTagIds.includes(tag.id);
        });
      }
    }
  } catch (error) {
    console.error("获取客户标签失败:", error);
  }
};

// 处理标签搜索
watch(tagSearchKeyword, () => {
  tagPage.current = 1;
  fetchTagList();
});

// 处理标签分页变化
const handleTagPageChange = (page: number) => {
  tagPage.current = page;
  fetchTagList();
};

// 处理标签选择变化
const handleTagSelectionChange = (selection: Tag[]) => {
  // 更新选中状态
  tagList.value.forEach((tag) => {
    tag.checked = selection.some((selected) => selected.id === tag.id);
  });
};

// 处理标签每页条数变化
const handleTagSizeChange = (size: number) => {
  tagPage.pageSize = size;
  fetchTagList();
};

// 当组件被缓存并离开视图时设置刷新标志
onDeactivated(() => {
  needRefresh.value = true;
  console.log("Component deactivated, setting needRefresh flag to true");
});

// 当组件从缓存中被激活时检查是否需要刷新数据
onActivated(() => {
  if (needRefresh.value) {
    console.log("Component activated with needRefresh flag true, fetching data...");
    fetchCustomerList();
    needRefresh.value = false;
  }
});

// 添加 getTagType 函数
const getTagType = (tagType: number): "success" | "warning" | "info" => {
  if (tagType === 0) return "success"; // 手动标签
  if (tagType === 1) return "warning"; // 条件标签
  return "info"; // 默认标签类型
};
</script>

<style scoped>
.filter-card {
  background: #fafbfc;
  border-radius: 12px;
  padding: 18px 18px 10px 18px;
  margin-bottom: 18px;
  box-sizing: border-box;
}

/* 全局对话框居中样式 */
:deep(.el-dialog) {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

:deep(.el-dialog .el-dialog__body) {
  overflow-y: auto;
}

.filter-form {
  margin-bottom: 0;
}
.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  height: 32px !important;
}
.flex-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 32px !important;
}
.flex-row-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px !important;
}
.flex-row-left :deep(.el-select),
.flex-row-left :deep(.el-input) {
  width: 170px !important;
  height: 32px !important;
}
.flex-row-right {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px !important;
}
.customer-info-label {
  font-size: 14px;
  margin-right: 8px;
  line-height: 1.2;
  white-space: nowrap;
  height: 32px !important;
}
.ops-row {
  margin-bottom: 0;
  margin-top: 0;
  flex-wrap: wrap;
  gap: 8px;
  height: 32px !important;
}
.el-form-item {
  margin-bottom: 0;
  margin-right: 16px;
}
.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
  color: #606266;
}
.el-input,
.el-select,
.el-date-editor {
  width: 170px !important;
  height: 32px !important;
  font-size: 14px;
}
.search-btn {
  margin-right: 8px;
  height: 32px;
  width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.expand-btn {
  height: 32px;
  min-width: 56px;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 0;
}
.filter-label {
  font-size: 14px;
  color: #606266;
  width: 170px;
  margin-right: 16px;
  text-align: left;
}
.label-row {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}
.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.double-col {
  flex: 2;
  display: flex;
  align-items: center;
}
.filter-label.double-col {
  white-space: nowrap;
  min-width: 400px;
  width: 400px;
  height: 32px;
  line-height: 32px;
}
.el-button {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px;
  padding: 0 16px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
:deep(.el-input-number) {
  width: 100% !important;
}
:deep(.el-input-number .el-input__wrapper) {
  height: 32px !important;
  min-height: 32px !important;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 11px;
}
:deep(.el-input-number .el-input__inner) {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px;
  padding: 0;
}
.add-customer-form :deep(.el-input),
.add-customer-form :deep(.el-select),
.add-customer-form :deep(.el-date-editor),
.add-customer-form :deep(.el-cascader) {
  width: 100% !important;
  min-width: 0;
}
.add-customer-form .el-form-item {
  margin-bottom: 18px;
}
.query-card {
  margin-bottom: 16px;
  background: #fafbfc;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}
.table-card {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}
.input-row :deep(.el-input),
.input-row :deep(.el-select),
.input-row :deep(.el-date-picker),
.input-row :deep(.el-date-editor),
.input-row :deep(.el-input__wrapper),
.input-row :deep(.el-range-editor),
.input-row :deep(.el-range-input),
.input-row :deep(.el-input__inner),
.input-row :deep(.el-select .el-input__inner) {
  height: 32px !important;
  min-height: 32px !important;
  line-height: 32px !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  box-sizing: border-box;
}
.open-card-date,
.open-card-date :deep(.el-range-editor),
.open-card-date :deep(.el-range-input) {
  width: 220px !important;
  min-width: 0 !important;
  max-width: 100% !important;
  padding: 0;
}
.open-card-date {
  flex-shrink: 0 !important;
}
.open-card-date :deep(.el-range__icon),
.open-card-date :deep(.el-range-separator),
.open-card-date :deep(.el-range__close-icon) {
  line-height: 20px;
  height: 20px;
}
.open-card-date :deep(.el-range-input) {
  font-size: 14px !important;
  line-height: 20px !important;
  height: 20px !important;
  min-height: 20px !important;
  padding: 0;
}
.open-card-date :deep(.el-input__wrapper) {
  padding: 0 8px;
}
.input-row .el-select,
.input-row .el-select .el-input,
.input-row .el-select .el-input__wrapper {
  height: 32px !important;
  min-height: 32px !important;
  line-height: 32px !important;
  box-sizing: border-box;
}
:deep(.el-select-dropdown__item) {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px;
}
.dialog-footer.center-footer {
  text-align: center;
  justify-content: center;
  display: flex;
  padding-right: 0;
}
.dialog-footer .el-button + .el-button {
  margin-left: 12px;
}
.dialog-footer .el-button {
  min-width: 80px;
  height: 32px;
  font-size: 14px;
}
.el-dialog__title {
  font-weight: bold;
  font-size: 16px;
}
.el-form-item__label {
  font-size: 14px;
}
.el-select {
  font-size: 14px;
}
::v-deep(.el-dialog) {
  margin: auto !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
.recharge-form {
  margin: 20px 0;
}
.recharge-info {
  padding: 0 20px;
  font-size: 14px;
}
.recharge-dialog {
  height: 300px;
}
:deep(.recharge-dialog .el-dialog__body) {
  height: 150px;
  overflow-y: auto;
  padding-top: 30px;
}

.simple-form-item {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  padding: 0 30px;
}

.simple-form-label {
  width: 100px;
  text-align: right;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding-right: 12px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.simple-form-label.required::before {
  content: "*";
  color: #f56c6c;
  margin-right: 1px;
}

.simple-form-content {
  flex: 1;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
}

.input-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.amount-input {
  width: 170px !important;
  display: inline-block;
  vertical-align: middle;
}

:deep(.amount-input .el-input__wrapper) {
  padding-right: 0;
  height: 32px !important;
}

:deep(.amount-input .el-input__inner) {
  text-align: left;
  padding-right: 8px;
  font-size: 14px;
}

:deep(.amount-input .el-input__suffix) {
  color: #909399;
  font-size: 14px;
  background: transparent;
  margin-right: 8px;
}

.remark-textarea {
  width: 100%;
}

:deep(.remark-textarea .el-textarea__inner) {
  resize: none;
  height: 80px;
  min-height: 80px;
  font-size: 14px;
}

.dialog-footer {
  text-align: right;
  padding: 0 20px;
}

:deep(.dialog-footer .el-button) {
  padding: 8px 20px;
}
.balance-info {
  color: #999;
  font-size: 14px;
  margin-left: 8px;
}
.customer-info {
  display: flex;
  align-items: center;
  line-height: 32px;
  height: 32px;
}
.balance-label {
  color: #999;
  font-size: 14px;
}
.balance-value {
  color: #222;
  font-weight: 500;
  margin: 0 2px;
  font-size: 14px;
}
.balance-unit {
  color: #bbb;
  margin-left: 2px;
  font-size: 14px;
}
.operator-info {
  font-size: 14px;
  color: #606266;
  margin-top: 2px;
  line-height: 32px;
  height: 32px;
  display: flex;
  align-items: center;
}

.validation-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
.insufficient-balance {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
.frozen-tag {
  display: inline-block;
  background: #e5e5e5;
  color: #fff;
  font-size: 16px;
  border-radius: 8px;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  min-width: 60px;
  font-weight: bold;
}
.frozen-status {
  color: #fff;
  background: #e5e5e5;
  font-size: 12px;
  border-radius: 8px;
  padding: 0 8px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  margin-top: 2px;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  box-shadow: 0 2px 8px -4px #d3d3d3;
  border-bottom: 1px solid #ebeef5;
}

/* 添加标签弹窗样式 */
.tag-dialog-content {
  padding: 20px;
}

.tag-search-input {
  margin-bottom: 20px;
}

.tag-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.tag-table-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 500;
}

.tag-table-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  &:last-child {
    border-bottom: none;
  }
  &:nth-child(even) {
    background-color: #fafafa;
  }
}

.tag-table-cell {
  padding: 12px 10px;
  flex: 1;
  display: flex;
  align-items: center;
}

.checkbox-cell {
  flex: 0 0 40px;
  justify-content: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-text {
  color: #606266;
  font-size: 13px;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-checkbox) {
  margin-right: 0;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

/* 添加表格相关样式 */
:deep(.el-table) {
  width: 100%;
  font-size: 14px;
}

:deep(.el-table .cell) {
  padding: 0 8px;
  line-height: 23px;
  word-break: break-all;
}

:deep(.el-table__header) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-table__row) {
  height: 50px;
}

:deep(.el-table__row td) {
  padding: 6px 0;
}

:deep(.el-table .el-tooltip__trigger) {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-item {
  margin: 0;
  font-size: 12px;
}

.add-tag-link {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
}

.add-icon {
  margin-right: 2px;
  font-size: 12px;
}

:deep(.el-tag) {
  border-radius: 2px;
}

:deep(.el-tag--success) {
  --el-tag-bg-color: var(--el-color-success-light-9);
  --el-tag-border-color: var(--el-color-success-light-5);
  --el-tag-text-color: var(--el-color-success);
}

:deep(.el-tag--warning) {
  --el-tag-bg-color: var(--el-color-warning-light-9);
  --el-tag-border-color: var(--el-color-warning-light-5);
  --el-tag-text-color: var(--el-color-warning);
}

.card-number-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-number-text {
  font-size: 12px;
  line-height: 1.2;
  color: #606266;
  word-break: break-all;
}

:deep(.el-table__row) {
  height: auto !important;
  padding: 8px 0;
}

:deep(.el-table__cell) {
  padding: 8px 0 !important;
}

:deep(.el-table .cell) {
  padding: 0 8px;
  line-height: 1.2;
  word-break: break-all;
  white-space: normal;
}
</style>

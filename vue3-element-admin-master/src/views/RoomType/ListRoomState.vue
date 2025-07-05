<template>
  <el-row>
    <el-col :span="4">
      <el-card>
        <div style="font-weight: bold; margin-bottom: 12px">房型筛选</div>
        <el-select
          v-model="selectedRoomType"
          placeholder="全部房型"
          size="small"
          style="width: 100%; margin-bottom: 18px"
          @change="onRoomTypeChange"
        >
          <el-option label="全部房型" :value="''" />
          <el-option
            v-for="group in roomGroups"
            :key="group.typeName"
            :label="group.typeName"
            :value="group.typeName"
          />
        </el-select>

        <div style="font-weight: bold; margin-bottom: 12px">房态筛选</div>
        <div class="state-btn-group">
          <el-button
            v-for="item in stateBtnList"
            :key="item.value"
            :class="['state-btn', selectedState === item.value ? 'active' : '']"
            plain
            @click="onStateChange(item.value)"
          >
            <template v-if="item.value !== ''">
              <span class="state-dot" :style="{ background: item.color }"></span>
            </template>
            <span :style="item.value === '' ? 'color:#409EFF;font-weight:bold;' : ''">
              {{ item.label }}
              <span style="margin-left: 2px">
                {{ item.value === "" ? totalCount : stateCountMap[item.value] }}
              </span>
            </span>
          </el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="20">
      <div class="room-state-page">
        <div v-for="group in roomGroups" :key="group.typeName" class="room-group">
          <div class="group-title">{{ group.typeName }}</div>
          <div class="room-cards">
            <div v-for="room in group.rooms" :key="room.id" class="room-card">
              <div class="room-header">
                <span class="room-num">{{ room.roomNum }}</span>
                <el-dropdown @command="(cmd) => handleChangeState(room, cmd, room.roomNum)">
                  <span class="room-more">...</span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="1">设为净房</el-dropdown-item>
                      <el-dropdown-item command="2">设为脏房</el-dropdown-item>
                      <el-dropdown-item command="3">设为维修</el-dropdown-item>
                      <el-dropdown-item command="4">办理预定</el-dropdown-item>
                      <el-dropdown-item command="5">办理入住</el-dropdown-item>
                      <el-dropdown-item command="6">设为保留</el-dropdown-item>
                      <el-dropdown-item command="7">设为空房</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="room-status">
                <el-tag :type="getTagType(room.typeState)">
                  {{ stateText(room.typeState) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { updateRoomState, getRoomStateList } from "@/api/system/roomstate";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const stateTextMap: Record<string, string> = {
  1: "净房",
  2: "脏房",
  3: "维修",
  4: "预定",
  5: "在住",
  6: "保留",
  7: "空房",
};
const stateTagTypeMap: Record<string, string> = {
  1: "success",
  2: "warning",
  3: "danger",
  4: "info",
  5: "success",
  6: "info",
  7: "",
};
function stateText(typeState: number | string) {
  return stateTextMap[String(typeState)] || "未知";
}
function getTagType(
  typeState: number | string
): "success" | "warning" | "danger" | "info" | undefined {
  const type = stateTagTypeMap[String(typeState)];
  if (type === "success" || type === "warning" || type === "danger" || type === "info") {
    return type;
  }
  return undefined;
}

const roomGroups = ref<any[]>([]);
const selectedRoomType = ref("");
const selectedState = ref("");
const router = useRouter();

function loadRoomGroups(params = {}) {
  getRoomStateList(params).then((res: any) => {
    if (res) {
      roomGroups.value = res;
    } else {
      roomGroups.value = [];
    }
  });
}

function onRoomTypeChange(val: string) {
  selectedRoomType.value = val;
  if (!val && !selectedState.value) {
    loadRoomGroups();
  } else if (!val) {
    loadRoomGroups({ State: selectedState.value });
  } else if (!selectedState.value) {
    loadRoomGroups({ TypeName: val });
  } else {
    loadRoomGroups({ TypeName: val, State: selectedState.value });
  }
}

function onStateChange(state: string | number) {
  selectedState.value = String(state);
  if (!selectedRoomType.value && !selectedState.value) {
    loadRoomGroups();
  } else if (!selectedRoomType.value) {
    loadRoomGroups({ State: selectedState.value });
  } else if (!selectedState.value) {
    loadRoomGroups({ TypeName: selectedRoomType.value });
  } else {
    loadRoomGroups({ TypeName: selectedRoomType.value, State: selectedState.value });
  }
}
onMounted(() => {
  loadRoomGroups();
});

function handleChangeState(room: any, command: string, roomNum: any) {
  const state = Number(command);
  if (state == 4) {
    router.push({
      path: "/ReserveRoomList",
      query: {
        num: roomNum,
      },
    });

    loadRoomGroups();
    return;
  }
  if (state == 5) {
    router.push("/ReserverGetlist");
  }
  updateRoomState(room.id, state)
    .then(() => {
      ElMessage.success("状态修改成功");
      loadRoomGroups(); // 修改后刷新数据，确保与数据库同步
    })
    .catch(() => {
      ElMessage.error("状态修改失败");
    });
}

const stateBtnList = [
  { value: "", label: "全部", color: "#409EFF" },
  { value: "7", label: "空房", color: "#dcdfe6" },
  { value: "5", label: "在住", color: "#409EFF" },
  { value: "4", label: "预订", color: "#67C23A" },
  { value: "6", label: "保留", color: "#E6A23C" },
  { value: "1", label: "净房", color: "#67C23A" },
  { value: "2", label: "脏房", color: "#909399" },
  { value: "3", label: "维修", color: "#F56C6C" },
];
const stateCountMap = computed(() => {
  const map: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 };
  roomGroups.value
    .flatMap((g) => g.rooms || [])
    .forEach((room) => {
      const s = String(room.typeState);
      if (map[s] !== undefined) map[s]++;
    });
  return map;
});
const totalCount = computed(() => roomGroups.value.flatMap((g) => g.rooms || []).length);
</script>

<style scoped>
.room-state-page {
  display: flex;
  flex-direction: column;
  padding: 24px;
}
.room-group {
  margin-bottom: 32px;
}
.group-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 12px;
}
.room-cards {
  display: flex;
  gap: 24px;
}
.room-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
  padding: 16px 24px;
  min-width: 160px;
  position: relative;
}
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.room-num {
  font-size: 20px;
  font-weight: bold;
}
.room-more {
  cursor: pointer;
  font-size: 20px;
  padding: 0 8px;
}
.room-status {
  margin-top: 12px;
}
.state-btn-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.state-btn {
  width: 100%;
  justify-content: flex-start;
  border: 1px solid #409eff !important;
  background: #fff !important;
  color: #409eff !important;
  font-weight: normal;
  border-radius: 6px;
  height: 38px;
  box-sizing: border-box;
  transition: 0.2s;
}
.state-btn .state-dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 8px;
  vertical-align: middle;
}
.state-btn.active,
.state-btn:focus,
.state-btn:hover {
  background: #ecf5ff !important;
  color: #409eff !important;
  border-color: #409eff !important;
  font-weight: bold;
}
</style>

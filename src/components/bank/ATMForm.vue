<template>
  <el-card shadow="hover" style="margin-bottom: 24px;">
    <template #header>
      <div class="section-title">
        <i class="fas fa-cash-register"></i> ATM操作台
      </div>
    </template>

    <el-form label-position="top" :model="formData" ref="formRef">

      <!-- 存款操作 -->
      <el-form-item label="存款操作">
        <el-row :gutter="12">
          <el-col :span="16">
            <el-input v-model="depositAmount" placeholder="请输入存款金额" type="number">
              <template #prepend>魔力值</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="Upload" style="width: 100%;">
              <i class="fas fa-arrow-circle-up"></i> 存入
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 取款操作 -->
      <el-form-item label="取款操作">
        <el-row :gutter="12">
          <el-col :span="16">
            <el-input v-model="withdrawAmount" placeholder="请输入取款金额" type="number">
              <template #prepend>魔力值</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="Download" style="width: 100%;">
              <i class="fas fa-arrow-circle-down"></i> 取出
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 贷款操作 -->
      <el-form-item label="贷款操作">
        <el-row :gutter="12">
          <el-col :span="10">
            <el-input v-model="loanAmt" placeholder="请输入贷款金额" type="number">
              <template #prepend>魔力值</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="loanTerm" placeholder="1" type="number">
              <template #append>月</template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="Money" style="width: 100%;">
              <i class="fas fa-hand-holding-usd"></i> 贷款
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>

    <!-- 提示信息 -->
    <div class="note">
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i> 存款不足24小时的次日才会产生利息，利息每月的1日结算</p>
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i> 贷款每期会按时扣款，可能会影响其他系统功能</p>
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i> 贷款时长1-12个月，提前还款需支付当月利息</p>
    </div>
  </el-card>
</template>

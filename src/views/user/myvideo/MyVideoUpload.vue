<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-card class="upload-container">
    <template #header>
      <div class="card-header">
        <h2>视频上传</h2>
        <el-steps :active="currentStep" finish-status="success" simple>
          <el-step title="1. 填写信息" />
          <el-step title="2. 上传文件" />
        </el-steps>
      </div>
    </template>

    <div v-show="currentStep === 0">
      <el-form
        ref="formRef"
        :model="uploadDetails"
        :rules="formRules"
        label-position="top"
        size="large"
      >
        <el-row :gutter="30">
          <!-- Left side: Form details -->
          <el-col :span="14">
            <el-form-item label="视频标题" prop="title">
              <el-input
                v-model="uploadDetails.title"
                placeholder="给视频起一个响亮的标题吧"
              />
            </el-form-item>

            <el-form-item label="视频标签" prop="lab_name">
              <el-input
                v-model="uploadDetails.lab_name"
                placeholder="例如：#搞笑 #编程"
              />
            </el-form-item>

            <el-form-item label="视频简介" prop="description">
              <el-input
                v-model="uploadDetails.description"
                type="textarea"
                :rows="3"
                placeholder="简单介绍一下您的视频内容"
              />
            </el-form-item>
            <el-form-item label="视频分类" prop="category">
              <el-input
                v-model="uploadDetails.category"
                placeholder="例如：生活、学习"
              />
            </el-form-item>
            <el-form-item label="上传分片数" prop="chunk_total_number">
              <el-slider
                v-model="uploadDetails.chunk_total_number"
                :min="1"
                :max="100"
                show-input
              />
            </el-form-item>
            <el-form-item label="是否公开" prop="open">
              <el-radio-group v-model="uploadDetails.open">
                <el-radio :label="1" border>公开</el-radio>
                <el-radio :label="0" border>私密</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <!-- Right side: Cover uploader -->
          <el-col :span="10">
            <el-form-item label="视频封面" prop="cover">
              <el-upload
                class="cover-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleCoverChange"
                list-type="picture-card"
              >
                <img v-if="coverImageUrl" :src="coverImageUrl" class="cover" />
                <el-icon v-else class="cover-uploader-icon"><Upload /></el-icon>
                <template #tip>
                  <div class="el-upload__tip">
                    点击或拖拽上传封面，仅支持图片格式
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="goToNextStep">下一步</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="currentStep === 1">
      <div class="uploader-panel">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-change="handleFileSelection"
          :show-file-list="true"
          :file-list="fileList"
          :limit="1"
          drag
          action="#"
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传视频文件，且大小不超过 500MB
            </div>
          </template>
        </el-upload>

        <div v-if="fileToUpload" class="upload-controls">
          <el-progress
            v-if="isUploading"
            :percentage="uploadProgress"
            :stroke-width="15"
            striped
            striped-flow
          />
          <el-button
            type="success"
            :disabled="!isReadyToUpload"
            :loading="isUploading"
            @click="startUpload"
          >
            {{ isUploading ? '正在上传...' : '开始上传' }}
          </el-button>
        </div>
      </div>
      <el-button style="margin-top: 20px" @click="goToPreviousStep"
        >返回上一步</el-button
      >
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { ready_upvideo, uploadChunk, mergeChunks } from '@/api/user'
import { Upload } from '@element-plus/icons-vue'
import { generateUUID } from '@/utils'

defineOptions({
  name: 'MyVideoUpload',
})

// -- Refs and State --
const userStore = useUserStore()
const currentStep = ref(0)
const formRef = ref()
const fileToUpload = ref(null)
const uploadChunks = ref([])
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileList = ref([])
const coverImageUrl = ref('')
const coverImageFile = ref(null)

const uploadDetails = ref({
  token: userStore.token,
  title: '',
  description: '',
  chunk_total_number: 10,
  lab_name: '',
  category: '',
  open: 1,
  uuid: generateUUID(),
})

// -- Computed Properties --
const chunkSize = computed(() => {
  if (!fileToUpload.value || !uploadDetails.value.chunk_total_number) return 0
  return fileToUpload.value.size / uploadDetails.value.chunk_total_number
})

const isReadyToUpload = computed(() => fileToUpload.value && !isUploading.value)

// -- Form Rules --
const formRules = {
  title: [
    { required: true, message: '标题不可为空', trigger: 'blur' },
    { min: 2, max: 20, message: '标题必须是 2-20 位的字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '视频描述不可为空', trigger: 'blur' },
    { min: 5, max: 200, message: '描述必须是 5-200 位的字符', trigger: 'blur' },
  ],
  chunk_total_number: [
    { required: true, message: '分片个数不可为空', trigger: 'blur' },
    {
      type: 'integer',
      min: 1,
      max: 100,
      message: '分片数必须是 1 到 100 之间的整数',
      trigger: 'blur',
    },
  ],
  lab_name: [{ required: true, message: '请输入视频标签', trigger: 'blur' }],
  category: [{ required: true, message: '请选择视频类别', trigger: 'blur' }],
}

// -- Methods --
const goToNextStep = async () => {
  try {
    const isValid = await formRef.value.validate()
    if (isValid) {
      if (!coverImageFile.value) {
        ElMessage.warning('请上传视频封面')
        return
      }

      console.log('封面图片已准备好:', coverImageFile.value.name)

      const res = await ready_upvideo(uploadDetails.value)
      if (res) {
        ElMessage.success('视频信息已提交，请上传文件')
        currentStep.value = 1
      }
    }
  } catch (error) {
    ElMessage.error('信息提交失败，请检查输入')
    console.error('Failed to prepare upload:', error)
  }
}

const goToPreviousStep = () => {
  currentStep.value = 0
}

const handleCoverChange = uploadFile => {
  const isImage = uploadFile.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  coverImageFile.value = uploadFile
  coverImageUrl.value = URL.createObjectURL(uploadFile.raw)
}

const handleFileSelection = uploadFile => {
  if (uploadFile.raw.type.startsWith('video/')) {
    fileToUpload.value = uploadFile.raw
    fileList.value = [uploadFile] // for el-upload display
    createFileChunks()
  } else {
    ElMessage.error('只能上传视频文件！')
    fileList.value = []
  }
}

const createFileChunks = () => {
  if (!fileToUpload.value) return
  uploadChunks.value = []
  let start = 0
  let index = 0
  while (start < fileToUpload.value.size) {
    const end = start + chunkSize.value
    const chunk = fileToUpload.value.slice(start, end)
    uploadChunks.value.push({ chunk, index: index++ })
    start = end
  }
}

const startUpload = async () => {
  if (!isReadyToUpload.value) {
    ElMessage.warning('请先选择一个视频文件')
    return
  }

  isUploading.value = true
  uploadProgress.value = 0

  const uploadPromises = uploadChunks.value.map(async chunkData => {
    const formData = new FormData()
    formData.append(
      'file',
      chunkData.chunk,
      `${chunkData.index}-${fileToUpload.value.name}`,
    )
    formData.append('index', chunkData.index)
    formData.append('uuid', uploadDetails.value.uuid)
    formData.append('token', userStore.token)
    return uploadChunk(formData)
  })

  try {
    await Promise.all(uploadPromises)
    await finishUpload()
  } catch (error) {
    isUploading.value = false
    ElMessage.error('上传过程中发生错误')
    console.error('Chunk upload failed:', error)
  }
}

const finishUpload = async () => {
  try {
    await mergeChunks(userStore.token, uploadDetails.value.uuid)
    ElMessage.success('视频上传成功！')
    resetUploader()
  } catch (error) {
    ElMessage.error('文件合并失败')
    console.error('Failed to merge chunks:', error)
  } finally {
    isUploading.value = false
  }
}

const resetUploader = () => {
  currentStep.value = 0
  fileToUpload.value = null
  fileList.value = []
  uploadChunks.value = []
  uploadProgress.value = 0
  uploadDetails.value.uuid = generateUUID() // Generate new UUID for next upload
}

// const copyLink = () => {
//   copyToClipboard(uploadedVideoUrl.value)
//   ElMessage.success('链接已复制到剪贴板')
// }
</script>

<style lang="scss" scoped>
.upload-container {
  max-width: 1000px;
  margin: 40px auto;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin-bottom: 20px;
}

.uploader-panel {
  text-align: center;
}

.upload-controls {
  margin-top: 20px;
}

.cover-uploader .cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-uploader .cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-upload__tip {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
</style>

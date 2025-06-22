<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- 分片上传准备 -->
  <el-col class="form">
    <el-form
      :model="formModel"
      :rules="rules"
      ref="form"
      size="large"
      autocomplete="off"
      v-if="change === 0"
    >
      <el-form-item>
        <h1 style="color: white">上传稿件准备阶段</h1>
      </el-form-item>

      <el-form-item prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item prop="description">
        <el-input
          v-model="formModel.description"
          placeholder="请输入简介"
        ></el-input>
      </el-form-item>

      <el-form-item prop="chunk_total_number">
        <el-input
          v-model="formModel.chunk_total_number"
          placeholder="请输入视频分片个数"
        ></el-input>
      </el-form-item>

      <el-form-item prop="lab_name">
        <el-input
          v-model="formModel.lab_name"
          placeholder="请输入视频标签"
        ></el-input>
      </el-form-item>

      <el-form-item prop="category">
        <el-input
          v-model="formModel.category"
          placeholder="请输入视频类型"
        ></el-input>
      </el-form-item>

      <el-form-item prop="open">
        <h3 style="color: white">视频是否进行公开：</h3>
        <el-radio-group v-model="formModel.open">
          <el-radio :label="1" border>是</el-radio>
          <el-radio :label="0" border>否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="button" @click="handleClick1"
          >下一页
        </el-button>
      </el-form-item>
    </el-form>

    <el-form
      :model="formModel2"
      :rules="rules"
      ref="form2"
      size="large"
      autocomplete="off"
      v-if="change === 1"
    >
      <el-form-item>
        <h1 style="color: white">上传稿件进行阶段</h1>
      </el-form-item>

      <el-form-item>
        <div class="upload">
          <el-upload
            ref="upload"
            action=""
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="true"
            drag
          >
            <el-icon class="icon-size"><Upload /></el-icon>

            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <el-button type="primary" @click="uploadFile" class="upbutton"
            >开始上传</el-button
          >
          <el-progress
            :percentage="progressPercentage"
            v-if="isUploading"
          ></el-progress>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="change = 0">上一页 </el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script setup>
import { ref } from 'vue'
//import { ElMessage } from 'element-plus'
//import { useUserStore } from '@/stores/user'
import { ElButton } from 'element-plus'
//import { uploadChunk, ready_upvideo, mergeChunks } from '@/api/user'
import { Upload } from '@element-plus/icons-vue'
const change = ref(1)
const form = ref()
const form2 = ref()

// 用于提交的form数据对象
const formModel = ref({
  //token: useUserStore().token,
  title: '',
  description: '',
  chunk_total_number: '',
  lab_name: '',
  category: '',
  open: 1,
})

const formModel2 = ref({
  //token: useUserStore().token,
  uuid: guid(),
  is_m3u8: false,
})
//生成随机数
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
// 表单的规则
const rules = {
  title: [
    { required: true, message: '标题不可为空', trigger: 'blur' },
    { min: 2, max: 10, message: '标题必须是2-10位的字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '对视频的描述不可为空', trigger: 'blur' },
  ],
  chunk_total_number: [
    { required: true, message: '分片的个数不可为空', trigger: 'blur' },
    {
      pattern: /^(100|[1-9]\d?|1\d{2})$/,
      message: '请输入1到100之间的正整数',
      trigger: 'blur',
    },
  ],
  lab_name: [{ required: true, message: '请输入视频标签', trigger: 'blur' }],
  category: [{ required: true, message: '请输入类别', trigger: 'blur' }],
}

/*const handleClick1 = async () => {
  await form.value.validate()
  change.value = 1
  await ready_upvideo()
}

// 分片的模块
const file = ref(null)
const chunkSize = ref(0)
const chunks = ref([])
const uploadedChunks = ref([])
const isUploading = ref(false)
const progressPercentage = ref(0)

const handleFileChange = file => {
  if (file.raw.type.startsWith('video/')) {
    file.value = file.raw
  } else {
    ElMessage.error('只能上传视频文件')
  }
  file.value = file.raw
  if (file.value) {
    splitFileIntoChunks()
  }
}

const splitFileIntoChunks = () => {
  chunks.value = []
  chunkSize.value = file.value.size / formModel.chunk_total_number // 每个分片大小，例如1MB
  let start = 0
  while (start < file.value.size) {
    const end = start + chunkSize.value
    const chunk = file.value.slice(start, end)
    chunks.value.push(chunk)
    start = end
  }
}

const uploadFile = async () => {
  if (!file.value) {
    ElMessage.error('请先选择文件')
    return
  }

  isUploading.value = true
  progressPercentage.value = 0

  for (let i = 0; i < chunks.value.length; i++) {
    const formData = new FormData()
    formData.append('file', chunks.value[i], `${i}-${file.value.name}`)
    formData.append('index', i.toString())
    formData.append('totalChunks', chunks.value.length.toString())

    try {
      await uploadChunk(formData)
      uploadedChunks.value.push(i)
      progressPercentage.value = Math.round(
        (uploadedChunks.value.length / chunks.value.length) * 100,
      )
      console.log(`Chunk ${i} uploaded successfully`)
    } catch (error) {
      console.error(`Failed to upload chunk ${i}:`, error)
      ElMessage.error(`分片 ${i} 上传失败`)
      isUploading.value = false
      return
    }
  }

  if (uploadedChunks.value.length === chunks.value.length) {
    console.log('All chunks uploaded successfully')
    // 可以在这里触发服务器端的合并操作
    mergeChunksOnServer(formModel.token, formModel2.uuid)
  }
}

const mergeChunksOnServer = async () => {
  try {
    await mergeChunks(file.value.name, chunks.value.length)
    console.log('Chunks merged successfully')
    ElMessage.success('文件上传成功')
    isUploading.value = false
  } catch (error) {
    console.error('Failed to merge chunks:', error)
    ElMessage.error('文件合并失败')
    isUploading.value = false
  }
}
  */
</script>

<style lang="scss" scoped>
.form {
  .button {
    margin-left: auto;
  }
  .upbutton {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .upload {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: auto;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .icon-size {
    font-size: 68px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>

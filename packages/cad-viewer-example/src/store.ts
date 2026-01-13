import { reactive } from 'vue'

export const store = reactive<{
  selectedFile: File | undefined
  selectedUrl: string | undefined
}>({
  selectedFile: undefined,
  selectedUrl: undefined
})

<template>
  <div id="app-root">
    <MlCadViewer v-if="store.selectedUrl || store.selectedFile" locale="zh" :url="store.selectedUrl"
      :local-file="store.selectedFile" @create="initialize" />
    <!-- base-url="https://cdn.jsdelivr.net/gh/mlightcad/cad-data@main/" -->
  </div>
</template>

<script setup lang="ts">
// import { AcApSettingManager } from '@mlightcad/cad-simple-viewer'
import { AcApDocManager, AcEdCommandStack } from '@mlightcad/cad-simple-viewer'
import { MlCadViewer } from '@mlightcad/cad-viewer'
import { AcApQuitCmd } from './commands'
import { initializeLocale } from './locale'
import { store } from './store'

const initialize = () => {
  initializeLocale()
  const register = AcApDocManager.instance.commandManager
  register.addCommand(
    AcEdCommandStack.SYSTEMT_COMMAND_GROUP_NAME,
    'quit',
    'quit',
    new AcApQuitCmd()
  )
  register.addCommand(
    AcEdCommandStack.SYSTEMT_COMMAND_GROUP_NAME,
    'exit',
    'exit',
    new AcApQuitCmd()
  )
}

// Decide whether to show command line vertical toolbar at the right side,
// performance stats, coordinates in status bar, etc.
// AcApSettingManager.instance.isShowCommandLine = false
// AcApSettingManager.instance.isShowToolbar = false
// AcApSettingManager.instance.isShowStats = false
// AcApSettingManager.instance.isShowCoordinate = false


type IOSPayload =
  | File
  | Blob
  | ArrayBuffer
  | string
  | { name?: string; type?: string; data: string | ArrayBuffer };

function base64ToBytes(base64: string) {
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function normalizeToFile(input: IOSPayload): Promise<File> {
  if (input instanceof File) return input;

  if (input instanceof Blob) {
    return new File([input], "unknown", { type: input.type });
  }

  if (input instanceof ArrayBuffer) {
    return new File([input], "unknown");
  }

  if (typeof input === "string") {
    const bytes = base64ToBytes(input);
    return new File([bytes], "unknown");
  }

  if (typeof input === "object" && "data" in input) {
    if (typeof input.data === "string") {
      const bytes = base64ToBytes(input.data);
      return new File([bytes], input.name ?? "unknown", { type: input.type });
    }
    return new File([input.data], input.name ?? "unknown", { type: input.type });
  }

  throw new Error("Unsupported input format");
}

window.openFile = async (input: IOSPayload) => {
  const file = await normalizeToFile(input);
  store.selectedFile = file
}

window.openFileFromUrl = (url: string) => {
  store.selectedUrl = url
}
</script>

<style scoped>
#app-root {
  height: 100vh;
  position: fixed;
}

.upload-screen {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  pointer-events: auto;
  /* Allow clicks on upload screen */
}
</style>

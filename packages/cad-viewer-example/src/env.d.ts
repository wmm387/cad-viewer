export {};

declare global {
  interface Window {
    openFile: (file: File) => void;
    openFileFromUrl: (url: string) => void;
  }
}

import { startServer } from "@blog-o-matic/editor"

export const preview = (tempDir: string) => {
  startServer(tempDir)
}

export default defineEventHandler(async () => {
  // 環境変数からAPIキーを取得
  const config = useRuntimeConfig()
  const apiKey = config.RESAS_API_KEY
  const endPoint = config.RESAS_API_ENDPOINT

  // RESAS APIから都道府県一覧を取得
  const response = await fetch(`${endPoint}/api/v1/prefectures`, {
    headers: {
      'X-API-KEY': apiKey
    }
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const result = await response.json()
  return result.result || []
})
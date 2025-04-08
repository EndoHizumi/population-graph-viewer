import type { PopulationCompositionPerYearResponse } from '~/types/response'

// 県の人口構成データを取得するAPIエンドポイント  
export default defineEventHandler(async (event) => {
  // 環境変数からAPIキーを取得
  const config = useRuntimeConfig()
  const apiKey = config.RESAS_API_KEY
  const endPoint = config.RESAS_API_ENDPOINT

  const query = getQuery(event)
  const prefCode = Number(query.prefCode) || 1

    // RESAS APIから都道府県一覧を取得
    const response = await fetch(`${endPoint}/api/v1/population/composition/perYear?prefCode=${prefCode}`, {
      headers: {
        'X-API-KEY': apiKey
      },
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const result: PopulationCompositionPerYearResponse = await response.json()
    return result.result || []
})
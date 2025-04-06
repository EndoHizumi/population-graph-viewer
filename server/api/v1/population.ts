import { type PopulationCompositionPerYearResponse } from "~/types/response";

// 県の人口構成データを取得するAPIエンドポイント  
export default defineEventHandler(async (event) => {
  // 環境変数からAPIキーを取得
  const config = useRuntimeConfig();
  const apiKey = config.RESAS_API_KEY;
  const endPoint = config.RESAS_API_ENDPOINT;

  const query = getQuery(event);
  const prefCode = Number(query.prefCode) || 1;

  try {
    // RESAS APIから都道府県一覧を取得
    const response = await fetch(`${endPoint}/api/v1/population/composition/perYear?prefCode=${prefCode}`, {
      headers: {
        'X-API-KEY': apiKey
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.result || [];
    
  } catch (error) {
    console.error('人口構成データ取得エラー:', error);
    throw error;
  }
});
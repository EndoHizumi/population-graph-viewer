/**
 * 都道府県データの型定義
 */
export interface Prefecture {
  /** 都道府県コード */
  prefCode: number;
  /** 都道府県名 */
  prefName: string;
}

/**
 * 都道府県一覧APIのレスポンス
 */
export interface PrefecturesResponse {
  message: string | null;
  result: Prefecture[];
}

/**
 * 年ごとのデータポイント
 */
export interface YearlyData {
  /** 年 */
  year: number;
  /** 人口 */
  value: number;
  /** 割合（総人口の場合は存在しない） */
  rate?: number;
}

/**
 * 人口データ項目
 */
export interface PopulationDataItem {
  /** カテゴリラベル（総人口、年少人口など） */
  label: string;
  /** 各年のデータ配列 */
  data: YearlyData[];
}

/**
 * 年代別人口構成データ
 */
export interface PopulationCompositionPerYear {
  /** 実績値と推計値の区切り年 */
  boundaryYear: number;
  /** 人口データ項目の配列 */
  data: PopulationDataItem[];
}

/**
 * 人口構成APIのレスポンス
 */
export interface PopulationCompositionPerYearResponse {
  message: string | null;
  result: PopulationCompositionPerYear;
}
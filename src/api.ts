// src/api.ts
import { database } from "./firebase"; // firebaseモジュールのインポート
import { ref, set, get } from "firebase/database";
import { YearData, EstateTransactionResponse } from "./types"; // 追加: 型をインポート

let cachedApiKey: string | null = null;

// FirebaseからAPIキーを取得する関数
export const fetchApiKeyFromFirebase = async (): Promise<string | null> => {
  if (cachedApiKey) {
    console.log("キャッシュされたAPIキーを使用します:", cachedApiKey);
    return cachedApiKey; // キャッシュからAPIキーを返す
  }

  try {
    const apiKeyRef = ref(database, "config/apiKeys/resasapi");
    const snapshot = await get(apiKeyRef);

    if (snapshot.exists()) {
      cachedApiKey = snapshot.val(); // 取得したAPIキーをキャッシュする
      console.log("取得したAPIキー:", cachedApiKey);
      return cachedApiKey;
    } else {
      console.log("APIキーが見つかりませんでした。");
      return null;
    }
  } catch (error) {
    console.error("APIキーの取得中にエラーが発生しました:", error);
    return null;
  }
};

// データをFirebaseに保存する関数
export const saveDataToFirebase = async (
  prefCode: number, // prefCodeの型を確認
  displayType: number,
  year: number // year引数を追加
) => {
  console.log("saveDataToFirebase実行");
  console.log("prefCode:", prefCode, " displayType:", displayType);

  // APIキーをFirebaseから取得
  const apiKey = await fetchApiKeyFromFirebase();
  if (!apiKey) {
    console.error("APIキーが取得できませんでした。処理を中断します。");
    return; // APIキーがない場合は処理を中断
  }

  // APIを呼び出してデータを取得
  const response = await fetch(
    `https://opendata.resas-portal.go.jp/api/v1/townPlanning/estateTransaction/bar?year=${year}&prefCode=${prefCode}&displayType=${displayType}`,
    {
      headers: {
        "X-API-KEY": apiKey || "エラー: APIキーが設定されていません",
      },
    }
  );
  console.log("response：", response);

  // APIのレスポンスチェック
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`データの取得に失敗しました: ${errorMessage}`);
  }

  // データをJSON形式で取得
  const data = await response.json();
  const { prefCode: code, prefName, years } = data.result;

  /// Firebaseから現在のデータを取得
  const dataRef = ref(database, `prefectures/${code}/${displayType}`);
  const snapshot = await get(dataRef);

  // 既存のデータがあれば、それを取得
  let existingData: EstateTransactionResponse = {
    prefCode,
    prefName,
    displayType,
    years: [],
  };

  if (snapshot.exists()) {
    const fetchedData = snapshot.val();
    // 型チェックを追加
    if (fetchedData && typeof fetchedData === "object") {
      existingData = fetchedData as EstateTransactionResponse;
    } else {
      console.error("取得したデータの型が正しくありません:", fetchedData);
    }
  }

  // 新しい年のデータを追加
  const newYearData: YearData = { year, value: years[0].value }; // APIから取得した新しいデータの値を使用
  const existingYearData = existingData.years.find(
    (yearData) => yearData.year === year
  );

  if (!existingYearData) {
    // 同じ年のデータが存在しない場合は追加
    existingData.years.push(newYearData);
    console.log(`年${year}のデータが追加されました。`);
  } else {
    console.log(`年${year}のデータは既に存在しています。`);
  }

  // 更新されたデータをFirebaseに保存
  await set(dataRef, existingData);
  console.log("データがDBに保存されました:", existingData);
};

// Firebaseからデータを取得する関数
export const fetchDataFromFirebase = async (
  prefCode: number,
  displayType: number,
  year: number
): Promise<EstateTransactionResponse | null> => {
  console.log("APIでデータを取得");
  const dataRef = ref(database, `prefectures/${prefCode}/${displayType}`);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    const data = snapshot.val() as EstateTransactionResponse;

    // years配列から指定されたyearのデータを取得
    const yearData = data.years.find((yearData) => yearData.year === year);

    if (yearData) {
      return {
        ...data,
        years: [yearData], // 見つかった年データだけを含む新しいオブジェクトを返す
      };
    } else {
      console.log("指定された年のデータが見つかりませんでした");
      return null; // 指定された年のデータが見つからなかった場合
    }
  } else {
    console.log("データが見つかりませんでした");
    return null; // データが存在しない場合
  }
};

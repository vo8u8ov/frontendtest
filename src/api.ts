// src/api.ts
import { database } from "./firebase"; // firebaseモジュールのインポート
import { ref, set, get } from "firebase/database";
import { EstateTransactionResponse } from "./types"; // 追加: 型をインポート

// データをFirebaseに保存する関数
export const saveDataToFirebase = async (
  prefCode: number, // prefCodeの型を確認
  displayType: number,
  year: number // year引数を追加
) => {
  console.log("saveDataToFirebase実行");
  console.log("prefCode:", prefCode, " displayType:", displayType);
  // APIを呼び出してデータを取得
  const response = await fetch(
    `https://opendata.resas-portal.go.jp/api/v1/townPlanning/estateTransaction/bar?year=${year}&prefCode=${prefCode}&displayType=${displayType}`,
    {
      headers: {
        "X-API-KEY":
          process.env.REACT_APP_RESAS_API_KEY ||
          "エラー: APIキーが設定されていません",
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
  console.log("データ：", data);

  // データをFirebaseに保存
  const dataRef = ref(database, `prefectures/${code}/${displayType}`); // prefCodeを変数として利用
  await set(dataRef, {
    prefCode: code,
    prefName,
    years,
  });
  console.log("データがFirebaseに保存されました:", data.result);
};

// Firebaseからデータを取得する関数
export const fetchDataFromFirebase = async (
  prefCode: number,
  displayType: number
): Promise<EstateTransactionResponse | null> => {
  console.log("fetchDataFromFirebase実行");
  const dataRef = ref(database, `prefectures/${prefCode}/${displayType}`);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    console.log("取得したデータ:", snapshot.val());
    return snapshot.val() as EstateTransactionResponse; // 型アサーションを追加
  } else {
    console.log("データが見つかりませんでした");
    return null;
  }
};

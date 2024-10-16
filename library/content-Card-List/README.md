# ContentList ライブラリ

## 概要

**ContentList** は、ウェブページ上でコンテンツをカード形式で表示し、検索およびソート機能を提供するカスタムJavaScriptおよびCSSライブラリです。ユーザーは簡単にコンテンツの一覧を視覚的に魅力的なカードとして表示でき、キーワード検索時には一致部分がハイライトされるため、検索結果が一目で分かりやすくなります。レスポンシブデザインに対応しており、さまざまなデバイスで快適に利用できます。

## 特徴

- **カード形式の表示**: コンテンツを視覚的に魅力的なカードとして表示。レスポンシブ対応で、画面サイズに応じてレイアウトが自動調整されます。
- **検索機能**: タイトルや作成者名に基づくキーワード検索が可能。検索キーワードの一致部分がハイライト表示され、結果が一目で分かります。
- **ソート機能**: 作成日時やコメント数に基づいてコンテンツを昇順・降順に並び替えられます。
- **ページネーション**: 多数のコンテンツを効率的に表示するためのページネーション機能を備えています。
- **カスタマイズ可能なテンプレート**: デフォルトのカードテンプレートに加え、カスタムテンプレートを使用して表示形式を柔軟に変更可能。
- **セキュリティ対策**: XSS攻撃を防ぐため、ユーザー入力を適切にエスケープ処理しています。

## インストール方法

1. **ファイルの取得**:
   - `contentList.css`
   - `contentList.js`

   これらのファイルをプロジェクトの適切なディレクトリに配置します。例えば、`css` フォルダと `js` フォルダを作成し、それぞれに配置します。

2. **HTMLファイルへの読み込み**:

   ```html
   <!DOCTYPE html>
   <html lang="ja">
   <head>
       <meta charset="UTF-8">
       <title>コンテンツ一覧表示 - ContentList 使用例</title>
       <!-- ContentListのCSSを読み込む -->
       <link rel="stylesheet" href="css/contentList.css">
   </head>
   <body>
       <!-- コンテンツリストを表示するコンテナ -->
       <div id="myContentList"></div>

       <!-- ContentListのJavaScriptを読み込む -->
       <script src="js/contentList.js"></script>
       <script>
           // コンテンツデータの定義
           const contents = [
               {
                   title: "旅行のおすすめスポット",
                   author: "旅行好きな学生",
                   created: "2024/10/4 15:57:39",
                   updated: "2024/10/4 15:59:57",
                   comments: 1
               },
               {
                   title: "おすすめの料理レシピ",
                   author: "料理好きな主婦",
                   created: "2024/10/5 10:20:15",
                   updated: "2024/10/5 12:45:30",
                   comments: 3
               },
               // さらにコンテンツを追加
           ];

           // DOMが完全に読み込まれた後にライブラリを初期化
           document.addEventListener('DOMContentLoaded', function() {
               const myContentList = new ContentList({
                   container: '#myContentList',    // ライブラリを適用するコンテナのセレクタ
                   data: contents,                 // コンテンツデータの配列
                   searchPlaceholder: 'タイトルまたは作成者で検索...', // 検索ボックスのプレースホルダー
                   sortOptions: [                  // ソートオプション
                       { value: '', text: 'ソートを選択' },
                       { value: 'created_asc', text: '作成日時 昇順' },
                       { value: 'created_desc', text: '作成日時 降順' },
                       { value: 'comments_asc', text: 'コメント数 昇順' },
                       { value: 'comments_desc', text: 'コメント数 降順' },
                   ],
                   itemsPerPage: 6, // 1ページあたりのアイテム数
                   template: function(item) {
                       // カスタムテンプレートの例（カード形式）
                       return `
                           <h2 class="title">${item.title}</h2>
                           <p class="author">${item.author}</p>
                           <p class="content-meta">作成日時: ${item.created}</p>
                           <p class="content-meta">更新日時: ${item.updated}</p>
                           <p class="content-meta">コメント数: ${item.comments}</p>
                       `;
                   }
               });
           });
       </script>
   </body>
   </html>
   ```

## 使用方法

1. **コンテナの準備**:
   - HTML内にコンテンツを表示するためのコンテナ要素（例: `<div id="myContentList"></div>`）を設置します。

2. **ライブラリの初期化**:
   - JavaScriptで `ContentList` クラスをインスタンス化し、必要なオプションを設定します。主なオプションは以下の通りです。
     - `container`: ライブラリを適用するコンテナのCSSセレクタ。
     - `data`: 表示するコンテンツデータの配列。
     - `searchPlaceholder`: 検索ボックスのプレースホルダーテキスト（任意）。
     - `sortOptions`: ソートセレクトボックスに表示するオプション（任意）。
     - `itemsPerPage`: 1ページあたりの表示アイテム数（デフォルトは6）。
     - `template`: カスタムテンプレート関数（任意）。

3. **コンテンツデータの準備**:
   - 各コンテンツはオブジェクトとして定義され、以下のプロパティを持ちます。
     - `title`: コンテンツのタイトル。
     - `author`: 作成者名。
     - `created`: 作成日時（フォーマット例: "2024/10/4 15:57:39"）。
     - `updated`: 更新日時（フォーマット例: "2024/10/4 15:59:57"）。
     - `comments`: コメント数（数値）。

## オプション詳細

- **container**: ライブラリを適用するHTML要素のCSSセレクタ。必須項目です。
- **data**: 表示するコンテンツデータの配列。各アイテムはオブジェクト形式で、`title`, `author`, `created`, `updated`, `comments` のプロパティを持つ必要があります。
- **searchPlaceholder**: 検索ボックスに表示されるプレースホルダーテキスト。省略可能で、デフォルトは "検索..." です。
- **sortOptions**: ソートセレクトボックスに表示するオプションの配列。各オプションは `value` と `text` プロパティを持ちます。省略可能で、デフォルトのソートオプションが使用されます。
- **itemsPerPage**: 1ページあたりに表示するアイテムの数。デフォルトは6で、カード形式に適しています。
- **template**: カードの表示形式を定義するカスタムテンプレート関数。引数としてコンテンツアイテムを受け取り、HTML文字列を返します。省略可能で、デフォルトのテンプレートが使用されます。

## カスタマイズ方法

### カスタムテンプレートの使用

デフォルトのテンプレートでは、タイトル、作成者名、作成日時、更新日時、コメント数を表示します。これを変更したい場合、`template` オプションにカスタムテンプレート関数を指定します。

```javascript
template: function(item) {
    return `
        <h2 class="title">${item.title}</h2>
        <p class="author">${item.author}</p>
        <p class="content-meta">作成日時: ${item.created}</p>
        <p class="content-meta">更新日時: ${item.updated}</p>
        <p class="content-meta">コメント数: ${item.comments}</p>
    `;
}
```

例えば、追加情報を表示したり、HTML構造を変更したりすることが可能です。

### スタイルのカスタマイズ

`contentList.css` を編集することで、カードのデザインやレイアウトを変更できます。以下は、カードの背景色や影を変更する例です。

```css
.content-list-container .content-item {
    background-color: #f0f8ff; /* 背景色を変更 */
    box-shadow: 0 4px 12px rgba(0,0,0,0.2); /* 影を強調 */
}
```

### レスポンシブデザインの調整

メディアクエリを使用して、異なる画面サイズに応じたレイアウトを調整できます。例えば、1ページあたりのアイテム数やカードの幅を変更することが可能です。

```css
@media (max-width: 1024px) {
    .content-list-container .content-item {
        width: calc(50% - 20px); /* 2カラムレイアウト */
    }
}

@media (max-width: 600px) {
    .content-list-container .content-item {
        width: 100%; /* 1カラムレイアウト */
    }
}
```

## 開発環境

- **JavaScript**: ES6を使用しています。モダンなブラウザでの動作を想定しています。
- **CSS**: フレックスボックスを使用したレイアウト。レスポンシブデザインに対応しています。


# ナビゲーションJSONライブラリ

**ナビゲーションJSONライブラリ**は、JSONファイルで管理されたナビゲーションメニューをHTMLの`<header>`内に動的に表示し、レスポンシブ対応のハンバーガーメニューを実現するシンプルなJavaScriptライブラリです。このライブラリを使用することで、ナビゲーションメニューの管理が容易になり、ウェブサイトのユーザーエクスペリエンスを向上させることができます。

## 利用方法

1. **ファイルの準備**

   プロジェクトディレクトリに以下のファイルを作成します。

   ```
   nav-json-library/
   ├── index.html
   ├── navData.json
   ├── nav.js
   └── styles.css
   ```

2. **JSONデータの作成**

   `navData.json`ファイルにナビゲーションメニューのデータを定義します。各メニュー項目は`title`と`url`を持ち、必要に応じて`submenu`を追加できます。

   ```json
   {
     "menu": [
       {
         "title": "ホーム",
         "url": "/"
       },
       {
         "title": "会社概要",
         "url": "/about"
       },
       {
         "title": "サービス",
         "url": "/services",
         "submenu": [
           {
             "title": "ウェブ開発",
             "url": "/services/web-development"
           },
           {
             "title": "モバイルアプリ",
             "url": "/services/mobile-app"
           }
         ]
       },
       {
         "title": "お問い合わせ",
         "url": "/contact"
       }
     ]
   }
   ```

3. **JavaScriptライブラリの実装**

   `nav.js`ファイルにナビゲーションメニューを生成するためのクラスを実装します。

   ```javascript
   // nav.js

   class NavBuilder {
     /**
      * コンストラクタ
      * @param {string} jsonUrl - ナビゲーションメニューのJSONデータのURL
      * @param {Object} options - オプション設定
      */
     constructor(jsonUrl, options = {}) {
       this.jsonUrl = jsonUrl;
       this.options = Object.assign({
         targetSelector: '#navbar-container', // ナビゲーションを挿入する要素のセレクタ
         navClass: 'main-nav',
         menuClass: 'menu',
         menuItemClass: 'menu-item',
         submenuClass: 'submenu',
         hamburgerClass: 'hamburger',
         activeClass: 'active'
       }, options);
     }

     /**
      * JSONデータをフェッチしてメニューを生成
      */
     async init() {
       try {
         const response = await fetch(this.jsonUrl);
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         this.buildMenu(data.menu);
         this.setupHamburger();
       } catch (error) {
         console.error('ナビゲーションのロードに失敗しました:', error);
       }
     }

     /**
      * メニューをビルドしてDOMに挿入
      * @param {Array} menuData - メニュー項目の配列
      */
     buildMenu(menuData) {
       const target = document.querySelector(this.options.targetSelector);
       if (!target) {
         console.error(`ターゲット要素 "${this.options.targetSelector}" が見つかりません。`);
         return;
       }

       // ナビゲーションコンテナを作成
       const nav = document.createElement('nav');
       nav.className = this.options.navClass;

       // メニューリストを作成
       const ul = document.createElement('ul');
       ul.className = this.options.menuClass;

       // メニュー項目を追加
       menuData.forEach(item => {
         const li = this.createMenuItem(item);
         ul.appendChild(li);
       });

       nav.appendChild(ul);
       target.appendChild(nav);
     }

     /**
      * メニュー項目を生成
      * @param {Object} item - メニュー項目のデータ
      * @returns {HTMLElement} - 生成された<li>要素
      */
     createMenuItem(item) {
       const li = document.createElement('li');
       li.className = this.options.menuItemClass;

       const a = document.createElement('a');
       a.href = item.url || '#';
       a.textContent = item.title || 'No Title';
       li.appendChild(a);

       // サブメニューが存在する場合
       if (item.submenu && Array.isArray(item.submenu)) {
         const submenuUl = document.createElement('ul');
         submenuUl.className = this.options.submenuClass;

         item.submenu.forEach(subitem => {
           const subLi = this.createMenuItem(subitem);
           submenuUl.appendChild(subLi);
         });

         li.appendChild(submenuUl);
       }

       return li;
     }

     /**
      * ハンバーガーメニューのセットアップ
      */
     setupHamburger() {
       const target = document.querySelector(this.options.targetSelector);
       if (!target) return;

       // ハンバーガーボタンを作成
       const hamburger = document.createElement('button');
       hamburger.className = this.options.hamburgerClass;
       hamburger.setAttribute('aria-label', 'メニューを開閉');
       hamburger.innerHTML = '&#9776;'; // ☰

       // ハンバーガーボタンを挿入
       target.insertBefore(hamburger, target.firstChild);

       // ボタンのクリックイベントを設定
       hamburger.addEventListener('click', () => {
         const nav = target.querySelector(`.${this.options.navClass}`);
         if (nav) {
           nav.classList.toggle(this.options.activeClass);
         }
       });
     }
   }

   // グローバルオブジェクトにNavBuilderを登録（オプション）
   window.NavBuilder = NavBuilder;
   ```

4. **HTMLファイルの作成**

   `index.html`ファイルにナビゲーションメニューを表示するためのコンテナとスクリプトを追加します。

   ```html
   <!-- index.html -->

   <!DOCTYPE html>
   <html lang="ja">
   <head>
     <meta charset="UTF-8">
     <title>ナビゲーションメニューの例</title>
     <link rel="stylesheet" href="styles.css">
   </head>
   <body>
     <header>
       <div id="navbar-container">
         <!-- ナビゲーションメニューがここに挿入されます -->
       </div>
     </header>

     <!-- JavaScriptライブラリを読み込む -->
     <script src="nav.js"></script>
     <script>
       // ページの読み込み後にナビゲーションを初期化
       document.addEventListener('DOMContentLoaded', () => {
         const nav = new NavBuilder('navData.json', {
           targetSelector: '#navbar-container',
           navClass: 'main-nav',
           menuClass: 'menu',
           menuItemClass: 'menu-item',
           submenuClass: 'submenu',
           hamburgerClass: 'hamburger',
           activeClass: 'active'
         });
         nav.init();
       });
     </script>
   </body>
   </html>
   ```

## カスタマイズ方法

ナビゲーションメニューの外観や動作をカスタマイズするために、以下の方法を使用できます。

1. **CSSクラスの変更**

   `nav.js`のオプションで指定したCSSクラス名を変更することで、スタイルをカスタマイズできます。例えば、以下のように設定を変更します。

   ```javascript
   const nav = new NavBuilder('navData.json', {
     targetSelector: '#navbar-container',
     navClass: 'custom-nav',
     menuClass: 'custom-menu',
     menuItemClass: 'custom-menu-item',
     submenuClass: 'custom-submenu',
     hamburgerClass: 'custom-hamburger',
     activeClass: 'custom-active'
   });
   ```

   その後、`styles.css`内で対応するクラスを定義してスタイルを変更します。

2. **サブメニューの追加**

   `navData.json`ファイルに`submenu`プロパティを追加することで、サブメニューを作成できます。

   ```json
   {
     "menu": [
       {
         "title": "ホーム",
         "url": "/"
       },
       {
         "title": "会社概要",
         "url": "/about"
       },
       {
         "title": "サービス",
         "url": "/services",
         "submenu": [
           {
             "title": "ウェブ開発",
             "url": "/services/web-development"
           },
           {
             "title": "モバイルアプリ",
             "url": "/services/mobile-app"
           }
         ]
       },
       {
         "title": "お問い合わせ",
         "url": "/contact"
       }
     ]
   }
   ```

3. **ハンバーガーメニューのスタイル変更**

   `styles.css`でハンバーガーメニューのスタイルを変更することで、見た目をカスタマイズできます。

   ```css
   .hamburger {
     display: none;
     background: none;
     border: none;
     font-size: 24px;
     color: white;
     cursor: pointer;
   }

   @media (max-width: 768px) {
     .hamburger {
       display: block;
     }
   }
   ```

4. **ナビゲーションの表示位置変更**

   `styles.css`で`.main-nav`や`.menu`の`justify-content`や`flex-direction`を変更することで、ナビゲーションの表示位置やレイアウトを調整できます。

   ```css
   .main-nav {
     display: flex;
     justify-content: center; /* 左寄せ: flex-start, 右寄せ: flex-end, 中央寄せ: center */
   }

   @media (max-width: 768px) {
     .main-nav {
       flex-direction: column;
       align-items: flex-start;
     }
   }
   ```

## HTML, CSS, JavaScriptへの導入方法

1. **HTMLへの導入**

   ナビゲーションメニューを表示するコンテナを`<header>`内に作成します。

   ```html
   <header>
     <div id="navbar-container">
       <!-- ナビゲーションメニューがここに挿入されます -->
     </div>
   </header>
   ```

2. **CSSへの導入**

   `styles.css`ファイルにナビゲーションメニューのスタイルを定義します。以下は基本的なスタイルの例です。

   ```css
   /* styles.css */

   /* ヘッダー全体のスタイル */
   header {
     background-color: #333;
     padding: 10px 20px;
   }

   /* ナビゲーションコンテナ */
   .main-nav {
     display: flex;
     justify-content: flex-end;
   }

   /* メニューリストのスタイル */
   .menu {
     list-style: none;
     margin: 0;
     padding: 0;
     display: flex;
   }

   /* メニュー項目のスタイル */
   .menu-item {
     position: relative;
   }

   .menu-item a {
     display: block;
     padding: 14px 20px;
     color: white;
     text-decoration: none;
   }

   .menu-item a:hover {
     background-color: #555;
   }

   /* サブメニューのスタイル */
   .submenu {
     display: none;
     position: absolute;
     top: 100%;
     left: 0;
     background-color: #444;
     list-style: none;
     padding: 0;
     margin: 0;
     min-width: 160px;
     z-index: 1000;
   }

   .submenu .menu-item a {
     padding: 10px 20px;
   }

   .menu-item:hover .submenu {
     display: block;
   }

   /* ハンバーガーメニューのスタイル */
   .hamburger {
     display: none;
     background: none;
     border: none;
     font-size: 24px;
     color: white;
     cursor: pointer;
   }

   /* レスポンシブデザイン対応 */
   @media (max-width: 768px) {
     /* ナビゲーションを縦に並べる */
     .main-nav {
       flex-direction: column;
       align-items: flex-start;
       display: none; /* 初期は非表示 */
       width: 100%;
     }

     /* メニューをブロック表示に */
     .menu {
       flex-direction: column;
       width: 100%;
     }

     .menu.active {
       display: flex;
     }

     /* メニュー項目の幅を100%に */
     .menu-item a {
       padding: 10px 15px;
       border-top: 1px solid #555;
     }

     /* サブメニューのスタイル調整 */
     .submenu {
       position: static;
       background-color: #555;
     }

     .submenu .menu-item a {
       padding-left: 30px;
     }

     /* ハンバーガーメニューの表示 */
     .hamburger {
       display: block;
     }
   }
   ```

3. **JavaScriptへの導入**

   `nav.js`をHTMLファイルに読み込み、ナビゲーションを初期化します。`nav.js`はナビゲーションメニューをJSONデータから生成し、表示する役割を担います。

   ```html
   <!-- index.html 内のスクリプト部分 -->

   <script src="nav.js"></script>
   <script>
     // ページの読み込み後にナビゲーションを初期化
     document.addEventListener('DOMContentLoaded', () => {
       const nav = new NavBuilder('navData.json', {
         targetSelector: '#navbar-container',
         navClass: 'main-nav',
         menuClass: 'menu',
         menuItemClass: 'menu-item',
         submenuClass: 'submenu',
         hamburgerClass: 'hamburger',
         activeClass: 'active'
       });
       nav.init();
     });
   </script>
   ```


## まとめ

**ナビゲーションJSONライブラリ**は、JSONデータでナビゲーションメニューを簡単に管理・表示し、レスポンシブ対応のハンバーガーメニューを実現するシンプルなツールです。以下の特徴があります：

- **JSON管理**: ナビゲーションメニューの構造をJSONファイルで簡単に管理・編集可能。
- **シンプルな導入**: npmなどのパッケージマネージャーを使用せず、HTMLファイルに直接スクリプトとスタイルを組み込むことで容易に導入。
- **レスポンシブ対応**: 画面サイズに応じてメニューの表示形式を切り替えるハンバーガーメニューを実装。
- **カスタマイズ可能**: CSSクラスやオプションを通じてスタイルや動作を変更可能。


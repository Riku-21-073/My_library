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
        targetSelector: '#navbar', // ナビゲーションを挿入する要素のセレクタ
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
  
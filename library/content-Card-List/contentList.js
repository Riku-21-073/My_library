// contentList.js

(function(global) {
    class ContentList {
        /**
         * コンストラクタ
         * @param {Object} options - 設定オプション
         * @param {string} options.container - ライブラリを適用するコンテナのセレクタ
         * @param {Array} options.data - コンテンツデータの配列
         * @param {Object} options.options - その他のオプション
         */
        constructor(options) {
            this.container = document.querySelector(options.container);
            if (!this.container) {
                throw new Error(`Container element "${options.container}" not found.`);
            }

            this.data = options.data || [];
            this.searchPlaceholder = options.searchPlaceholder || '検索...';
            this.sortOptions = options.sortOptions || [
                { value: '', text: 'ソートを選択' },
                { value: 'created_asc', text: '作成日時 昇順' },
                { value: 'created_desc', text: '作成日時 降順' },
                { value: 'comments_asc', text: 'コメント数 昇順' },
                { value: 'comments_desc', text: 'コメント数 降順' },
            ];

            this.filteredData = [...this.data];
            this.itemsPerPage = options.itemsPerPage || 6; // 1ページあたりのアイテム数（カード形式なので6がおすすめ）
            this.currentPage = 1;
            this.template = options.template || this.defaultTemplate;

            this.init();
        }

        /**
         * 初期化
         */
        init() {
            this.renderHTML();
            this.cacheElements();
            this.bindEvents();
            this.renderList();
            this.renderPagination();
        }

        /**
         * HTML構造のレンダリング
         */
        renderHTML() {
            this.container.classList.add('content-list-container');
            this.container.innerHTML = `
                <h1>コンテンツ一覧</h1>
                <div class="controls">
                    <input type="text" class="search-input" placeholder="${this.searchPlaceholder}" />
                    <select class="sort-select">
                        ${this.sortOptions.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
                    </select>
                </div>
                <ul class="content-list"></ul>
                <p class="no-content" style="display: none;">表示するコンテンツがありません。</p>
                <div class="pagination"></div>
            `;
        }

        /**
         * 要素のキャッシュ
         */
        cacheElements() {
            this.searchInput = this.container.querySelector('.search-input');
            this.sortSelect = this.container.querySelector('.sort-select');
            this.contentList = this.container.querySelector('.content-list');
            this.noContentMessage = this.container.querySelector('.no-content');
            this.paginationContainer = this.container.querySelector('.pagination');
        }

        /**
         * イベントのバインド
         */
        bindEvents() {
            if (this.searchInput) {
                this.searchInput.addEventListener('input', () => {
                    this.handleSearch(this.searchInput.value);
                });
            }

            if (this.sortSelect) {
                this.sortSelect.addEventListener('change', () => {
                    this.handleSort(this.sortSelect.value);
                });
            }
        }

        /**
         * 検索機能のハンドリング
         * @param {string} query - 検索クエリ
         */
        handleSearch(query) {
            const lowerQuery = query.toLowerCase();
            this.filteredData = this.data.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.author.toLowerCase().includes(lowerQuery)
            );
            this.currentPage = 1; // 検索時はページをリセット
            this.renderList(query);
            this.renderPagination();
        }

        /**
         * ソート機能のハンドリング
         * @param {string} criteria - ソート基準（例: 'created_asc'）
         */
        handleSort(criteria) {
            if (!criteria) {
                this.renderList();
                return;
            }

            const [key, order] = criteria.split('_');

            this.filteredData.sort((a, b) => {
                if (key === 'created' || key === 'updated') {
                    const dateA = new Date(a[key]);
                    const dateB = new Date(b[key]);
                    return order === 'asc' ? dateA - dateB : dateB - dateA;
                } else if (key === 'comments') {
                    return order === 'asc' ? a.comments - b.comments : b.comments - a.comments;
                }
                return 0;
            });

            this.renderList();
        }

        /**
         * コンテンツリストのレンダリング
         * @param {string} [query] - 検索クエリ（ハイライト用）
         */
        renderList(query = '') {
            // クリア
            this.contentList.innerHTML = '';

            // ページネーションの計算
            const startIdx = (this.currentPage - 1) * this.itemsPerPage;
            const endIdx = startIdx + this.itemsPerPage;
            const paginatedData = this.filteredData.slice(startIdx, endIdx);

            if (paginatedData.length === 0) {
                this.noContentMessage.style.display = 'block';
                return;
            } else {
                this.noContentMessage.style.display = 'none';
            }

            // コンテンツの作成
            paginatedData.forEach(item => {
                const li = document.createElement('li');
                li.className = 'content-item';

                // ハイライト処理
                const highlightedTitle = this.escapeAndHighlight(item.title, query);
                const highlightedAuthor = this.escapeAndHighlight(item.author, query);

                li.innerHTML = this.template({
                    title: highlightedTitle,
                    author: highlightedAuthor,
                    created: this.escapeHTML(item.created),
                    updated: this.escapeHTML(item.updated),
                    comments: this.escapeHTML(item.comments.toString())
                });

                this.contentList.appendChild(li);
            });
        }

        /**
         * ページネーションのレンダリング
         */
        renderPagination() {
            // 既存のページネーション要素をクリア
            this.paginationContainer.innerHTML = '';

            const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
            if (totalPages <= 1) return; // ページが1つ以下なら表示しない

            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.className = 'page-btn';
                if (i === this.currentPage) {
                    pageBtn.classList.add('active');
                }
                pageBtn.addEventListener('click', () => this.handlePagination(i));
                this.paginationContainer.appendChild(pageBtn);
            }
        }

        /**
         * ページネーションのハンドリング
         * @param {number} page - 選択されたページ番号
         */
        handlePagination(page) {
            this.currentPage = page;
            this.renderList(this.searchInput.value);
            this.renderPagination();
        }

        /**
         * HTMLエスケープ
         * @param {string} str - エスケープする文字列
         * @returns {string} - エスケープ済み文字列
         */
        escapeHTML(str) {
            return str.replace(/&/g, "&amp;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(/"/g, "&quot;")
                      .replace(/'/g, "&#039;");
        }

        /**
         * ハイライト付きHTMLエスケープ
         * @param {string} str - 元の文字列
         * @param {string} query - 検索クエリ
         * @returns {string} - ハイライトされた文字列
         */
        escapeAndHighlight(str, query) {
            if (!query) {
                return this.escapeHTML(str);
            }
            const escapedStr = this.escapeHTML(str);
            const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
            return escapedStr.replace(regex, '<span class="highlight">$1</span>');
        }

        /**
         * 正規表現用の特殊文字をエスケープ
         * @param {string} string - エスケープする文字列
         * @returns {string} - エスケープ済み文字列
         */
        escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        /**
         * デフォルトのテンプレート関数（カード形式）
         * @param {Object} item - コンテンツアイテム
         * @returns {string} - HTML文字列
         */
        defaultTemplate(item) {
            return `
                <h2 class="title">${item.title}</h2>
                <p class="author">${item.author}</p>
                <p class="content-meta">作成日時: ${item.created}</p>
                <p class="content-meta">更新日時: ${item.updated}</p>
                <p class="content-meta">コメント数: ${item.comments}</p>
            `;
        }
    }

    // グローバルにライブラリを公開
    global.ContentList = ContentList;

})(window);

// script.js

document.addEventListener("DOMContentLoaded", function () {
  // 閉じる関数
  function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // 背景スクロールを元に戻す
    document.removeEventListener("keydown", keydownHandler);
    document.body.removeChild(modal); // モーダルをDOMから削除
  }

  // キーボード操作用の関数
  function handleKeyDown(event, modal) {
    if (event.key === "Escape") {
      closeModal(modal);
    }
  }

  // すべての画像にクリックイベントを追加
  const galleryItems = document.querySelectorAll(".image-container img");

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function (event) {
      event.preventDefault(); // デフォルトのリンク動作を防止（必要な場合）

      const imgSrc = this.src;
      const imgAlt = this.alt;
      const parentLink = this.closest("a"); // 親が<a>タグか確認

      // 画像のsrcが存在し、空でない場合のみモーダルを表示
      if (imgSrc && imgSrc.trim() !== "") {
        // モーダル要素の作成
        const modal = document.createElement("div");
        modal.className = "modal";

        // 閉じるボタンの作成
        const closeBtn = document.createElement("span");
        closeBtn.className = "close";
        closeBtn.innerHTML = "&times;";

        // モーダル内画像の作成
        const modalImg = document.createElement("img");
        modalImg.className = "modal-content";
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;

        // キャプションの作成
        const caption = document.createElement("div");
        caption.id = "caption";
        caption.textContent = imgAlt;

        // リンクキャプションの作成（必要な場合）
        let linkCaption = null;
        if (parentLink) {
          const href = parentLink.getAttribute("href");
          if (href) {
            linkCaption = document.createElement("div");
            linkCaption.id = "link-caption";
            {
              const link = document.createElement("a");
              link.href = href;
              link.target = "_blank"; // 新しいタブで開く（必要に応じて）
              link.textContent = href;
              linkCaption.appendChild(link);
            }
          }
        }

        // モーダルに要素を追加
        modal.appendChild(closeBtn);
        modal.appendChild(modalImg);
        modal.appendChild(caption);
        if (linkCaption) {
          modal.appendChild(linkCaption);
        }

        // モーダルをbodyに追加
        document.body.appendChild(modal);

        // モーダルを表示
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // 背景スクロールを防止

        // 閉じるボタンのクリックイベント
        closeBtn.addEventListener("click", function () {
          closeModal(modal);
        });

        // モーダル外クリックで閉じる
        modal.addEventListener("click", function (event) {
          if (event.target === modal) {
            closeModal(modal);
          }
        });

        // キーボード操作のイベントリスナー
        function keydownHandler(event) {
          handleKeyDown(event, modal);
        }

        document.addEventListener("keydown", keydownHandler);
      }
    });
  });
});

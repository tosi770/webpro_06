document.addEventListener("DOMContentLoaded", () => {
    const bbsContainer = document.querySelector("#bbs");
    const postButton = document.querySelector("#post");
    const checkButton = document.querySelector("#check button"); // 投稿チェックボタンを取得

    // 投稿データをHTMLに描画
    const renderPosts = (messages, container) => {
        container.innerHTML = ""; // コンテナをリセット
        messages.forEach((post) => {
            const postDiv = document.createElement("div");
            postDiv.className = "cover";

            postDiv.innerHTML = `
                <span class="post-id">#${post.id}</span>
                <span class="name">${post.name}</span>: 
                <span class="mes">${post.message}</span>
                <button class="like-btn" data-id="${post.id}">いいね (${post.likes})</button>
                <button class="reply-btn" data-id="${post.id}">返信</button>
                <div class="replies">
                    ${post.replies
                        .map(
                            (reply) => `
                            <div class="reply">
                                <span class="name">${reply.name}</span>: 
                                <span class="mes">${reply.message}</span>
                            </div>
                        `
                        )
                        .join("")}
                </div>
            `;
            container.appendChild(postDiv);
        });

        // いいねボタンのイベントリスナー
        container.querySelectorAll(".like-btn").forEach((button) => {
            button.removeEventListener("click", handleLike); // 古いリスナーを削除
            button.addEventListener("click", handleLike);   // 新しいリスナーを追加
        });

        // 返信ボタンのイベントリスナー
        container.querySelectorAll(".reply-btn").forEach((button) => {
            button.removeEventListener("click", handleReply); // 古いリスナーを削除
            button.addEventListener("click", handleReply);   // 新しいリスナーを追加
        });
    };

    // いいねボタンの処理
    const handleLike = (event) => {
        const postId = event.target.dataset.id;
        fetch("/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `id=${postId}`,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    loadPosts(); // 再読み込みで更新
                }
            })
            .catch((error) => {
                console.error("いいねボタン処理でエラー:", error);
                alert("エラー: いいね処理に失敗しました。");
            });
    };

    // 返信ボタンの処理
    const handleReply = (event) => {
        const postId = event.target.dataset.id;
        const replyName = prompt("名前を入力してください:");
        const replyMessage = prompt("返信メッセージを入力してください:");
        if (replyName && replyMessage) {
            fetch("/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `id=${postId}&name=${encodeURIComponent(replyName)}&message=${encodeURIComponent(replyMessage)}`,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        loadPosts(); // 再読み込みで更新
                    }
                })
                .catch((error) => {
                    console.error("返信処理でエラー:", error);
                    alert("エラー: 返信処理に失敗しました。");
                });
        }
    };

    // 投稿の読み込み
    const loadPosts = () => {
        fetch("/read", {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.messages) {
                    renderPosts(data.messages, bbsContainer); // 投稿一覧を描画
                } else {
                    console.error("サーバーから有効なデータが返されませんでした:", data);
                }
            })
            .catch((error) => {
                console.error("投稿データの取得に失敗しました:", error);
                alert("投稿データの取得に失敗しました。");
            });
    };

    // 投稿チェックのイベントリスナー
    checkButton.addEventListener("click", () => {
        let checkContainer = document.querySelector(".check-container");
        if (!checkContainer) {
            checkContainer = document.createElement("div");
            checkContainer.className = "check-container";
            document.body.appendChild(checkContainer);
        }
        checkContainer.innerHTML = `<h3>投稿チェック</h3>`;
        
        fetch("/read", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "start=0", // 必要なら適切なstart値を設定
        })
            .then((response) => response.json())
            .then((data) => {
                renderPosts(data.messages, checkContainer);
            })
            .catch((error) => {
                console.error("投稿チェックの取得に失敗しました:", error);
                alert("投稿チェックの取得に失敗しました。");
            });
    });

    // 投稿の送信
    postButton.addEventListener("click", () => {
        const name = document.querySelector("#name").value;
        const message = document.querySelector("#message").value;

        fetch("/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}`,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`投稿が追加されました。現在の投稿数: ${data.number}`);
                loadPosts(); // 投稿送信後に一覧を更新
            })
            .catch((error) => {
                console.error("投稿の送信に失敗しました:", error);
                alert("投稿の送信に失敗しました。");
            });
    });

    // 初回読み込み
    loadPosts();
});

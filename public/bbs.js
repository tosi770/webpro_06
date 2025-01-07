"use strict";

let number=0;
let posts = [];
let postId = 1;
const bbs = document.querySelector('#bbs');
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {  // URL Encode
        method: "POST",
        body: 'name=' + name + '&message=' + message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log(params);
    
    const url = "/post";
    fetch(url, params)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then((response) => {
        console.log(response);
        document.querySelector('#message').value = "";

        // 投稿番号をインクリメント
        number++;
    });
});


document.querySelector('#check').addEventListener('click', () => {
    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.number;
        console.log( value );

        console.log( number );
        if( number != value ) {
            const params = {
                method: "POST",
                body: 'start='+number,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'               
                }
            }
            const url = "/read";
            fetch( url, params )
            .then( (response) => {
                if( !response.ok ) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then( (response) => {
                number += response.messages.length;
                for (let mes of response.messages) {
                    console.log(mes); // 表示する投稿
                
                    let cover = document.createElement('div');
                    cover.className = 'cover';
                
                    // 投稿番号を表示
                    let id_area = document.createElement('span');
                    id_area.className = 'post-id';
                    id_area.innerText = `#${number + 1}: `;
                
                    let name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;
                
                    let mes_area = document.createElement('span');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;
                
                    // いいねボタン
                    let like_btn = document.createElement('button');
                    like_btn.className = 'like-btn';
                    like_btn.innerText = 'いいね (0)';
                    like_btn.dataset.id = number + 1;
                    like_btn.addEventListener('click', () => {
                        let likes = parseInt(like_btn.innerText.match(/\d+/)[0]) + 1;
                        like_btn.innerText = `いいね (${likes})`;
                    });
                
                    // 返信ボタン
                    let reply_btn = document.createElement('button');
                    reply_btn.className = 'reply-btn';
                    reply_btn.innerText = '返信';
                    reply_btn.dataset.id = number + 1;
                    reply_btn.addEventListener('click', () => {
                        const replyName = prompt('返信者の名前:');
                        const replyMessage = prompt('返信メッセージ:');
                        if (replyName && replyMessage) {
                            let reply = document.createElement('div');
                            reply.className = 'reply';
                            reply.innerHTML = `
                                ↳ <span class="name">${replyName}:</span>
                                <span class="mes">${replyMessage}</span>
                            `;
                            cover.appendChild(reply);
                        }
                    });
                
                    // 各要素を投稿エリアに追加
                    cover.appendChild(id_area);
                    cover.appendChild(name_area);
                    cover.appendChild(mes_area);
                    cover.appendChild(like_btn);
                    cover.appendChild(reply_btn);
                
                    bbs.appendChild(cover);
                }                
            })
        }
    });
});
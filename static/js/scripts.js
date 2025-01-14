// 为多选按钮添加点击事件监听器
document.getElementById('pdf-btn').addEventListener('click', function() {
    document.getElementById('pdf-input').click();
});

document.getElementById('txt-btn').addEventListener('click', function() {
    document.getElementById('txt-input').click();
});

document.getElementById('word-btn').addEventListener('click', function() {
    document.getElementById('word-input').click();
});

document.getElementById('all-btn').addEventListener('click', function() {
    document.getElementById('all-input').click();
});


// 为文件输入添加变化事件监听器
function handleFileSelect(event) {
    addMessageToChat('Bot', '文件上传中，生成向量库需要一些时间，单个文件需要10-30s,多文件可能会要几分钟，请稍安勿躁。')
    var files = event.target.files; // 获取选中的文件列表
    if (files.length > 0) {
        var formData = new FormData(); // 创建一个新的 FormData 对象
        for (var i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]); // 将每个文件添加到 FormData 对象中
        }

        // 发送文件到后端
        fetch('/article/upload_file/', {
            method: 'POST', // 使用 POST 方法
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // 添加 CSRF token 以进行安全性验证
            },
            body: formData // 将 FormData 对象作为请求的主体
        })
        .then(response => {
            // 检查响应的内容类型
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json(); // 将响应解析为 JSON
            } else {
                return response.text().then(text => { throw new Error(text) });
            }
        })
        .then(data => {
            if (data.message) {
                addMessageToChat('Bot', data.message); // 如果有消息，添加到聊天窗口
            } else {
                addMessageToChat('Bot', 'Error: ' + (data.error || 'Unknown error')); // 如果有错误，显示错误消息
            }
        })
        .catch(error => {
            console.error('Error:', error); // 在控制台中记录错误
            addMessageToChat('Bot', 'Error: ' + error.message); // 在聊天窗口中显示错误消息
        });
    } else {
        addMessageToChat('Bot', '请先选择一个或多个文件'); // 如果没有选择文件，显示提示消息
    }
}


document.getElementById('pdf-input').addEventListener('change', handleFileSelect);
document.getElementById('txt-input').addEventListener('change', handleFileSelect);
document.getElementById('word-input').addEventListener('change', handleFileSelect);
document.getElementById('all-input').addEventListener('change', handleFileSelect);

//对话框输入的处理和输出
document.getElementById('send-btn').addEventListener('click', function() {
    var input = document.getElementById('chat-input');
    var message = input.value;
    if (message.trim() !== '') {
        addMessageToChat('You', message);

        // 发送 AJAX 请求到后端
        fetch('/article/chat_with_gpt/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 确保使用 JSON 格式
                'X-CSRFToken': getCookie('csrftoken') // 获取 CSRF token
            },
            body: JSON.stringify({
                'message': message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                addMessageToChat('Bot', data.response);
            } else {
                addMessageToChat('Bot', 'Error: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        input.value = ''; // 清空输入框
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function addMessageToChat(sender, message) {
    var chatBox = document.querySelector('.chat-messages');
    var messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // 滚动到最新消息
}

// 为读取文件按钮添加点击事件监听器
document.getElementById('read-file-btn').addEventListener('click', function() {
    addMessageToChat('Bot', '文件上传中，生成向量库需要一些时间，单个文件需要10-30s,多文件可能会要几分钟，请稍安勿躁。')
    var fileInput = document.getElementById('file-input');
    var files = fileInput.files;
    // var files = event.target.files; // 获取选中的文件列表

    if (files.length > 0) {
        var formData = new FormData(); // 创建一个新的 FormData 对象
        for (var i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]); // 将每个文件添加到 FormData 对象中
        }

        // 发送文件到后端
        fetch('/article/upload_file/', {
            method: 'POST', // 使用 POST 方法
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // 添加 CSRF token 以进行安全性验证
            },
            body: formData // 将 FormData 对象作为请求的主体
        })
        .then(response => {
            // 检查响应的内容类型
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json(); // 将响应解析为 JSON
            } else {
                return response.text().then(text => { throw new Error(text) });
            }
        })
        .then(data => {
            if (data.message) {
                addMessageToChat('Bot', data.message); // 如果有消息，添加到聊天窗口
            } else {
                addMessageToChat('Bot', 'Error: ' + (data.error || 'Unknown error')); // 如果有错误，显示错误消息
            }
        })
        .catch(error => {
            console.error('Error:', error); // 在控制台中记录错误
            addMessageToChat('Bot', 'Error: ' + error.message); // 在聊天窗口中显示错误消息
        });
    } else {
        addMessageToChat('Bot', '请先选择一个或多个文件'); // 如果没有选择文件，显示提示消息
    }
});


// 为保存按钮添加点击事件监听器
document.getElementById('save-btn').addEventListener('click', function() {
    var selectedOptions = [];
    var knowledge1 = document.getElementById('knowledge1');
    var knowledge2 = document.getElementById('knowledge2');
    var knowledge3 = document.getElementById('knowledge3');

    if (knowledge1.checked) {
        selectedOptions.push(knowledge1.value);
    }
    if (knowledge2.checked) {
        selectedOptions.push(knowledge2.value);
    }
    if (knowledge3.checked) {
        selectedOptions.push(knowledge3.value);
    }

    var blob = new Blob([selectedOptions.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = '知识库文件.txt';
    link.click();
    URL.revokeObjectURL(url);

    // 显示保存路径
    document.getElementById('save-path').textContent = '保存路径：' + link.download;
});

// 定义一个函数，用于将消息添加到聊天窗口
function addMessageToChat(sender, message) {
    var chatMessages = document.querySelector('.chat-messages');
    var newMessage = document.createElement('div');
    var senderClass = sender === 'You' ? 'user-message' : 'bot-message';
    newMessage.className = `chat-message ${senderClass}`;
    newMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(newMessage);

    var clearfix = document.createElement('div');
    clearfix.style.clear = 'both';
    chatMessages.appendChild(clearfix);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


window.onload = function() {
    // 通过id获取文本框元素
    var textBox = document.getElementById('myTextBox');

    // 为文本框添加事件监听器，例如输入变化时触发
    textBox.addEventListener('input', function() {
        // 这里可以写上处理文本框输入的逻辑
        console.log('文本框的当前内容是：' + textBox.value);
    });

    // 如果需要，可以暴露一个接口供其他脚本调用
    window.setTextBoxValue = function(newValue) {
        textBox.value = newValue;
    };
};

// 刷新按钮接口
document.getElementById('refreshButton').addEventListener('click', function() {
    fetch('/article/get_vectorstore_metadata/', {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.files) {
            document.getElementById('myTextBox').innerHTML = data.files.join('<br>');
        } else {
            document.getElementById('myTextBox').innerHTML = '没有加载的文件';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('myTextBox').innerHTML = 'Error: ' + error;
    });
});


document.getElementById('refreshSettingButton').addEventListener('click', function () {
    addMessageToChat('Bot', '设定更新成功。')
    var input = document.getElementById('userInput');
    var userInput = input.value;
    // 将用户输入的数据发送到后端
    if (userInput.trim() !== '') {
        fetch('/article/save_context/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // 获取 CSRF token
            },
            body: JSON.stringify({
                'context': userInput
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                document.getElementById('gptResponse').textContent = data.response;
            } else if (data.error) {
                document.getElementById('gptResponse').textContent = `Error: ${data.error}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('gptResponse').textContent = '请求失败，请重试。';
        });
    }
});


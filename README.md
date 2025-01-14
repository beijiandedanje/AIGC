# rag
这是aigc作业的代码仓库

alice镇楼

![爱丽丝](https://github.com/user-attachments/assets/dbdca6f9-9bb7-4a15-8764-6fd739bed755)

# 部署流程（如果还是有什么报错或者不懂的，请去问21级人智姚奕丹)

确定你已经下载zip或者拉取了github项目，启动虚拟环境，接着进入工作环境，即/rag-main/下

```
新建虚拟环境（conda）
conda create --name rag python=3.10

进入虚拟环境
conda activate rag

安装依赖库
pip install -r requirements.txt

启动服务器：
python manage.py runserver 0.0.0.0:8000
```

网页客户端显示网址：http://**服务器ip**:8000/article/article-home/

# （选做）下面是在远程服务器上安装和配置 Gunicorn 和 Nginx 来部署 Django 项目的步骤,正常测试不需要：
0，进入环境
```
conda activate rag
```
1，安装必要的软件
```
sudo apt install nginx
pip install gunicorn
```
2，配置 Gunicorn

转到 Django 项目目录
```
cd /home/user02/rag-code/rag
```
创建一个 Gunicorn 服务文件，以便在服务器启动时自动运行 Gunicorn：
```
sudo nano /etc/systemd/system/gunicorn.service
```
在该文件中添加以下内容：
```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=user02 # 替换为实际用户名
Group=www-data # 替换为实际用户组
WorkingDirectory=/home/user02/rag-code/rag # 替换未实际项目路径
ExecStart=/home/user02/.conda/envs/rag/bin/gunicorn --workers 3 --bind unix:/home/user02/rag-code/rag/gunicorn.sock rag.wsgi:application # 替换为实际项目路径

[Install]
WantedBy=multi-user.target
```
保存并关闭文件 (Ctrl+O, Ctrl+X)。

启动并启用 Gunicorn 服务：
```
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```
3，配置 Nginx
```
sudo nano /etc/nginx/sites-available/rag
```
在文件中添加以下内容：
```
server {
    listen 80;
    server_name 202.116.3.30; # 替换为实际服务器域名或 IP 地址

    client_max_body_size 100M; # 确保可以上传大文件

    # 静态文件配置
    location /static/ {
        alias /home/user02/rag-code/rag/static/; # 替换为实际项目路径
    }

    # 媒体文件配置
    location /media/ {
        alias /home/user02/rag-code/rag/media/; # 替换为实际项目路径
    }

    # 代理请求到 Gunicorn
    location / {
        proxy_pass http://unix:/home/user02/rag-code/rag/gunicorn.sock; # 替换为实际项目路径
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
保存并关闭文件。接着创建一个符号链接，将配置文件链接到 sites-enabled 目录：
```
sudo ln -s /etc/nginx/sites-available/rag /etc/nginx/sites-enabled
```
测试 Nginx 配置是否正确：
```
sudo nginx -t
```
检测是否输出下列内容：
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
如果没有错误，重新加载 Nginx：
```
sudo systemctl restart nginx
```

测试 Gunicorn 配置是否正确：
```
sudo systemctl status gunicorn
```

输出下列内容说明配置正确：
```
● gunicorn.service - gunicorn daemon
     Loaded: loaded (/etc/systemd/system/gunicorn.service; enabled; vendor preset: enabled)
     Active: active (running) since Sat 2024-08-31 11:09:33 CST; 15min ago
```

如配置错误，修改gunicorn.service，并重新启动Gunicorn：
```
sudo systemctl restart gunicorn
```



**完成上述步骤，就可以实现网页在服务器里自启动，并且可以在校园网里面，通过 'http://服务器ip/article/article-home/' 直接访问网页了**
# 测试流程

进入网页之后，如图所示，测试用的文件放在/media/upload/目录下，测试时建议把向量库里的内容全部删掉，

随着测试过程重新生成，需要注意的是在测试csv文件时，所需时间会比较长，不要多次重复点击，可能会需要5分钟不等:

测试流程如下：

1，传入文件，点击‘选择文件’按钮，选择一个或者多个文件，再点击‘读取文件’按钮上传文件，或者直接点击下方带有文件类型的按钮，选择特定类型的文件

2，文件上传过程反馈，**注意注意注意**点击完生成向量库需要时间，在没有报错文本出现时，不要重复点击！！！！

3，与gpt交互，输入你想要问的跟上传文件有关的问题，即可得到答案了（这部分也需要反应时间，不要着急）

4，点击刷新按钮，你就可以看到你已经上传的文件了

![test](https://github.com/user-attachments/assets/89c7583a-7135-459e-a560-f0eb7ef8256e)


# 修改建议

上传的时候如果修改的比较多，可以把相关的某些函数当做api引用，文件统一放在/utils/下面。

主要文件在**article\views.py**和**static\js\scripts.js**中，建议先看这两个文件，我主要修改的代码就在这里面，也有添加具体的注释，相关情况请看文件

同时，我自己使用的是chormab的向量数据库，后续有修改也在这里说明一下

关于ocr处理，建议在读入文档的时候先对带有图片的pdf进行处理，在有图片的部分交给gpt-4o处理然后生成概述文字，

并且覆盖原本的图片位置，之后将处理完的文本存储为word文件，再按word文件处理方式处理即可。

关于多个向量库，可以先跟前端沟通一下，添加那三个向量库按钮的响应，然后在article\views.py文件里修改vectorstore指向的数据库




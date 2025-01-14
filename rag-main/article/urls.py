

# 引入path
from django.urls import path
from . import views
# 正在部署的应用的名称
app_name = 'article'

urlpatterns = [
    # path函数将url映射到视图
    path('article-home/', views.article_home, name='article_home'),
    path('upload_file/', views.upload_file, name='upload_file'),  
    path('chat_with_gpt/', views.chat_with_gpt, name='chat_with_gpt'),
    path('get_vectorstore_metadata/', views.get_vectorstore_metadata, name='get_vectorstore_metadata'),
    path('save_context/', views.save_context, name='save_context'),
]
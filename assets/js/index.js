$(function(){
    // 调用getUserInfo 获取用户基本信息
    getUserInfo()
    // 点击按钮，实现退出功能
    $('#btnLogout').on('click',function(){
          // 提示用户是否确认退出
        layer.confirm('确定要退出?', {icon: 3, title:'提示'}, function(index){
    //   清空本地存储中的 token
    localStorage.removeItem('token')
    // 重新跳转到登录页面
    location.href = '/code/login.html'
    // 关闭confirm询问框
            layer.close(index);
          });
    })
})
// 获取用户的基本信息
function getUserInfo(){
$.ajax({
    method: 'GET',
    url:'/my/userinfo',
    // headers 就是请求头配置对象
    // headers:{
    //     Authorization:localStorage.getItem('token') || ''
    // },
    success: function(res){
    //  console.log(res);
    if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
    }
    // 调用 renderAvatar 渲染用户的头像
    renderAvatar(res.data)
    },
    // 无论成功还是失败，都会调用complete
    // complete:function(res){
    //     // console.log('*****');
    //     // console.log(res);
    //     // 在complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    // if (res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！') {
    //     // 强制清空 token
    //     localStorage.removeItem('token')
    //     // 强制跳转到登录页
    //     location.href = '/code/login.html'
    // }
    // }
})
}

// 渲染用户的头像
function renderAvatar(user){
    // 获取用户名称
   let name = user.username || user.nickname
//    设置欢迎的文本
   $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
//    按需渲染用户的头像
if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.luser_pic).show()
    $('.text-avatar').hide()
}else{
//    渲染文本头像
$('.layui-nav-img').hide()
let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
}
}
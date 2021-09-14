$(function () {
  // 点击“去注册账号”的链接
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  // 点击“去登录”的链接
  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  // 从layui中获取 form 对象
  let form = layui.form;
  // 从layui中获取 layer 对象
  let layer = layui.layer;
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    // 自定义了一个叫做ped的校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //   验证两次密码是否一致的规则
    repwd: function (value) {
      //   通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败，则return一个错误的提示
      let pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "密码不一致！ ";
      }
    },
  });

  // 监听注册表单的提交事件
  $("#form_reg").on("submit", function (e) {
    // 阻止默认的提交行为
    e.preventDefault();
    // 发起ajas的post请求
    let data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    $.post(
      "/api/reguser",data,
      function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        //   模拟人的点击行为
        $("#link_login").click();
      }
    );
  });
// 监听登录表单的提交事件
  $('#form_login').submit(function(e){
       // 阻止默认的提交行为
e.preventDefault()
// 发起ajas的post请求
$.ajax({
    url:'/api/login',
    method:'POST',
    // 快速获取表单中的数据
    data: $(this).serialize(),
    success: function(res){
 if (res.status !== 0) {
     return layer.msg('账号或密码错误！')
 }
 layer.msg('登录成功！')
//  将登录成功得到的token 字符串保存到 localStorage 中
localStorage.setItem('token',res.token)
//  跳转到后台主页
location.href = '/code/index.html'
    }
})
  })
});

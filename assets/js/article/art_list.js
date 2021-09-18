$(function(){
    let layer = layui.layer
   let form = layui.form
   var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
          
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // // 定义补零的函数
    function padZero(n){
       return n > 9 ? n : '0' + n
    }
  
    // // 定义一个查询的参数对象，将来请求数据的时候，
    // // 需要将请求参数对象提交到服务器
    let q = {
        pagenum:1,//	页码值
        pagesize:2,//	每页显示多少条数据
        cate_id:'',//文章分类的 Id
        state:''//	文章的状态
    }
    initTable()
    initCate()
    // 文章列表数据的方法
    function initTable() {
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data: q,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面数据
              let htmlStr = template('tpl-table',res)
              $('tbody').html(htmlStr)
            //   调用渲染分页的方法
              renderPage(res.total)
            }
        })
    }

 // 初始化文章分类的方法
 function initCate(){
    $.ajax({
         method:'GET',
         url:'/my/article/cates',
         success:function(res){
             if(res.status !==0){
                 return layer.msg('初始化文章分类失败！')
             }
            //  console.log(res);
            //  调用模板引擎渲染分类的可选项
          let htmlStr = template('tpl-cate',res)
          $('[name=cate_id]').html(htmlStr)
        //   通知 layui 重新渲染表单区域的Ui结构
          form.render()
         }
    }) 

}    

// 为筛选表单绑定submit 事件
$('#form_search').on('submit',function(e){
    // 真正表单没人提交行为
    e.preventDefault()
    // 获取表单中选中的值
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    // 为查询对象 q 中的对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    //根据最新的筛选条件，重新渲染表格的数据
    initTable()
})

// 定义渲染分页的方法
function renderPage(total){
// console.log(total);
laypage.render({
    elem: 'pageBox' //注意，这里的 pageBox 是 ID，不用加 # 号
    ,count: total,//数据总数，从服务端得到
    limit:q.pagesize,//每页显示当时数据
    curr:q.pagenum, //默认选中那一页
    layout:['count','limit','prev', 'page', 'next','skip'],
    limits:[2, 3, 4, 5, 6],
    // 分页发生切换的时候，触发 jump 回调
    // 触发 jump 回调的方式有两种 
    // 1.点击页面的时候，会触发 jump 回调
    // 2.只要调用了 laypage.render() 方法，就会 触发 jump 回调
    jump: function(obj,first){
        // 可以通过first的值判断是那种方式触发的jump 回调
        // 如果first的值为true，证明是方式2触发
        // 否则就是方式1触发
        // 把最新的页码值，赋值到 q 这个查询对象中
       q.pagenum = obj.curr
    //    把最新的条目数，赋值到q这个查询对象的pagesize 属性中
    q.pagesize = obj.limit
// 根据最新的q获取对应的数据列表，并渲染表格
if(!first){
    initTable()
}
       
    }
  });
}

// 通过代理的的形式，为删除按钮绑定点击事件处理函数
$('tbody').on('click','.btn-delete',function(){
    // 获取删除按钮的个数
    let len = $('.btn-delete').length
    // 获取文章的id
    let id = $(this).attr('data-id')
    layer.confirm('确定要删除?', {icon: 3, title:'提示'}, function(index){
        $.ajax({
        method:'GET',
        url:'/my/article/delete/'+id,
        success:function(res){
            if(res.status !== 0){
                return layer.msg('删除文章失败！')
            }
            layer.msg('删除文章成功！')
            // 当数据删除完成后，需要判断当前这一页中。是否还有剩余的数据，
            // 如果没有剩余的数据，则让页码值 -1之后，
            // 在重新调用 initTable 方法
            if(len === 1){
                // 如果 len 的值等于1，证明删除完毕之后，页码上就没有数据了
                // 页码最小必须是1
                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
            }
            initTable()
        }
        })
        
        layer.close(index);
      });
})
    
})
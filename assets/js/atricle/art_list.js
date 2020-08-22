$(function() {
    var layer = layui.layer;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: ""
    };
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 初始化文章列表
    initTable();
    var form = layui.form;
    initCate();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res)
                var str = template('tpl-table', res);
                // console.log(str)
                $("tbody").html(str);
                renderPage(res.total)
            }
        });
    }
    // ---------------获取分类--------------
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template("tpl-cate ", res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 筛选提交行为
    $(".form-search").on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })
    var laypage = layui.laypage;
    // 分页
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条内容
            curr: q.pagenum, //默认在第几页
            // 分页模块设置，显示了那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 每页显示多少条数据的选择器
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                //console.log(first)
                //console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // 删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function() {
        var Id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    initTable();
                    layer.msg('删除文章成功！')
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                }
            })
            layer.close(index);
        });
    });

})
$(function() {
    var layer = layui.layer;
    initArtCateList();
    // 文章类别显示
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                var str = template('tpl-art-cate', res);
                $('tbody').html(str);
            }
        })
    }

    // 添加类别单击
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });
    // 提交文章分类添加
    var indexAdd = null;
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('恭喜您，文章类别添加成功');
                layer.close(indexAdd);
            }
        });

    });
    //修改表单
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function(e) {
        e.preventDefault()
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 获取Id，发送ajax获取数据，渲染到动画
        var Id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    });
    // 修改-提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('恭喜您，文章类别更新成功');
                layer.close(indexEdit);
            }
        });

    });
    // 删除
    $('tbody').on('click', '.btn-delete', function() {
        var Id = $(this).attr('data-id');
        //eg1
        layer.confirm('是否确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something

            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,

                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg('恭喜您，文章类别删除成功');
                    layer.close(index);
                }
            });
        });
    });
})
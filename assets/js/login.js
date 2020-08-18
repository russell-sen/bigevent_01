$(function() {
    // 登录
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 注册
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //--------自定义验证规则-----------------
    var form = layui.form
    var layer = layui.layer
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码为6-12位，切不包含空格'],
            repwd: function(value) {
                var pass = $('.reg-box input[name=password]').val();
                if (pass !== value) {
                    return "两次密码输入不一致"
                }
            }

        })
        //注册提交
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/api/reguser',
                data: {
                    username: $('.reg-box [name=username]').val(),
                    password: $('.reg-box [name=password]').val(),
                },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg("注册成功，请登录");
                    $("#link_login").click();
                    $("#form_reg")[0].reset();
                }
            });
        })
        //登录提交
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("登陆成功");
                localStorage.setItem('token', res.token)
                location.href = '/index.html';
            }
        })
    })
})
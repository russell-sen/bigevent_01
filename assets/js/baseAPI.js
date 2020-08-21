var baseURL = 'http://ajax.frontend.itheima.net';
// 开发环境服务器地址
//拦截所有ajax请求：POST  GIT  ajax
// 处理参数
$.ajaxPrefilter(function(params) {
    // 拼接对应环境的服务器地址
    params.url = baseURL + params.url;
    // 对需要权限的借口配置头信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    params.complete = function(res) {
        // console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            // 清空本地token
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html';
        }
    }
})
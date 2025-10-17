console.log("JavaScript 文件开始加载");

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM内容加载完毕");
    
    const loginForm = document.getElementById('loginForm');
    console.log("登录表单元素：", loginForm);

    if (loginForm) {
        // 表单提交事件
        loginForm.addEventListener('submit', function (event) {
            console.log("表单提交事件触发");
            event.preventDefault(); // 阻止默认提交行为

            const userType = document.getElementById('userType').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log("用户类型：", userType);
            console.log("用户名：", username);

            if (!userType) {
                alert('请选择用户类型');
                return;
            }

            // 根据用户类型设置不同的提交路径
            const form = document.getElementById('loginForm');
            console.log("准备提交表单，当前表单：", form);
            
            switch(userType) {
                case 'STUDENT':
                    form.action = '/student/login';
                    break;
                case 'TEACHER':
                    form.action = '/teacher/login';
                    break;
                case 'ADMIN':
                    form.action = '/admin/login';
                    break;
            }

            console.log("表单提交路径：", form.action);
            form.submit();
        });
    } else {
        console.error("未找到登录表单元素");
    }
});

// 添加错误处理
window.onerror = function(msg, url, line) {
    console.error(`JavaScript错误: ${msg}`);
    console.error(`出错文件: ${url}`);
    console.error(`出错行号: ${line}`);
    return false;
};
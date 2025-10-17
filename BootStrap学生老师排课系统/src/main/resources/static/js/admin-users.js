$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载用户列表
    loadUsers();

    // 搜索框输入事件
    $('#searchInput').on('input', function() {
        loadUsers();
    });

    // 用户类型筛选事件
    $('#userTypeFilter').change(function() {
        loadUsers();
    });

    // 提交新用户表单
    $('#submitUser').click(function() {
        const formData = {
            username: $('input[name="username"]').val(),
            password: $('input[name="password"]').val(),
            userType: $('select[name="userType"]').val()
        };

        // 表单验证
        if (!formData.username || !formData.password) {
            alert('请填写完整信息');
            return;
        }

        // 发送请求
        $.ajax({
            url: '/api/admin/users',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                alert('用户添加成功');
                $('#addUserModal').modal('hide');
                $('#addUserForm')[0].reset();
                loadUsers();
            },
            error: function(xhr) {
                alert('添加失败：' + xhr.responseJSON.message);
            }
        });
    });

    // 删除用户事件绑定
    $(document).on('click', '.btn-delete-user', function() {
        if (confirm('确定要删除这个用户吗？')) {
            const userId = $(this).data('user-id');
            deleteUser(userId);
        }
    });

    // 重置密码事件绑定
    $(document).on('click', '.btn-reset-password', function() {
        if (confirm('确定要重置密码吗？')) {
            const userId = $(this).data('user-id');
            resetPassword(userId);
        }
    });
});

function loadUsers() {
    const search = $('#searchInput').val();
    const userType = $('#userTypeFilter').val();

    $.ajax({
        url: '/api/admin/users',
        method: 'GET',
        data: {
            search: search,
            userType: userType
        },
        success: function(users) {
            displayUsers(users);
        },
        error: function(xhr) {
            alert('加载用户列表失败：' + xhr.responseJSON.message);
        }
    });
}

function displayUsers(users) {
    const tbody = $('#userList');
    tbody.empty();

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${formatUserType(user.userType)}</td>
                <td>${formatDateTime(user.createdAt)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-warning btn-reset-password" 
                                data-user-id="${user.id}">
                            <i class="bi bi-key"></i> 重置密码
                        </button>
                        <button class="btn btn-danger btn-delete-user" 
                                data-user-id="${user.id}">
                            <i class="bi bi-trash"></i> 删除
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

function deleteUser(userId) {
    $.ajax({
        url: `/api/admin/users/${userId}`,
        method: 'DELETE',
        success: function() {
            alert('用户删除成功');
            loadUsers();
        },
        error: function(xhr) {
            alert('删除失败：' + xhr.responseJSON.message);
        }
    });
}

function resetPassword(userId) {
    $.ajax({
        url: `/api/admin/users/${userId}/reset-password`,
        method: 'POST',
        success: function(response) {
            alert(`密码重置成功，新密码为：${response.password}`);
        },
        error: function(xhr) {
            alert('重置密码失败：' + xhr.responseJSON.message);
        }
    });
}

function formatUserType(userType) {
    const typeMap = {
        'ADMIN': '管理员',
        'TEACHER': '教师',
        'STUDENT': '学生'
    };
    return typeMap[userType] || userType;
}

function formatDateTime(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
} 
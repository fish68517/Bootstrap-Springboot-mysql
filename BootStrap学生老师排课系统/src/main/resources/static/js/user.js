const apiUrl = '/api/users';

// 定义分页相关变量
let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let totalElements = 0;

// 页面加载完成时的初始化
document.addEventListener('DOMContentLoaded', function () {
    // 首先加载用户列表
    fetchUsers();
    
    // 然后加载模态框
    loadModalAndInitialize();
});

// 加载模态框并初始化
function loadModalAndInitialize() {
    fetch('user-modal.html')
        .then(response => response.text())
        .then(html => {
            // 移除旧模态框
            const oldModal = document.getElementById('userModal');
            if (oldModal) {
                oldModal.remove();
            }
            
            // 添加新模态框
            document.body.insertAdjacentHTML('beforeend', html);
            console.log("模态框HTML加载成功。。。。");
            
            // 确保模态框完全加载后再初始化事件监听
            setTimeout(() => {
                // 打印日志
                console.log("延时分页加载。。。。。");
                initializePageSizeListener();
            }, 0);
        })
        .catch(error => {
            console.error("加载模态框失败：", error);
        });
}

// 初始化分页大小监听器
function initializePageSizeListener() {
    const pageSizeSelect = document.getElementById('pageSize');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function (e) {
            pageSize = parseInt(e.target.value);
            currentPage = 0;
            fetchUsers();
        });
        console.log("分页大小监听器初始化成功");
    } else {
        console.error("找不到分页大小选择器元素");
    }
}

// fetchUsers 函数保持不变
function fetchUsers() {
    fetch(`${apiUrl}?page=${currentPage + 1}&size=${pageSize}`)
        .then(response => response.json())
        .then(data => {
            console.log("获取用户列表成功：", data);
            
            // 更新分页信息 - PageHelper 返回的是 PageInfo 对象
            totalPages = data.pages;           // 总页数
            totalElements = data.total;        // 总记录数
            currentPage = data.pageNum - 1;    // 当前页码（转换为从0开始）
            
            // 更新表格内容 - 使用 data.list 而不是 data.content
            const tableBody = document.getElementById('userTableBody');
            tableBody.innerHTML = '';
            data.list.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.password}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">编辑</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">删除</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

            // 更新总条数显示
            document.getElementById('totalElements').textContent = totalElements;
            
            // 更新分页控件
             updatePagination();
        })
        .catch(error => {
            console.error("获取用户列表失败：", error);
        });
}

// Add a new user
function addUser() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    new bootstrap.Modal(document.getElementById('userModal')).show();
}

// Edit an existing user
function editUser(id) {
    console.log("编辑用户111：" + id);
    // 修改 fetch 的使用方式
    fetch(`${apiUrl}/${id}`)
        .then(response => response.json())
        .then(user => {  // 直接使用返回的数据
            console.log("获取用户数据成功111：" + JSON.stringify(user));
            document.getElementById('userId').value = user.id;
            document.getElementById('username').value = user.username;
            document.getElementById('password').value = user.password;
            document.getElementById('email').value = user.email;

            const userModal = new bootstrap.Modal(document.getElementById('userModal'));
            userModal.show();
            console.log("模态框显示成功！！！");
        })
        .catch(error => {
            console.error('获取用户数据失败:', error);
        });
}



// Save user (Add or Update)
// Save user (Add or Update)
// Save user (Add or Update)
document.addEventListener('submit', function (e) {
        const form = e.target;
        if (form.id === 'userForm') {
            e.preventDefault();
            const id = document.getElementById('userId').value;
            const user = {
                id: document.getElementById('userId').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                email: document.getElementById('email').value
            };
            console.log("提交用户数据：" + JSON.stringify(user));
            if (id) {
                // Update user
                fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(result => {
                        if (result.success) {
                            console.log('更新成功:', result.message);
                            fetchUsers();  // 刷新用户列表
                            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
                        } else {
                            throw new Error(result.message || '更新失败');
                        }
                    })
                    .catch(error => {
                        console.error('更新用户失败:', error);
                        alert('更新用户失败：' + error.message);
                    });
            } else {
                // Add new user
                console.log("添加用户数据：" + JSON.stringify(user));
                axios.post(apiUrl, user)
                    .then(response => {
                        if (response.data.success) {
                            console.log('添加成功:', response.data.message);
                            fetchUsers();
                            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
                        } else {
                            throw new Error(response.data.message || '添加失败');
                        }
                    })
                    .catch(error => {
                        console.error('添加用户失败:', error);
                        alert('添加用户失败：' + (error.response?.data?.message || error.message));
                    });
            }
        }
    }
);

// Delete user
function deleteUser(id) {
    if (confirm('你确定删除此用户吗？删除后不能恢复r?')) {
        axios.delete(`${apiUrl}/${id}`)
            .then(fetchUsers);
    }
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    // 生成分页按钮的HTML
    let paginationHTML = '';
    
    // 上一页按钮
    paginationHTML += `
        <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage - 1})">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    // 页码按钮
    // 显示当前页附近的页码，最多显示5个页码
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // 如果总页数较少，直接显示所有页码
    if (totalPages <= 5) {
        startPage = 0;
        endPage = totalPages - 1;
    } else {
        // 确保始终显示5个页码
        if (currentPage < 2) {
            endPage = 4;
        }
        if (currentPage > totalPages - 3) {
            startPage = totalPages - 5;
        }
    }
    
    // 如果不是从第一页开始，显示省略号
    if (startPage > 0) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(0)">1</a>
            </li>
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>
        `;
    }
    
    // 生成页码按钮
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i + 1}</a>
            </li>
        `;
    }
    
    // 如果不是显示到最后一页，显示省略号
    if (endPage < totalPages - 1) {
        paginationHTML += `
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>
            <li class="page-item">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(${totalPages - 1})">${totalPages}</a>
            </li>
        `;
    }
    
    // 下一页按钮
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage + 1})">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
}
 
 // 切换页码的函数
 function changePage(page) {
    if (page < 0 || page >= totalPages) return;
    currentPage = page;
    fetchUsers();
 }


// 更新分页控件
function updatePagination()
{
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    pagination.innerHTML = '';

    // 生成分页按钮的HTML
    let paginationHTML = '';

    // 上一页按钮
    paginationHTML += `
       <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
           <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage - 1})">
               <span aria-hidden="true">&laquo;</span>
           </a>
       </li>
   `;

    // 页码按钮
    // 显示当前页附近的页码，最多显示5个页码
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    // 如果总页数较少，直接显示所有页码
    if (totalPages <= 5) {
        startPage = 0;
        endPage = totalPages - 1;
    } else {
        // 确保始终显示5个页码
        if (currentPage < 2) {
            endPage = 4;
        }
        if (currentPage > totalPages - 3) {
            startPage = totalPages - 5;
        }
    }

    // 如果不是从第一页开始，显示省略号
    if (startPage > 0) {
        paginationHTML += `
           <li class="page-item">
               <a class="page-link" href="javascript:void(0)" onclick="changePage(0)">1</a>
           </li>
           <li class="page-item disabled">
               <span class="page-link">...</span>
           </li>
       `;
    }

    // 生成页码按钮
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
           <li class="page-item ${currentPage === i ? 'active' : ''}">
               <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i + 1}</a>
           </li>
       `;
    }

    // 如果不是显示到最后一页，显示省略号
    if (endPage < totalPages - 1) {
        paginationHTML += `
           <li class="page-item disabled">
               <span class="page-link">...</span>
           </li>
           <li class="page-item">
               <a class="page-link" href="javascript:void(0)" onclick="changePage(${totalPages - 1})">${totalPages}</a>
           </li>
       `;
    }

    // 下一页按钮
    paginationHTML += `
       <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
           <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage + 1})">
               <span aria-hidden="true">&raquo;</span>
           </a>
       </li>
   `;

    pagination.innerHTML = paginationHTML;
}
 

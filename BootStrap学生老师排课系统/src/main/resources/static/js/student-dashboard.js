document.addEventListener('DOMContentLoaded', function() {
    // 侧边栏切换
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // 设置当前活动菜单项
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.components li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 响应式处理
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
        }
    }

    // 初始化时执行一次
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 加载统计数据
    loadDashboardStats();
});

// 加载仪表板统计数据
function loadDashboardStats() {
    // 这里可以添加 AJAX 请求来获取实时数据
    fetch('/api/student/stats')
        .then(response => response.json())
        .then(data => {
            // 更新统计数据
            updateStats(data);
        })
        .catch(error => {
            console.error('加载统计数据失败:', error);
        });
}

// 更新统计数据显示
function updateStats(data) {
    // TODO: 根据实际数据更新页面显示
    console.log('统计数据已更新:', data);
} 
$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载统计数据
    loadStatistics();
});

function loadStatistics() {
    $.ajax({
        url: '/api/admin/statistics',
        method: 'GET',
        success: function(data) {
            $('#totalUsers').text(data.totalUsers);
            $('#teacherCount').text(data.teacherCount);
            $('#studentCount').text(data.studentCount);
            $('#totalCourses').text(data.totalCourses);
            $('#activeCourses').text(data.activeCourses);
            $('#currentTerm').text(data.currentTerm);
        },
        error: function(xhr) {
            alert('加载统计数据失败：' + xhr.responseJSON.message);
        }
    });
} 
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
        url: '/api/admin/statistics/details',
        method: 'GET',
        success: function(data) {
            // 更新统计卡片
            updateStatCards(data);
            // 绘制图表
            drawUserTypeChart(data.userTypeStats);
            drawCreditDistChart(data.creditDistribution);
            drawWeekdayDistChart(data.weekdayDistribution);
            drawSelectionTrendChart(data.selectionTrend);
            // 更新热门课程表格
            updateHotCourses(data.hotCourses);
        },
        error: function(xhr) {
            console.error('加载统计数据失败:', xhr);
            alert('加载统计数据失败');
        }
    });
}

function updateStatCards(data) {
    $('#totalUsers').text(data.totalUsers);
    $('#totalCourses').text(data.totalCourses);
    $('#totalSelections').text(data.totalSelections);
    $('#todaySelections').text(data.todaySelections);
}

function drawUserTypeChart(data) {
    const ctx = document.getElementById('userTypeChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['管理员', '教师', '学生'],
            datasets: [{
                data: [
                    data.adminCount,
                    data.teacherCount,
                    data.studentCount
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function drawCreditDistChart(data) {
    const ctx = document.getElementById('creditDistChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: '课程数量',
                data: Object.values(data),
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function drawWeekdayDistChart(data) {
    const ctx = document.getElementById('weekdayDistChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五'],
            datasets: [{
                label: '课程数量',
                data: [
                    data.MON || 0,
                    data.TUE || 0,
                    data.WED || 0,
                    data.THU || 0,
                    data.FRI || 0
                ],
                backgroundColor: '#4BC0C0'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function drawSelectionTrendChart(data) {
    const ctx = document.getElementById('selectionTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: '选课数量',
                data: data.counts,
                borderColor: '#FF6384',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateHotCourses(courses) {
    console.log("课程数据：",JSON.stringify(courses));
    const tbody = $('#hotCoursesList');
    tbody.empty();
    
    courses.forEach(course => {
        const row = `
            <tr>
                <td>${course.courseName}</td>
                <td>${course.teacherName}</td>
                <td>${course.credits}</td>
                <td>${course.selectedCount}</td>
            
            </tr>
        `;
        tbody.append(row);
    });
} 
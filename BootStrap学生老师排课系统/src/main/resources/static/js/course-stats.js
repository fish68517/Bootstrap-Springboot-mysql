$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载统计数据
    loadCourseStats();
});

function loadCourseStats() {
    $.ajax({
        url: '/api/courses/teacher/stats',
        method: 'GET',
        success: function(data) {
            console.log("获取到的统计数据:", data);
            
            // 更新统计卡片
            $('#totalCourses').text(data.totalCourses);
            $('#totalCredits').text(data.totalCredits);

            // 绘制图表
            drawCreditsChart(data.creditsCourses);
            drawWeekdayChart(data.weekdayCourses);
        },
        error: function(xhr) {
            console.error('加载统计数据失败：', xhr);
            alert('加载统计数据失败：' + xhr.responseJSON?.message || '未知错误');
        }
    });
}

function drawCreditsChart(creditsData) {
    console.log("绘制学分图表数据:", creditsData);
    const ctx = document.getElementById('creditsChart').getContext('2d');
    
    // 准备数据
    const credits = Object.keys(creditsData);
    const coursesByCredit = credits.map(credit => creditsData[credit].length);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: credits.map(credit => `${credit}学分`),
            datasets: [{
                data: coursesByCredit,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const credit = credits[context.dataIndex];
                            const courses = creditsData[credit];
                            let label = `${credit}学分课程: ${courses.length}门\n`;
                            courses.forEach(course => {
                                label += `\n${course.courseName}`;
                            });
                            return label.split('\n');
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const credit = credits[index];
                    const courses = creditsData[credit];
                    
                    let message = `${credit}学分的课程:\n\n`;
                    courses.forEach(course => {
                        message += `${course.courseName}\n`;
                    });
                    
                    alert(message);
                }
            }
        }
    });
}

function drawWeekdayChart(weekdayData) {
    console.log("绘制周课程图表数据:", weekdayData);
    const ctx = document.getElementById('weekdayChart').getContext('2d');
    const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    const weekdayLabels = ['周一', '周二', '周三', '周四', '周五'];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekdayLabels,
            datasets: [{
                label: '课程数量',
                data: weekdays.map(day => {
                    const courses = weekdayData[day] || [];
                    console.log(`${day} 的课程数量:`, courses.length);
                    return courses.length;
                }),
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
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const weekday = weekdays[context.dataIndex];
                            const courses = weekdayData[weekday] || [];
                            let labels = [`课程数量: ${courses.length}`];
                            courses.forEach(course => {
                                labels.push(`${course.courseName} (${course.credits}学分)`);
                            });
                            return labels;
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const weekday = weekdays[index];
                    const courses = weekdayData[weekday] || [];
                    
                    let message = `${weekdayLabels[index]}的课程:\n\n`;
                    courses.forEach(course => {
                        message += `${course.courseName} (${course.credits}学分)\n`;
                    });
                    
                    alert(message);
                }
            }
        }
    });
} 
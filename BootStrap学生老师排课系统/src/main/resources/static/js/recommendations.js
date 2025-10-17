$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载推荐课程
    loadRecommendations();

    // 绑定选课按钮事件
    $('#selectCourseBtn').click(function() {
        const courseId = $(this).data('course-id');
        selectCourse(courseId);
    });
});

function loadRecommendations() {
    $.ajax({
        url: '/api/selections/recommendations',
        method: 'GET',
        success: function(data) {
            displayRecommendations(data);
        },
        error: function(xhr) {
            alert('加载推荐课程失败：' + xhr.responseJSON.message);
        }
    });
}

function displayRecommendations(courses) {
    const container = $('#recommendationCards');
    container.empty();

    courses.forEach(course => {
        const card = createCourseCard(course);
        container.append(card);
    });
}

function createCourseCard(course) {
    const selectedCount = course.selectedCount || 0;
    const selectedRate = course.capacity ? (selectedCount / course.capacity * 100).toFixed(1) : 0;

    return `
        <div class="col-md-4">
            <div class="card course-card">
                <div class="card-body">
                    <span class="recommendation-tag">推荐课程</span>
                    <h5 class="card-title">${course.courseName}</h5>
                    <p class="card-text">${course.description || '暂无描述'}</p>
                    <div class="course-brief">
                        <p><i class="bi bi-award"></i> ${course.credits}学分</p>
                        <p><i class="bi bi-person"></i> ${course.teachers?.[0]?.username || '待定'}</p>
                     
                    </div>
                    <button class="btn btn-outline-primary mt-2" 
                            onclick="showCourseDetail(${course.id})">
                        查看详情
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showCourseDetail(courseId) {
    $.ajax({
        url: `/api/courses/${courseId}`,
        method: 'GET',
        success: function(course) {
            // 填充课程基本信息
            $('#detailCourseName').text(course.courseName);
            $('#detailDescription').text(course.description);
            $('#detailCredits').text(course.credits);
            $('#detailTeacher').text(course.teachers?.[0]?.username || '待定');
            $('#detailSelectedCount').text(course.selectedCount || 0);
            $('#detailCapacity').text(course.capacity);

            // 填充课程安排
            const scheduleList = $('#detailSchedule');
            scheduleList.empty();
            if (course.schedules && course.schedules.length > 0) {
                course.schedules.forEach(schedule => {
                    scheduleList.append(`
                        <li>
                            <i class="bi bi-clock"></i>
                            ${formatDayOfWeek(schedule.dayOfWeek)}
                            ${schedule.startTime}-${schedule.endTime}
                            <br>
                            <small class="text-muted">
                                <i class="bi bi-building"></i>
                                ${schedule.classroom || '教室待定'}
                            </small>
                        </li>
                    `);
                });
            } else {
                scheduleList.append('<li>暂无课程安排</li>');
            }

            // 获取并显示推荐原因
            $.ajax({
                url: `/api/selections/recommendations/${courseId}/reasons`,
                method: 'GET',
                success: function(reasons) {
                    const reasonsList = $('#recommendationReasons');
                    reasonsList.empty();
                    Object.entries(reasons).forEach(([key, value]) => {
                        reasonsList.append(`<li>${value}</li>`);
                    });
                }
            });

            // 设置选课按钮的课程ID
            $('#selectCourseBtn').data('course-id', courseId);

            // 显示模态框
            new bootstrap.Modal(document.getElementById('courseDetailModal')).show();
        },
        error: function(xhr) {
            alert('获取课程详情失败：' + xhr.responseJSON.message);
        }
    });
}

function selectCourse(courseId) {
    $.ajax({
        url: `/api/selections/select/${courseId}`,
        method: 'POST',
        success: function(response) {
            alert('选课成功！');
            $('#courseDetailModal').modal('hide');
            loadRecommendations(); // 重新加载推荐列表
        },
        error: function(xhr) {
            alert('选课失败：' + xhr.responseJSON.message);
        }
    });
}

function formatDayOfWeek(day) {
    const dayMap = {
        'MON': '周一',
        'TUE': '周二',
        'WED': '周三',
        'THU': '周四',
        'FRI': '周五'
    };
    return dayMap[day] || day;
} 
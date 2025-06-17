$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    console.log('my-courses.js loaded');
    // 加载我的课程
    loadMyCourses();

    // 绑定退课按钮事件
    $(document).on('click', '.btn-drop-course', function() {
        const courseId = $(this).data('course-id');
        dropCourse(courseId);
    });

    // 在 $(document).ready 中添加
    $(document).on('click', '.btn-view-detail', function() {
        const courseId = $(this).data('course-id');
        showCourseDetail(courseId);
    });
});

function loadMyCourses() {
    $.ajax({
        url: '/api/courses/my-courses',
        method: 'GET',
        success: function(courses) {
             displayMyCourses(courses);
        },
        error: function(xhr) {
            alert('加载课程失败：' + xhr.responseJSON.message);
        }
    });
}

function displayMyCourses(courses) {
    // 打印courses
    console.log("我的课程：" + JSON.stringify(courses));
    const tbody = $('#myCourseList');
    tbody.empty();

    courses.forEach(course => {
        // 假设 course 是从后端获取的 Course 对象直接定义 firstTeacherUsername
        const firstTeacherUsername = course.teachers && course.teachers.length > 0
            ? course.teachers[0].username
            : '未分配';

        const scheduleText = course.schedules.map(s =>
            `${formatDayOfWeek(s.dayOfWeek)} 第${s.startTime}-${s.endTime}节`
        ).join('<br>');

        const classroomText = course.schedules.map(s =>
            s.classrooms ? s.classrooms.name : ''
        ).join('<br>');
        const row = `
            <tr>
                <td>
                    <a href="javascript:void(0)" 
                       class="btn-view-detail" 
                       data-course-id="${course.id}">
                        ${course.courseName}
                    </a>
                </td>
               
                <td>${firstTeacherUsername}</td>
             
                <td>${course.credits}</td>
                <td>${scheduleText}</td>
                 <td>${classroomText}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-drop-course" 
                            data-course-id="${course.id}">
                        退课
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

function dropCourse(courseId) {
    if (!confirm('确定要退选这门课程吗？')) {
        return;
    }

    $.ajax({
        url: `/api/selections/dropCourse/${courseId}`,
        method: 'DELETE',
        success: function(response) {
            alert('退课成功');
            loadMyCourses();
        },
        error: function(xhr) {
            alert('退课失败：' + xhr.responseJSON.message);
        }
    });
}

function formatSchedule(schedules) {
    /*if (!schedules || schedules.length === 0) {
        return '待安排';
    }
    return schedules.map(s => `${s.formattedDayOfWeek} ${s.timeSlot}`).join('<br>');*/

}

function formatClassroom(schedules) {
    if (!schedules || schedules.length === 0) {
        return '待安排';
    }
    return schedules.map(s => s.classroom || '待安排').join('<br>');
}

// 添加显示课程详情的函数
function showCourseDetail(courseId) {
    $.ajax({
        url: `/api/courses/${courseId}`,
        method: 'GET',
        success: function(course) {
            // 填充基本信息
            $('#detailCourseName').text(course.courseName);
            $('#detailCredits').text(course.credits);
            $('#detailDescription').text(course.description || '暂无描述');

            // 填充教师信息
            const teacherTable = $('#detailTeachers');
            teacherTable.empty();
            if (course.teachers && course.teachers.length > 0) {
                course.teachers.forEach(teacher => {
                    teacherTable.append(`
                        <tr>
                            <td>${teacher.username}</td>
                            <td>${teacher.role || '教师'}</td>
                        </tr>
                    `);
                });
            } else {
                teacherTable.append('<tr><td colspan="2">暂无教师信息</td></tr>');
            }

            // 填充课程安排
            const scheduleTable = $('#detailSchedules tbody');
            scheduleTable.empty();
            if (course.schedules && course.schedules.length > 0) {
                course.schedules.forEach(schedule => {
                    scheduleTable.append(`
                        <tr>
                            <td>${schedule.formattedDayOfWeek}</td>
                            <td>${schedule.timeSlot}</td>
                            <td>${schedule.classroom || '待安排'}</td>
                        </tr>
                    `);
                });
            } else {
                scheduleTable.append('<tr><td colspan="3">暂无课程安排</td></tr>');
            }

            // 显示模态框
            const modal = new bootstrap.Modal(document.getElementById('courseDetailModal'));
            modal.show();
        },
        error: function(xhr) {
            alert('获取课程详情失败：' + xhr.responseJSON.message);
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
$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载课表
    loadTeacherSchedule();
});

function loadTeacherSchedule() {
    // 使用教师课程API获取数据
    $.ajax({
        url: '/api/courses/teacher/schedule',
        method: 'GET',
        success: function(courses) {
            console.log("教师课程数据:", courses);
            renderSchedule(courses);
            updateStatistics(courses);
        },
        error: function(xhr) {
            alert('加载课表失败：' + xhr.responseJSON?.message || '未知错误');
        }
    });
}

function renderSchedule(courses) {
    const timeSlots = [
        { start: "08:00", end: "09:30", index: "1-2" },
        { start: "09:40", end: "11:10", index: "3-4" },
        { start: "11:20", end: "12:50", index: "5-6" },
        { start: "14:00", end: "15:30", index: "7-8" },
        { start: "15:40", end: "17:10", index: "9-10" },
        { start: "18:00", end: "19:30", index: "11-12" }
    ];

    const tbody = $('#scheduleTableBody');
    tbody.empty();

    // 创建课表网格
    timeSlots.forEach(slot => {
        const row = $('<tr>');

        // 添加时间列
        row.append(`
            <td class="time-cell">
                第${slot.index}节<br>
                ${slot.start}-${slot.end}
            </td>
        `);

        // 添加周一至周五的单元格
        ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach(day => {
            const cell = $('<td>');
            const course = findTeacherCourse(courses, day, slot);
            console.log("课程:", JSON.stringify(course));
            if (course) {
                cell.html(`
                    <div class="course-cell">
                        <div class="course-name">${course.courseName}</div>
                        <div class="course-info">
                            ${course.classrooms?.name || '待安排'}
                        </div>
                       
                    </div>
                `);
            }
            
            row.append(cell);
        });

        tbody.append(row);
    });
}

function findTeacherCourse(courses, day, timeSlot) {

    console.log("课程数量：" + JSON.stringify(courses));
    for (const course of courses) {
        // 打印课程
        if (course.schedules) {
            for (const schedule of course.schedules) {
                if (schedule.dayOfWeek === day && 
                    isTimeMatch(schedule.startTime, schedule.endTime, timeSlot)) {
                    return {
                        courseName: course.courseName,
                        classrooms: schedule.classrooms
                    };
                }
            }
        }
    }
    return null;
}

function isTimeMatch(courseStart, courseEnd, timeSlot) {
    const slotStart = timeSlot.start.split(':').map(Number);
    const slotEnd = timeSlot.end.split(':').map(Number);
    const courseStartTime = courseStart.split(':').map(Number);
    const courseEndTime = courseEnd.split(':').map(Number);

    return courseStartTime[0] === slotStart[0] && 
           courseStartTime[1] === slotStart[1] &&
           courseEndTime[0] === slotEnd[0] && 
           courseEndTime[1] === slotEnd[1];
}


function updateStatistics(courses) {
    // 更新统计信息
    $('#totalCourses').text(courses.length);
    
    // 计算总课时
    let totalHours = 0;
    courses.forEach(course => {
        if (course.schedules) {
            totalHours += course.schedules.length * 2; // 每节课2学时
        }
    });
    $('#totalHours').text(totalHours);
    
    // 计算总学生数
    let totalStudents = courses.reduce((sum, course) => sum + (course.selectedCount || 0), 0);
    $('#totalStudents').text(totalStudents);
} 
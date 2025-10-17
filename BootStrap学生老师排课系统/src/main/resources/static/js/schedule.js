$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载课程表
    loadSchedule();
});

function loadSchedule() {
    $.ajax({
        url: '/api/selections/student/schedule',
        method: 'GET',
        success: function(data) {
            renderSchedule(data);
            updateStatistics(data);
        },
        error: function(xhr) {
            alert('加载课表失败：' + xhr.responseJSON.message);
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

        // 添加每天的单元格
        ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach(day => {
            const cell = $('<td>');
            const course = findCourse(courses, day, slot);
            if (course) {
                cell.append(`
                    <div class="course-cell">
                        <div class="course-name">${course.courseName}</div>
                        <div class="course-info">
                            ${course.teacher}<br>
                            ${course.classroom || ''}
                        </div>
                    </div>
                `);
            }
            row.append(cell);
        });

        tbody.append(row);
    });
}

function findCourse(courses, day, timeSlot) {
    for (const course of courses) {
        for (const schedule of course.schedules) {
            if (schedule.dayOfWeek === day && 
                isTimeMatch(schedule.startTime, schedule.endTime, timeSlot)) {
                return {
                    courseName: course.courseName,
                    teacher: course.teachers?.[0]?.username || '未分配',
                    classroom: schedule.classrooms?.name || ''
                };
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
    let totalCourses = courses.length;
    let totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    let weeklyHours = courses.reduce((sum, course) => sum + course.weeklyHours, 0);

    $('#totalCourses').text(totalCourses);
    $('#totalCredits').text(totalCredits);
    $('#weeklyHours').text(weeklyHours);
} 
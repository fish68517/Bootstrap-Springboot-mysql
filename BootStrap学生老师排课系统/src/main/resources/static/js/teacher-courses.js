$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载课程列表
    loadCourses();

    // 添加时间段按钮
    $('#addScheduleBtn').click(function() {
        const scheduleItem = $('.schedule-item').first().clone();
        scheduleItem.find('input, select').val('');
        $('#scheduleContainer').append(scheduleItem);
    });

    // 删除时间段按钮点击事件
    $(document).on('click', '.remove-schedule', function() {
        if ($('.schedule-item').length > 1) {
            $(this).closest('.schedule-item').remove();
        }
    });

    // 提交课程表单
    $('#submitCourse').click(function() {
        const formData = {
            courseName: $('input[name="courseName"]').val(),
            description: $('textarea[name="description"]').val(),
            credits: parseInt($('input[name="credits"]').val()),
            weeklyHours: parseInt($('input[name="weeklyHours"]').val()),
            weeklySessions: parseInt($('input[name="weeklySessions"]').val()),
            capacity: parseInt($('input[name="capacity"]').val()),
            schedules: []
        };

        // 收集所有时间安排
        $('.schedule-item').each(function() {
            const dayOfWeek = $(this).find('select[name="dayOfWeek[]"]').val();
            const startTime = $(this).find('input[name="startTime[]"]').val();
            const endTime = $(this).find('input[name="endTime[]"]').val();
            const classroom = $(this).find('input[name="classroom[]"]').val();

            console.log("时间：" + startTime, "\n", endTime);
            if (dayOfWeek && startTime && endTime && classroom) {
                formData.schedules.push({
                    dayOfWeek,
                    startTime,
                    endTime,
                    classroom
                });
            }
        });

        // 表单验证
        if (!formData.courseName) {
            alert('请输入课程名称');
            return;
        }
        if (!formData.schedules.length) {
            alert('请至少添加一个课程时间安排');
            return;
        }

        // 发送请求
        $.ajax({
            url: '/api/courses/teacher/add-courses',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                alert('课程添加成功');
                $('#addCourseModal').modal('hide');
                loadCourses(); // 重新加载课程列表
                // 清空表单
                $('#addCourseForm')[0].reset();
                // 只保留一个时间安排
                $('.schedule-item:not(:first)').remove();
            },
            error: function(xhr) {
                alert('添加失败：' + xhr.responseJSON.message);
            }
        });
    });

    // 删除课程事件绑定
    $(document).on('click', '.btn-delete-course', function() {
        if (confirm('确定要删除这门课程吗？')) {
            const courseId = $(this).data('course-id');
            deleteCourse(courseId);
        }
    });
    // 编辑课程事件绑定
    $(document).on('click', '.btn-edit-course', function() {
        const courseId = $(this).data('course-id');
        editCourse(courseId);
    });
});

function loadCourses() {
    $.ajax({
        url: '/api/courses/teacher/get-courses',
        method: 'GET',
        success: function(coursesTeacher) {
            displayCourses(coursesTeacher);
        },
        error: function(xhr) {
            alert('加载课程失败：' + xhr.responseJSON.message);
        }
    });
}

function displayCourses(coursesTeacher) {
    const tbody = $('#courseList');
    tbody.empty();

    coursesTeacher.forEach(coursesTeacher => {
        // 打印 coursesTeacher
        console.log("获取教师课程：" + JSON.stringify(coursesTeacher));
        let course = coursesTeacher.course;
        const scheduleText = course.schedules.map(s => 
            `${formatDayOfWeek(s.dayOfWeek)} 第${s.startTime}-${s.endTime}节`
        ).join('<br>');

        const classroomText = course.schedules.map(s =>
            s.classrooms ? s.classrooms.name : ''
        ).join('<br>');

        const classroomCapacityText = course.schedules.map(s =>
            s.classrooms ? s.classrooms.capacity : ''
        ).join('<br>');

        const row = `
            <tr>
                <td>${course.courseName}</td>
                <td>${course.credits}</td>
                <td>${scheduleText}</td>
               <td>${classroomText}</td>
                <td>${classroomCapacityText}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-delete-course" 
                            data-course-id="${course.id}">
                        删除
                    </button>
                </td>
                
                <td>
                    <button class="btn btn-primary  btn-sm btn-edit-course" 
                            data-course-id="${course.id}">
                        编辑
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

function deleteCourse(courseId) {
    $.ajax({
        url: `/api/courses/teacher/delete-courses/${courseId}`,
        method: 'DELETE',
        success: function() {
            alert('课程删除成功');
            loadCourses();
        },
        error: function(xhr) {
            alert('删除失败：' + xhr.responseJSON.message);
        }
    });
}

function editCourse(courseId) {
    // 获取课程数据
    $.ajax({
        url: `/api/courses/teacher/get-course/${courseId}`,
        method: 'GET',
        success: function(course) {
            // 填充表单数据
            const form = $('#editCourseForm');
            form.find('[name="id"]').val(course.id);
            form.find('[name="courseName"]').val(course.courseName);
            form.find('[name="description"]').val(course.description);
            form.find('[name="credits"]').val(course.credits);
            form.find('[name="weeklyHours"]').val(course.weeklyHours);
            form.find('[name="weeklySessions"]').val(course.weeklySessions);
            form.find('[name="capacity"]').val(course.capacity);
            
            // 清空并重新添加课程安排
            const container = $('#editScheduleContainer');
            container.empty();
            course.schedules.forEach(schedule => {
                addScheduleItem(container, schedule);
            });
            
            // 显示模态框
            $('#editCourseModal').modal('show');
        },
        error: function(xhr) {
            alert('获取课程信息失败：' + xhr.responseJSON.message);
        }
    });
}

// 添加课程安排项
function addScheduleItem(container, schedule = null) {
    const item = $(`
        <div class="schedule-item row mb-2">
            <div class="col-md-3">
                <select class="form-select" name="dayOfWeek[]" required>
                    <option value="">选择星期</option>
                    <option value="MON">周一</option>
                    <option value="TUE">周二</option>
                    <option value="WED">周三</option>
                    <option value="THU">周四</option>
                    <option value="FRI">周五</option>
                </select>
            </div>
            <div class="col-md-3">
                <input type="time" class="form-control" name="startTime[]" 
                       placeholder="开始时间">
            </div>
            <div class="col-md-3">
                <input type="time" class="form-control" name="endTime[]" 
                       placeholder="结束时间" >
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger btn-sm remove-schedule">删除</button>
            </div>
        </div>
    `);
    
    // 如果有数据则填充
    if (schedule) {
        item.find('[name="dayOfWeek[]"]').val(schedule.dayOfWeek);
        item.find('[name="startTime[]"]').val(schedule.startTime);
        item.find('[name="endTime[]"]').val(schedule.endTime);
    }
    
    container.append(item);
}

// 保存编辑
$('#saveEditCourseBtn').click(function() {
    const form = $('#editCourseForm');
    const formData = {
        id: form.find('[name="id"]').val(),
        courseName: form.find('[name="courseName"]').val(),
        description: form.find('[name="description"]').val(),
        credits: parseInt(form.find('[name="credits"]').val()),
        weeklyHours: parseInt(form.find('[name="weeklyHours"]').val()),
        weeklySessions: parseInt(form.find('[name="weeklySessions"]').val()),
        capacity: parseInt(form.find('[name="capacity"]').val()),
        schedules: []
    };
    
    // 收集课程安排数据并过滤空值
    $('.schedule-item').each(function() {
        const item = $(this);
        const dayOfWeek = item.find('[name="dayOfWeek[]"]').val();
        const startTime = item.find('[name="startTime[]"]').val();
        const endTime = item.find('[name="endTime[]"]').val();
        
        // 只添加完整的课程安排
        if (dayOfWeek && startTime && endTime) {
            formData.schedules.push({
                dayOfWeek: dayOfWeek,
                startTime: startTime,
                endTime: endTime
            });
        }
    });

    // 打印 formData
    console.log("更新课程：" + JSON.stringify(formData));
    
    // 发送更新请求
    $.ajax({
        url: '/api/courses/teacher/update-course',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function() {
            alert('课程更新成功');
            $('#editCourseModal').modal('hide');
            loadCourses();
        },
        error: function(xhr) {
            alert('更新失败：' + xhr.responseJSON.message);
        }
    });
});

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
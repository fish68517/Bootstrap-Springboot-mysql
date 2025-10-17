$(document).ready(function() {
    // 侧边栏切换
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // 加载课程列表
    loadCourses();
    
    // 加载教师列表
    loadTeachers();

    // 搜索和筛选事件
    $('#searchInput').on('input', debounce(loadCourses, 500));
    $('#creditFilter').change(loadCourses);

    // 添加课程按钮
    $('.btn-add-course').click(function() {
        $('#courseForm')[0].reset();
        $('#courseForm input[name="id"]').val('');
        $('#courseModal').modal('show');
    });

    // 添加时间段按钮
    $('#addScheduleBtn').click(function() {
        console.log('add schedule');
        const scheduleItem = $('.schedule-item').first().clone();
        scheduleItem.find('input, select').val('');
        $('#scheduleContainer').append(scheduleItem);
    });

    // 删除时间段按钮
    $(document).on('click', '.remove-schedule', function() {
        if ($('.schedule-item').length > 1) {
            $(this).closest('.schedule-item').remove();
        }
    });

    // 保存课程
    $('#saveCourse').click(function() {
        const formData = {
            id: $('#courseForm input[name="id"]').val(),
            courseName: $('#courseForm input[name="courseName"]').val(),
            credits: parseInt($('#courseForm input[name="credits"]').val()),
            description: $('#courseForm textarea[name="description"]').val(),
            capacity: parseInt($('#courseForm input[name="capacity"]').val()),
            teacherId: $('#courseForm select[name="teacherId"]').val(),
            schedules: []
        };

        // 收集课程安排
        $('.schedule-item').each(function() {
            formData.schedules.push({
                dayOfWeek: $(this).find('select[name="dayOfWeek[]"]').val(),
                startTime: ($(this).find('input[name="startTime[]"]').val()),
                endTime: ($(this).find('input[name="endTime[]"]').val()),
                classroom: $(this).find('input[name="classroom[]"]').val()
            });
        });

        // 发送请求
        const url = formData.id
            ? `/api/admin/courses/${formData.id}/${formData.teacherId}`
            : `/api/admin/courses/${formData.teacherId}`
        const method = formData.id ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function() {
                alert(formData.id ? '课程更新成功' : '课程添加成功');
                $('#courseModal').modal('hide');
                loadCourses();
            },
            error: function(xhr) {


                // 获取 formData.schedules startTime 和 endTime 格式是否为null
                const invalidSchedules = formData.schedules.filter(schedule => {
                    return schedule.startTime === null || schedule.endTime === null;
                });
                console.log('invalidSchedules:', invalidSchedules);
                if (invalidSchedules.length <= 0 ) {
                    alert('课程安排时间不能为空');
                } else {
                    // 判断 formData.teacherId 是否存在于formData中
                    if (formData.teacherId === '') {
                        alert('请选择教师才能排课');

                    }
                    else {
                        alert('操作失败：' + xhr.responseJSON.message);
                    }
                }

            }
        });
    });

    // 编辑课程
    $(document).on('click', '.btn-edit-course', function() {
        const courseId = $(this).data('course-id');
        // 获取课程数据
        $.ajax({
            url: `/api/admin/courses/${courseId}`,
            method: 'GET',
            success: function(course) {
                console.log("获取到的课程数据:", course);
                
                // 修改这里：使用正确的表单ID
                const form = $('#courseForm');  // 改为 courseForm
                form.find('[name="id"]').val(course.id);
                form.find('[name="courseName"]').val(course.courseName);
                form.find('[name="description"]').val(course.description);
                form.find('[name="credits"]').val(course.credits);
                form.find('[name="capacity"]').val(course.capacity);
                form.find('[name="teacherId"]').val(course.teacherId);
                
                // 清空并重新添加课程安排
                const container = $('#editScheduleContainer');
                container.empty();
                
                // 如果没有课程安排，添加一个空的
                if (!course.schedules || course.schedules.length === 0) {
                    $('#addEditScheduleBtn').click();
                } else {
                    // 添加现有的课程安排
                    course.schedules.forEach(schedule => {
                        const scheduleItem = $(`
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
                                           value="${schedule.startTime}">
                                </div>
                                <div class="col-md-3">
                                    <input type="time" class="form-control" name="endTime[]" 
                                           value="${schedule.endTime}">
                                </div>
                                <div class="col-md-2">
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="classroom[]" 
                                               value="${schedule.classroom || ''}" required>
                                        <button type="button" class="btn btn-outline-danger remove-schedule">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `);
                        
                        // 设置选中的星期
                        scheduleItem.find('[name="dayOfWeek[]"]').val(schedule.dayOfWeek);
                        container.append(scheduleItem);
                    });
                }
                
                console.log("准备显示模态框，课程名称:", course.courseName);
                // 显示模态框
                $('#courseModal').modal('show');
            },
            error: function(xhr) {
                alert('获取课程信息失败：' + xhr.responseJSON.message);
            }
        });
    });

    // 删除课程
    $(document).on('click', '.btn-delete-course', function() {
        if (confirm('确定要删除这门课程吗？')) {
            const courseId = $(this).data('course-id');
            $.ajax({
                url: `/api/admin/courses/${courseId}`,
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
    });

    // 编辑模态框中的添加时间段按钮
    $('#addEditScheduleBtn').click(function() {
        console.log('添加编辑时间段');
        const scheduleItem = $(`
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
                           placeholder="结束时间">
                </div>
                <div class="col-md-2">
                    <div class="input-group">
                        <input type="text" class="form-control" name="classroom[]" 
                               placeholder="教室" required>
                        <button type="button" class="btn btn-outline-danger remove-schedule">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        $('#editScheduleContainer').append(scheduleItem);
    });

    // 删除时间段按钮（同时支持添加和编辑模态框）
    $(document).on('click', '.remove-schedule', function() {
        const container = $(this).closest('.modal-body').find('.schedule-item');
        if (container.length > 1) {
            $(this).closest('.schedule-item').remove();
        }
    });
});

function loadCourses() {
    const search = $('#searchInput').val();
    const credits = $('#creditFilter').val();

    $.ajax({
        url: '/api/admin/courses',
        method: 'GET',
        data: { search, credits },
        success: function(courses) {
            displayCourses(courses);
        },
        error: function(xhr) {
            alert('加载课程列表失败：' + xhr.responseJSON.message);
        }
    });
}

function loadTeachers() {
    $.ajax({
        url: '/api/admin/teachers',
        method: 'GET',
        success: function(teachers) {
            const select = $('#courseForm select[name="teacherId"]');
            select.empty();
            select.append('<option value="">选择教师...</option>');
            teachers.forEach(teacher => {
                select.append(`<option value="${teacher.id}">${teacher.username}</option>`);
            });
        },
        error: function(xhr) {
            alert('加载教师列表失败：' + xhr.responseJSON.message);
        }
    });
}

function displayCourses(courses) {
    const tbody = $('#courseList');
    tbody.empty();

    courses.forEach(course => {
  /*      const scheduleText = course.schedules.map(s =>
            `${formatDayOfWeek(s.dayOfWeek)} ${s.startTime}-${s.endTime}节`
        ).join('<br>');*/
        const scheduleText = course.schedules.map(s =>
            `${formatDayOfWeek(s.dayOfWeek)} 第${s.startTime}-${s.endTime}节`
        ).join('<br>');

        const classroomText = course.schedules.map(s =>
            s.classrooms ? s.classrooms.name : ''
        ).join('<br>');

        const classroomCapacityText = course.schedules.map(s =>
            s.classrooms ? s.classrooms.capacity : '60'
        ).join('<br>');
        const teacherText = course.teachers.map(t => {
            return t.username ? t.username : '张老师';
        }).join('<br>');
        const row = `
            <tr>
                <td>${course.courseName}</td>
                <td>${course.credits}</td>
                <td>${teacherText}</td>
                <td>${scheduleText}</td>
                <td>${classroomCapacityText}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-primary btn-edit-course" 
                                data-course-id="${course.id}">
                            <i class="bi bi-pencil"></i> 编辑
                        </button>
                        <button class="btn btn-danger btn-delete-course" 
                                data-course-id="${course.id}">
                            <i class="bi bi-trash"></i> 删除
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

function fillCourseForm(course) {
    $('#courseForm input[name="id"]').val(course.id);
    $('#courseForm input[name="courseName"]').val(course.courseName);
    $('#courseForm input[name="credits"]').val(course.credits);
    $('#courseForm textarea[name="description"]').val(course.description);
    $('#courseForm input[name="capacity"]').val(course.capacity);
    $('#courseForm select[name="teacherId"]').val(course.teacher ? course.teacher.id : '');

    // 清空现有的时间安排
    $('#scheduleContainer').empty();
    
    // 添加课程安排
    course.schedules.forEach(schedule => {
        const scheduleItem = $('.schedule-item').first().clone();
        scheduleItem.find('select[name="dayOfWeek[]"]').val(schedule.dayOfWeek);
        scheduleItem.find('input[name="startTime[]"]').val(schedule.startTime);
        scheduleItem.find('input[name="endTime[]"]').val(schedule.endTime);
        scheduleItem.find('input[name="classroom[]"]').val(schedule.classroom);
        $('#scheduleContainer').append(scheduleItem);
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 
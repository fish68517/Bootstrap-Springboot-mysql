document.addEventListener('DOMContentLoaded', function() {
    // 侧边栏控制
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // 获取必要的DOM元素
    const searchInput = document.getElementById('searchInput');
    const creditFilter = document.getElementById('creditFilter');
    const weekdayFilter = document.getElementById('weekdayFilter');
    const courseList = document.getElementById('courseList');
    const pagination = document.getElementById('pagination');
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    
    // 当前页码和每页显示数量
    let currentPage = 1;
    const pageSize = 10;
    
    // 加载课程列表
    function loadCourses(page = 1) {
        const searchTerm = searchInput.value;
        const credits = creditFilter.value;
        const weekday = weekdayFilter.value;
        
        // 构建查询参数
        const params = new URLSearchParams({
            page: page,
            size: pageSize,
            search: searchTerm,
            credits: credits,
            weekday: weekday
        });
        
        // 发送请求获取课程列表
        fetch(`/api/courses/available?${params}`)
            .then(response => response.json())
            .then(data => {
                // 打印response
                console.log("课程列表：",data);
                if (Array.isArray(data)) {
                    renderCourseList(data);
                } else {
                    console.warn("响应数据格式不正确，预期为数组：", data);
                    renderCourseList([]);
                }

            })
            .catch(error => console.error('Error:', error));
    }

// 渲染课程列表
    function renderCourseList(courses) {
        courseList.innerHTML = courses.map(course => `
        <tr>
            <td>${course.courseName || '暂无'}</td>
            <td>${course.teachers?.[0]?.username || '暂无'}</td>
            <td>${course.credits || '暂无'}</td>
            <td>${formatSchedule(course)}</td>
            <td>${course.classroom?.name || '暂无'}</td>
        
            <td>
                <button class="btn btn-primary btn-sm" 
                        onclick="selectCourse(${course.id})"
                        ${(course.capacity && course.selectedCount >= course.capacity) ? 'disabled' : ''}>
                    选课
                </button>
            </td>
        </tr>
    `).join('');
    }

// 格式化课程时间
    function formatSchedule(course) {
        // 打印课程信息
        console.log("课程信息vvv：", course);

        // 检查 weeklyHours 和 weeklySessions 是否存在
        if (!course.weeklyHours || !course.weeklySessions) {
            return '时间未安排';
        }

        const weekdays = {
            1: '周一',
            2: '周二',
            3: '周三',
            4: '周四',
            5: '周五'
        };

        // 获取星期几
        const weekday = weekdays[course.weeklyHours] || '未知';

        // 拼接输出字符串
        return `${weekday} ${course.weeklySessions} 节`;
    }

// 选课操作
    window.selectCourse = function(courseId) {
        console.log("选课操作：", courseId);
        // 获取课程详情
        fetch(`/api/courses/${courseId}`)
            .then(response => response.json())
            .then(course => {
                // 显示确认模态框
                document.querySelector('.course-info').innerHTML = `
                <p><strong>课程名称：</strong>${course.coursename || '暂无'}</p>
                <p><strong>教师：</strong>${course.teachers?.[0]?.username || '暂无'}</p>
                <p><strong>上课时间：</strong>${formatSchedule(course)}</p>
                <p><strong>学分：</strong>${course.credits || '暂无'}</p>
                <p><strong>课程描述：</strong>${course.description || '暂无描述'}</p>
            `;

                // 保存课程ID
                document.getElementById('confirmSelection').dataset.courseId = courseId;

                confirmModal.show();
            })
            .catch(error => {
                console.error('获取课程详情失败:', error);
                alert('获取课程详情失败，请重试');
            });
    };

    // 确认选课
    document.getElementById('confirmSelection').addEventListener('click', function() {
        const courseId = this.dataset.courseId;
        console.log("确认选课：", courseId);
        
        fetch(`/api/selections/select/${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "选课成功") {
                alert('选课成功！');
                confirmModal.hide();
                loadCourses(currentPage); // 重新加载课程列表
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('选课失败，请重试');
        });
    });
    
    // 搜索和筛选事件监听
    searchInput.addEventListener('input', debounce(() => loadCourses(1), 500));
    creditFilter.addEventListener('change', () => loadCourses(1));
    weekdayFilter.addEventListener('change', () => loadCourses(1));
    
    // 防抖函数
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
    
    // 初始加载
    loadCourses(1);
}); 
package com.example.service;

import com.example.TimeRangeUtils;
import com.example.bean.*;
import com.example.mapper.ClassRoomMapper;
import com.example.mapper.CourseMapper;
import com.example.mapper.CourseTeacherMapper;
import com.example.mapper.ScheduleMapper;
import com.example.mapper.SelectionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class CourseService{

    @Autowired
    private CourseMapper courseMapper;
    
    @Autowired
    private ScheduleMapper scheduleMapper;

    @Autowired
    private SelectionMapper selectionMapper;

    @Autowired
    private CourseTeacherMapper courseTeacherMapper;

    @Autowired
    private ClassRoomMapper classRoomMapper;


    public List<Course> findCourses(String search, Integer credits) {
        return courseMapper.findCourses(search, credits);
    }


    public Course getCourseById(Integer id) {
        Course course = courseMapper.findById(id);
        if (course != null) {
            // 加载课程安排
            course.setSchedules(scheduleMapper.findByCourseId(id));
        }
        return course;
    }


    @Transactional
    public void createCourseAdmin(Course course,Integer teacherId) throws Exception {
        // 验证课程信息
        validateCourse(course);
        
        // 保存课程基本信息
        if (course.getWeeklyHours() == null) {
            course.setWeeklyHours(4);
        }
        if (course.getWeeklySessions() == null){
            course.setWeeklySessions(2);
        }
        courseMapper.insert(course);

        // 保存教师关联
        courseMapper.insertTeacherCourse(course.getId(), teacherId);
        System.out.println("\n 关联教师" + course.toString());
        // 保存课程安排
        if (course.getSchedules() != null) {
            for (Schedule schedule : course.getSchedules()) {
                schedule.setCourseId(course.getId());
                schedule.setTeacherId(teacherId);

                // 保存教室
                Classroom classRoom = classRoomMapper.findByName(schedule.getClassroom() == null?
                        "教室A" : schedule.getClassroom());
                if (classRoom == null) {
                    // 插入教室
                    classRoom = new Classroom();
                    classRoom.setName(schedule.getClassroom());
                    classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                    classRoom.setLocation("第一教学楼");
                    classRoomMapper.insert(classRoom);
                } else {
                    // 更新教室容量
                    classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                    classRoomMapper.update(classRoom);
                }
                schedule.setClassroomId(classRoom.getId());
                courseMapper.insertSchedule(schedule);
            }
        }
    }


    @Transactional
    public void updateCourse(Course course,Integer teacherId) throws Exception {
        // 验证课程信息
        validateCourse(course);

        // 根据coureId查询课程
        Course oldCourse = courseMapper.findById(course.getId());
        if (oldCourse == null) {
            throw new IllegalArgumentException("课程不存在");
        }

        if (course.getWeeklyHours() == null) {
            course.setWeeklyHours(oldCourse.getWeeklyHours());
        }

        if (course.getWeeklySessions() == null) {
            course.setWeeklySessions(oldCourse.getWeeklySessions());
        }

        System.out.println("course: " + course.getCourseName() + " teacherId: " + teacherId);
        
        // 更新课程基本信息
        courseMapper.update(course);
        // 更新课程教师
        courseTeacherMapper.updateTeacherCourse(course.getId(), teacherId);
        scheduleMapper.deleteByCourseId(course.getId());
        if (course.getSchedules() != null) {
            for (Schedule schedule : course.getSchedules()) {
                schedule.setCourseId(course.getId());
                schedule.setTeacherId(teacherId);

                // 保存教室
                Classroom classRoom = classRoomMapper.findByName(schedule.getClassroom() == null?
                        "教室A" : schedule.getClassroom());
                if (classRoom == null) {
                    // 插入教室
                    classRoom = new Classroom();
                    classRoom.setName(schedule.getClassroom());
                    classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                    classRoom.setLocation("第一教学楼");
                    classRoomMapper.insert(classRoom);
                } else {
                    // 更新教室容量
                    classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                    classRoomMapper.update(classRoom);
                }
                schedule.setClassroomId(classRoom.getId());
                courseMapper.insertSchedule(schedule);
            }
        }
    }


    @Transactional
    public void deleteCourse(Integer id) throws Exception {
        // 检查是否有学生已选课
        // 删除课程安排
        scheduleMapper.deleteByCourseId(id);
        
        // 删除课程
        courseMapper.delete(id);
    }


    public int getSelectedCount(Integer courseId) {
        return selectionMapper.countByCourseId(courseId);
    }


    public boolean isFull(Integer courseId) {
        Course course = getCourseById(courseId);
        if (course == null) {
            return true;
        }
        int selectedCount = getSelectedCount(courseId);
        return selectedCount >= course.getCapacity();
    }


    public List<Course> findAvailableCourses(String search, Integer credits, String weekday) {
        // 参数校验
     /*   if (weekday != null && !isValidDayOfWeek(weekday)) {
            throw new IllegalArgumentException("无效的星期几");
        }*/
        
        // 调用mapper查询数据
        return courseMapper.findAvailableCourses(search, credits, weekday);
    }


    public int countAvailableCourses(String search, Integer credits, String weekday) {
        return courseMapper.countAvailableCourses(search, credits, weekday);
    }


    public List<Course> getStudentCourses(Integer studentId) {
        List<Course> courses = courseMapper.findByStudentId(studentId);
        // 加载每个课程的时间安排
        for (Course course : courses) {
            course.setSchedules(scheduleMapper.findByCourseId(course.getId()));
        }
        return courses;
    }


    public List<Course> getStudentSchedule(Integer studentId) {
        List<Course> courses = courseMapper.findScheduleByStudentId(studentId);
        // 加载每个课程的时间安排
        for (Course course : courses) {
            course.setSchedules(scheduleMapper.findByCourseId(course.getId()));
        }
        return courses;
    }


    public List<CourseTeacher> getTeacherCourses(Integer teacherId) {
        List<CourseTeacher> courseTeachers = courseTeacherMapper.findByTeacherIdWithDetails(teacherId);
        System.out.println("courses: " + courseTeachers);
        // 加载每个课程的时间安排
        mergeCourseSchedule(courseTeachers);
        return courseTeachers;
    }


    public List<Course> getTeacherCoursesForCourse(Integer teacherId) {
        List<Course> courses = courseTeacherMapper.findByTeacherId(teacherId);
        System.out.println("courses: " + courses);
        if (courses != null) {
            for (Course course : courses) {
                List<Schedule> scheduleList = scheduleMapper.findByCourseId(course.getId());
                course.setSchedules(scheduleList);
            }
        }
        return courses;
    }



    /**
     * 排课系统验证
     * @param course
     * @param teacherId
     */
    @Transactional
    public void createCourse(Course course, Integer teacherId) {
        // 基本验证
        if (course.getCourseName() == null || course.getCourseName().trim().isEmpty()) {
            throw new IllegalArgumentException("课程名称不能为空");
        }
        if (course.getCredits() == null || course.getCredits() < 1 || course.getCredits() > 10) {
            throw new IllegalArgumentException("学分必须在1-10之间");
        }

        // 验证课程时间安排
        if (course.getSchedules() == null || course.getSchedules().isEmpty()) {
            throw new IllegalArgumentException("课程必须设置时间安排");
        }
        
        // 验证每个时间安排
        for (Schedule schedule : course.getSchedules()) {
            if (schedule.getStartTime() == null || schedule.getEndTime() == null) {
                throw new IllegalArgumentException("课程时间安排无效");
            }

            if (schedule.getDayOfWeek() == null || !isValidDayOfWeek(schedule.getDayOfWeek())) {
                throw new IllegalArgumentException("上课日期无效");
            }
        }
        System.out.println("course: " + course.getCourseName() + " teacherId: " + teacherId);
        // 检查时间冲突
        List<Course> teacherCourses = getTeacherCoursesForCourse(teacherId);
        for (Course existingCourse : teacherCourses) {
            if (hasTimeConflict(course.getSchedules(), existingCourse.getSchedules())) {
                throw new IllegalArgumentException("与现有课程时间冲突");
            }
        }

        for (Schedule schedule : course.getSchedules()) {
            boolean isOverlap = TimeRangeUtils.isTimeRangeOverlap_one(schedule.getStartTime(), schedule.getEndTime()); // 排序时间安排
            if (isOverlap) {
                throw new IllegalArgumentException("课程时间不对（下课时间不能早于上课时间）");
            }
        }




        // 设置创建时间和更新时间
        LocalDateTime now = LocalDateTime.now();
        course.setCreatedAt(now);
        course.setUpdatedAt(now);

        // 保存课程
        courseMapper.insert(course);
        System.out.println("courseId: " + course.getId() + ", teacherId: " + teacherId + "\n" + course.toString());

        // 保存教师关联
        courseMapper.insertTeacherCourse(course.getId(), teacherId);
        System.out.println("\n 关联教师" + course.toString());

        // 保存课程时间安排
        for (Schedule schedule : course.getSchedules()) {
            schedule.setCourseId(course.getId());
            schedule.setTeacherId(teacherId);
            // 保存教室
            Classroom classRoom = classRoomMapper.findByName(schedule.getClassroom() == null?
                    "教室A" : schedule.getClassroom());
            if (classRoom == null) {
                // 插入教室
                classRoom = new Classroom();
                classRoom.setName(schedule.getClassroom());
                classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                classRoom.setLocation("第一教学楼");
                classRoomMapper.insert(classRoom);
            } else {
                // 更新教室容量
                classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                classRoom.setName("教室A");
                classRoomMapper.update(classRoom);
            }

            schedule.setClassroomId(classRoom.getId());
            courseMapper.insertSchedule(schedule);
        }
    }


    @Transactional
    public void deleteCourse(Integer courseId, Integer teacherId) throws Exception {
        // 验证教师权限
       /* if (!hasTeacherAuthority(courseId, teacherId)) {
            throw new Exception("无权删除此课程");
        }*/

        // 检查是否有学生已选课
        int selectedCount = selectionMapper.countByCourseId(courseId);
        if (selectedCount > 0) {
            throw new Exception("已有学生选择此课程，无法删除");
        }

        // 删除课程相关数据
        scheduleMapper.deleteByCourseId(courseId);
        courseMapper.deleteTeacherCourse(courseId, teacherId);
        courseMapper.delete(courseId);
    }


    public boolean hasTeacherAuthority(Integer courseId, Integer teacherId) {
        return courseMapper.isTeacherOfCourse(courseId, teacherId);
    }

    private void validateCourse(Course course) throws Exception {
        if (course.getCourseName() == null || course.getCourseName().trim().isEmpty()) {
            throw new Exception("课程名称不能为空");
        }
        if (course.getCredits() == null || course.getCredits() < 1 || course.getCredits() > 4) {
            throw new Exception("学分必须在1-4之间");
        }
        if (course.getCapacity() == null || course.getCapacity() < 1) {
            throw new Exception("课程容量必须大于0");
        }
        if (course.getSchedules() == null || course.getSchedules().isEmpty()) {
            throw new Exception("课程安排不能为空");
        }
        
        // 验证时间安排是否有冲突
        validateSchedules(course.getSchedules());

        // 验证课程时间是否在有效范围内
        validateCourseTime(course.getSchedules());
    }

    private void validateCourseTime(List<Schedule> schedules) {
        // 定义有效的开始时间范围
        LocalTime validStartTimeMin = LocalTime.of(8, 0);  // 08:00
        LocalTime validStartTimeMax = LocalTime.of(18, 0); // 18:00
        
        // 定义有效的结束时间范围
        LocalTime validEndTimeMin = LocalTime.of(9, 30);   // 09:30
        LocalTime validEndTimeMax = LocalTime.of(19, 30);  // 19:30

        for (Schedule schedule : schedules) {
            LocalTime startTime = schedule.getStartTime();
            LocalTime endTime = schedule.getEndTime();
            
            // 验证开始时间
            if (startTime.isBefore(validStartTimeMin) || startTime.isAfter(validStartTimeMax)) {
                throw new IllegalArgumentException(
                    String.format("课程开始时间必须在 %s 到 %s 之间", 
                        validStartTimeMin, validStartTimeMax));
            }
            
            // 验证结束时间
            if (endTime.isBefore(validEndTimeMin) || endTime.isAfter(validEndTimeMax)) {
                throw new IllegalArgumentException(
                    String.format("课程结束时间必须在 %s 到 %s 之间", 
                        validEndTimeMin, validEndTimeMax));
            }
            
            // 验证开始时间必须早于结束时间
            if (startTime.isAfter(endTime)) {
                throw new IllegalArgumentException("课程开始时间必须早于结束时间");
            }
        }
    }

    // 定义有效时间

    private void validateSchedules(List<Schedule> schedules) throws Exception {
        for (int i = 0; i < schedules.size(); i++) {
            Schedule s1 = schedules.get(i);

            // 检查时间冲突
            for (int j = i + 1; j < schedules.size(); j++) {
                Schedule s2 = schedules.get(j);

                boolean isOverlap = TimeRangeUtils.isTimeRangeOverlap(s1.getStartTime(),
                        s1.getEndTime()
                        , s2.getStartTime(), s2.getEndTime());
                System.out.println("Time ranges overlap: " + isOverlap); // 输出: Time ranges overlap: true
                if (s1.getDayOfWeek().equals(s2.getDayOfWeek()) || isOverlap) {
                    throw new Exception("课程时间存在冲突");
                }
            }
        }
    }

    // 辅助方法：验证星期几的格式
    private boolean isValidDayOfWeek(String dayOfWeek) {
        return Arrays.asList("MON", "TUE", "WED", "THU", "FRI").contains(dayOfWeek);
    }

    // 辅助方法：检查时间冲突
    private boolean hasTimeConflict(List<Schedule> schedules1, List<Schedule> schedules2) {
        if (schedules1 == null || schedules2 == null) {
            return false;
        }
        
        for (Schedule s1 : schedules1) {
            for (Schedule s2 : schedules2) {
                if (s1.getDayOfWeek().equals(s2.getDayOfWeek())) {
                    boolean isOverlap = TimeRangeUtils.isTimeRangeOverlap(s1.getStartTime(),
                            s1.getEndTime()
                            , s2.getStartTime(), s2.getEndTime());
                    System.out.println("Time ranges overlap: " + isOverlap); // 输出: Time ranges overlap: true
                    if (isOverlap) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public Map<String, Object> getTeacherCourseStats(Integer teacherId) {
        List<CourseTeacher> courseTeachers = courseTeacherMapper.findByTeacherIdWithDetails(teacherId);
        System.out.println("获取到的教师课程数据: " + courseTeachers);
        
        mergeCourseSchedule(courseTeachers);
        System.out.println("合并时间安排后的数据: " + courseTeachers);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courseTeachers.size());
        
        // 计算总学分
        int totalCredits = courseTeachers.stream()
                .map(CourseTeacher::getCourse)
                .mapToInt(Course::getCredits)
                .sum();
        stats.put("totalCredits", totalCredits);
        
        // 按学分分组的课程详情
        Map<Integer, List<Map<String, Object>>> creditsCourses = courseTeachers.stream()
                .map(CourseTeacher::getCourse)
                .collect(Collectors.groupingBy(
                    Course::getCredits,
                    Collectors.mapping(course -> {
                        Map<String, Object> courseInfo = new HashMap<>();
                        courseInfo.put("courseName", course.getCourseName());
                        courseInfo.put("credits", course.getCredits());
                        return courseInfo;
                    }, Collectors.toList())
                ));
        System.out.println("学分分组数据: " + creditsCourses);
        stats.put("creditsCourses", creditsCourses);
        
        // 按星期分组的课程详情
        Map<String, List<Map<String, Object>>> weekdayCourses = courseTeachers.stream()
                .map(CourseTeacher::getCourse)
                .flatMap(course -> course.getSchedules().stream()
                        .map(schedule -> {
                            Map<String, Object> courseInfo = new HashMap<>();
                            courseInfo.put("courseName", course.getCourseName());
                            courseInfo.put("credits", course.getCredits());
                            courseInfo.put("dayOfWeek", schedule.getDayOfWeek());
                            return courseInfo;
                        }))
                .collect(Collectors.groupingBy(
                    info -> (String)info.get("dayOfWeek"),
                    Collectors.toList()
                ));
        System.out.println("周课程分组数据: " + weekdayCourses);
        stats.put("weekdayCourses", weekdayCourses);
        
        System.out.println("最终返回的统计数据: " + stats);
        return stats;
    }

    private void mergeCourseSchedule(List<CourseTeacher> courseTeachers) {
        courseTeachers.forEach(ct -> {
            Course course = courseMapper.findById(ct.getCourseId());
            if (course != null) {
                List<Schedule> scheduleList = scheduleMapper.findByCourseId(course.getId());
                course.setSchedules(scheduleList);
                ct.setCourse(course);

            }
        });
    }

    @Transactional
    public void updateTeacherCourse(Course course, Integer teacherId) throws Exception {

        // 验证课程信息
        validateCourse(course);
        
        // 更新课程基本信息
        courseMapper.update(course);
        
        // 更新课程安排
        scheduleMapper.deleteByCourseId(course.getId());
        if (course.getSchedules() != null) {
            for (Schedule schedule : course.getSchedules()) {
                schedule.setCourseId(course.getId());
                schedule.setTeacherId(teacherId);

                // 保存教室
                Classroom classRoom = classRoomMapper.findByName(schedule.getClassroom() == null?
                        "教室A" : schedule.getClassroom());
                if (classRoom == null) {
                    // 插入教室
                    classRoom = new Classroom();
                    classRoom.setName(schedule.getClassroom());
                    classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                    classRoom.setLocation("第一教学楼");
                    classRoomMapper.insert(classRoom);
                } else {
                    // 更新教室容量
                    classRoom.setCapacity(course.getCapacity() == null? 60 : course.getCapacity());
                    classRoom.setName("教室A");
                    classRoomMapper.update(classRoom);
                }
                schedule.setClassroomId(classRoom.getId());
                courseMapper.insertSchedule(schedule);
            }
        }
    }

    public Course getTeacherCourse(Integer courseId, Integer teacherId) {

        
        Course course = courseMapper.findById(courseId);
        if (course != null) {
            course.setSchedules(scheduleMapper.findByCourseId(courseId));
        }
        return course;
    }

    public int countCourses() {
        return courseMapper.countAll();
    }

    public Map<Integer, Integer> getCreditDistribution() {
        Map<Integer, Integer> distribution = new HashMap<>();
        List<Course> courses = courseMapper.findAll();
        
        for (Course course : courses) {
            distribution.merge(course.getCredits(), 1, Integer::sum);
        }
        return distribution;
    }

    public Map<String, Integer> getWeekdayDistribution() {
        Map<String, Integer> distribution = new HashMap<>();
        List<Schedule> schedules = scheduleMapper.findAll();
        
        for (Schedule schedule : schedules) {
            distribution.merge(schedule.getDayOfWeek(), 1, Integer::sum);
        }
        return distribution;
    }

    public List<Map<String, Object>> getHotCourses(int limit) {
        List<Map<String, Object>> hotCourses = new ArrayList<>();
        List<Course> courses = courseMapper.findHotCourses(limit);
        
        for (Course course : courses) {
            Map<String, Object> courseMap = new HashMap<>();
            courseMap.put("courseName", course.getCourseName());
            courseMap.put("teacherName", getTeacherName(course));
            courseMap.put("credits", course.getCredits());
            courseMap.put("selectedCount", selectionMapper.countByCourseId(course.getId()));
            courseMap.put("capacity", course.getCapacity());
            hotCourses.add(courseMap);
        }
        
        return hotCourses;
    }

    private String getTeacherName(Course course) {
        if (course.getTeachers() != null && !course.getTeachers().isEmpty()) {
            return course.getTeachers().get(0).getUsername();
        }

        // 根据courseId查询教师
        User  courseTeachers = courseTeacherMapper.findMainTeacher(course.getId());
        if (courseTeachers != null ) {
            return courseTeachers.getUsername();
        }
        return "未分配";
    }

    public List<Course> getScheduleByStudentId(Integer id) {
        List<Course> courses = courseMapper.getScheduleByStudentId(id);
        return courses;
    }

    /**
     * 获取教师所有课程（包含课程安排和教室信息）
     */
    public List<Course> getTeacherAllCourses(Integer teacherId) {
        // 获取教师的所有课程
        List<Course> courses = courseMapper.findCoursesByTeacherId(teacherId);
        
        // 为每个课程加载课程安排和教室信息
        for (Course course : courses) {
            // 加载课程安排
            List<Schedule> schedules = scheduleMapper.findByCourseId(course.getId());
            
            // 为每个课程安排加载教室信息
            for (Schedule schedule : schedules) {
                if (schedule.getClassroomId() != null) {
                    Classroom classroom = classRoomMapper.findById(schedule.getClassroomId());
                    schedule.setClassrooms(classroom);
                }
            }
            
            course.setSchedules(schedules);
            
            // 获取选课人数
            course.setSelectedCount(selectionMapper.countByCourseId(course.getId()));
        }
        
        return courses;
    }
}
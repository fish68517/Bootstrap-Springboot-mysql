package com.example.mapper;

import com.example.bean.Course;
import com.example.bean.Schedule;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.mapping.FetchType;

import java.util.List;

@Mapper
public interface CourseMapper {
    // @Select("SELECT * FROM courses WHERE id = #{id}")

    @Select("""
        SELECT DISTINCT c.* 
        FROM courses c
        INNER JOIN course_teachers ct ON c.id = ct.course_id
        WHERE ct.course_id = #{courseId}
    """)
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "courseName", column = "course_name"),
            @Result(property = "description", column = "description"),
            @Result(property = "credits", column = "credits"),
            @Result(property = "capacity", column = "capacity"),
            @Result(property = "createdAt", column = "created_at"),
            @Result(property = "updatedAt", column = "updated_at"),
            @Result(property = "teachers", column = "id",
                    many = @Many(select = "com.example.mapper.CourseTeacherMapper.findTeachersByCourseId")),
            @Result(property = "schedules", column = "id",
                    many = @Many(select = "com.example.mapper.ScheduleMapper.findByCourseId"))
    })
    Course findById(Integer id);


    List<Course> findAvailableCourses(
            @Param("search") String search,
            @Param("credits") Integer credits,
            @Param("weekday") String weekday);

    int countAvailableCourses(
            @Param("search") String search,
            @Param("credits") Integer credits,
            @Param("weekday") String weekday);

    int insert(Course course);

    void update(Course course);

    void delete(Integer id);

    List<Course> findByStudentId(Integer studentId);

    List<Course> findScheduleByStudentId(Integer studentId);
    List<Course> getScheduleByStudentId(Integer studentId);

    @Insert("INSERT INTO course_teachers (course_id, teacher_id, role) VALUES (#{courseId}, #{teacherId}, '主讲')")
    void insertTeacherCourse(@Param("courseId") Integer courseId, @Param("teacherId") Integer teacherId);

    @Delete("DELETE FROM course_teachers WHERE course_id = #{courseId} AND teacher_id = #{teacherId}")
    void deleteTeacherCourse(@Param("courseId") Integer courseId, 
                           @Param("teacherId") Integer teacherId);

    void deleteSchedulesByCourseId(Integer courseId);

    boolean isTeacherOfCourse(@Param("courseId") Integer courseId, 
                             @Param("teacherId") Integer teacherId);

    @Insert("INSERT INTO schedules (course_id, classroom_id, teacher_id, day_of_week, start_time, end_time) " +
            "VALUES (#{courseId}, #{classroomId} , #{teacherId},#{dayOfWeek}, #{startTime}, #{endTime})")
    void insertSchedule(Schedule schedule);

    @Select("<script>" +
            "SELECT c.*, u.username as teacher_name FROM courses c " +
            "LEFT JOIN course_teachers ct ON c.id = ct.course_id " +
            "LEFT JOIN users u ON ct.teacher_id = u.id " +
            "WHERE 1=1 " +
            "<if test='search != null and search != \"\"'>" +
            "   AND c.course_name LIKE CONCAT('%', #{search}, '%') " +
            "</if>" +
            "<if test='credits != null'>" +
            "   AND c.credits = #{credits} " +
            "</if>" +
            "ORDER BY c.created_at DESC" +
            "</script>")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "courseName", column = "course_name"),
            @Result(property = "credits", column = "credits"),
            @Result(property = "description", column = "description"),
            @Result(property = "capacity", column = "capacity"),
            @Result(property = "selectedCount", column = "selected_count"),
            @Result(property = "createdAt", column = "created_at"),
            @Result(property = "updatedAt", column = "updated_at"),
            // 加载课程的教师信息
            @Result(property = "teachers", column = "id",
                    many = @Many(select = "com.example.mapper.CourseTeacherMapper.findTeachersByCourseId",
                            fetchType = FetchType.EAGER)),
            @Result(property = "schedules", column = "id",
                    many = @Many(select = "com.example.mapper.ScheduleMapper.findByCourseId"))
    })
    List<Course> findCourses(@Param("search") String search, @Param("credits") Integer credits);

    @Select("SELECT COUNT(*) FROM courses")
    int countAll();

    @Select("<script>" +
            "SELECT c.*, u.username as teacher_name FROM courses c " +
            "LEFT JOIN course_teachers ct ON c.id = ct.course_id " +
            "LEFT JOIN users u ON ct.teacher_id = u.id " +
            "ORDER BY c.created_at DESC" +
            "</script>")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "courseName", column = "course_name"),
            @Result(property = "credits", column = "credits"),
            @Result(property = "description", column = "description"),
            @Result(property = "capacity", column = "capacity"),
            @Result(property = "selectedCount", column = "selected_count"),
            @Result(property = "createdAt", column = "created_at"),
            @Result(property = "updatedAt", column = "updated_at"),
            // 加载课程的教师信息
            @Result(property = "teachers", column = "id",
                    many = @Many(select = "com.example.mapper.CourseTeacherMapper.findTeachersByCourseId",
                            fetchType = FetchType.EAGER)),
            @Result(property = "schedules", column = "id",
                    many = @Many(select = "com.example.mapper.ScheduleMapper.findByCourseId"))
    })
    List<Course> findAll();

    @Select("""
        SELECT c.*, COUNT(s.id) as selection_count 
        FROM courses c 
        LEFT JOIN selections s ON c.id = s.course_id 
        GROUP BY c.id 
        ORDER BY selection_count DESC 
        LIMIT #{limit}
    """)
    List<Course> findHotCourses(int limit);

    @Select("""
        SELECT DISTINCT c.* 
        FROM courses c
        INNER JOIN course_teachers ct ON c.id = ct.course_id
        WHERE ct.teacher_id = #{teacherId}
    """)
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "courseName", column = "course_name"),
        @Result(property = "description", column = "description"),
        @Result(property = "credits", column = "credits"),
        @Result(property = "capacity", column = "capacity"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "teachers", column = "id",
                many = @Many(select = "com.example.mapper.CourseTeacherMapper.findTeachersByCourseId")),
        @Result(property = "schedules", column = "id",
                many = @Many(select = "com.example.mapper.ScheduleMapper.findByCourseId"))
    })
    List<Course> findCoursesByTeacherId(Integer teacherId);
}
package com.example.mapper;

import com.example.bean.Course;
import com.example.bean.CourseTeacher;
import com.example.bean.User;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.mapping.FetchType;

import java.util.List;

@Mapper
public interface CourseTeacherMapper {
    // 根据课程ID查询教师列表
    List<User> findTeachersByCourseId(Integer courseId);

    // 添加课程-教师关联
    void insert(@Param("courseId") Integer courseId,
                @Param("teacherId") Integer teacherId,
                @Param("role") String role);

    // 删除课程-教师关联
    void delete(@Param("courseId") Integer courseId,
                @Param("teacherId") Integer teacherId);

    // 检查教师是否已关联到课程
    boolean exists(@Param("courseId") Integer courseId,
                   @Param("teacherId") Integer teacherId);

    // 获取课程的主讲教师

    User findMainTeacher(Integer courseId);

    @Select("""
        SELECT 
            c.*,
            ct.role as teacher_role,
            ct.id as ct_id
        FROM courses c
        INNER JOIN course_teachers ct ON c.id = ct.course_id
        WHERE ct.teacher_id = #{teacherId}
        """)
    @Results({
        @Result(property = "id", column = "id"),
        @Result(property = "courseName", column = "course_name"),
        @Result(property = "description", column = "description"),
        @Result(property = "credits", column = "credits"),
        @Result(property = "weeklyHours", column = "weekly_hours"),
        @Result(property = "weeklySessions", column = "weekly_sessions"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        
        // 加载课程的时间安排
        @Result(property = "schedules", column = "id",
                many = @Many(select = "com.example.mapper.ScheduleMapper.findByCourseId",
                        fetchType = FetchType.EAGER)),
        
        // 加载课程的教师信息
        @Result(property = "teachers", column = "id",
                many = @Many(select = "com.example.mapper.CourseTeacherMapper.findTeachersByCourseId",
                        fetchType = FetchType.EAGER))
    })
    List<Course> findByTeacherId(Integer teacherId);


    @Select("""
                SELECT
                    ct.*,
                    c.course_name as course_name,
                    c.description as course_description,
                    c.credits as course_credits,
                    u.username
                FROM course_teachers ct
                LEFT JOIN courses c ON ct.course_id = c.id
                LEFT JOIN users u ON ct.teacher_id = u.id
                WHERE ct.teacher_id = #{teacherId}
            """)
    @Results({
            @Result(id = true, column = "id", property = "id"),
            @Result(column = "course_id", property = "courseId"),
            @Result(column = "teacher_id", property = "teacherId"),
            @Result(column = "role", property = "role"),
            // 修改为即时加载
            @Result(column = "course_id", property = "course", 
                    one = @One(select = "com.example.mapper.CourseMapper.findById", 
                              fetchType = FetchType.EAGER)),
            @Result(column = "teacher_id", property = "teacher", 
                    one = @One(select = "com.example.mapper.UserMapper.findById", 
                              fetchType = FetchType.EAGER))
    })
    List<CourseTeacher> findByTeacherIdWithDetails(Integer teacherId);

    // 更新课程-教师关联
    @Update("UPDATE course_teachers SET teacher_id = #{teacherId} WHERE course_id = #{courseId}")
    void updateTeacherCourse(Integer courseId, Integer teacherId);

}
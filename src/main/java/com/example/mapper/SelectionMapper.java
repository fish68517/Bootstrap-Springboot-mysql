package com.example.mapper;

import com.example.bean.Selection;
import com.example.bean.SelectionHistory;
import org.apache.ibatis.annotations.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface SelectionMapper {
    
    @Insert("INSERT INTO selections(user_id, course_id, selected_at) " +
            "VALUES(#{userId}, #{courseId}, NOW())")
    void insertSelection(@Param("userId") Integer userId, 
                        @Param("courseId") Integer courseId);

    @Delete("DELETE FROM selections WHERE user_id = #{userId} " +
            "AND course_id = #{courseId}")
    void deleteSelection(@Param("userId") Integer userId, 
                        @Param("courseId") Integer courseId);

    @Insert("INSERT INTO selection_history(user_id, course_id, action, timestamp) " +
            "VALUES(#{userId}, #{courseId}, #{action}, #{timestamp})")
    void insertHistory(SelectionHistory history);

    @Select("SELECT EXISTS(SELECT 1 FROM selections WHERE user_id = #{userId} " +
            "AND course_id = #{courseId})")
    boolean exists(@Param("userId") Integer userId, 
                  @Param("courseId") Integer courseId);

    @Select("SELECT COUNT(*) FROM selections WHERE course_id = #{courseId}")
    int countByCourseId(@Param("courseId") Integer courseId);

    // 根据userid查询选课
    @Select("SELECT course_id FROM selections WHERE user_id = #{userId}")
    Integer[] selectByUserId(@Param("userId") Integer userId);

    @Select("SELECT COUNT(*) FROM selections")
    int countAll();

    @Select("SELECT COUNT(*) FROM selections WHERE DATE(selected_at) = #{date}")
    int countByDate(LocalDate date);

    @Select("SELECT COUNT(*) FROM selections " +
            "WHERE DATE(selected_at) = #{date} " +
            "AND TIME(selected_at) BETWEEN #{startTime} AND #{endTime}")
    int countByTimeRange(@Param("date") LocalDate date, 
                        @Param("startTime") LocalTime startTime, 
                        @Param("endTime") LocalTime endTime);

    @Select("SELECT COUNT(*) FROM selection_history")
    int countAllHistory();

    @Select("SELECT COUNT(*) FROM selection_history WHERE action = #{action}")
    int countHistoryByAction(SelectionHistory.SelectionAction action);

    @Select("""
        SELECT 
            c.course_name,
            COUNT(*) as selection_count,
            c.capacity,
            CONCAT(ROUND(COUNT(*) * 100.0 / c.capacity, 2), '%') as fill_rate
        FROM selections s
        JOIN courses c ON s.course_id = c.id
        GROUP BY c.id, c.course_name, c.capacity
        ORDER BY selection_count DESC
        LIMIT #{limit}
    """)
    List<Map<String, Object>> getCourseRankings(int limit);

    @Select("""
        SELECT 
            u.username,
            COUNT(*) as course_count,
            SUM(c.credits) as total_credits
        FROM selections s
        JOIN users u ON s.user_id = u.id
        JOIN courses c ON s.course_id = c.id
        GROUP BY u.id, u.username
        ORDER BY course_count DESC
        LIMIT #{limit}
    """)
    List<Map<String, Object>> getStudentRankings(int limit);

    @Select("SELECT * FROM selections")
    List<Selection> findAllSelections();

    // 根据courseId查询选课人数
    @Select("SELECT COUNT(*) FROM selections WHERE course_id = #{id}")
    int findCountByCourseId(Integer id);
}
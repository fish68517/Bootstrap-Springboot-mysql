package com.example.bean;

import com.example.TimeRangeUtils;
import lombok.Data;

import java.sql.Time;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class Schedule {
    private Integer id;
    private Integer courseId;
    private String dayOfWeek;  // 星期几：MON, TUE, WED, THU, FRI
    private LocalTime startTime; // 开始时间
    private LocalTime endTime;   // 结束时间
    private Integer classroomId;  // 教室
    private String classroom;  // 教室名 前端传递过来的
    private Integer teacherId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 关联的课程信息（可选）
    private Course course;

    // 教室信息（可选）
    private Classroom classrooms;

    // 教师信息（可选）
    private User teacher;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Integer getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(Integer classroomId) {
        this.classroomId = classroomId;
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }


    public Schedule() {
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    // 辅助方法：检查是否与其他课程时间冲突
    public boolean conflictsWith(Schedule other) {
        // 如果不是同一天，则不冲突
        if (!this.dayOfWeek.equals(other.dayOfWeek)) {
            return false;
        }

        // 检查时间段是否重叠
        LocalTime startTime1 = this.startTime;
        LocalTime endTime1 = this.endTime;
        LocalTime startTime2 = other.startTime;
        LocalTime endTime2 = other.endTime;

        return TimeRangeUtils.isTimeRangeOverlap(startTime1, endTime1, startTime2, endTime2);
    }

    @Override
    public String toString() {
        return "Schedule{" +
                "id=" + id +
                ", courseId=" + courseId +
                ", classrooms='" + classrooms + '\'' +

                '}';
    }
}
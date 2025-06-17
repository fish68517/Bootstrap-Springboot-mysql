package com.example.service;

import com.example.bean.User;
import com.example.mapper.CourseTeacherMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseTeacherService  {

    @Autowired
    private CourseTeacherMapper courseTeacherMapper;


    public List<User> getTeachersByCourse(Integer courseId) {
        return courseTeacherMapper.findTeachersByCourseId(courseId);
    }


    @Transactional
    public void addTeacherToCourse(Integer courseId, Integer teacherId, String role) {
        if (!courseTeacherMapper.exists(courseId, teacherId)) {
            courseTeacherMapper.insert(courseId, teacherId, role);
        }
    }


    @Transactional
    public void removeTeacherFromCourse(Integer courseId, Integer teacherId) {
        courseTeacherMapper.delete(courseId, teacherId);
    }


    public User getMainTeacher(Integer courseId) {
        return courseTeacherMapper.findMainTeacher(courseId);
    }


    public boolean isTeacherAssignedToCourse(Integer courseId, Integer teacherId) {
        return courseTeacherMapper.exists(courseId, teacherId);
    }
} 
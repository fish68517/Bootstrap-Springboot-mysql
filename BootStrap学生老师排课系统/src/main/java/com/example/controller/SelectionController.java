package com.example.controller;

import com.example.bean.Course;
import com.example.bean.Schedule;
import com.example.bean.Selection;
import com.example.bean.User;
import com.example.mapper.SelectionMapper;
import com.example.service.CourseService;
import com.example.service.SelectionService;
import com.example.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/selections")
public class SelectionController {
    
    @Autowired
    private SelectionService selectionService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private SelectionMapper selectionMapper;

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/select/{courseId}")
    public ResponseEntity<?> selectCourse(
            @PathVariable Integer courseId,  HttpSession session) {
       try {
           // 从 session 获取用户信息
           User user = (User) session.getAttribute("user");
           if (user == null) {
               Map<String, String> map = new HashMap<>();
               map.put("message", "请先登录");
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                      .body(map);
           }

           // 检查是否已选这门课
           if (selectionService.hasSelected(user.getId(), courseId)) {
               Map<String, String> map = new HashMap<>();
               map.put("message","您已经选择了这门课程：" );
               return ResponseEntity.badRequest()
                       .body(map);
           }

           // 创建退课记录
           Selection selection = new Selection();
           selection.setUserId(user.getId());
           selection.setCourseId(courseId);

           // 保存退课记录
           selectionService.saveSelection(selection,"SELECT");


           Map<String, String> map = new HashMap<>();
           map.put("message", "选课成功");
           return ResponseEntity.ok(map);

       } catch (Exception e) {
           HashMap<String, String> map = new HashMap<>();
           map.put("message", "选课失败：" + e.getMessage());
           return ResponseEntity.badRequest()
                   .body(map);
       }
    }

    @DeleteMapping("/dropCourse/{courseId}")
    public ResponseEntity<?> dropCourse(
            @PathVariable Integer courseId,HttpSession session) {
        // 从 session 获取用户信息
        User user = (User) session.getAttribute("user");
        if (user == null) {
            Map<String, String> map = new HashMap<>();
            map.put("message", "请先登录");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(map);
        }
        try {
            // 检查是否已选这门课
            if (!selectionService.hasSelected(user.getId(), courseId)) {
                Map<String, String> map = new HashMap<>();
                map.put("message","未选择这门课程：" );
                return ResponseEntity.badRequest()
                        .body(map);
            }

            // 创建退课记录
            Selection selection = new Selection();
            selection.setUserId(user.getId());
            selection.setCourseId(courseId);

            // 保存退课记录
            selectionService.saveSelection(selection,"DROP");

            Map<String, String> map = new HashMap<>();
            map.put("message","退课成功：" );
            return ResponseEntity.ok(map);

        } catch (Exception e) {
            Map<String, String> map = new HashMap<>();
            map.put("message","退课失败：" + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(map);
        }
    }

    /**
     * 获取学生课表
     */
    @GetMapping("/student/schedule")
    public ResponseEntity<?> getStudentSchedule(HttpSession session) {
        try {
            // 从 session 获取用户信息
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "请先登录"));
            }

            // 获取学生的所有课程(包含课程安排信息)
            List<Course> courses = courseService.getScheduleByStudentId(user.getId());
            
            // 打印日志
            System.out.println("Student schedule for user: " + user.getId());
            System.out.println("Found courses: " + courses.size());
            
            return ResponseEntity.ok(courses);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "获取课表失败: " + e.getMessage()));
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "请先登录"));
        }

        try {
            List<Course> recommendations = recommendationService.recommendCourses(user.getId(), 5);
            System.out.println("Recommendations for user: " + user.getId());
            System.out.println("Found recommendations: " + recommendations.size());
            Iterator<Course> iterator = recommendations.iterator();
            while (iterator.hasNext()) {
                Course course = iterator.next();
                if (course.getSchedules() == null || course.getSchedules().isEmpty()) {
                    iterator.remove();
                    continue;
                }
                List<Schedule> schedules = course.getSchedules();
                Iterator<Schedule> scheduleIterator = schedules.iterator();
                while (scheduleIterator.hasNext()) {
                    Schedule schedule = scheduleIterator.next();
                    if (schedule.getClassrooms() == null || schedule.getClassrooms().getCapacity() == 0) {
                        scheduleIterator.remove();
                    }
                }
                if (schedules.isEmpty()) {
                    iterator.remove();
                }
            }

            Iterator<Course> iterator1 = recommendations.iterator();
            while (iterator1.hasNext()) {
                Course course = iterator1.next();
                int count = selectionMapper.findCountByCourseId(course.getId());
                List<Schedule> scheduleList = course.getSchedules();
                int capacity = 0;
                for (Schedule schedule : scheduleList) {
                    capacity = schedule.getClassrooms().getCapacity();
                }
                if (count >= capacity) {
                    iterator1.remove();
                }
            }

            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "获取推荐课程失败: " + e.getMessage()));
        }
    }
} 
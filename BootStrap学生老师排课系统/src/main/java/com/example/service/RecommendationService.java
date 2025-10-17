package com.example.service;

import com.example.TimeRangeUtils;
import com.example.bean.Course;
import com.example.bean.Schedule;
import com.example.bean.Selection;
import com.example.bean.User;
import com.example.mapper.CourseMapper;
import com.example.mapper.SelectionMapper;
import com.example.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private SelectionMapper selectionMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private UserMapper userMapper;

    // 添加权重常量
    private static final double CREDIT_WEIGHT = 0.3;  // 学分权重
    private static final double POPULARITY_WEIGHT = 0.2;  // 选课人数权重
    private static final double SIMILARITY_WEIGHT = 0.5;  // 用户相似度权重

    /**
     * 为指定学生推荐课程
     * @param studentId 学生ID
     * @param numRecommendations 推荐数量
     * @return 推荐的课程列表
     */
    public List<Course> recommendCourses(Integer studentId, int numRecommendations) {
        try {
            // 1. 获取所有学生的选课记录
            Map<Integer, Set<Integer>> userCourseMatrix = getUserCourseMatrix();
            
            // 2. 获取目标学生已选课程
            Set<Integer> targetUserCourses = userCourseMatrix.getOrDefault(studentId, new HashSet<>());
            
            // 3. 计算用户相似度
            Map<Integer, Double> userSimilarities = calculateUserSimilarities(studentId, userCourseMatrix);
            
            // 4. 获取推荐课程
            Set<Integer> recommendedCourseIds = getRecommendedCourseIds(
                studentId, 
                userSimilarities, 
                userCourseMatrix, 
                targetUserCourses, 
                numRecommendations
            );


            if (recommendedCourseIds == null || recommendedCourseIds.isEmpty()) {
                System.out.println("No recommendations found, using fallback random recommendations");
                return getRandomRecommendations(studentId, numRecommendations);
            }
            
            // 6. 获取课程详细信息
            return recommendedCourseIds.stream()
                    .map(courseMapper::findById)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in course recommendation: " + e.getMessage());

            return getRandomRecommendations(studentId, numRecommendations);
        }
    }

    /**
     * 构建用户-课程矩阵
     */
    private Map<Integer, Set<Integer>> getUserCourseMatrix() {
        List<Selection> allSelections = selectionMapper.findAllSelections();
        Map<Integer, Set<Integer>> matrix = new HashMap<>();
        
        for (Selection selection : allSelections) {
            matrix.computeIfAbsent(selection.getUserId(), k -> new HashSet<>())
                 .add(selection.getCourseId());
        }
        
        return matrix;
    }

    /**
     * 计算用户相似度
     */
    private Map<Integer, Double> calculateUserSimilarities(
            Integer targetUserId, 
            Map<Integer, Set<Integer>> userCourseMatrix) {
        
        Map<Integer, Double> similarities = new HashMap<>();
        Set<Integer> targetUserCourses = userCourseMatrix.get(targetUserId);
        
        if (targetUserCourses == null) return similarities;

        for (Map.Entry<Integer, Set<Integer>> entry : userCourseMatrix.entrySet()) {
            Integer otherUserId = entry.getKey();
            if (otherUserId.equals(targetUserId)) continue;
            
            Set<Integer> otherUserCourses = entry.getValue();
            
            // 计算Jaccard相似度
            double similarity = calculateJaccardSimilarity(targetUserCourses, otherUserCourses);
            similarities.put(otherUserId, similarity);
        }
        
        return similarities;
    }

    /**
     * 计算Jaccard相似度
     */
    private double calculateJaccardSimilarity(Set<Integer> set1, Set<Integer> set2) {
        if (set1.isEmpty() && set2.isEmpty()) return 0.0;
        
        Set<Integer> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        
        Set<Integer> union = new HashSet<>(set1);
        union.addAll(set2);
        
        return (double) intersection.size() / union.size();
    }

    /**
     * 获取推荐课程ID列表 (添加权重计算)
     */
    private Set<Integer> getRecommendedCourseIds(
            Integer targetUserId,
            Map<Integer, Double> userSimilarities,
            Map<Integer, Set<Integer>> userCourseMatrix,
            Set<Integer> targetUserCourses,
            int numRecommendations) {
        
        // 按权重计算的课程评分
        Map<Integer, Double> courseScores = new HashMap<>();
        
        // 1. 基于用户相似度的评分
        for (Map.Entry<Integer, Double> entry : userSimilarities.entrySet()) {
            Integer otherUserId = entry.getKey();
            Double similarity = entry.getValue();
            
            Set<Integer> otherUserCourses = userCourseMatrix.get(otherUserId);
            if (otherUserCourses == null) continue;
            
            for (Integer courseId : otherUserCourses) {
                if (!targetUserCourses.contains(courseId)) {
                    // 用户相似度评分
                    double similarityScore = similarity * SIMILARITY_WEIGHT;
                    courseScores.merge(courseId, similarityScore, Double::sum);
                }
            }
        }
        
        // 2. 添加课程属性权重
        for (Integer courseId : courseScores.keySet()) {
            Course course = courseMapper.findById(courseId);
            if (course != null) {
                // 计算学分权重 (归一化: 假设最高学分为4)
                double creditScore = (course.getCredits() / 4.0) * CREDIT_WEIGHT;
                
                // 获取课程的教室容量(通过schedules和classroom)
                int totalCapacity = 0;
                if (course.getSchedules() != null && !course.getSchedules().isEmpty()) {
                    for (Schedule schedule : course.getSchedules()) {
                        if (schedule.getClassrooms() != null) {
                            totalCapacity += schedule.getClassrooms().getCapacity();
                        }
                    }
                    // 如果有多个教室，取平均值
                    totalCapacity = totalCapacity / course.getSchedules().size();
                }
                
                // 计算选课人数权重 (使用选课率)
                int selectedCount = selectionMapper.countByCourseId(courseId);
                double popularityRate = totalCapacity > 0 ? 
                    (double) selectedCount / totalCapacity : 0;
                
                // 打印调试信息
                System.out.println("Course: " + course.getCourseName() + 
                                 ", Selected: " + selectedCount + 
                                 ", Capacity: " + totalCapacity + 
                                 ", Rate: " + popularityRate);
                
                double popularityScore = popularityRate * POPULARITY_WEIGHT;
                
                // 更新总评分
                double currentScore = courseScores.get(courseId);
                double finalScore = currentScore + creditScore + popularityScore;
                courseScores.put(courseId, finalScore);
            }
        }

        // 3. 考虑课程时间冲突
        Set<Integer> selectedCourseIds = targetUserCourses;
        List<Schedule> selectedSchedules = new ArrayList<>();
        for (Integer courseId : selectedCourseIds) {
            Course course = courseMapper.findById(courseId);
            if (course != null && course.getSchedules() != null) {
                selectedSchedules.addAll(course.getSchedules());
            }
        }

        // 过滤掉时间冲突的课程
        return courseScores.entrySet().stream()
                .filter(entry -> !hasTimeConflict(entry.getKey(), selectedSchedules))
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(numRecommendations)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
    }

    /**
     * 检查课程是否与已选课程时间冲突
     */
    private boolean hasTimeConflict(Integer courseId, List<Schedule> selectedSchedules) {
        Course course = courseMapper.findById(courseId);
        if (course == null || course.getSchedules() == null) {
            return false;
        }

        for (Schedule newSchedule : course.getSchedules()) {
            for (Schedule existingSchedule : selectedSchedules) {
                if (newSchedule.getDayOfWeek().equals(existingSchedule.getDayOfWeek())) {
                    // 使用现有的时间冲突检查工具类
                    boolean isOverlap = TimeRangeUtils.isTimeRangeOverlap(
                        newSchedule.getStartTime(),
                        newSchedule.getEndTime(),
                        existingSchedule.getStartTime(),
                        existingSchedule.getEndTime()
                    );
                    if (isOverlap) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 获取课程推荐原因
     */
    public Map<String, String> getRecommendationReason(Course course) {
        Map<String, String> reasons = new HashMap<>();
        
        // 添加学分相关推荐原因
        reasons.put("credits", String.format("该课程为%d学分", course.getCredits()));
        
        // 添加选课人气相关推荐原因
        int selectedCount = selectionMapper.countByCourseId(course.getId());
        double selectedRate = course.getCapacity() > 0 ? 
            (double) selectedCount / course.getCapacity() * 100 : 0;
        reasons.put("popularity", 
            String.format("已有%.1f%%的学生选择了该课程", selectedRate));
        
        return reasons;
    }

    private List<Course> getRandomRecommendations(Integer studentId, int numRecommendations) {
        try {
            // 1. 获取学生已选课程ID列表
            Set<Integer> selectedCourseIds = new HashSet<>();
            List<Selection> selections = selectionMapper.findAllSelections();
            for (Selection selection : selections) {
                if (selection.getUserId().equals(studentId)) {
                    selectedCourseIds.add(selection.getCourseId());
                }
            }

            System.out.println("Random Recommendation - Selected Courses: " + selectedCourseIds);
            // 2. 获取所有可选课程
            List<Course> allCourses = courseMapper.findAll();
            System.out.println("Random Recommendation - All Courses: " + allCourses);
            // 3. 过滤掉已选课程和无效课程
            List<Course> availableCourses = allCourses.stream()
                .filter(course -> {
                    if (course == null || selectedCourseIds.contains(course.getId())) {
                        return false;
                    }
                    
                    // 计算实际教室容量
                    int totalCapacity = 0;
                    if (course.getSchedules() != null && !course.getSchedules().isEmpty()) {
                        for (Schedule schedule : course.getSchedules()) {
                            if (schedule.getClassrooms() != null) {
                                totalCapacity += schedule.getClassrooms().getCapacity();
                            }
                        }
                    }

                    System.out.println("Random Recommendation - Course: " + course.getCourseName() +
                                     ", Capacity: " + totalCapacity);
                    
                    // 检查是否还有剩余容量
                    return totalCapacity > 0;
                })
                .collect(Collectors.toList());

            // 4. 随机打乱课程列表
            Collections.shuffle(availableCourses);

            System.out.println("Random Recommendation - Available Courses: " + availableCourses.size());
            // 5. 获取指定数量的课程
            return availableCourses.stream()
                .limit(numRecommendations)
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in random recommendations: " + e.getMessage());
            return new ArrayList<>(); // 如果出错返回空列表
        }
    }
} 
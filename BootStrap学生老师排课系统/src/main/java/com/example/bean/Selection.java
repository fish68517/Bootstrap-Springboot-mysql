package com.example.bean;

import lombok.Data;
import java.util.Date;

@Data
public class Selection {
    private Integer id;
    private Integer userId;
    private Integer courseId;
    private Date selectedAt;
    
    // 关联属性
    private User student;
    private Course course;
} 
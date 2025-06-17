package com.example.bean;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SelectionHistory {
    private Integer id;
    private Integer userId;
    private Integer courseId;
    private SelectionAction action;
    private LocalDateTime timestamp;
    
    public enum SelectionAction {
        SELECT,    // 选课
        DROP       // 退课
    }
}

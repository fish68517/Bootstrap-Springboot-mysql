package com.example.service;

import com.example.TimeRangeUtils;
import com.example.bean.Schedule;
import com.example.bean.Selection;
import com.example.bean.SelectionHistory;
import com.example.mapper.CourseMapper;
import com.example.mapper.ScheduleMapper;
import com.example.mapper.SelectionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

@Service
public class SelectionService {

    @Autowired
    private SelectionMapper selectionMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private ScheduleMapper scheduleMapper;


    @Transactional
    public void saveSelection(Selection selection, String type) {
        // 根据操作类型处理选课或退课
        if (type.equals("SELECT")) {
            // 选课操作
            selectionMapper.insertSelection(
                    selection.getUserId(),
                    selection.getCourseId()
            );
        } else {
            // 退课操作
            selectionMapper.deleteSelection(
                    selection.getUserId(),
                    selection.getCourseId()
            );
        }

        // 保存选课历史记录
        SelectionHistory history = new SelectionHistory();
        history.setUserId(selection.getUserId());
        history.setCourseId(selection.getCourseId());
        if (type.equals("SELECT")) {
            history.setAction(SelectionHistory.SelectionAction.SELECT);
        } else {
            history.setAction(SelectionHistory.SelectionAction.DROP);
        }
        // 设置 LocalDateTime
         history.setTimestamp(LocalDateTime.now());
        selectionMapper.insertHistory(history);
    }


    public boolean hasSelected(Integer userId, Integer courseId) {
        return selectionMapper.exists(userId, courseId);
    }

    /**
     * 检查两个课程时间是否冲突
     */
    private boolean isScheduleConflict(Schedule schedule1, Schedule schedule2) {
        // 如果不是同一天，则不冲突
        if (!schedule1.getDayOfWeek().equals(schedule2.getDayOfWeek())) {
            return false;
        }

        // 检查时间段是否重叠
        LocalTime start1 = schedule1.getStartTime();
        LocalTime end1 = schedule1.getEndTime();
        LocalTime start2 = schedule2.getStartTime();
        LocalTime end2 = schedule2.getEndTime();
        // 如果一个时间段的开始时间在另一个时间段内，则冲突

        boolean isOverlap = TimeRangeUtils.isTimeRangeOverlap(start1, end1, start2, end2);
        return isOverlap;
    }

    public void dropCourse(Integer id, Integer id1) {
        selectionMapper.deleteSelection(id, id1);
    }

    public int countTotalSelections() {
        return selectionMapper.countAll();
    }

    public int countTodaySelections() {
        return selectionMapper.countByDate(LocalDate.now());
    }

    public Map<String, Object> getSelectionTrend() {
        Map<String, Object> trend = new HashMap<>();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6); // 获取最近7天数据
        
        List<LocalDate> dates = new ArrayList<>();
        List<Integer> counts = new ArrayList<>();
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            dates.add(currentDate);
            counts.add(selectionMapper.countByDate(currentDate));
            currentDate = currentDate.plusDays(1);
        }
        
        trend.put("dates", dates.stream()
                .map(date -> date.format(DateTimeFormatter.ofPattern("MM-dd")))
                .collect(Collectors.toList()));
        trend.put("counts", counts);
        
        return trend;
    }

    public void findCountByCourseId(Integer id) {


    }
}
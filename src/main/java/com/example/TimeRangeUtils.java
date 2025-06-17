package com.example;

import java.time.LocalTime;

public class TimeRangeUtils {
    /**
     * 比较两个时间区间是否重叠
     *
     * @param start1 时间区间1的开始时间
     * @param end1   时间区间1的结束时间
     * @param start2 时间区间2的开始时间
     * @param end2   时间区间2的结束时间
     * @return true 表示时间区间重叠，false 表示时间区间不重叠
     */
    public static boolean isTimeRangeOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        // 如果时间区间1的结束时间小于时间区间2的开始时间，或者时间区间1的开始时间大于时间区间2的结束时间，则不重叠
        return !((start1.isBefore(end1) || start2.isBefore(end2)));
    }


    public static boolean isTimeRangeOverlap_one(LocalTime start1, LocalTime end1) {
        // 如果时间区间1的结束时间小于时间区间2的开始时间，或者时间区间1的开始时间大于时间区间2的结束时间，则不重叠
        return !((start1.isBefore(end1)));
    }
}
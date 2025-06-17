package com.example.mapper;


import com.example.bean.Classroom;
import com.example.bean.Schedule;
import org.apache.ibatis.annotations.*;

@Mapper
public interface ClassRoomMapper {


    @Select("SELECT * FROM classrooms WHERE id = #{id}")
    Classroom findById(Integer id);

    // 根据 name 查询教室
    @Select("SELECT * FROM classrooms WHERE name = #{name}")
    Classroom findByName(String name);

    @Insert("INSERT INTO classrooms(name, capacity, location) VALUES(#{name}, #{capacity}, #{location})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Classroom classRoom);

    @Update("UPDATE classrooms SET name = #{name}, capacity = #{capacity}, location = #{location} WHERE id = #{id}")
    void update(Classroom classRoom);
}

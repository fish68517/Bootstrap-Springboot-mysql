package com.example.bean;

import lombok.Data;

import java.util.List;

@Data
public class Role {
    private Integer id;
    private String roleName;
    private String description;
    private List<Permission> permissions;
} 
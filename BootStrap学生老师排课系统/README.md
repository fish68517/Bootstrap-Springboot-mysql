<<<<<<< HEAD
# 数学游戏APP数据库设计

## 数据库表结构

### 1. 用户表 (users)
CREATE TABLE users (
user_id INT PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role ENUM('student', 'teacher') NOT NULL,
grade INT,
score INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



### 2. 关卡表 (levels)
CREATE TABLE levels (
level_id INT PRIMARY KEY AUTO_INCREMENT,
grade INT NOT NULL,
title VARCHAR(100) NOT NULL,
description TEXT,
type ENUM('choice', 'fill', 'match') NOT NULL,
required_score INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


### 3. 题目表 (questions)
CREATE TABLE questions (
question_id INT PRIMARY KEY AUTO_INCREMENT,
level_id INT NOT NULL,
content TEXT NOT NULL,
type ENUM('choice', 'fill', 'match') NOT NULL,
correct_answer TEXT NOT NULL,
options TEXT,
score INT DEFAULT 10,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (level_id) REFERENCES levels(level_id)
);


### 4. 用户进度表 (user_progress)
CREATE TABLE user_progress (
progress_id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
level_id INT NOT NULL,
is_completed BOOLEAN DEFAULT FALSE,
score INT DEFAULT 0,
completed_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(user_id),
FOREIGN KEY (level_id) REFERENCES levels(level_id)
);


### 5. 答题记录表 (answer_records)
CREATE TABLE answer_records (
record_id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
question_id INT NOT NULL,
user_answer TEXT,
is_correct BOOLEAN,
score_earned INT DEFAULT 0,
answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(user_id),
FOREIGN KEY (question_id) REFERENCES questions(question_id)
);

## 题目数据结构示例

MULTIPLE_CHOICE: 表示选择题。
FILL_IN_THE_BLANK: 表示填空题。
MATCHING: 表示连线题。


### 连线题数据结构示例

-- 修改questions表的options字段存储格式（用于连线题）：
-- options字段使用JSON格式存储左右两列的数据
-- 格式：{"left": ["选项1","选项2",...], "right": ["答案1","答案2",...]}

-- 插入连线题示例数据
INSERT INTO questions (level_id, content, type, correct_answer, options, score) VALUES
(1, '两位数的加减（连线题）', 'match',
'[
{"left": "34+26", "right": "60"},
{"left": "39+48", "right": "87"},
{"left": "61-36", "right": "25"},
{"left": "12+98", "right": "110"},
{"left": "98-39", "right": "59"},
{"left": "57+20", "right": "77"}
]',
'{
"left": ["34+26", "39+48", "61-36", "12+98", "98-39", "57+20"],
"right": ["25", "87", "59", "77", "60", "110"]
}',
10);

-- correct_answer字段存储正确的匹配关系
-- options字段存储左右两列的选项（打乱顺序）


### 连线题数据结构示例

-- 修改questions表的options字段存储格式（用于连线题）：
-- options字段使用JSON格式存储左右两列的数据
-- 格式：{"left": ["选项1","选项2",...], "right": ["答案1","答案2",...]}

-- 插入连线题示例数据
INSERT INTO questions (level_id, content, type, correct_answer, options, score) VALUES
(1, '两位数的加减（连线题）', 'match',
'[
  {"left": "34+26", "right": "60"},
  {"left": "39+48", "right": "87"},
  {"left": "61-36", "right": "25"},
  {"left": "12+98", "right": "110"},
  {"left": "98-39", "right": "59"},
  {"left": "57+20", "right": "77"}
]',
'{
  "left": ["34+26", "39+48", "61-36", "12+98", "98-39", "57+20"],
  "right": ["25", "87", "59", "77", "60", "110"]
}',
10);

-- correct_answer字段存储正确的匹配关系
-- options字段存储左右两列的选项（打乱顺序）

### 拖拽题数据示例

-- 插入拖拽题数据
INSERT INTO questions (level_id, content, type, correct_answer, options, score) VALUES
(4, '数字拖拽填空题', 'match',
'[
  {"position": "1", "value": "2"},
  {"position": "2", "value": "5"},
  {"position": "3", "value": "12"},
  {"position": "4", "value": "4"},
  {"position": "5", "value": "1"}
]',
'{
  "operators": ["-", "×", "+", "+", "+"],
  "results": ["7", "8", "2", "15", "13"],
  "dragNumbers": ["5", "2", "12", "1", "4", "1", "11", "7", "4", "6"],
  "equations": [
    {"left": "_", "operator": "-", "right": "_", "result": "7"},
    {"left": "_", "operator": "×", "right": "_", "result": "8"},
    {"left": "_", "operator": "+", "right": "_", "result": "2"},
    {"left": "_", "operator": "+", "right": "_", "result": "15"},
    {"left": "_", "operator": "+", "right": "_", "result": "13"}
  ]
}',
10);

### 倍数拖拽题数据示例

-- 插入倍数拖拽题数据
INSERT INTO questions (level_id, content, type, correct_answer, options, score) VALUES
(4, '倍的认识（拖拽题）', 'match',
'[
  {"question": "48是8的几倍", "answer": "6"},
  {"question": "100是10的几倍", "answer": "10"},
  {"question": "72是9的几倍", "answer": "8"}
]',
'{
  "questions": [
    "48是8的( )倍",
    "100是10的( )倍",
    "72是9的( )倍"
  ],
  "dragOptions": ["6倍", "10倍", "8倍"],
  "answers": {
    "48/8": "6",
    "100/10": "10",
    "72/9": "8"
  }
}',
10);

### 填空题数据示例

-- 插入三位数加减法填空题数据
INSERT INTO questions (level_id, content, type, correct_answer, options, score) VALUES
(2, '三位数的加减（填空题）', 'fill',
'[
  {"question": "430+550=", "answer": "980"},
  {"question": "480-130=", "answer": "350"}
]',
'{
  "questions": [
    {"id": 1, "content": "430+550=", "type": "number"},
    {"id": 2, "content": "480-130=", "type": "number"}
  ],
  "description": "请计算下列算式",
  "inputType": "number"
}',
10);

### 选择题数据示例

-- 插入计算后比较大小选择题数据
INSERT INTO questions (level_id, content, type, correct_answer, options, score) VALUES
(3, '计算后比较大小（选择题）', 'choice',
'[
  {"question": "138+587 ? 700", "answer": "<"},
  {"question": "790-468 ? 900", "answer": "<"}
]',
'{
  "questions": [
    {
      "id": 1,
      "content": "138+587 ? 700",
      "options": [">", "<"],
      "explanation": "138+587=725, 725>700"
    },
    {
      "id": 2,
      "content": "790-468 ? 900",
      "options": [">", "<"],
      "explanation": "790-468=322, 322<900"
    }
  ],
  "description": "计算后选择正确的符号"
}',
10);
=======
# Web_Springboot_排课系统

#### 介绍
基于协同过滤算法的排课系统

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)


Android技术开发
Android技术开发是指使用Java语言开发Android应用程序，包括开发工具、开发流程、开发规范、开发技能、开发经验、开发工具等。


- [Android 开发者官网](https://developer.android.com/)
>>>>>>> b61aefbe94117bcc092d29d283319d7f42d6234a

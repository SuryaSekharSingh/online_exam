import { pool } from '../config/db.js';

const studentTableQuery =  `CREATE TABLE IF NOT EXISTS STUDENT(
                            ID INT PRIMARY KEY AUTO_INCREMENT,
                            NAME VARCHAR(40) NOT NULL,
                            EMAIL VARCHAR(60) NOT NULL,
                            CONTACT VARCHAR(10) NOT NULL,
                            PASSWORD VARCHAR(255) NOT NULL);`

const teacherTableQuery = ` CREATE TABLE IF NOT EXISTS TEACHER(
                            ID INT PRIMARY KEY AUTO_INCREMENT,
                            NAME VARCHAR(40) NOT NULL,
                            EMAIL VARCHAR(60) NOT NULL,
                            CONTACT VARCHAR(10) NOT NULL,
                            PASSWORD VARCHAR(255) NOT NULL);`

const addressTableQuery = `CREATE TABLE IF NOT EXISTS address (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    pincode VARCHAR(6),
    student_id INT,
    teacher_id INT,
    CONSTRAINT chk_one_owner CHECK (
        (student_id IS NOT NULL AND teacher_id IS NULL) OR
        (student_id IS NULL AND teacher_id IS NOT NULL)
    ),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teacher(id) ON DELETE CASCADE
);`;

const examTableQuery = `CREATE TABLE IF NOT EXISTS EXAM(
    EXAM_ID INT PRIMARY KEY AUTO_INCREMENT,
    TEACHER_ID INT NOT NULL,
    EXAM_NAME VARCHAR(255) NOT NULL,
    EXAM_TIME DATETIME NOT NULL,
    FOREIGN KEY (TEACHER_ID) REFERENCES TEACHER(ID)
);`;

const questionTableQuery = `CREATE TABLE IF NOT EXISTS QUESTION(
    QUESTION_ID INT PRIMARY KEY AUTO_INCREMENT,
    EXAM_ID INT NOT NULL,
    QUESTION_TEXT TEXT NOT NULL,
    KEYWORDS VARCHAR(255),
    MARKS INT NOT NULL,
    FOREIGN KEY (EXAM_ID) REFERENCES EXAM(EXAM_ID)
);`;

const followTableQuery = `CREATE TABLE IF NOT EXISTS FOLLOWS(
    T_ID INT,
    S_ID INT,
    PRIMARY KEY(T_ID, S_ID),
    FOREIGN KEY(T_ID) REFERENCES TEACHER(ID),
    FOREIGN KEY(S_ID) REFERENCES STUDENT(ID)
);`;

const attemptTableQuery = `CREATE TABLE IF NOT EXISTS ATTEMPT(
    ATTEMPT_ID INT PRIMARY KEY AUTO_INCREMENT,
    S_ID INT,
    EXAM_ID INT,
    MARKS INT,
    EXAM_RANK INT,
    ATTEMPT_DATE DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (S_ID) REFERENCES STUDENT(ID),
    FOREIGN KEY (EXAM_ID) REFERENCES EXAM(EXAM_ID)
);`;

const createTable = async (tableName, query) => {
    try{
        await pool.query(query);
        console.log(`${tableName} Table is created or already exists!`)
    } catch(error){
        console.log('Something went wrong! ', error);
    }
}

const createAllTables = async () => {
    try {
        await createTable('Student', studentTableQuery)
        await createTable('Teacher', teacherTableQuery)
        await createTable('Address', addressTableQuery)
        await createTable('Exam', examTableQuery)
        await createTable('Question', questionTableQuery)
        await createTable('Follows', followTableQuery)
        await createTable('Attempt', attemptTableQuery)
        console.log("Created Successfully!")
    } catch (error) {
        console.log("Error occured : " , error);
        throw error;
    }
}

export default createAllTables;
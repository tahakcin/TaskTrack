import sqlite3


def getDb():
    return sqlite3.connect('tasks.db')


def addDb(title, description, priority, deadline, status):
    if not status:
        status = "active"
    conn = getDb()
    cursor = conn.cursor()
    command = 'INSERT INTO tasks (title, description, priority, deadline, status) VALUES (?, ?, ?, ?, ?)'
    cursor.execute(command, (title, description, priority, deadline, status))
    conn.commit()
    conn.close()
    taskId = cursor.lastrowid
    return {"id": taskId, "title": title, "description": description, "priority": priority, "deadline": deadline,
            "status": status}


def getAllTasks():
    tasks = []
    conn = getDb()
    cursor = conn.cursor()
    command = 'SELECT * FROM tasks'
    cursor.execute(command)
    rows = cursor.fetchall()
    for row in rows:
        task = {
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "priority": row[3],
            "deadline": row[4],
            "status": row[5]
        }
        tasks.append(task)
    return tasks


def deleteTask(taskId):
    conn = getDb()
    cursor = conn.cursor()
    command = 'DELETE FROM tasks WHERE id = ?'
    cursor.execute(command, (taskId,))
    conn.commit()
    conn.close()


def markTask(taskId):
    conn = getDb()
    cursor = conn.cursor()
    command = 'UPDATE tasks SET status = "completed" WHERE id = ?'
    cursor.execute(command, (taskId,))
    conn.commit()
    conn.close()


def getTasksbyStatus(status):
    tasks = []
    conn = getDb()
    cursor = conn.cursor()
    command = 'SELECT * FROM tasks WHERE status = ?'
    cursor.execute(command, (status,))
    rows = cursor.fetchall()
    for row in rows:
        task = {
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "priority": row[3],
            "deadline": row[4],
            "status": row[5]
        }
        tasks.append(task)
    return tasks

import sqlite3
from datetime import date

from app.models import Task


def get_db():
    return sqlite3.connect('tasks.db')


def add_db(title, description, priority, deadline, status):
    if not status:
        status = "active"
    conn = get_db()
    cursor = conn.cursor()
    command = 'INSERT INTO tasks (title, description, priority, deadline, status) VALUES (?, ?, ?, ?, ?)'
    cursor.execute(command, (title, description, priority, deadline, status))
    conn.commit()
    conn.close()
    taskId = cursor.lastrowid
    return {"id": taskId, "title": title, "description": description, "priority": priority, "deadline": deadline,
            "status": status}


def get_all_tasks():
    tasks = []
    conn = get_db()
    cursor = conn.cursor()
    command = 'SELECT * FROM tasks'
    cursor.execute(command)
    rows = cursor.fetchall()
    tasks = [Task(*row) for row in rows]
    conn.close()
    return tasks


def remove_task(taskId):
    conn = get_db()
    cursor = conn.cursor()
    command = 'DELETE FROM tasks WHERE id = ?'
    cursor.execute(command, (taskId,))
    conn.commit()
    conn.close()


def mark_task(taskId):
    conn = get_db()
    cursor = conn.cursor()
    command = 'UPDATE tasks SET status = "completed" WHERE id = ?'
    cursor.execute(command, (taskId,))
    conn.commit()
    conn.close()


def get_tasks_by_status(status):
    tasks = []
    conn = get_db()
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



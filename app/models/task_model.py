class Task:
    def __init__(self, id, title, description, priority, deadline, status='active'):
        self.id = id
        self.title = title
        self.description = description
        self.priority = priority
        self.deadline = deadline
        self.status = status


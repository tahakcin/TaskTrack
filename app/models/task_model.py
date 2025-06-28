from datetime import date, datetime
from time import strptime


class Task:
    def __init__(self, id, title, description, priority, deadline, status='active'):
        self.id = id
        self.title = title
        self.description = description
        self.priority = priority
        self.deadline = datetime.strptime(deadline, '%Y-%m-%d').date()
        self.status = status

    @property
    def is_expired(self):
        return self.deadline < date.today()

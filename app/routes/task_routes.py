from flask import render_template, Blueprint, request, jsonify
from ..controllers import add_db, get_all_tasks, remove_task, mark_task, get_tasks_by_status
from ..models import Task

task_bp = Blueprint('task', __name__)


@task_bp.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        title = request.form.get('task-title')
        description = request.form.get('task-description')
        priority = request.form.get('task-priority')
        deadline = request.form.get('task-deadline')
        status = request.form.get('task-status')
        task_data = jsonify(add_db(title, description, priority, deadline, status))
        return task_data
    else:
        return render_template("index.html", tasks=get_all_tasks())


@task_bp.route('/delete-task', methods=['POST'])
def delete_task():
    data = request.get_json()
    task_id = data['task_id']
    remove_task(task_id)
    return jsonify({'status': 'success'})


@task_bp.route('/mark-task-done', methods=['POST'])
def mark_task_done():
    data = request.get_json()
    task_id = data['task_id']
    mark_task(task_id)
    return jsonify({'status': 'success'})








@task_bp.route('/completed')
def completed():
    completed_tasks = get_tasks_by_status('completed')
    return render_template("completed.html", tasks=completed_tasks)


@task_bp.route('/active')
def active():
    active_tasks = get_tasks_by_status('active')
    return render_template("active.html", tasks=active_tasks)


@task_bp.route('/about')
def about():
    return render_template("about.html")

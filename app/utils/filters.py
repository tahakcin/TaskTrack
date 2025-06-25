from datetime import datetime


def register_filters(app):
    @app.template_filter('datetimeformat')
    def datetimeformat(value):
        dt = datetime.strptime(value, "%Y-%m-%d")
        return dt.strftime("%B %d, %Y")
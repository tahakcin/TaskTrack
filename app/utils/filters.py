from datetime import datetime


def register_filters(app):
    @app.template_filter('datetimeformat')
    def datetimeformat(value):
        if isinstance(value, str):
            dt = datetime.strptime(value, "%Y-%m-%d")
        else:
            return value

        return dt.strftime("%B %d, %Y")

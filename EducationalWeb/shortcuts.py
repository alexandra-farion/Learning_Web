from django.template import loader


def get_template(name: str):
    return loader.render_to_string(name)

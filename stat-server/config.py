import os


def getenv(key, *default):
    if key not in os.environ:
        if len(default) == 1:
            return default[0]
        raise KeyError(f"Missing ENV {key}")
    else:
        return os.getenv(key)


DATABASE_URI = getenv("DATABASE_URI")

import datetime

base_schedule = [[["", ""] for i in range(8)] for j in range(6)]


def join_schedules(old_schedule, new_schedule):
    for i in range(len(old_schedule)):
        day = old_schedule[i]

        for j in range(len(day)):
            new_subj = new_schedule[i][j]

            if day[j][0] != new_subj:
                arr = [new_subj, "Не задано"]
                if not new_subj:
                    arr = ["", ""]
                old_schedule[i][j] = arr

    return old_schedule


def get_week(date: str):
    return datetime.date(*list(map(int, date.split("-")))).isocalendar().week


def normalise_date(date: str):
    return datetime.date(*list(map(int, date.split("-"))))

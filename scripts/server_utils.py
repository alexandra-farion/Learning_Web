import datetime

base_student_schedule = [[["", ""] for i in range(8)] for j in range(6)]
groups = {
    "1": " 1 гр.",
    "2": " 2 гр.",
    "ест.": " ест.",
    "эк.": " эк."
}


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


def clean_fixed_teacher_classes(input_classes):
    classes = [[]]
    index = 0
    for i in input_classes:
        if i[0] == "":
            classes.pop()
            break
        for j in i:
            if not j:
                break
            classes[index].append(j)

        index += 1
        classes.append([])
    return classes


def __get_subject(arr: list, arg: str):
    return " ".join(arr[:arr.index(arg)])


def get_subject_and_group(subjects_where_found: str, subjects: list):
    for subject in subjects:
        for subject_and_group in subjects_where_found.split("/"):
            if subject in subject_and_group:
                for key in groups.keys():
                    if key in subject_and_group:
                        return __get_subject(subject_and_group.split(), key), groups[key]
    return "", ""

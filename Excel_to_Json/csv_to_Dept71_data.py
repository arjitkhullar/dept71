import xlrd
import json

parts = ["name", "quantity", "hours"]
users = ["name", "hours"]


def get_data(filename, sheet_name, col, array_template):
    data = []
    final_array = []
    column = xlrd.open_workbook(filename).sheet_by_name(sheet_name).col(col)
    for i in column:
        if i.value:
            data.append(i.value.encode('utf-8'))
    for inst in data:
        final_array.append(dict(zip(array_template, [inst] + ['', ''])))
    return final_array


def create_json(data, filename):
    wf = open(filename, 'w')
    wf.write(json.dumps({'parts': data}, sort_keys=False, separators=(',', ': ')))
    wf.close()


create_json(get_data('MTC PARTS - 4-21-17.xls', 'Sheet1', 1, parts), 'parts.json')
create_json(get_data('WEEKLY SCHEDULE (CLEAN ROOM & TRIM).xls', 'Laminator Assignments', 1, users), 'users.json')

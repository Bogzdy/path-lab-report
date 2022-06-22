import re, json, random


def to_dictionary(filename, regex):
    with open(filename, 'r', encoding='utf-8') as f:
        list_of_cases = []
        current_number = ''
        current_key = ''
        for line in f:
            case_number = re.search(regex, line)
            if case_number:
                # current_number = case_number.group()
                list_of_cases.append({})

            else:
                if 'macroscopie' in line[0:12].lower():
                    list_of_cases[-1]['gross_exam'] = ''
                    current_key = 'gross_exam'
                elif 'microscopie' in line[0:12].lower():
                    list_of_cases[-1]['microscopic_exam'] = ''
                    current_key = 'microscopic_exam'
                elif "ihc" in line[0:3].lower():
                    list_of_cases[-1]['immuno_examination'] = ''
                    current_key = 'immuno_examination'
                elif 'concluzie' in line[0:10].lower():
                    list_of_cases[-1]['diagnosis'] = ''
                    current_key = 'diagnosis'

                else:
                    if 'ICD-O' in line:
                        start_index = line.find("ICD-O")
                        end_index = line.find("\n", start_index)
                        list_of_cases[-1]['medical_codes'] = line[start_index:end_index]
                        line = line[0:start_index]

                    value_str = list_of_cases[-1].get(current_key, "")
                    list_of_cases[-1][current_key] = value_str + str(line.rstrip('\n\n\u2003\n'))

    return add_account_id(list_of_cases)


def to_json(collect):
    filename = "clean_data.json"
    with open(filename, 'w') as f:
        json.dump(collect, f)


def add_account_id(l):
    list_of_account_ids = [1,
                           28,
                           29,
                           30,
                           31,
                           32,
                           33,
                           34,
                           35,
                           43,
                           44,
                           54,
                           78,
                           ]
    for item in l:
        item['doctor'] = random.choice(list_of_account_ids)
    return l


my_regex = r"[0-9]{5,}"  # regex for case number
my_file = 'medreport.txt'
l = to_dictionary(my_file, my_regex)
to_json(l)

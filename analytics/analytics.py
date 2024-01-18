import configparser

import db
import numpy as np
from statistics import median


config = configparser.ConfigParser()
config.read('config.ini', encoding='utf')

DB_HOST = config.get("database", "host")
DB_USER = config.get("database", "user")
DB_PASSWORD = config.get("database", "password")
DB_NAME = config.get("database", "name")
DB_PORT = config.get("database", "port")


connection = db.create_connection(
    DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
)

connection.autocommit = True

# the point conversion system is such because of the robust coefficient of variation
def convert_to_five_point_scale(rcv):
    if rcv < 10:
        return 2
    elif rcv < 20:
        return 3
    elif rcv < 30:
        return 4
    else:
        return 5


# should be started after each table update
def analyticity_processing(id_student):
    select_res = f"SELECT points, max_points, id_test FROM test_res where id_student= {id_student} order by id_res desc"
    results = db.execute_read_query(connection, select_res)

    points = results[0][0]
    max_points = results[0][1]
    analyticity = round(points / max_points * 100, 2)
    id_test = results[0][2]

    insert_request = [
        (id_student, id_test, analyticity)
    ]
    record = ", ".join(["%s"] * len(insert_request))
    insert_query = (
        f"INSERT INTO tests_analytics (id_student,id_test, analyticity) VALUES {record}"
    )

    cursor = connection.cursor()
    cursor.execute(insert_query, insert_request)


# runs separately, after deadline/other
def leadership_processing(id_student, id_test):
    select_res = f"SELECT res1, res2, res3 FROM test_res where id_author= {id_student} and id_test= {id_test}"
    results = db.execute_read_query(connection, select_res)

    response_density = []
    for i in range(len(results[0])):
        element_ratio = round(sum(1 if tup[i] else 0 for tup in results) / len(results), 2)
        response_density.append(element_ratio)

    median_value = median(response_density)
    iqr = round(np.percentile(response_density, 75) - np.percentile(response_density, 25), 2)
    leadership = round(iqr / median_value, 2) * 100
    leadership = convert_to_five_point_scale(leadership)

    insert_request = [
        (id_student, id_test, leadership)
    ]
    record = ", ".join(["%s"] * len(insert_request))
    insert_query = (
        f"INSERT INTO tests_analytics (id_student, id_test, leadership) VALUES {record}"
    )

    cursor = connection.cursor()
    cursor.execute(insert_query, insert_request)


def results_for_the_course(id_student):
    select_an = f"SELECT analyticity FROM tests_analytics where id_student= {id_student} and analyticity is not null"
    select_lsh = f"SELECT leadership FROM tests_analytics where id_student= {id_student} and leadership is not null"

    st_an = db.execute_read_query(connection, select_an)
    st_lsh = db.execute_read_query(connection, select_lsh)

    course_analyticity = median(np.array(st_an))
    course_leadership = median(np.array(st_lsh))

    insert_request = [
        (id_student, course_analyticity[0], course_leadership[0])
    ]
    record = ", ".join(["%s"] * len(insert_request))
    insert_query = (
        f"INSERT INTO student_indicators (id_student, st_analyticity, st_leadership) VALUES {record}"
    )
    cursor = connection.cursor()
    #cursor.execute(insert_query, insert_request)
results_for_the_course(1)
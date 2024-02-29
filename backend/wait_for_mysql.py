'''
    도커의 MySQL 컨테이너의 상태가 'READY' 일 때까지 확인해주는 스크립트
'''
import time
import os
import pymysql


def database_not_ready_yet(error, checking_interval_seconds):
    print('Database initialization has not yet finished. Retrying over {0} second(s). The encountered error was: {1}.'
          .format(checking_interval_seconds,
                  repr(error)))
    time.sleep(checking_interval_seconds)


def wait_for_database(host, port, db, user, password, checking_interval_seconds):
    print('Waiting until the database is ready to handle connections....')
    database_ready = False
    while not database_ready:
        db_connection = None
        try:
            db_connection = pymysql.connect(host=host,
                                            port=port,
                                            db=db,
                                            user=user,
                                            password=password,
                                            charset='utf8mb4',
                                            connect_timeout=5)
            print('Database connection made.')
            db_connection.ping()
            print('Database ping successful.')
            database_ready = True
            print('The database is ready for handling incoming connections.')
        except pymysql.err.OperationalError as err:
            database_not_ready_yet(err, checking_interval_seconds)
        except pymysql.err.MySQLError as err:
            database_not_ready_yet(err, checking_interval_seconds)
        except Exception as err:
            database_not_ready_yet(err, checking_interval_seconds)
        finally:
            if db_connection is not None and db_connection.open:
                db_connection.close()


if '__main__' == __name__:
    MYSQL_SETTINGS = {
        # "HOST": os.environ["HOSTNAME"],
        # "DB": os.environ["MYSQL_DATABASE"],
        # "PASSWORD": os.environ["MYSQL_ROOT_PASSWORD"],
        "HOST": os.environ["HOST"],
        "PORT": 3306,
        "DB": os.environ["DB"],
        "USER": os.environ["USER"],
        "PASSWORD": os.environ["PASSWORD"],
        "CHECK_SESSION_INTERVAL": 5
    }
    print(MYSQL_SETTINGS)
    wait_for_database(MYSQL_SETTINGS["HOST"],
                      MYSQL_SETTINGS["PORT"],
                      MYSQL_SETTINGS["DB"],
                      MYSQL_SETTINGS["USER"],
                      MYSQL_SETTINGS["PASSWORD"],
                      MYSQL_SETTINGS["CHECK_SESSION_INTERVAL"]
                      )

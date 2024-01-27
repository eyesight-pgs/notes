# mysql


## View data driectory path
query: `SHOW VARIABLES LIKE 'datadir'`


## recevering a innodb table from .idb file
- link: https://dba.stackexchange.com/questions/16875/restore-table-from-frm-and-ibd-file
- link: https://www.chriscalender.com/tag/innodb-error-tablespace-id-in-file
- link: https://dba.stackexchange.com/a/127813

## table partitioning
- link: https://stackoverflow.com/questions/1579930/what-is-mysql-partitioning
- link: https://stackoverflow.com/questions/16721772/mysql-performance-multiple-tables-vs-index-on-single-table-and-partitions

## mysql anti patterns:
- link: https://pragprog.com/titles/bksqla/sql-antipatterns





## general my.ini content
```ini
[mysql]



[mysqld]
# set basedir to your installation path
basedir=D:/apps/mysql
port=3306

# set datadir to the location of your data directory
datadir=D:/app-data/mysql


# inno db buffer size
innodb_buffer_pool_size=4G
```


## view currently logged in user
```sql
select current_user;
+----------------+
| current_user   |
+----------------+
| root@localhost |
+----------------+
```




## creating 'root'@'%'
```sql
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root_user_password';
Query OK, 0 rows affected (0.00 sec)

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.01 sec)

$ mysql -u root -p --protocol tcp --port 3356
mysql> select current_user;
+--------------+
| current_user |
+--------------+
| root@%       |
+--------------+
```




## installation
```txt
----- INSTALLATION -----
cmd> apt install mysql-server
got error

cmd> apt-cache search mysql-server
mariadb-server-10.3 - MariaDB database server binaries
mariadb-server-core-10.3 - MariaDB database core server files
default-mysql-server - MySQL database server binaries and system database setup (metapackage)
default-mysql-server-core - MySQL database server binaries (metapackage)

cmd> apt install default-mysql-server
cmd> systemctl start mysql
cmd> systemctl status mysql
Active: active (running)

cmd> sudo mysql_secure_installation
root password is blank

cmd> mysql -u root
not allowed without sudo  - will get some error
cmd> sudo mysql -u root
welcoome
mysql>alter user 'root'@'localhost' identified  by 'rootpassword';
Query OK
mysql> FLUSH PRIVILEGES;
Query OK
next time onwards sudo is not requred to login to mysql
mysql> exit
Bye

cmd> mysql -u user -prootpassword
welcome
mysql> create user 'guest'@'localhost' identified by 'guest';
OK
mysql> flush PRIVILEGES;
ok

cmd> mysql -u guest -pguest
welcome
mysql> show databases;
information_schema
mysql> create database temp;
Access denied for user 'guest'@'localhost' to database 'temp'

2 solutions:
	1) give all permission to guest user
		// login as root user
		GRANT ALL PRIVILEGES ON *.* TO 'guest'@'localhost';
		syntax: GRANT [type of privilege] ON [database name].[table name] TO '[username]'@'localhost';
		syntax for revoke: REVOKE [type of permission] ON [database name].[table name] FROM '[username]'@'localhost';

	2) create database using root user, then give access to guest user
		// login as root user
		create database temp;
		GRANT ALL PRIVILEGES ON temp.* TO 'guest'@'localhost';
	
	2nd way of doing is better (may be).
```













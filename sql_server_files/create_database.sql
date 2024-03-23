create database users
create table t_users
(
	user_id int identity(1,1),
	user_firstname varchar(50),
	user_lastname varchar(50),
	user_email varchar(50),
	constraint pk_t_users primary key(user_id)
)

insert into t_users(user_firstname,user_lastname,user_email)values('Louis','Funeste','louis.funeste@gmail.com')
insert into t_users(user_firstname,user_lastname,user_email)values('Gisele','Monnier','gisele.monnier@gmail.com')
insert into t_users(user_firstname,user_lastname,user_email)values('Bernard','Massy','bernard.massy@gmail.com')
insert into t_users(user_firstname,user_lastname,user_email)values('Jean-Claude','Festou','jc.festou@gmail.com')

select * from t_users



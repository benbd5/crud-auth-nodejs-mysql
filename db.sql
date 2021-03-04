CREATE DATABASE exam;

USE exam;

#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: user
#------------------------------------------------------------

CREATE TABLE user(
        userId        Int  Auto_increment  NOT NULL ,
        lastname      Varchar (60) NOT NULL ,
        firstname     Varchar (60) NOT NULL ,
        email         Varchar (60) NOT NULL ,
        password      Varchar (60) NOT NULL ,
        dateRegister  Date NOT NULL ,
        roles         Varchar (5) NOT NULL ,
        profilPicture Varchar (255)
	,CONSTRAINT user_PK PRIMARY KEY (userId)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: category
#------------------------------------------------------------

CREATE TABLE category(
        categoryId Int  Auto_increment  NOT NULL ,
        name       Varchar (50) NOT NULL ,
        userId     Int NOT NULL
	,CONSTRAINT category_PK PRIMARY KEY (categoryId)

	,CONSTRAINT category_user_FK FOREIGN KEY (userId) REFERENCES user(userId)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: article
#------------------------------------------------------------

CREATE TABLE article(
        articleId   Int  Auto_increment  NOT NULL ,
        title       Varchar (255) NOT NULL ,
        picture     Varchar (255) NOT NULL ,
        description Text NOT NULL ,
        dateAdd     Date NOT NULL ,
        categoryId  Int NOT NULL ,
        userId      Int NOT NULL
	,CONSTRAINT article_PK PRIMARY KEY (articleId)

	,CONSTRAINT article_category_FK FOREIGN KEY (categoryId) REFERENCES category(categoryId)
	,CONSTRAINT article_user0_FK FOREIGN KEY (userId) REFERENCES user(userId)
)ENGINE=InnoDB;

-- Ajout colonne roles
ALTER TABLE user 
ADD roles VARCHAR(5) NOT NULL;

-- Test insert user
INSERT INTO user (firstname,lastname,email,password)
VALUES ('test','ok','test@t.com',123);

-- Test insert article
INSERT INTO article (title, description, categories) VALUES ('test','teseetete',1)

-- Test delete user
DELETE FROM user WHERE userId BETWEEN 1 and 13;

-- Test delete article 
DELETE FROM article WHERE articleId=1;

-- Verif mail pour login
SELECT * FROM user WHERE email='ben@test.com';

-- Test update
UPDATE article SET title = ? WHERE articleId=1;
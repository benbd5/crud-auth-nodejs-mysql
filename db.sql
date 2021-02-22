CREATE DATABASE crud_auth;

USE crud_auth;

CREATE TABLE user
(
	userID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
  	email VARCHAR(50) NOT NULL,
	password VARCHAR(255) NOT NULL
)

CREATE TABLE article
(
	articleId INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255),
    image VARCHAR(255),
    userId INT,
    description VARCHAR (255),
    FOREIGN KEY (userId) REFERENCES user(userId)
);

-- Ajout colonne categories
ALTER TABLE article 
ADD categories VARCHAR(255);

-- Ajout colonne roles
ALTER TABLE user 
ADD roles VARCHAR(255);

SELECT * FROM user;
SELECT * FROM article;

-- Test insert user
INSERT INTO user (firstname,lastname,email,password)
VALUES ('test','ok','test@t.com',123);

-- Test insert article
INSERT INTO article (titre, description, categories) VALUES ('test','teseetete',1)

-- Test delete user
DELETE FROM user WHERE userId BETWEEN 1 and 13;

-- Test delete article 
DELETE FROM article WHERE articleId=1;

-- Verif mail pour login
SELECT * FROM user WHERE email='ben@test.com';

-- Test update
UPDATE article SET titre =  WHERE articleId=1;
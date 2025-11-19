CREATE DATABASE IF NOT EXISTS BooDB; 
USE BooDB; 

CREATE TABLE IF NOT EXISTS Usuario (
NombreUsu varchar(100) PRIMARY KEY, 
Foto mediumtext NULL, 
Correo varchar(255) NOT NULL UNIQUE, 
Pssword varchar(255) NOT NULL, 
FechaReg timestamp default current_timestamp NOT NULL, 
FechaUpdate timestamp default null on update current_timestamp,  
EstadoUsu tinyint default 0 comment '0= Activo, 1=BajaLogica', 
Constraint CK_EstadoUsu CHECK (EstadoUsu IN(0,1))
); 

/*
ALTER TABLE usuario
MODIFY Foto mediumText;
*/


CREATE TABLE IF NOT EXISTS Estado(
Estado_id int auto_increment PRIMARY KEY, 
NombreE varchar(255) NOT NULL 
); 

CREATE TABLE IF NOT EXISTS Municipio(
Municipio_id int auto_increment PRIMARY KEY, 
NombreM varchar(255) NOT NULL, 
Estado int, 
constraint FOREIGN KEY (Estado) references Estado(Estado_id) on delete set null 
); 

CREATE TABLE IF NOT EXISTS Categoria(
Categoria_id tinyint auto_increment PRIMARY KEY, 
NombreC varchar(255) 
);

CREATE TABLE IF NOT EXISTS Publicacion(
Publicacion_id int unsigned auto_increment PRIMARY KEY, 
Autor varchar(100) NULL, 
Titulo varchar(255) NOT NULL, 
TextoPubli text NOT NULL, 
Imagen longtext, 
ImageExt varchar(6) comment 'Extension de la imagen', 
Municipio int, 
Categoria tinyint NOT NULL, 
Etiqueta Varchar(50), 
EstadoPubli tinyint default 0 comment '0= Activo, 1=BajaLogica', 
FechaCreacion timestamp default current_timestamp NOT NULL, 
FechaEdicion timestamp default null on update current_timestamp,  
constraint CK_EstadoPubli CHECK (EstadoPubli IN(0,1)), 
constraint CK_Extension CHECK (ImageExt IN ('jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'avi', 'webm', 'mov')), 
constraint FK_Autor FOREIGN KEY (Autor) References Usuario(NombreUsu) on delete set null , 
constraint FK_Municipio FOREIGN KEY (Municipio) References Municipio(Municipio_id) on delete set null , 
constraint KF_Categoria FOREIGN KEY (Categoria) references Categoria(Categoria_id) on delete cascade
); 

/*
ALTER TABLE Publicacion
MODIFY Imagen longText;
*/


CREATE TABLE IF NOT EXISTS Comentario(
Comentario_id int unsigned auto_increment PRIMARY KEY, 
TextoComent text NOT NULL, 
AutorComent varchar(100), 
PubliComent int unsigned NOT NULL, 
fechaComent timestamp default current_timestamp NOT NULL, 
constraint FK_AutorComent FOREIGN KEY (AutorComent) references Usuario(NombreUsu) on delete set null, 
constraint FK_PubliComent FOREIGN KEY (PubliComent) references Publicacion(Publicacion_id) on delete cascade 
); 

CREATE TABLE IF NOT EXISTS Calificacion(
Calificacion_id int unsigned auto_increment PRIMARY KEY, 
Calif tinyint not null, 
AutorCalif varchar(100) NOT NULL, 
PubliCalif int unsigned NOT NULL, 	
FechaCalif timestamp default current_timestamp NOT NULL , 
constraint CK_Calif CHECK (Calif IN(1,2,3,4,5)), 
constraint CK_UserxCalif UNIQUE (AutorCalif, PubliCalif) , 
constraint FK_AutorCalif FOREIGN KEY (AutorCalif) references Usuario(NombreUsu) on delete cascade, 
constraint FK_PubliCalif FOREIGN KEY (PubliCalif) references Publicacion(Publicacion_id) on delete cascade
); 
/*
DROP TABLE Calificacion; 
DROP TABLE Comentario;
DROP TABLE Publicacion;
DROP TABLE Categoria;
DROP TABLE Municipio;
DROP TABLE Estado;  
DROP TABLE Usuario; */
USE BooDB; 

CREATE VIEW VW_Tendencias
AS
SELECT Publicacion_id, Autor, Foto, Titulo, TextoPubli, Imagen, ImageExt, Municipio, Estado ,Categoria, Calificacion, Etiqueta, FechaCreacion, FechaEdicion , COUNT(C.PubliCalif) AS LikesRecientes
FROM VW_Publicacion 
JOIN Calificacion AS C
ON C.PubliCalif= Publicacion_id
AND FechaCalif >= DATE_SUB(now(), INTERVAL 28 DAY)
GROUP BY Publicacion_id;


CALL SP_Subforos(1, "Aliens"); 
DELIMITER $$
CREATE PROCEDURE SP_Subforos 
(opc tinyint, p_categoria varchar(255))
BEGIN 
IF opc = 1 THEN #Tendencias
 SELECT * 
 FROM VW_Tendencias
 WHERE Categoria = p_categoria 
 ORDER BY LikesRecientes DESC 
 LIMIT 3; 
END IF; 

IF opc = 2 THEN #Publicaciones sin tendencias
SELECT WP.* 
FROM VW_Publicacion AS WP 
LEFT JOIN (
SELECT Publicacion_id 
FROM VW_Tendencias WHERE Categoria = p_categoria
ORDER BY LikesRecientes DESC, Calificacion DESC 
LIMIT 3) AS Top3 
ON WP.Publicacion_id= Top3.Publicacion_id WHERE WP.Categoria = p_categoria AND Top3.Publicacion_id IS NULL 
ORDER BY FechaCreacion DESC, Calificacion DESC; 
END IF;
END $$
DELIMITER ; 

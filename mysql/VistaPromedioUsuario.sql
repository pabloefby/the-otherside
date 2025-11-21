CREATE VIEW  VW_PromedioDeUsuario AS
SELECT
U.NombreUsu AS NombreUsu,
ROUND(AVG(C.Calif),1) AS PromedioPublis
FROM Calificacion AS C
JOIN Publicacion AS P
ON C.PubliCalif = P.Publicacion_id
JOIN Usuario AS U
ON P.Autor = U.NombreUsu
GROUP BY U.NombreUsu

DROP VIEW VW_PromedioDeUsuario
SELECT * FROM VW_PromedioDeUsuario
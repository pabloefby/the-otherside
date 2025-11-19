USE BooDB; 
CREATE VIEW VW_Publicacion AS 
SELECT P.Publicacion_id, P.Autor, Us.Foto, P.Titulo, P.TextoPubli, P.Imagen, P.ImageExt, M.NombreM AS Municipio, E.NombreE AS Estado ,Cat.NombreC AS Categoria, AVG(Cal.Calif) AS Calificacion, P.Etiqueta, 
P.FechaCreacion, P.FechaEdicion
FROM Publicacion AS P
JOIN Categoria AS Cat
ON P.Categoria=Cat.Categoria_id
LEFT JOIN Municipio AS M
ON M.Municipio_id = P.Municipio 
LEFT JOIN Estado AS E 
ON E.Estado_id = M.Estado 
LEFT JOIN Calificacion AS Cal
ON P.Publicacion_id = Cal.PubliCalif
LEFT JOIN Usuario as Us
ON P.Autor = Us.NombreUsu
WHERE P.EstadoPubli=0
GROUP BY P.Publicacion_id, P.Autor, P.Titulo, P.TextoPubli, P.Imagen, P.ImageExt, M.NombreM, E.NombreE,Cat.NombreC, P.Etiqueta, P.FechaCreacion, P.FechaEdicion; 

DROP VIEW VW_Publicacion;
SELECT * FROM VW_Publicacion; 
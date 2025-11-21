CREATE VIEW VW_PublicacionEditar AS 
SELECT P.Publicacion_id, 
P.Autor, 
P.Titulo, 
P.TextoPubli, 
P.Imagen,
M.Municipio_id AS Municipio, 
E.Estado_id AS Estado ,
Categoria_id AS Categoria, 
P.Etiqueta
FROM Publicacion AS P
JOIN Categoria AS Cat
ON P.Categoria=Cat.Categoria_id
LEFT JOIN Municipio AS M
ON M.Municipio_id = P.Municipio 
LEFT JOIN Estado AS E 
ON E.Estado_id = M.Estado 
LEFT JOIN Usuario as Us
ON P.Autor = Us.NombreUsu
WHERE P.EstadoPubli=0
GROUP BY P.Publicacion_id, P.Autor, P.Titulo, P.TextoPubli, P.Imagen, P.ImageExt, M.NombreM, E.NombreE,Cat.NombreC, P.Etiqueta, P.FechaCreacion, P.FechaEdicion; 

DROP VIEW VW_PublicacionEditar;
SELECT * FROM VW_PublicacionEditar; 
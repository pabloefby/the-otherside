CREATE OR REPLACE VIEW Vista_TopMunicipiosPublicaciones AS
SELECT 
    M.NombreM AS Municipio,
    E.NombreE AS Estado,
    COUNT(P.Publicacion_id) AS TotalPublicaciones,
    ROUND(AVG(C.Calif),1) AS Calificacion
FROM 
    Publicacion P
    INNER JOIN Municipio M ON P.Municipio = M.Municipio_id
    INNER JOIN Estado E ON M.Estado = E.Estado_id
    LEFT JOIN Calificacion C ON P.Publicacion_id = C.PubliCalif
GROUP BY 
    M.Municipio_id, M.NombreM, E.NombreE
ORDER BY 
    TotalPublicaciones DESC
LIMIT 5;

SELECT * FROM Vista_TopMunicipiosPublicaciones;

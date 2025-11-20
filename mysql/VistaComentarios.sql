USE BooDB;  
CREATE VIEW VW_Comentario
AS
SELECT C.Comentario_id, C.AutorComent, U.Foto, C.TextoComent, C.PubliComent, C.fechaComent
FROM Comentario AS C
JOIN Usuario AS U
ON C.AutorComent = U.NombreUsu; 
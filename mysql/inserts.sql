USE BooDB; 
Insert into Categoria (NombreC) values ('Misterio'), ('Aliens'),  ('Brujeria'),  ('Leyendas'),  ('Conspiraciones'),  ('Creepypasta'), ('Fantasmas'); 

Insert into Publicacion (Autor, Titulo, TextoPubli, Categoria, Etiqueta) values ("juan1234", "Chilaquiles", "Te gustan mas los chilaquiles verdes o los rojos? Eso dice mucho de una persona", 
5, "Pregunta"); 
Insert into Publicacion (Autor, Titulo, TextoPubli, Categoria, Etiqueta) values ("juan1234", "Webo", "Hay una leyenda que dice que si comes mas de 80 webos se aparece una gallina enojada, 
se escucha el cacareo de la gallina y jamas vuelves a ser visto,solo queda un huevo en tu lugar", 5, "Local"), 
("pablo1234", "La cancion que puedes escuchar solo 1 vez", "Estaba en internet, buscando musica nueva para escuchar en lo que parecia ser una noche larga gracias a mi insomnio, estaba harto de 
repetir la misma playlist una y otra vez, de las mismas canciones populares que sonaban en la radio o que estaban en tendencia, asi que empece a buscar en los rincones mas escondidos del internet", 
6, "Musica"); 

Update Publicacion 
SET Categoria=4
WHERE Publicacion_id = 2; 

UPDATE Publicacion 
SET TextoPubli ="Estaba en internet, buscando musica nueva para escuchar en lo que parecia ser una noche larga gracias a mi insomnio, estaba harto de 
repetir la misma playlist una y otra vez, de las mismas canciones populares que sonaban en la radio o que estaban en tendencia, asi que empece a buscar en los rincones mas escondidos del internet, 
estuve por horas escuchando canciones de personas con 100 visitas, 50, 30 ... cada vez menos conocidas, algunas eran pesimas, otras estaban bien pero no lo suficiente para volver a buscarlas, y otras
casi lograban que me sintiera feliz por mi insomnio, asi estuve unas cuantas horas hasta que llegue a una cancion espacial, una vez mas por curiosidad revise la cantidad de visitas que tenia el video
en youtube, frunci el ceño con confusion al ver que tenia numeros negativos, 'abra de ser un error' pense"
WHERE Autor="pablo1234";

INSERT INTO Calificacion (Calif, AutorCalif, PubliCalif) VALUES (5, "andrea1234", 1), (3, "juan1234", 1), (2, "juana12345", 1), (5, "pablo1234", 1),(4, "vnfkbdvnd", 1); 
INSERT INTO Calificacion (Calif, AutorCalif, PubliCalif) VALUES (3, "andrea1234", 2), (2, "juan1234", 2), (5, "juana12345", 2), (4, "pablo1234", 2),(3, "vnfkbdvnd", 2); 
INSERT INTO Calificacion (Calif, AutorCalif, PubliCalif) VALUES (4, "andrea1234", 3), (4, "juan1234", 3), (1, "juana12345", 3), (1, "pablo1234", 3),(2, "vnfkbdvnd", 3); 
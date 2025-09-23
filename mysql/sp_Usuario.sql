USE BooDB; 
DELIMITER $$
CREATE PROCEDURE sp_Usuario (
op int,
pnombreU varchar(100), 
pcorreo varchar(255), 
ppassW varchar(255)
)
BEGIN 
	#REGISTRO
	IF op = 1 THEN
		INSERT INTO Usuario (NombreUsu,Correo,Pssword) values (pnombreU,pcorreo,ppassW ); 
	END IF;

	#INICIO DE SESION 
	IF op = 2 THEN
		SELECT NombreUsu FROM Usuario 
		WHERE NombreUsu = pnombreU AND Pssword = ppassW AND EstadoUsu = 0;
	END IF;
END $$
DELIMITER ;

CALL sp_Usuario(2, 'pablo23', null, 'perrito')

USE BooDB; 
DELIMITER $$
CREATE PROCEDURE sp_Usuario (
op int,
pnombreU varchar(100), 
pcorreo varchar(255), 
ppassW varchar(255)
)
BEGIN 
declare nombreU varchar(100); 
declare correo varchar(255); 
declare passW varchar(255); 
SET nombreU= TRIM(pnombreU); 
SET correo= TRIM(pcorreo); 
SET passW= TRIM(ppassW);

	#REGISTRO
	IF op = 1 THEN
		INSERT INTO Usuario (NombreUsu,Correo,Pssword) values (nombreU,correo,passW ); 
	END IF;

	#INICIO DE SESION 
	IF op = 2 THEN
		SELECT NombreUsu FROM Usuario 
		WHERE NombreUsu = nombreU AND Pssword = passW AND EstadoUsu = 0;
	END IF;
END $$
DELIMITER ;
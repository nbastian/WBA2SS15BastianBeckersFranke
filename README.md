# WBA2SS15BastianBeckersFranke

How to start that stuff:

  1. **Installation von Node.js**

     Node.js installieren mittels [nodejs.org](http://nodejs.org)
     
  2. **Module für Dienstgeber**
    
     Terminal im Dienstgeber-Ordner befindlich Befehl `npm install` ausführen
  3. **Module für Dienstnutzer**
     
     Terminal im Dienstnutzer-Ordner befindlich Befehl `npm install` ausführen
  4. **Datenhaltung aktivieren**

     Datenhaltung in gesonderten Tab in der Konsole mit `redis-server` starten			
  5. **Dienstgeber aktivieren**
     
     Dienstgeber in gesondertem Tab in der Konsole mit `node main.js` starten		 
  6. **Testdatensätze in Datenbank**
     
     Befüllen der Datenbank durch Aufrufen (GET) auf [localhost:1337/initdemo](http://localhost:1337/initdemo)	
  7. **Dienstnutzer aktivieren**
     
     Dienstnutzer in gesondertem Tab in der Konsole mit `node dienstnutzer.js` starten		 
  8. **Aufrufen des Dienstes**
 
     Der Dienst kann nun unter [localhost:1338](http://localhost:1338) aufgerufen werden
  9. **Einloggen**
  
     Einloggen mit dem Account
      * _Einfacher Nutzer_
        * Name: Franky			
        * Passwort: test123	

      * _Firma_
	* Name: PollerWiesen GmbH
	* Passwort: test123 

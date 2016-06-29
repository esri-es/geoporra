var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
//var db = new sqlite3.Database('file.sqlite');
var Tables  = require('./tables.js');
var ArcNode = require('arc-node');
var config = require("./config.json");
var defer = require("node-promise").defer,
    qs = require('qs');

service = new ArcNode(config);
 
var tables = new Tables();
db.serialize(function() {
  console.log(tables.votos())
  db.run(tables.votos());
 
  service.getToken().then(function(response){
    var options = {
      serviceUrl: config.feature_service,
      query: {
        f: 'json',
        where:  '1 = 1',
        outFields: 'OBJECTID, Cod_mun, Cod_prov, Cod_ccaa, PP_cree, PSOE_cree, CIUDADANOS_cree, UNIDOSPODEMOS_cree, OTRO_cree, PP_quiere, PSOE_quiere, CIUDADANOS_quiere, UNIDOSPODEMOS_quiere, OTRO_quiere',
        returnGeometry: false
      }
    };

    service.getFeatures(options).then(function(res){
      if(res.error && res.error.code === 400){
        console.log("\nError: ".red, res.error.message);
        //console.log("\nQuery: ".red, options.query);
        options.query.f = "html";
        console.log("\nQuery: ".red, options.serviceUrl + "/query?" + qs.stringify(options.query));
        return 0;
      }else{
        console.log(res);
        // Load features in a DB in memory
        var stmt = db.prepare("INSERT INTO votos VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        res.features.forEach(function(elem, i){
          stmt.run(
              elem.attributes.OBJECTID,
              elem.attributes.Cod_mun,
              elem.attributes.Cod_prov,
              elem.attributes.Cod_ccaa,
              elem.attributes.PP_cree,
              elem.attributes.PSOE_cree,
              elem.attributes.CIUDADANOS_cree,
              elem.attributes.UNIDOSPODEMOS_cree,
              elem.attributes.OTRO_cree,
              elem.attributes.PP_quiere,
              elem.attributes.PSOE_quiere,
              elem.attributes.CIUDADANOS_quiere,
              elem.attributes.UNIDOSPODEMOS_quiere,
              elem.attributes.OTRO_quiere
            );
        });

        stmt.finalize(countVotes);
        //SELECT Cod_mun, SUM(PP_cree), SUM(PSOE_cree), SUM(CIUDADANOS_cree), SUM(UNIDOSPODEMOS_cree), SUM(CIUDADANOS_cree), SUM(OTRO_cree) FROM votos GROUP BY Cod_mun

        /*.then(function(results){
          console.log("Results Cod_mun:", results);
        });*/

        
        //}, 3000)
      

        
      }

/*
      countVotes(db, "Cod_prov").then(function(results){
        console.log("Results Cod_prov:", results);
      });
      
      countVotes(db, "Cod_ccaa").then(function(results){
        console.log("Results Cod_ccaa:", results);
      });*/
      
      
      
      

    });
  });
  /*
  stmt.finalize();
 
  db.each("SELECT rowid AS id, * FROM votos", function(err, row) {
      console.log(row);
  });

  
  });*/
});

function countVotes(){
  var fields;
limit= "Cod_mun";
  

  switch(limit){
    case 'Cod_mun': fields = "Cod_mun"; break;
    case 'Cod_prov': fields = "Cod_prov, Cod_ccaa"; break;
    case 'Cod_ccaa': fields = "Cod_ccaa"; break;
  }

  var results = [];
  console.log("Empiezo "+limit+"!");
  // Return count for each mun
  db.all("SELECT " + fields + ", SUM(PP_cree), SUM(PSOE_cree), SUM(CIUDADANOS_cree), SUM(UNIDOSPODEMOS_cree), SUM(CIUDADANOS_cree), SUM(OTRO_cree) FROM votos GROUP BY " + fields, function(err, rows) {
    //db.all("SELECT " + fields + " FROM votos", function(err, rows) {
      // Returns for each mun -> { Cod_mun: 0, Cod_prov: 3, Cod_ccaa: 4, 'COUNT(*)': 2 }
      rows.forEach(function (row) {
        results.push(row);
        console.log(limit+": ",row);
      });
  });

  db.close();

  //return deferred;
/*
  // Return count for each prov
  db.each("SELECT Cod_prov, Cod_ccaa, COUNT(*) FROM votos GROUP BY Cod_prov, Cod_ccaa", function(err, row) {
      // Returns for each mun -> { Cod_mun: 0, Cod_prov: 3, Cod_ccaa: 4, 'COUNT(*)': 2 }
      console.log(row);
  });

  // Return count for each ccaa
  db.each("SELECT Cod_ccaa, COUNT(*) FROM votos GROUP BY Cod_ccaa", function(err, row) {
      // Returns for each mun -> { Cod_mun: 0, Cod_prov: 3, Cod_ccaa: 4, 'COUNT(*)': 2 }
      console.log(row);
  }*/
 
}
module.exports = function Tables(){
  this.votos = function(){
    return "CREATE TABLE votos (" +
        "OBJECTID NUM," +
        "Cod_mun INT," +
        "Cod_prov INT," +
        "Cod_ccaa INT," +
        "PP_cree INT," +
        "PSOE_cree INT," +
        "CIUDADANOS_cree INT," +
        "UNIDOSPODEMOS_cree INT," +
        "OTRO_cree INT," +
        "PP_quiere INT," +
        "PSOE_quiere INT," +
        "CIUDADANOS_quiere INT," +
        "UNIDOSPODEMOS_quiere INT," +
        "OTRO_quiere INT" +
      ")";
  }
};
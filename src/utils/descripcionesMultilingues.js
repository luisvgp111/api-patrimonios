const IDIOMAS_INDIGENAS = require("../constants/idiomasIndigenas");

const normalizarDescripcionesMultilingues = (datos) => {
  const campos = ["descripcion_en", "descripcion_indigena", "idioma_indigena"];

  for (const campo of campos) {
    if (typeof datos[campo] !== "string" && datos[campo] != null) {
      return "Las descripciones y el idioma deben enviarse como texto";
    }
    if (
      typeof datos[campo] === "string" &&
      (campo === "idioma_indigena"
        ? !datos[campo].trim()
        : !/<img\b/i.test(datos[campo]) &&
          !datos[campo]
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/gi, " ")
            .trim())
    ) {
      datos[campo] = null;
    }
  }

  const descripcionIndigena = datos.descripcion_indigena;
  const idiomaIndigena = datos.idioma_indigena;
  if (descripcionIndigena && !idiomaIndigena) {
    return "Selecciona la lengua originaria para su descripción";
  }
  if (idiomaIndigena && !IDIOMAS_INDIGENAS.includes(idiomaIndigena)) {
    return "La lengua originaria seleccionada no es válida";
  }
  if (idiomaIndigena && !descripcionIndigena) {
    return "Agrega la descripción de la lengua originaria seleccionada";
  }
  return null;
};

module.exports = normalizarDescripcionesMultilingues;

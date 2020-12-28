# AstraSolaris3D
Modelo virtual del Sistema Solar

## Objetivos
Este proyecto intenta crear un modelo del sistema solar científicamente preciso y lo más completo posible.
El modelo contiene una representación fidedigna de las siguentes listas de objetos:

1. El Sol
2. Planetas
3. Planetas enanos y asteroides
3. Satélites (lunas)
4. Cuerpos menores.
  a. Asteroides
  b. Cometas
  c. Objetos del cinturón de Kuiper
  d. Meteoroides

Además de estos, se modelarán otros fenómenos como los capos magnéticos planetarios, y las estrellas cercanas.

Este repositorio contiene dos archivos por cada una de las categorías mostradas, uno con la terminación run y otro con la terminación info. (p ej. dwarf_planets_run.csv y dwarf_planets_info.csv). El archivo _run_ contiene la información necesaria para que el motor gráfico de Astra Solaris pueda generar el objeto dentro del escenario 3D, mientras que el archivo _info_ contiene la información que será mostrada al los usuarios relativa a ese objeto.

La carpeta apps contiene el código fuente de las funciones utilizadas para fines específicos (simulación de efectos físicos, interpretación de instrucciones especiales, generación de geometría de referencia, etc.) Información más específica sobre estas funciones se puede contrar en los documentos wiki.

La versión de prueba del modelo se encuentra en en www.astrasolaris.org/solarsystem

## Cómo colaborar

Las modificaciones a los archivos se pueden hacer directamente en la plataforma o enviándolas desde un reposiorio local. Deben hacerse a la rama Develop. Después de ser revisadas, cada cierto tiempo se hará la fusión de la rama Develop a la rama Master, y los cambios quedarán disponibles en el modelo en línea.




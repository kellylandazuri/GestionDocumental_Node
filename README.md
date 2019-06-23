# GestionDocumental_Node

Trabajo modular del CRM
Se expondrán servicios referentes a la Gestión Documental de un CRM Básico.
Se desarrolla en Node.js utilzando la base de datos NoSQL DynamoDB.

## Guia de Documentación

Todo documento debe de estar escrito en español.
Separar los documentos en las carpetas adecuadas:
  Archivos complementarios.
  Archivos de documentos referentes al proyecto, subdivididos en carpetas específicas.

## Guía de Código
El código deberá ser realizado en Ingles.
Las constantes son completamente en mayúscula y hace uso de snake_case (HOLA_MUNDO).
Las clases y atributos son sustantivos.

## Alcance de Proyecto

- El módulo debe ser independiente de todos los demás módulos.
- Los documentos deben ser guardados en Amazon S3.
- La información de los documentos y carpetas se guardarán en DynamoDB.
- Es permitido subir, descargar, actualizar y eliminar archivos.
- Se tiene un versionamiento de documentos.
- Un documento puede ser revertido a una versión anterior.
- Existe el acceso y manejo de permisos
- La persona responsable de la creación de un archivo es la única que puede restaurar las versiones anteriores.
- Se puede crear y eliminar* carpetas. Solo se eliminan carpetas si están vacías.
- Se realizar.á la API y la interfaz de gestión documental
- Esta API tendrá interacción con todo el sistema documental y los demás módulos interactúan con la API, la base de la misma generando relaciones con su módulo.
- Un documento eliminado puede ser recuperado, ya que se lo pone en una papelera.
- Una vez eliminado el documento de la carpeta papelera, todas sus versiones serán eliminadas y el documento será completamente eliminado
- No se podrá eliminar versiones de un documento de manera independiente. Si se elimina el documento, también se eliminan todas las versiones.
- Al eliminar una carpeta padre, todos los documentos dentro de esta y los carpetas hijas con sus respectivos documentos son igualmente eliminadas.

## Servicios y Costos

Se haran uso de los siguientes servicios en la nube:

- Una instancia on-demand de EC2 de tipo: Linux a1.large. El coste sera de un 15 dolares en el mes para un uso bajo.

- Una unidad de EBS de 10 GB de tipo gp2. El coste sera de unos 2 dolares en el mes.

- Uso de servicio de DynamoDB con una capacidad de 250MB y una posible cantidad de un 1 millon de operaciones al mes. El costo sera de una 8 dolares en el mes.

Todos los costos se estimaron con Montly Cost Calculator de AWS.

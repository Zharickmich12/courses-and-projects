### Solana y su ecosistema web3

- Una blockchain, o cadena de bloques, es una forma de mantener un registro de operaciones entre computadoras que siguen reglas comunes. Estas operaciones se agrupan en bloques enlazados mediante criptografía.
- En una blockchain pública, distintas personas pueden consultar y verificar la actividad de la red. El registro se mantiene de forma distribuida: su funcionamiento involucra múltiples computadoras, llamadas nodos.
- Un bloque agrupa operaciones y se vincula con la historia anterior mediante referencias criptográficas. Para entender esta idea, podemos pensar en un hash como una huella calculada a partir de unos datos: si los datos cambian, la huella también cambia.
- Los enlaces entre bloques permiten detectar alteraciones. Además, las reglas de la red y los mecanismos de consenso dificultan que alguien sustituya por su cuenta una historia ya aceptada.
- El consenso es el mecanismo mediante el cual los participantes de la red acuerdan qué operaciones y qué versión del registro aceptan como válidas. Tener varias copias de una base de datos, por sí solo, no resuelve ese acuerdo.
- La descentralización se refiere a cómo se reparte el control entre participantes. Una empresa puede tener datos distribuidos en muchos servidores y conservar todo el control. Por eso, al analizar una red, también debemos preguntar quién puede validar, aplicar las reglas o tomar decisiones sobre su funcionamiento.

### Ejemplo: el registro de ventas de una cafetería
Imagina que una cafetería registra estas operaciones:
Venta de un café por 50 unidades.
Venta de un té por 35 unidades.
Corrección de un registro capturado por error.
Si utiliza una base de datos administrada por la cafetería, las personas con permisos pueden actualizar sus registros. También pueden existir respaldos, controles de acceso y auditorías, pero esas reglas dependen del sistema y de su administración.
En un registro basado en blockchain, una corrección se expresa mediante una nueva operación permitida por las reglas del programa. El estado actual puede cambiar, conservando la historia que explica cómo se llegó a él.
Por eso conviene distinguir entre historial de operaciones y estado actual. El saldo de una cuenta puede cambiar; eso no significa que se haya borrado la operación que produjo su saldo anterior.
Tres ideas que debemos conservar
- Distribución: el registro y su validación involucran múltiples participantes.
- Verificabilidad: existen reglas y evidencia para revisar las operaciones aceptadas.
- Resistencia a alteraciones: cambiar unilateralmente la historia aceptada resulta difícil bajo el funcionamiento normal de la red.
Una blockchain registra lo que sus reglas permiten aceptar. Si alguien introduce información incorrecta sobre el mundo real, registrarla en la red no la vuelve verdadera. Tampoco debemos asumir que los datos públicos son privados: las direcciones y sus operaciones pueden ser observables.

### De Web2 a Web3: ¿qué cambia en una aplicación?
Web2 suele referirse a aplicaciones en las que podemos leer, publicar e interactuar, mientras una organización administra la plataforma y sus servicios. Una tienda en línea o una red social son ejemplos cotidianos.
Web3 reúne enfoques que incorporan redes como blockchain para gestionar activos, permisos o registros compartidos. Una aplicación puede utilizar una wallet para autorizar operaciones y programas en la red para aplicar parte de sus reglas.
La diferencia se entiende mejor preguntando quién administra los datos, quién puede autorizar cambios y cómo se comprueba una operación.
| Pregunta | Aplicación Web2 habitual | Aplicación con componentes Web3 |
|---|---|---|
| ¿Cómo se identifica o autoriza a una persona? | Mediante una cuenta y los mecanismos definidos por la plataforma. | Puede utilizar una wallet y firmas digitales. |
| ¿Dónde se mantiene la información? | En servicios y bases de datos administrados por la organización o sus proveedores. | Parte puede estar en blockchain y parte en servicios externos. |
| ¿Cómo se comprueba una operación? | Consultando los registros o comprobantes del servicio. | La parte registrada en la red puede verificarse de forma independiente. |
Una aplicación puede combinar ambos enfoques. Por ejemplo, una cafetería podría mantener su menú y las fotografías en un servidor, mientras registra determinadas operaciones en Solana.
La elección depende del problema. Compartir un registro entre organizaciones o permitir que distintas aplicaciones consulten el mismo activo puede justificar usar blockchain. Mantener notas internas de un negocio puede resolverse con una base de datos convencional.

### ¿Qué es Solana y qué integra su ecosistema?
Solana es una blockchain pública sobre la que se pueden transferir activos y ejecutar programas. Está diseñada para procesar operaciones con rapidez y comisiones bajas, características útiles para aplicaciones con interacciones frecuentes.
Los validadores son participantes que ejecutan software de la red, procesan operaciones y contribuyen al consenso. Cuando usamos una aplicación, su interfaz nos permite solicitar acciones; los validadores verifican y procesan esas solicitudes de acuerdo con las reglas de Solana.

### Solana y SOL
Solana es la red; SOL es su activo nativo. Entre sus usos está pagar las comisiones de las transacciones. Por eso, interactuar con un programa puede requerir SOL aunque la operación no sea un pago entre personas.
En nuestro punto de venta, registrar una venta y pagar la comisión de esa transacción son dos cosas diferentes. Registrar un importe en un programa tampoco implica que ese programa haya cobrado ese importe al cliente.
Alrededor de la red existen herramientas y aplicaciones que cumplen funciones distintas:
| Componente | ¿Para qué sirve? | Ejemplo en nuestro aprendizaje |
|---|---|---|
| Wallet | Permite gestionar claves y autorizar operaciones. | Firmar una solicitud para interactuar con la red. |
| Aplicación o dApp | Ofrece una interfaz para utilizar funciones de la red. | Una pantalla para consultar o registrar ventas. |
| Programa | Define reglas que se ejecutan en Solana. | Validar una operación del punto de venta. |
| Explorador | Permite consultar cuentas y transacciones. | Revisar el resultado de una operación. |
| Herramientas de desarrollo | Ayudan a escribir, compilar y probar programas. | Solana Playground, que utilizaremos más adelante. |
Los casos de uso incluyen pagos, servicios financieros, juegos, activos coleccionables y herramientas para comunidades. Un token puede representar un activo o derecho definido por su proyecto; un NFT puede identificar un activo digital único.

### Wallets, direcciones públicas y firmas digitales
Una wallet es una herramienta para interactuar con la red y gestionar los mecanismos con los que autorizamos operaciones. Nos permite consultar saldos y firmar solicitudes.
Los activos y sus registros están en la blockchain. La wallet nos muestra esa información y gestiona las claves que permiten utilizarlos.
Conviene distinguir tres elementos:
- Dirección pública: identifica una cuenta. En el caso de una wallet convencional, corresponde a una clave pública. Puedes utilizarla para recibir activos o consultar actividad.
- Clave privada: permite generar firmas. Debe mantenerse secreta.
- Frase de recuperación: en las wallets que la utilizan, permite recuperar las claves. Debe protegerse como un acceso a la wallet.
> [!NOTE]
> Una firma digital permite verificar que quien controla una clave privada firmó unos datos concretos. Si esos datos cambian, la firma deja de ser válida para ellos. La verificación utiliza la clave pública, sin revelar la privada.
Ejemplo: autorizar un registro
La encargada de la cafetería solicita registrar una operación. La aplicación prepara una transacción y la wallet permite revisarla y firmarla. El programa deberá comprobar además si esa persona tiene el permiso que exige la operación.
Firmar y tener permiso dentro de una aplicación son conceptos relacionados, pero distintos. Una firma demuestra control de una clave; las reglas del programa determinan qué puede hacer ese firmante.
También conviene distinguir estas acciones:
- Conectar una wallet: permite que una aplicación conozca su dirección y solicite acciones; por sí solo no firma una transacción.
- Firmar un mensaje: firma unos datos; no equivale, por sí solo, a ejecutar una transacción en Solana.
- Firmar una transacción: autoriza una solicitud concreta que puede enviarse a la red.
Antes de aprobar una solicitud, revisa su origen y lo que pide autorizar. Una dirección pública sirve para consultar actividad; una clave privada o una frase de recuperación nunca son necesarias para buscar una operación en el explorador.

### Mainnet, Devnet y Testnet
Solana tiene distintas redes, también llamadas clusters. Cada una mantiene su propio estado: saldos, programas y operaciones.
| Red | Uso principal | Activos utilizados |
|---|---|---|
| Mainnet | Aplicaciones y operaciones en producción. | SOL y otros activos reales. |
| Devnet | Desarrollo y pruebas de aplicaciones. | SOL de prueba, sin valor monetario. |
| Testnet | Pruebas del software de la red, estabilidad y comportamiento de validadores. | Activos de prueba, sin valor monetario. |
Una misma dirección puede consultarse en distintas redes y mostrar resultados diferentes. Tener SOL de prueba en Devnet no significa tener SOL en Mainnet.
Por eso, antes de interpretar un saldo o buscar una transacción, verifica qué red está seleccionada. Si una operación existe en Devnet y la buscas en Mainnet, el explorador no la encontrará allí.

### Cuentas, programas e instrucciones
Estos tres conceptos explican cómo se organiza una aplicación en Solana.
- Cuentas: dónde se mantiene el estado
Una cuenta es una unidad de almacenamiento de Solana identificada por una dirección. Puede mantener un saldo de SOL y datos. El término abarca más que la cuenta de una persona: también existen cuentas para datos de aplicaciones y para código ejecutable.
Llamamos estado a los valores que una aplicación mantiene en un momento determinado. En nuestro ejemplo, podría ser el total registrado por una tienda.
- Programas: las reglas de la aplicación
Un programa contiene código que se ejecuta en Solana. También encontrarás el término smart contract o contrato inteligente.
El código del programa y los datos que modifica están separados. El estado de la aplicación se guarda en cuentas de datos; el programa recibe las cuentas necesarias para realizar una operación.
Por ejemplo, el programa del punto de venta podría definir cómo registrar un importe y quién tiene permiso para hacerlo. La cuenta de datos mantendría el total resultante.
- Instrucciones: qué operación se solicita
Una instrucción pide ejecutar una operación de un programa. Especifica el programa que debe atenderla, las cuentas que utilizará y los datos necesarios.

Si queremos registrar una venta de 50 unidades, podemos identificar:
- Programa: el punto de venta que contiene las reglas.
- Cuentas: las que se necesitan para consultar permisos y actualizar el registro.
- Datos de la instrucción: la operación solicitada y el importe de 50.
| Concepto | Pregunta que responde | En el ejemplo de la cafetería |
|---|---|---|
| Cuenta de datos | ¿Dónde están los valores actuales? | En el registro que mantiene el total de ventas. |
| Programa | ¿Qué reglas se aplican? | Las que determinan cómo se registra una venta. |
| Instrucción | ¿Qué acción se pide? | Registrar una venta por 50 unidades. |

### Transacciones: enviar operaciones y comprobar su resultado
Una transacción agrupa una o más instrucciones para que la red las procese. Incluye las firmas requeridas para autorizarlas.
Las instrucciones de una misma transacción se ejecutan en conjunto: si alguna falla, se revierten los cambios de estado de todas. Esta propiedad se llama atomicidad. Una transacción procesada que falla puede cobrar comisión aunque sus cambios se reviertan.
- Ejemplo de atomicidad
Imagina una aplicación que incluye dos instrucciones en una misma transacción:
Registrar una venta.
Actualizar otro registro relacionado.
Si la segunda instrucción falla, tampoco queda aplicado el cambio de la primera. Para que esto ocurra como una sola operación atómica, ambas deben estar dentro de la misma transacción.
- ¿Toda transacción es un pago?
Una transacción también puede crear una cuenta o modificar datos. Por ejemplo, actualizar un registro del punto de venta puede generar una transacción sin transferir al negocio el importe de la venta.
Consultar información pública existente, como un saldo, normalmente se realiza mediante una lectura de la red. Esa consulta no requiere enviar una transacción firmada ni pagar una comisión de transacción.

### ¿Qué nos muestra un explorador?
Un explorador de bloques presenta información de la red para que podamos inspeccionarla. En una transacción sencilla buscaremos:
- Identificador o signature: permite localizar la transacción. No es la dirección de una wallet.
- Resultado: indica si la ejecución fue exitosa o falló.
- Confirmación: indica el nivel de confirmación alcanzado; es diferente del resultado de ejecución.
- Cuentas participantes: direcciones utilizadas por la operación.
- Programas e instrucciones: qué programas se invocaron y qué acciones se solicitaron.
- Comisión o fee: cuánto costó procesarla.
- Una operación puede estar finalizada y haber fallado: la red ha asentado ese resultado fallido. Confirmación y éxito responden preguntas diferentes.
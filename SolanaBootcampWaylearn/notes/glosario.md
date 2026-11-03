### Glosario

### Blockchain y ecosistema Web3
**Aplicación descentralizada / dApp:** aplicación que utiliza programas y datos de una blockchain para parte de su funcionamiento. Puede combinar una interfaz web y servicios externos con lógica ejecutada en la red.
**Blockchain:** registro compartido entre participantes de una red, organizado mediante bloques y referencias criptográficas. Sus reglas permiten verificar las operaciones aceptadas y dificultan alterar unilateralmente su historial.
**Bloque:** conjunto de operaciones y datos que forma parte del registro de una blockchain y se vincula con su historia anterior.
**Consenso:** mecanismo por el que los participantes de una red acuerdan qué operaciones y qué versión del registro aceptan como válidas.
**Descentralización:** distribución de funciones y control entre varios participantes. Su grado depende de cómo se organiza y opera un sistema.
**Hash:** huella de tamaño fijo calculada a partir de datos. Permite detectar cambios al comparar el resultado; no es un mecanismo para cifrar y después recuperar el contenido original.
**NFT / token no fungible:** activo digital identificable de manera individual, utilizado para representar elementos como coleccionables, membresías o credenciales. Lo que permite hacer depende de su implementación.
**Nodo:** equipo o instancia de software que participa en una red blockchain. Su función depende del tipo de nodo y de la configuración que utilice.
**SOL:** activo nativo de Solana, utilizado para pagar comisiones y aportar los fondos necesarios al crear cuentas, entre otros usos. El SOL de Devnet es de prueba.
**Solana:** blockchain pública que permite transferir activos y ejecutar programas sobre un estado compartido, de acuerdo con las reglas de la red.
**Token:** activo digital cuya emisión, propiedad y operaciones se representan mediante programas y cuentas en una blockchain. Puede tener distintos usos y reglas.
**Validador:** participante que ejecuta software para verificar y procesar operaciones y contribuir al consenso de la red.
**Web2:** término utilizado para describir servicios de internet donde las cuentas, los datos y las reglas dependen principalmente de plataformas y servidores administrados por organizaciones.
**Web3:** término amplio para aplicaciones que incorporan tecnologías como blockchains, wallets y activos digitales, permitiendo verificar y compartir parte de sus datos y reglas fuera de una plataforma única.

### Wallets, identidades y redes
**Airdrop de Devnet:** envío de SOL de prueba a una dirección para realizar actividades de desarrollo. En este bootcamp utilizamos el término con ese propósito.
**Clave privada:** información secreta que permite generar firmas para una identidad criptográfica. Quien puede utilizarla puede autorizar operaciones como esa identidad.
**Cluster:** conjunto de nodos que participa en una misma red de Solana y mantiene su propio estado. Mainnet, Devnet y Testnet son clusters diferentes.
**Devnet:** red de Solana destinada a desarrollar y probar aplicaciones con SOL de prueba. Es la red que utilizamos en Foundations.
**Dirección pública:** identificador con el que localizamos una cuenta en una red. En una wallet basada en un par de claves corresponde a su clave pública; una PDA también tiene dirección, pero no clave privada.
**Faucet:** servicio que distribuye fondos de prueba para utilizar una red de desarrollo. Puede establecer límites de solicitudes y disponibilidad.
**Firma digital:** resultado criptográfico que permite verificar que una identidad firmó un mensaje o una transacción y que su contenido no fue alterado después de firmarse.
**Frase de recuperación / seed phrase:** conjunto de palabras que permite recuperar las claves de una wallet compatible. Es información secreta, diferente de las seeds utilizadas para derivar una PDA.
**Mainnet:** red utilizada para operar aplicaciones y activos con valor real. En las herramientas de Solana puede aparecer como Mainnet Beta o mainnet-beta.
**Signer / firmante:** identidad cuya firma se requiere y verifica para una operación. En Anchor, `Signer<'info>` exige que la cuenta haya firmado; los permisos adicionales dependen de las reglas del programa.
**Testnet:** red utilizada principalmente para probar versiones y funcionamiento del software de la red Solana. Tiene un propósito distinto de Devnet, orientada al desarrollo de aplicaciones.
**Wallet:** herramienta que administra claves o acceso a firmas y permite interactuar con una blockchain. Los saldos y datos de las cuentas se registran en la red.

### Cuentas, programas y transacciones
**Atomicidad:** propiedad por la que las instrucciones de una transacción se aplican todas o se revierten si alguna falla. Una transacción fallida que llega a procesarse puede cobrar comisión.
**Autoridad / authority:** identidad a la que una aplicación concede permiso para realizar determinadas acciones. En nuestro registro de ventas se guarda en el campo `owner` y se compara con el firmante.
**Comisión / fee:** costo de procesar una transacción. Pagar la comisión de registrar una venta es diferente de cobrar al cliente el importe guardado en el registro.
**Confirmación:** nivel con el que la red ha asentado el resultado de una transacción. Es diferente de su éxito: una transacción puede estar finalizada y tener un resultado fallido.
**Cuenta / account:** unidad de almacenamiento de Solana, identificada por una dirección. Puede contener saldo en lamports, datos y metadatos, como su programa propietario.
**Estado / state:** datos que una aplicación conserva y que pueden cambiar mediante operaciones válidas. En el ejemplo incluye el contador de clientes y sus historiales de ventas.
**Instrucción / instruction:** solicitud para ejecutar una operación de un programa. Identifica el programa, las cuentas participantes y los datos que necesita para realizarla.
**Lamport:** unidad mínima de SOL. Un SOL equivale a 1 000 000 000 de lamports; los saldos de las cuentas se expresan en esta unidad.
**Logs:** mensajes que se producen durante la ejecución de un programa y ayudan a interpretar lo ocurrido. También pueden aparecer al simular una transacción.
**Off-chain:** información o procesamiento que ocurre fuera de la blockchain, por ejemplo en una interfaz, una base de datos o un servicio externo.
**On-chain:** información registrada o lógica ejecutada en la blockchain de acuerdo con sus reglas.
**Owner de una cuenta:** programa propietario indicado en los metadatos de una cuenta de Solana, que controla la modificación de sus datos según las reglas de la red. Es distinto del campo `owner` que nuestro programa utiliza para guardar la autoridad del negocio.
**Programa / program:** lógica desplegada en Solana que procesa instrucciones y opera sobre las cuentas recibidas. También suele llamarse contrato inteligente o smart contract.
**Program ID:** dirección que identifica un programa desplegado. El cliente la utiliza para dirigir sus instrucciones al programa correspondiente.
**Simulación:** ejecución de prueba de una transacción contra un estado de la red, sin publicarla. Permite observar resultados y errores antes del envío.
**Transacción / transaction:** solicitud firmada que agrupa una o varias instrucciones para que la red las procese de forma atómica. Una consulta habitual de datos mediante RPC no requiere enviar una transacción.
**Transaction signature:** identificador utilizado para buscar una transacción en Solana, basado en su primera firma. También puede aparecer como signature, firma o hash de transacción en las herramientas.

### Anchor y lectura del programa
**Anchor:** framework que proporciona macros, herramientas y clientes para desarrollar programas en Solana. Ayuda a declarar instrucciones, datos y validaciones de cuentas.
**Bump:** valor adicional utilizado como semilla para obtener una PDA válida. El cliente y el programa deben utilizar una derivación coherente para localizar y validar la misma dirección.
**Constraint / restricción de cuenta:** condición que Anchor comprueba sobre una cuenta recibida, por ejemplo su dirección o su relación con otra cuenta.
**Context:** tipo de Anchor con el que una instrucción accede a las cuentas que recibe y a información asociada a su ejecución. En el código puede aparecer como `Context<ModificarVenta>`.
**Error personalizado:** error definido por el programa para identificar el motivo de un rechazo. En la práctica utilizamos `NoOwner` para autoridad incorrecta y añadimos `MontoInvalido` para monto cero.
**IDL / Interface Definition Language:** descripción de las instrucciones, cuentas y tipos de un programa Anchor. Ayuda al cliente a preparar solicitudes e interpretar sus datos.
**init:** restricción de Anchor que indica la creación e inicialización de una cuenta. Se acompaña de información como quién paga y cuánto espacio necesita.
**`#[account(mut)]`:** declaración con la que Anchor requiere que una cuenta se proporcione con permiso de escritura. Es diferente de `let mut` y de una referencia `&mut` de Rust.
**Payer / pagador:** cuenta que aporta los fondos para una operación concreta, como crear una cuenta. Puede coincidir con la autoridad, aunque ambas funciones tienen propósitos diferentes.
**PDA / Program Derived Address:** dirección derivada de semillas y un Program ID, sin clave privada asociada. Calcularla permite localizar una dirección; crear la cuenta en ella requiere una operación adicional.
**require!:** macro de Anchor que comprueba una condición y devuelve un error si es falsa. En el Día 5 la utilizamos para rechazar un monto igual a cero.
**Seeds / semillas de una PDA:** datos de entrada utilizados para derivar una dirección, como una etiqueta y la clave pública de la autoridad. No son una frase de recuperación de wallet.
**space:** cantidad de bytes que se reserva al crear una cuenta con datos. Debe ser suficiente para almacenar la información que guardará el programa.

### Conceptos y sintaxis de Rust
**Array / arreglo:** colección de elementos del mismo tipo con longitud fija. Por ejemplo, `[100, 250, 75]` contiene tres valores.
**bool:** tipo que admite únicamente `true` o `false`. El número 1 no sustituye a `true` en un campo de ese tipo.
**Borrowing / préstamo:** uso temporal de un valor mediante una referencia, sin tomar su ownership. Rust comprueba las reglas de esos accesos.
**Campo / field:** dato con nombre dentro de una estructura. En `Venta`, `monto` es uno de sus campos.
**Control de flujo:** instrucciones que deciden qué código se ejecuta o repite. Incluye condiciones como `if` y recorridos como `for`.
**Enteros sin signo / u8, u16, u32, u64:** tipos para números enteros desde cero, sin negativos. El número indica los bits utilizados: `u8` admite de 0 a 255 y `u16` de 0 a 65 535.
**enum:** tipo que representa un conjunto de variantes posibles. Puede utilizarse para definir opciones, resultados o errores de un programa.
**Expresión:** código que produce un valor. Una expresión al final de una función puede ser su resultado; añadirle `;` puede cambiar ese comportamiento.
**Función / fn:** bloque de código con nombre que puede recibir parámetros y producir un resultado. En Rust se declara con `fn`.
**let:** palabra utilizada para declarar una variable. Por defecto, la vinculación es inmutable; `let mut` permite modificarla cuando el tipo y las reglas del lenguaje lo permiten.
**Macro:** construcción que genera código a partir de una invocación. En los ejemplos aparecen macros como `println!`, `msg!` y `require!`, además de atributos proporcionados por Anchor.
**Mutabilidad / mut:** posibilidad de modificar un valor a través de una variable o referencia. Por ejemplo, `let mut total = 0` permite actualizar `total`.
**Option&lt;T&gt;:** tipo que representa un valor presente con `Some(valor)` o su ausencia con `None`. `Some(0)` contiene un valor; no significa ausencia.
**Ownership / propiedad en Rust:** reglas que determinan quién posee un valor y cómo se gestiona su memoria. Es un concepto del lenguaje, distinto del owner de una cuenta y de los permisos del negocio.
**Parámetro y argumento:** un parámetro es el nombre que una función declara para recibir un dato; un argumento es el valor proporcionado al llamarla. `monto` puede ser el parámetro y `50`, el argumento.
**Referencia / & y &mut:** forma de acceder a un valor sin tomar su ownership. `&` permite un acceso compartido; `&mut` permite modificarlo con las reglas de acceso exclusivo de Rust.
**Result&lt;T, E&gt;:** tipo que representa éxito con `Ok(valor)` o un error con `Err(error)`. En Anchor, `Result<()>` utiliza el error del framework y expresa éxito sin un valor de retorno adicional.
**Rust:** lenguaje de programación que utilizamos para leer ejemplos básicos y desarrollar la lógica del programa de Solana.
**String y &str:** tipos utilizados para trabajar con texto. `String` posee el contenido que administra; `&str` es una referencia a una porción de texto. No se sustituyen automáticamente en cualquier contexto.
**struct:** tipo que agrupa campos con nombre. En nuestro programa, `Venta` reúne datos como SKU, descripción e importe.
**Tipo de dato:** clasificación que determina qué valores puede representar un dato y qué operaciones admite. Ejemplos: `bool`, `u32` y `String`.
**Variable:** nombre vinculado a un valor para utilizarlo en el código. Su tipo y mutabilidad determinan cómo puede emplearse.
**Vec&lt;T&gt;:** colección de elementos del mismo tipo cuya longitud puede variar. Al guardarla en una cuenta de Solana sigue siendo necesario respetar el espacio disponible y las reglas del programa.

### Herramientas y flujo de desarrollo
**Build / compilación:** proceso que transforma el código fuente en un programa ejecutable para el entorno correspondiente y detecta errores de compilación. No publica por sí mismo el programa en la red.
**Cliente / client:** código que prepara consultas o transacciones para interactuar con un programa. En el proyecto está en `client/client.ts`; es diferente de `Cliente`, la estructura que representa a un cliente del negocio.
**Codespaces:** entorno de desarrollo de GitHub al que se accede desde un editor, con archivos y terminal. Las herramientas disponibles dependen de la configuración del proyecto.
**Deploy / despliegue:** publicación o actualización del programa en una red. Permite que las instrucciones del cliente utilicen la versión desplegada.
**Explorador de bloques / explorer:** herramienta para consultar información de una red, como cuentas, programas y transacciones. Debe estar seleccionado el cluster que utilizaste en la práctica.
**Fork:** copia de un repositorio de GitHub asociada a otra cuenta, que permite conservar cambios y trabajar sobre ellos de forma independiente.
**IDE / entorno de desarrollo integrado:** herramienta que reúne funciones para trabajar con código, como edición, diagnósticos y ejecución. Rust Playground y Solana Playground ofrecen funciones para practicar desde el navegador.
**README:** archivo que presenta un repositorio y explica aspectos como su propósito, estructura y forma de uso.
**Repositorio / repo:** conjunto de archivos de un proyecto y su historial de cambios. Puede alojarse en una plataforma como GitHub.
**RPC / Remote Procedure Call:** mecanismo por el que un cliente consulta información o envía solicitudes a un nodo. La conexión RPC determina a qué red se dirige.
**Rust Playground:** herramienta online para ejecutar ejemplos cortos de Rust. La utilizamos para practicar el lenguaje en el Día 2.
**Solana Playground:** entorno online que utilizamos para editar, compilar, desplegar e interactuar con un programa de Solana.
**Template / plantilla:** base preparada para iniciar un ejercicio o proyecto. Su código y configuración deben corresponder a la actividad que se seguirá.

### Desarrollo asistido por IA

**Asistente de IA:** herramienta que genera respuestas a partir de las instrucciones y el contexto proporcionados. Puede ayudar a explicar código, proponer cambios o interpretar errores; sus respuestas requieren revisión.
**Caso de prueba:** situación concreta con entradas, condiciones y un resultado esperado. En el Día 5 comparamos ventas positivas, monto cero y una identidad sin autorización.
**Contexto de un prompt:** información que permite interpretar una solicitud, como el código actual, el entorno, las restricciones y el resultado observado. Es distinto del tipo `Context` de Anchor.
**Iteración:** repetición del ciclo de solicitar, revisar, modificar y comprobar, utilizando lo observado para ajustar el siguiente paso.
**Prompt:** solicitud dirigida a una IA. En la práctica incluye contexto, objetivo, restricciones y resultados esperados.
**Validación:** comprobación de una condición necesaria para continuar una operación. Por ejemplo, `monto > 0` exige un importe positivo antes de registrar la venta.
**Vibe coding:** forma de trabajar con IA describiendo en lenguaje natural lo que se quiere construir o modificar e iterando sobre sus propuestas. En Foundations lo practicamos con lectura del código y comprobación de sus resultados.
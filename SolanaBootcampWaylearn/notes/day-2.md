### ¿Qué es Rust?
Rust es un lenguaje de programación compilado, diseñado para combinar rendimiento con mecanismos que ayudan a prevenir errores de memoria. Sus reglas permiten detectar muchos problemas antes de ejecutar el código.
Compilar significa revisar el código y traducirlo a un formato que pueda ejecutarse en el entorno de destino. Si hay un error que impide esa traducción, el compilador muestra un diagnóstico. Si la compilación termina correctamente, el programa puede ejecutarse.
En Solana se usa Rust junto con Anchor, un framework que facilita la organización de programas y la validación de sus cuentas.

```rust
fn main() {
    println!("Bienvenid@ al punto de venta");
}
```

fn - indica que estamos definiendo una función.
main - es el punto de entrada de este ejemplo ejecutable.
Las llaves { } delimitan el bloque de código de la función.
println! muestra información en la salida. El signo ! indica que es una macro.
Las comillas dobles delimitan el texto y el punto y coma cierra la instrucción que lo imprime.

### Variables, mutabilidad y tipos de datos
Una variable asocia un nombre con un valor. En Rust usamos let para declararla. También podemos indicar su tipo después de dos puntos:

```rust
fn main() {
    let monto: u64 = 50;
    let caja_abierta: bool = true;

    println!("Monto: {}", monto);
    println!("Caja abierta: {}", caja_abierta);
}
```

- ¿Qué expresa el tipo?
El tipo indica qué clase de dato representa un valor y qué operaciones admite. Rust debe conocerlo al compilar; en muchos casos puede deducirlo.

| Tipo | Qué representa | Ejemplo de uso |
|------|----------------|----------------|
| `u8` | Entero sin signo de 8 bits: de 0 a 255. | Una cantidad pequeña cuyo rango esté acotado. |
| `u16` | Entero sin signo de 16 bits: de 0 a 65 535. | Un contador con un rango mayor. |
| `u64` | Entero sin signo de 64 bits. | Los importes enteros de estos ejemplos. |
| `i64` | Entero con signo de 64 bits. | Una variación que puede ser negativa. |
| `bool` | Uno de dos valores: `true` o `false`. | Indicar si la caja está abierta. |
| `char` | Un valor escalar Unicode, escrito entre comillas simples. | Una marca como `'A'`. |
| `String` | Texto del que el programa es propietario. | El nombre de un cliente. |

La u significa que el entero no admite valores negativos. El número indica cuántos bits utiliza; no es la cantidad máxima que puede guardar. Así, u8 puede representar 255, pero no 256.
Un bool utiliza true o false; escribir 1 no lo convierte automáticamente en verdadero. Del mismo modo, 50 y "50" son valores de tipos distintos: uno es un número y el otro es texto.

- ¿Qué cambia con mut?
Las variables son inmutables por defecto: no podemos reasignarles otro valor. Si necesitamos actualizar una, escribimos mut:

```rust
fn main() {
    let mut total: u64 = 0;

    total += 50;
    total += 35;

    println!("Total registrado: {}", total);
}
```

La salida es Total registrado: 85. La expresión total += 50 suma 50 al valor actual y guarda el resultado en la misma variable.
Si quitas mut, el compilador rechazará las actualizaciones. Si lo conservas, puedes cambiar el valor, pero debe seguir siendo compatible con el tipo u64.
 
### Funciones, parámetros y valores de retorno
Una función agrupa una operación a la que damos un nombre. Puede recibir datos mediante parámetros y producir un valor de retorno.
En el punto de venta podemos separar el cálculo de un importe en una función:

```rust
fn calcular_importe(precio: u64, cantidad: u64) -> u64 {
    precio * cantidad
}

fn main() {
    let importe = calcular_importe(50, 2);

    println!("Importe de la venta: {}", importe);
}
```

La salida es Importe de la venta: 100.
calcular_importe - es el nombre de la función.
precio: u64 y cantidad: u64 - declaran los parámetros y sus tipos.
-> u64 - indica el tipo del valor que devuelve.
precio * cantidad - calcula y devuelve el resultado.
Al llamar calcular_importe(50, 2), los valores 50 y 2 son los argumentos que entregamos a esos parámetros.
El punto y coma también cambia el significado
En Rust, la última expresión de un bloque puede ser su valor de retorno. Por eso precio * cantidad está escrito sin punto y coma.
Si escribimos precio * cantidad; como última línea, esa sentencia descarta el resultado y el bloque deja de devolver el u64 prometido. El compilador detecta la diferencia.
> [!NOTE]
> También existe return, que permite devolver un valor de forma explícita.

### Condiciones y recorridos sencillos
El flujo de control determina qué partes del código se ejecutan y en qué orden.
- Condiciones con if y else
Una condición permite elegir una acción según un valor booleano. Por ejemplo, podemos comprobar si un importe es mayor que cero:

```rust
fn main() {
    let monto: u64 = 50;

    if monto > 0 {
        println!("El monto es válido para continuar");
    } else {
        println!("El monto debe ser mayor que cero");
    }
}
```

Con monto = 50, se imprime el primer mensaje. Si lo cambias por 0, se ejecuta el bloque de else.
En monto > 0, la comparación produce un bool. Otras comparaciones frecuentes son == para igualdad, != para diferencia y >= para mayor o igual. Asignar con = y comparar con == son operaciones diferentes.
- Recorrer un arreglo con for
Un arreglo agrupa valores del mismo tipo y tiene una longitud fija. Podemos recorrerlo para procesar cada elemento:

```rust
fn main() {
    let montos: [u64; 3] = [50, 35, 75];
    let mut total: u64 = 0;

    for monto in montos {
        total += monto;
    }

    println!("Total de las ventas: {}", total);
}
```

La salida es Total de las ventas: 160.
[u64; 3] indica tres valores de tipo u64. En cada vuelta del for, monto representa el siguiente elemento: primero 50, después 35 y finalmente 75.

### struct: agrupar los datos de una venta
Un struct permite definir un tipo con varios campos relacionados.
Podemos representar una venta con el nombre del cliente y su importe:

```rust
struct Venta {
    cliente: String,
    monto: u64,
}

fn main() {
    let venta = Venta {
        cliente: String::from("Ana"),
        monto: 50,
    };

    println!("Cliente: {}", venta.cliente);
    println!("Monto: {}", venta.monto);
}
```

La salida es:

```rust
Cliente: Ana
Monto: 50
```

struct Venta define la forma del dato. Venta { ... } crea una instancia con valores concretos. El punto permite acceder a un campo, como venta.monto.
Observa también las dos apariciones de los dos puntos:
En la definición, monto: u64 relaciona el nombre del campo con su tipo.
Al crear la instancia, monto: 50 relaciona el nombre del campo con su valor.
- ¿Por qué utilizamos String::from?
"Ana" es un literal de texto de tipo &str. String::from("Ana") crea un String, que es el tipo declarado para el campo cliente. Ambos representan texto, pero sus tipos y su relación con la memoria son diferentes.
Si escribes cliente: "Ana" en este ejemplo, el compilador indicará que esperaba un String y recibió un &str.
Este struct es un ejemplo de Rust que vive durante la ejecución del programa.

### Ownership, préstamos y referencias
Rust utiliza ownership, o propiedad, para gestionar el ciclo de vida de los valores. Cada valor tiene un propietario. Cuando este sale de su alcance la parte del código donde está disponible, Rust libera los recursos que todavía le corresponden.
Esta propiedad se refiere a valores en memoria. Es un concepto distinto de la autoridad de una wallet o del programa propietario de una cuenta en Solana.
- Mover un valor
Con un String, una asignación puede transferir la propiedad:

```rust
fn main() {
    let cliente = String::from("Ana");
    let cliente_de_la_venta = cliente;

    println!("Cliente: {}", cliente_de_la_venta);
}
```

Después de la asignación, utilizamos cliente_de_la_venta. Si añadimos otra línea que intente imprimir cliente, el compilador la rechazará porque ese valor ya se movió.
Tipos sencillos como u64 y bool se copian en este tipo de asignación. Por eso, la transferencia que acabamos de observar con String no debe generalizarse a todos los valores.
- Prestar para leer o modificar
Una referencia permite acceder a un valor sin transferir su propiedad. A ese acceso lo llamamos borrowing, o préstamo.

| Forma | Cómo leerla |
|-------|-------------|
| `&T` | Referencia compartida a un valor de tipo `T`, para consultarlo. |
| `&mut T` | Referencia mutable a un valor de tipo `T`, para modificarlo. |

Veamos una referencia para leer una venta:

```rust
struct Venta {
    cliente: String,
    monto: u64,
}

fn mostrar_venta(venta: &Venta) {
    println!("Cliente: {} | Monto: {}", venta.cliente, venta.monto);
}

fn main() {
    let venta = Venta {
        cliente: String::from("Ana"),
        monto: 50,
    };

    mostrar_venta(&venta);
    println!("La venta sigue disponible: {}", venta.monto);
}
```

mostrar_venta recibe un préstamo de la venta. Cuando termina la llamada, seguimos utilizando la variable original.
Rust comprueba que los préstamos no generen accesos incompatibles: mientras se utiliza una referencia mutable a un valor, no se puede utilizar otra referencia a ese mismo valor. El compilador nos ayuda a cumplir esta regla.

Result y Option: expresar resultados y valores opcionales
Una operación puede terminar correctamente, encontrar un dato inválido o no encontrar un valor. Rust ofrece tipos para expresar estas situaciones de forma explícita.

### Result: éxito o error
Result<T, E> representa dos posibilidades:
Ok(valor): la operación tuvo éxito y devuelve un valor de tipo T.
Err(error): la operación falló y devuelve información de tipo E.
En Result<u64, String>, un éxito contiene un número u64 y un error contiene un mensaje String.

```rust
fn validar_monto(monto: u64) -> Result<u64, String> {
    if monto == 0 {
        return Err(String::from("El monto debe ser mayor que cero"));
    }

    Ok(monto)
}

fn main() {
    let resultado = validar_monto(50);

    match resultado {
        Ok(monto) => println!("Monto aceptado: {}", monto),
        Err(mensaje) => println!("No se puede continuar: {}", mensaje),
    }
}
```

La salida es Monto aceptado: 50. Si cambias el argumento por 0, verás No se puede continuar: El monto debe ser mayor que cero.
match permite actuar según la variante recibida. En este ejemplo atendemos las dos: éxito y error. El símbolo => separa cada caso de la acción que debe ejecutarse.
Un error de compilación impide ejecutar el programa. En cambio, este Err es una respuesta prevista por un programa que sí compiló: el dato recibido incumple una regla.

### Option: un valor puede estar presente o ausente
Option<T> expresa que podemos tener un valor de tipo T o no tenerlo:
Some(valor): el valor está presente.
None: el valor está ausente.
Por ejemplo, al consultar un registro podríamos encontrar un importe o no encontrarlo. Podemos representar ambos casos así:

```rust
fn main() {
    let monto_encontrado: Option<u64> = Some(50);

    match monto_encontrado {
        Some(monto) => println!("Monto encontrado: {}", monto),
        None => println!("No hay un monto disponible"),
    }
}
```

Si sustituyes Some(50) por None, se ejecuta el segundo caso. Estamos representando el resultado posible de una consulta; en este ejemplo todavía no implementamos la búsqueda.
La diferencia que debemos conservar es esta: Result distingue éxito y error; Option distingue presencia y ausencia. Un importe igual a cero sigue siendo un valor presente, por lo que Some(0) y None tampoco significan lo mismo.
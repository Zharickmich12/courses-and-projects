/* datos primitivos de JavaScript: Cadenas de texto ('string'), Números, Booleanos, undefined, Null y Symbol
    numeros: integers y float
    cadenas de texto: string
    booleanos: true o false
    undefined: variable declarada pero no inicializada
    null: variable declarada e inicializada con valor nulo
*/

// typeof operador devuelve el tipo de dato de una variable
console.log(typeof 'Asabeneh') // string
console.log(typeof 5) // número
console.log(typeof 
    true ) // boolean
console.log(typeof null) // tipo de objeto
console.log(typeof undefined) // undefined

/* Declaración de variables: var, let y const
    var: variable global o local en una función sin importar el bloque de código
    let: variable local en un bloque de código
    const: variable local en un bloque de código, no puede ser reasignada
*/

// Declarando diferentes variables de diferentes tipos de datos
let nombre = 'Asabeneh'
let apellido = 'Yetayeh'
let edad = 100
let estaCasado = true

console.log(nombre, apellido, pais, ciudad, edad, estaCasado)

// Tipos de datos

/* Tipos de datos primitivos: son tipos de datos inmutables (no modificables). Una vez que se crea un tipo de datos primitivo, no podemos modificarlo.
    -Números: enteros, flotantes
    -Cadenas: cualquier dato entre comillas simples, comillas dobles o comillas invertidas
    -Booleanos: valor verdadero o falso
    -Nulo: valor vacío o sin valor
    -Indefinido: una variable declarada sin un valor
*/

let word = "JavaScript";

/*  Tipos de datos que no son primitivos (referencias de objetos): son modificables o mutables. Podemos modificar el valor de los tipos de datos no primitivos después de su creación.
    -Objetos
    -Funciones
    -Matrices: Una matriz es una lista de valores de datos entre corchetes. Las matrices pueden contener tipos de datos iguales o diferentes. Los valores de matriz están referenciados por su índice. En el índice de matriz de JavaScript comienza en cero.            
*/

let nums = [1, 2, 3];
nums[0] = 10;

console.log(nums); // [10, 2, 3]

// Decalaracion de tipos de datos numericos
let años = 35;
const gravedad = 9.81; // usamos const para valores que no cambian, constante gravitacional en m/s2
let masa = 72; // masa en Kilogramo

// Más ejemplos
const boilingPoint = 100; // temperatura en oC, punto de ebullición del agua que es una constante
const bodyTemp = 37; // oC la temperatura corporal promedio del ser humano, que es una constante

console.log(edad, gravedad, masa, PI, boilingPoint, bodyTemp);

// Objeto matematico Math: contiene propiedades y métodos para constantes y funciones matemáticas. Math es un objeto incorporado en JavaScript. No es un objeto de función. No se puede crear una instancia de Math. Todas las propiedades y métodos de Math son estáticos.
const PI = Math.PI;

console.log(PI); // 3.141592653589793

// Redondeo al número más cercano
// si es superior a 0,5 hacia arriba si es inferior a 0,5 redondeo hacia abajo

console.log(Math.round(PI)); // 3 para redondear valores al número más cercano

console.log(Math.round(9.81)); // 10

console.log(Math.floor(PI)); // 3 redondeando hacia abajo

console.log(Math.ceil(PI)); // 4 redondeando hacia arriba

console.log(Math.min(-5, 3, 20, 4, 5, 10)); // -5, devuelve el valor mínimo

console.log(Math.max(-5, 3, 20, 4, 5, 10)); // 20, devuelve el valor máximo

const randNum = Math.random(); // crea un número aleatorio entre 0 y 0,999999
console.log(randNum);

// Vamos a crear un número aleatorio entre 0 y 10

const num = Math.floor(Math.random() * 11); // crea un número aleatorio entre 0 y 10
console.log(num);

//Valor absoluto
console.log(Math.abs(-10)); // 10

//Raíz cuadrada
console.log(Math.sqrt(100)); // 10

console.log(Math.sqrt(2)); // 1.4142135623730951

// Poder
console.log(Math.pow(3, 2)); // 9

console.log(Math.E); // 2.718

// Logaritmo
// Devuelve el logaritmo natural con base E de x, Math.log(x)
console.log(Math.log(2)); // 0.6931471805599453
console.log(Math.log(10)); // 2.302585092994046

// Devuelve el logaritmo natural de 2 y 10 respectivamente
console.log(Math.LN2); // 0.6931471805599453
console.log(Math.LN10); // 2.302585092994046

// Trigonometría
Math.sin(0);
Math.sin(60);

Math.cos(0);
Math.cos(60);

//Generador de numeros aleatorios: El objeto matemático de JavaScript tiene un generador de números de método random() que genera un número de 0 a 0.999999999...
let randomNum = Math.random(); // genera 0 a 0.999...

// Genera un número aleatorio entre 0 y 10
let numBtnZeroAndTen = randomNum * 11;

console.log(numBtnZeroAndTen); // esto da: min 0 y max 10.99

let randomNumRoundToFloor = Math.floor(numBtnZeroAndTen);
console.log(randomNumRoundToFloor); // esto da entre 0 y 10

/*
Las cadenas son textos, que están debajo de single , double, back-tick comillas. Para declarar una cadena, necesitamos un nombre de variable, un operador de asignación, un valor entre comillas simples, comillas dobles o comillas invertidas. 
*/
let espacio = " "; // una cadena de espacio vacío
let primerNombre = "Asabeneh";
let pais = "Finland";
let ciudad = "Helsinki";
let idioma = "JavaScript";
let trabajo = "teacher";
let cita = "The saying,'Seeing is Believing' is not correct in 2020.";
let quotConBackTick = `The saying,'Seeing is Believing' is not correct in 2020.`;

// Concatenación de acdenas: La conexión de dos o más cadenas entre sí se llama concatenación
// Concatenar usando el operador de suma (+)
let nombreCompleto = primerNombre + espacio + apellido;
// Cadenas literales largas: Si la longitud de la cadena es demasiado grande, no cabe en una línea. Podemos usar el carácter de barra invertida (\) al final de cada línea para indicar que la cadena continuará en la línea siguiente.
const parrafo =
  "Mi nombre es Asabeneh Yetayeh. Vivo en Finlandia, Helsinki.\
Soy profesora y me encanta enseñar. Enseño HTML, CSS, JavaScript, React, Redux, \
Node.js, Python, Data Analysis y D3.js para cualquier persona interesada en aprender. \
A fines de 2019, estaba pensando en expandir mi enseñanza y llegar a \
a la audiencia global y comencé un desafío de Python del 20 de noviembre al 19 de diciembre.\
Fue una de las experiencias más gratificantes e inspiradoras.\
Ahora, estamos en 2020. Disfruto preparando el desafío 30DaysOfJavaScript y \
Espero que tú también estés disfrutando.";

console.log(parrafo);

/* Secuancias de escape en cadenas 
    -\n: nueva linea
    -\t: Tabulador, significa 8 espacios
    -\\: barra invertida
    -\': Una frase (')
    -\": comillas dobles (")
*/
console.log(
  "Espero que todos estén disfrutando el desafío de 30 días de JavaScript.¿Y tú?"
); // salto de línea
console.log("Días\temasEjercicios");
console.log("Día 1\t3\t5");
console.log("Día 2\t3\t5");
console.log("Día 3\t3\t5");
console.log("Día 4\t3\t5");
console.log("Este es un símbolo de barra invertida (\\)"); // Para escribir una barra invertida
console.log(
  'En todos los lenguajes de programación comienza con "¡Hola, mundo!"'
);
console.log(
  "En todos los lenguajes de programación comienza con '¡Hola, mundo!'"
);
console.log("El dicho 'Ver para creer' no es correcto en 2022");

// Literales de plantilla: Para crear una plantilla de cadenas(cadenas de plantilla), usamos dos tildes de retroceso. Podemos inyectar datos como expresiones dentro de una cadena de plantilla. Para inyectar datos, encerramos la expresión con un corchete ({}) precedido por un signo $.
//Sintaxis
`Texto literal de cadena``Cadena de texto literal ${expresión}`;

console.log(`La suma de 2 y 3 es 5`); // escribiendo estáticamente los datos
let a = 2;
let b = 3;
console.log(`La suma de ${a} y ${b} es ${a + b}`); // inyectando los datos dinámicamente

// Metodos de cadena: Todo en JavaScript es un objeto. Una cadena es un tipo de datos primitivo, lo que significa que no podemos modificarla una vez que se crea. El objeto de cadena tiene muchos métodos de cadena.

// longitud: el método de cadena longitud devuelve el número de caracteres en una cadena incluido el espacio vacío.
let js = "JavaScript";
console.log(js.length); // 10
let Nombre = "Asabeneh";
console.log(Nombre.length); // 8

// Acceder a los caracteres de una cadena: Podemos acceder a cada carácter de una cadena usando su índice. En programación, el conteo comienza desde 0. El primer índice de la cadena es cero y el último índice es la longitud de la cadena menos uno.
let string = "JavaScript";
let firstLetter = string[0];

console.log(firstLetter); // J

let secondLetter = string[1]; // a
let thirdLetter = string[2];
let lastLetter = string[9];

console.log(lastLetter); // t

let lastIndex = string.length - 1;

console.log(lastIndex); // 9
console.log(string[lastIndex]); // t

// toUpperCase(): este método cambia la cadena a letras mayúsculas.
let string1 = "JavaScript";

console.log(string1.toUpperCase()); // JAVASCRIPT

// toLowerCase(): este método cambia la cadena a letras minúsculas.
let string2 = "JavasCript";

console.log(string2.toLowerCase()); // javascript

// substr(): Se necesitan dos argumentos, el índice inicial y el número de caracteres para dividir.
let string3 = "JavaScript";
console.log(string3.substr(4, 6)); // Script

let country3 = "Finland";
console.log(country3.substr(3, 4)); // land

// split(): El método split divide una cadena en un lugar específico.
let string4 = "30 Days Of JavaScript";

console.log(string4.split()); // Cambios en una matriz -> ["30 Days Of JavaScript"]
console.log(string4.split(" ")); // Dividir a una matriz en el espacio -> ["30", "Days", "Of", "JavaScript"]

let firstName = "Asabeneh";

console.log(firstName.split()); // Cambiar a una matriz - > ["Asabeneh"]
console.log(firstName.split("")); // Dividir en una matriz en cada letra ->  ["A", "s", "a", "b", "e", "n", "e", "h"]

let countries = "Finland, Sweden, Norway, Denmark, and Iceland";

console.log(countries.split(",")); // Dividir en cualquier matriz en coma -> ["Finland", " Sweden", " Norway", " Denmark", " and Iceland"]
console.log(countries.split(", ")); //  ["Finland", "Sweden", "Norway", "Denmark", "and Iceland"]

// trim(): Elimina el espacio final al principio o al final de una cadena.
let string5 = "   30 Days Of JavaScript   ";

console.log(string5);
console.log(string5.trim(" "));

// includes(): Toma un argumento de subcadena y verifica si existe un argumento de subcadena en la cadena. includes() devuelve un valor booleano. Si existe una subcadena en una cadena, devuelve verdadero; de lo contrario, devuelve falso.
let country1 = "Finland";

console.log(country1.includes("fin")); // falso
console.log(country1.includes("Fin")); // verdadero
console.log(country1.includes("land")); // verdadero
console.log(country1.includes("Land")); // falso

// replace(): toma como parámetro la subcadena antigua y una nueva subcadena.
string.replace(oldsubstring, newsubstring);
let string6 = "30 Days Of JavaScript";
console.log(string6.replace("JavaScript", "Python")); // 30 Days Of Python

// charAt(): Toma índice y devuelve el valor en ese índice
string.charAt(index);
let string7 = "30 Days Of JavaScript";
console.log(string7.charAt(0)); // 3

let lastIndex2 = string7.length - 1;
console.log(string7.charAt(lastIndex2)); // t

// charCodeAt(): Toma el índice y devuelve el código char (número ASCII) del valor en ese índice
string.charCodeAt(index);
let string8 = "30 Days Of JavaScript";
console.log(string8.charCodeAt(3)); // D ASCII numbero es 68

let lastIndex6 = string8.length - 1;
console.log(string8.charCodeAt(lastIndex6)); // t ASCII es 116

// indexOf(): Toma una subcadena y si la subcadena existe en una cadena, devuelve la primera posición de la subcadena; si no existe, devuelve -1
string.indexOf(substring);
let string9 = "30 Days Of JavaScript";

console.log(string9.indexOf("D")); // 3
console.log(string9.indexOf("Days")); // 3
console.log(string9.indexOf("days")); // -1
console.log(string9.indexOf("a")); // 4
console.log(string9.indexOf("JavaScript")); // 11
console.log(string9.indexOf("Script")); //15
console.log(string9.indexOf("script")); // -1

// lastIndexOf(): Toma una subcadena y si la subcadena existe en una cadena, devuelve la última posición de la subcadena; si no existe, devuelve -1
string.lastIndexOf(substring);
let string0 =
  "I love JavaScript. If you do not love JavaScript what else can you love.";

console.log(string0.lastIndexOf("love")); // 67
console.log(string0.lastIndexOf("you")); // 63
console.log(string0.lastIndexOf("JavaScript")); // 38

// concat(): toma muchas subcadenas y las une.
string.concat(substring, substring, substring);
let string11 = "30";
console.log(string11.concat("Days", "Of", "JavaScript")); // 30DaysOfJavaScript

let country = "Fin";
console.log(country.concat("land")); // Finland

// startsWith: toma una subcadena como argumento y verifica si la cadena comienza con esa subcadena especificada. Devuelve un valor booleano (verdadero o falso).
string.startsWith(substring);
let string12 = "Love is the best to in this world";

console.log(string12.startsWith("Love")); // verdadero
console.log(string12.startsWith("love")); // falso
console.log(string12.startsWith("world")); // falso

// endsWith: toma una subcadena como argumento y verifica si la cadena termina con esa subcadena especificada. Devuelve un valor booleano (verdadero o falso).
string.endsWith(substring);
let string13 = "Love is the most powerful feeling in the world";

console.log(string13.endsWith("world")); // verdadero
console.log(string13.endsWith("love")); // falso
console.log(string13.endsWith("in the world")); // verdadero

// search: toma una subcadena como argumento y devuelve el índice de la primera coincidencia. El valor de búsqueda puede ser una cadena o un patrón de expresión regular.
string.search(substring);
let string14 =
  "I love JavaScript. If you do not love JavaScript what else can you love.";
console.log(string14.search("love")); // 2
console.log(string14.search(/javascript/gi)); // 7

// match: toma una subcadena o un patrón de expresión regular como argumento y devuelve una matriz si hay una coincidencia; de lo contrario, devuelve un valor nulo. Veamos cómo se ve un patrón de expresión regular. Comienza con /signo y termina con /signo.
let string15 = "love";
let patternOne = /love/; // sin ninguna bandera
let patternTwo = /love/gi; // g-significa buscar en todo el texto, i - no distingue entre mayúsculas y minúsculas

// Coincidencia de sintaxis
string.match(substring);
let string16 = "I love JavaScript. If you do not love JavaScript what else can you love.";
console.log(string16.match("love"));

// repeat(): toma un número como argumento y devuelve la versión repetida de la cadena.
string.repeat(n);
let string17 = "love";
console.log(string17.repeat(10)); // lovelovelovelovelovelovelovelovelovelove

// Comprobación de tipos de datos y conversión: Para comprobar el tipo de datos de una determinada variable utilizamos el método typeof.
// Diferentes tipos de datos javascript
// Declaremos diferentes tipos de datos
let lastName = 'Yetayeh'   // cadena
console.log(typeof lastName)   // cadena

/* Cambio del tipo de datos: 
 Casting: Conversión de un tipo de datos a otro tipo de datos. Usamos parseInt(), parseFloat(), Number(), + sign, str() Cuando hacemos operaciones aritméticas, los números de cadena deben convertirse primero en enteros o flotantes; de lo contrario, devuelve un error.
*/
/* Cadena a Int: Podemos convertir el número de cadena en un número. Cualquier número dentro de una comilla es un número de cadena. Un ejemplo de un número de cadena: '10', '5', etc. Podemos convertir cadena a número usando los siguientes métodos:
    -parseInt()
    -parseFloat()
    -Number()
    -Signo más (+)
*/
let num1 = "10";
let numInt = parseInt(num1);
console.log(numInt); // 10

let num2 = "10";
let numInt1 = Number(num2);
console.log(numInt1); // 10

let num3 = "10";
let numInt2 = +num3;
console.log(numInt2); // 10

/* Cadena a Flotante
Podemos convertir un número flotante de cadena en un número flotante. Cualquier número flotante dentro de una comilla es un número flotante de cadena. Un ejemplo de un número flotante de cadena: '9.81', '3.14', '1.44', etc. Podemos convertir cadenas flotantes en números usando los siguientes métodos:
    -parseFloat()
    -Number()
    -Signo más (+)
*/
let num4 = "9.81";
let numFloat3 = parseFloat(num4);

console.log(numFloat3); // 9.81
let num5 = "9.81";
let numFloat4 = Number(num5);

console.log(numFloat4); // 9.81
let num6 = "9.81";
let numFloat5 = +num6;

console.log(numFloat5); // 9.81

// Flotante a Int: Podemos convertir números flotantes a enteros. Usamos el siguiente método para convertir float a int: parseInt()
let num7 = 9.81;
let numInt6 = parseInt(num7);
console.log(numInt6); // 9
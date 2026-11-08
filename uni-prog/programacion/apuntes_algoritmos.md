# Conceptos básicos de algoritmos

## Algoritmo

Conjunto de pasos lógicos y finitos que permiten, mediante un orden secuencial, resolver problemas del mundo real al mundo informático o computacional.

## Cómo funciona

Todo proceso algorítmico parte de solucionar problemas en computadoras que al final se utilizan para resolver diferentes dificultades de acuerdo con su planteamiento.

### Caso 1: carácter ingresado por teclado

Se tiene como dato de entrada el valor 65, cuya codificación binaria es 1000001 y que en la tabla de códigos ASCII corresponde a la letra "A" mayúscula.

| Entrada por teclado | Proceso binario (lo que reconoce la computadora) | Salida por pantalla |
|---|---|---|
| A | 1000001 | A |

### Caso 2: suma de dos números

Se quieren sumar dos números ingresados por pantalla: 25 y 30.

- 25 en binario es 11001.
- El símbolo "+" de la suma es 101011.
- 30 en binario es 11110.
- El resultado es 55, que internamente se representa en binario como 110111.

| Entrada por teclado | Proceso binario | Salida por pantalla |
|---|---|---|
| 25 y 30 | 11001, 101011, 11110 y 110111 | 55 |

Tanto en el caso 1 como en el caso 2 funcionan internamente procesos lógicos y matemáticos dentro de la computadora.

Este proceso interno es transparente para el usuario, porque lo realiza la unidad aritmética lógica que se encuentra en el procesador.

## Pseudocódigo

Son las instrucciones que se utilizan en el libro, muy similares al lenguaje común y que se asemejan al lenguaje utilizado en las computadoras.

## Prueba de escritorio

Consiste en asignar valores arbitrarios a las variables declaradas para realizar un seguimiento paso a paso y obtener los resultados de salida, de acuerdo con cada enunciado propuesto.

Se verifica dándole valores arbitrarios a las variables para comprobar si el resultado cumple con el enunciado de cada ejercicio.

## Características de los algoritmos

- Tiene un inicio.
- Tiene una estructura definida.
- Permite hacer cálculos matemáticos.
- Permite desarrollar la lógica matemática.
- Emite un resultado a un proceso.
- Tiene un final.

## Estructura general de un algoritmo

```
Inicio
    Declaración de variables o constantes con su tipo de dato.
    Mensaje al usuario para captura de datos.
    Lectura de variables declaradas.
    Proceso lógico matemático (basado en el problema planteado).
    Salida de resultado.
Fin
```

## Órdenes de entrada

Se utilizan para guardar la información introducida por los usuarios en posiciones de memoria declaradas llamadas variables.

Sintaxis: `leer <<nombre_variable>>`

## Órdenes de salida

Se utilizan para emitir en pantalla o impresora un mensaje, el resultado de alguna operación matemática, el valor almacenado en una variable o un mensaje al usuario final.

Sintaxis: `escribir "mensaje al usuario"`

## Variables

Se forman a través de un identificador o nombre asignado y almacenan valores que cambian durante el desarrollo del algoritmo. Tienen asociado un tipo de datos.

Los identificadores de variables no llevan espacios para nombrarlos.

Sintaxis: `Nombre_variable: tipo`

```
Edad: entero
Número, suma, resta : entero
Nombre, apellido, direcc : cadena
Nota1, nota2 : decimal
```

## Constantes

Se forman a través de un identificador o nombre asignado y almacenan valores que no cambian durante el desarrollo del algoritmo. Tienen asociado un tipo de datos.

Sintaxis: `Nombre_constante : tipo`

```
Edad = 18
Pi = 3,1415
```

## Errores de declaración de variables y constantes

Las variables no llevan espacios al ser declaradas, por lo tanto no se pueden declarar de la siguiente manera:

```
N ombre
d irecc
nota 1
nota 2
```

## Ejercicios con prueba de escritorio

### Enunciado 1

Dado dos números ingresados por un usuario, súmelos e imprimir su resultado.

```
Inicio
    N1, N2, Resp : entero
    Escribir "Digite un valor numérico:"
    Leer N1
    Escribir "Digite un segundo valor numérico:"
    Leer N2
    Resp = N1 + N2
    Escribir "el resultado de la suma de los números ingresados es:", Resp
Fin
```

Variables declaradas: N1, N2, Resp.

| N1 | N2 | Resp | Salida |
|---|---|---|---|
| 4 | 5 | 9 | El resultado de la suma de los números ingresados es: 9 |
| -3 | 6 | 3 | El resultado de la suma de los números ingresados es: 3 |
| 7 | 10 | 17 | El resultado de la suma de los números ingresados es: 17 |
| -5 | -5 | -10 | El resultado de la suma de los números ingresados es: -10 |
| 9 | 9 | 18 | El resultado de la suma de los números ingresados es: 18 |

### Enunciado 2

Desarrolle un algoritmo que solicite un número e imprimir el número ingresado.

```
Inicio
    Número: entero
    Escribir "Digite un número:"
    Leer Número
    Escribir "El número que usted digito es:", Número
Fin
```

Variable declarada: Número.

| Entrada | Salida |
|---|---|
| 36 | El número que usted digito es: 36 |
| 42 | El número que usted digito es: 42 |
| 3 | El número que usted digito es: 3 |
| -1 | El número que usted digito es: -1 |

### Enunciado 3

Desarrolle un algoritmo que solicite el valor de un producto a comprar y la cantidad comprada, halle e imprima el valor total a pagar por el cliente.

```
Inicio
    vlp, cantc, vlpagar : entero
    Escribir "Cuál es el valor del producto comprado:"
    Leer vlp
    Escribir "qué cantidad desea comprar:"
    Leer cantc
    vlpagar = vlp * cantc
    escribir "el valor total a pagar es:", vlpagar
Fin
```

Variables declaradas: vlp, cantc, vlpagar.

| vlp | cantc | vlpagar | Salida |
|---|---|---|---|
| $3000 | 3 | $9000 | El valor total a pagar es: $9000 |
| $1000 | 4 | $4000 | El valor total a pagar es: $4000 |
| $10 | 100 | $1000 | El valor total a pagar es: $1000 |
| $15000 | 2 | $30000 | El valor total a pagar es: $30000 |
| $5 | 20 | $100 | El valor total a pagar es: $100 |
| $350 | 3 | $1050 | El valor total a pagar es: $1050 |

### Enunciado 4

Desarrolle un algoritmo para hallar el área de un triángulo dada su base y altura.

```
Inicio
    b, h, a : decimal
    escribir "Digite la base:"
    leer b
    escribir "Digite la altura:"
    leer h
    a = (b * h)/2
    escribir "el área hallada es:"; a
Fin
```

Variables declaradas: b, h, a.

| b | h | a = (b*h)/2 | Salida |
|---|---|---|---|
| 12 | 3 | 18 | El área hallada es: 18 |
| 3 | 5 | 7,5 | El área hallada es: 7,5 |
| 2 | 6 | 6 | El área hallada es: 6 |
| 4 | 8 | 16 | El área hallada es: 16 |
| 21 | 4 | 42 | El área hallada es: 42 |

Es muy importante tener en cuenta la procedencia o el orden de los paréntesis dentro de una expresión matemática.

En este ejercicio se aplica primero la multiplicación y luego la división, que se guarda en la variable a.

### Enunciado 5

Desarrolle un algoritmo para hallar el área de una circunferencia dado su radio.

```
Inicio
    a, r, pi : decimal
    pi = 3,1415
    escribir "Digite el valor del radio:"
    leer r
    a = (pi * (r ^2))
    escribir "el área es:", a
Fin
```

Variables declaradas: a, r. Constante declarada: pi.

| r | pi | a | Salida |
|---|---|---|---|
| 3 | 3,14159 | 28,27 | El área es: 28,27 |
| 2 | 3,14159 | 12,56 | El área es: 12,56 |
| 4 | 3,14159 | 50,26 | El área es: 50,26 |

### Enunciado 6

Desarrolle un algoritmo que solicite un día de la semana e imprimir.

```
Inicio
    día : cadena
    escribir "Digite el nombre de un día de la semana:"
    leer día
    escribir "el día que usted digito fue:", dia
Fin
```

Variable declarada: día.

| Día | Salida |
|---|---|
| Martes | El día que usted digito fue: martes |
| Jueves | El día que usted digito fue: jueves |
| Sábado | El día que usted digito fue: sábado |
| Lunes | El día que usted digito fue: lunes |
| Viernes | El día que usted digito fue: viernes |
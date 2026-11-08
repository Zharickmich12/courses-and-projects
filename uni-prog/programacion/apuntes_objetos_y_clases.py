# OBJETOS Y CLASES
# La aproximación a la programación más popular y exitosa de los últimos tiempos es la llamada "Programación Orientada a Objetos" (POO o, en inglés, OOP).
# Un objeto es una estructura de datos compleja y flexible, que permite almacenar tanto información como la forma de operar con ella.
# Los objetos se definen mediante una plantilla llamada "Clase".
# Decimos que un objeto pertenece a una clase determinada cuando se ha creado (instanciado) a partir de ella.
# En esa clase podemos definir variables que pertenecerán al objeto (llamadas propiedades o atributos) y funciones que usaremos para trabajar con él (llamadas métodos).
# Dos objetos que pertenezcan a la misma clase (es decir, que hayan sido instanciados a partir de ella) tendrán los mismos atributos, pero los valores de estos no tienen porqué ser los mismos.
# Una clase se define mediante la palabra reservada class seguida del nombre de la clase y dos puntos:

class Producto:
    """ Ejemplo de clase con la cantidad y el precio de un producto"""

    def __init__(self, producto, precio, unidades):
        self.producto = producto
        self.precio = precio
        self.unidades = unidades

    def costo_total(self):
        costo = self.precio * self.unidades
        return costo

mi_objeto_producto = Producto("corbata", 35, 67)

print(mi_objeto_producto.producto)
print(mi_objeto_producto.precio)
print(mi_objeto_producto.unidades)

print(mi_objeto_producto.costo_total())

# Salida del programa:
# 35
# 67
# 2345

# En este ejemplo, se define la clase Producto y, dentro de ella, dos métodos llamados __init__ y costo_total.
# Los métodos se definen exactamente igual que las funciones, con la salvedad de que su primer parámetro debe ser siempre self.
# Como veremos más adelante, self es un nombre que se refiere siempre al propio objeto.
# De este modo "self.producto" quiere decir "la propiedad producto de este mismo objeto".
# El valor del parámetro self es asignado automáticamente, por lo que no es necesario indicar ese argumento al llamar al método.
# Por eso, como se ve en el método costo_total del ejemplo, si un método tiene un solo parámetro (que, necesariamente, debe ser self), no será necesario indicar ninguno al llamarlo.
# El método __init__ es un método especial, también llamado "constructor".
# Se ejecuta siempre al instanciar una clase, y es al que se pasan los argumentos al crear nuestro objeto.
# Comienza y termina con dos guiones bajos por convención.

# NOTA: al definir un método, el primer parámetro debe ser siempre self pero, a la hora de llamar al método, no es necesario pasárselo.

# El método __init__ de nuestro ejemplo inicia tres propiedades (o atributos) que son producto, precio y unidades.
# Todas ellas van precedidas de la palabra this seguida de un punto para indicar que son propiedades del objeto y no variables privadas del propio método.
# El método costo_total simplemente retorna el resultado de multiplicar el precio por las unidades.
# Para instanciar un objeto de una clase, solo hay que asignarlo como se ve en el ejemplo, pasándole los valores necesarios como si fuese una función.
# Una vez instanciado un objeto, para acceder a sus atributos y métodos, solo hay que hacerlo de la forma nombre_objeto.atributo o nombre_objeto.método(), en un caso particular de espacios de nombres.
# Naturalmente, un objeto puede tener cuantos atributos y métodos sean necesarios.
# Los métodos pueden usarse para asignar o cambiar el valor de los atributos, retornar valores, ejecutar acciones, y, en general, para cualquier cosa que pueda hacer una función.

# NOTA: aunque se puede modificar el valor de un atributo accediendo directamente como nombre_objeto.atributo, normalmente es recomendable crear un método para hacerlo.

# En el siguiente ejemplo, un poco más complejo, podemos ver como se crean dos instancias de la clase Producto (mi_producto1 y mi_producto2), cada una con sus valores, y cómo se puede acceder a sus atributos (producto, precio y unidades) y métodos (__costo_total(), nuevo_precio(), agrega(), saca() e informe()).

class Producto:
    """ Ejemplo de clase con la cantidad y el precio de un producto"""

    def __init__(self, producto, precio, unidades):
        self.producto = producto
        self.precio = precio
        self.unidades = unidades

    def __costo_total(self):
        costo = self.precio * self.unidades
        return costo

    def nuevo_precio(self, precio):
        self.precio = precio

    def agrega(self, cantidad):
        self.unidades = self.unidades + cantidad

    def saca(self, cantidad):
        if cantidad <= self.unidades:
            self.unidades = self.unidades - cantidad
        else:
            print("No hay suficientes")

    def informe(self):
        print("Producto: " + self.producto)
        print("Precio: " + str(self.precio))
        print("Unidades: " + str(self.unidades))
        print("Precio Total: " + str(self.__costo_total()))

mi_producto1 = Producto("Pantalón", 100, 6)

mi_producto2 = Producto("Camiseta", 50, 5)

print(mi_producto1.precio)

print(mi_producto2.unidades)

mi_producto2.agrega(5)

print(mi_producto2.unidades)

mi_producto2.informe()

# Salida del programa:
# 100
# 5
# 10
# Producto: Camiseta
# Precio: 50
# Unidades: 10
# Precio Total: 500

# En este ejemplo, el nombre del método __costo_total() comienza con dos guiones bajos.
# Esto hace que ese método sea privado, y no pueda ser accedido desde el exterior.
# Si en ese ejemplo intentamos hacer algo como print mi_producto2.__costo_total() Python nos retornará un error.
# Todos los métodos que comiencen con dos guiones bajos (y que no terminen con dos guiones bajos) son considerados como privados, y no pueden ser accedidos desde fuera del propio objeto.

# NOTA: en realidad, los métodos que comienzan por dos guiones bajos pueden ser accedidos anteponiéndoles un guión bajo y el nombre de la clase, del modo mi_producto2._Producto__costo_total().
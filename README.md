# Backend para Prueba Técnica - Wompi

Este repositorio contiene el código fuente del backend para la prueba técnica de Wompi, desarrollado con NestJS, TypeScript y Docker. La API gestiona productos y procesa transacciones de pago a través de la pasarela Wompi.

## 📜 Tabla de Contenidos

* [Características Principales](#-características-principales)
* [Tecnologías Utilizadas](#-tecnologías-utilizadas)
* [Requisitos Previos](#-requisitos-previos)
* [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
* [Uso de la API (Endpoints)](#-uso-de-la-api-endpoints)
* [Pruebas](#-pruebas)
* [Notas Adicionales](#-notas-adicionales)
* [Posibles Mejoras a Futuro](#-posibles-mejoras-a-futuro)
* [Despliegue](#-despliegue)
* [Autor](#️-autor)

## ✨ Características Principales

* **Integración con Pasarela de Pagos:** Conexión completa con la API de Wompi para procesar compras de forma segura.
* **Consulta de Productos:** Endpoint para obtener la lista de productos disponibles con su stock actual.
* **Gestión de Transacciones de Extremo a Extremo:** Un único endpoint (`POST /transactions`) orquesta toda la lógica de negocio:
    * Validación de productos y stock.
    * Creación o actualización de clientes.
    * Tokenización segura de tarjetas de crédito.
    * Confirmación del estado del pago y actualización de la base de datos.

## 💻 Tecnologías Utilizadas

* **Framework:** NestJS
* **Lenguaje:** TypeScript
* **Base de Datos:** PostgreSQL
* **ORM:** TypeORM
* **Contenerización:** Docker
* **Pruebas:** Jest
* **Pasarela de Pagos:** Wompi

## 📋 Requisitos Previos

* Node.js (v20.x o superior)
* NPM o Yarn
* Docker (para el despliegue en Render)
* Una instancia de PostgreSQL corriendo localmente (para pruebas locales sin Docker)
* Un cliente de base de datos como DBeaver o pgAdmin (opcional)

## 🚀 Instalación y Puesta en Marcha (Local con Node.js)

Sigue estos pasos para levantar el proyecto en tu entorno local. Este método asume que tienes una base de datos PostgreSQL accesible desde tu máquina.

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/JevDev2304/backend.git](https://github.com/JevDev2304/backend.git)
    cd backend
    ```

2.  **Configura las variables de entorno:**
    Copia el archivo `.env.example` y renómbralo a `.env`. Luego, rellena las variables apuntando a tu base de datos local.
    ```bash
    cp .env.example .env
    ```
    Tu archivo `.env` debería lucir así:
    ```env
    # Base de Datos (Apunta a tu instancia local)
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=tu_usuario_de_db
    DB_PASSWORD=tu_contraseña_de_db
    DB_NAME=nombre_de_tu_db

    # WOMPI API Keys (Usa tus llaves de sandbox)
    WOMPI_API_URL=[https://api-sandbox.co.uat.wompi.dev/v1](https://api-sandbox.co.uat.wompi.dev/v1)
    WOMPI_PUBLIC_KEY=pub_stagtest_...
    WOMPI_PRIVATE_KEY=prv_stagtest_...
    WOMPI_INTEGRATE_KEY=stagtest_integrity_...
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Ejecuta la aplicación:**
    Este comando iniciará el servidor en modo de desarrollo con recarga automática.
    ```bash
    npm run start:dev
    ```
    La aplicación estará corriendo en `http://localhost:3000`.

## 📄 Uso de la API (Endpoints)

La API está completamente documentada con Swagger. Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva para ver y probar todos los endpoints:

[**http://localhost:3000/docs**](http://localhost:3000/docs)

## 🧪 Pruebas

El proyecto cuenta con una suite de pruebas unitarias y de integración para garantizar la calidad del código.

* **Para correr todas las pruebas:**
    ```bash
    npm test
    ```
* **Para generar el reporte de cobertura:**
    ```bash
    npm run test:coverage
    ```

## 📝 Notas Adicionales

* El proyecto alcanza una **cobertura de pruebas del 83%** en el backend, asegurando la fiabilidad de la lógica de negocio.
* No se implementaron pruebas en el frontend debido a limitaciones de tiempo significativas, incluyendo compromisos laborales de tiempo completo durante la semana y un viaje internacional (Barcelona-Medellín) durante el fin de semana. Por este motivo, el enfoque se centró en garantizar la máxima calidad y robustez en el backend, que es mi área de especialización.

## 🚀 Posibles Mejoras a Futuro

Para futuras iteraciones, se podrían implementar las siguientes mejoras para aumentar la seguridad, escalabilidad y mantenibilidad del proyecto:

* **Autenticación Robusta:** Implementar un sistema de autenticación de usuarios utilizando **JSON Web Tokens (JWT)** con un mecanismo de **Refresh Tokens**. Esto permitiría gestionar sesiones de usuario de forma segura, proteger rutas y asociar transacciones a usuarios registrados.
* **Arquitectura Orientada a Servicios:** Refactorizar la estructura actual separando las responsabilidades principales (Usuarios, Productos, Transacciones) en **módulos o APIs independientes**. Esto mejoraría la reutilización del código en futuras integraciones, facilitaría el escalado individual de los servicios y simplificaría el mantenimiento a largo plazo.

## ☁️ Despliegue

El backend de esta aplicación fue desplegado en **Render** utilizando **Docker** para la contenerización, lo cual facilita un entorno de producción consistente y escalable. La base de datos también está alojada en Render.

* **URL de la API en producción:** [https://backend-2cko.onrender.com](https://backend-2cko.onrender.com)

## ✍️ Autor

**Juan Esteban Valdés Ospina**

* **LinkedIn:** [linkedin.com/in/juanesvaldesospina](https://www.linkedin.com/in/juanesvaldesospina/)
* **GitHub:** [github.com/jevdev2304](https://github.com/jevdev2304)

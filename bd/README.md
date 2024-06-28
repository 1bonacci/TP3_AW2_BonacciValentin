# Crear contenedor

Crear contenedor de BD con postgresSQL

## Uso de Dockerfile

Crear la imagen con una Dockerfile

```dockerfile
docker build -t nombre_imagen .
```

## Correr un contenedor

El contenedor está basado en la imagen creada arriba

```dockerfile
docker run --name nombre_contenedor -e POSTGRES_USER=root -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=tienda -p 5432:5432 -d nombre_imagen
```